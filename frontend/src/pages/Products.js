import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../services/categoryService.js';

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [categoryItems, setCategoryItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [viewMode, setViewMode] = useState('categories'); // 'categories' or 'items'

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getCategories();
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response && response.success && Array.isArray(response.data)) {
        data = response.data;
      } else if (response && response.data && Array.isArray(response.data)) {
        data = response.data;
      }
      setCategories(data);
      
      // Fetch items for each category
      const itemsMap = {};
      for (const category of data) {
        try {
          const items = await categoryAPI.getCategoryItems(category.id);
          itemsMap[category.id] = Array.isArray(items) ? items : [];
        } catch (error) {
          console.error(`Failed to fetch items for category ${category.id}:`, error);
          itemsMap[category.id] = [];
        }
      }
      setCategoryItems(itemsMap);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on search query and selected category
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    if (categoryName === 'All Categories') {
      setViewMode('categories');
      setSelectedCategoryId(null);
    }
  };

  const handleCategoryCardClick = (category) => {
    setSelectedCategoryId(category.id);
    setSelectedCategory(category.name);
    setViewMode('items');
  };

  const handleBackToCategories = () => {
    setViewMode('categories');
    setSelectedCategoryId(null);
    setSelectedCategory('All Categories');
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const closeItemModal = () => {
    setShowItemModal(false);
    setSelectedItem(null);
  };

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
              React.createElement(
                'button',
                {
                  key: 'all',
                  onClick: () => handleCategoryClick('All Categories'),
                  className: selectedCategory === 'All Categories'
                    ? 'flex items-center w-full text-left px-4 py-2 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 font-semibold text-sm'
                    : 'flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium transition-colors text-sm'
                },
                'All Categories'
              ),
              categories.map((category) =>
                React.createElement(
                  'div',
                  { key: category.id, className: 'space-y-1' },
                  React.createElement(
                    'button',
                    {
                      onClick: () => handleCategoryClick(category.name),
                      className: selectedCategory === category.name
                        ? 'flex items-center w-full text-left px-4 py-2 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 font-semibold text-sm'
                        : 'flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium transition-colors text-sm'
                    },
                    React.createElement(
                      'span',
                      { className: 'flex-1' },
                      category.name
                    ),
                    React.createElement(
                      'span',
                      { className: 'text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full' },
                      (categoryItems[category.id] || []).length
                    )
                  ),
                  // Show items under category if expanded
                  selectedCategory === category.name && (categoryItems[category.id] || []).length > 0 &&
                  React.createElement(
                    'div',
                    { className: 'ml-4 space-y-1' },
                    (categoryItems[category.id] || []).slice(0, 5).map((item) =>
                      React.createElement(
                        'button',
                        {
                          key: item.id,
                          onClick: () => handleItemClick(item),
                          className: 'block w-full text-left px-3 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors'
                        },
                        item.name
                      )
                    ),
                    (categoryItems[category.id] || []).length > 5 &&
                    React.createElement(
                      'div',
                      { className: 'text-xs text-slate-400 px-3 py-1' },
                      `+${(categoryItems[category.id] || []).length - 5} more`
                    )
                  )
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
          // Back button when viewing items
          viewMode === 'items' &&
          React.createElement(
            'div',
            { className: 'mb-6' },
            React.createElement(
              'button',
              {
                onClick: handleBackToCategories,
                className: 'flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              },
              React.createElement('span', { className: 'material-symbols-outlined' }, 'arrow_back'),
              'Back to Categories'
            ),
            React.createElement('h2', { className: 'text-2xl font-bold text-slate-900 dark:text-slate-50 mt-2' }, selectedCategory)
          ),
          loading ? 
            React.createElement(
              'div',
              { className: 'text-center py-12' },
              React.createElement('div', { className: 'inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary' }),
              React.createElement('p', { className: 'mt-4 text-gray-600' }, 'Loading...')
            ) :
            viewMode === 'categories' ?
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' },
              (filteredCategories.length > 0 ? filteredCategories : categories).map((category, index) =>
                React.createElement(
                  'div',
                  {
                    key: category.id || index,
                    onClick: () => handleCategoryCardClick(category),
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
                    React.createElement('p', { className: 'text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal' }, category.description),
                    React.createElement(
                      'p',
                      { className: 'text-slate-600 dark:text-slate-400 text-xs mt-2' },
                      `${(categoryItems[category.id] || []).length} items`
                    )
                  )
                )
              )
            ) :
            // Items view
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' },
              (categoryItems[selectedCategoryId] || []).map((item) =>
                React.createElement(
                  'div',
                  {
                    key: item.id,
                    onClick: () => handleItemClick(item),
                    className: 'group flex flex-col gap-3 pb-3 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                  },
                  React.createElement('div', {
                    className: 'w-full bg-center bg-no-repeat aspect-video bg-cover',
                    style: { 
                      backgroundImage: `url("${item.image_url || 'https://via.placeholder.com/300x200'}")` 
                    }
                  }),
                  React.createElement(
                    'div',
                    { className: 'p-4 pt-0' },
                    React.createElement('p', { className: 'text-slate-900 dark:text-slate-50 text-base font-bold leading-normal' }, item.name),
                    React.createElement('p', { className: 'text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal' }, item.description || 'No description'),
                    React.createElement(
                      'div',
                      { className: 'flex justify-between items-center mt-2' },
                      item.price && React.createElement('p', { className: 'text-primary font-semibold' }, `$${parseFloat(item.price).toFixed(2)}`),
                      item.part_number && React.createElement('p', { className: 'text-slate-500 text-xs' }, item.part_number)
                    )
                  )
                )
              )
            )
        )
      )
    ),

    // Item Detail Modal
    showItemModal && selectedItem && React.createElement(
      'div',
      { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
      React.createElement(
        'div',
        { className: 'bg-white dark:bg-slate-900 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto' },
        React.createElement(
          'div',
          { className: 'flex justify-between items-center mb-4' },
          React.createElement('h2', { className: 'text-xl font-bold text-slate-900 dark:text-slate-50' }, selectedItem.name),
          React.createElement(
            'button',
            {
              onClick: closeItemModal,
              className: 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            },
            React.createElement('span', { className: 'material-symbols-outlined text-2xl' }, 'close')
          )
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
          React.createElement(
            'div',
            null,
            React.createElement('img', {
              src: selectedItem.image_url || 'https://via.placeholder.com/400x300',
              alt: selectedItem.name,
              className: 'w-full h-64 object-cover rounded-lg'
            })
          ),
          React.createElement(
            'div',
            { className: 'space-y-4' },
            React.createElement('p', { className: 'text-slate-600 dark:text-slate-400' }, selectedItem.description || 'No description available'),
            selectedItem.part_number && React.createElement(
              'div',
              null,
              React.createElement('h4', { className: 'font-semibold text-slate-900 dark:text-slate-50' }, 'Part Number:'),
              React.createElement('p', { className: 'text-slate-600 dark:text-slate-400' }, selectedItem.part_number)
            ),
            selectedItem.price && React.createElement(
              'div',
              null,
              React.createElement('h4', { className: 'font-semibold text-slate-900 dark:text-slate-50' }, 'Price:'),
              React.createElement('p', { className: 'text-2xl font-bold text-primary' }, `$${parseFloat(selectedItem.price).toFixed(2)}`)
            ),
            React.createElement(
              'div',
              null,
              React.createElement('h4', { className: 'font-semibold text-slate-900 dark:text-slate-50' }, 'Stock:'),
              React.createElement('p', { className: 'text-slate-600 dark:text-slate-400' }, `${selectedItem.stock_quantity || 0} units`)
            ),
            React.createElement(
              'div',
              null,
              React.createElement('h4', { className: 'font-semibold text-slate-900 dark:text-slate-50' }, 'Status:'),
              React.createElement(
                'span',
                { 
                  className: `px-3 py-1 rounded-full text-sm ${
                    selectedItem.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedItem.status === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`
                },
                selectedItem.status === 'active' ? 'Available' :
                selectedItem.status === 'out_of_stock' ? 'Out of Stock' : 'Unavailable'
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'flex justify-end gap-3 mt-6' },
          React.createElement(
            'button',
            {
              onClick: closeItemModal,
              className: 'px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800'
            },
            'Close'
          ),
          selectedItem.status === 'active' &&
          React.createElement(
            'button',
            {
              className: 'px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90'
            },
            'Add to Cart'
          )
        )
      )
    )
  );
};

export default Products;