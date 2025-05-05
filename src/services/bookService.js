import api from './api';

const BOOK_URL = '/books';

// Book service for API calls related to books
const bookService = {
  // Get all books with optional filter parameters
  getBooks: async (params = {}) => {
    const response = await api.get(BOOK_URL, { params });
    return response.data;
  },
  
  // Get a single book by ID
  getBookById: async (id) => {
    const response = await api.get(`${BOOK_URL}/${id}`);
    return response.data;
  },
  
  // Create a new book
  createBook: async (bookData) => {
    const response = await api.post(BOOK_URL, bookData);
    return response.data;
  },
  
  // Update an existing book
  updateBook: async (id, bookData) => {
    const response = await api.put(`${BOOK_URL}/${id}`, bookData);
    return response.data;
  },
  
  // Delete a book
  deleteBook: async (id) => {
    const response = await api.delete(`${BOOK_URL}/${id}`);
    return response.data;
  },
  
  // Get books by author ID
  getBooksByAuthor: async (authorId) => {
    const response = await api.get(`${BOOK_URL}/author/${authorId}`);
    return response.data;
  },
  
  // Get books by category ID
  getBooksByCategory: async (categoryId) => {
    const response = await api.get(`${BOOK_URL}/category/${categoryId}`);
    return response.data;
  },
  
  // Get books by publisher ID
  getBooksByPublisher: async (publisherId) => {
    const response = await api.get(`${BOOK_URL}/publisher/${publisherId}`);
    return response.data;
  }
};

export default bookService;