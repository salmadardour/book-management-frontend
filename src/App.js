import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/Store';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import NotFoundPage from './pages/NotFoundPage';

// Import setupAxiosInterceptors and API mode functionality
import { setupAxiosInterceptors } from './hooks/Hooks';
import { isUsingLocalStorage } from './services/serviceFactory';

// Import pages
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import AuthorsPage from './pages/AuthorsPage';
import CategoriesPage from './pages/CategoriesPage';
import PublishersPage from './pages/PublishersPage';
import ReviewsPage from './pages/ReviewsPage';
import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';
import CreateBookPage from './pages/CreateBookPage';
import CreateAuthorPage from './pages/CreateAuthorPage';
import CreateCategoryPage from './pages/CreateCategoryPage';
import CreatePublisherPage from './pages/CreatePublisherPage';
import CreateReviewPage from './pages/CreateReviewPage';
import BookDetailsPage from './pages/BookDetailsPage';
import ApiTestPage from './pages/ApiTestPage'; // New page for API testing

// Import components
import ProtectedRoute from './components/ProtectedRoute';
import ApiStatusBanner from './components/ApiStatusBanner'; // New component for API status

// Import styles
import './MainStyles.css';

function App() {
  const [apiMode, setApiMode] = useState(isUsingLocalStorage() ? 'localStorage' : 'backend');

  // Setup axios interceptors and check API mode when the app initializes
  useEffect(() => {
    setupAxiosInterceptors();
    
    // Check current API mode
    const checkApiMode = () => {
      setApiMode(isUsingLocalStorage() ? 'localStorage' : 'backend');
    };
    
    // Initial check
    checkApiMode();
    
    // Listen for changes in localStorage
    window.addEventListener('storage', checkApiMode);
    
    // Log initialization
    console.log(`App initialized in ${apiMode} mode`);
    
    return () => {
      window.removeEventListener('storage', checkApiMode);
    };
  }, [apiMode]);

  return (
    <ErrorBoundary>
      <Router>
        <ApiStatusBanner mode={apiMode} />
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          
          {/* API Test Route */}
          <Route path="/api-test" element={<Layout><ApiTestPage /></Layout>} />

          {/* Book Routes */}
          <Route path="/books" element={<Layout><BooksPage /></Layout>} />
          <Route path="/books/create" element={
            <Layout>
              <ProtectedRoute>
                <CreateBookPage />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/books/:id" element={<Layout><BookDetailsPage /></Layout>} /> 

          {/* Author Routes */}
          <Route path="/authors" element={<Layout><AuthorsPage /></Layout>} />
          <Route path="/authors/create" element={
            <Layout>
              <ProtectedRoute>
                <CreateAuthorPage />
              </ProtectedRoute>
            </Layout>
          } />

          {/* Category Routes */}
          <Route path="/categories" element={<Layout><CategoriesPage /></Layout>} />
          <Route path="/categories/create" element={
            <Layout>
              <ProtectedRoute>
                <CreateCategoryPage />
              </ProtectedRoute>
            </Layout>
          } />

          {/* Publisher Routes */}
          <Route path="/publishers" element={<Layout><PublishersPage /></Layout>} />
          <Route path="/publishers/create" element={
            <Layout>
              <ProtectedRoute>
                <CreatePublisherPage />
              </ProtectedRoute>
            </Layout>
          } />

          {/* Review Routes */}
          <Route path="/reviews" element={<Layout><ReviewsPage /></Layout>} />
          <Route path="/reviews/create" element={
            <Layout>
              <ProtectedRoute>
                <CreateReviewPage />
              </ProtectedRoute>
            </Layout>
          } />

          {/* Authentication Routes */}
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/account" element={
            <Layout>
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            </Layout>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;