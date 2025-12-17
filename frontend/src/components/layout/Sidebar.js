import React, { useState } from 'react';

const Sidebar = ({ activeTab, onTabChange, isMobileOpen, setIsMobileOpen, onCollapseChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'products', label: 'Product Categories', icon: 'category' },
    { id: 'inventory', label: 'Product Management', icon: 'inventory_2' },
    { id: 'orders', label: 'Orders', icon: 'shopping_bag' },
    { id: 'customers', label: 'Customers', icon: 'people' }
  ];

  return React.createElement(
    React.Fragment,
    null,
    // Mobile overlay
    isMobileOpen && React.createElement('div', {
      className: 'fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden',
      onClick: () => setIsMobileOpen(false)
    }),
    // Sidebar
    React.createElement(
    'aside',
    {
      className: 'fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-50 ' + 
        (isCollapsed ? 'w-20' : 'w-64') + ' ' +
        (isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')
    },
    React.createElement(
      'div',
      { className: 'flex flex-col h-full' },
      // Header
      React.createElement(
        'div',
        { className: 'flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800' },
        !isCollapsed && React.createElement(
          'div',
          { className: 'flex items-center gap-3 text-slate-900 dark:text-slate-50' },
          React.createElement(
            'div',
            { className: 'size-8 text-primary' },
            React.createElement(
              'svg',
              { fill: 'none', viewBox: '0 0 48 48', xmlns: 'http://www.w3.org/2000/svg' },
              React.createElement('path', {
                d: 'M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z',
                fill: 'currentColor'
              })
            )
          ),
          React.createElement('h2', { className: 'text-lg font-bold' }, 'Fleet X Admin')
        ),
        React.createElement(
          'button',
          {
            onClick: handleToggleCollapse,
            className: 'flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
          },
          React.createElement('span', { className: 'material-symbols-outlined text-xl' }, isCollapsed ? 'menu' : 'menu_open')
        )
      ),
      // Navigation
      React.createElement(
        'nav',
        { className: 'flex-1 overflow-y-auto p-4' },
        React.createElement(
          'div',
          { className: 'space-y-2' },
          menuItems.map(function(item) {
            return React.createElement(
              'button',
              {
                key: item.id,
                onClick: function() { 
                  onTabChange(item.id);
                  if (setIsMobileOpen) setIsMobileOpen(false);
                },
                className: 'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ' + (
                  activeTab === item.id
                    ? 'bg-primary text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                ),
                title: isCollapsed ? item.label : ''
              },
              React.createElement('span', { className: 'material-symbols-outlined text-xl' }, item.icon),
              !isCollapsed && React.createElement('span', { className: 'text-sm font-medium' }, item.label)
            );
          })
        )
      ),
      // Footer
      React.createElement(
        'div',
        { className: 'p-4 border-t border-slate-200 dark:border-slate-800' },
        React.createElement(
          'button',
          {
            className: 'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors',
            title: isCollapsed ? 'Logout' : ''
          },
          React.createElement('span', { className: 'material-symbols-outlined text-xl' }, 'logout'),
          !isCollapsed && React.createElement('span', { className: 'text-sm font-medium' }, 'Logout')
        )
      )
    )
    )
  );
};

export default Sidebar;
