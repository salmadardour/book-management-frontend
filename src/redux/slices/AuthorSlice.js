import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://localhost:5056/api/Author';

// Async thunks for author operations
export const fetchAuthors = createAsyncThunk(
  'authors/fetchAuthors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to fetch authors'
      );
    }
  }
);

export const fetchAuthorById = createAsyncThunk(
  'authors/fetchAuthorById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to fetch author'
      );
    }
  }
);

export const createAuthor = createAsyncThunk(
  'authors/createAuthor',
  async (authorData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.post(API_URL, authorData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to create author'
      );
    }
  }
);

export const updateAuthor = createAsyncThunk(
  'authors/updateAuthor',
  async ({ id, authorData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.put(`${API_URL}/${id}`, authorData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to update author'
      );
    }
  }
);

export const deleteAuthor = createAsyncThunk(
  'authors/deleteAuthor',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id; // Return the id for filtering out the deleted author
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to delete author'
      );
    }
  }
);

const initialState = {
  authors: [],
  currentAuthor: null,
  loading: false,
  error: null,
};

const authorSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {
    clearAuthorError: (state) => {
      state.error = null;
    },
    setCurrentAuthor: (state, action) => {
      state.currentAuthor = action.payload;
    },
    clearCurrentAuthor: (state) => {
      state.currentAuthor = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all authors reducers
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload;
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single author reducers
      .addCase(fetchAuthorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAuthor = action.payload;
      })
      .addCase(fetchAuthorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create author reducers
      .addCase(createAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.authors.push(action.payload);
      })
      .addCase(createAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update author reducers
      .addCase(updateAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAuthor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.authors.findIndex(author => author.id === action.payload.id);
        if (index !== -1) {
          state.authors[index] = action.payload;
        }
        if (state.currentAuthor && state.currentAuthor.id === action.payload.id) {
          state.currentAuthor = action.payload;
        }
      })
      .addCase(updateAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete author reducers
      .addCase(deleteAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = state.authors.filter(author => author.id !== action.payload);
        if (state.currentAuthor && state.currentAuthor.id === action.payload) {
          state.currentAuthor = null;
        }
      })
      .addCase(deleteAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthorError, setCurrentAuthor, clearCurrentAuthor } = authorSlice.actions;

export default authorSlice.reducer;