import React, { useState, useEffect } from 'react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://sandybrown-squirrel-472536.hostingersite.com/backend/api/users.php?action=get_all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCustomers(data.data || []);
      } else {
        setError(data.message || 'Failed to load customers');
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const search = searchTerm.toLowerCase();
    return (
      customer.email?.toLowerCase().includes(search) ||
      customer.first_name?.toLowerCase().includes(search) ||
      customer.last_name?.toLowerCase().includes(search) ||
      customer.phone?.includes(search)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return React.createElement(
      'div',
      { className: 'p-4 sm:p-6 lg:p-8' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-center h-64' },
        React.createElement('div', { className: 'text-lg text-gray-600' }, 'Loading customers...')
      )
    );
  }

  if (error) {
    return React.createElement(
      'div',
      { className: 'p-4 sm:p-6 lg:p-8' },
      React.createElement(
        'div',
        { className: 'bg-red-50 border border-red-200 rounded-lg p-4' },
        React.createElement('p', { className: 'text-red-600' }, 'Error: ' + error)
      )
    );
  }

  return React.createElement(
    'div',
    { className: 'p-4 sm:p-6 lg:p-8' },
    
    // Header
    React.createElement(
      'div',
      { className: 'mb-6' },
      React.createElement('h1', { className: 'text-2xl sm:text-3xl font-bold text-gray-900 mb-2' }, 'Customers'),
      React.createElement('p', { className: 'text-gray-600' }, `Total customers: ${customers.length}`)
    ),

    // Search Bar
    React.createElement(
      'div',
      { className: 'mb-6' },
      React.createElement(
        'div',
        { className: 'relative max-w-md' },
        React.createElement(
          'svg',
          { 
            className: 'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
          },
          React.createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 2,
            d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
          })
        ),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search by name, email, or phone...',
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          className: 'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        })
      )
    ),

    // Customers Table
    React.createElement(
      'div',
      { className: 'bg-white rounded-lg shadow overflow-hidden' },
      React.createElement(
        'div',
        { className: 'overflow-x-auto' },
        React.createElement(
          'table',
          { className: 'min-w-full divide-y divide-gray-200' },
          
          // Table Header
          React.createElement(
            'thead',
            { className: 'bg-gray-50' },
            React.createElement(
              'tr',
              null,
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'ID'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Name'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Email'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Phone'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Status'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Registered')
            )
          ),
          
          // Table Body
          React.createElement(
            'tbody',
            { className: 'bg-white divide-y divide-gray-200' },
            filteredCustomers.length === 0 ? React.createElement(
              'tr',
              null,
              React.createElement(
                'td',
                { colSpan: 6, className: 'px-6 py-8 text-center text-gray-500' },
                searchTerm ? 'No customers found matching your search' : 'No customers yet'
              )
            ) : filteredCustomers.map((customer) =>
              React.createElement(
                'tr',
                { key: customer.id, className: 'hover:bg-gray-50 transition-colors' },
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900' },
                  customer.id
                ),
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement(
                    'div',
                    { className: 'flex items-center' },
                    React.createElement(
                      'div',
                      { className: 'flex-shrink-0 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center' },
                      React.createElement(
                        'span',
                        { className: 'text-white font-semibold' },
                        ((customer.first_name?.[0] || '') + (customer.last_name?.[0] || '')).toUpperCase() || 'U'
                      )
                    ),
                    React.createElement(
                      'div',
                      { className: 'ml-4' },
                      React.createElement(
                        'div',
                        { className: 'text-sm font-medium text-gray-900' },
                        `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'N/A'
                      )
                    )
                  )
                ),
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900' },
                  customer.email || 'N/A'
                ),
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900' },
                  customer.phone || 'N/A'
                ),
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement(
                    'span',
                    { 
                      className: customer.email_verified 
                        ? 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
                        : 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'
                    },
                    customer.email_verified ? 'Verified' : 'Pending'
                  )
                ),
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500' },
                  formatDate(customer.created_at)
                )
              )
            )
          )
        )
      )
    ),

    // Statistics Cards (optional)
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mt-6' },
      React.createElement(
        'div',
        { className: 'bg-blue-50 rounded-lg p-4' },
        React.createElement('p', { className: 'text-sm text-blue-600 font-medium' }, 'Total Customers'),
        React.createElement('p', { className: 'text-2xl font-bold text-blue-900' }, customers.length)
      ),
      React.createElement(
        'div',
        { className: 'bg-green-50 rounded-lg p-4' },
        React.createElement('p', { className: 'text-sm text-green-600 font-medium' }, 'Verified'),
        React.createElement('p', { className: 'text-2xl font-bold text-green-900' }, customers.filter(c => c.email_verified).length)
      ),
      React.createElement(
        'div',
        { className: 'bg-yellow-50 rounded-lg p-4' },
        React.createElement('p', { className: 'text-sm text-yellow-600 font-medium' }, 'Pending'),
        React.createElement('p', { className: 'text-2xl font-bold text-yellow-900' }, customers.filter(c => !c.email_verified).length)
      )
    )
  );
};

export default Customers;
