import axios from 'axios';

// Use environment variable for API base URL
const API_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:5056/api';

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
    
    if (config.method === 'get') {
      const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
      const cachedResponse = requestCache.get(cacheKey);
      
      if (cachedResponse) {
        const now = Date.now();
        if (now - cachedResponse.timestamp < 30000) {
          config.adapter = () => {
            return Promise.resolve({
              data: cachedResponse.data,
              status: 200,
              statusText: 'OK (from cache)',
              headers: {},
              config,
              request: {}
            });
          };
        } else {
          requestCache.delete(cacheKey);
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors and caching
api.interceptors.response.use(
  (response) => {
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  (error) => {
    const { response, config } = error;

    if (response?.status === 429 && config.method === 'get') {
      const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
      const cachedResponse = requestCache.get(cacheKey);
      if (cachedResponse) {
        console.warn('Rate limit exceeded, using cached data');
        return Promise.resolve({
          data: cachedResponse.data,
          status: 200,
          statusText: 'OK (from cache)',
          headers: {},
          config,
          request: {}
        });
      }
      console.error('Rate limit exceeded and no cache available');
    }

    if (response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    return Promise.reject(error);
  }
);

export default api;
