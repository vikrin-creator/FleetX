import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar.js';
import ProductCategories from './ProductCategories.js';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Add some basic initialization
    try {
      console.log('Admin component mounted');
      setIsLoading(false);
    } catch (err) {
      console.error('Admin initialization error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return React.createElement(
      'div', 
      { className: 'flex items-center justify-center min-h-screen' },
      React.createElement('div', { className: 'text-lg' }, 'Loading Admin...')
    );
  }

  if (error) {
    return React.createElement(
      'div', 
      { className: 'flex items-center justify-center min-h-screen' },
      React.createElement('div', { className: 'text-red-600' }, 'Error: ' + error)
    );
  }

  const renderContent = function() {
    switch(activeTab) {
      case 'dashboard':
        return React.createElement(
          'div',
          { className: 'p-8' },
          React.createElement('h1', { className: 'text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4' }, 'Dashboard'),
          React.createElement('p', { className: 'text-slate-600 dark:text-slate-400' }, 'Dashboard content coming soon...')
        );
      case 'products':
        return React.createElement(ProductCategories, null);
      case 'vehicles':
        return React.createElement(
          'div',
          { className: 'p-8' },
          React.createElement('h1', { className: 'text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4' }, 'Vehicles'),
          React.createElement('p', { className: 'text-slate-600 dark:text-slate-400' }, 'Vehicles management coming soon...')
        );
      case 'orders':
        return React.createElement(
          'div',
          { className: 'p-8' },
          React.createElement('h1', { className: 'text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4' }, 'Orders'),
          React.createElement('p', { className: 'text-slate-600 dark:text-slate-400' }, 'Orders management coming soon...')
        );
      case 'customers':
        return React.createElement(
          'div',
          { className: 'p-8' },
          React.createElement('h1', { className: 'text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4' }, 'Customers'),
          React.createElement('p', { className: 'text-slate-600 dark:text-slate-400' }, 'Customer management coming soon...')
        );
      case 'inventory':
        return React.createElement(
          'div',
          { className: 'p-8' },
          React.createElement('h1', { className: 'text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4' }, 'Inventory'),
          React.createElement('p', { className: 'text-slate-600 dark:text-slate-400' }, 'Inventory management coming soon...')
        );
      case 'reports':
        return React.createElement(
          'div',
          { className: 'p-8' },
          React.createElement('h1', { className: 'text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4' }, 'Reports'),
          React.createElement('p', { className: 'text-slate-600 dark:text-slate-400' }, 'Reports coming soon...')
        );
      case 'settings':
        return React.createElement(
          'div',
          { className: 'p-8' },
          React.createElement('h1', { className: 'text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4' }, 'Settings'),
          React.createElement('p', { className: 'text-slate-600 dark:text-slate-400' }, 'Settings coming soon...')
        );
      default:
        return React.createElement(
          'div',
          { className: 'p-8' },
          React.createElement('h1', { className: 'text-3xl font-bold text-slate-900 dark:text-slate-50' }, 'Dashboard')
        );
    }
  };

  return React.createElement(
    'div',
    { className: 'flex min-h-screen bg-background-light dark:bg-background-dark' },
    // Sidebar
    React.createElement(Sidebar, {
      activeTab: activeTab,
      onTabChange: setActiveTab
    }),
    // Main Content Area
    React.createElement(
      'div',
      { className: 'flex-1 ml-64 transition-all duration-300' },
      // Top Header
      React.createElement(
        'header',
        { className: 'sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between px-8 py-4' },
          React.createElement(
            'div',
            null,
            React.createElement('h1', { className: 'text-2xl font-bold text-slate-900 dark:text-slate-50' }, 'Admin Panel'),
            React.createElement('p', { className: 'text-sm text-slate-500 dark:text-slate-400' }, 'Manage your fleet parts business')
          ),
          React.createElement(
            'div',
            { className: 'flex items-center gap-4' },
            // Notifications
            React.createElement(
              'button',
              { className: 'relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300' },
              React.createElement('span', { className: 'material-symbols-outlined' }, 'notifications'),
              React.createElement('span', { className: 'absolute top-2 right-2 h-2 w-2 bg-primary rounded-full' })
            ),
            // Profile
            React.createElement(
              'button',
              { className: 'flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800' },
              React.createElement(
                'div',
                { className: 'flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white' },
                React.createElement('span', { className: 'text-sm font-semibold' }, 'A')
              ),
              React.createElement(
                'div',
                { className: 'text-left hidden md:block' },
                React.createElement('p', { className: 'text-sm font-medium text-slate-900 dark:text-slate-50' }, 'Admin User'),
                React.createElement('p', { className: 'text-xs text-slate-500 dark:text-slate-400' }, 'Administrator')
              )
            )
          )
        )
      ),
      // Page Content
      React.createElement(
        'main',
        { className: 'min-h-screen' },
        renderContent()
      )
    )
  );
};

export default Admin;
