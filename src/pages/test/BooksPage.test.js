import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import BooksPage from '../BooksPage';

// Create a mock store
const mockStore = configureStore([]);

const initialState = {
  books: {
    books: [
      { 
        id: 1, 
        title: 'Test Book 1', 
        authorName: 'Test Author 1',
        categoryName: 'Fiction'
      },
      { 
        id: 2, 
        title: 'Test Book 2', 
        authorName: 'Test Author 2',
        categoryName: 'Non-Fiction'
      }
    ],
    loading: false,
    error: null
  },
  auth: {
    isAuthenticated: false
  }
};

const renderComponent = (state = initialState) => {
  const store = mockStore(state);

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <BooksPage />
      </BrowserRouter>
    </Provider>
  );
};

describe('BooksPage Component', () => {
  it('renders page title', () => {
    renderComponent();
    
    expect(screen.getByText('My Book Collection')).toBeInTheDocument();
  });

  it('displays list of books', () => {
    renderComponent();
    
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.getByText('Test Book 2')).toBeInTheDocument();
  });

  it('allows searching books', () => {
    renderComponent();
    
    const searchInput = screen.getByPlaceholderText('Search by title or author');
    
    // Search for a specific book
    fireEvent.change(searchInput, { target: { value: 'Test Book 1' } });
    
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Book 2')).not.toBeInTheDocument();
  });

  it('filters books by category', () => {
    renderComponent();
    
    const categorySelect = screen.getByRole('combobox');
    
    // Select Fiction category
    fireEvent.change(categorySelect, { target: { value: 'Fiction' } });
    
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Book 2')).not.toBeInTheDocument();
  });

  it('shows loading state', () => {
    const loadingState = {
      ...initialState,
      books: {
        ...initialState.books,
        loading: true
      }
    };
    
    renderComponent(loadingState);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const errorState = {
      ...initialState,
      books: {
        ...initialState.books,
        error: 'Failed to load books',
        loading: false
      }
    };
    
    renderComponent(errorState);
    
    expect(screen.getByText('Failed to load books')).toBeInTheDocument();
  });

  it('does not show add book button when not authenticated', () => {
    renderComponent();
    
    expect(screen.queryByText('+ Add Book')).not.toBeInTheDocument();
  });

  it('shows add book button when authenticated', () => {
    const authenticatedState = {
      ...initialState,
      auth: {
        isAuthenticated: true
      }
    };
    
    renderComponent(authenticatedState);
    
    expect(screen.getByText('+ Add Book')).toBeInTheDocument();
  });
});