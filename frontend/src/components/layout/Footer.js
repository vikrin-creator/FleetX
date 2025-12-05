import React from 'react';

const Footer = () => {
  return React.createElement(
    'footer',
    { className: 'bg-gray-800 text-white mt-auto w-full' },
    React.createElement(
      'div',
      { className: 'w-full px-4 sm:px-6 md:px-8 lg:px-10 py-8 md:py-12' },
      React.createElement(
        'div',
        { className: 'max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8' },
        
        // About Section
        React.createElement(
          'div',
          { className: 'flex flex-col gap-3' },
          React.createElement('h3', { className: 'text-lg font-bold mb-2' }, 'About FleetX'),
          React.createElement('p', { className: 'text-sm text-gray-300' }, 'Your trusted partner for heavy-duty truck parts and accessories. Quality parts for the long haul.')
        ),
        
        // Quick Links
        React.createElement(
          'div',
          { className: 'flex flex-col gap-3' },
          React.createElement('h3', { className: 'text-lg font-bold mb-2' }, 'Quick Links'),
          React.createElement('a', { href: '#', className: 'text-sm text-gray-300 hover:text-white transition-colors' }, 'Home'),
          React.createElement('a', { href: '#', className: 'text-sm text-gray-300 hover:text-white transition-colors' }, 'Products'),
          React.createElement('a', { href: '#', className: 'text-sm text-gray-300 hover:text-white transition-colors' }, 'About Us'),
          React.createElement('a', { href: '#', className: 'text-sm text-gray-300 hover:text-white transition-colors' }, 'Contact')
        ),
        
        // Customer Service
        React.createElement(
          'div',
          { className: 'flex flex-col gap-3' },
          React.createElement('h3', { className: 'text-lg font-bold mb-2' }, 'Customer Service'),
          React.createElement('a', { href: '#', className: 'text-sm text-gray-300 hover:text-white transition-colors' }, 'Help Center'),
          React.createElement('a', { href: '#', className: 'text-sm text-gray-300 hover:text-white transition-colors' }, 'Shipping Info'),
          React.createElement('a', { href: '#', className: 'text-sm text-gray-300 hover:text-white transition-colors' }, 'Returns'),
          React.createElement('a', { href: '#', className: 'text-sm text-gray-300 hover:text-white transition-colors' }, 'FAQs')
        ),
        
        // Contact Info
        React.createElement(
          'div',
          { className: 'flex flex-col gap-3' },
          React.createElement('h3', { className: 'text-lg font-bold mb-2' }, 'Contact Us'),
          React.createElement('p', { className: 'text-sm text-gray-300' }, '415 E 31 Street'),
          React.createElement('p', { className: 'text-sm text-gray-300' }, 'Anderson, IN 46016'),
          React.createElement('p', { className: 'text-sm text-gray-300' }, 'Phone: 917-293-3704'),
          React.createElement('p', { className: 'text-sm text-gray-300' }, 'Email: punjabtruckrepair@gmail.com')
        )
      ),
      
      // Copyright
      React.createElement(
        'div',
        { className: 'max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center' },
        React.createElement(
          'p',
          { className: 'text-sm text-gray-400' },
          `© ${new Date().getFullYear()} `,
          React.createElement('a', { 
            href: '/', 
            className: 'font-bold hover:text-white transition-colors cursor-pointer no-underline',
            onClick: (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
          }, 'FleetX'),
          '. All rights reserved. | Designed and Developed by ',
          React.createElement('a', { 
            href: 'https://www.vikrin.com',
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'font-bold hover:text-white transition-colors cursor-pointer no-underline'
          }, 'Vikrin')
        )
      )
    )
  );
};

export default Footer;
