import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../services/categoryService.js';

const ProductCategories = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Items management state
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [showSubItemsModal, setShowSubItemsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [subItems, setSubItems] = useState([]);
  const [loadingSubItems, setLoadingSubItems] = useState(false);
  const [showSubItemForm, setShowSubItemForm] = useState(false);
  const [editingSubItem, setEditingSubItem] = useState(null);

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image_url: '',
    image_file: null
  });

  const [subItemForm, setSubItemForm] = useState({
    name: '',
    description: '',
    part_number: '',
    price: '',
    stock_quantity: '',
    image_url: '',
    image_file: null,
    brand: '',
    manufacturer: '',
    dtna_classification: ''
  });

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
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', description: '', image_url: '', image_file: null });
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name || '',
      description: category.description || '',
      image_url: category.image_url || '',
      image_file: null
    });
    setShowModal(true);
  };

  const handleManageItems = async (category) => {
    setSelectedCategory(category);
    setLoadingItems(true);
    setShowItemsModal(true);
    
    try {
      const items = await categoryAPI.getCategoryItems(category.id);
      setCategoryItems(items);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setCategoryItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleManageSubItems = async (item) => {
    setSelectedItem(item);
    setLoadingSubItems(true);
    setShowSubItemsModal(true);
    
    try {
      const subItemsData = await categoryAPI.getSubItems(item.id);
      setSubItems(subItemsData);
    } catch (error) {
      console.error('Failed to fetch sub-items:', error);
      setSubItems([]);
    } finally {
      setLoadingSubItems(false);
    }
  };

  const handleAddSubItem = () => {
    setEditingSubItem(null);
    setSubItemForm({
      name: '',
      description: '',
      part_number: '',
      price: '',
      stock_quantity: '',
      image_url: '',
      image_file: null,
      brand: '',
      manufacturer: '',
      dtna_classification: ''
    });
    setShowSubItemForm(true);
  };

  const handleEditSubItem = (subItem) => {
    setEditingSubItem(subItem);
    setSubItemForm({
      name: subItem.name || '',
      description: subItem.description || '',
      part_number: subItem.part_number || '',
      price: subItem.price || '',
      stock_quantity: subItem.stock_quantity || '',
      image_url: subItem.image_url || '',
      image_file: null,
      brand: subItem.brand || '',
      manufacturer: subItem.manufacturer || '',
      dtna_classification: subItem.dtna_classification || ''
    });
    setShowSubItemForm(true);
  };

  const handleSubItemSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('item_id', selectedItem.id);
      formData.append('name', subItemForm.name);
      formData.append('description', subItemForm.description || '');
      formData.append('part_number', subItemForm.part_number || '');
      formData.append('price', subItemForm.price || '0');
      formData.append('stock_quantity', subItemForm.stock_quantity || '0');
      formData.append('brand', subItemForm.brand || '');
      formData.append('manufacturer', subItemForm.manufacturer || '');
      formData.append('dtna_classification', subItemForm.dtna_classification || '');
      
      if (subItemForm.image_file) {
        formData.append('image', subItemForm.image_file);
      } else if (subItemForm.image_url && !editingSubItem) {
        formData.append('image_url', subItemForm.image_url);
      }

      if (editingSubItem) {
        await categoryAPI.updateSubItem(editingSubItem.id, formData);
      } else {
        await categoryAPI.createSubItem(formData);
      }

      setShowSubItemForm(false);
      handleManageSubItems(selectedItem); // Refresh sub-items
    } catch (error) {
      console.error('Error saving sub-item:', error);
      alert('Failed to save sub-item. Please try again.');
    }
  };

  const handleSubItemImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubItemForm({ 
        ...subItemForm, 
        image_file: file,
        image_url: URL.createObjectURL(file) // For preview
      });
    }
  };

  const handleDeleteSubItem = async (subItemId) => {
    if (window.confirm('Are you sure you want to delete this sub-item?')) {
      try {
        await categoryAPI.deleteSubItem(subItemId);
        handleManageSubItems(selectedItem); // Refresh
      } catch (error) {
        console.error('Error deleting sub-item:', error);
        alert('Failed to delete sub-item. Please try again.');
      }
    }
  };

  const handleSave = async () => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', categoryForm.name);
      formData.append('description', categoryForm.description);
      
      if (categoryForm.image_file) {
        formData.append('image', categoryForm.image_file);
      } else if (categoryForm.image_url) {
        formData.append('image_url', categoryForm.image_url);
      }

      if (editingCategory) {
        await categoryAPI.updateCategory(editingCategory.id, formData);
      } else {
        await categoryAPI.createCategory(formData);
      }
      
      fetchCategories();
      setShowModal(false);
      setCategoryForm({ name: '', description: '', image_url: '', image_file: null });
      setEditingCategory(null);
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryForm({ 
        ...categoryForm, 
        image_file: file,
        image_url: URL.createObjectURL(file) // For preview
      });
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryAPI.deleteCategory(id);
        fetchCategories();
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return React.createElement(
    'div',
    { className: 'p-4 sm:p-6 lg:p-8' },
    React.createElement(
      'div',
      { className: 'mb-6 sm:mb-8' },
      React.createElement('h1', { className: 'text-2xl sm:text-3xl font-bold text-gray-900 mb-2' }, 'Product Categories'),
      React.createElement('p', { className: 'text-sm sm:text-base text-gray-600' }, 'Manage your product categories and inventory')
    ),
    
    React.createElement(
      'div',
      { className: 'flex justify-between items-center mb-6' },
      React.createElement(
        'div',
        { className: 'flex-1 max-w-md' },
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search categories...',
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          className: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        })
      ),
      React.createElement(
        'button',
        {
          onClick: handleAdd,
          className: 'ml-4 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2'
        },
        React.createElement('span', { className: 'material-symbols-outlined text-sm' }, 'add'),
        React.createElement('span', { className: 'hidden sm:inline' }, 'Add Category')
      )
    ),
    
    loading ? 
      React.createElement('div', { className: 'text-center py-12' }, 'Loading categories...') :
      React.createElement(
        'div',
        { className: 'bg-white rounded-lg shadow overflow-hidden -mx-4 sm:mx-0' },
        React.createElement(
          'div',
          { className: 'overflow-x-auto' },
          React.createElement(
            'table',
            { className: 'w-full min-w-[640px]' },
            React.createElement(
              'thead',
              { className: 'bg-gray-50' },
              React.createElement(
                'tr',
                null,
                React.createElement('th', { className: 'px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Category'),
                React.createElement('th', { className: 'hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Description'),
                React.createElement('th', { className: 'px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Items'),
                React.createElement('th', { className: 'hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Status'),
                React.createElement('th', { className: 'px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Actions')
              )
            ),
            React.createElement(
              'tbody',
              { className: 'bg-white divide-y divide-gray-200' },
              filteredCategories.length === 0 ?
                React.createElement(
                  'tr',
                  null,
                  React.createElement('td', { colSpan: 5, className: 'px-6 py-8 text-center text-gray-500' }, 
                    searchQuery ? 'No categories found matching your search' : 'No categories yet. Click "Add Category" to create one.'
                  )
                ) :
                filteredCategories.map((category) =>
                  React.createElement(
                    'tr',
                    { key: category.id, className: 'hover:bg-gray-50 transition-colors' },
                    React.createElement(
                      'td',
                      { className: 'px-3 sm:px-6 py-3 sm:py-4' },
                      React.createElement(
                        'div',
                        { className: 'flex items-center gap-3' },
                        React.createElement('img', {
                          src: category.image_url || 'https://via.placeholder.com/60x60',
                          alt: category.name,
                          className: 'h-12 w-12 rounded-lg object-cover'
                        }),
                        React.createElement('div', { className: 'text-sm font-medium text-gray-900' }, category.name)
                      )
                    ),
                    React.createElement(
                      'td',
                      { className: 'hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600' },
                      React.createElement('div', { className: 'line-clamp-2 max-w-xs' }, category.description || 'N/A')
                    ),
                    React.createElement(
                      'td',
                      { className: 'px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900' },
                      category.item_count || 0
                    ),
                    React.createElement(
                      'td',
                      { className: 'hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4' },
                      React.createElement(
                        'span',
                        { className: 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800' },
                        'Active'
                      )
                    ),
                    React.createElement(
                      'td',
                      { className: 'px-3 sm:px-6 py-3 sm:py-4' },
                      React.createElement(
                        'div',
                        { className: 'flex justify-end gap-1 sm:gap-2' },
                        React.createElement(
                          'button',
                          {
                            onClick: () => handleManageItems(category),
                            className: 'px-2 sm:px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700',
                            title: 'Manage Items'
                          },
                          React.createElement('span', { className: 'hidden sm:inline' }, 'Manage'),
                          React.createElement('span', { className: 'sm:hidden material-symbols-outlined text-sm' }, 'inventory_2')
                        ),
                        React.createElement(
                          'button',
                          {
                            onClick: () => handleEdit(category),
                            className: 'p-1.5 text-gray-600 hover:bg-gray-100 rounded',
                            title: 'Edit'
                          },
                          React.createElement('span', { className: 'material-symbols-outlined text-lg' }, 'edit')
                        ),
                        React.createElement(
                          'button',
                          {
                            onClick: () => handleDelete(category.id),
                            className: 'p-1.5 text-red-600 hover:bg-red-50 rounded',
                            title: 'Delete'
                          },
                          React.createElement('span', { className: 'material-symbols-outlined text-lg' }, 'delete')
                        )
                      )
                    )
                  )
                )
            )
          )
        )
      ),
    
    showModal && React.createElement(
      'div',
      { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
      React.createElement(
        'div',
        { className: 'bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-4' },
        React.createElement('h2', { className: 'text-lg font-bold text-gray-900 mb-4' }, 
          editingCategory ? 'Edit Category' : 'Add New Category'
        ),
        React.createElement(
          'form',
          { 
            onSubmit: (e) => {
              e.preventDefault();
              handleSave();
            }
          },
          React.createElement('input', {
            type: 'text',
            placeholder: 'Category Name',
            value: categoryForm.name,
            onChange: (e) => setCategoryForm({ ...categoryForm, name: e.target.value }),
            className: 'w-full p-3 border border-gray-300 rounded-lg mb-4',
            required: true
          }),
          React.createElement('textarea', {
            placeholder: 'Category Description',
            value: categoryForm.description,
            onChange: (e) => setCategoryForm({ ...categoryForm, description: e.target.value }),
            className: 'w-full p-3 border border-gray-300 rounded-lg mb-4 h-24',
            required: true
          }),
          React.createElement(
            'div',
            { className: 'mb-4' },
            React.createElement('label', { 
              className: 'block text-sm font-medium text-gray-700 mb-2' 
            }, 'Category Image'),
            React.createElement('input', {
              type: 'file',
              accept: 'image/*',
              onChange: handleImageChange,
              className: 'w-full p-3 border border-gray-300 rounded-lg',
              required: !editingCategory
            }),
            categoryForm.image_url && React.createElement(
              'div',
              { className: 'mt-3' },
              React.createElement('img', {
                src: categoryForm.image_url,
                alt: 'Preview',
                className: 'w-32 h-32 object-cover rounded-lg border'
              })
            )
          ),
          React.createElement(
            'div',
            { className: 'flex gap-3' },
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: () => setShowModal(false),
                className: 'flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
              },
              'Cancel'
            ),
            React.createElement(
              'button',
              {
                type: 'submit',
                className: 'flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
              },
              editingCategory ? 'Update' : 'Add Category'
            )
          )
        )
      )
    ),

    // Items Management Modal
    showItemsModal && React.createElement(
      'div',
      { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
      React.createElement(
        'div',
        { className: 'bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden' },
        React.createElement(
          'div',
          { className: 'p-6 border-b border-gray-200' },
          React.createElement(
            'div',
            { className: 'flex justify-between items-center' },
            React.createElement('h2', { className: 'text-xl font-bold text-gray-900' }, `Items in ${selectedCategory?.name}`),
            React.createElement(
              'button',
              {
                onClick: () => setShowItemsModal(false),
                className: 'text-gray-400 hover:text-gray-600'
              },
              React.createElement('span', { className: 'material-symbols-outlined text-2xl' }, 'close')
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'p-6 max-h-[70vh] overflow-y-auto' },
          loadingItems ? React.createElement(
            'div',
            { className: 'text-center py-8' },
            React.createElement('div', { className: 'text-gray-500' }, 'Loading items...')
          ) : categoryItems.length === 0 ? React.createElement(
            'div',
            { className: 'text-center py-8' },
            React.createElement('div', { className: 'text-gray-500' }, 'No items found in this category')
          ) : React.createElement(
            'div',
            { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4' },
            ...categoryItems.map(item =>
              React.createElement(
                'div',
                {
                  key: item.id,
                  className: 'border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
                },
                React.createElement(
                  'div',
                  { className: 'flex items-center justify-between mb-2' },
                  React.createElement('h3', { className: 'font-medium text-gray-900 truncate' }, item.name),
                  React.createElement(
                    'button',
                    {
                      onClick: () => handleManageSubItems(item),
                      className: 'text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700'
                    },
                    'Sub-Items'
                  )
                ),
                React.createElement('p', { className: 'text-sm text-gray-600 mb-2' }, item.description || 'No description'),
                React.createElement(
                  'div',
                  { className: 'text-xs text-gray-500' },
                  React.createElement('div', null, `Part #: ${item.part_number || 'N/A'}`),
                  React.createElement('div', null, `Price: $${item.price || '0.00'}`),
                  React.createElement('div', null, `Stock: ${item.stock_quantity || 0}`)
                )
              )
            )
          )
        )
      )
    ),

    // Sub-Items Management Modal
    showSubItemsModal && React.createElement(
      'div',
      { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
      React.createElement(
        'div',
        { className: 'bg-white rounded-lg w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden' },
        React.createElement(
          'div',
          { className: 'p-6 border-b border-gray-200' },
          React.createElement(
            'div',
            { className: 'flex justify-between items-center' },
            React.createElement('h2', { className: 'text-xl font-bold text-gray-900' }, `Sub-Items for ${selectedItem?.name}`),
            React.createElement(
              'button',
              {
                onClick: () => setShowSubItemsModal(false),
                className: 'text-gray-400 hover:text-gray-600'
              },
              React.createElement('span', { className: 'material-symbols-outlined text-2xl' }, 'close')
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'p-6 max-h-[70vh] overflow-y-auto' },
          loadingSubItems ? React.createElement(
            'div',
            { className: 'text-center py-8' },
            React.createElement('div', { className: 'text-gray-500' }, 'Loading sub-items...')
          ) : React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { className: 'mb-4 flex justify-between items-center' },
              React.createElement('h3', { className: 'text-lg font-medium' }, subItems.length === 0 ? 'No Sub-Items' : `${subItems.length} Sub-Items`),
              React.createElement(
                'button',
                {
                  onClick: handleAddSubItem,
                  className: 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2'
                },
                React.createElement('span', { className: 'material-symbols-outlined text-lg' }, 'add'),
                'Add Sub-Item'
              )
            ),
            subItems.length === 0 ? React.createElement(
              'div',
              { className: 'text-center py-12 text-gray-500' },
              'No sub-items found. Click "Add Sub-Item" to create one.'
            ) : React.createElement(
              'div',
              { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
              ...subItems.map(subItem =>
                React.createElement(
                  'div',
                  {
                    key: subItem.id,
                    className: 'border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
                  },
                  React.createElement(
                    'div',
                    { className: 'flex items-center justify-between mb-2' },
                    React.createElement('h4', { className: 'font-medium text-gray-900' }, subItem.name),
                    React.createElement(
                      'div',
                      { className: 'flex gap-2' },
                      React.createElement(
                        'button',
                        {
                          onClick: () => handleEditSubItem(subItem),
                          className: 'text-blue-600 hover:text-blue-800 text-sm'
                        },
                        'Edit'
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
                  ),
                  React.createElement('p', { className: 'text-sm text-gray-600 mb-2' }, subItem.description || 'No description'),
                  React.createElement(
                    'div',
                    { className: 'text-xs text-gray-500' },
                    React.createElement('div', null, `Part #: ${subItem.part_number || 'N/A'}`),
                    React.createElement('div', null, `Price: $${subItem.price || '0.00'}`),
                    React.createElement('div', null, `Stock: ${subItem.stock_quantity || 0}`)
                  )
                )
              )
            )
          )
        )
      )
    ),

    // Sub-Item Form Modal
    showSubItemForm && React.createElement(
      'div',
      { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]' },
      React.createElement(
        'form',
        { 
          onSubmit: handleSubItemSubmit,
          className: 'bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto'
        },
        React.createElement(
          'div',
          { className: 'p-6 border-b border-gray-200 sticky top-0 bg-white' },
          React.createElement('h2', { className: 'text-xl font-bold text-gray-900' }, editingSubItem ? 'Edit Sub-Item' : 'Add Sub-Item')
        ),
        React.createElement(
          'div',
          { className: 'p-4 sm:p-6 space-y-4' },
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Name *'),
            React.createElement('input', {
              type: 'text',
              required: true,
              value: subItemForm.name,
              onChange: (e) => setSubItemForm({ ...subItemForm, name: e.target.value }),
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            })
          ),
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Description'),
            React.createElement('textarea', {
              value: subItemForm.description,
              onChange: (e) => setSubItemForm({ ...subItemForm, description: e.target.value }),
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              rows: 3
            })
          ),
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Part Number'),
            React.createElement('input', {
              type: 'text',
              value: subItemForm.part_number,
              onChange: (e) => setSubItemForm({ ...subItemForm, part_number: e.target.value }),
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            })
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-2 gap-4' },
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Price'),
              React.createElement('input', {
                type: 'number',
                step: '0.01',
                value: subItemForm.price,
                onChange: (e) => setSubItemForm({ ...subItemForm, price: e.target.value }),
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              })
            ),
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Stock Quantity'),
              React.createElement('input', {
                type: 'number',
                value: subItemForm.stock_quantity,
                onChange: (e) => setSubItemForm({ ...subItemForm, stock_quantity: e.target.value }),
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              })
            )
          ),
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Brand'),
            React.createElement('input', {
              type: 'text',
              value: subItemForm.brand,
              onChange: (e) => setSubItemForm({ ...subItemForm, brand: e.target.value }),
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            })
          ),
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Manufacturer'),
            React.createElement('input', {
              type: 'text',
              value: subItemForm.manufacturer,
              onChange: (e) => setSubItemForm({ ...subItemForm, manufacturer: e.target.value }),
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            })
          ),
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'DTNA Parts Classification'),
            React.createElement('select', {
              value: subItemForm.dtna_classification,
              onChange: (e) => setSubItemForm({ ...subItemForm, dtna_classification: e.target.value }),
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            },
              React.createElement('option', { value: '' }, 'Select Classification'),
              React.createElement('option', { value: 'Genuine' }, 'Genuine'),
              React.createElement('option', { value: 'Premier' }, 'Premier')
            )
          ),
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Sub-Item Image'),
            React.createElement('input', {
              type: 'file',
              accept: 'image/*',
              onChange: handleSubItemImageChange,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            })
          ),
          subItemForm.image_url && React.createElement(
            'div',
            { className: 'mt-3' },
            React.createElement('img', {
              src: subItemForm.image_url,
              alt: 'Preview',
              className: 'w-32 h-32 object-cover rounded-lg border'
            })
          )
        ),
        React.createElement(
          'div',
          { className: 'p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-white' },
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => setShowSubItemForm(false),
              className: 'flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
            },
            'Cancel'
          ),
          React.createElement(
            'button',
            {
              type: 'submit',
              className: 'flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
            },
            editingSubItem ? 'Update Sub-Item' : 'Add Sub-Item'
          )
        )
      )
    )
  );
};

export default ProductCategories;