import React from 'react';

const PrivacyPolicy = () => {
  return React.createElement(
    'div',
    { className: 'min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8' },
    React.createElement(
      'div',
      { className: 'max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8' },
      
      // Title
      React.createElement(
        'h1',
        { className: 'text-3xl font-bold text-gray-900 mb-2' },
        'Privacy Policy'
      ),
      
      // Effective Date
      React.createElement(
        'p',
        { className: 'text-sm text-gray-600 mb-8' },
        'Effective Date: December 17, 2025'
      ),
      
      // Introduction
      React.createElement(
        'p',
        { className: 'text-gray-700 mb-6' },
        'FLEET X PARTS respects your privacy. This policy describes how we collect, use, and share information.'
      ),
      
      // Information We Collect Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Information We Collect'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700 mb-3' },
          'We may collect:'
        ),
        React.createElement(
          'ul',
          { className: 'list-disc list-inside space-y-2 text-gray-700 ml-4' },
          React.createElement('li', null, 'Contact information (name, email, phone, billing/shipping address)'),
          React.createElement('li', null, 'Order and customer support details (items purchased, order history, communications)'),
          React.createElement('li', null, 'Payment-related data (processed securely by third-party payment processors; we do not store full card numbers)'),
          React.createElement('li', null, 'Website/device data (IP address, browser type, pages visited) via cookies and analytics tools')
        )
      ),
      
      // How We Use Information Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'How We Use Information'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700 mb-3' },
          'We use information to:'
        ),
        React.createElement(
          'ul',
          { className: 'list-disc list-inside space-y-2 text-gray-700 ml-4' },
          React.createElement('li', null, 'Process orders, payments, shipping, and returns'),
          React.createElement('li', null, 'Provide customer service and order updates'),
          React.createElement('li', null, 'Prevent fraud and secure transactions'),
          React.createElement('li', null, 'Improve our website, products, and services'),
          React.createElement('li', null, 'Send marketing messages where permitted (you can opt out at any time)')
        )
      ),
      
      // Sharing of Information Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Sharing of Information'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700 mb-3' },
          'We may share information with trusted service providers only as needed to operate our business, such as:'
        ),
        React.createElement(
          'ul',
          { className: 'list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4' },
          React.createElement('li', null, 'Payment processors'),
          React.createElement('li', null, 'Shipping carriers'),
          React.createElement('li', null, 'E-commerce/website hosting providers'),
          React.createElement('li', null, 'Customer support systems')
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700 font-medium' },
          'We do not sell your personal information.'
        )
      ),
      
      // Cookies Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Cookies'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700' },
          'Cookies help the website function and allow analytics. You can control cookies via your browser settings (some site features may not work properly if cookies are disabled).'
        )
      ),
      
      // Data Security Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Data Security'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700' },
          'We use reasonable administrative, technical, and physical safeguards to protect your data. No method of transmission or storage is 100% secure.'
        )
      ),
      
      // Your Choices Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Your Choices'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700' },
          'You may request access, correction, or deletion of your personal information where applicable by contacting us at ',
          React.createElement(
            'a',
            { href: 'mailto:support@fleetxusa.com', className: 'text-blue-600 hover:text-blue-800 underline' },
            'support@fleetxusa.com'
          ),
          '.'
        )
      ),
      
      // Updates Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Updates'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700' },
          'We may update this Privacy Policy from time to time. The updated version will be posted with a revised effective date.'
        )
      ),
      
      // Contact Section
      React.createElement(
        'div',
        { className: 'border-t pt-6 mt-8' },
        React.createElement(
          'p',
          { className: 'text-gray-700' },
          'Privacy Contact: ',
          React.createElement(
            'a',
            { href: 'mailto:support@fleetxusa.com', className: 'text-blue-600 hover:text-blue-800 underline font-medium' },
            'support@fleetxusa.com'
          )
        )
      )
    )
  );
};

export default PrivacyPolicy;
