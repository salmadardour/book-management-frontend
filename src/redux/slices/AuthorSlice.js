import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { 
  isUsingLocalStorage, 
  getApiBaseUrl, 
  localStorageData,
  authenticatedRequest
} from '../../services/apiHelper';

// Sample authors for localStorage mode
const sampleAuthors = [
  {
    id: 1,
    name: 'Harper Lee',
    biography: 'Nelle Harper Lee was an American novelist best known for her 1960 novel To Kill a Mockingbird.',
    birthDate: '1926-04-28',
    imageUrl: 'https://example.com/authors/harper-lee.jpg'
  },
  {
    id: 2,
    name: 'George Orwell',
    biography: 'Eric Arthur Blair, known by his pen name George Orwell, was an English novelist and essayist.',
    birthDate: '1903-06-25',
    imageUrl: 'https://example.com/authors/george-orwell.jpg'
  },
  {
    id: 3,
    name: 'Jane Austen',
    biography: 'Jane Austen was an English novelist known primarily for her six major novels.',
    birthDate: '1775-12-16',
    imageUrl: 'https://example.com/authors/jane-austen.jpg'
  }
];

// Get the appropriate API URL
const API_URL = `${getApiBaseUrl()}/author`;

// Async thunks for author operations
export const fetchAuthors = createAsyncThunk(
  'authors/fetchAuthors',
  async (_, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.getAll('authors', sampleAuthors);
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
        'Failed to fetch authors'
      );
    }
  }
);

export const fetchAuthorById = createAsyncThunk(
  'authors/fetchAuthorById',
  async (id, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.getById('authors', id, sampleAuthors);
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
        'Failed to fetch author'
      );
    }
  }
);

export const createAuthor = createAsyncThunk(
  'authors/createAuthor',
  async (authorData, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.create('authors', authorData, sampleAuthors);
      } else {
        // Real API call
        return await authenticatedRequest('post', API_URL, authorData);
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        error.message ||
        'Failed to create author'
      );
    }
  }
);

export const updateAuthor = createAsyncThunk(
  'authors/updateAuthor',
  async ({ id, authorData }, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.update('authors', id, authorData, sampleAuthors);
      } else {
        // Real API call
        return await authenticatedRequest('put', `${API_URL}/${id}`, authorData);
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        error.message ||
        'Failed to update author'
      );
    }
  }
);

export const deleteAuthor = createAsyncThunk(
  'authors/deleteAuthor',
  async (id, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.delete('authors', id, sampleAuthors);
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