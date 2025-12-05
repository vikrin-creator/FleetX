import React from 'react';

const Footer = () => {
  return React.createElement(
    'footer',
    { className: 'bg-gray-800 text-white mt-auto' },
    React.createElement(
      'div',
      { className: 'container mx-auto px-4 py-6' },
      React.createElement(
        'div',
        { className: 'text-center' },
        React.createElement(
          'p',
          null,
          `© ${new Date().getFullYear()} FleetX. All rights reserved.`
        )
      )
    )
  );
};

export default Footer;
