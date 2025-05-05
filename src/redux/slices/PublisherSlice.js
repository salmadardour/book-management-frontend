import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://localhost:5056/api/Publisher';

// Async thunks for publisher operations
export const fetchPublishers = createAsyncThunk(
  'publishers/fetchPublishers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to fetch publishers'
      );
    }
  }
);

export const fetchPublisherById = createAsyncThunk(
  'publishers/fetchPublisherById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to fetch publisher'
      );
    }
  }
);

export const createPublisher = createAsyncThunk(
  'publishers/createPublisher',
  async (publisherData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.post(API_URL, publisherData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to create publisher'
      );
    }
  }
);

export const updatePublisher = createAsyncThunk(
  'publishers/updatePublisher',
  async ({ id, publisherData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.put(`${API_URL}/${id}`, publisherData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to update publisher'
      );
    }
  }
);

export const deletePublisher = createAsyncThunk(
  'publishers/deletePublisher',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id; // Return the id for filtering out the deleted publisher
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to delete publisher'
      );
    }
  }
);

const initialState = {
  publishers: [],
  currentPublisher: null,
  loading: false,
  error: null,
};

const publisherSlice = createSlice({
  name: 'publishers',
  initialState,
  reducers: {
    clearPublisherError: (state) => {
      state.error = null;
    },
    setCurrentPublisher: (state, action) => {
      state.currentPublisher = action.payload;
    },
    clearCurrentPublisher: (state) => {
      state.currentPublisher = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all publishers reducers
      .addCase(fetchPublishers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublishers.fulfilled, (state, action) => {
        state.loading = false;
        state.publishers = action.payload;
      })
      .addCase(fetchPublishers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single publisher reducers
      .addCase(fetchPublisherById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublisherById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPublisher = action.payload;
      })
      .addCase(fetchPublisherById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create publisher reducers
      .addCase(createPublisher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPublisher.fulfilled, (state, action) => {
        state.loading = false;
        state.publishers.push(action.payload);
      })
      .addCase(createPublisher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update publisher reducers
      .addCase(updatePublisher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePublisher.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.publishers.findIndex(publisher => publisher.id === action.payload.id);
        if (index !== -1) {
          state.publishers[index] = action.payload;
        }
        if (state.currentPublisher && state.currentPublisher.id === action.payload.id) {
          state.currentPublisher = action.payload;
        }
      })
      .addCase(updatePublisher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete publisher reducers
      .addCase(deletePublisher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePublisher.fulfilled, (state, action) => {
        state.loading = false;
        state.publishers = state.publishers.filter(publisher => publisher.id !== action.payload);
        if (state.currentPublisher && state.currentPublisher.id === action.payload) {
          state.currentPublisher = null;
        }
      })
      .addCase(deletePublisher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPublisherError, setCurrentPublisher, clearCurrentPublisher } = publisherSlice.actions;

export default publisherSlice.reducer;