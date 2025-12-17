import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = React.useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(
        'https://sandybrown-squirrel-472536.hostingersite.com/backend/api/auth.php?action=forgot_password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'OTP has been sent to your email address' 
        });
        setStep(2); // Move to OTP step
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to send reset email' });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage({ type: 'error', text: 'Failed to send reset email. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!otp) {
      setMessage({ type: 'error', text: 'Please enter the OTP' });
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(
        'https://sandybrown-squirrel-472536.hostingersite.com/backend/api/auth.php?action=verify_reset_otp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, otp })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'OTP verified successfully' 
        });
        setStep(3); // Move to password reset step
      } else {
        setMessage({ type: 'error', text: data.message || 'Invalid OTP' });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setMessage({ type: 'error', text: 'Failed to verify OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(
        'https://sandybrown-squirrel-472536.hostingersite.com/backend/api/auth.php?action=reset_password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, otp, new_password: newPassword })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Password reset successfully! Redirecting to login...' 
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to reset password' });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage({ type: 'error', text: 'Failed to reset password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return React.createElement(
          'form',
          { className: 'mt-8 space-y-6', onSubmit: handleEmailSubmit },
          React.createElement(
            'div',
            null,
            React.createElement('label', { 
              htmlFor: 'email', 
              className: 'block text-sm font-medium text-gray-700 mb-1' 
            }, 'Email address'),
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
            'button',
            {
              type: 'submit',
              disabled: loading,
              className: 'w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
            },
            loading ? 'Sending...' : 'Send OTP'
          )
        );

      case 2:
        return React.createElement(
          'form',
          { className: 'mt-8 space-y-6', onSubmit: handleOtpSubmit },
          React.createElement(
            'div',
            null,
            React.createElement('label', { 
              htmlFor: 'otp', 
              className: 'block text-sm font-medium text-gray-700 mb-1' 
            }, 'Enter OTP'),
            React.createElement('input', {
              id: 'otp',
              type: 'text',
              required: true,
              value: otp,
              onChange: (e) => setOtp(e.target.value),
              className: 'appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center tracking-widest',
              placeholder: 'Enter 6-digit OTP',
              maxLength: 6
            })
          ),

          React.createElement(
            'button',
            {
              type: 'submit',
              disabled: loading,
              className: 'w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
            },
            loading ? 'Verifying...' : 'Verify OTP'
          ),

          React.createElement(
            'div',
            { className: 'text-center' },
            React.createElement(
              'button',
              { 
                type: 'button',
                onClick: () => setStep(1),
                className: 'font-medium text-sm text-blue-600 hover:text-blue-500' 
              },
              'Back to Email'
            )
          )
        );

      case 3:
        return React.createElement(
          'form',
          { className: 'mt-8 space-y-6', onSubmit: handlePasswordReset },
          React.createElement(
            'div',
            null,
            React.createElement('label', { 
              htmlFor: 'newPassword', 
              className: 'block text-sm font-medium text-gray-700 mb-1' 
            }, 'New Password'),
            React.createElement('input', {
              id: 'newPassword',
              type: 'password',
              required: true,
              value: newPassword,
              onChange: (e) => setNewPassword(e.target.value),
              className: 'appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
              placeholder: 'Enter new password'
            })
          ),

          React.createElement(
            'div',
            null,
            React.createElement('label', { 
              htmlFor: 'confirmPassword', 
              className: 'block text-sm font-medium text-gray-700 mb-1' 
            }, 'Confirm Password'),
            React.createElement('input', {
              id: 'confirmPassword',
              type: 'password',
              required: true,
              value: confirmPassword,
              onChange: (e) => setConfirmPassword(e.target.value),
              className: 'appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
              placeholder: 'Confirm new password'
            })
          ),

          React.createElement(
            'button',
            {
              type: 'submit',
              disabled: loading,
              className: 'w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
            },
            loading ? 'Resetting...' : 'Reset Password'
          )
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Forgot Password';
      case 2: return 'Enter OTP';
      case 3: return 'Reset Password';
      default: return 'Forgot Password';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Enter your email address and we\'ll send you an OTP to reset your password.';
      case 2: return `We've sent a 6-digit OTP to ${email}. Please enter it below.`;
      case 3: return 'Enter your new password below.';
      default: return '';
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
        React.createElement('h2', { className: 'mt-6 text-center text-2xl sm:text-3xl font-bold text-gray-900' }, getStepTitle()),
        React.createElement(
          'p',
          { className: 'mt-2 text-center text-sm text-gray-600' },
          getStepDescription()
        )
      ),

      // Progress indicator
      React.createElement(
        'div',
        { className: 'flex justify-center items-center space-x-4 mb-8' },
        React.createElement('div', { className: `w-3 h-3 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}` }),
        React.createElement('div', { className: `w-8 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}` }),
        React.createElement('div', { className: `w-3 h-3 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}` }),
        React.createElement('div', { className: `w-8 h-0.5 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}` }),
        React.createElement('div', { className: `w-3 h-3 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}` })
      ),

      // Alert Message
      message.text && React.createElement('div', {
        className: `p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-400 text-green-700' 
            : 'bg-red-50 border border-red-400 text-red-700'
        }`
      }, React.createElement('span', { className: 'block sm:inline text-sm' }, message.text)),

      renderStepContent(),

      React.createElement(
        'div',
        { className: 'text-center' },
        React.createElement(
          Link,
          { to: '/login', className: 'font-medium text-sm text-blue-600 hover:text-blue-500' },
          'Back to Login'
        )
      )
    )
  );
};

export default ForgotPassword;
