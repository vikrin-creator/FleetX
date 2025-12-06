const API_BASE_URL = 'https://sandybrown-squirrel-472536.hostingersite.com/api/v1';

export const categoryAPI = {
  // Categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return response.json();
  },

  createCategory: async (categoryData) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    return response.json();
  },

  updateCategory: async (id, categoryData) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    return response.json();
  },

  deleteCategory: async (id) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    return response.json();
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