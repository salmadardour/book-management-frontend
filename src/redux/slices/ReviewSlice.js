import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://localhost:5056/api/Review';

// Async thunks for review operations
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to fetch reviews'
      );
    }
  }
);

export const fetchReviewById = createAsyncThunk(
  'reviews/fetchReviewById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to fetch review'
      );
    }
  }
);

export const fetchReviewsByBookId = createAsyncThunk(
  'reviews/fetchReviewsByBookId',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/book/${bookId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to fetch reviews for this book'
      );
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      // For reviews, we might allow non-authenticated users to create reviews
      // depending on your API design
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.post(API_URL, reviewData, { headers });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to create review'
      );
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.put(`${API_URL}/${id}`, reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to update review'
      );
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id; // Return the id for filtering out the deleted review
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to delete review'
      );
    }
  }
);

const initialState = {
  reviews: [],
  bookReviews: [], // Reviews for a specific book
  currentReview: null,
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
    setCurrentReview: (state, action) => {
      state.currentReview = action.payload;
    },
    clearCurrentReview: (state) => {
      state.currentReview = null;
    },
    clearBookReviews: (state) => {
      state.bookReviews = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all reviews reducers
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single review reducers
      .addCase(fetchReviewById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReview = action.payload;
      })
      .addCase(fetchReviewById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch reviews by book id reducers
      .addCase(fetchReviewsByBookId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByBookId.fulfilled, (state, action) => {
        state.loading = false;
        state.bookReviews = action.payload;
      })
      .addCase(fetchReviewsByBookId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create review reducers
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
        // If we have book reviews loaded, and this review is for that book, add it there too
        if (state.bookReviews.length > 0 && action.payload.bookId === state.bookReviews[0]?.bookId) {
          state.bookReviews.push(action.payload);
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update review reducers
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        // Update in main reviews array
        const reviewIndex = state.reviews.findIndex(review => review.id === action.payload.id);
        if (reviewIndex !== -1) {
          state.reviews[reviewIndex] = action.payload;
        }
        
        // Update in book reviews array if present
        const bookReviewIndex = state.bookReviews.findIndex(review => review.id === action.payload.id);
        if (bookReviewIndex !== -1) {
          state.bookReviews[bookReviewIndex] = action.payload;
        }
        
        // Update current review if relevant
        if (state.currentReview && state.currentReview.id === action.payload.id) {
          state.currentReview = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete review reducers
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from main reviews array
        state.reviews = state.reviews.filter(review => review.id !== action.payload);
        
        // Remove from book reviews array if present
        state.bookReviews = state.bookReviews.filter(review => review.id !== action.payload);
        
        // Clear current review if relevant
        if (state.currentReview && state.currentReview.id === action.payload) {
          state.currentReview = null;
        }
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReviewError, setCurrentReview, clearCurrentReview, clearBookReviews } = reviewSlice.actions;

export default reviewSlice.reducer;