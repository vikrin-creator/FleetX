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
      // Handle both array response and object with data property
      const data = Array.isArray(response) ? response : response.data || [];
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

  return React.createElement(
    'div',
    { className: 'w-full' },
    
    // Header Section
    React.createElement(
      'div',
      { className: 'bg-gradient-to-r from-primary to-blue-700 text-white py-12 md:py-16' },
      React.createElement(
        'div',
        { className: 'container mx-auto px-4 text-center' },
        React.createElement('h1', { className: 'text-3xl md:text-5xl font-bold mb-4' }, 'Our Products'),
        React.createElement('p', { className: 'text-lg md:text-xl opacity-90 max-w-2xl mx-auto' }, 'Explore our comprehensive collection of heavy-duty truck parts and accessories')
      )
    ),

    // Search Section
    React.createElement(
      'div',
      { className: 'container mx-auto px-4 py-8' },
      React.createElement(
        'div',
        { className: 'max-w-2xl mx-auto mb-8' },
        React.createElement(
          'div',
          { className: 'relative' },
          React.createElement(
            'div',
            { className: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none' },
            React.createElement('span', { className: 'material-symbols-outlined text-gray-400' }, 'search')
          ),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Search products...',
            className: 'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary',
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value)
          })
        )
      ),

      // Loading State
      loading ? React.createElement(
        'div',
        { className: 'text-center py-12' },
        React.createElement(
          'div',
          { className: 'inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary' }
        ),
        React.createElement('p', { className: 'mt-4 text-gray-600' }, 'Loading products...')
      ) :

      // Categories Grid
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-2xl md:text-3xl font-bold text-gray-900 mb-8' }, 'Product Categories'),
        filteredCategories.length === 0 ? 
          React.createElement(
            'div',
            { className: 'text-center py-12' },
            React.createElement('p', { className: 'text-gray-600 text-lg' }, 'No products found')
          ) :
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' },
            filteredCategories.map((category, index) =>
              React.createElement(
                'div',
                { 
                  key: category.id || index, 
                  className: 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group' 
                },
                React.createElement(
                  'div',
                  { className: 'relative h-48 bg-gray-200' },
                  category.image_url ? 
                    React.createElement('img', {
                      src: category.image_url,
                      alt: category.name,
                      className: 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    }) :
                    React.createElement(
                      'div',
                      { className: 'w-full h-full flex items-center justify-center bg-gray-100' },
                      React.createElement('span', { className: 'material-symbols-outlined text-4xl text-gray-400' }, 'image')
                    )
                ),
                React.createElement(
                  'div',
                  { className: 'p-4' },
                  React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-2' }, category.name),
                  category.description && React.createElement('p', { className: 'text-gray-600 text-sm mb-3' }, category.description),
                  React.createElement(
                    'button',
                    { className: 'w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors duration-200' },
                    'View Products'
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