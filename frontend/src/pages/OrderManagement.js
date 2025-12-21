import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sandybrown-squirrel-472536.hostingersite.com/backend/api';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/orders.php?action=get_all_orders`);
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders.php?action=get_order_details&orderId=${orderId}`);
      if (response.data.success) {
        setSelectedOrder(response.data.order);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders.php?action=update_status`, {
        orderId,
        status: newStatus
      });
      
      if (response.data.success) {
        // Refresh orders list
        fetchOrders();
        // Update modal if open
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({...selectedOrder, status: newStatus});
        }
        alert('Order status updated successfully');
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return React.createElement(
      'div',
      { className: 'flex items-center justify-center h-64' },
      React.createElement('div', { className: 'animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full' })
    );
  }

  return React.createElement(
    'div',
    { className: 'p-4 sm:p-6 lg:p-8' },
    // Header
    React.createElement(
      'div',
      { className: 'mb-6' },
      React.createElement('h1', { className: 'text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2' }, 'Orders Management'),
      React.createElement('p', { className: 'text-slate-600 dark:text-slate-400' }, 'Manage all customer orders')
    ),

    // Filters and Search
    React.createElement(
      'div',
      { className: 'mb-6 flex flex-col sm:flex-row gap-4' },
      // Search
      React.createElement(
        'div',
        { className: 'flex-1' },
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search by order number, customer name, or email...',
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          className: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
        })
      ),
      // Status Filter
      React.createElement(
        'select',
        {
          value: filter,
          onChange: (e) => setFilter(e.target.value),
          className: 'px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
        },
        React.createElement('option', { value: 'all' }, 'All Orders'),
        React.createElement('option', { value: 'pending' }, 'Pending'),
        React.createElement('option', { value: 'processing' }, 'Processing'),
        React.createElement('option', { value: 'shipped' }, 'Shipped'),
        React.createElement('option', { value: 'delivered' }, 'Delivered'),
        React.createElement('option', { value: 'cancelled' }, 'Cancelled')
      )
    ),

    // Stats
    React.createElement(
      'div',
      { className: 'grid grid-cols-2 md:grid-cols-5 gap-4 mb-6' },
      React.createElement(
        'div',
        { className: 'bg-white dark:bg-slate-800 p-4 rounded-lg shadow' },
        React.createElement('div', { className: 'text-sm text-slate-600 dark:text-slate-400' }, 'Total Orders'),
        React.createElement('div', { className: 'text-2xl font-bold text-slate-900 dark:text-slate-50' }, orders.length)
      ),
      React.createElement(
        'div',
        { className: 'bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg' },
        React.createElement('div', { className: 'text-sm text-yellow-700 dark:text-yellow-300' }, 'Pending'),
        React.createElement('div', { className: 'text-2xl font-bold text-yellow-800 dark:text-yellow-200' }, orders.filter(o => o.status === 'pending').length)
      ),
      React.createElement(
        'div',
        { className: 'bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg' },
        React.createElement('div', { className: 'text-sm text-blue-700 dark:text-blue-300' }, 'Processing'),
        React.createElement('div', { className: 'text-2xl font-bold text-blue-800 dark:text-blue-200' }, orders.filter(o => o.status === 'processing').length)
      ),
      React.createElement(
        'div',
        { className: 'bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg' },
        React.createElement('div', { className: 'text-sm text-purple-700 dark:text-purple-300' }, 'Shipped'),
        React.createElement('div', { className: 'text-2xl font-bold text-purple-800 dark:text-purple-200' }, orders.filter(o => o.status === 'shipped').length)
      ),
      React.createElement(
        'div',
        { className: 'bg-green-50 dark:bg-green-900/20 p-4 rounded-lg' },
        React.createElement('div', { className: 'text-sm text-green-700 dark:text-green-300' }, 'Delivered'),
        React.createElement('div', { className: 'text-2xl font-bold text-green-800 dark:text-green-200' }, orders.filter(o => o.status === 'delivered').length)
      )
    ),

    // Orders Table
    React.createElement(
      'div',
      { className: 'bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden' },
      React.createElement(
        'div',
        { className: 'overflow-x-auto' },
        React.createElement(
          'table',
          { className: 'w-full' },
          React.createElement(
            'thead',
            { className: 'bg-slate-50 dark:bg-slate-700' },
            React.createElement(
              'tr',
              null,
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider' }, 'Order #'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider' }, 'Customer'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider' }, 'Items'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider' }, 'Total'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider' }, 'Status'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider' }, 'Date'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider' }, 'Actions')
            )
          ),
          React.createElement(
            'tbody',
            { className: 'divide-y divide-slate-200 dark:divide-slate-700' },
            filteredOrders.length === 0 ? 
              React.createElement(
                'tr',
                null,
                React.createElement('td', { colSpan: 7, className: 'px-6 py-8 text-center text-slate-500 dark:text-slate-400' }, 'No orders found')
              ) :
              filteredOrders.map((order) =>
                React.createElement(
                  'tr',
                  { key: order.id, className: 'hover:bg-slate-50 dark:hover:bg-slate-700' },
                  React.createElement(
                    'td',
                    { className: 'px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-50' },
                    order.order_number
                  ),
                  React.createElement(
                    'td',
                    { className: 'px-6 py-4 whitespace-nowrap' },
                    React.createElement('div', { className: 'text-sm font-medium text-slate-900 dark:text-slate-50' }, order.full_name),
                    React.createElement('div', { className: 'text-sm text-slate-500 dark:text-slate-400' }, order.email || order.phone)
                  ),
                  React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50' }, order.item_count),
                  React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-slate-50' }, `$${parseFloat(order.total).toFixed(2)}`),
                  React.createElement(
                    'td',
                    { className: 'px-6 py-4 whitespace-nowrap' },
                    React.createElement(
                      'span',
                      { className: `px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(order.status)}` },
                      order.status.charAt(0).toUpperCase() + order.status.slice(1)
                    )
                  ),
                  React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400' }, new Date(order.created_at).toLocaleDateString()),
                  React.createElement(
                    'td',
                    { className: 'px-6 py-4 whitespace-nowrap text-sm font-medium' },
                    React.createElement(
                      'button',
                      {
                        onClick: () => fetchOrderDetails(order.id),
                        className: 'text-primary hover:text-primary/80 mr-3'
                      },
                      'View'
                    ),
                    React.createElement(
                      'select',
                      {
                        value: order.status,
                        onChange: (e) => updateOrderStatus(order.id, e.target.value),
                        className: 'text-xs border rounded px-2 py-1'
                      },
                      React.createElement('option', { value: 'pending' }, 'Pending'),
                      React.createElement('option', { value: 'processing' }, 'Processing'),
                      React.createElement('option', { value: 'shipped' }, 'Shipped'),
                      React.createElement('option', { value: 'delivered' }, 'Delivered'),
                      React.createElement('option', { value: 'cancelled' }, 'Cancelled')
                    )
                  )
                )
              )
          )
        )
      )
    ),

    // Order Details Modal
    showModal && selectedOrder && React.createElement(
      'div',
      { className: 'fixed inset-0 z-50 overflow-y-auto', onClick: () => setShowModal(false) },
      React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50' }),
      React.createElement(
        'div',
        { className: 'flex items-center justify-center min-h-screen p-4' },
        React.createElement(
          'div',
          { 
            className: 'relative bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto',
            onClick: (e) => e.stopPropagation()
          },
          React.createElement(
            'div',
            { className: 'p-6' },
            // Modal Header
            React.createElement(
              'div',
              { className: 'flex justify-between items-start mb-6' },
              React.createElement(
                'div',
                null,
                React.createElement('h2', { className: 'text-2xl font-bold text-slate-900 dark:text-slate-50' }, `Order #${selectedOrder.order_number}`),
                React.createElement('p', { className: 'text-sm text-slate-500 dark:text-slate-400 mt-1' }, `Placed on ${new Date(selectedOrder.created_at).toLocaleString()}`)
              ),
              React.createElement(
                'button',
                {
                  onClick: () => setShowModal(false),
                  className: 'text-slate-400 hover:text-slate-600'
                },
                React.createElement(
                  'svg',
                  { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                  React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M6 18L18 6M6 6l12 12' })
                )
              )
            ),

            // Customer Info
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-6' },
              React.createElement(
                'div',
                { className: 'bg-slate-50 dark:bg-slate-700 p-4 rounded-lg' },
                React.createElement('h3', { className: 'font-semibold text-slate-900 dark:text-slate-50 mb-3' }, 'Customer Information'),
                React.createElement('p', { className: 'text-sm text-slate-600 dark:text-slate-300' }, React.createElement('strong', null, 'Name:'), ' ', selectedOrder.full_name),
                React.createElement('p', { className: 'text-sm text-slate-600 dark:text-slate-300' }, React.createElement('strong', null, 'Email:'), ' ', selectedOrder.email || 'N/A'),
                React.createElement('p', { className: 'text-sm text-slate-600 dark:text-slate-300' }, React.createElement('strong', null, 'Phone:'), ' ', selectedOrder.phone)
              ),
              React.createElement(
                'div',
                { className: 'bg-slate-50 dark:bg-slate-700 p-4 rounded-lg' },
                React.createElement('h3', { className: 'font-semibold text-slate-900 dark:text-slate-50 mb-3' }, 'Shipping Address'),
                React.createElement('p', { className: 'text-sm text-slate-600 dark:text-slate-300' }, selectedOrder.address_line1),
                selectedOrder.address_line2 && React.createElement('p', { className: 'text-sm text-slate-600 dark:text-slate-300' }, selectedOrder.address_line2),
                React.createElement('p', { className: 'text-sm text-slate-600 dark:text-slate-300' }, `${selectedOrder.city}, ${selectedOrder.state} ${selectedOrder.zip_code}`),
                React.createElement('p', { className: 'text-sm text-slate-600 dark:text-slate-300' }, selectedOrder.country)
              )
            ),

            // Order Items
            React.createElement(
              'div',
              { className: 'mb-6' },
              React.createElement('h3', { className: 'font-semibold text-slate-900 dark:text-slate-50 mb-3' }, 'Order Items'),
              React.createElement(
                'div',
                { className: 'border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden' },
                React.createElement(
                  'table',
                  { className: 'w-full' },
                  React.createElement(
                    'thead',
                    { className: 'bg-slate-50 dark:bg-slate-700' },
                    React.createElement(
                      'tr',
                      null,
                      React.createElement('th', { className: 'px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300' }, 'Product'),
                      React.createElement('th', { className: 'px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-300' }, 'Price'),
                      React.createElement('th', { className: 'px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-300' }, 'Quantity'),
                      React.createElement('th', { className: 'px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-300' }, 'Subtotal')
                    )
                  ),
                  React.createElement(
                    'tbody',
                    { className: 'divide-y divide-slate-200 dark:divide-slate-700' },
                    selectedOrder.items?.map((item, index) =>
                      React.createElement(
                        'tr',
                        { key: index },
                        React.createElement('td', { className: 'px-4 py-3 text-sm text-slate-900 dark:text-slate-50' }, item.product_name),
                        React.createElement('td', { className: 'px-4 py-3 text-sm text-slate-900 dark:text-slate-50 text-right' }, `$${parseFloat(item.price).toFixed(2)}`),
                        React.createElement('td', { className: 'px-4 py-3 text-sm text-slate-900 dark:text-slate-50 text-right' }, item.quantity),
                        React.createElement('td', { className: 'px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-50 text-right' }, `$${(parseFloat(item.price) * item.quantity).toFixed(2)}`)
                      )
                    )
                  )
                )
              )
            ),

            // Order Summary
            React.createElement(
              'div',
              { className: 'bg-slate-50 dark:bg-slate-700 p-4 rounded-lg' },
              React.createElement(
                'div',
                { className: 'flex justify-between mb-2' },
                React.createElement('span', { className: 'text-slate-600 dark:text-slate-300' }, 'Subtotal:'),
                React.createElement('span', { className: 'font-semibold text-slate-900 dark:text-slate-50' }, `$${parseFloat(selectedOrder.subtotal).toFixed(2)}`)
              ),
              React.createElement(
                'div',
                { className: 'flex justify-between mb-2' },
                React.createElement('span', { className: 'text-slate-600 dark:text-slate-300' }, 'Shipping:'),
                React.createElement('span', { className: 'font-semibold text-slate-900 dark:text-slate-50' }, `$${parseFloat(selectedOrder.shipping_cost).toFixed(2)}`)
              ),
              React.createElement('div', { className: 'border-t border-slate-300 dark:border-slate-600 my-2' }),
              React.createElement(
                'div',
                { className: 'flex justify-between' },
                React.createElement('span', { className: 'text-lg font-bold text-slate-900 dark:text-slate-50' }, 'Total:'),
                React.createElement('span', { className: 'text-lg font-bold text-primary' }, `$${parseFloat(selectedOrder.total).toFixed(2)}`)
              )
            )
          )
        )
      )
    )
  );
};

export default OrderManagement;
