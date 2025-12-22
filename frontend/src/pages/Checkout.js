import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));

    // Load cart items
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      alert('Your cart is empty');
      navigate('/cart');
      return;
    }
    setCartItems(cart);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!shippingAddress.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingAddress.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
    if (!shippingAddress.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return 15.00; // Flat rate shipping
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Save shipping address to database
      const addressResponse = await fetch('https://sandybrown-squirrel-472536.hostingersite.com/backend/api/addresses.php?action=save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...shippingAddress,
          isDefault: false
        })
      });

      const addressResult = await addressResponse.json();
      
      let shippingAddressId = null;
      if (addressResult.success && addressResult.addressId) {
        shippingAddressId = addressResult.addressId;
      }

      // Save order to database first
      const orderResponse = await fetch('https://sandybrown-squirrel-472536.hostingersite.com/backend/api/orders.php?action=save_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          items: cartItems,
          shippingAddress: shippingAddress,
          shippingAddressId: shippingAddressId,
          paymentMethod: paymentMethod,
          subtotal: calculateSubtotal(),
          shippingCost: calculateShipping(),
          total: calculateTotal()
        })
      });

      const orderResult = await orderResponse.json();
      
      if (!orderResult.success) {
        alert('Failed to place order: ' + orderResult.message);
        return;
      }

      // If payment method is card, redirect to Stripe
      if (paymentMethod === 'card') {
        // Create Stripe checkout session
        const paymentResponse = await fetch('https://sandybrown-squirrel-472536.hostingersite.com/backend/api/stripe.php?action=create_payment_intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.round(calculateTotal() * 100), // Convert to cents
            orderId: orderResult.orderId,
            userId: user.id
          })
        });

        const paymentResult = await paymentResponse.json();
        
        if (!paymentResult.success) {
          alert('Failed to initialize payment: ' + paymentResult.message);
          return;
        }

        // Redirect to Stripe Checkout page
        window.location.href = paymentResult.url;
      } else {
        // For other payment methods, just clear cart and redirect
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdate'));
        alert(`Order placed successfully! Your order number is ${orderResult.orderNumber}`);
        navigate('/my-orders');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return React.createElement(
    'div',
    { className: 'container mx-auto px-4 py-8' },
    
    // Header
    React.createElement(
      'div',
      { className: 'mb-8' },
      React.createElement('h1', { className: 'text-3xl font-bold text-gray-900 mb-2' }, 'Checkout'),
      React.createElement(
        'button',
        {
          onClick: () => navigate('/cart'),
          className: 'text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1'
        },
        React.createElement(
          'svg',
          { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
          React.createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 2,
            d: 'M15 19l-7-7 7-7'
          })
        ),
        'Back to Cart'
      )
    ),

    // Main Content
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-3 gap-8' },
      
      // Left Column - Forms
      React.createElement(
        'div',
        { className: 'lg:col-span-2 space-y-6' },
        
        // Shipping Address
        React.createElement(
          'div',
          { className: 'bg-white rounded-lg shadow-sm p-6' },
          React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'Shipping Address'),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
            
            // Full Name
            React.createElement(
              'div',
              { className: 'md:col-span-2' },
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Full Name *'),
              React.createElement('input', {
                type: 'text',
                name: 'fullName',
                value: shippingAddress.fullName,
                onChange: handleInputChange,
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500' + (errors.fullName ? ' border-red-500' : '')
              }),
              errors.fullName && React.createElement('p', { className: 'text-red-500 text-xs mt-1' }, errors.fullName)
            ),
            
            // Phone
            React.createElement(
              'div',
              { className: 'md:col-span-2' },
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Phone Number *'),
              React.createElement('input', {
                type: 'tel',
                name: 'phone',
                value: shippingAddress.phone,
                onChange: handleInputChange,
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500' + (errors.phone ? ' border-red-500' : '')
              }),
              errors.phone && React.createElement('p', { className: 'text-red-500 text-xs mt-1' }, errors.phone)
            ),
            
            // Address Line 1
            React.createElement(
              'div',
              { className: 'md:col-span-2' },
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Address Line 1 *'),
              React.createElement('input', {
                type: 'text',
                name: 'addressLine1',
                value: shippingAddress.addressLine1,
                onChange: handleInputChange,
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500' + (errors.addressLine1 ? ' border-red-500' : '')
              }),
              errors.addressLine1 && React.createElement('p', { className: 'text-red-500 text-xs mt-1' }, errors.addressLine1)
            ),
            
            // Address Line 2
            React.createElement(
              'div',
              { className: 'md:col-span-2' },
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Address Line 2 (Optional)'),
              React.createElement('input', {
                type: 'text',
                name: 'addressLine2',
                value: shippingAddress.addressLine2,
                onChange: handleInputChange,
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              })
            ),
            
            // City
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'City *'),
              React.createElement('input', {
                type: 'text',
                name: 'city',
                value: shippingAddress.city,
                onChange: handleInputChange,
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500' + (errors.city ? ' border-red-500' : '')
              }),
              errors.city && React.createElement('p', { className: 'text-red-500 text-xs mt-1' }, errors.city)
            ),
            
            // State
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'State *'),
              React.createElement('input', {
                type: 'text',
                name: 'state',
                value: shippingAddress.state,
                onChange: handleInputChange,
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500' + (errors.state ? ' border-red-500' : '')
              }),
              errors.state && React.createElement('p', { className: 'text-red-500 text-xs mt-1' }, errors.state)
            ),
            
            // ZIP Code
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'ZIP Code *'),
              React.createElement('input', {
                type: 'text',
                name: 'zipCode',
                value: shippingAddress.zipCode,
                onChange: handleInputChange,
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500' + (errors.zipCode ? ' border-red-500' : '')
              }),
              errors.zipCode && React.createElement('p', { className: 'text-red-500 text-xs mt-1' }, errors.zipCode)
            ),
            
            // Country
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Country'),
              React.createElement('input', {
                type: 'text',
                name: 'country',
                value: shippingAddress.country,
                onChange: handleInputChange,
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              })
            )
          )
        ),
        
        // Payment Method
        React.createElement(
          'div',
          { className: 'bg-white rounded-lg shadow-sm p-6' },
          React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'Payment Method'),
          React.createElement(
            'div',
            { className: 'space-y-3' },
            
            // Credit/Debit Card via Stripe
            React.createElement(
              'label',
              { className: 'flex items-center p-4 border-2 rounded-lg cursor-pointer ' + (paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300') },
              React.createElement('input', {
                type: 'radio',
                name: 'paymentMethod',
                value: 'card',
                checked: paymentMethod === 'card',
                onChange: (e) => setPaymentMethod(e.target.value),
                className: 'w-4 h-4 text-blue-600'
              }),
              React.createElement(
                'div',
                { className: 'ml-3' },
                React.createElement('p', { className: 'font-medium text-gray-900' }, 'Credit/Debit Card'),
                React.createElement('p', { className: 'text-sm text-gray-500' }, 'Pay securely with Stripe')
              )
            )
          )
        )
      ),
      
      // Right Column - Order Summary
      React.createElement(
        'div',
        { className: 'lg:col-span-1' },
        React.createElement(
          'div',
          { className: 'bg-white rounded-lg shadow-sm p-6 sticky top-4' },
          React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'Order Summary'),
          
          // Items
          React.createElement(
            'div',
            { className: 'space-y-3 mb-4 max-h-60 overflow-y-auto' },
            cartItems.map((item, index) =>
              React.createElement(
                'div',
                { key: index, className: 'flex gap-3 pb-3 border-b border-gray-200' },
                React.createElement(
                  'div',
                  { className: 'w-16 h-16 flex-shrink-0 bg-gray-100 rounded' },
                  item.image && React.createElement('img', {
                    src: item.image,
                    alt: item.name,
                    className: 'w-full h-full object-cover rounded'
                  })
                ),
                React.createElement(
                  'div',
                  { className: 'flex-1 min-w-0' },
                  React.createElement('p', { className: 'text-sm font-medium text-gray-900 truncate' }, item.name),
                  React.createElement('p', { className: 'text-xs text-gray-500' }, `Qty: ${item.quantity}`),
                  React.createElement('p', { className: 'text-sm font-semibold text-gray-900' }, `$${(item.price * item.quantity).toFixed(2)}`)
                )
              )
            )
          ),
          
          // Totals
          React.createElement(
            'div',
            { className: 'space-y-2 mb-4' },
            React.createElement(
              'div',
              { className: 'flex justify-between text-sm' },
              React.createElement('span', { className: 'text-gray-600' }, 'Subtotal'),
              React.createElement('span', { className: 'font-medium' }, `$${calculateSubtotal().toFixed(2)}`)
            ),
            React.createElement(
              'div',
              { className: 'flex justify-between text-sm' },
              React.createElement('span', { className: 'text-gray-600' }, 'Shipping'),
              React.createElement('span', { className: 'font-medium' }, `$${calculateShipping().toFixed(2)}`)
            ),
            React.createElement('div', { className: 'border-t pt-2' }),
            React.createElement(
              'div',
              { className: 'flex justify-between text-lg font-bold' },
              React.createElement('span', null, 'Total'),
              React.createElement('span', { className: 'text-blue-600' }, `$${calculateTotal().toFixed(2)}`)
            )
          ),
          
          // Place Order Button
          React.createElement(
            'button',
            {
              onClick: handlePlaceOrder,
              className: 'w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold'
            },
            'Place Order'
          ),
          
          React.createElement('p', { className: 'text-xs text-gray-500 text-center mt-3' }, 'By placing your order, you agree to our terms and conditions')
        )
      )
    )
  );
};

export default Checkout;
