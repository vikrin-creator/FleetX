import React from 'react';

const CancellationRefundPolicy = () => {
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
        'Cancellation & Refund Policy'
      ),
      
      // Effective Date
      React.createElement(
        'p',
        { className: 'text-sm text-gray-600 mb-6' },
        'Effective Date: December 17, 2025'
      ),
      
      // Introduction
      React.createElement(
        'p',
        { className: 'text-gray-700 mb-8' },
        'This policy applies to all purchases made from FLEET X PARTS in-store, by phone, or online.'
      ),
      
      // Order Cancellations Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Order Cancellations'
        ),
        React.createElement(
          'ul',
          { className: 'list-disc list-inside space-y-3 text-gray-700 ml-4' },
          React.createElement(
            'li',
            null,
            React.createElement('span', { className: 'font-semibold' }, 'Before processing/shipment: '),
            'You may cancel an order at no charge if it has not been pulled, processed, special-ordered, or shipped.'
          ),
          React.createElement(
            'li',
            null,
            React.createElement('span', { className: 'font-semibold' }, 'After shipment or after "ready for pickup": '),
            'If an order has already shipped or has been prepared for pickup, cancellation is treated as a return (if eligible) and may be subject to the 10% restocking fee, plus any non-refundable shipping/handling charges.'
          ),
          React.createElement(
            'li',
            null,
            React.createElement('span', { className: 'font-semibold' }, 'Special orders / drop-ship orders: '),
            'Special-order items may not be cancellable once placed with the supplier. If cancellation is possible, supplier fees and the 10% restocking fee may apply.'
          )
        )
      ),
      
      // Refund & Return Eligibility Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Refund & Return Eligibility (30-Day Window)'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700 mb-3' },
          'Most new, unused, uninstalled items may be returned within 30 days of purchase (or delivery date for shipped orders) if:'
        ),
        React.createElement(
          'ul',
          { className: 'list-disc list-inside space-y-2 text-gray-700 ml-4' },
          React.createElement('li', null, 'Proof of purchase is provided (receipt/order number), and'),
          React.createElement('li', null, 'The item is in original packaging with all accessories, manuals, and hardware, and'),
          React.createElement('li', null, 'The item is in resalable condition (no damage, wear, installation marks, writing/labels on packaging, or missing parts).')
        )
      ),
      
      // 15% Restocking Fee Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          '15% Restocking Fee'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700 mb-4' },
          'A 15% restocking fee applies to most eligible returns that are not due to our error or a confirmed defect. This is an industry-standard fee to cover handling, inspection/testing, repackaging, and inventory costs.'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700 mb-2 font-semibold' },
          'The restocking fee generally applies when:'
        ),
        React.createElement(
          'ul',
          { className: 'list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4' },
          React.createElement('li', null, 'The wrong item was ordered, item is no longer needed, or return is for preference/fitment reasons.'),
          React.createElement('li', null, 'Packaging has been opened and/or internal packaging is missing (even if the item is unused).')
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700 mb-2 font-semibold' },
          'The restocking fee may be waived (at our discretion) when:'
        ),
        React.createElement(
          'ul',
          { className: 'list-disc list-inside space-y-2 text-gray-700 ml-4' },
          React.createElement('li', null, 'We shipped the wrong item, or'),
          React.createElement('li', null, 'The item is confirmed defective out of the box (see below).')
        )
      ),
      
      // Final Sale / Non-Refundable Items Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Final Sale / Non-Refundable Items'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-700 mb-3' },
          'Unless required by law, the following are final sale and not eligible for return or refund:'
        ),
        React.createElement(
          'ul',
          { className: 'list-disc list-inside space-y-2 text-gray-700 ml-4' },
          React.createElement('li', null, 'Electrical/electronic parts once opened (including, but not limited to: sensors, switches, modules, ECUs/ECMs, lighting electronics, control units)'),
          React.createElement('li', null, 'Special-order or custom items'),
          React.createElement('li', null, 'Clearance/final sale items marked as such'),
          React.createElement('li', null, 'Installed, used, modified, or damaged parts'),
          React.createElement('li', null, 'Fluids, chemicals, adhesives, paints, and other hazardous/consumable items once opened'),
          React.createElement('li', null, 'Items missing original packaging, UPC/barcodes/labels, or included components')
        )
      ),
      
      // Wrong, Damaged, or Defective Items Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Wrong, Damaged, or Defective Items'
        ),
        React.createElement(
          'ul',
          { className: 'list-disc list-inside space-y-3 text-gray-700 ml-4' },
          React.createElement(
            'li',
            null,
            React.createElement('span', { className: 'font-semibold' }, 'Wrong item shipped by us: '),
            'Contact us within 7 days. We will correct the issue. No restocking fee.'
          ),
          React.createElement(
            'li',
            null,
            React.createElement('span', { className: 'font-semibold' }, 'Shipping damage: '),
            'Report within 48 hours of delivery with photos of the item, packaging, and shipping label. Keep all packaging until resolved.'
          ),
          React.createElement(
            'li',
            null,
            React.createElement('span', { className: 'font-semibold' }, 'Defective items: '),
            'Contact us within 7 days. We may require troubleshooting details and/or return for inspection/testing. Remedies may include replacement, repair, or refund consistent with supplier/manufacturer terms.'
          )
        )
      ),
      
      // Refund Method & Timing Section
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-semibold text-gray-900 mb-4' },
          'Refund Method & Timing'
        ),
        React.createElement(
          'ul',
          { className: 'list-disc list-inside space-y-2 text-gray-700 ml-4' },
          React.createElement('li', null, 'Approved refunds are issued to the original payment method when possible.'),
          React.createElement('li', null, 'Refunds are processed after inspection and approval, typically within 3–10 business days (your bank may take additional time to post).'),
          React.createElement('li', null, 'Original shipping charges are non-refundable except where required by law or due to our error.')
        )
      ),
      
      // Contact Section
      React.createElement(
        'div',
        { className: 'border-t pt-6 mt-8' },
        React.createElement(
          'p',
          { className: 'text-gray-700' },
          'Contact for cancellations/returns: ',
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

export default CancellationRefundPolicy;
