import axios from 'axios';
import { tokenManager, authAPI } from './authService.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sandybrown-squirrel-472536.hostingersite.com/backend/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Get current token
    let token = tokenManager.getToken();
    
    // Check if token needs refresh
    if (token && tokenManager.isTokenExpired(token)) {
      try {
        await authAPI.refreshToken();
        token = tokenManager.getToken();
      } catch (error) {
        tokenManager.clearTokens();
        // Redirect to login if refresh fails
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    // Add auth token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Handle unauthorized access
      tokenManager.clearTokens();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
