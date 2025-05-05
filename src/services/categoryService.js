import api from './api';

const CATEGORY_URL = '/categories';

// Category service for API calls related to categories
const categoryService = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get(CATEGORY_URL);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a single category by ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`${CATEGORY_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new category
  createCategory: async (categoryData) => {
    try {
      const response = await api.post(CATEGORY_URL, categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update an existing category
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`${CATEGORY_URL}/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a category
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`${CATEGORY_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get books by category
  getBooksByCategory: async (id) => {
    try {
      const response = await api.get(`${CATEGORY_URL}/${id}/books`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default categoryService;