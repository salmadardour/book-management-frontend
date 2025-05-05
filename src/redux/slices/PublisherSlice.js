import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { 
  isUsingLocalStorage, 
  getApiBaseUrl, 
  localStorageData,
  authenticatedRequest
} from '../../services/apiHelper';

// Sample publishers for localStorage mode
const samplePublishers = [
  {
    id: 1,
    name: 'J. B. Lippincott & Co.',
    location: 'Philadelphia, PA',
    foundedYear: 1836,
    website: 'https://example.com/publishers/lippincott'
  },
  {
    id: 2,
    name: 'Secker & Warburg',
    location: 'London, UK',
    foundedYear: 1935,
    website: 'https://example.com/publishers/secker-warburg'
  },
  {
    id: 3,
    name: 'T. Egerton, Whitehall',
    location: 'London, UK',
    foundedYear: 1798,
    website: 'https://example.com/publishers/egerton'
  },
  {
    id: 4,
    name: 'Penguin Random House',
    location: 'New York, NY',
    foundedYear: 2013,
    website: 'https://example.com/publishers/penguin-random-house'
  }
];

// Get the appropriate API URL
const API_URL = `${getApiBaseUrl()}/publisher`;

// Async thunks for publisher operations
export const fetchPublishers = createAsyncThunk(
  'publishers/fetchPublishers',
  async (_, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.getAll('publishers', samplePublishers);
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
        'Failed to fetch publishers'
      );
    }
  }
);

export const fetchPublisherById = createAsyncThunk(
  'publishers/fetchPublisherById',
  async (id, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.getById('publishers', id, samplePublishers);
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
        'Failed to fetch publisher'
      );
    }
  }
);

export const createPublisher = createAsyncThunk(
  'publishers/createPublisher',
  async (publisherData, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.create('publishers', publisherData, samplePublishers);
      } else {
        // Real API call
        return await authenticatedRequest('post', API_URL, publisherData);
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        error.message ||
        'Failed to create publisher'
      );
    }
  }
);

export const updatePublisher = createAsyncThunk(
  'publishers/updatePublisher',
  async ({ id, publisherData }, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.update('publishers', id, publisherData, samplePublishers);
      } else {
        // Real API call
        return await authenticatedRequest('put', `${API_URL}/${id}`, publisherData);
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        error.message ||
        'Failed to update publisher'
      );
    }
  }
);

export const deletePublisher = createAsyncThunk(
  'publishers/deletePublisher',
  async (id, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.delete('publishers', id, samplePublishers);
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