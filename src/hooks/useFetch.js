import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook for making API requests with loading and error handling
 * @param {string} url - The URL to fetch
 * @param {Object} options - Optional fetch options
 */
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Determine if the fetch should be done immediately or manually
  const { immediate = true, method = 'GET', body = null, params = {} } = options;
  
  // Function to execute the fetch
  const fetchData = useCallback(async (customBody = null, customParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare request configuration
      const config = {
        params: { ...params, ...customParams }
      };
      
      let response;
      
      // Execute the request based on the method
      switch (method.toUpperCase()) {
        case 'GET':
          response = await api.get(url, config);
          break;
        case 'POST':
          response = await api.post(url, customBody || body, config);
          break;
        case 'PUT':
          response = await api.put(url, customBody || body, config);
          break;
        case 'DELETE':
          response = await api.delete(url, config);
          break;
        default:
          response = await api.get(url, config);
      }
      
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, body, params]);
  
  // Execute fetch on mount if immediate is true
  useEffect(() => {
    if (immediate) {
      fetchData();
    } else {
      // If not immediate, just set loading to false
      setLoading(false);
    }
  }, [immediate, fetchData]);
  
  return { data, loading, error, fetchData, setData };
};

export default useFetch;