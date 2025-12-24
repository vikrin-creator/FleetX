const API_BASE_URL = 'https://sandybrown-squirrel-472536.hostingersite.com/backend/api';

// Token management utilities
const TOKEN_KEY = 'fleetx_token';
const REFRESH_TOKEN_KEY = 'fleetx_refresh_token';

export const tokenManager = {
  setTokens: (token, refreshToken) => {
    localStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  getToken: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token;
  },

  getRefreshToken: () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    return refreshToken;
  },

  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  isTokenExpired: (token) => {
    if (!token) {
      return true;
    }
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return true;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      if (!payload.exp) {
        return false;
      }
      
      const isExpired = (payload.exp * 1000) < (Date.now() + 60000);
      return isExpired;
    } catch (error) {
      return true;
    }
  },

  isAuthenticated: () => {
    const token = tokenManager.getToken();
    const authenticated = token && !tokenManager.isTokenExpired(token);
    return authenticated;
  }
};

// Authenticated fetch wrapper
export const authenticatedFetch = async (url, options = {}) => {
  let token = tokenManager.getToken();
  
  // Check if token needs refresh
  if (token && tokenManager.isTokenExpired(token)) {
    try {
      await authAPI.refreshToken();
      token = tokenManager.getToken();
    } catch (error) {
      console.warn('Token refresh failed:', error);
      // Don't automatically redirect - let the component handle it
      // tokenManager.clearTokens();
      // window.location.href = '/login';
      // Just proceed with the existing token
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

export const authAPI = {
  register: async (email, password, fullName, phone) => {
    const response = await fetch(`${API_BASE_URL}/auth.php?action=register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, fullName, phone })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to register' }));
      throw new Error(errorData.message || 'Registration failed');
    }
    
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth.php?action=login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to login' }));
      throw new Error(errorData.message || 'Login failed');
    }
    
    const data = await response.json();
    
    // Store tokens if login successful - tokens are nested in data.data
    const tokenData = data.data || data; // Handle both nested and flat response structures
    if (data.success && tokenData.token) {
      tokenManager.setTokens(tokenData.token, tokenData.refresh_token);
    }
    
    // Return the nested data structure for compatibility
    return {
      success: data.success,
      message: tokenData.message || data.message,
      token: tokenData.token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      user: tokenData.user,
      requiresOTP: tokenData.requiresOTP
    };
  },

  verifyOTP: async (email, otp_code) => {
    const response = await fetch(`${API_BASE_URL}/auth.php?action=verify_otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp_code })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to verify OTP' }));
      throw new Error(errorData.message || 'Verification failed');
    }
    
    const data = await response.json();
    
    // Store tokens if verification successful
    if (data.success && data.token) {
      tokenManager.setTokens(data.token, data.refresh_token);
    }
    
    return data;
  },

  resendOTP: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth.php?action=resend_otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to resend OTP' }));
      throw new Error(errorData.message || 'Resend failed');
    }
    
    return response.json();
  },

  refreshToken: async () => {
    const refreshToken = tokenManager.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth.php?action=refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to refresh token' }));
      throw new Error(errorData.message || 'Token refresh failed');
    }
    
    const data = await response.json();
    
    if (data.success && data.token) {
      tokenManager.setTokens(data.token, refreshToken);
    }
    
    return data;
  },

  logout: async () => {
    try {
      // Call server logout endpoint (optional for JWT)
      await fetch(`${API_BASE_URL}/auth.php?action=logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenManager.getToken()}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear tokens locally
      tokenManager.clearTokens();
    }
  },

  verifyToken: async () => {
    const token = tokenManager.getToken();
    
    if (!token) {
      throw new Error('No token available');
    }

    const response = await authenticatedFetch(`${API_BASE_URL}/auth.php?action=verify_token`, {
      method: 'GET'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Token verification failed' }));
      throw new Error(errorData.message || 'Token verification failed');
    }
    
    return response.json();
  },

  getProfile: async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/auth.php?action=profile`, {
      method: 'GET'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch profile' }));
      throw new Error(errorData.message || 'Profile fetch failed');
    }
    
    return response.json();
  }
};
