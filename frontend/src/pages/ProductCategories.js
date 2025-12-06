import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../services/categoryService.js';

const ProductCategories = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      await categoryAPI.createCategory(categoryForm);
      fetchCategories();
      setShowAddModal(false);
      setCategoryForm({ name: '', description: '', image_url: '' });
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      image_url: category.image_url
    });
    setShowAddModal(true);
  };

  const handleUpdateCategory = async () => {
    try {
      await categoryAPI.updateCategory(editingCategory.id, categoryForm);
      fetchCategories();
      setShowAddModal(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '', image_url: '' });
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryAPI.deleteCategory(id);
        fetchCategories();
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

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
    { className: 'p-8' },
    React.createElement(
      'div',
      { className: 'mb-6' },
      React.createElement('h1', { className: 'text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2' }, 'Product Categories'),
      React.createElement('p', { className: 'text-slate-600 dark:text-slate-400' }, 'Manage your product categories and inventory')
    ),
    React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'flex flex-col lg:flex-row gap-6' },
        // Category Filter Sidebar
        React.createElement(
          'aside',
          { className: 'w-full lg:w-64 flex-shrink-0' },
          React.createElement(
            'div',
            { className: 'bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4' },
            React.createElement(
              'h3',
              { className: 'text-lg font-bold text-slate-900 dark:text-slate-50 mb-4' },
              'Filter Categories'
            ),
            React.createElement(
              'nav',
              { className: 'space-y-2' },
              sidebarCategories.map(function(category, index) {
                return React.createElement(
                  'button',
                  {
                    key: index,
                    className: 'w-full text-left flex items-center px-3 py-2 rounded-lg font-medium transition-colors ' + (
                      index === 0
                        ? 'bg-primary/10 text-primary dark:bg-primary/20 font-semibold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                    )
                  },
                  category
                );
              })
            )
          )
        ),
        // Main Content
        React.createElement(
          'div',
          { className: 'flex-1' },
          // Search and Add Button
          React.createElement(
            'section',
            { className: 'mb-6' },
            React.createElement(
              'div',
              { className: 'flex flex-col sm:flex-row items-center gap-4' },
              React.createElement(
                'div',
                { className: 'w-full flex-1' },
                React.createElement(
                  'div',
                  { className: 'flex w-full flex-1 items-stretch rounded-lg h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800' },
                  React.createElement(
                    'div',
                    { className: 'text-slate-500 dark:text-slate-400 flex items-center justify-center pl-4' },
                    React.createElement('span', { className: 'material-symbols-outlined' }, 'search')
                  ),
                  React.createElement('input', {
                    type: 'text',
                    className: 'form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-slate-900 dark:text-slate-50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-transparent h-full placeholder:text-slate-500 dark:placeholder:text-slate-400 pl-2 text-base font-normal',
                    placeholder: 'Search categories...',
                    value: searchQuery,
                    onChange: function(e) { setSearchQuery(e.target.value); }
                  })
                )
              ),
              React.createElement(
                'div',
                { className: 'flex items-center gap-3' },
                React.createElement(
                  'button',
                  { 
                    className: 'flex h-12 items-center gap-2 px-6 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors',
                    onClick: function() { setShowAddModal(true); }
                  },
                  React.createElement('span', { className: 'material-symbols-outlined text-xl' }, 'add'),
                  React.createElement('span', { className: 'hidden sm:inline' }, 'Add Category')
                )
              )
            )
          ),
          // Category Grid
          React.createElement(
            'section',
            { className: 'w-full' },
            loading ? React.createElement('div', { className: 'text-center py-8' }, 'Loading...') :
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6' },
              categories.map(function(category) {
                return React.createElement(
                  'div',
                  {
                    key: category.id,
                    className: 'group flex flex-col bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary transition-all hover:shadow-lg cursor-pointer'
                  },
                  React.createElement(
                    'div',
                    { className: 'relative' },
                    React.createElement('div', {
                      className: 'w-full bg-center bg-no-repeat aspect-video bg-cover',
                      style: { backgroundImage: 'url("' + (category.image_url || 'https://via.placeholder.com/300x200') + '")' }
                    }),
                    React.createElement(
                      'div',
                      { className: 'absolute top-2 right-2 flex gap-2' },
                      React.createElement(
                        'button',
                        { 
                          className: 'flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300',
                          onClick: function(e) {
                            e.stopPropagation();
                            handleEditCategory(category);
                          }
                        },
                        React.createElement('span', { className: 'material-symbols-outlined text-lg' }, 'edit')
                      ),
                      React.createElement(
                        'button',
                        { 
                          className: 'flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400',
                          onClick: function(e) {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }
                        },
                        React.createElement('span', { className: 'material-symbols-outlined text-lg' }, 'delete')
                      )
                    )
                  ),
                  React.createElement(
                    'div',
                    { className: 'p-4' },
                    React.createElement(
                      'p',
                      { className: 'text-slate-900 dark:text-slate-50 text-base font-bold leading-normal mb-1' },
                      category.name
                    ),
                    React.createElement(
                      'p',
                      { className: 'text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal mb-3' },
                      category.description
                    ),
                    React.createElement(
                      'div',
                      { className: 'flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800' },
                      React.createElement(
                        'span',
                        { className: 'text-xs text-slate-500 dark:text-slate-400' },
                        'Items: ',
                        React.createElement('span', { className: 'font-semibold text-slate-900 dark:text-slate-50' }, category.item_count || 0)
                      ),
                      React.createElement(
                        'span',
                        { className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
                        'Active'
                      )
                    )
                  )
                );
              })
            )
          )
        )
      ),
      // Add Category Modal
      showAddModal && React.createElement(
        'div',
        { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
        React.createElement(
          'div',
          { className: 'bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4' },
          React.createElement('h2', { className: 'text-lg font-bold text-slate-900 dark:text-slate-50 mb-4' }, editingCategory ? 'Edit Category' : 'Add New Category'),
          React.createElement(
            'form',
            { 
              onSubmit: function(e) {
                e.preventDefault();
                editingCategory ? handleUpdateCategory() : handleAddCategory();
              }
            },
            React.createElement('input', {
              type: 'text',
              placeholder: 'Category Name',
              value: categoryForm.name,
              onChange: function(e) { setCategoryForm(Object.assign({}, categoryForm, {name: e.target.value})); },
              className: 'w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg mb-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50',
              required: true
            }),
            React.createElement('textarea', {
              placeholder: 'Description',
              value: categoryForm.description,
              onChange: function(e) { setCategoryForm(Object.assign({}, categoryForm, {description: e.target.value})); },
              className: 'w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg mb-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50',
              rows: 3
            }),
            React.createElement('input', {
              type: 'url',
              placeholder: 'Image URL',
              value: categoryForm.image_url,
              onChange: function(e) { setCategoryForm(Object.assign({}, categoryForm, {image_url: e.target.value})); },
              className: 'w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg mb-4 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50'
            }),
            React.createElement(
              'div',
              { className: 'flex gap-3' },
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: function() {
                    setShowAddModal(false);
                    setEditingCategory(null);
                    setCategoryForm({ name: '', description: '', image_url: '' });
                  },
                  className: 'flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700'
                },
                'Cancel'
              ),
              React.createElement(
                'button',
                {
                  type: 'submit',
                  className: 'flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90'
                },
                editingCategory ? 'Update' : 'Create'
              )
            )
          )
        )
      )
    )
  );
};

export default ProductCategories;