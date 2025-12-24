import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/authService';

const TestJWT = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await authAPI.getProfile();
      if (response.success) {
        setProfile(response.profile);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const testTokenRefresh = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await authAPI.refreshToken();
      if (response.success) {
        alert('Token refreshed successfully!');
      }
    } catch (err) {
      setError(err.message || 'Failed to refresh token');
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await authAPI.verifyToken();
      if (response.success) {
        alert('Token is valid!');
      }
    } catch (err) {
      setError(err.message || 'Token verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">JWT Authentication Test</h1>
      
      {/* Authentication Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Status: </span>
            <span className={`px-2 py-1 rounded text-sm ${
              isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </span>
          </div>
          <div>
            <span className="font-medium">User Email: </span>
            <span className="text-gray-700">{user?.email || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">JWT Test Functions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={fetchProfile}
            disabled={loading || !isAuthenticated}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Fetch Profile
          </button>
          
          <button
            onClick={testTokenRefresh}
            disabled={loading || !isAuthenticated}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Test Token Refresh
          </button>
          
          <button
            onClick={verifyToken}
            disabled={loading || !isAuthenticated}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Verify Token
          </button>
          
          <button
            onClick={logout}
            disabled={loading || !isAuthenticated}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Logout
          </button>
        </div>
        
        {loading && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 transition ease-in-out duration-150">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {/* Profile Data */}
      {profile && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Data</h2>
          <div className="bg-gray-50 p-4 rounded">
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      {/* Token Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Token Information</h2>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Access Token Present: </span>
            <span>{localStorage.getItem('fleetx_token') ? 'Yes' : 'No'}</span>
          </div>
          <div>
            <span className="font-medium">Refresh Token Present: </span>
            <span>{localStorage.getItem('fleetx_refresh_token') ? 'Yes' : 'No'}</span>
          </div>
          {localStorage.getItem('fleetx_token') && (
            <div className="mt-4">
              <span className="font-medium">Token Payload:</span>
              <div className="bg-gray-50 p-3 rounded mt-2 overflow-x-auto">
                <pre className="text-xs">
                  {(() => {
                    try {
                      const token = localStorage.getItem('fleetx_token');
                      const payload = JSON.parse(atob(token.split('.')[1]));
                      return JSON.stringify(payload, null, 2);
                    } catch (e) {
                      return 'Invalid token format';
                    }
                  })()}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestJWT;