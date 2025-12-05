import React from 'react';
import Header from './Header.js';
import Footer from './Footer.js';

const Layout = ({ children }) => {
  return React.createElement(
    'div',
    { className: 'relative flex h-auto min-h-screen w-full flex-col bg-background-light overflow-x-hidden' },
    React.createElement(
      'div',
      { className: 'flex h-full grow flex-col overflow-x-hidden' },
      React.createElement(
        'div',
        { className: 'flex flex-1 justify-center py-3 md:py-5 px-2 md:px-4 overflow-x-hidden' },
        React.createElement(
          'div',
          { className: 'flex flex-col w-full max-w-[1200px] flex-1 overflow-x-hidden' },
          React.createElement(Header),
          React.createElement(
            'main',
            { className: 'w-full' },
            children
          ),
          React.createElement(Footer)
        )
      )
    )
  );
};

export default Layout;
