import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Custom hook for authentication status
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        // Clear invalid user data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  }, []);

  const login = (userData, token, refreshToken) => {
    localStorage.setItem('token', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return { isAuthenticated, user, login, logout };
};

// Custom hook for error handling
export const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = (err) => {
    const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'An unexpected error occurred';
    setError(errorMessage);
    
    // Optional: Log error to console
    console.error('Error:', err);
  };

  const clearError = () => {
    setError(null);
  };

  return { error, handleError, clearError };
};

// Custom hook for API data fetching
export const useFetch = (url, initialState = []) => {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const refetch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Interceptor for global error handling and token refresh
export const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      // If unauthorized and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (!refreshToken) {
            // Force logout if no refresh token
            localStorage.clear();
            window.location.href = '/login';
            return Promise.reject(error);
          }

          // Request new access token
          const response = await axios.post('https://localhost:5056/api/auth/refresh-token', {
            token: localStorage.getItem('token'),
            refreshToken: refreshToken
          });

          // Update tokens
          localStorage.setItem('token', response.data.token);
          if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }

          // Retry original request
          originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed, force logout
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};