import api from './api';

const AUTH_URL = '/auth';

// Authentication service for API calls related to authentication
const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post(`${AUTH_URL}/login`, credentials);
      
    // Store user data and token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },
  
  // Register new user
  register: async (userData) => {
    const response = await api.post(`${AUTH_URL}/register`, userData);
    return response.data;
  },
  
  // Get user profile
  getUserProfile: async () => {
    const response = await api.get(`${AUTH_URL}/profile`);
    
    // Update user data in localStorage
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  },
  
  // Logout user
  logout: async () => {
    try {
      // Make API call to server logout endpoint (if available)
      await api.post(`${AUTH_URL}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
  
  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post(`${AUTH_URL}/refresh-token`, { refreshToken });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response.data;
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};

export default authService;