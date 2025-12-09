import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { categoryAPI } from '../services/categoryService.js';

const SubItems = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [subItems, setSubItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get item and category info from navigation state
  const itemName = location.state?.itemName || 'Item';
  const categoryName = location.state?.categoryName || 'Category';
  const categoryId = location.state?.categoryId;

  useEffect(() => {
    if (itemId) {
      fetchSubItems();
    }
  }, [itemId]);

  const fetchSubItems = async () => {
    try {
      setLoading(true);
      const data = await categoryAPI.getSubItems(itemId);
      setSubItems(data);
    } catch (error) {
      console.error('Error fetching sub-items:', error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return React.createElement(
      'div',
      { className: 'container mx-auto px-4 py-8' },
      React.createElement('div', { className: 'text-center text-gray-500' }, 'Loading sub-items...')
    );
  }

  return React.createElement(
    'div',
    { className: 'container mx-auto px-4 py-8' },
    
    // Breadcrumb
    React.createElement(
      'nav',
      { className: 'mb-6' },
      React.createElement(
        'ol',
        { className: 'flex items-center space-x-2 text-sm text-gray-500' },
        React.createElement(
          'li',
          null,
          React.createElement(
            'button',
            { onClick: () => navigate('/products'), className: 'hover:text-blue-600' },
            'Categories'
          )
        ),
        React.createElement('li', null, ' > '),
        React.createElement(
          'li',
          null,
          React.createElement(
            'button',
            { 
              onClick: () => navigate('/products', { 
                state: categoryId ? { 
                  selectedCategoryId: categoryId, 
                  selectedCategoryName: categoryName 
                } : null
              }), 
              className: 'hover:text-blue-600' 
            },
            categoryName
          )
        ),
        React.createElement('li', null, ' > '),
        React.createElement('li', { className: 'text-gray-900 font-medium' }, itemName)
      )
    ),

    // Header
    React.createElement(
      'div',
      { className: 'mb-6' },
      React.createElement('h1', { className: 'text-3xl font-bold text-gray-900' }, 'Sub-Items'),
      React.createElement('p', { className: 'text-gray-600 mt-1' }, 'Browse available sub-items')
    ),

    // Sub-Items Grid
    subItems.length === 0 ? React.createElement(
      'div',
      { className: 'text-center py-12' },
      React.createElement('div', { className: 'text-gray-400 text-6xl mb-4' }, '📦'),
      React.createElement('h3', { className: 'text-xl font-semibold text-gray-600 mb-2' }, 'No sub-items available'),
      React.createElement('p', { className: 'text-gray-500' }, 'Check back later for new items')
    ) : React.createElement(
      'div',
      { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' },
      ...subItems.map(subItem =>
        React.createElement(
          'div',
          {
            key: subItem.id,
            className: 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
          },
          subItem.image_url ? React.createElement('img', {
            src: subItem.image_url,
            alt: subItem.name,
            className: 'w-full h-48 object-cover'
          }) : React.createElement(
            'div',
            { className: 'w-full h-48 bg-gray-200 flex items-center justify-center' },
            React.createElement('span', { className: 'text-gray-400 text-4xl' }, '📦')
          ),
          React.createElement(
            'div',
            { className: 'p-4' },
            React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-2' }, subItem.name),
            subItem.description && React.createElement('p', { className: 'text-gray-600 text-sm mb-3 line-clamp-2' }, subItem.description),
            React.createElement(
              'div',
              { className: 'space-y-1 text-sm text-gray-500 mb-4' },
              subItem.part_number && React.createElement('p', null, React.createElement('span', { className: 'font-medium' }, 'Part #: '), subItem.part_number),
              subItem.price > 0 && React.createElement('p', null, React.createElement('span', { className: 'font-medium' }, 'Price: '), `$${subItem.price}`),
              React.createElement('p', null, React.createElement('span', { className: 'font-medium' }, 'Stock: '), subItem.stock_quantity || 0)
            ),
            React.createElement(
              'span',
              {
                className: `px-2 py-1 rounded-full text-xs font-medium ${
                  subItem.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`
              },
              subItem.status
            )
          )
        )
      )
    )
  );
};

export default SubItems;