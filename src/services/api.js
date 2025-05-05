import axios from 'axios';

// Create axios instance with default config
const API_URL = 'https://localhost:5056/api';

// Create a request cache to prevent duplicate requests
const requestCache = new Map();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// Request interceptor for adding auth token and caching
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Check if this is a GET request and if we already have cached data
    if (config.method === 'get') {
      const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
      const cachedResponse = requestCache.get(cacheKey);
      
      if (cachedResponse) {
        // If the cache is less than 30 seconds old, return the cached data
        const now = Date.now();
        if (now - cachedResponse.timestamp < 30000) {
          // This creates a canceled request that will be caught by the response interceptor
          config.adapter = () => {
            return Promise.resolve({
              data: cachedResponse.data,
              status: 200,
              statusText: 'OK',
              headers: {},
              config: config,
              request: {}
            });
          };
        } else {
          // Cache is stale, remove it
          requestCache.delete(cacheKey);
        }
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and caching
api.interceptors.response.use(
  response => {
    // Cache GET responses
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  error => {
    // If we have a 429 (too many requests) error, try to use cached data
    if (error.response && error.response.status === 429) {
      const config = error.config;
      if (config.method === 'get') {
        const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
        const cachedResponse = requestCache.get(cacheKey);
        
        if (cachedResponse) {
          console.warn('Rate limit exceeded, using cached data');
          return Promise.resolve({
            data: cachedResponse.data,
            status: 200,
            statusText: 'OK (from cache)',
            headers: {},
            config: config,
            request: {}
          });
        }
      }
      
      console.error('Rate limit exceeded and no cache available');
    }
    
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    return Promise.reject(error);
  }
);

export default api;