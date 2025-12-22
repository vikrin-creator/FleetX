import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart();
    
    // Listen for cart updates
    const handleCartUpdate = () => loadCart();
    window.addEventListener('cartUpdate', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdate', handleCartUpdate);
    };
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log('Loading cart:', cart);
    setCartItems(cart);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCartItems([]);
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (parseFloat(item.price || 0) * item.quantity), 0);
  };

  return React.createElement(
    'div',
    { className: 'container mx-auto px-4 py-8' },
    
    // Header
    React.createElement(
      'div',
      { className: 'mb-8' },
      React.createElement('h1', { className: 'text-3xl font-bold text-gray-900 mb-2' }, 'Shopping Cart'),
      React.createElement('p', { className: 'text-gray-600' }, `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} in your cart`)
    ),

    // Cart Content
    cartItems.length === 0 ? React.createElement(
      'div',
      { className: 'text-center py-16' },
      React.createElement(
        'svg',
        { className: 'w-24 h-24 mx-auto text-gray-300 mb-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
        React.createElement('path', { 
          strokeLinecap: 'round', 
          strokeLinejoin: 'round', 
          strokeWidth: 2, 
          d: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
        })
      ),
      React.createElement('h2', { className: 'text-2xl font-semibold text-gray-800 mb-2' }, 'Your cart is empty'),
      React.createElement('p', { className: 'text-gray-600 mb-6' }, 'Add some items to get started'),
      React.createElement(
        'button',
        { 
          onClick: () => navigate('/products'),
          className: 'bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
        },
        'Continue Shopping'
      )
    ) : React.createElement(
      'div',
      { className: 'flex flex-col lg:flex-row gap-8' },
      
      // Cart Items List
      React.createElement(
        'div',
        { className: 'flex-1' },
        React.createElement(
          'div',
          { className: 'bg-white rounded-lg shadow-sm' },
          cartItems.map((item, index) => 
            React.createElement(
              'div',
              { 
                key: index,
                className: 'flex gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors'
              },
              
              // Item Image
              React.createElement(
                'div',
                { className: 'w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden' },
                (item.image_url) ? React.createElement('img', {
                  src: item.image_url,
                  alt: item.name,
                  className: 'w-full h-full object-cover',
                  onError: (e) => {
                    console.error('Image failed to load:', item.image_url);
                    e.target.style.display = 'none';
                  }
                }) : React.createElement(
                  'div',
                  { className: 'w-full h-full flex items-center justify-center text-gray-400' },
                  React.createElement(
                    'svg',
                    { className: 'w-12 h-12', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                    React.createElement('path', {
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      strokeWidth: 2,
                      d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                    })
                  )
                )
              ),
              
              // Item Details
              React.createElement(
                'div',
                { className: 'flex-1 min-w-0' },
                React.createElement('h3', { className: 'font-semibold text-gray-900 mb-1' }, item.name),
                item.part_number && React.createElement('p', { className: 'text-sm text-gray-600 mb-2' }, `Part #: ${item.part_number}`),
                React.createElement('p', { className: 'text-lg font-bold text-blue-600' }, `$${parseFloat(item.price || 0).toFixed(2)}`)
              ),
              
              // Quantity Controls
              React.createElement(
                'div',
                { className: 'flex flex-col items-end gap-2' },
                React.createElement(
                  'div',
                  { className: 'flex items-center gap-2 border border-gray-300 rounded' },
                  React.createElement(
                    'button',
                    {
                      onClick: () => updateQuantity(index, item.quantity - 1),
                      className: 'px-3 py-1 hover:bg-gray-100 transition-colors'
                    },
                    '−'
                  ),
                  React.createElement('span', { className: 'px-3 py-1 min-w-[40px] text-center' }, item.quantity),
                  React.createElement(
                    'button',
                    {
                      onClick: () => updateQuantity(index, item.quantity + 1),
                      className: 'px-3 py-1 hover:bg-gray-100 transition-colors'
                    },
                    '+'
                  )
                ),
                React.createElement(
                  'button',
                  {
                    onClick: () => removeItem(index),
                    className: 'text-red-600 text-sm hover:text-red-700 transition-colors'
                  },
                  'Remove'
                )
              )
            )
          )
        ),
        
        // Clear Cart Button
        React.createElement(
          'button',
          {
            onClick: clearCart,
            className: 'mt-4 text-red-600 text-sm hover:text-red-700 transition-colors'
          },
          'Clear Cart'
        )
      ),
      
      // Order Summary
      React.createElement(
        'div',
        { className: 'lg:w-96' },
        React.createElement(
          'div',
          { className: 'bg-white rounded-lg shadow-sm p-6 sticky top-4' },
          React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'Order Summary'),
          
          // Summary Details
          React.createElement(
            'div',
            { className: 'space-y-3 mb-6' },
            React.createElement(
              'div',
              { className: 'flex justify-between text-gray-600' },
              React.createElement('span', null, 'Subtotal'),
              React.createElement('span', null, `$${getTotalPrice().toFixed(2)}`)
            ),
            React.createElement(
              'div',
              { className: 'flex justify-between text-gray-600' },
              React.createElement('span', null, 'Shipping'),
              React.createElement('span', null, 'Calculated at checkout')
            ),
            React.createElement('div', { className: 'border-t pt-3' }),
            React.createElement(
              'div',
              { className: 'flex justify-between text-xl font-bold' },
              React.createElement('span', null, 'Total'),
              React.createElement('span', null, `$${getTotalPrice().toFixed(2)}`)
            )
          ),
          
          // Checkout Button
          React.createElement(
            'button',
            { 
              onClick: () => navigate('/checkout'),
              className: 'w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold mb-3'
            },
            'Proceed to Checkout'
          ),
          
          // Continue Shopping
          React.createElement(
            'button',
            { 
              onClick: () => navigate('/products'),
              className: 'w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors'
            },
            'Continue Shopping'
          )
        )
      )
    )
  );
};

export default Cart;
