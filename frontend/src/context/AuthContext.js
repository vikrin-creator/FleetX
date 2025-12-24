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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      if (!tokenManager.isAuthenticated()) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Verify token with server
      const response = await authAPI.verifyToken();
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
      } else {
        // Token is invalid
        tokenManager.clearTokens();
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      tokenManager.clearTokens();
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
      console.error('Logout error:', error);
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