import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://localhost:5056/api/auth';

// Helper to get cached user data
const getUserFromStorage = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Async thunks for authentication actions
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      // Store tokens in localStorage
      localStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      // Store user data if available
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Login failed'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      // After successful registration, store tokens
      localStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Registration failed'
      );
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue, getState }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return rejectWithValue('Authentication token missing');
    }
    
    // Check if we already have user data in state
    const { auth } = getState();
    if (auth.user) {
      // If we already have user data, return it without making an API call
      return auth.user;
    }
    
    // Check if we have cached user data in localStorage
    const cachedUser = getUserFromStorage();
    
    try {
      // Set timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Store user data in localStorage for future use
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      // Check if error is due to rate limiting (429) or other API issues
      if (
        error.response?.status === 429 || 
        error.name === 'AbortError' || 
        error.code === 'ECONNABORTED'
      ) {
        // If rate limited or timeout, use cached data if available
        if (cachedUser) {
          console.log('Using cached user data due to API limit or timeout');
          return cachedUser;
        }
      }
      
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to fetch user profile'
      );
    }
  },
  {
    // Only allow this request to be in flight once
    condition: (_, { getState }) => {
      const { auth } = getState();
      // Only proceed if not currently loading
      return !auth.loading;
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // If no token, just clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return;
    }
    
    try {
      // Attempt to logout on server with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      await axios.post(`${API_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server logout fails, continue with local logout
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }
);

// Add a new thunk for refreshing the token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return rejectWithValue('Refresh token missing');
    }
    
    try {
      const response = await axios.post(`${API_URL}/refresh-token`, {
        refreshToken
      });
      
      // Update token in localStorage
      localStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      
      return response.data;
    } catch (error) {
      // If refresh fails, clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Token refresh failed'
      );
    }
  }
);

const initialState = {
  user: getUserFromStorage(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Add action to update user in Redux state from localStorage
    // (useful when user data may have been updated in another tab)
    syncUserFromStorage: (state) => {
      const user = getUserFromStorage();
      if (user) {
        state.user = user;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login reducers
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Registration reducers
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user || null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch profile reducers
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // If the error is related to authentication, clear auth state
        if (
          action.payload === 'Authentication token missing' ||
          action.payload === 'Invalid token' ||
          action.payload === 'Token expired'
        ) {
          state.isAuthenticated = false;
          state.token = null;
        }
      })
      
      // Logout reducers
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      })
      
      // Refresh token reducers
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });
  },
});

export const { clearError, syncUserFromStorage } = authSlice.actions;

export default authSlice.reducer;