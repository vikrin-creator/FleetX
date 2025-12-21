import React, { useState, useEffect } from 'react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      console.log('Fetching customers from API...');
      const response = await fetch('https://sandybrown-squirrel-472536.hostingersite.com/backend/api/users.php?action=get_all');
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.success) {
        const users = data.data?.users || data.users || [];
        console.log('Users from API:', users);
        setCustomers(users);
      } else {
        console.error('API returned error:', data.message);
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

  const fetchCustomerOrders = async (customer) => {
    try {
      console.log('Fetching orders for customer:', customer);
      setLoadingOrders(true);
      setSelectedCustomer(customer);
      setShowOrdersModal(true);
      
      const url = `https://sandybrown-squirrel-472536.hostingersite.com/backend/api/orders.php?action=get_user_orders&userId=${customer.id}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch customer orders');
      }
      
      const data = await response.json();
      console.log('Orders API response:', data);
      
      if (data.success) {
        const orders = data.data || data.orders || [];
        console.log('Customer orders:', orders);
        setCustomerOrders(orders);
      } else {
        console.log('API returned no success');
        setCustomerOrders([]);
      }
    } catch (err) {
      console.error('Error fetching customer orders:', err);
      setCustomerOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const closeModal = () => {
    setShowOrdersModal(false);
    setSelectedCustomer(null);
    setCustomerOrders([]);
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
              React.createElement('th', { className: 'hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'ID'),
              React.createElement('th', { className: 'px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Name'),
              React.createElement('th', { className: 'px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Email'),
              React.createElement('th', { className: 'hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Phone'),
              React.createElement('th', { className: 'hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Status'),
              React.createElement('th', { className: 'hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Registered')
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
                { 
                  key: customer.id, 
                  className: 'hover:bg-gray-50 transition-colors cursor-pointer',
                  onClick: () => fetchCustomerOrders(customer)
                },
                React.createElement(
                  'td',
                  { className: 'hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900' },
                  customer.id
                ),
                React.createElement(
                  'td',
                  { className: 'px-3 sm:px-6 py-3 sm:py-4' },
                  React.createElement(
                    'div',
                    { className: 'flex items-center' },
                    React.createElement(
                      'div',
                      { className: 'flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-blue-600 rounded-full flex items-center justify-center' },
                      React.createElement(
                        'span',
                        { className: 'text-white text-xs sm:text-sm font-semibold' },
                        ((customer.first_name?.[0] || '') + (customer.last_name?.[0] || '')).toUpperCase() || 'U'
                      )
                    ),
                    React.createElement(
                      'div',
                      { className: 'ml-2 sm:ml-4' },
                      React.createElement(
                        'div',
                        { className: 'text-xs sm:text-sm font-medium text-gray-900' },
                        `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'N/A'
                      )
                    )
                  )
                ),
                React.createElement(
                  'td',
                  { className: 'px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900' },
                  React.createElement('div', { className: 'truncate max-w-[150px] sm:max-w-none' }, customer.email || 'N/A')
                ),
                React.createElement(
                  'td',
                  { className: 'hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900' },
                  customer.phone || 'N/A'
                ),
                React.createElement(
                  'td',
                  { className: 'hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4' },
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
                  { className: 'hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500' },
                  formatDate(customer.created_at)
                )
              )
            )
          )
        )
      )
    ),

    // Customer Orders Modal
    showOrdersModal && selectedCustomer && React.createElement(
      'div',
      { className: 'fixed inset-0 z-50 overflow-y-auto', onClick: closeModal },
      React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50' }),
      React.createElement(
        'div',
        { className: 'flex items-center justify-center min-h-screen p-4' },
        React.createElement(
          'div',
          { 
            className: 'relative bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto mx-2 sm:mx-4',
            onClick: (e) => e.stopPropagation()
          },
          React.createElement(
            'div',
            { className: 'p-4 sm:p-6' },
            // Modal Header
            React.createElement(
              'div',
              { className: 'flex justify-between items-start mb-6 border-b pb-4' },
              React.createElement(
                'div',
                null,
                React.createElement('h2', { className: 'text-xl sm:text-2xl font-bold text-gray-900' }, 
                  `${selectedCustomer.first_name} ${selectedCustomer.last_name}'s Orders`
                ),
                React.createElement('p', { className: 'text-sm text-gray-500 mt-1' }, selectedCustomer.email)
              ),
              React.createElement(
                'button',
                {
                  onClick: closeModal,
                  className: 'text-gray-400 hover:text-gray-600 text-2xl font-bold'
                },
                '×'
              )
            ),
            
            // Orders Content
            loadingOrders ? React.createElement(
              'div',
              { className: 'flex items-center justify-center py-12' },
              React.createElement('div', { className: 'text-gray-600' }, 'Loading orders...')
            ) : customerOrders.length === 0 ? React.createElement(
              'div',
              { className: 'text-center py-12' },
              React.createElement('p', { className: 'text-gray-500 text-lg' }, 'No orders found for this customer'),
              React.createElement('p', { className: 'text-gray-400 text-sm mt-2' }, 'This customer has not placed any orders yet.')
            ) : React.createElement(
              'div',
              { className: 'space-y-4' },
              React.createElement(
                'div',
                { className: 'mb-4' },
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, 
                  `Total Orders: ${customerOrders.length}`
                )
              ),
              React.createElement(
                'div',
                { className: 'overflow-x-auto' },
                React.createElement(
                  'table',
                  { className: 'w-full min-w-[500px]' },
                  React.createElement(
                    'thead',
                    { className: 'bg-gray-50' },
                    React.createElement(
                      'tr',
                      null,
                      React.createElement('th', { className: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase' }, 'Order #'),
                      React.createElement('th', { className: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase' }, 'Items'),
                      React.createElement('th', { className: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase' }, 'Total'),
                      React.createElement('th', { className: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase' }, 'Status'),
                      React.createElement('th', { className: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase' }, 'Date')
                    )
                  ),
                  React.createElement(
                    'tbody',
                    { className: 'divide-y divide-gray-200' },
                    customerOrders.map((order) =>
                      React.createElement(
                        'tr',
                        { key: order.id, className: 'hover:bg-gray-50' },
                        React.createElement(
                          'td',
                          { className: 'px-4 py-3 text-sm font-medium text-gray-900' },
                          React.createElement('div', { className: 'font-mono text-xs' }, order.order_number)
                        ),
                        React.createElement(
                          'td',
                          { className: 'px-4 py-3 text-sm text-gray-600' },
                          order.item_count
                        ),
                        React.createElement(
                          'td',
                          { className: 'px-4 py-3 text-sm font-semibold text-gray-900' },
                          `$${parseFloat(order.total).toFixed(2)}`
                        ),
                        React.createElement(
                          'td',
                          { className: 'px-4 py-3' },
                          React.createElement(
                            'span',
                            { className: `px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(order.status)}` },
                            order.status.charAt(0).toUpperCase() + order.status.slice(1)
                          )
                        ),
                        React.createElement(
                          'td',
                          { className: 'px-4 py-3 text-sm text-gray-600' },
                          formatDate(order.created_at)
                        )
                      )
                    )
                  )
                )
              ),
              
              // Summary Stats
              React.createElement(
                'div',
                { className: 'grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t' },
                React.createElement(
                  'div',
                  { className: 'bg-blue-50 rounded-lg p-4' },
                  React.createElement('p', { className: 'text-sm text-blue-600 font-medium' }, 'Total Spent'),
                  React.createElement('p', { className: 'text-xl sm:text-2xl font-bold text-blue-900' }, 
                    `$${customerOrders.reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(2)}`
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'bg-green-50 rounded-lg p-4' },
                  React.createElement('p', { className: 'text-sm text-green-600 font-medium' }, 'Completed Orders'),
                  React.createElement('p', { className: 'text-xl sm:text-2xl font-bold text-green-900' }, 
                    customerOrders.filter(o => o.status === 'delivered').length
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'bg-yellow-50 rounded-lg p-4' },
                  React.createElement('p', { className: 'text-sm text-yellow-600 font-medium' }, 'Pending Orders'),
                  React.createElement('p', { className: 'text-xl sm:text-2xl font-bold text-yellow-900' }, 
                    customerOrders.filter(o => ['pending', 'processing'].includes(o.status)).length
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

export default Customers;
