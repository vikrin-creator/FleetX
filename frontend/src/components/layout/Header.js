import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, loading } = useAuth();

  useEffect(() => {
    updateCartCount();
  }, []);

  useEffect(() => {
    // Listen for storage changes to update cart count
    const handleStorageChange = () => {
      updateCartCount();
    };
    
    // Listen for custom cart update events
    const handleCartUpdate = () => {
      updateCartCount();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdate', handleCartUpdate);
    // Also check cart on location change
    updateCartCount();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdate', handleCartUpdate);
    };
  }, [location]);

  useEffect(() => {
    // Close profile menu when clicking outside
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      // Navigate anyway
      navigate('/');
    }
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
        { className: 'flex gap-1.5 items-center' },
        // Cart Icon (Hidden on mobile)
        React.createElement(
          'button',
          { 
            onClick: () => navigate('/cart'),
            className: 'hidden lg:flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors relative'
          },
          React.createElement(
            'svg',
            { className: 'w-6 h-6 text-gray-700', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', { 
              strokeLinecap: 'round', 
              strokeLinejoin: 'round', 
              strokeWidth: 2, 
              d: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
            })
          ),
          // Cart count badge
          cartCount > 0 && React.createElement(
            'span',
            { className: 'absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center' },
            cartCount > 99 ? '99+' : cartCount
          )
        ),
        // Profile Icon with Dropdown (Hidden on mobile)
        isAuthenticated ? React.createElement(
          'div',
          { className: 'relative profile-dropdown hidden lg:block' },
          React.createElement(
            'button',
            { 
              onClick: () => setIsProfileMenuOpen(!isProfileMenuOpen),
              className: 'flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors'
            },
            React.createElement(
              'svg',
              { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
              React.createElement('path', { 
                strokeLinecap: 'round', 
                strokeLinejoin: 'round', 
                strokeWidth: 2, 
                d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              })
            )
          ),
          // Dropdown Menu
          isProfileMenuOpen && React.createElement(
            'div',
            { className: 'absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50' },
            React.createElement(
              'div',
              { className: 'px-4 py-3 border-b border-gray-200' },
              React.createElement('p', { className: 'text-sm font-semibold text-gray-900 truncate' }, user.email),
              React.createElement('p', { className: 'text-xs text-gray-500 mt-1' }, 'Manage your account')
            ),
            React.createElement(
              'button',
              { 
                onClick: () => {
                  setIsProfileMenuOpen(false);
                  navigate('/profile');
                },
                className: 'w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3'
              },
              React.createElement(
                'svg',
                { className: 'w-5 h-5 text-gray-500', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                React.createElement('path', { 
                  strokeLinecap: 'round', 
                  strokeLinejoin: 'round', 
                  strokeWidth: 2, 
                  d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                })
              ),
              'Profile'
            ),
            React.createElement(
              'button',
              { 
                onClick: () => {
                  setIsProfileMenuOpen(false);
                  navigate('/my-orders');
                },
                className: 'w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3'
              },
              React.createElement(
                'svg',
                { className: 'w-5 h-5 text-gray-500', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                React.createElement('path', { 
                  strokeLinecap: 'round', 
                  strokeLinejoin: 'round', 
                  strokeWidth: 2, 
                  d: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                })
              ),
              'My Orders'
            ),
            React.createElement(
              'button',
              { 
                onClick: () => {
                  setIsProfileMenuOpen(false);
                  navigate('/my-addresses');
                },
                className: 'w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3'
              },
              React.createElement(
                'svg',
                { className: 'w-5 h-5 text-gray-500', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                React.createElement('path', { 
                  strokeLinecap: 'round', 
                  strokeLinejoin: 'round', 
                  strokeWidth: 2, 
                  d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                })
              ),
              'My Addresses'
            ),
            React.createElement(
              'button',
              { 
                onClick: () => {
                  setIsProfileMenuOpen(false);
                  navigate('/change-password');
                },
                className: 'w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3'
              },
              React.createElement(
                'svg',
                { className: 'w-5 h-5 text-gray-500', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                React.createElement('path', { 
                  strokeLinecap: 'round', 
                  strokeLinejoin: 'round', 
                  strokeWidth: 2, 
                  d: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'
                })
              ),
              'Change Password'
            ),
            React.createElement('div', { className: 'border-t border-gray-200 my-2' }),
            React.createElement(
              'button',
              { 
                onClick: () => {
                  setIsProfileMenuOpen(false);
                  handleLogout();
                },
                className: 'w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3'
              },
              React.createElement(
                'svg',
                { className: 'w-5 h-5 text-red-600', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                React.createElement('path', { 
                  strokeLinecap: 'round', 
                  strokeLinejoin: 'round', 
                  strokeWidth: 2, 
                  d: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                })
              ),
              'Logout'
            )
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
        // Cart Link (Mobile)
        React.createElement(
          'button',
          { 
            onClick: () => { navigate('/cart'); setIsMobileMenuOpen(false); },
            className: 'flex items-center gap-3 px-2 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium'
          },
          React.createElement(
            'div',
            { className: 'relative' },
            React.createElement(
              'svg',
              { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
              React.createElement('path', { 
                strokeLinecap: 'round', 
                strokeLinejoin: 'round', 
                strokeWidth: 2, 
                d: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
              })
            ),
            cartCount > 0 && React.createElement(
              'span',
              { className: 'absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center' },
              cartCount > 9 ? '9+' : cartCount
            )
          ),
          React.createElement('span', null, 'Cart'),
          cartCount > 0 && React.createElement('span', { className: 'text-xs text-gray-500' }, `(${cartCount} items)`)
        ),
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
        isAuthenticated ? React.createElement(
          React.Fragment,
          null,
          // User Info Section
          React.createElement(
            'div',
            { className: 'border-t border-gray-200 pt-4 mt-2' },
            React.createElement(
              'div',
              { className: 'flex items-center gap-3 px-2 pb-3 border-b border-gray-200' },
              React.createElement(
                'div',
                { className: 'flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-semibold' },
                user.email?.charAt(0).toUpperCase() || 'U'
              ),
              React.createElement(
                'div',
                { className: 'flex-1 min-w-0' },
                React.createElement('p', { className: 'text-sm font-semibold text-gray-900 truncate' }, user.email),
                React.createElement('p', { className: 'text-xs text-gray-500' }, 'Account')
              )
            )
          ),
          // Profile Menu Items
          React.createElement(
            'button',
            { 
              onClick: () => { navigate('/profile'); setIsMobileMenuOpen(false); },
              className: 'w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 rounded'
            },
            React.createElement(
              'svg',
              { className: 'w-5 h-5 text-gray-500', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
              React.createElement('path', { 
                strokeLinecap: 'round', 
                strokeLinejoin: 'round', 
                strokeWidth: 2, 
                d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              })
            ),
            'Profile'
          ),
          React.createElement(
            'button',
            { 
              onClick: () => { navigate('/my-orders'); setIsMobileMenuOpen(false); },
              className: 'w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 rounded'
            },
            React.createElement(
              'svg',
              { className: 'w-5 h-5 text-gray-500', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
              React.createElement('path', { 
                strokeLinecap: 'round', 
                strokeLinejoin: 'round', 
                strokeWidth: 2, 
                d: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
              })
            ),
            'My Orders'
          ),
          React.createElement(
            'button',
            { 
              onClick: () => { navigate('/my-addresses'); setIsMobileMenuOpen(false); },
              className: 'w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 rounded'
            },
            React.createElement(
              'svg',
              { className: 'w-5 h-5 text-gray-500', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
              React.createElement('path', { 
                strokeLinecap: 'round', 
                strokeLinejoin: 'round', 
                strokeWidth: 2, 
                d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z'
              })
            ),
            'My Addresses'
          ),
          React.createElement(
            'button',
            { 
              onClick: () => { navigate('/change-password'); setIsMobileMenuOpen(false); },
              className: 'w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 rounded'
            },
            React.createElement(
              'svg',
              { className: 'w-5 h-5 text-gray-500', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
              React.createElement('path', { 
                strokeLinecap: 'round', 
                strokeLinejoin: 'round', 
                strokeWidth: 2, 
                d: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'
              })
            ),
            'Change Password'
          ),
          React.createElement(
            'button',
            { 
              onClick: () => { handleLogout(); setIsMobileMenuOpen(false); },
              className: 'w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 rounded mt-2 border-t border-gray-200 pt-4'
            },
            React.createElement(
              'svg',
              { className: 'w-5 h-5 text-red-600', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
              React.createElement('path', { 
                strokeLinecap: 'round', 
                strokeLinejoin: 'round', 
                strokeWidth: 2, 
                d: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
              })
            ),
            'Logout'
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
