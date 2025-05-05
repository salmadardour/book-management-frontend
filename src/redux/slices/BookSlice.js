import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { 
  isUsingLocalStorage, 
  getApiBaseUrl, 
  localStorageData,
  authenticatedRequest
} from '../../services/apiHelper';

// Sample books for localStorage mode
const sampleBooks = [
  {
    id: 1,
    title: 'To Kill a Mockingbird',
    authorId: 1,
    authorName: 'Harper Lee',
    publisherId: 1,
    publisherName: 'J. B. Lippincott & Co.',
    categoryId: 1,
    categoryName: 'Fiction',
    publishYear: 1960,
    isbn: '978-0446310789',
    description: 'The story of a young girl confronting racial prejudice in the American South.',
    coverUrl: 'https://example.com/covers/to-kill-a-mockingbird.jpg'
  },
  {
    id: 2,
    title: '1984',
    authorId: 2,
    authorName: 'George Orwell',
    publisherId: 2,
    publisherName: 'Secker & Warburg',
    categoryId: 2,
    categoryName: 'Dystopian',
    publishYear: 1949,
    isbn: '978-0451524935',
    description: 'A dystopian novel set in a totalitarian regime where surveillance is omnipresent.',
    coverUrl: 'https://example.com/covers/1984.jpg'
  },
  {
    id: 3,
    title: 'Pride and Prejudice',
    authorId: 3,
    authorName: 'Jane Austen',
    publisherId: 3,
    publisherName: 'T. Egerton, Whitehall',
    categoryId: 3,
    categoryName: 'Romance',
    publishYear: 1813,
    isbn: '978-0141439518',
    description: 'A romantic novel following the character development of Elizabeth Bennet.',
    coverUrl: 'https://example.com/covers/pride-and-prejudice.jpg'
  }
];

// Get the appropriate API URL
const API_URL = `${getApiBaseUrl()}/books`;

// Async thunks for book operations
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.getAll('books', sampleBooks);
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
        'Failed to fetch books'
      );
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (id, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.getById('books', id, sampleBooks);
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
        'Failed to fetch book'
      );
    }
  }
);

export const createBook = createAsyncThunk(
  'books/createBook',
  async (bookData, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.create('books', bookData, sampleBooks);
      } else {
        // Real API call using our helper function
        return await authenticatedRequest('post', API_URL, bookData);
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        error.message ||
        'Failed to create book'
      );
    }
  }
);

export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ id, bookData }, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.update('books', id, bookData, sampleBooks);
      } else {
        // Real API call
        return await authenticatedRequest('put', `${API_URL}/${id}`, bookData);
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        error.message ||
        'Failed to update book'
      );
    }
  }
);

export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (id, { rejectWithValue }) => {
    try {
      // Check if we're using localStorage mode
      if (isUsingLocalStorage()) {
        return await localStorageData.delete('books', id, sampleBooks);
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