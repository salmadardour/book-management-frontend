import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import LoginPage from './LoginPage';

// Mock axios
jest.mock('axios');

// Mock navigation
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
   useNavigate: () => mockedUsedNavigate,
}));

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );
};

describe('LoginPage Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    renderComponent();
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('switches between login and register modes', () => {
    renderComponent();
    
    const toggleButton = screen.getByText(/Need an account\?/i);
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('handles login submission', async () => {
    // Mock successful login response
    axios.post.mockResolvedValueOnce({
      data: {
        token: 'fake_token',
        refreshToken: 'fake_refresh_token'
      }
    });

    // Mock profile fetch
    axios.get.mockResolvedValueOnce({
      data: {
        userName: 'testuser',
        email: 'test@example.com'
      }
    });

    renderComponent();
    
    // Fill out login form
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Password'), { 
      target: { value: 'password123' } 
    });

    // Submit form
    fireEvent.click(screen.getByText('Login'));

    // Wait for async operations
    await waitFor(() => {
      // Check that axios was called with correct parameters
      expect(axios.post).toHaveBeenCalledWith(
        'https://localhost:5056/api/auth/login', 
        { email: 'test@example.com', password: 'password123' }
      );
      
      // Check that navigation was called
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles login error', async () => {
    // Mock login error
    axios.post.mockRejectedValueOnce({
      response: {
        data: { message: 'Invalid credentials' }
      }
    });

    renderComponent();
    
    // Fill out login form
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Password'), { 
      target: { value: 'wrongpassword' } 
    });

    // Submit form
    fireEvent.click(screen.getByText('Login'));

    // Wait for async operations
    await waitFor(() => {
      // Check that error message is displayed
      expect(screen.getByText(/Login or registration failed/i)).toBeInTheDocument();
    });
  });

  it('validates form inputs', () => {
    renderComponent();
    
    // Try to submit empty form
    fireEvent.click(screen.getByText('Login'));

    // Check for required field validation
    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toBeInvalid();
  });
});