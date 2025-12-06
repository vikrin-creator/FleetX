import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../services/categoryService.js';

const ProductCategories = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image_url: '',
    image_file: null
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
      name: category.name,
      description: category.description,
      image_url: category.image_url,
      image_file: null
    });
    setShowModal(true);
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
    { className: 'p-6' },
    React.createElement(
      'div',
      { className: 'mb-8' },
      React.createElement('h1', { className: 'text-3xl font-bold text-gray-900 mb-2' }, 'Product Categories'),
      React.createElement('p', { className: 'text-gray-600' }, 'Manage your product categories and inventory')
    ),
    
    React.createElement(
      'div',
      { className: 'flex justify-end mb-8' },
      React.createElement(
        'button',
        {
          onClick: handleAdd,
          className: 'px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2'
        },
        React.createElement('span', { className: 'material-symbols-outlined text-sm' }, 'add'),
        'Add Category'
      )
    ),
    
    loading ? 
      React.createElement('div', { className: 'text-center py-12' }, 'Loading categories...') :
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
        categories.map(category => 
          React.createElement(
            'div',
            { 
              key: category.id, 
              className: 'bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'
            },
            React.createElement(
              'div',
              { className: 'relative' },
              React.createElement('img', {
                src: category.image_url || 'https://via.placeholder.com/300x200',
                alt: category.name,
                className: 'w-full h-48 object-cover'
              }),
              React.createElement(
                'div',
                { className: 'absolute top-3 right-3 flex gap-2' },
                React.createElement(
                  'button',
                  {
                    onClick: () => handleEdit(category),
                    className: 'p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors'
                  },
                  React.createElement('span', { className: 'material-symbols-outlined text-gray-600 text-lg' }, 'edit')
                ),
                React.createElement(
                  'button',
                  {
                    onClick: () => handleDelete(category.id),
                    className: 'p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors'
                  },
                  React.createElement('span', { className: 'material-symbols-outlined text-red-600 text-lg' }, 'delete')
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'p-5' },
              React.createElement('h3', { className: 'text-lg font-bold text-gray-900 mb-2' }, category.name),
              React.createElement('p', { className: 'text-sm text-gray-600 mb-4 line-clamp-2' }, category.description),
              React.createElement(
                'div',
                { className: 'flex justify-between items-center' },
                React.createElement(
                  'span',
                  { className: 'text-sm text-gray-500' },
                  `Items: ${category.item_count || 0}`
                ),
                React.createElement(
                  'span',
                  { className: 'px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full' },
                  'Active'
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
        { className: 'bg-white rounded-lg p-6 w-full max-w-md mx-4' },
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
    )
  );
};

export default ProductCategories;