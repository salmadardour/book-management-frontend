import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { 
  isUsingLocalStorage, 
  getApiBaseUrl, 
  localStorageData,
  authenticatedRequest
} from '../../services/apiHelper';

// Sample categories for localStorage mode
const sampleCategories = [
  {
    id: 1,
    name: 'Fiction',
    description: 'Imaginative stories not presented as factual'
  },
  {
    id: 2,
    name: 'Dystopian',
    description: 'Fiction set in a dark, often oppressive future society'
  },
  {
    id: 3,
    name: 'Romance',
    description: 'Stories centered on romantic relationships'
  },
  {
    id: 4,
    name: 'Non-fiction',
    description: 'Literature that is factual and based on real events'
  },
  {
    id: 5,
    name: 'Science Fiction',
    description: 'Speculative fiction dealing with futuristic concepts'
  }
];

// Get the appropriate API URL
const API_URL = `${getApiBaseUrl()}/category`;

// Async thunks for category operations
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.getAll('categories', sampleCategories);
      } else {
        // Real API call
        const response = await axios.get(API_URL);
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        error.message ||
        'Failed to fetch categories'
      );
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.getById('categories', id, sampleCategories);
      } else {
        // Real API call
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        error.message ||
        'Failed to fetch category'
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.create('categories', categoryData, sampleCategories);
      } else {
        // Real API call
        return await authenticatedRequest('post', API_URL, categoryData);
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        error.message ||
        'Failed to create category'
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.update('categories', id, categoryData, sampleCategories);
      } else {
        // Real API call
        return await authenticatedRequest('put', `${API_URL}/${id}`, categoryData);
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        error.message ||
        'Failed to update category'
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.delete('categories', id, sampleCategories);
      } else {
        // Real API call
        await authenticatedRequest('delete', `${API_URL}/${id}`);
        return id;
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        error.message ||
        'Failed to delete category'
      );
    }
  }
);

const initialState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all categories reducers
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single category reducers
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create category reducers
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update category reducers
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(category => category.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory && state.currentCategory.id === action.payload.id) {
          state.currentCategory = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete category reducers
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(category => category.id !== action.payload);
        if (state.currentCategory && state.currentCategory.id === action.payload) {
          state.currentCategory = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryError, setCurrentCategory, clearCurrentCategory } = categorySlice.actions;

export default categorySlice.reducer;