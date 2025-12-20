const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sandybrown-squirrel-472536.hostingersite.com/backend/api';
const BASE_URL = 'https://sandybrown-squirrel-472536.hostingersite.com/backend';

// Helper function to convert relative image paths to full URLs
const processImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl; // Already full URL
  if (imageUrl.startsWith('uploads/')) return `${BASE_URL}/${imageUrl}`;
  return imageUrl;
};

export const productAPI = {
  // Get all products
  getProducts: async (categoryId = null) => {
    const url = categoryId 
      ? `${API_BASE_URL}/products?category_id=${categoryId}`
      : `${API_BASE_URL}/products`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Process image URLs
    if (data.success && data.data) {
      data.data = data.data.map(product => ({
        ...product,
        image_url: processImageUrl(product.image_url)
      }));
    }
    
    return data;
  },

  // Get single product
  getProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    const data = await response.json();
    
    // Process image URL
    if (data.success && data.data && data.data.image_url) {
      data.data.image_url = processImageUrl(data.data.image_url);
    }
    
    return data;
  },

  // Create product
  createProduct: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      body: productData, // FormData for file upload
    });
    const data = await response.json();
    
    // Process image URL in response
    if (data.success && data.data && data.data.image_url) {
      data.data.image_url = processImageUrl(data.data.image_url);
    }
    
    return data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'POST',
      body: productData, // FormData for file upload
    });
    const data = await response.json();
    
    // Process image URL in response
    if (data.success && data.data && data.data.image_url) {
      data.data.image_url = processImageUrl(data.data.image_url);
    }
    
    return data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
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
      throw new Error(result.message || 'Failed to delete product');
    }
  },
};