import api from './api';

const REVIEW_URL = '/reviews';

// Review service for API calls related to reviews
const reviewService = {
  // Get all reviews
  getReviews: async (params = {}) => {
    const response = await api.get(REVIEW_URL, { params });
    return response.data;
  },
  
  // Get a single review by ID
  getReviewById: async (id) => {
    const response = await api.get(`${REVIEW_URL}/${id}`);
    return response.data;
  },
  
  // Create a new review
  createReview: async (reviewData) => {
    const response = await api.post(REVIEW_URL, reviewData);
    return response.data;
  },
  
  // Update an existing review
  updateReview: async (id, reviewData) => {
    const response = await api.put(`${REVIEW_URL}/${id}`, reviewData);
    return response.data;
  },
  
  // Delete a review
  deleteReview: async (id) => {
    const response = await api.delete(`${REVIEW_URL}/${id}`);
    return response.data;
  },
  
  // Get reviews by book ID
  getReviewsByBook: async (bookId) => {
    const response = await api.get(`${REVIEW_URL}/book/${bookId}`);
    return response.data;
  },
  
  // Get reviews by user ID
  getReviewsByUser: async (userId) => {
    const response = await api.get(`${REVIEW_URL}/user/${userId}`);
    return response.data;
  }
};

export default reviewService;