import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoryAPI } from '../services/categoryService.js';

const SubItems = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [subItems, setSubItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    part_number: '',
    price: '',
    stock_quantity: '',
    image_url: ''
  });

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

  const handleAddSubItem = async (e) => {
    e.preventDefault();
    try {
      const subItemData = {
        ...formData,
        item_id: parseInt(itemId),
        price: parseFloat(formData.price) || 0,
        stock_quantity: parseInt(formData.stock_quantity) || 0
      };

      const result = await categoryAPI.createSubItem(subItemData);
      if (result.success || result.id) {
        setShowAddForm(false);
        setFormData({
          name: '',
          description: '',
          part_number: '',
          price: '',
          stock_quantity: '',
          image_url: ''
        });
        fetchSubItems();
      }
    } catch (error) {
      console.error('Error creating sub-item:', error);
    }
  };

  const handleDeleteSubItem = async (subItemId) => {
    if (window.confirm('Are you sure you want to delete this sub-item?')) {
      try {
        await categoryAPI.deleteSubItem(subItemId);
        fetchSubItems();
      } catch (error) {
        console.error('Error deleting sub-item:', error);
      }
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
            { onClick: () => navigate(-1), className: 'hover:text-blue-600' },
            'Items'
          )
        ),
        React.createElement('li', null, ' > '),
        React.createElement('li', { className: 'text-gray-900 font-medium' }, 'Sub-Items')
      )
    ),

    // Header
    React.createElement(
      'div',
      { className: 'mb-6 flex justify-between items-center' },
      React.createElement(
        'div',
        null,
        React.createElement('h1', { className: 'text-3xl font-bold text-gray-900' }, 'Sub-Items'),
        React.createElement('p', { className: 'text-gray-600 mt-1' }, 'Manage sub-items for this item')
      ),
      React.createElement(
        'button',
        {
          onClick: () => setShowAddForm(true),
          className: 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
        },
        'Add New Sub-Item'
      )
    ),

    // Add Form Modal
    showAddForm && React.createElement(
      'div',
      { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50', onClick: () => setShowAddForm(false) },
      React.createElement(
        'div',
        { className: 'bg-white rounded-lg p-6 max-w-md w-full mx-4', onClick: (e) => e.stopPropagation() },
        React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'Add New Sub-Item'),
        React.createElement(
          'form',
          { onSubmit: handleAddSubItem, className: 'space-y-4' },
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Name *'),
            React.createElement('input', {
              type: 'text',
              value: formData.name,
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              required: true
            })
          ),
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Description'),
            React.createElement('textarea', {
              value: formData.description,
              onChange: (e) => setFormData({ ...formData, description: e.target.value }),
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              rows: '3'
            })
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-2 gap-4' },
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Part Number'),
              React.createElement('input', {
                type: 'text',
                value: formData.part_number,
                onChange: (e) => setFormData({ ...formData, part_number: e.target.value }),
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              })
            ),
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Price'),
              React.createElement('input', {
                type: 'number',
                step: '0.01',
                value: formData.price,
                onChange: (e) => setFormData({ ...formData, price: e.target.value }),
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              })
            )
          ),
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Stock Quantity'),
            React.createElement('input', {
              type: 'number',
              value: formData.stock_quantity,
              onChange: (e) => setFormData({ ...formData, stock_quantity: e.target.value }),
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            })
          ),
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Image URL'),
            React.createElement('input', {
              type: 'url',
              value: formData.image_url,
              onChange: (e) => setFormData({ ...formData, image_url: e.target.value }),
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            })
          ),
          React.createElement(
            'div',
            { className: 'flex justify-end space-x-3 pt-4' },
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: () => setShowAddForm(false),
                className: 'px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50'
              },
              'Cancel'
            ),
            React.createElement(
              'button',
              {
                type: 'submit',
                className: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
              },
              'Add Sub-Item'
            )
          )
        )
      )
    ),

    // Sub-Items Grid
    subItems.length === 0 ? React.createElement(
      'div',
      { className: 'text-center py-12' },
      React.createElement('div', { className: 'text-gray-400 text-6xl mb-4' }, '📦'),
      React.createElement('h3', { className: 'text-xl font-semibold text-gray-600 mb-2' }, 'No sub-items found'),
      React.createElement('p', { className: 'text-gray-500 mb-6' }, 'Get started by adding your first sub-item'),
      React.createElement(
        'button',
        {
          onClick: () => setShowAddForm(true),
          className: 'bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
        },
        'Add First Sub-Item'
      )
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
              'div',
              { className: 'flex justify-between items-center' },
              React.createElement(
                'span',
                {
                  className: `px-2 py-1 rounded-full text-xs font-medium ${
                    subItem.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`
                },
                subItem.status
              ),
              React.createElement(
                'button',
                {
                  onClick: () => handleDeleteSubItem(subItem.id),
                  className: 'text-red-600 hover:text-red-800 text-sm'
                },
                'Delete'
              )
            )
          )
        )
      )
    )
  );
};

export default SubItems;