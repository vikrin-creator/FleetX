import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState({ type: '', text: '' });
  const [formData, setFormData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user types
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setMessage({ type: 'error', text: 'New password must be different from current password' });
      return;
    }

    try {
      setLoading(true);
      
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(userData);
      
      const response = await fetch(
        'https://sandybrown-squirrel-472536.hostingersite.com/backend/api/profile.php?action=change_password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Redirect to profile after 2 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to change password' });
      }
    } catch (error) {
      console.error('Change password error:', error);
      setMessage({ type: 'error', text: 'Failed to change password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return React.createElement('div', { className: 'container mx-auto px-4 py-8' },
    React.createElement('div', { className: 'max-w-md mx-auto' },
      React.createElement('h1', { className: 'text-3xl font-bold text-gray-900 mb-8' }, 'Change Password'),

      // Alert Message
      message.text && React.createElement('div', {
        className: `mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`
      }, message.text),

      React.createElement('div', { className: 'bg-white rounded-lg shadow p-6' },
        React.createElement('form', { onSubmit: handleSubmit, className: 'space-y-6' },
          // Current Password
          React.createElement('div', null,
            React.createElement('label', { 
              htmlFor: 'currentPassword',
              className: 'block text-sm font-medium text-gray-700 mb-2' 
            }, 'Current Password'),
            React.createElement('input', {
              type: 'password',
              id: 'currentPassword',
              name: 'currentPassword',
              value: formData.currentPassword,
              onChange: handleInputChange,
              className: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              placeholder: 'Enter current password'
            })
          ),

          // New Password
          React.createElement('div', null,
            React.createElement('label', { 
              htmlFor: 'newPassword',
              className: 'block text-sm font-medium text-gray-700 mb-2' 
            }, 'New Password'),
            React.createElement('input', {
              type: 'password',
              id: 'newPassword',
              name: 'newPassword',
              value: formData.newPassword,
              onChange: handleInputChange,
              className: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              placeholder: 'Enter new password (min 6 characters)'
            })
          ),

          // Confirm New Password
          React.createElement('div', null,
            React.createElement('label', { 
              htmlFor: 'confirmPassword',
              className: 'block text-sm font-medium text-gray-700 mb-2' 
            }, 'Confirm New Password'),
            React.createElement('input', {
              type: 'password',
              id: 'confirmPassword',
              name: 'confirmPassword',
              value: formData.confirmPassword,
              onChange: handleInputChange,
              className: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              placeholder: 'Confirm new password'
            })
          ),

          // Submit Button
          React.createElement('button', {
            type: 'submit',
            disabled: loading,
            className: 'w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed'
          }, loading ? 'Changing Password...' : 'Change Password'),

          // Cancel Button
          React.createElement('button', {
            type: 'button',
            onClick: () => navigate('/profile'),
            className: 'w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium'
          }, 'Cancel')
        )
      )
    )
  );
};

export default ChangePassword;
