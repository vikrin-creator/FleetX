import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive 
      ? 'text-[#2B2A29] hover:text-[#2B2A29] text-sm font-semibold leading-normal'
      : 'text-gray-700 hover:text-[#2B2A29] text-sm font-medium leading-normal';
  };

  return React.createElement(
    'header',
    { className: 'flex items-center justify-between bg-white px-4 md:px-6 lg:px-10 py-1 md:py-1.5 rounded-xl flex-wrap gap-4' },
    React.createElement(
      'div',
      { className: 'flex items-center gap-3 md:gap-4 text-white' },
      React.createElement(
        'div',
        { className: 'w-32 h-12 md:w-40 md:h-14 overflow-hidden flex items-center justify-center' },
        React.createElement('img', {
          src: '/fleet-x-logo.svg',
          alt: 'Fleet X Parts',
          className: 'w-full h-auto object-contain scale-90'
        })
      )
    ),
    React.createElement(
      'div',
      { className: 'flex flex-1 justify-end gap-3 md:gap-8' },
      React.createElement(
        'div',
        { className: 'hidden lg:flex items-center gap-6 xl:gap-9 mx-auto' },
        React.createElement(
          Link,
          { to: '/', className: getLinkClass('/') },
          'Home'
        ),
        React.createElement(
          Link,
          { to: '/products', className: getLinkClass('/products') },
          'Products'
        ),
        React.createElement(
          Link,
          { to: '/about', className: getLinkClass('/about') },
          'About'
        ),
        React.createElement(
          Link,
          { to: '/contact', className: getLinkClass('/contact') },
          'Contact'
        )
      ),
      React.createElement(
        'div',
        { className: 'flex gap-1.5' },
        React.createElement(
          'button',
          { className: 'flex min-w-[50px] md:min-w-[60px] cursor-pointer items-center justify-center overflow-hidden rounded h-7 md:h-8 px-2 md:px-3 bg-[#2B2A29] hover:bg-[#3B3A39] text-white text-xs font-medium leading-normal transition-colors' },
          React.createElement('span', { className: 'truncate' }, 'Sign Up')
        ),
        React.createElement(
          'button',
          { className: 'hidden sm:flex min-w-[50px] md:min-w-[60px] cursor-pointer items-center justify-center overflow-hidden rounded h-7 md:h-8 px-2 md:px-3 bg-[#5B5B5B] hover:bg-[#6B6B6B] text-white text-xs font-medium leading-normal transition-colors' },
          React.createElement('span', { className: 'truncate' }, 'Log In')
        )
      )
    )
  );
};

export default Header;
