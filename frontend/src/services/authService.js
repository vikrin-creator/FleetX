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
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  isTokenExpired: (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  },

  isAuthenticated: () => {
    const token = tokenManager.getToken();
    return token && !tokenManager.isTokenExpired(token);
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
      tokenManager.clearTokens();
      window.location.href = '/login';
      throw new Error('Session expired');
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
    
    // Store tokens if login successful
    if (data.success && data.token) {
      tokenManager.setTokens(data.token, data.refresh_token);
    }
    
    return data;
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
