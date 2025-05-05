import api from './api';

const PUBLISHER_URL = '/publishers';

// Publisher service for API calls related to publishers
const publisherService = {
  // Get all publishers
  getPublishers: async () => {
    try {
      const response = await api.get(PUBLISHER_URL);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a single publisher by ID
  getPublisherById: async (id) => {
    try {
      const response = await api.get(`${PUBLISHER_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new publisher
  createPublisher: async (publisherData) => {
    try {
      const response = await api.post(PUBLISHER_URL, publisherData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update an existing publisher
  updatePublisher: async (id, publisherData) => {
    try {
      const response = await api.put(`${PUBLISHER_URL}/${id}`, publisherData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a publisher
  deletePublisher: async (id) => {
    try {
      const response = await api.delete(`${PUBLISHER_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get books by publisher
  getBooksByPublisher: async (id) => {
    try {
      const response = await api.get(`${PUBLISHER_URL}/${id}/books`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default publisherService;