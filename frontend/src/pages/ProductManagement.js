import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/productService.js';
import { categoryAPI } from '../services/categoryService.js';

const ProductManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [productForm, setProductForm] = useState({
    category_id: '',
    name: '',
    description: '',
    part_number: '',
    price: '',
    stock_quantity: '',
    image_url: '',
    image_file: null,
    status: 'active'
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
    } else {
      fetchProducts();
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      let data = [];
      if (response && response.success && Array.isArray(response.data)) {
        data = response.data;
      } else if (Array.isArray(response)) {
        data = response;
      }
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async (categoryId = null) => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts(categoryId);
      
      let data = [];
      if (response && response.success && Array.isArray(response.data)) {
        data = response.data;
      } else if (Array.isArray(response)) {
        data = response;
      }
      
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setProductForm({
      category_id: '',
      name: '',
      description: '',
      part_number: '',
      price: '',
      stock_quantity: '',
      image_url: '',
      image_file: null,
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      category_id: product.category_id,
      name: product.name,
      description: product.description || '',
      part_number: product.part_number || '',
      price: product.price || '',
      stock_quantity: product.stock_quantity || '',
      image_url: product.image_url || '',
      image_file: null,
      status: product.status || 'active'
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('category_id', productForm.category_id);
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('part_number', productForm.part_number);
      formData.append('price', productForm.price || '0');
      formData.append('stock_quantity', productForm.stock_quantity || '0');
      formData.append('status', productForm.status);
      
      if (productForm.image_file) {
        formData.append('image', productForm.image_file);
      } else if (productForm.image_url) {
        formData.append('image_url', productForm.image_url);
      }

      if (editingProduct) {
        await productAPI.updateProduct(editingProduct.id, formData);
      } else {
        await productAPI.createProduct(formData);
      }
      
      fetchProducts(selectedCategory);
      setShowModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductForm({ 
        ...productForm, 
        image_file: file,
        image_url: URL.createObjectURL(file) // For preview
      });
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(id);
        fetchProducts(selectedCategory);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.part_number && product.part_number.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'out_of_stock':
        return 'Out of Stock';
      default:
        return status;
    }
  };

  return React.createElement(
    'div',
    { className: 'p-6' },
    React.createElement(
      'div',
      { className: 'mb-8' },
      React.createElement('h1', { className: 'text-3xl font-bold text-gray-900 mb-2' }, 'Product Management'),
      React.createElement('p', { className: 'text-gray-600' }, 'Manage products and items within categories')
    ),
    
    // Filters and Actions
    React.createElement(
      'div',
      { className: 'flex flex-col md:flex-row gap-4 mb-6' },
      React.createElement(
        'div',
        { className: 'flex-1' },
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search products by name or part number...',
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          className: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        })
      ),
      React.createElement(
        'select',
        {
          value: selectedCategory,
          onChange: (e) => setSelectedCategory(e.target.value),
          className: 'px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        },
        React.createElement('option', { value: '' }, 'All Categories'),
        categories.map(category => 
          React.createElement('option', { key: category.id, value: category.id }, category.name)
        )
      ),
      React.createElement(
        'button',
        {
          onClick: handleAdd,
          className: 'px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2'
        },
        React.createElement('span', { className: 'material-symbols-outlined text-sm' }, 'add'),
        'Add Product'
      )
    ),
    
    loading ? 
      React.createElement('div', { className: 'text-center py-12' }, 'Loading products...') :
      React.createElement(
        'div',
        { className: 'bg-white rounded-lg shadow overflow-hidden' },
        React.createElement(
          'table',
          { className: 'min-w-full divide-y divide-gray-200' },
          React.createElement(
            'thead',
            { className: 'bg-gray-50' },
            React.createElement(
              'tr',
              null,
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Product'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Category'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Part Number'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Price'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Stock'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Status'),
              React.createElement('th', { className: 'px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Actions')
            )
          ),
          React.createElement(
            'tbody',
            { className: 'bg-white divide-y divide-gray-200' },
            filteredProducts.map(product => 
              React.createElement(
                'tr',
                { key: product.id, className: 'hover:bg-gray-50' },
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement(
                    'div',
                    { className: 'flex items-center' },
                    React.createElement('img', {
                      src: product.image_url || 'https://via.placeholder.com/60x60',
                      alt: product.name,
                      className: 'h-12 w-12 rounded-lg object-cover mr-4'
                    }),
                    React.createElement(
                      'div',
                      null,
                      React.createElement('div', { className: 'text-sm font-medium text-gray-900' }, product.name),
                      React.createElement('div', { className: 'text-sm text-gray-500' }, product.description ? product.description.substring(0, 50) + '...' : 'No description')
                    )
                  )
                ),
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900' },
                  product.category_name || 'Unknown'
                ),
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900' },
                  product.part_number || '-'
                ),
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900' },
                  product.price ? `$${parseFloat(product.price).toFixed(2)}` : '-'
                ),
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900' },
                  product.stock_quantity || 0
                ),
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement(
                    'span',
                    { className: `px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}` },
                    getStatusLabel(product.status)
                  )
                ),
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap text-right text-sm font-medium' },
                  React.createElement(
                    'div',
                    { className: 'flex justify-end gap-2' },
                    React.createElement(
                      'button',
                      {
                        onClick: () => handleEdit(product),
                        className: 'text-blue-600 hover:text-blue-900'
                      },
                      React.createElement('span', { className: 'material-symbols-outlined text-lg' }, 'edit')
                    ),
                    React.createElement(
                      'button',
                      {
                        onClick: () => handleDelete(product.id),
                        className: 'text-red-600 hover:text-red-900'
                      },
                      React.createElement('span', { className: 'material-symbols-outlined text-lg' }, 'delete')
                    )
                  )
                )
              )
            )
          )
        )
      ),
    
    // Modal
    showModal && React.createElement(
      'div',
      { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
      React.createElement(
        'div',
        { className: 'bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto' },
        React.createElement('h2', { className: 'text-lg font-bold text-gray-900 mb-4' }, 
          editingProduct ? 'Edit Product' : 'Add New Product'
        ),
        React.createElement(
          'form',
          { 
            onSubmit: (e) => {
              e.preventDefault();
              handleSave();
            }
          },
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-4' },
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Category *'),
              React.createElement(
                'select',
                {
                  value: productForm.category_id,
                  onChange: (e) => setProductForm({ ...productForm, category_id: e.target.value }),
                  className: 'w-full p-3 border border-gray-300 rounded-lg',
                  required: true
                },
                React.createElement('option', { value: '' }, 'Select Category'),
                categories.map(category => 
                  React.createElement('option', { key: category.id, value: category.id }, category.name)
                )
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Product Name *'),
              React.createElement('input', {
                type: 'text',
                value: productForm.name,
                onChange: (e) => setProductForm({ ...productForm, name: e.target.value }),
                className: 'w-full p-3 border border-gray-300 rounded-lg',
                required: true
              })
            )
          ),
          React.createElement('textarea', {
            placeholder: 'Product Description',
            value: productForm.description,
            onChange: (e) => setProductForm({ ...productForm, description: e.target.value }),
            className: 'w-full p-3 border border-gray-300 rounded-lg mb-4 h-24'
          }),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-4' },
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Part Number'),
              React.createElement('input', {
                type: 'text',
                value: productForm.part_number,
                onChange: (e) => setProductForm({ ...productForm, part_number: e.target.value }),
                className: 'w-full p-3 border border-gray-300 rounded-lg'
              })
            ),
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Price ($)'),
              React.createElement('input', {
                type: 'number',
                step: '0.01',
                value: productForm.price,
                onChange: (e) => setProductForm({ ...productForm, price: e.target.value }),
                className: 'w-full p-3 border border-gray-300 rounded-lg'
              })
            ),
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Stock Quantity'),
              React.createElement('input', {
                type: 'number',
                value: productForm.stock_quantity,
                onChange: (e) => setProductForm({ ...productForm, stock_quantity: e.target.value }),
                className: 'w-full p-3 border border-gray-300 rounded-lg'
              })
            )
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-4' },
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Status'),
              React.createElement(
                'select',
                {
                  value: productForm.status,
                  onChange: (e) => setProductForm({ ...productForm, status: e.target.value }),
                  className: 'w-full p-3 border border-gray-300 rounded-lg'
                },
                React.createElement('option', { value: 'active' }, 'Active'),
                React.createElement('option', { value: 'inactive' }, 'Inactive'),
                React.createElement('option', { value: 'out_of_stock' }, 'Out of Stock')
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Product Image'),
              React.createElement('input', {
                type: 'file',
                accept: 'image/*',
                onChange: handleImageChange,
                className: 'w-full p-3 border border-gray-300 rounded-lg'
              })
            )
          ),
          productForm.image_url && React.createElement(
            'div',
            { className: 'mb-4' },
            React.createElement('img', {
              src: productForm.image_url,
              alt: 'Preview',
              className: 'w-32 h-32 object-cover rounded-lg border'
            })
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
              editingProduct ? 'Update Product' : 'Add Product'
            )
          )
        )
      )
    )
  );
};

export default ProductManagement;