import api from './api';

const CATEGORY_URL = '/categories';

// Category service for API calls related to categories
const categoryService = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get(CATEGORY_URL);
    return response.data;
  },
  
  // Get a single category by ID
  getCategoryById: async (id) => {
    const response = await api.get(`${CATEGORY_URL}/${id}`);
    return response.data;
  },
  
  // Create a new category
  createCategory: async (categoryData) => {
    const response = await api.post(CATEGORY_URL, categoryData);
    return response.data;
  },
  
  // Update an existing category
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`${CATEGORY_URL}/${id}`, categoryData);
    return response.data;
  },
  
  // Delete a category
  deleteCategory: async (id) => {
    const response = await api.delete(`${CATEGORY_URL}/${id}`);
    return response.data;
  },
  
  // Get books by category
  getBooksByCategory: async (id) => {
    const response = await api.get(`${CATEGORY_URL}/${id}/books`);
    return response.data;
  }
};

export default categoryService;