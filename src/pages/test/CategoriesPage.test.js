import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import CategoriesPage from '../CategoriesPage';

// Mock axios
jest.mock('axios');

const mockCategories = [
  { 
    id: 1, 
    name: 'Fiction', 
    bookCount: 5 
  },
  { 
    id: 2, 
    name: 'Non-Fiction', 
    bookCount: 3 
  }
];

describe('CategoriesPage Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default mock implementation
    axios.get.mockResolvedValue({
      data: mockCategories
    });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CategoriesPage />
      </BrowserRouter>
    );
  };

  it('renders page title', async () => {
    renderComponent();
    
    // Wait for categories to load
    const categoriesTitle = await screen.findByText('Categories');
    expect(categoriesTitle).toBeInTheDocument();
  });

  it('displays list of categories', async () => {
    renderComponent();
    
    // Wait for categories to load
    const fictionCategory = await screen.findByText('Fiction');
    const nonFictionCategory = await screen.findByText('Non-Fiction');
    
    expect(fictionCategory).toBeInTheDocument();
    expect(nonFictionCategory).toBeInTheDocument();
  });

  it('shows book count for categories', async () => {
    renderComponent();
    
    // Wait for book counts to load
    const fictionBookCount = await screen.findByText('Books: 5');
    const nonFictionBookCount = await screen.findByText('Books: 3');
    
    expect(fictionBookCount).toBeInTheDocument();
    expect(nonFictionBookCount).toBeInTheDocument();
  });

  it('handles category deletion', async () => {
    // Mock successful delete
    axios.delete.mockResolvedValue({});
    
    renderComponent();
    
    // Wait for delete buttons to appear
    const deleteButtons = await screen.findAllByText('Delete');
    
    // Click first delete button
    fireEvent.click(deleteButtons[0]);
    
    // Verify delete request was made
    await screen.findByText('Delete');
  });

  it('shows error message on delete failure', async () => {
    // Mock delete failure
    axios.delete.mockRejectedValue(new Error('Delete failed'));
    
    renderComponent();
    
    // Wait for delete buttons to appear
    const deleteButtons = await screen.findAllByText('Delete');
    
    // Click first delete button
    fireEvent.click(deleteButtons[0]);
    
    // Check for error alert
    const errorMessage = await screen.findByText(/Delete failed/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    // Create a promise that never resolves to simulate loading
    axios.get.mockImplementation(() => new Promise(() => {}));
    
    renderComponent();
    
    const loadingText = await screen.findByText('Loading...');
    expect(loadingText).toBeInTheDocument();
  });

  it('shows error state', async () => {
    // Mock network error
    axios.get.mockRejectedValue(new Error('Failed to load categories'));
    
    renderComponent();
    
    const errorMessage = await screen.findByText('Failed to load categories');
    expect(errorMessage).toBeInTheDocument();
  });
});