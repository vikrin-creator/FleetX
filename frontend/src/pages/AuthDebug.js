import React, { useEffect, useState } from 'react';
import { tokenManager } from '../services/authService';

const AuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const updateDebugInfo = () => {
      const token = tokenManager.getToken();
      const refreshToken = tokenManager.getRefreshToken();
      
      let tokenPayload = null;
      let tokenExpiry = null;
      
      if (token) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            tokenPayload = JSON.parse(atob(parts[1]));
            tokenExpiry = tokenPayload.exp ? new Date(tokenPayload.exp * 1000).toLocaleString() : 'No expiration';
          }
        } catch (e) {
        }
      }
      
      setDebugInfo({
        hasToken: !!token,
        hasRefreshToken: !!refreshToken,
        tokenLength: token ? token.length : 0,
        isTokenExpired: token ? tokenManager.isTokenExpired(token) : 'N/A',
        isAuthenticated: tokenManager.isAuthenticated(),
        tokenExpiry,
        tokenPayload,
        localStorageKeys: Object.keys(localStorage),
        tokenFromLS: localStorage.getItem('fleetx_token') ? 'EXISTS' : 'NULL',
        refreshTokenFromLS: localStorage.getItem('fleetx_refresh_token') ? 'EXISTS' : 'NULL',
        timestamp: new Date().toLocaleString()
      });
    };

    updateDebugInfo();
    
    // Update every second to see changes
    const interval = setInterval(updateDebugInfo, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug Info</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Token Status</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Has Token:</strong> {debugInfo.hasToken ? '✅ YES' : '❌ NO'}</div>
          <div><strong>Has Refresh Token:</strong> {debugInfo.hasRefreshToken ? '✅ YES' : '❌ NO'}</div>
          <div><strong>Is Authenticated:</strong> {debugInfo.isAuthenticated ? '✅ YES' : '❌ NO'}</div>
          <div><strong>Is Token Expired:</strong> {debugInfo.isTokenExpired === true ? '❌ YES' : debugInfo.isTokenExpired === false ? '✅ NO' : 'N/A'}</div>
          <div><strong>Token Length:</strong> {debugInfo.tokenLength}</div>
          <div><strong>Token Expiry:</strong> {debugInfo.tokenExpiry || 'N/A'}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">LocalStorage Debug</h2>
        <div className="text-sm">
          <div><strong>Token in LS:</strong> {debugInfo.tokenFromLS}</div>
          <div><strong>Refresh Token in LS:</strong> {debugInfo.refreshTokenFromLS}</div>
          <div><strong>All LS Keys:</strong> {debugInfo.localStorageKeys?.join(', ')}</div>
        </div>
      </div>

      {debugInfo.tokenPayload && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Token Payload</h2>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
            {JSON.stringify(debugInfo.tokenPayload, null, 2)}
          </pre>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Actions</h2>
        <div className="space-x-4">
          <button 
            onClick={() => {
              tokenManager.clearTokens();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Tokens
          </button>
          
          <button 
            onClick={() => {
              const mockToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE2MzUxNzU0NTAsImV4cCI6OTk5OTk5OTk5OX0.test';
              tokenManager.setTokens(mockToken, 'refresh_test');
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Set Mock Token
          </button>

          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Last updated: {debugInfo.timestamp}
      </div>
    </div>
  );
};

export default AuthDebug;