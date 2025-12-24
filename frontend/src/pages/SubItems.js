import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { categoryAPI } from '../services/categoryService.js';

const SubItems = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [subItems, setSubItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    partTypes: [],
    brands: [],
    manufacturers: [],
    dtna: []
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile filter toggle
  
  // Get item and category info from navigation state
  const itemName = location.state?.itemName || 'Item';
  const categoryName = location.state?.categoryName || 'Category';
  const categoryId = location.state?.categoryId;

  const addToCart = (subItem) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === subItem.id && item.type === 'sub_item');
    
    if (existingItemIndex >= 0) {
      // Increment quantity if item exists
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      const cartItem = {
        id: subItem.id,
        type: 'sub_item',
        name: subItem.name,
        part_number: subItem.part_number,
        price: parseFloat(subItem.price) || 0,
        image_url: subItem.image_url,
        quantity: 1
      };
      cart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Trigger cart update event
    window.dispatchEvent(new Event('cartUpdate'));
    
    // Show success message
    alert('Item added to cart!');
  };

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
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  // Sidebar section expand/collapse state
  const [expandedSections, setExpandedSections] = useState({
    partType: true,
    dtna: true,
    brand: true,
    manufacturer: true
  });

  // Collapse whole filters panel (keeps header visible)
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => setExpandedSections({ partType: true, dtna: true, brand: true, manufacturer: true });
  const collapseAll = () => setExpandedSections({ partType: false, dtna: false, brand: false, manufacturer: false });

  // Get unique sub-item names with counts for Part Type filter
  const getPartTypeCounts = () => {
    const counts = {};
    subItems.forEach(item => {
      const name = item.name || 'Unknown';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  };

  // Get unique brands with counts
  const getBrandCounts = () => {
    const counts = {};
    subItems.forEach(item => {
      const brand = item.brand || 'Unknown';
      if (brand && brand !== '') {
        counts[brand] = (counts[brand] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  };

  // Get unique manufacturers with counts
  const getManufacturerCounts = () => {
    const counts = {};
    subItems.forEach(item => {
      const manufacturer = item.manufacturer || 'Unknown';
      if (manufacturer && manufacturer !== '') {
        counts[manufacturer] = (counts[manufacturer] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  };

  // Get unique DTNA classifications with counts
  const getDTNACounts = () => {
    const counts = {};
    subItems.forEach(item => {
      const classification = item.dtna_classification;
      if (classification && classification !== '') {
        counts[classification] = (counts[classification] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  };

  const partTypes = getPartTypeCounts();
  const brands = getBrandCounts();
  const manufacturers = getManufacturerCounts();
  const dtnaClassifications = getDTNACounts();

  // Helper: toggle a value in a named filter category
  const toggleFilter = (category, value) => {
    setSelectedFilters(prev => {
      const list = prev[category] || [];
      const exists = list.includes(value);
      const updated = exists ? list.filter(v => v !== value) : [...list, value];
      return { ...prev, [category]: updated };
    });
  };

  const selectedFiltersCount = Object.values(selectedFilters).reduce((acc, arr) => acc + (arr ? arr.length : 0), 0);

  // Compute filtered list based on selected filters
  let filteredSubItems = subItems;
  if (subItems && subItems.length > 0) {
    const selParts = selectedFilters.partTypes || [];
    const selBrands = selectedFilters.brands || [];
    const selMfr = selectedFilters.manufacturers || [];
    const selDtna = selectedFilters.dtna || [];

    if (selParts.length || selBrands.length || selMfr.length || selDtna.length) {
      filteredSubItems = subItems.filter(item => {
        if (selParts.length && !selParts.includes(item.name || 'Unknown')) return false;
        if (selBrands.length && !selBrands.includes(item.brand || '')) return false;
        if (selMfr.length && !selMfr.includes(item.manufacturer || '')) return false;
        if (selDtna.length && !selDtna.includes(item.dtna_classification || '')) return false;
        return true;
      });
    }
  }



  if (loading) {
    return React.createElement(
      'div',
      { className: 'container mx-auto px-4 py-8' },
      React.createElement('div', { className: 'text-center text-gray-500' }, 'Loading sub-items...')
    );
  }

  return React.createElement(
    'div',
    { className: 'container mx-auto px-3 md:px-4 py-4 md:py-8' },
    
    // Mobile Filter Toggle Button
    React.createElement(
      'button',
      {
        onClick: () => setIsFilterOpen(!isFilterOpen),
        className: 'md:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-colors flex items-center gap-2'
      },
      React.createElement(
        'svg',
        {
          className: 'w-6 h-6',
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24'
        },
        React.createElement('path', {
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: 2,
          d: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
        })
      ),
      React.createElement('span', { className: 'font-semibold' }, 'Filters')
    ),
    
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

    // Main Layout with Sidebar and Content
    React.createElement(
      'div',
      { className: 'flex flex-col md:flex-row gap-4 md:gap-6' },
      
      // Mobile overlay backdrop
      isFilterOpen && React.createElement('div', {
        onClick: () => setIsFilterOpen(false),
        className: 'md:hidden fixed inset-0 bg-black/50 z-40'
      }),
      
      // Sidebar - Filters
      React.createElement(
        'aside',
        { 
          className: `w-full md:w-80 flex-shrink-0 fixed md:sticky top-0 left-0 h-full md:h-auto z-50 md:z-auto bg-white md:bg-transparent transition-transform duration-300 ${
            isFilterOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } overflow-y-auto md:overflow-visible p-4 md:p-0`
        },
        // Close button for mobile
        React.createElement(
          'button',
          {
            onClick: () => setIsFilterOpen(false),
            className: 'md:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10'
          },
          React.createElement(
            'svg',
            {
              className: 'w-6 h-6',
              fill: 'none',
              stroke: 'currentColor',
              viewBox: '0 0 24 24'
            },
            React.createElement('path', {
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: 2,
              d: 'M6 18L18 6M6 6l12 12'
            })
          )
        ),
        React.createElement(
          'div',
          { className: 'bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4' },
          
          // Applied Filters Header
          React.createElement(
            'div',
            { className: 'mb-4 pb-4 border-b border-gray-200' },
            React.createElement(
              'div',
              { className: 'flex items-center justify-between' },
              React.createElement(
                'h3',
                { className: 'text-lg font-semibold text-gray-900' },
                React.createElement('span', null, 'Applied Filters '),
                React.createElement('span', { className: 'text-gray-500' }, `(${selectedFiltersCount})`)
              ),
              React.createElement(
                'button',
                { onClick: () => setFiltersCollapsed(!filtersCollapsed), className: 'text-blue-600 hover:text-blue-700' },
                React.createElement(
                  'svg',
                  { className: filtersCollapsed ? 'w-5 h-5 transform rotate-180' : 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                  React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M5 15l7-7 7 7' })
                )
              )
            )
          ),

          // Expand/Collapse All
          React.createElement(
            'div',
            { className: filtersCollapsed ? 'hidden mb-4 flex justify-between text-sm' : 'mb-4 flex justify-between text-sm' },
            React.createElement(
              'button',
              { onClick: expandAll, className: 'text-blue-600 hover:text-blue-700 font-medium' },
              'Expand All'
            ),
            React.createElement(
              'button',
              { onClick: collapseAll, className: 'text-blue-600 hover:text-blue-700 font-medium' },
              'Collapse All'
            )
          ),

          // Filter Sections
          React.createElement(
            'div',
            { className: filtersCollapsed ? 'hidden space-y-4' : 'space-y-4' },
            
            // Part Type Filter
            React.createElement(
              'div',
              { className: 'border-b border-gray-200 pb-4' },
              React.createElement(
                'button',
                { 
                  className: 'w-full flex items-center justify-between text-left font-semibold text-gray-900 mb-3',
                  onClick: () => toggleSection('partType')
                },
                React.createElement('span', null, 'Part Type'),
                React.createElement(
                  'svg',
                  { className: expandedSections.partType ? 'w-5 h-5 text-blue-600 transform rotate-180' : 'w-5 h-5 text-blue-600', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                  React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M19 9l-7 7-7-7' })
                )
              ),
              React.createElement(
                'div',
                { className: expandedSections.partType ? 'space-y-2 ml-1' : 'hidden space-y-2 ml-1' },
                partTypes.length > 0 ? partTypes.map((type, index) =>
                  React.createElement(
                    'label',
                    { 
                      key: index,
                      className: 'flex items-center text-sm text-gray-700 hover:text-gray-900 cursor-pointer' 
                    },
                    React.createElement('input', { type: 'checkbox', className: 'mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded', checked: selectedFilters.partTypes.includes(type.name), onChange: () => toggleFilter('partTypes', type.name) }),
                    React.createElement('span', null, type.name + ' '),
                    React.createElement('span', { className: 'text-gray-500' }, `(${type.count})`)
                  )
                ) : React.createElement(
                  'p',
                  { className: 'text-sm text-gray-500' },
                  'No parts available'
                )
              )
            ),

            // DTNA Parts Classification
            React.createElement(
              'div',
              { className: 'border-b border-gray-200 pb-4' },
              React.createElement(
                'button',
                { 
                  className: 'w-full flex items-center justify-between text-left font-semibold text-gray-900 mb-3',
                  onClick: () => toggleSection('dtna')
                },
                React.createElement('span', null, 'DTNA Parts Classification'),
                React.createElement(
                  'svg',
                  { className: expandedSections.dtna ? 'w-5 h-5 text-blue-600 transform rotate-180' : 'w-5 h-5 text-blue-600', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                  React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M19 9l-7 7-7-7' })
                )
              ),
              React.createElement(
                'div',
                { className: expandedSections.dtna ? 'space-y-2 ml-1' : 'hidden space-y-2 ml-1' },
                dtnaClassifications.length > 0 ? dtnaClassifications.map((classification, index) =>
                  React.createElement(
                    'label',
                    { 
                      key: index,
                      className: 'flex items-center text-sm text-gray-700 hover:text-gray-900 cursor-pointer' 
                    },
                    React.createElement('input', { type: 'checkbox', className: 'mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded', checked: selectedFilters.dtna.includes(classification.name), onChange: () => toggleFilter('dtna', classification.name) }),
                    React.createElement(
                      'span',
                      { className: 'flex items-center' },
                      React.createElement(
                        'span',
                        { className: `inline-flex items-center justify-center w-5 h-5 mr-1 border-2 ${classification.name === 'Genuine' ? 'border-gray-700' : 'border-blue-600 text-blue-600'} rounded-full text-xs font-bold` },
                        classification.name === 'Genuine' ? '©' : 'P'
                      ),
                      classification.name + ' ',
                      React.createElement('span', { className: 'text-gray-500' }, `(${classification.count})`)
                    )
                  )
                ) : React.createElement(
                  'p',
                  { className: 'text-sm text-gray-500' },
                  'No classifications available'
                )
              )
            ),

            // Brand Filter
            React.createElement(
              'div',
              { className: 'border-b border-gray-200 pb-4' },
              React.createElement(
                'button',
                { 
                  className: 'w-full flex items-center justify-between text-left font-semibold text-gray-900 mb-3',
                  onClick: () => toggleSection('brand')
                },
                React.createElement('span', null, 'Brand'),
                React.createElement(
                  'svg',
                  { className: expandedSections.brand ? 'w-5 h-5 text-blue-600 transform rotate-180' : 'w-5 h-5 text-blue-600', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                  React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M19 9l-7 7-7-7' })
                )
              ),
              React.createElement(
                'div',
                { className: expandedSections.brand ? 'space-y-2 ml-1' : 'hidden space-y-2 ml-1' },
                brands.length > 0 ? brands.map((brand, index) =>
                  React.createElement(
                    'label',
                    { 
                      key: index,
                      className: 'flex items-center text-sm text-gray-700 hover:text-gray-900 cursor-pointer' 
                    },
                    React.createElement('input', { type: 'checkbox', className: 'mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded', checked: selectedFilters.brands.includes(brand.name), onChange: () => toggleFilter('brands', brand.name) }),
                    React.createElement('span', null, brand.name + ' '),
                    React.createElement('span', { className: 'text-gray-500' }, `(${brand.count})`)
                  )
                ) : React.createElement(
                  'p',
                  { className: 'text-sm text-gray-500' },
                  'No brands available'
                )
              )
            ),

            // Manufacturer Filter
            React.createElement(
              'div',
              { className: 'pb-4' },
                React.createElement(
                'button',
                { 
                  className: 'w-full flex items-center justify-between text-left font-semibold text-gray-900 mb-3',
                  onClick: () => toggleSection('manufacturer')
                },
                React.createElement('span', null, 'Manufacturer'),
                React.createElement(
                  'svg',
                  { className: expandedSections.manufacturer ? 'w-5 h-5 text-blue-600 transform rotate-180' : 'w-5 h-5 text-blue-600', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                  React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M19 9l-7 7-7-7' })
                )
              ),
              React.createElement(
                'div',
                { className: expandedSections.manufacturer ? 'space-y-2 ml-1' : 'hidden space-y-2 ml-1' },
                manufacturers.length > 0 ? manufacturers.map((manufacturer, index) =>
                  React.createElement(
                    'label',
                    { 
                      key: index,
                      className: 'flex items-center text-sm text-gray-700 hover:text-gray-900 cursor-pointer' 
                    },
                    React.createElement('input', { type: 'checkbox', className: 'mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded', checked: selectedFilters.manufacturers.includes(manufacturer.name), onChange: () => toggleFilter('manufacturers', manufacturer.name) }),
                    React.createElement('span', null, manufacturer.name + ' '),
                    React.createElement('span', { className: 'text-gray-500' }, `(${manufacturer.count})`)
                  )
                ) : React.createElement(
                  'p',
                  { className: 'text-sm text-gray-500' },
                  'No manufacturers available'
                )
              )
            )
          )
        )
      ),

      // Main Content - Product Listing
      React.createElement(
        'main',
        { className: 'flex-1' },
        
        filteredSubItems.length === 0 ? React.createElement(
          'div',
          { className: 'text-center py-12 bg-white rounded-lg shadow-sm' },
          React.createElement('div', { className: 'text-gray-400 text-6xl mb-4' }, '📦'),
          React.createElement('h3', { className: 'text-xl font-semibold text-gray-600 mb-2' }, 'No sub-items available'),
          React.createElement('p', { className: 'text-gray-500' }, 'Check back later for new items')
        ) : React.createElement(
          'div',
          { className: 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4' },
          ...filteredSubItems.map(subItem =>
            React.createElement(
              'div',
              {
                key: subItem.id,
                className: 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'
              },
              
              // Product Row
              React.createElement(
                'div',
                { className: 'p-4 md:p-6' },
                React.createElement(
                  'div',
                  { className: 'flex flex-col md:flex-row gap-4 md:gap-6' },
                  
                  // Product Image
                  React.createElement(
                    'button',
                    { 
                      className: 'flex-shrink-0 mx-auto md:mx-0 cursor-pointer hover:opacity-80 transition-opacity',
                      onClick: () => navigate(`/sub-item/${subItem.id}`, {
                        state: {
                          itemName: itemName,
                          categoryName: categoryName,
                          categoryId: categoryId,
                          itemId: itemId
                        }
                      })
                    },
                    subItem.image_url ? React.createElement('img', {
                      src: subItem.image_url,
                      alt: subItem.name,
                      className: 'w-24 h-24 md:w-32 md:h-32 object-contain border border-gray-200 rounded'
                    }) : React.createElement(
                      'div',
                      { className: 'w-24 h-24 md:w-32 md:h-32 bg-gray-100 flex items-center justify-center border border-gray-200 rounded' },
                      React.createElement('span', { className: 'text-gray-400 text-2xl md:text-3xl' }, '📦')
                    )
                  ),

                  // Product Info
                  React.createElement(
                    'div',
                    { className: 'flex-1' },
                    
                    // Part Number & Badge
                    React.createElement(
                      'div',
                      { className: 'mb-2' },
                      React.createElement(
                        'h3',
                        { className: 'text-lg md:text-xl font-bold text-gray-900 mb-1' },
                        subItem.part_number || subItem.name,
                        React.createElement(
                          'span',
                          { className: 'inline-flex items-center justify-center w-5 h-5 md:w-6 md:h-6 ml-2 border-2 border-gray-700 rounded-full text-xs font-bold' },
                          '©'
                        )
                      ),
                      React.createElement('p', { className: 'text-sm md:text-base text-gray-700 font-medium' }, subItem.name)
                    ),

                    // VMRS Info
                    subItem.description && React.createElement(
                      'p',
                      { className: 'text-xs md:text-sm text-gray-600 mb-3' },
                      'VMRS: ',
                      subItem.description
                    ),

                    // Stock & Price Info
                    React.createElement(
                      'div',
                      { className: 'flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm mb-3' },
                      React.createElement(
                        'span',
                        { 
                          className: `px-2 md:px-3 py-1 rounded-full font-medium text-xs ${
                            subItem.status === 'active' && subItem.stock_quantity > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`
                        },
                        subItem.status === 'active' && subItem.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'
                      ),
                      subItem.stock_quantity > 0 && React.createElement(
                        'span',
                        { className: 'text-gray-600 text-xs md:text-sm' },
                        `Qty: ${subItem.stock_quantity}`
                      ),
                      subItem.price > 0 && React.createElement(
                        'span',
                        { className: 'text-gray-900 font-bold text-base md:text-lg' },
                        `$${parseFloat(subItem.price).toFixed(2)}`
                      )
                    ),

                    // Add to Cart Button (Mobile)
                    React.createElement(
                      'button',
                      { 
                        onClick: () => addToCart(subItem),
                        className: 'w-full md:w-auto bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition-colors font-medium'
                      },
                      'Add to Cart'
                    )
                  )
                ),

                // Expand Button
                React.createElement(
                  'button',
                  {
                    onClick: () => toggleExpand(subItem.id),
                    className: 'w-full px-6 py-2 border-t border-gray-200 flex items-center justify-center gap-2 text-sm text-gray-700 hover:bg-gray-50'
                  },
                  React.createElement(
                    'span',
                    { className: 'font-medium' },
                    expandedItem === subItem.id ? '−' : '+'
                  ),
                  React.createElement('span', null, expandedItem === subItem.id ? 'Less Info' : 'Description')
                )
              ),

              // Expanded Content - Description
              expandedItem === subItem.id && React.createElement(
                'div',
                { className: 'border-t border-gray-200 p-6 bg-white' },
                React.createElement(
                  'div',
                  { className: 'text-gray-700' },
                  React.createElement('p', null, subItem.description || 'No description available'),
                  subItem.part_number && React.createElement('p', { className: 'mt-2 text-sm' }, React.createElement('strong', null, 'Part Number: '), subItem.part_number),
                  subItem.stock_quantity && React.createElement('p', { className: 'mt-1 text-sm' }, React.createElement('strong', null, 'Available Quantity: '), subItem.stock_quantity)
                )
              )
            )
          )
        )
      )
    )
  );
};

export default SubItems;