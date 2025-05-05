import api from './api';

const REVIEW_URL = '/reviews';

// Review service for API calls related to reviews
const reviewService = {
  // Get all reviews
  getReviews: async (params = {}) => {
    try {
      const response = await api.get(REVIEW_URL, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a single review by ID
  getReviewById: async (id) => {
    try {
      const response = await api.get(`${REVIEW_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new review
  createReview: async (reviewData) => {
    try {
      const response = await api.post(REVIEW_URL, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update an existing review
  updateReview: async (id, reviewData) => {
    try {
      const response = await api.put(`${REVIEW_URL}/${id}`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a review
  deleteReview: async (id) => {
    try {
      const response = await api.delete(`${REVIEW_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get reviews by book ID
  getReviewsByBook: async (bookId) => {
    try {
      const response = await api.get(`${REVIEW_URL}/book/${bookId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get reviews by user ID
  getReviewsByUser: async (userId) => {
    try {
      const response = await api.get(`${REVIEW_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default reviewService;