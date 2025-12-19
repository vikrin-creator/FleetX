import React from 'react';

const ShippingReturnPolicy = () => {
  return React.createElement(
    'div',
    { className: 'min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8' },
    React.createElement(
      'div',
      { className: 'max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8' },
      
      // Title
      React.createElement(
        'h1',
        { className: 'text-3xl font-bold text-gray-900 mb-8' },
        'Shipping & Return Policy'
      ),
      
      // Shipping Coverage & Carriers Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Shipping Coverage & Carriers'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700' },
          'We ship within the United States using carriers such as UPS, FedEx, USPS, and freight carriers depending on package size and weight.'
        )
      ),
      
      // Processing Times Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Processing Times'
        ),
        React.createElement(
          'ul',
          { className: 'list-disc list-inside space-y-2 text-gray-700 ml-4' },
          React.createElement('li', null, 'Most in-stock orders process within 1–5 business days (excluding weekends/holidays).'),
          React.createElement('li', null, 'Special orders and drop-ship items may have longer lead times.')
        )
      ),
      
      // Shipping Costs Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Shipping Costs'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700' },
          'Shipping charges are calculated at checkout or quoted at time of order. Oversized/heavy items may require freight shipping and additional fees (e.g., liftgate service, residential delivery, appointment delivery).'
        )
      ),
      
      // Tracking & Delivery Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Tracking & Delivery'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700' },
          'Tracking is provided when available. Delivery dates are estimates and not guaranteed.'
        )
      ),
      
      // Incorrect Address / Undeliverable Packages Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Incorrect Address / Undeliverable Packages'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700 mb-3' },
          'If an order is returned due to an incorrect address or failed delivery attempts:'
        ),
        React.createElement(
          'ul',
          { className: 'list-disc list-inside space-y-2 text-gray-700 ml-4' },
          React.createElement('li', null, 'Shipping charges are non-refundable.'),
          React.createElement('li', null, 'Reshipment fees may apply, or a refund may be issued minus shipping and any applicable fees.')
        )
      ),
      
      // Return Shipping Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Return Shipping (For Eligible Returns)'
        ),
        React.createElement(
          'ul',
          { className: 'list-disc list-inside space-y-2 text-gray-700 ml-4' },
          React.createElement('li', null, 'Return shipping costs are the customer\'s responsibility unless the return is due to our error or confirmed shipping damage/defect.'),
          React.createElement('li', null, 'Use a trackable, insured shipping method. We are not responsible for returns lost or damaged in transit.'),
          React.createElement('li', null, 'Items must be packed securely to prevent damage.')
        )
      ),
      
      // Return Authorization Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Return Authorization'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700' },
          'We strongly recommend contacting us before returning any item to receive instructions and avoid delays or rejected returns.'
        )
      ),
      
      // Contact Section
      React.createElement(
        'div',
        { className: 'border-t pt-6 mt-8' },
        React.createElement(
          'p',
          { className: 'text-gray-700' },
          'For questions about shipping or returns, please contact us at ',
          React.createElement(
            'a',
            { href: 'mailto:support@fleetxusa.com', className: 'text-blue-600 hover:text-blue-800 underline font-medium' },
            'support@fleetxusa.com'
          ),
          '.'
        )
      )
    )
  );
};

export default ShippingReturnPolicy;
