import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
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
          text: 'Password reset instructions have been sent to your email address' 
        });
        setEmail('');
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

  return React.createElement(
    'div',
    { className: 'min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8' },
    React.createElement(
      'div',
      { className: 'max-w-md w-full space-y-8' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'mt-6 text-center text-2xl sm:text-3xl font-bold text-gray-900' }, 'Forgot Password'),
        React.createElement(
          'p',
          { className: 'mt-2 text-center text-sm text-gray-600' },
          'Enter your email address and we\'ll send you instructions to reset your password.'
        )
      ),

      // Alert Message
      message.text && React.createElement('div', {
        className: `p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-400 text-green-700' 
            : 'bg-red-50 border border-red-400 text-red-700'
        }`
      }, React.createElement('span', { className: 'block sm:inline text-sm' }, message.text)),

      React.createElement(
        'form',
        { className: 'mt-8 space-y-6', onSubmit: handleSubmit },
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
          loading ? 'Sending...' : 'Send Reset Instructions'
        ),

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
    )
  );
};

export default ForgotPassword;
