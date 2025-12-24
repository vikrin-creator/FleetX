import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryAPI } from '../services/categoryService.js';
import searchService from '../services/searchService.js';

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState({ categories: [], items: [], sub_items: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Fallback categories in case API fails
  const fallbackCategories = [
    {
      name: 'Cooling System',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhhf2s7bFASkvetkwpg5b0bxEHsT_Dy9KmpopFXJqffZrFteIjse1BAcKeEVE5gKERSV1lvvyJBcfk8ewfaEUKfU8XPkeoLSiBzLHkqBZ4YSvnv-Vlj2jLBA8b0hSxV0pxnBcIn9Mp1WMegNuiaeF2WzOrAXq7UhUQLLWyeH9HttKsmkKw5wcoYeAk3AJAka_HazwQezaMWCz0V7q6pLQ3_GRlkimhXauQd7SagNOxMNg7zlXgpkQI-Eetb8uaXlHXqIWjnqswPTIk'
    },
    {
      name: 'Steering System',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBQpQ4MSL238L6KtWxBZvt51_2Tjn8g3hgrBC-w9JUnKm-M5_R2TcojCwHnt45szjw8i8usmj-ZEfu5tQ1vsdxhgbxabcTwHwf6pWyKHEtnlmxNB7RUTYBTxlCH_saYHN0HPsmjoIC5EV_wq5OZvxcd3I103OhGqIWVebsh9vlaZYrYeKeUeETtTIlew6Q8JBabFuU34tnBwt9HxmQlFDQn39M8ghwIeYcGDaKDTrdDjKjKaNo-YeAIRB2i0374QyzwP5Ct1b5w162'
    },
    {
      name: 'Body and Cabin',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB909jqOrfPyCOzNwqOwY_gOus6qfYPRWS0SMuIeh1EGTIifsWulwozmNtxYJnuCf8KvK4ivbemaC_6KTJL194TBZb1Q9oicpKc7Bs19eVmhtAIZFJD_8zCFL9-gAMfKTk0Toq9z4Ah7E8WKwMXSKaX4_U2IlgCGE3oFIQ15pu6pNXCdetfguEYceKILnIDRNmEYHAlVj2MoKOq06Mc3s2Jf8tzRAgyDvLiqKMjhyo_7GXK6AP1AqfkKp_YCGh9GJrobFHs_D3B13uW'
    },
    {
      name: 'Air Spring & Shocks',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYVtzDLGiyu7MgUwJCaIZu1HTNz733ftKGMtL9kphQIIxoTy8cvcvHWT1r5c6cUkx5MWUHCXdqPCc4Wl7p06kKSPHIoaMm_D76B5Bh_8gptNFhbRuSurjI0KE7HTBupadAm4Pcgltmo11yBJjz8sOyDrovZPUgNa95jVa4DrIIz9kBDtZPs7fXiTQsqWw1NIZDHhzqCXLvx5W2G95Hazwu_bjTmT32WwjATIs5mFwetnGFy8vco2q0BH_OqXrI54sG-vJd_zN7li3R'
    },
    {
      name: 'Air Brake & Wheel',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBviyaeWwi0hfOqgPhpV2-TE1PF8BNPXzwbV2f9rz-F-YJqBTJW9TZ_6IbAL5z_HigcQACqdegD38e_TVFfZQRDP1QaGo1yJnzP-ifgEjEMhoaEhpdtzdxb3Obmp69cao-89MmaEUnEY6MFtoel-ZDtL0Vhew3CVGggZCJkxEoMT-QbCFCPgp5H7FcEBZj6cD84resiGoJleN5rlRTf-rMOQokDYSEtGSu1Kq9EWjgOqLDaR4s3nthf2nEBieAgutlPcR2t-Buy1gvZ'
    },
    {
      name: 'Chrome & Stainless',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1wWzLBUmQPj0Ephcv1dVyv9KYEE2PQFWCXUMNu_047cbXEy8ik8GRdV3_3RSY8Rthc8WZzhvAueLmlzty3UqXtesvQj4zKFxWKqW-FRtaBJD_fA0vMQNa9X83OI6uFVGYJemCp7_0olKz7cG2igVgkGpLrUoXNOVdrpGhPVnxWTuUuRzRlKpGKNkHw_dG9TfV3yoIrMdnppza3fIIOS36PukpP9m7ml8-vRRji3VoB0sb8S7dIAhGF76HjNbR-oo3G-KAH7SfPicY'
    }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getCategories();
      if (response.success && response.data && response.data.length > 0) {
        setCategories(response.data);
      } else {
        // Use fallback categories if API returns empty data
        setCategories(fallbackCategories);
      }
    } catch (error) {
      console.error('Failed to fetch categories, using fallback:', error);
      // Use fallback categories if API fails
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults({ categories: [], items: [], sub_items: [] });
      return;
    }

    setSearchLoading(true);
    try {
      // Use backend search API that searches across categories, items, and sub-items
      // Includes: names, descriptions, part numbers, brand, manufacturer
      console.log('Searching for:', query);
      const response = await searchService.search(query);
      console.log('Search response:', response);
      
      if (response.success && response.results) {
        console.log('Setting search results:', response.results);
        setSearchResults(response.results);
      } else {
        console.log('No results or unsuccessful response');
        setSearchResults({ categories: [], items: [], sub_items: [] });
      }
    } catch (error) {
      console.error('Search error:', error);
      console.error('Error details:', error.response?.data);
      setSearchResults({ categories: [], items: [], sub_items: [] });
    }
    setSearchLoading(false);
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      setShowSearchModal(true);
      performSearch(query);
    } else {
      setShowSearchModal(false);
    }
  };

  const closeSearchModal = () => {
    setShowSearchModal(false);
    setSearchQuery('');
    setSearchResults({ categories: [], items: [], sub_items: [] });
  };

  const handleCategoryClick = (category) => {
    closeSearchModal();
    navigate('/products', { 
      state: { 
        selectedCategoryId: category.id,
        selectedCategoryName: category.name 
      }
    });
  };

  const handleItemClick = (item) => {
    closeSearchModal();
    navigate('/products', { 
      state: { 
        selectedCategoryId: item.category_id || item.categoryId,
        selectedCategoryName: item.categoryName,
        selectedItem: item 
      }
    });
  };

  const handleSubItemClick = (subItem) => {
    closeSearchModal();
    // Navigate to sub-items page for this item
    navigate(`/sub-items/${subItem.item_id}`, {
      state: {
        itemName: subItem.item_name,
        categoryName: subItem.categoryName,
        categoryId: subItem.category_id || subItem.categoryId
      }
    });
  };

  return React.createElement(
    'div',
    { className: 'w-full' },
    // Search Bar Section
    React.createElement(
      'div',
      { className: 'mt-6 md:mt-8 w-full max-w-2xl mx-auto px-4 relative' },
      React.createElement(
        'div',
        { className: 'relative' },
        React.createElement(
          'div',
          { className: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10' },
          React.createElement('span', { 
            className: 'material-symbols-outlined text-slate-400 text-base' 
          }, 'search')
        ),
        React.createElement('input', {
          className: 'w-full h-10 md:h-12 pl-10 pr-4 text-slate-900 bg-white rounded-lg shadow-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 placeholder:text-slate-400 text-sm transition-all duration-300 hover:shadow-lg',
          placeholder: 'Search for parts, categories...',
          type: 'text',
          value: searchQuery,
          onChange: handleSearchInput
        }),
        searchQuery && React.createElement(
          'div',
          { className: 'absolute inset-y-0 right-0 pr-4 flex items-center' },
          React.createElement(
            'button',
            {
              onClick: closeSearchModal,
              className: 'p-2 hover:bg-slate-100 rounded-full transition-colors'
            },
            React.createElement('span', { 
              className: 'material-symbols-outlined text-slate-400 text-lg' 
            }, 'close')
          )
        )
      ),
      // Search Dropdown
      showSearchModal && React.createElement(
        'div',
        { className: 'absolute top-full left-0 right-0 mt-2 sm:mt-3 mx-2 sm:mx-4 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden backdrop-blur-sm flex flex-col max-h-[80vh] sm:max-h-[75vh]' },
        React.createElement(
          'div',
          { className: 'p-3 sm:p-4 lg:p-5 border-b border-slate-100 flex-shrink-0' },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between' },
            React.createElement('h3', { className: 'text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1 sm:gap-2 truncate' }, 
              React.createElement('span', { className: 'material-symbols-outlined text-primary text-sm sm:text-base' }, 'search'),
              `Search Results for "${searchQuery}"`
            ),
            React.createElement(
              'button',
              {
                onClick: closeSearchModal,
                className: 'p-1 sm:p-2 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0'
              },
              React.createElement('span', { className: 'material-symbols-outlined text-slate-400 text-sm' }, 'close')
            )
          )
        ),
        React.createElement(
          'div',
          { 
            className: 'flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 min-h-0',
            style: {
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 #f1f5f9'
            }
          },
          searchLoading ?
          React.createElement(
            'div',
            { className: 'flex items-center justify-center py-4' },
            React.createElement('div', { className: 'animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full' }),
            React.createElement('span', { className: 'ml-3 text-sm text-slate-600 dark:text-slate-400' }, 'Searching...')
          ) :
          searchResults.categories.length === 0 && searchResults.items.length === 0 && searchResults.sub_items.length === 0 ?
          // No results at all
          React.createElement(
            'div',
            { className: 'text-center py-6 text-slate-500 dark:text-slate-400' },
            React.createElement('span', { className: 'material-symbols-outlined text-2xl mb-2 block' }, 'search_off'),
            React.createElement('p', { className: 'text-sm font-medium' }, 'No results found'),
            React.createElement('p', { className: 'text-xs mt-1' }, 'Try searching with different keywords or part numbers')
          ) :
          React.createElement(
            'div',
            { className: 'space-y-4 sm:space-y-6' },
            // Categories section - only show if has results
            searchResults.categories.length > 0 && React.createElement(
              'div',
              null,
              React.createElement('h4', { className: 'text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 sm:mb-3 uppercase tracking-wide flex items-center gap-1 sm:gap-2' }, 
                React.createElement('span', { className: 'material-symbols-outlined text-xs sm:text-sm' }, 'category'),
                `Categories (${searchResults.categories.length})`
              ),
              React.createElement(
                'div',
                { className: 'grid grid-cols-2 gap-2 sm:gap-3' },
                searchResults.categories.map((category, index) =>
                  React.createElement(
                    'div',
                    {
                      key: index,
                      onClick: () => handleCategoryClick(category),
                        className: 'flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer transition-colors'
                      },
                      React.createElement('img', {
                        src: category.image_url || 'https://via.placeholder.com/32',
                        alt: category.name,
                        className: 'w-6 h-6 sm:w-8 sm:h-8 rounded object-cover flex-shrink-0',
                      onError: (e) => { e.target.src = 'https://via.placeholder.com/32?text=No+Image'; }
                    }),
                    React.createElement(
                      'div',
                      { className: 'flex-1 min-w-0' },
                        React.createElement('div', { className: 'text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-50 truncate' }, category.name),
                      React.createElement('div', { className: 'text-xs text-slate-500 dark:text-slate-400' }, 'Category')
                    )
                  )
                )
              )
            ),
            // Items section - only show if has results
            searchResults.items.length > 0 && React.createElement(
              'div',
              null,
              React.createElement('h4', { className: 'text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 sm:mb-3 uppercase tracking-wide flex items-center gap-1 sm:gap-2' }, 
                React.createElement('span', { className: 'material-symbols-outlined text-xs sm:text-sm' }, 'inventory'),
                `Items (${searchResults.items.length})`
              ),
              React.createElement(
                'div',
                { className: 'grid grid-cols-2 gap-2 sm:gap-3' },
                searchResults.items.map((item, index) =>
                  React.createElement(
                    'div',
                    {
                      key: index,
                      onClick: () => handleItemClick(item),
                      className: 'flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer transition-colors'
                    },
                    React.createElement('img', {
                      src: item.image_url || 'https://via.placeholder.com/32',
                      alt: item.name,
                      className: 'w-6 h-6 sm:w-8 sm:h-8 rounded object-cover flex-shrink-0',
                      onError: (e) => { e.target.src = 'https://via.placeholder.com/32?text=No+Image'; }
                    }),
                    React.createElement(
                      'div',
                      { className: 'flex-1 min-w-0' },
                      React.createElement('div', { className: 'text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-50 truncate' }, item.name),
                      item.part_number && React.createElement('div', { className: 'text-xs text-blue-600 dark:text-blue-400 truncate' }, `Part #: ${item.part_number}`),
                      React.createElement('div', { className: 'text-xs text-slate-500 dark:text-slate-400 truncate' }, item.categoryName),
                      item.price && React.createElement('div', { className: 'text-xs font-semibold text-primary' }, `$${parseFloat(item.price).toFixed(2)}`)
                    )
                  )
                )
              )
            ),
            // Sub-Items section - only show if has results
            searchResults.sub_items.length > 0 && React.createElement(
              'div',
              null,
              React.createElement('h4', { className: 'text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 sm:mb-3 uppercase tracking-wide flex items-center gap-1 sm:gap-2' }, 
                React.createElement('span', { className: 'material-symbols-outlined text-xs sm:text-sm' }, 'widgets'),
                `Sub-Items (${searchResults.sub_items.length})`
              ),
              React.createElement(
                'div',
                { className: 'grid grid-cols-2 gap-2 sm:gap-3' },
                searchResults.sub_items.map((subItem, index) =>
                  React.createElement(
                    'div',
                    {
                      key: index,
                      onClick: () => handleSubItemClick(subItem),
                      className: 'flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer transition-colors'
                    },
                    React.createElement('img', {
                      src: subItem.image_url || 'https://via.placeholder.com/32',
                      alt: subItem.name,
                      className: 'w-6 h-6 sm:w-8 sm:h-8 rounded object-cover flex-shrink-0',
                      onError: (e) => { e.target.src = 'https://via.placeholder.com/32?text=No+Image'; }
                    }),
                    React.createElement(
                      'div',
                      { className: 'flex-1 min-w-0' },
                      React.createElement('div', { className: 'text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-50 truncate' }, subItem.name),
                      subItem.part_number && React.createElement('div', { className: 'text-xs text-blue-600 dark:text-blue-400 truncate' }, `Part #: ${subItem.part_number}`),
                      React.createElement('div', { className: 'text-xs text-slate-500 dark:text-slate-400 truncate' }, `${subItem.categoryName} › ${subItem.item_name}`),
                      (subItem.brand || subItem.manufacturer) && React.createElement(
                        'div',
                        { className: 'flex gap-1 mt-0.5' },
                        subItem.brand && React.createElement('span', { className: 'text-xs bg-gray-200 dark:bg-gray-600 px-1 sm:px-1.5 py-0.5 rounded truncate' }, subItem.brand),
                        subItem.manufacturer && React.createElement('span', { className: 'text-xs bg-gray-200 dark:bg-gray-600 px-1 sm:px-1.5 py-0.5 rounded truncate' }, subItem.manufacturer)
                      ),
                      subItem.price && React.createElement('div', { className: 'text-xs font-semibold text-primary mt-0.5' }, `$${parseFloat(subItem.price).toFixed(2)}`)
                    )
                  )
                )
              )
            )
          )
        )
      )
    ),
    // Hero Section
    React.createElement(
      'div',
      {
        className: 'relative w-full h-[300px] sm:h-[400px] md:h-[500px] mt-4 md:mt-8 rounded-lg md:rounded-xl overflow-hidden text-white bg-cover bg-center',
        style: { backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBviyaeWwi0hfOqgPhpV2-TE1PF8BNPXzwbV2f9rz-F-YJqBTJW9TZ_6IbAL5z_HigcQACqdegD38e_TVFfZQRDP1QaGo1yJnzP-ifgEjEMhoaEhpdtzdxb3Obmp69cao-89MmaEUnEY6MFtoel-ZDtL0Vhew3CVGggZCJkxEoMT-QbCFCPgp5H7FcEBZj6cD84resiGoJleN5rlRTf-rMOQokDYSEtGSu1Kq9EWjgOqLDaR4s3nthf2nEBieAgutlPcR2t-Buy1gvZ')" }
      },
      React.createElement('div', { className: 'absolute inset-0 bg-black/60' }),
      React.createElement(
        'div',
        { className: 'relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8' },
        React.createElement('h1', { className: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight' }, 'Heavy-Duty Parts for the Long Haul'),
        React.createElement('p', { className: 'mt-3 md:mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-white/90 px-2' }, 'Your one-stop shop for reliable, high-performance truck parts. Keep your fleet running strong with our extensive inventory.'),
        React.createElement(
          'div',
          { className: 'mt-6 md:mt-8 w-full max-w-2xl px-4 sm:px-0' },
          React.createElement(
            'div',
            { className: 'flex justify-center w-full sm:w-auto' },
            React.createElement(
              'button',
              { 
                onClick: () => navigate('/products'),
                className: 'flex min-w-[120px] sm:min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 md:h-12 px-5 md:px-6 bg-primary text-white text-sm md:text-base font-bold leading-normal tracking-[0.015em]' 
              },
              React.createElement('span', { className: 'truncate' }, 'Shop All Parts')
            )
          )
        )
      )
    ),

    // Product Categories
    React.createElement(
      'div',
      { className: 'bg-white rounded-lg md:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mt-4' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between px-1 sm:px-2 md:px-4 pb-2 sm:pb-3 pt-2 sm:pt-3 md:pt-5' },
        React.createElement('h2', { className: 'text-slate-900 text-lg sm:text-xl md:text-2xl font-bold leading-tight tracking-[-0.015em]' }, 'PRODUCT CATEGORIES'),
        React.createElement(
          'button',
          {
            onClick: () => navigate('/products'),
            className: 'text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm md:text-base whitespace-nowrap'
          },
          'View All Categories →'
        )
      ),
      loading 
        ? React.createElement(
            'div', 
            { className: 'flex justify-center items-center p-8' },
            React.createElement('div', { className: 'text-slate-500' }, 'Loading categories...')
          )
        : React.createElement(
            'div',
            { className: 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 p-1 sm:p-2 md:p-4' },
            categories.slice(0, 6).map((category, index) =>
              React.createElement(
                'div',
                { 
                  key: index, 
                  className: 'flex flex-col gap-1 sm:gap-2 md:gap-3 pb-2 sm:pb-3 group cursor-pointer',
                  onClick: () => handleCategoryClick(category)
                },
                React.createElement('div', {
                  className: 'w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden transform group-hover:scale-95 transition-transform duration-300',
                  style: { backgroundImage: `url('${category.image_url}')` }
                }),
                React.createElement('p', { className: 'text-slate-900 text-xs sm:text-sm md:text-base font-medium leading-normal pt-1 md:pt-2 text-center px-1' }, category.name)
              )
            )
          )
    ),

    // Partner Section
    React.createElement(
      'div',
      { className: 'mt-8 md:mt-12 mb-6 md:mb-8' },
      React.createElement('h2', { className: 'text-slate-900 text-xl md:text-2xl font-bold leading-tight tracking-[-0.015em] px-2 md:px-4 pb-3 pt-3 md:pt-5' }, 'PARTNER'),
      React.createElement(
        'div',
        { className: 'bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-4 md:gap-6' },
          React.createElement('img', {
            alt: 'Eagle Truck Parts logo',
            className: 'h-20 md:h-28 w-auto object-contain',
            src: '/Eagle_Transparent.png'
          }),
          React.createElement(
            'div',
            null,
            React.createElement('h3', { className: 'text-lg md:text-xl font-bold text-slate-900' }, 'Eagle Truck Parts')
          )
        ),
        React.createElement(
          'div',
          { className: 'flex flex-col gap-2 md:gap-3 text-left md:text-right text-xs md:text-sm text-slate-600 w-full md:w-auto' },
          React.createElement(
            'div',
            { className: 'flex items-center md:justify-end gap-2 md:gap-3' },
            React.createElement('span', { className: 'material-symbols-outlined text-slate-400 text-lg md:text-xl md:order-2' }, 'location_on'),
            React.createElement('span', { className: 'break-all md:break-normal' }, '415 E 31 Street Anderson, IN 46016')
          ),
          React.createElement(
            'div',
            { className: 'flex items-center md:justify-end gap-2 md:gap-3' },
            React.createElement('span', { className: 'material-symbols-outlined text-slate-400 text-lg md:text-xl md:order-2' }, 'call'),
            React.createElement('span', null, '917-293-3704')
          ),
          React.createElement(
            'div',
            { className: 'flex items-center md:justify-end gap-2 md:gap-3' },
            React.createElement('span', { className: 'material-symbols-outlined text-slate-400 text-lg md:text-xl md:order-2' }, 'mail'),
            React.createElement('span', { className: 'break-all md:break-normal' }, 'punjabtruckrepair@gmail.com')
          )
        )
      )
    )
  );
};

export default Home;
