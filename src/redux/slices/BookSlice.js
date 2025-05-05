import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://localhost:5056/api/books';

// Async thunks for book operations
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to fetch books'
      );
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to fetch book'
      );
    }
  }
);

export const createBook = createAsyncThunk(
  'books/createBook',
  async (bookData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.post(API_URL, bookData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to create book'
      );
    }
  }
);

export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ id, bookData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.put(`${API_URL}/${id}`, bookData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to update book'
      );
    }
  }
);

export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id; // Return the id for filtering out the deleted book
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to delete book'
      );
    }
  }
);

const initialState = {
  books: [],
  currentBook: null,
  loading: false,
  error: null,
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearBookError: (state) => {
      state.error = null;
    },
    setCurrentBook: (state, action) => {
      state.currentBook = action.payload;
    },
    clearCurrentBook: (state) => {
      state.currentBook = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all books reducers
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single book reducers
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create book reducers
      .addCase(createBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push(action.payload);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update book reducers
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.books.findIndex(book => book.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
        if (state.currentBook && state.currentBook.id === action.payload.id) {
          state.currentBook = action.payload;
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete book reducers
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.filter(book => book.id !== action.payload);
        if (state.currentBook && state.currentBook.id === action.payload) {
          state.currentBook = null;
        }
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookError, setCurrentBook, clearCurrentBook } = bookSlice.actions;

export default bookSlice.reducer;