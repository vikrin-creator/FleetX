import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    fetchUserProfile(parsedUser.id);
  }, [navigate]);

  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://sandybrown-squirrel-472536.hostingersite.com/backend/api/profile.php?action=get_profile&userId=${userId}`
      );

      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return React.createElement('div', { className: 'container mx-auto px-4 py-8' },
      React.createElement('p', { className: 'text-center text-gray-500' }, 'Loading...')
    );
  }

  if (error) {
    return React.createElement('div', { className: 'container mx-auto px-4 py-8' },
      React.createElement('div', { className: 'max-w-2xl mx-auto' },
        React.createElement('div', { className: 'bg-red-50 border border-red-200 rounded-lg p-4' },
          React.createElement('p', { className: 'text-red-800' }, error)
        )
      )
    );
  }

  if (!user) {
    return null;
  }

  return React.createElement('div', { className: 'container mx-auto px-4 py-8' },
    React.createElement('div', { className: 'max-w-2xl mx-auto' },
      React.createElement('h1', { className: 'text-3xl font-bold text-gray-900 mb-8' }, 'My Profile'),

      React.createElement('div', { className: 'bg-white rounded-lg shadow p-6' },
        React.createElement('div', { className: 'space-y-6' },
          // Name
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Name'),
            React.createElement('p', { className: 'text-gray-900 text-lg' },
              user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || '-'
            )
          ),

          // Email
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Email'),
            React.createElement('p', { className: 'text-gray-900 text-lg' }, user.email || '-')
          ),

          // Phone
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Phone Number'),
            React.createElement('p', { className: 'text-gray-900 text-lg' }, user.phone || '-')
          )
        )
      )
    )
  );
};

export default Profile;
