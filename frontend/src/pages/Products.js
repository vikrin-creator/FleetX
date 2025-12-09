import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { categoryAPI } from '../services/categoryService.js';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoryItems, setCategoryItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [viewMode, setViewMode] = useState('categories'); // 'categories' or 'items'
  const [testItems, setTestItems] = useState([]); // For testing direct API call

  useEffect(() => {
    fetchCategories();
    // Test direct API call for Air Brake & Wheel items
    testFetchItems();
  }, []);

  // Handle navigation from search results
  useEffect(() => {
    if (location.state) {
      const { selectedCategoryId, selectedCategoryName, selectedItem } = location.state;
      
      if (selectedCategoryId) {
        setSelectedCategoryId(selectedCategoryId);
        setSelectedCategory(selectedCategoryName);
        setViewMode('items');
        
        if (selectedItem) {
          setSelectedItem(selectedItem);
          setShowItemModal(true);
        }
      }
      
      // Clear navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const testFetchItems = async () => {
    try {
      console.log('=== DIRECT API TEST ===');
      
      // Test 1: Original API endpoint
      console.log('Testing original API...');
      const response1 = await fetch('https://sandybrown-squirrel-472536.hostingersite.com/backend/api/categories/items/5');
      console.log('Original API Response status:', response1.status);
      
      if (response1.ok) {
        const data1 = await response1.json();
        console.log('Original API response:', data1);
      }
      
      // Test 2: Direct test endpoint
      console.log('Testing direct endpoint...');
      const response2 = await fetch('https://sandybrown-squirrel-472536.hostingersite.com/backend/test-category-items.php');
      console.log('Direct test Response status:', response2.status);
      
      if (response2.ok) {
        const data2 = await response2.json();
        console.log('Direct test response:', data2);
        
        // Store items for display
        const items = data2.success ? (data2.data || []) : (Array.isArray(data2) ? data2 : []);
        setTestItems(items);
      }
      
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

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
          console.log(`Fetching items for category: ${category.name} (ID: ${category.id})`);
          const items = await categoryAPI.getCategoryItems(category.id);
          console.log(`Items for ${category.name}:`, items);
          console.log(`Items array check:`, Array.isArray(items), items?.length || 0);
          itemsMap[category.id] = Array.isArray(items) ? items : [];
        } catch (error) {
          console.error(`Failed to fetch items for category ${category.id}:`, error);
          itemsMap[category.id] = [];
        }
      }
      setCategoryItems(itemsMap);
      console.log('All category items:', itemsMap);
      console.log('Category items for Air Brake & Wheel (ID 5):', itemsMap[5]);
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

  const handleCategoryClick = (categoryName, categoryId = null) => {
    setSelectedCategory(categoryName);
    if (categoryName === 'All Categories') {
      setViewMode('categories');
      setSelectedCategoryId(null);
    } else if (categoryId) {
      // When clicking on a specific category in sidebar, show its items
      setSelectedCategoryId(categoryId);
      setViewMode('items');
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
    
    // Test display for direct API call
    // Removed green debug box
    
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
            viewMode === 'categories' ?
            React.createElement('h3', { className: 'text-lg font-bold text-slate-900 dark:text-slate-50 mb-4' }, 'Categories') :
            selectedItem ?
            React.createElement(
              'div',
              { className: 'mb-4 flex items-center gap-1 flex-wrap' },
              React.createElement(
                'button',
                {
                  onClick: handleBackToCategories,
                  className: 'text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors'
                },
                'Categories'
              ),
              React.createElement('span', { className: 'text-sm font-bold text-slate-500 dark:text-slate-400' }, ' > '),
              React.createElement(
                'button',
                {
                  onClick: () => {
                    setSelectedItem(null);
                    setShowItemModal(false);
                  },
                  className: 'text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors'
                },
                selectedCategory
              ),
              React.createElement('span', { className: 'text-sm font-bold text-slate-500 dark:text-slate-400' }, ' > '),
              React.createElement('span', { className: 'text-sm font-bold text-slate-900 dark:text-slate-50' }, selectedItem.name)
            ) :
            React.createElement(
              'div',
              { className: 'mb-4 flex items-center gap-1' },
              React.createElement(
                'button',
                {
                  onClick: handleBackToCategories,
                  className: 'text-lg font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors'
                },
                'Categories'
              ),
              React.createElement('span', { className: 'text-lg font-bold text-slate-500 dark:text-slate-400' }, ' > '),
              React.createElement('span', { className: 'text-lg font-bold text-slate-900 dark:text-slate-50' }, selectedCategory)
            ),
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
                      onClick: () => handleCategoryClick(category.name, category.id),
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
                  selectedCategory === category.name &&
                  React.createElement(
                    'div',
                    { className: 'ml-4 space-y-1' },
                    (categoryItems[category.id] || []).length > 0 ?
                    [
                      ...(categoryItems[category.id] || []).slice(0, 5).map((item) =>
                        React.createElement(
                          'button',
                          {
                            key: item.id,
                            onClick: () => handleItemClick(item),
                            className: 'block w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors font-medium'
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
                    ].filter(Boolean) : null
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
        
        // Products Grid
        React.createElement(
          'section',
          { className: 'w-full' },
          // Category title when viewing items
          viewMode === 'items' &&
          React.createElement(
            'div',
            { className: 'mb-6' },
            React.createElement('h2', { className: 'text-2xl font-bold text-slate-900 dark:text-slate-50' }, selectedCategory)
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
              React.createElement('h3', { className: 'text-lg font-bold text-slate-900 dark:text-slate-50 mb-4' }, 'Categories'),
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
          React.createElement(
            'button',
            {
              onClick: () => {
                navigate(`/items/${selectedItem.id}/sub-items`);
              },
              className: 'px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
            },
            'View Sub-Items'
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