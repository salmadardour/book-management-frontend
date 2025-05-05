// src/services/apiHelper.js

import axios from 'axios';

// Function to check if we're using localStorage mode
export const isUsingLocalStorage = () => {
  return localStorage.getItem('useLocalStorage') === 'true';
};

// Function to toggle localStorage mode
export const useLocalStorageMode = () => {
  localStorage.setItem('useLocalStorage', 'true');
  window.location.reload();
};

// Function to toggle API mode
export const useApiMode = () => {
  localStorage.removeItem('useLocalStorage');
  window.location.reload();
};

// Create a base URL for API requests based on environment
export const getApiBaseUrl = () => {
  return process.env.REACT_APP_API_URL || 'https://localhost:5056/api';
};

// Helper function to generate a consistent delay for localStorage operations
export const simulateDelay = async (delay = 300) => {
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Helper function for authenticated API requests
export const authenticatedRequest = async (method, url, data = null) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const config = {
    method,
    url,
    headers: { Authorization: `Bearer ${token}` }
  };
  
  if (data) {
    config.data = data;
  }
  
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      error.response?.data || 
      error.message ||
      `Failed to ${method} data`
    );
  }
};

// Create a function for handling localStorage data
export const localStorageData = {
  // Initialize localStorage with sample data
  initializeStorage: (key, sampleData) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(sampleData));
    }
  },
  
  // Get all items from localStorage
  getAll: async (key, sampleData) => {
    localStorageData.initializeStorage(key, sampleData);
    const items = JSON.parse(localStorage.getItem(key)) || [];
    await simulateDelay();
    return items;
  },
  
  // Get a single item by ID
  getById: async (key, id, sampleData) => {
    localStorageData.initializeStorage(key, sampleData);
    const items = JSON.parse(localStorage.getItem(key)) || [];
    const item = items.find(i => i.id === parseInt(id));
    
    if (!item) {
      throw new Error('Item not found');
    }
    
    await simulateDelay();
    return item;
  },
  
  // Create a new item
  create: async (key, itemData, sampleData) => {
    localStorageData.initializeStorage(key, sampleData);
    const items = JSON.parse(localStorage.getItem(key)) || [];
    
    // Generate a new ID
    const maxId = items.length > 0 ? Math.max(...items.map(i => i.id)) : 0;
    const newItem = { ...itemData, id: maxId + 1 };
    
    items.push(newItem);
    localStorage.setItem(key, JSON.stringify(items));
    
    await simulateDelay();
    return newItem;
  },
  
  // Update an existing item
  update: async (key, id, itemData, sampleData) => {
    localStorageData.initializeStorage(key, sampleData);
    const items = JSON.parse(localStorage.getItem(key)) || [];
    const index = items.findIndex(i => i.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Item not found');
    }
    
    // Keep the ID unchanged
    const updatedItem = { ...itemData, id: parseInt(id) };
    items[index] = updatedItem;
    
    localStorage.setItem(key, JSON.stringify(items));
    
    await simulateDelay();
    return updatedItem;
  },
  
  // Delete an item
  delete: async (key, id, sampleData) => {
    localStorageData.initializeStorage(key, sampleData);
    const items = JSON.parse(localStorage.getItem(key)) || [];
    const filteredItems = items.filter(i => i.id !== parseInt(id));
    
    if (filteredItems.length === items.length) {
      throw new Error('Item not found');
    }
    
    localStorage.setItem(key, JSON.stringify(filteredItems));
    
    await simulateDelay();
    return parseInt(id);
  }
};