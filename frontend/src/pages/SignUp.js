import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/authService.js';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      return setError('Please fill in all fields');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      const result = await authAPI.register(email, password);
      
      if (result.success) {
        setShowOTPModal(true);
        setLoading(false);
      } else {
        setError(result.message || 'Registration failed');
        setLoading(false);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setError('');
      setOtpLoading(true);
      const result = await authAPI.verifyOTP(email, otpCode);
      
      if (result.success) {
        alert('Email verified successfully! You can now log in.');
        navigate('/login');
      } else {
        setError(result.message || 'Invalid OTP');
        setOtpLoading(false);
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('Verification failed. Please try again.');
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setError('');
      const result = await authAPI.resendOTP(email);
      if (result.success) {
        alert('A new code has been sent to your email');
      } else {
        setError(result.message || 'Failed to resend code');
      }
    } catch (err) {
      setError('Failed to resend code');
    }
  };

  return React.createElement(
    'div',
    { className: 'min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8' },
    React.createElement(
      'div',
      { className: 'max-w-md w-full space-y-8' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'mt-6 text-center text-2xl sm:text-3xl font-bold text-gray-900' }, 'Create your account'),
        React.createElement(
          'p',
          { className: 'mt-2 text-center text-sm text-gray-600' },
          'Already have an account? ',
          React.createElement(Link, { to: '/login', className: 'font-medium text-blue-600 hover:text-blue-500' }, 'Sign in')
        )
      ),
      React.createElement(
        'form',
        { className: 'mt-8 space-y-6', onSubmit: handleSubmit },
        error && React.createElement(
          'div',
          { className: 'bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm' },
          React.createElement('span', { className: 'block sm:inline' }, error)
        ),
        React.createElement(
          'div',
          { className: 'rounded-md shadow-sm space-y-4' },
          React.createElement(
            'div',
            null,
            React.createElement('label', { htmlFor: 'email', className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Email address'),
            React.createElement('input', {
              id: 'email',
              type: 'email',
              required: true,
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: 'appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
              placeholder: 'Enter your email'
            })
          ),
          React.createElement(
            'div',
            null,
            React.createElement('label', { htmlFor: 'password', className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Password'),
            React.createElement('input', {
              id: 'password',
              type: 'password',
              required: true,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              className: 'appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
              placeholder: 'Create a password (min 6 characters)'
            })
          ),
          React.createElement(
            'div',
            null,
            React.createElement('label', { htmlFor: 'confirm-password', className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Confirm Password'),
            React.createElement('input', {
              id: 'confirm-password',
              type: 'password',
              required: true,
              value: confirmPassword,
              onChange: (e) => setConfirmPassword(e.target.value),
              className: 'appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
              placeholder: 'Re-enter your password'
            })
          )
        ),
        React.createElement(
          'button',
          {
            type: 'submit',
            disabled: loading,
            className: 'w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
          },
          loading ? 'Creating account...' : 'Sign up'
        ),
        React.createElement(
          'div',
          { className: 'text-xs text-gray-500 text-center' },
          'By signing up, you agree to receive a verification email.'
        ),
        React.createElement(
          'div',
          { className: 'text-sm text-center' },
          React.createElement(Link, { to: '/', className: 'text-gray-600 hover:text-gray-900' }, '← Back to home')
        )
      )
    ),
    showOTPModal && React.createElement(
      'div',
      { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' },
      React.createElement(
        'div',
        { className: 'bg-white rounded-lg p-6 max-w-md w-full' },
        React.createElement('h3', { className: 'text-xl font-bold mb-4' }, 'Verify Your Email'),
        React.createElement('p', { className: 'text-gray-600 mb-4 text-sm' }, `We've sent a 6-digit code to ${email}`),
        error && React.createElement('div', { className: 'bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm' }, error),
        React.createElement(
          'form',
          { onSubmit: handleVerifyOTP },
          React.createElement(
            'div',
            { className: 'mb-4' },
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Enter OTP Code'),
            React.createElement('input', {
              type: 'text',
              value: otpCode,
              onChange: (e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6)),
              className: 'w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-bold tracking-widest focus:ring-blue-500 focus:border-blue-500',
              placeholder: '000000',
              maxLength: 6
            })
          ),
          React.createElement(
            'button',
            {
              type: 'submit',
              disabled: otpLoading,
              className: 'w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium'
            },
            otpLoading ? 'Verifying...' : 'Verify Code'
          )
        ),
        React.createElement(
          'div',
          { className: 'mt-4 text-center text-sm' },
          React.createElement('button', { type: 'button', onClick: handleResendOTP, className: 'text-blue-600 hover:text-blue-700' }, 'Resend Code'),
          ' | ',
          React.createElement('button', { type: 'button', onClick: () => { setShowOTPModal(false); setOtpCode(''); }, className: 'text-gray-600 hover:text-gray-900' }, 'Cancel')
        )
      )
    )
  );
};

export default SignUp;
