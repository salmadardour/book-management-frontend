// Review selectors for accessing review state from components

// Get all reviews from state
export const selectAllReviews = (state) => state.reviews.items;

// Get a specific review by ID
export const selectReviewById = (state, reviewId) => 
  state.reviews.items.find(review => review.id.toString() === reviewId.toString());

// Get loading state for review operations
export const selectReviewsLoading = (state) => state.reviews.loading;

// Get error state for review operations
export const selectReviewsError = (state) => state.reviews.error;

// Get reviews by book ID
export const selectReviewsByBookId = (state, bookId) => 
  state.reviews.items.filter(review => review.bookId?.toString() === bookId.toString());

// Get reviews by user ID
export const selectReviewsByUserId = (state, userId) => 
  state.reviews.items.filter(review => review.userId?.toString() === userId.toString());

// Get average rating for a book
export const selectAverageRatingForBook = (state, bookId) => {
  const bookReviews = selectReviewsByBookId(state, bookId);
  
  if (!bookReviews.length) return 0;
  
  const totalRating = bookReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
  return totalRating / bookReviews.length;
};

// Get recent reviews (sorted by date, most recent first)
export const selectRecentReviews = (state, limit = 5) => 
  [...state.reviews.items]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);

// Get top rated reviews (highest rating first)
export const selectTopRatedReviews = (state, limit = 5) => 
  [...state.reviews.items]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);

// Get user has reviewed a book
export const selectUserHasReviewedBook = (state, bookId, userId) => 
  state.reviews.items.some(
    review => 
      review.bookId?.toString() === bookId.toString() && 
      review.userId?.toString() === userId.toString()
  );