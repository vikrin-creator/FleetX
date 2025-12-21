import apiClient from './api';

export const searchService = {
  // Search across categories, items, and sub-items
  search: async (query) => {
    const response = await apiClient.get(`/search.php?q=${encodeURIComponent(query)}`);
    return response.data;
  }
};

export default searchService;
