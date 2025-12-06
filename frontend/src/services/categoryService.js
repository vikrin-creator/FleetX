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
      method: 'PUT',
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
    const response = await fetch(`${API_BASE_URL}/categories/items/${categoryId}`);
    return response.json();
  },

  createCategoryItem: async (itemData) => {
    const response = await fetch(`${API_BASE_URL}/categories/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    return response.json();
  },

  updateCategoryItem: async (id, itemData) => {
    const response = await fetch(`${API_BASE_URL}/categories/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    return response.json();
  },

  deleteCategoryItem: async (id) => {
    const response = await fetch(`${API_BASE_URL}/categories/items/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};