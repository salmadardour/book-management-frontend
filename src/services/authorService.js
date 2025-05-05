import api from './api';

const AUTHOR_URL = '/authors';

// Author service for API calls related to authors
const authorService = {
  // Get all authors with optional filter parameters
  getAuthors: async (params = {}) => {
    const response = await api.get(AUTHOR_URL, { params });
    return response.data;
  },
  
  // Get a single author by ID
  getAuthorById: async (id) => {
    const response = await api.get(`${AUTHOR_URL}/${id}`);
    return response.data;
  },
  
  // Create a new author
  createAuthor: async (authorData) => {
    const response = await api.post(AUTHOR_URL, authorData);
    return response.data;
  },
  
  // Update an existing author
  updateAuthor: async (id, authorData) => {
    const response = await api.put(`${AUTHOR_URL}/${id}`, authorData);
    return response.data;
  },
  
  // Delete an author
  deleteAuthor: async (id) => {
    const response = await api.delete(`${AUTHOR_URL}/${id}`);
    return response.data;
  },
  
  // Get books by author
  getBooksByAuthor: async (id) => {
    const response = await api.get(`${AUTHOR_URL}/${id}/books`);
    return response.data;
  }
};

export default authorService;