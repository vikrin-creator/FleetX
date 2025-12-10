const API_BASE_URL = 'https://sandybrown-squirrel-472536.hostingersite.com/backend/api';

export const authAPI = {
  register: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth.php?action=register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
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
    
    return response.json();
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
    
    return response.json();
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
  }
};
