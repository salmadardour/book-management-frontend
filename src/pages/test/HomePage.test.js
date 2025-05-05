import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import HomePage from '../HomePage';

// Create a mock store
const mockStore = configureStore([]);

const initialState = {
  books: {
    books: [
      { 
        id: 1, 
        title: 'Test Book', 
        authorName: 'Test Author',
        categoryName: 'Test Category'
      }
    ],
    loading: false,
    error: null
  },
  authors: {
    authors: [{ id: 1, name: 'Test Author' }],
    loading: false,
    error: null
  },
  categories: {
    categories: [{ id: 1, name: 'Test Category' }],
    loading: false,
    error: null
  },
  publishers: {
    publishers: [{ id: 1, name: 'Test Publisher' }],
    loading: false,
    error: null
  }
};

const renderComponent = (state = initialState) => {
  const store = mockStore(state);

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    </Provider>
  );
};

describe('HomePage Component', () => {
  it('renders the main heading', () => {
    renderComponent();
    
    expect(screen.getByText('Book Management System')).toBeInTheDocument();
  });

  it('displays featured books', () => {
    renderComponent();
    
    expect(screen.getByText('Test Book')).toBeInTheDocument();
  });

  it('shows correct statistics', () => {
    renderComponent();
    
    expect(screen.getByText('1', { selector: 'h3' })).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
    expect(screen.getByText('Authors')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Publishers')).toBeInTheDocument();
  });

  it('renders quick access links', () => {
    renderComponent();
    
    expect(screen.getByText('Books')).toBeInTheDocument();
    expect(screen.getByText('Authors')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Publishers')).toBeInTheDocument();
  });
});