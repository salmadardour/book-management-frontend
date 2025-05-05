import api from './api';

const PUBLISHER_URL = '/publishers';

// Publisher service for API calls related to publishers
const publisherService = {
  // Get all publishers
  getPublishers: async () => {
    const response = await api.get(PUBLISHER_URL);
    return response.data;
  },
  
  // Get a single publisher by ID
  getPublisherById: async (id) => {
    const response = await api.get(`${PUBLISHER_URL}/${id}`);
    return response.data;
  },
  
  // Create a new publisher
  createPublisher: async (publisherData) => {
    const response = await api.post(PUBLISHER_URL, publisherData);
    return response.data;
  },
  
  // Update an existing publisher
  updatePublisher: async (id, publisherData) => {
    const response = await api.put(`${PUBLISHER_URL}/${id}`, publisherData);
    return response.data;
  },
  
  // Delete a publisher
  deletePublisher: async (id) => {
    const response = await api.delete(`${PUBLISHER_URL}/${id}`);
    return response.data;
  },
  
  // Get books by publisher
  getBooksByPublisher: async (id) => {
    const response = await api.get(`${PUBLISHER_URL}/${id}/books`);
    return response.data;
  }
};

export default publisherService;