import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { categoryAPI } from '../services/categoryService.js';

const SubItemDetail = () => {
  const { subItemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [subItem, setSubItem] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  // Get navigation state
  const itemName = location.state?.itemName || 'Item';
  const categoryName = location.state?.categoryName || 'Category';
  const categoryId = location.state?.categoryId;
  const itemId = location.state?.itemId;

  // Magnifier state for full image zoom
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef(null);

  // Direct mouse move handler for smooth zoom
  const handleZoomMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Apply transform directly to avoid re-render lag
    imageRef.current.style.transform = `scale(2.5) translate(${-((x - 50) * 1.2)}px, ${-((y - 50) * 1.2)}px)`;
  };

  const handleZoomEnter = () => {
    setIsZoomed(true);
  };

  const handleZoomLeave = () => {
    setIsZoomed(false);
    if (imageRef.current) {
      imageRef.current.style.transform = 'scale(1) translate(0, 0)';
    }
  };

  useEffect(() => {
    fetchSubItemDetails();
  }, [subItemId]);

  const fetchSubItemDetails = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getSubItemById(subItemId);
      setSubItem(response);
      
      // Set images from the response
      if (response.images && response.images.length > 0) {
        setImages(response.images);
      } else if (response.image_url) {
        // Fallback to single image
        setImages([{ id: 1, image_url: response.image_url, is_primary: true }]);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error('Failed to fetch sub-item details:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!subItem) return;
    
    const imageUrl = images[0]?.image_url || subItem.image_url;
    console.log('Adding to cart with image:', imageUrl);
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex(item => item.id === subItem.id && item.type === 'sub_item');
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: subItem.id,
        type: 'sub_item',
        name: subItem.name,
        part_number: subItem.part_number,
        price: parseFloat(subItem.price || 0),
        image_url: imageUrl,
        quantity: quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart updated:', cart);
    window.dispatchEvent(new Event('cartUpdate'));
    alert('Added to cart!');
  };



  if (loading) {
    return React.createElement(
      'div',
      { className: 'container mx-auto px-4 py-8' },
      React.createElement('div', { className: 'text-center text-gray-500' }, 'Loading...')
    );
  }

  if (!subItem) {
    return React.createElement(
      'div',
      { className: 'container mx-auto px-4 py-8' },
      React.createElement('div', { className: 'text-center text-gray-500' }, 'Sub-item not found')
    );
  }

  const currentImage = images[selectedImageIndex] || images[0] || { image_url: 'https://via.placeholder.com/400' };

  return React.createElement(
    'div',
    { className: 'bg-white min-h-screen' },
    
    // Breadcrumb
    React.createElement(
      'div',
      { className: 'container mx-auto px-3 sm:px-4 py-3 sm:py-4 border-b' },
      React.createElement(
        'ol',
        { className: 'flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 overflow-x-auto' },
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
        React.createElement(
          'li',
          null,
          React.createElement(
            'button',
            { 
              onClick: () => navigate(`/sub-items/${itemId}`, {
                state: {
                  itemName: itemName,
                  categoryName: categoryName,
                  categoryId: categoryId
                }
              }), 
              className: 'hover:text-blue-600' 
            },
            itemName
          )
        ),
        React.createElement('li', null, ' > '),
        React.createElement('li', { className: 'text-gray-900 font-medium' }, subItem.part_number || subItem.name)
      )
    ),

    // Main Content
    React.createElement(
      'div',
      { className: 'container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8' },
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8' },
        
        // Left Side - Images
        React.createElement(
          'div',
          { className: 'space-y-3 sm:space-y-4' },
          
          // Main Image
          React.createElement(
            'div',
            {
              className: 'bg-white border border-gray-200 rounded-lg p-2 sm:p-3 lg:p-4 flex items-center justify-center w-full max-w-md mx-auto lg:max-w-none aspect-square overflow-hidden',
              style: { position: 'relative' }
            },
            React.createElement('img', {
              ref: imageRef,
              src: currentImage.image_url,
              alt: subItem.name,
              className: 'w-full h-full max-w-sm sm:max-w-md lg:max-w-lg object-contain',
              style: {
                transform: 'scale(1) translate(0, 0)',
                willChange: 'transform',
                cursor: 'zoom-in'
              },
              onError: (e) => { e.target.src = 'https://via.placeholder.com/400?text=No+Image'; },
              onMouseEnter: handleZoomEnter,
              onMouseLeave: handleZoomLeave,
              onMouseMove: isZoomed ? handleZoomMouseMove : null
            })
          ),
          
          // Thumbnail Images
          images.length > 1 && React.createElement(
            'div',
            { className: 'flex gap-1 sm:gap-2 overflow-x-auto pb-2' },
            images.map((image, index) =>
              React.createElement(
                'button',
                {
                  key: image.id || index,
                  onClick: () => setSelectedImageIndex(index),
                  className: `flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 border-2 rounded-lg overflow-hidden transition-all ${
                    selectedImageIndex === index ? 'border-blue-600' : 'border-gray-200 hover:border-gray-400'
                  }`
                },
                React.createElement('img', {
                  src: image.image_url,
                  alt: `${subItem.name} view ${index + 1}`,
                  className: 'w-full h-full object-cover',
                  onError: (e) => { e.target.src = 'https://via.placeholder.com/80?text=No+Image'; }
                })
              )
            )
          )
        ),
        
        // Right Side - Details
        React.createElement(
          'div',
          { className: 'space-y-4 sm:space-y-6' },
          
          // Complete Badge
          React.createElement(
            'div',
            { className: 'flex items-center gap-2' },
            React.createElement('input', {
              type: 'checkbox',
              checked: true,
              readOnly: true,
              className: 'w-4 h-4'
            }),
            React.createElement('span', { className: 'text-sm text-gray-600' }, 'Complete')
          ),
          
          // Part Number & Title
          React.createElement(
            'div',
            null,
            React.createElement(
              'h1',
              { className: 'text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2' },
              subItem.part_number || subItem.name,
              React.createElement(
                'span',
                { className: 'inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-700 rounded-full text-xs sm:text-sm font-bold' },
                '©'
              )
            ),
            React.createElement('h2', { className: 'text-base sm:text-lg text-gray-700 font-medium' }, subItem.name)
          ),
          

          
          // VMRS/Description
          subItem.description && React.createElement(
            'div',
            null,
            React.createElement('p', { className: 'text-sm text-gray-600' }, 
              'VMRS: ',
              subItem.description
            )
          ),
          
          // Product Details
          React.createElement(
            'div',
            { className: 'border-t border-gray-200 pt-4 sm:pt-6 space-y-3 sm:space-y-4' },
            
            // Brand & Manufacturer
            (subItem.brand || subItem.manufacturer) && React.createElement(
              'div',
              { className: 'flex flex-col sm:flex-row gap-2 sm:gap-3' },
              subItem.brand && React.createElement(
                'div',
                null,
                React.createElement('span', { className: 'text-sm font-semibold text-gray-700' }, 'Brand: '),
                React.createElement('span', { className: 'text-sm text-gray-600' }, subItem.brand)
              ),
              subItem.manufacturer && React.createElement(
                'div',
                null,
                React.createElement('span', { className: 'text-sm font-semibold text-gray-700' }, 'Manufacturer: '),
                React.createElement('span', { className: 'text-sm text-gray-600' }, subItem.manufacturer)
              )
            ),
            
            // Classification
            subItem.dtna_classification && React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'text-sm font-semibold text-gray-700' }, 'Classification: '),
              React.createElement(
                'span',
                { className: 'inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full' },
                subItem.dtna_classification
              )
            ),
            
            // Price
            subItem.price && React.createElement(
              'div',
              { className: 'text-2xl sm:text-3xl font-bold text-gray-900' },
              `$${parseFloat(subItem.price).toFixed(2)}`
            ),
            
            // Stock Status
            React.createElement(
              'div',
              { className: 'flex items-center gap-2' },
              React.createElement(
                'span',
                { 
                  className: `px-3 py-1 rounded-full text-sm font-medium ${
                    subItem.status === 'active' && subItem.stock_quantity > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`
                },
                subItem.status === 'active' && subItem.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'
              ),
              subItem.stock_quantity > 0 && React.createElement(
                'span',
                { className: 'text-sm text-gray-600' },
                `${subItem.stock_quantity} available`
              )
            ),
            
            // Quantity & Add to Cart
            subItem.status === 'active' && subItem.stock_quantity > 0 && React.createElement(
              'div',
              { className: 'flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center' },
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Quantity'),
                React.createElement('input', {
                  type: 'number',
                  min: '1',
                  max: subItem.stock_quantity,
                  value: quantity,
                  onChange: (e) => setQuantity(parseInt(e.target.value) || 1),
                  className: 'w-20 sm:w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                })
              ),
              React.createElement(
                'button',
                {
                  onClick: addToCart,
                  className: 'w-full sm:w-auto sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'
                },
                'Add to Cart'
              )
            )
          ),
          

        )
      )
    )
  );
};

export default SubItemDetail;
