import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };
  
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive 
      ? 'text-[#2B2A29] hover:text-[#2B2A29] text-sm font-semibold leading-normal'
      : 'text-gray-700 hover:text-[#2B2A29] text-sm font-medium leading-normal';
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
    'header',
    { className: 'flex items-center justify-between bg-white px-4 md:px-6 lg:px-10 py-1 md:py-1.5 rounded-xl flex-wrap gap-4' },
    React.createElement(
      'div',
      { className: 'flex items-center gap-3 md:gap-4 text-white' },
      React.createElement(
        'div',
        { className: 'w-32 h-12 md:w-40 md:h-14 overflow-hidden flex items-center justify-center cursor-pointer', onClick: () => navigate('/') },
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
        user ? React.createElement(
          React.Fragment,
          null,
          React.createElement(
            'span',
            { className: 'hidden sm:flex items-center text-xs text-gray-700 mr-2' },
            user.email
          ),
          React.createElement(
            'button',
            { 
              onClick: handleLogout,
              className: 'hidden sm:flex min-w-[50px] md:min-w-[60px] cursor-pointer items-center justify-center overflow-hidden rounded h-7 md:h-8 px-2 md:px-3 bg-[#5B5B5B] hover:bg-[#6B6B6B] text-white text-xs font-medium leading-normal transition-colors'
            },
            React.createElement('span', { className: 'truncate' }, 'Logout')
          )
        ) : React.createElement(
          React.Fragment,
          null,
          React.createElement(
            Link,
            { 
              to: '/signup',
              className: 'hidden sm:flex min-w-[50px] md:min-w-[60px] cursor-pointer items-center justify-center overflow-hidden rounded h-7 md:h-8 px-2 md:px-3 bg-[#2B2A29] hover:bg-[#3B3A39] text-white text-xs font-medium leading-normal transition-colors'
            },
            React.createElement('span', { className: 'truncate' }, 'Sign Up')
          ),
          React.createElement(
            Link,
            { 
              to: '/login',
              className: 'hidden sm:flex min-w-[50px] md:min-w-[60px] cursor-pointer items-center justify-center overflow-hidden rounded h-7 md:h-8 px-2 md:px-3 bg-[#5B5B5B] hover:bg-[#6B6B6B] text-white text-xs font-medium leading-normal transition-colors'
            },
            React.createElement('span', { className: 'truncate' }, 'Log In')
          )
        ),
        // Mobile Menu Button
        React.createElement(
          'button',
          {
            className: 'lg:hidden flex items-center justify-center w-8 h-8 text-gray-700 hover:text-[#2B2A29]',
            onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen)
          },
          React.createElement(
            'svg',
            { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', { 
              strokeLinecap: 'round', 
              strokeLinejoin: 'round', 
              strokeWidth: 2, 
              d: isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'
            })
          )
        )
      )
    ),
    // Mobile Menu
    isMobileMenuOpen && React.createElement(
      'div',
      { className: 'lg:hidden w-full order-3 py-4 border-t border-gray-200' },
      React.createElement(
        'nav',
        { className: 'flex flex-col gap-4' },
        React.createElement(
          Link,
          { 
            to: '/', 
            className: getLinkClass('/') + ' block px-2 py-2',
            onClick: () => setIsMobileMenuOpen(false)
          },
          'Home'
        ),
        React.createElement(
          Link,
          { 
            to: '/products', 
            className: getLinkClass('/products') + ' block px-2 py-2',
            onClick: () => setIsMobileMenuOpen(false)
          },
          'Products'
        ),
        React.createElement(
          Link,
          { 
            to: '/about', 
            className: getLinkClass('/about') + ' block px-2 py-2',
            onClick: () => setIsMobileMenuOpen(false)
          },
          'About'
        ),
        React.createElement(
          Link,
          { 
            to: '/contact', 
            className: getLinkClass('/contact') + ' block px-2 py-2',
            onClick: () => setIsMobileMenuOpen(false)
          },
          'Contact'
        ),
        user ? React.createElement(
          React.Fragment,
          null,
          React.createElement('div', { className: 'text-xs text-gray-600 px-2' }, user.email),
          React.createElement(
            'button',
            { 
              onClick: () => { handleLogout(); setIsMobileMenuOpen(false); },
              className: 'flex min-w-[50px] cursor-pointer items-center justify-center overflow-hidden rounded h-8 px-3 bg-[#5B5B5B] hover:bg-[#6B6B6B] text-white text-xs font-medium leading-normal transition-colors mt-2'
            },
            React.createElement('span', { className: 'truncate' }, 'Logout')
          )
        ) : React.createElement(
          React.Fragment,
          null,
          React.createElement(
            Link,
            { 
              to: '/signup',
              onClick: () => setIsMobileMenuOpen(false),
              className: 'flex min-w-[50px] cursor-pointer items-center justify-center overflow-hidden rounded h-8 px-3 bg-[#2B2A29] hover:bg-[#3B3A39] text-white text-xs font-medium leading-normal transition-colors'
            },
            React.createElement('span', { className: 'truncate' }, 'Sign Up')
          ),
          React.createElement(
            Link,
            { 
              to: '/login',
              onClick: () => setIsMobileMenuOpen(false),
              className: 'flex min-w-[50px] cursor-pointer items-center justify-center overflow-hidden rounded h-8 px-3 bg-[#5B5B5B] hover:bg-[#6B6B6B] text-white text-xs font-medium leading-normal transition-colors mt-2'
            },
            React.createElement('span', { className: 'truncate' }, 'Log In')
          )
        )
      )
    )
  )
  );
};

export default Header;
