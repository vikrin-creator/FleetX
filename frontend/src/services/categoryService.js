const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sandybrown-squirrel-472536.hostingersite.com/backend/api';
const BASE_URL = 'https://sandybrown-squirrel-472536.hostingersite.com/backend';

// Helper function to convert relative image paths to full URLs
const processImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl; // Already full URL
  if (imageUrl.startsWith('uploads/')) return `${BASE_URL}/${imageUrl}`;
  return imageUrl;
};

export const categoryAPI = {
  // Categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();
    
    // Process image URLs
    if (data.success && data.data) {
      data.data = data.data.map(category => ({
        ...category,
        image_url: processImageUrl(category.image_url)
      }));
    }
    
    return data;
  },

  createCategory: async (categoryData) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      body: categoryData, // FormData for file upload
    });
    const data = await response.json();
    
    // Process image URL in response
    if (data.success && data.data && data.data.image_url) {
      data.data.image_url = processImageUrl(data.data.image_url);
    }
    
    return data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'POST',
      body: categoryData, // FormData for file upload
    });
    const data = await response.json();
    
    // Process image URL in response
    if (data.success && data.data && data.data.image_url) {
      data.data.image_url = processImageUrl(data.data.image_url);
    }
    
    return data;
  },

  deleteCategory: async (id) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id })
    });
    
    const result = await response.json();
    
    if (result.success) {
      return result;
    } else {
      throw new Error(result.message || 'Failed to delete category');
    }
  },

  // Category Items
  getCategoryItems: async (categoryId) => {
    try {
      console.log(`Fetching items for category ID: ${categoryId}`);
      
      // Use working endpoint with category_id parameter
      const response = await fetch(`${BASE_URL}/get-category-items.php?category_id=${categoryId}`);
      
      if (!response.ok) {
        console.error(`API Error: ${response.status} - ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Items data received for category ${categoryId}:`, data);
      
      if (data.success && data.data) {
        return data.data.map(item => ({
          ...item,
          image_url: processImageUrl(item.image_url)
        }));
      } else {
        console.warn('Unexpected data format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching category items:', error);
      return [];
    }
  },

  createCategoryItem: async (itemData) => {
    const response = await fetch(`${API_BASE_URL}/categories/items`, {
      method: 'POST',
      body: itemData, // FormData for file upload
    });
    return response.json();
  },

  updateCategoryItem: async (id, itemData) => {
    try {
      console.log(`Updating item ID: ${id}`);
      const response = await fetch(`${API_BASE_URL}/categories/items/${id}`, {
        method: 'POST',
        body: itemData, // FormData for file upload
      });
      
      if (!response.ok) {
        console.error(`Update Item Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Update item response:', data);
      return data;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  deleteCategoryItem: async (id) => {
    try {
      console.log(`Deleting item ID: ${id}`);
      const response = await fetch(`${API_BASE_URL}/categories/items/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        console.error(`Delete Item Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Delete item response:', data);
      return data;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },

  // Sub-Items Operations
  getSubItems: async (itemId) => {
    try {
      console.log(`Fetching sub-items for item ID: ${itemId}`);
      
      const response = await fetch(`${API_BASE_URL}/categories/items/${itemId}/sub-items`);
      
      if (!response.ok) {
        console.error(`API Error: ${response.status} - ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Sub-items data received for item ${itemId}:`, data);
      
      if (data.success && data.data) {
        return data.data.map(subItem => ({
          ...subItem,
          image_url: processImageUrl(subItem.image_url),
          specifications: typeof subItem.specifications === 'string' 
            ? JSON.parse(subItem.specifications) 
            : subItem.specifications || {}
        }));
      } else {
        console.warn('Unexpected data format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching sub-items:', error);
      return [];
    }
  },

  createSubItem: async (subItemData) => {
    try {
      console.log('Creating sub-item with data:', subItemData);
      const response = await fetch(`${API_BASE_URL}/categories/sub-items`, {
        method: 'POST',
        body: subItemData, // FormData for file upload
      });
      
      if (!response.ok) {
        console.error(`Create SubItem Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Create sub-item response:', data);
      return data;
    } catch (error) {
      console.error('Error creating sub-item:', error);
      throw error;
    }
  },

  updateSubItem: async (id, subItemData) => {
    try {
      console.log(`Updating sub-item ID: ${id}`);
      console.log('FormData being sent:', subItemData);
      
      // Log FormData contents
      if (subItemData instanceof FormData) {
        console.log('FormData entries:');
        for (let [key, value] of subItemData.entries()) {
          console.log(`  ${key}:`, value);
        }
      }
      
      // Use POST instead of PUT for FormData uploads
      const response = await fetch(`${API_BASE_URL}/categories/sub-items/${id}`, {
        method: 'POST',
        body: subItemData, // FormData for file upload
      });
      
      if (!response.ok) {
        console.error(`Update SubItem Error: ${response.status} - ${response.statusText}`);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to update sub-item: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Update sub-item response:', data);
      return data;
    } catch (error) {
      console.error('Error updating sub-item:', error);
      throw error;
    }
  },

  deleteSubItem: async (id) => {
    try {
      console.log(`Deleting sub-item ID: ${id}`);
      const response = await fetch(`${API_BASE_URL}/categories/sub-items/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        console.error(`Delete SubItem Error: ${response.status} - ${response.statusText}`);
        const text = await response.text();
        console.error('Error response body:', text);
      }
      
      const data = await response.json();
      console.log('Delete sub-item response:', data);
      return data;
    } catch (error) {
      console.error('Error deleting sub-item:', error);
      throw error;
    }
  },

  // Get single sub-item by ID with images
  getSubItemById: async (subItemId) => {
    try {
      console.log(`Fetching sub-item details for ID: ${subItemId}`);
      
      const response = await fetch(`${API_BASE_URL}/categories/sub-items/${subItemId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Sub-item details received:`, data);
      
      if (data.success && data.data) {
        const subItem = data.data;
        
        // Process main image URL
        subItem.image_url = processImageUrl(subItem.image_url);
        
        // Process multiple images if available
        if (subItem.images && Array.isArray(subItem.images)) {
          subItem.images = subItem.images.map(img => ({
            ...img,
            image_url: processImageUrl(img.image_url)
          }));
        }
        
        return subItem;
      } else {
        throw new Error('Sub-item not found');
      }
    } catch (error) {
      console.error('Error fetching sub-item details:', error);
      throw error;
    }
  },
};