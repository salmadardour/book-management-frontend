import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/Store';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import NotFoundPage from './pages/NotFoundPage';

// Make sure to import setupAxiosInterceptors
import { setupAxiosInterceptors } from './hooks/Hooks';

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

// Import components
import ProtectedRoute from './components/ProtectedRoute';

// Import styles
import './MainStyles.css';

function App() {
  // Setup axios interceptors when the app initializes
  useEffect(() => {
    setupAxiosInterceptors();
    console.log('App initialized');
    
    // Add this to enable localStorage mode temporarily for testing
    // const useLocalStorage = process.env.REACT_APP_USE_LOCAL_STORAGE === 'true';
    // if (useLocalStorage) {
    //   localStorage.setItem('useLocalStorage', 'true');
    //   console.log('Using localStorage mode');
    // }
  }, []);

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />

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
            
            {<Route path="*" element={<Layout><NotFoundPage /></Layout>} />}
          </Routes>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;