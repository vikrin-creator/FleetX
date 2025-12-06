import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../services/categoryService.js';

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getCategories();
      // Handle different response formats
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response && response.success && Array.isArray(response.data)) {
        data = response.data;
      } else if (response && response.data && Array.isArray(response.data)) {
        data = response.data;
      }
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebarCategories = [
    'All Categories',
    'Brakes & Wheel End',
    'Engine Components', 
    'Lighting & Electrical',
    'Suspension',
    'Exhaust Systems',
    'Filters & Fluids',
    'Cabin & Interior',
    'Tires & Wheels',
    'New Arrivals'
  ];

  return React.createElement(
    'div',
    { className: 'container mx-auto px-4 py-8 md:py-16' },
    React.createElement(
      'div',
      { className: 'flex flex-col md:flex-row gap-8' },
      
      // Sidebar
      React.createElement(
        'aside',
        { className: 'w-full md:w-64 lg:w-72 flex-shrink-0' },
        React.createElement(
          'div',
          { className: 'sticky top-24 space-y-6' },
          React.createElement(
            'div',
            null,
            React.createElement('h3', { className: 'text-lg font-bold text-slate-900 dark:text-slate-50 mb-4' }, 'Categories'),
            React.createElement(
              'nav',
              { className: 'space-y-2' },
              sidebarCategories.map((category, index) =>
                React.createElement(
                  'a',
                  {
                    key: index,
                    href: '#',
                    className: index === 0 
                      ? 'flex items-center px-4 py-2 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 font-semibold'
                      : 'flex items-center px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium'
                  },
                  category
                )
              )
            )
          )
        )
      ),

      // Main Content
      React.createElement(
        'div',
        { className: 'flex-1' },
        
        // Search and Filters Section
        React.createElement(
          'section',
          { className: 'mb-8' },
          React.createElement(
            'div',
            { className: 'flex flex-col md:flex-row items-center gap-4' },
            React.createElement(
              'div',
              { className: 'w-full flex-1' },
              React.createElement(
                'label',
                { className: 'flex flex-col min-w-40 h-12 w-full' },
                React.createElement(
                  'div',
                  { className: 'flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-200 dark:bg-slate-800' },
                  React.createElement(
                    'div',
                    { className: 'text-slate-500 dark:text-slate-400 flex items-center justify-center pl-4' },
                    React.createElement('span', { className: 'material-symbols-outlined' }, 'search')
                  ),
                  React.createElement('input', {
                    className: 'form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-slate-900 dark:text-slate-50 focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-slate-500 dark:placeholder:text-slate-400 pl-2 text-base font-normal',
                    placeholder: 'Search for a category...',
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value)
                  })
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'w-full md:w-auto overflow-x-auto' },
              React.createElement(
                'div',
                { className: 'flex gap-3 whitespace-nowrap' },
                ['Popular', 'New Arrivals', 'On Sale'].map((filter, index) =>
                  React.createElement(
                    'div',
                    {
                      key: index,
                      className: 'flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 pl-4 pr-4'
                    },
                    React.createElement('p', { className: 'text-sm font-medium' }, filter)
                  )
                )
              )
            )
          )
        ),

        // Products Grid
        React.createElement(
          'section',
          { className: 'w-full' },
          loading ? 
            React.createElement(
              'div',
              { className: 'text-center py-12' },
              React.createElement('div', { className: 'inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary' }),
              React.createElement('p', { className: 'mt-4 text-gray-600' }, 'Loading categories...')
            ) :
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6' },
              (filteredCategories.length > 0 ? filteredCategories : categories).map((category, index) =>
                React.createElement(
                  'div',
                  {
                    key: category.id || index,
                    className: 'group flex flex-col gap-3 pb-3 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                  },
                  React.createElement('div', {
                    className: 'w-full bg-center bg-no-repeat aspect-video bg-cover',
                    style: { 
                      backgroundImage: `url("${category.image_url || 'https://via.placeholder.com/300x200'}")` 
                    }
                  }),
                  React.createElement(
                    'div',
                    { className: 'p-4 pt-0' },
                    React.createElement('p', { className: 'text-slate-900 dark:text-slate-50 text-base font-bold leading-normal' }, category.name),
                    React.createElement('p', { className: 'text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal' }, category.description)
                  )
                )
              )
            )
        )
      )
    )
  );
};

export default Products;