import api from './api';

const AUTHOR_URL = '/authors';

// Author service for API calls related to authors
const authorService = {
  // Get all authors with optional filter parameters
  getAuthors: async (params = {}) => {
    try {
      const response = await api.get(AUTHOR_URL, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a single author by ID
  getAuthorById: async (id) => {
    try {
      const response = await api.get(`${AUTHOR_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new author
  createAuthor: async (authorData) => {
    try {
      const response = await api.post(AUTHOR_URL, authorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update an existing author
  updateAuthor: async (id, authorData) => {
    try {
      const response = await api.put(`${AUTHOR_URL}/${id}`, authorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete an author
  deleteAuthor: async (id) => {
    try {
      const response = await api.delete(`${AUTHOR_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get books by author
  getBooksByAuthor: async (id) => {
    try {
      const response = await api.get(`${AUTHOR_URL}/${id}/books`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authorService;