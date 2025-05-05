// Sample data for initialization
const sampleBooks = [
    {
      id: 1,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      publishYear: 1960,
      category: 'Fiction',
      isbn: '9780061120084'
    },
    {
      id: 2,
      title: '1984',
      author: 'George Orwell',
      publishYear: 1949,
      category: 'Dystopian',
      isbn: '9780451524935'
    },
    {
      id: 3,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      publishYear: 1925,
      category: 'Classic',
      isbn: '9780743273565'
    }
  ];
  
  const sampleUsers = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      password: 'Admin@123', // In a real app, passwords would be hashed
      fullName: 'System Administrator',
      role: 'Admin'
    },
    {
      id: 2,
      username: 'user',
      email: 'user@example.com',
      password: 'User@123',
      fullName: 'Regular User',
      role: 'User'
    }
  ];
  
  // Initialize localStorage with sample data if empty
  const initializeLocalStorage = () => {
    if (!localStorage.getItem('books')) {
      localStorage.setItem('books', JSON.stringify(sampleBooks));
    }
    
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(sampleUsers));
    }
  };
  
  // Helper to simulate async behavior for a more realistic API experience
  const asyncResponse = (data, delay = 300) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay);
    });
  };
  
  // Book service with localStorage
  export const localBookService = {
    getAll: async () => {
      initializeLocalStorage();
      const books = JSON.parse(localStorage.getItem('books')) || [];
      return asyncResponse(books);
    },
    
    getById: async (id) => {
      initializeLocalStorage();
      const books = JSON.parse(localStorage.getItem('books')) || [];
      const book = books.find(b => b.id === parseInt(id));
      
      if (!book) {
        return Promise.reject(new Error('Book not found'));
      }
      
      return asyncResponse(book);
    },
    
    create: async (bookData) => {
      initializeLocalStorage();
      const books = JSON.parse(localStorage.getItem('books')) || [];
      
      // Generate a new ID
      const maxId = books.length > 0 ? Math.max(...books.map(b => b.id)) : 0;
      const newBook = { ...bookData, id: maxId + 1 };
      
      books.push(newBook);
      localStorage.setItem('books', JSON.stringify(books));
      
      return asyncResponse(newBook);
    },
    
    update: async (id, bookData) => {
      initializeLocalStorage();
      const books = JSON.parse(localStorage.getItem('books')) || [];
      const index = books.findIndex(b => b.id === parseInt(id));
      
      if (index === -1) {
        return Promise.reject(new Error('Book not found'));
      }
      
      // Keep the ID unchanged
      const updatedBook = { ...bookData, id: parseInt(id) };
      books[index] = updatedBook;
      
      localStorage.setItem('books', JSON.stringify(books));
      
      return asyncResponse(updatedBook);
    },
    
    delete: async (id) => {
      initializeLocalStorage();
      const books = JSON.parse(localStorage.getItem('books')) || [];
      const filteredBooks = books.filter(b => b.id !== parseInt(id));
      
      if (filteredBooks.length === books.length) {
        return Promise.reject(new Error('Book not found'));
      }
      
      localStorage.setItem('books', JSON.stringify(filteredBooks));
      
      return asyncResponse({ success: true });
    }
  };
  
  // Auth service with localStorage
  export const localAuthService = {
    login: async (credentials) => {
      initializeLocalStorage();
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      const user = users.find(
        u => u.username === credentials.username && u.password === credentials.password
      );
      
      if (!user) {
        return Promise.reject(new Error('Invalid username or password'));
      }
      
      // Create a mock token
      const token = `mock-jwt-token-${Date.now()}`;
      
      // Store user info in localStorage (simulating a session)
      const userInfo = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      localStorage.setItem('token', token);
      
      return asyncResponse({ user: userInfo, token });
    },
    
    register: async (userData) => {
      initializeLocalStorage();
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Check if username or email already exists
      if (users.some(u => u.username === userData.username)) {
        return Promise.reject(new Error('Username already exists'));
      }
      
      if (users.some(u => u.email === userData.email)) {
        return Promise.reject(new Error('Email already exists'));
      }
      
      // Generate a new ID
      const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
      
      // Set default role to 'User'
      const newUser = { 
        ...userData, 
        id: maxId + 1,
        role: 'User'
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Return user without sensitive information
      const { password, ...userInfo } = newUser;
      
      return asyncResponse(userInfo);
    },
    
    logout: () => {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      return asyncResponse({ success: true });
    },
    
    getCurrentUser: () => {
      const userJson = localStorage.getItem('currentUser');
      if (!userJson) return null;
      
      try {
        return JSON.parse(userJson);
      } catch (error) {
        localStorage.removeItem('currentUser');
        return null;
      }
    },
    
    isAuthenticated: () => {
      return !!localStorage.getItem('currentUser');
    }
  };