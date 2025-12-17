import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('Please login to view your orders');
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `https://sandybrown-squirrel-472536.hostingersite.com/backend/api/orders.php?action=get_user_orders&userId=${user.id}`
      );
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        console.error('Failed to fetch orders:', data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(
        `https://sandybrown-squirrel-472536.hostingersite.com/backend/api/orders.php?action=get_order_details&orderId=${orderId}`
      );
      const data = await response.json();
      
      if (data.success) {
        setSelectedOrder(data.order);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      processing: '⚙️',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };
    return icons[status] || '📦';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return React.createElement(
      'div',
      { className: 'container mx-auto px-4 py-8' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-center min-h-[400px]' },
        React.createElement('div', { className: 'text-xl text-gray-600' }, 'Loading orders...')
      )
    );
  }

  return React.createElement(
    'div',
    { className: 'container mx-auto px-4 py-8' },
    
    // Header
    React.createElement(
      'div',
      { className: 'mb-8' },
      React.createElement('h1', { className: 'text-3xl font-bold text-gray-900 mb-2' }, 'My Orders'),
      React.createElement('p', { className: 'text-gray-600' }, 'View and track your orders')
    ),

    // Orders List
    orders.length === 0 ? (
      React.createElement(
        'div',
        { className: 'bg-white rounded-lg shadow-sm p-12 text-center' },
        React.createElement('div', { className: 'text-6xl mb-4' }, '📦'),
        React.createElement('h3', { className: 'text-xl font-semibold text-gray-900 mb-2' }, 'No orders yet'),
        React.createElement('p', { className: 'text-gray-600 mb-6' }, 'Start shopping to see your orders here'),
        React.createElement(
          'button',
          {
            onClick: () => navigate('/'),
            className: 'bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
          },
          'Start Shopping'
        )
      )
    ) : (
      React.createElement(
        'div',
        { className: 'space-y-4' },
        orders.map(order => 
          React.createElement(
            'div',
            { 
              key: order.id,
              className: 'bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200'
            },
            React.createElement(
              'div',
              { className: 'p-6' },
              
              // Order Header
              React.createElement(
                'div',
                { className: 'flex flex-wrap items-start justify-between gap-4 mb-4' },
                React.createElement(
                  'div',
                  { className: 'flex-1 min-w-0' },
                  React.createElement(
                    'div',
                    { className: 'flex items-center gap-2 mb-1' },
                    React.createElement('span', { className: 'text-2xl' }, getStatusIcon(order.status)),
                    React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, order.order_number)
                  ),
                  React.createElement('p', { className: 'text-sm text-gray-600' }, `Placed on ${formatDate(order.created_at)}`)
                ),
                React.createElement(
                  'span',
                  { className: `px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}` },
                  order.status.charAt(0).toUpperCase() + order.status.slice(1)
                )
              ),

              // Order Info
              React.createElement(
                'div',
                { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200' },
                React.createElement(
                  'div',
                  null,
                  React.createElement('p', { className: 'text-sm text-gray-600 mb-1' }, 'Total Amount'),
                  React.createElement('p', { className: 'text-lg font-semibold text-gray-900' }, formatPrice(order.total))
                ),
                React.createElement(
                  'div',
                  null,
                  React.createElement('p', { className: 'text-sm text-gray-600 mb-1' }, 'Payment Method'),
                  React.createElement('p', { className: 'text-gray-900' }, order.payment_method.toUpperCase())
                ),
                React.createElement(
                  'div',
                  null,
                  React.createElement('p', { className: 'text-sm text-gray-600 mb-1' }, 'Items'),
                  React.createElement('p', { className: 'text-gray-900' }, `${order.item_count} item(s)`)
                )
              ),

              // Shipping Address
              React.createElement(
                'div',
                { className: 'mb-4' },
                React.createElement('p', { className: 'text-sm text-gray-600 mb-2' }, 'Shipping Address'),
                React.createElement(
                  'p',
                  { className: 'text-gray-900' },
                  `${order.full_name}, ${order.address_line1}, ${order.city}, ${order.state} ${order.zip_code}`
                )
              ),

              // Actions
              React.createElement(
                'div',
                { className: 'flex gap-3' },
                React.createElement(
                  'button',
                  {
                    onClick: () => fetchOrderDetails(order.id),
                    className: 'flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'
                  },
                  'View Details'
                ),
                order.status === 'delivered' && React.createElement(
                  'button',
                  {
                    onClick: () => alert('Review feature coming soon!'),
                    className: 'flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium'
                  },
                  'Write Review'
                )
              )
            )
          )
        )
      )
    ),

    // Order Details Modal
    showDetailsModal && selectedOrder && React.createElement(
      'div',
      { 
        className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50',
        onClick: () => setShowDetailsModal(false)
      },
      React.createElement(
        'div',
        { 
          className: 'bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto',
          onClick: (e) => e.stopPropagation()
        },
        
        // Modal Header
        React.createElement(
          'div',
          { className: 'flex items-center justify-between p-6 border-b border-gray-200' },
          React.createElement(
            'div',
            null,
            React.createElement('h2', { className: 'text-2xl font-bold text-gray-900 mb-1' }, 'Order Details'),
            React.createElement('p', { className: 'text-sm text-gray-600' }, selectedOrder.order_number)
          ),
          React.createElement(
            'button',
            {
              onClick: () => setShowDetailsModal(false),
              className: 'text-gray-400 hover:text-gray-600 text-3xl leading-none'
            },
            '×'
          )
        ),

        // Modal Body
        React.createElement(
          'div',
          { className: 'p-6' },
          
          // Order Status
          React.createElement(
            'div',
            { className: 'mb-6' },
            React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-3' }, 'Order Status'),
            React.createElement(
              'div',
              { className: 'flex items-center gap-3' },
              React.createElement('span', { className: 'text-3xl' }, getStatusIcon(selectedOrder.status)),
              React.createElement(
                'span',
                { className: `px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}` },
                selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)
              ),
              React.createElement('span', { className: 'text-gray-600' }, formatDate(selectedOrder.created_at))
            )
          ),

          // Order Items
          React.createElement(
            'div',
            { className: 'mb-6' },
            React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-3' }, 'Order Items'),
            React.createElement(
              'div',
              { className: 'space-y-3' },
              selectedOrder.items.map(item =>
                React.createElement(
                  'div',
                  { 
                    key: item.id,
                    className: 'flex gap-4 p-4 bg-gray-50 rounded-lg'
                  },
                  item.image_url && React.createElement('img', { 
                    src: item.image_url,
                    alt: item.product_name,
                    className: 'w-20 h-20 object-cover rounded'
                  }),
                  React.createElement(
                    'div',
                    { className: 'flex-1' },
                    React.createElement('h4', { className: 'font-medium text-gray-900 mb-1' }, item.product_name),
                    item.part_number && React.createElement('p', { className: 'text-sm text-gray-600 mb-1' }, `Part #${item.part_number}`),
                    React.createElement('p', { className: 'text-sm text-gray-600' }, `Quantity: ${item.quantity}`)
                  ),
                  React.createElement('div', { className: 'text-right' },
                    React.createElement('p', { className: 'font-semibold text-gray-900' }, formatPrice(item.price * item.quantity)),
                    React.createElement('p', { className: 'text-sm text-gray-600' }, `${formatPrice(item.price)} each`)
                  )
                )
              )
            )
          ),

          // Shipping Address
          React.createElement(
            'div',
            { className: 'mb-6' },
            React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-3' }, 'Shipping Address'),
            React.createElement(
              'div',
              { className: 'bg-gray-50 p-4 rounded-lg' },
              React.createElement('p', { className: 'font-medium text-gray-900 mb-2' }, selectedOrder.full_name),
              React.createElement('p', { className: 'text-gray-700' }, selectedOrder.address_line1),
              selectedOrder.address_line2 && React.createElement('p', { className: 'text-gray-700' }, selectedOrder.address_line2),
              React.createElement('p', { className: 'text-gray-700' }, `${selectedOrder.city}, ${selectedOrder.state} ${selectedOrder.zip_code}`),
              React.createElement('p', { className: 'text-gray-700' }, selectedOrder.country),
              React.createElement('p', { className: 'text-gray-700 mt-2' }, `Phone: ${selectedOrder.phone}`)
            )
          ),

          // Order Summary
          React.createElement(
            'div',
            { className: 'bg-gray-50 p-4 rounded-lg' },
            React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-3' }, 'Order Summary'),
            React.createElement(
              'div',
              { className: 'space-y-2' },
              React.createElement(
                'div',
                { className: 'flex justify-between text-gray-700' },
                React.createElement('span', null, 'Subtotal'),
                React.createElement('span', null, formatPrice(selectedOrder.subtotal))
              ),
              React.createElement(
                'div',
                { className: 'flex justify-between text-gray-700' },
                React.createElement('span', null, 'Shipping'),
                React.createElement('span', null, formatPrice(selectedOrder.shipping_cost))
              ),
              React.createElement('div', { className: 'border-t border-gray-300 my-2' }),
              React.createElement(
                'div',
                { className: 'flex justify-between text-lg font-bold text-gray-900' },
                React.createElement('span', null, 'Total'),
                React.createElement('span', null, formatPrice(selectedOrder.total))
              ),
              React.createElement(
                'div',
                { className: 'flex justify-between text-gray-700 mt-2' },
                React.createElement('span', null, 'Payment Method'),
                React.createElement('span', { className: 'font-medium' }, selectedOrder.payment_method.toUpperCase())
              )
            )
          )
        )
      )
    )
  );
};

export default MyOrders;
