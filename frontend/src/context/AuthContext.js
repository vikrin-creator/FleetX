import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, tokenManager } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initialize authentication state from localStorage immediately
  const [user, setUser] = useState(() => {
    const token = tokenManager.getToken();
    if (token && !tokenManager.isTokenExpired(token)) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          id: payload.user_id,
          email: payload.email
        };
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  
  const [loading, setLoading] = useState(true);
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = tokenManager.getToken();
    const authenticated = token && !tokenManager.isTokenExpired(token);
    return authenticated;
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // Check if we have a valid token
      const token = tokenManager.getToken();
      
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return; // Don't clear tokens here - they're already null
      }

      if (tokenManager.isTokenExpired(token)) {
        setIsAuthenticated(false);
        setUser(null);
        tokenManager.clearTokens();
        return;
      }

      // If we already have user data and are authenticated, skip
      if (isAuthenticated && user) {
        setLoading(false);
        return;
      }

      // Decode token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAuthenticated(true);
        setUser({
          id: payload.user_id,
          email: payload.email
        });
      } catch (tokenError) {
        tokenManager.clearTokens();
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      // Don't clear tokens on general errors - just log and continue
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
        return response;
      }
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const register = async (email, password, fullName, phone) => {
    try {
      const response = await authAPI.register(email, password, fullName, phone);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (email, otpCode) => {
    try {
      const response = await authAPI.verifyOTP(email, otpCode);
      if (response.success && response.token) {
        setIsAuthenticated(true);
        setUser(response.user);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const refreshToken = async () => {
    try {
      await authAPI.refreshToken();
      return true;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    verifyOTP,
    logout,
    refreshToken,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};