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
    return response.json();
  }
};
