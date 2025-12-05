import apiClient from './api';

// Example service for a resource (e.g., vehicles)
export const vehicleService = {
  // Get all vehicles
  getAll: async (params = {}) => {
    return await apiClient.get('/vehicles', { params });
  },

  // Get single vehicle by ID
  getById: async (id) => {
    return await apiClient.get(`/vehicles/${id}`);
  },

  // Create new vehicle
  create: async (data) => {
    return await apiClient.post('/vehicles', data);
  },

  // Update vehicle
  update: async (id, data) => {
    return await apiClient.put(`/vehicles/${id}`, data);
  },

  // Delete vehicle
  delete: async (id) => {
    return await apiClient.delete(`/vehicles/${id}`);
  },
};

// Add more services as needed
