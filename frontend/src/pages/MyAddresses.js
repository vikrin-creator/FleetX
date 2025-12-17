import React from 'react';

const MyAddresses = () => {
  const [addresses, setAddresses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        window.location.href = '/login';
        return;
      }

      const user = JSON.parse(userStr);
      const response = await fetch(
        `https://sandybrown-squirrel-472536.hostingersite.com/backend/api/addresses.php?action=get_all&userId=${user.id}`
      );

      const data = await response.json();
      
      if (data.success) {
        setAddresses(data.addresses || []);
      } else {
        setError(data.message || 'Failed to fetch addresses');
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Failed to load addresses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const response = await fetch(
        'https://sandybrown-squirrel-472536.hostingersite.com/backend/api/addresses.php?action=set_default',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            addressId: addressId
          })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        fetchAddresses(); // Refresh the list
      } else {
        alert(data.message || 'Failed to set default address');
      }
    } catch (err) {
      console.error('Error setting default address:', err);
      alert('Failed to set default address. Please try again.');
    }
  };

  const handleDelete = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const response = await fetch(
        'https://sandybrown-squirrel-472536.hostingersite.com/backend/api/addresses.php?action=delete',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            addressId: addressId
          })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        fetchAddresses(); // Refresh the list
      } else {
        alert(data.message || 'Failed to delete address');
      }
    } catch (err) {
      console.error('Error deleting address:', err);
      alert('Failed to delete address. Please try again.');
    }
  };

  if (loading) {
    return React.createElement('div', { className: 'min-h-screen bg-gray-50 flex items-center justify-center' },
      React.createElement('div', { className: 'text-center' },
        React.createElement('div', { className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto' }),
        React.createElement('p', { className: 'mt-4 text-gray-600' }, 'Loading addresses...')
      )
    );
  }

  return React.createElement('div', { className: 'min-h-screen bg-gray-50 py-8' },
    React.createElement('div', { className: 'max-w-6xl mx-auto px-4' },
      // Header
      React.createElement('div', { className: 'mb-8' },
        React.createElement('h1', { className: 'text-3xl font-bold text-gray-900' }, 'My Addresses'),
        React.createElement('p', { className: 'mt-2 text-gray-600' }, 'Manage your saved shipping addresses')
      ),

      // Error Message
      error && React.createElement('div', { className: 'mb-6 bg-red-50 border border-red-200 rounded-lg p-4' },
        React.createElement('p', { className: 'text-red-800' }, error)
      ),

      // Addresses Grid
      addresses.length === 0 ? (
        React.createElement('div', { className: 'bg-white rounded-lg shadow-sm p-12 text-center' },
          React.createElement('svg', { 
            className: 'mx-auto h-16 w-16 text-gray-400 mb-4',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
          },
            React.createElement('path', {
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: 2,
              d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
            }),
            React.createElement('path', {
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: 2,
              d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z'
            })
          ),
          React.createElement('h3', { className: 'text-lg font-medium text-gray-900 mb-2' }, 'No Saved Addresses'),
          React.createElement('p', { className: 'text-gray-500 mb-6' }, 
            'You haven\'t saved any addresses yet. Addresses will be automatically saved when you place an order.'
          ),
          React.createElement('a', {
            href: '/products',
            className: 'inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          }, 'Start Shopping')
        )
      ) : (
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
          addresses.map(address => 
            React.createElement('div', { 
              key: address.id,
              className: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative hover:shadow-md transition-shadow'
            },
              // Default Badge
              address.is_default && React.createElement('div', { 
                className: 'absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full'
              }, 'Default'),

              // Address Details
              React.createElement('div', { className: 'mb-4' },
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-2' }, address.full_name),
                React.createElement('p', { className: 'text-gray-600 text-sm mb-1' }, address.phone),
                React.createElement('p', { className: 'text-gray-700 text-sm leading-relaxed' },
                  address.address_line1,
                  address.address_line2 && React.createElement('br'),
                  address.address_line2,
                  React.createElement('br'),
                  `${address.city}, ${address.state} ${address.zip_code}`,
                  React.createElement('br'),
                  address.country
                )
              ),

              // Action Buttons
              React.createElement('div', { className: 'flex gap-2 mt-4 pt-4 border-t border-gray-200' },
                !address.is_default && React.createElement('button', {
                  onClick: () => handleSetDefault(address.id),
                  className: 'flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium'
                }, 'Set as Default'),
                
                React.createElement('button', {
                  onClick: () => handleDelete(address.id),
                  className: 'px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                },
                  React.createElement('svg', {
                    className: 'w-5 h-5',
                    fill: 'none',
                    stroke: 'currentColor',
                    viewBox: '0 0 24 24'
                  },
                    React.createElement('path', {
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      strokeWidth: 2,
                      d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    })
                  )
                )
              )
            )
          )
        )
      )
    )
  );
};

export default MyAddresses;
