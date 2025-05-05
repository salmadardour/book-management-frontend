import api from './api';

const BOOK_URL = '/books';

// Book service for API calls related to books
const bookService = {
  // Get all books with optional filter parameters
  getBooks: async (params = {}) => {
    try {
      const response = await api.get(BOOK_URL, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a single book by ID
  getBookById: async (id) => {
    try {
      const response = await api.get(`${BOOK_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new book
  createBook: async (bookData) => {
    try {
      const response = await api.post(BOOK_URL, bookData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update an existing book
  updateBook: async (id, bookData) => {
    try {
      const response = await api.put(`${BOOK_URL}/${id}`, bookData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a book
  deleteBook: async (id) => {
    try {
      const response = await api.delete(`${BOOK_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get books by author ID
  getBooksByAuthor: async (authorId) => {
    try {
      const response = await api.get(`${BOOK_URL}/author/${authorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get books by category ID
  getBooksByCategory: async (categoryId) => {
    try {
      const response = await api.get(`${BOOK_URL}/category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get books by publisher ID
  getBooksByPublisher: async (publisherId) => {
    try {
      const response = await api.get(`${BOOK_URL}/publisher/${publisherId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default bookService;