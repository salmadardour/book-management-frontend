import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

// Import all pages
import HomePage from '../pages/HomePage';
import BooksPage from '../pages/BooksPage';
import BookDetailsPage from '../pages/BookDetailsPage';
import CreateBookPage from '../pages/CreateBookPage';
import AuthorsPage from '../pages/AuthorsPage';
import CreateAuthorPage from '../pages/CreateAuthorPage';
import CategoriesPage from '../pages/CategoriesPage';
import CreateCategoryPage from '../pages/CreateCategoryPage';
import PublishersPage from '../pages/PublishersPage';
import CreatePublisherPage from '../pages/CreatePublisherPage';
import ReviewsPage from '../pages/ReviewsPage';
import CreateReviewPage from '../pages/CreateReviewPage';
import LoginPage from '../pages/LoginPage';
import AccountPage from '../pages/AccountPage';
import NotFoundPage from '../pages/NotFoundPage'; // Create this component for 404 errors

/**
 * Application routes configuration
 * Centralizes all routing in one file for easier management
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/books" element={<Layout><BooksPage /></Layout>} />
      <Route path="/books/:id" element={<Layout><BookDetailsPage /></Layout>} />
      <Route path="/authors" element={<Layout><AuthorsPage /></Layout>} />
      <Route path="/categories" element={<Layout><CategoriesPage /></Layout>} />
      <Route path="/publishers" element={<Layout><PublishersPage /></Layout>} />
      <Route path="/reviews" element={<Layout><ReviewsPage /></Layout>} />
      <Route path="/login" element={<Layout><LoginPage /></Layout>} />

      {/* Protected Routes */}
      <Route path="/books/create" element={
        <Layout>
          <ProtectedRoute>
            <CreateBookPage />
          </ProtectedRoute>
        </Layout>
      } />
      <Route path="/authors/create" element={
        <Layout>
          <ProtectedRoute>
            <CreateAuthorPage />
          </ProtectedRoute>
        </Layout>
      } />
      <Route path="/categories/create" element={
        <Layout>
          <ProtectedRoute>
            <CreateCategoryPage />
          </ProtectedRoute>
        </Layout>
      } />
      <Route path="/publishers/create" element={
        <Layout>
          <ProtectedRoute>
            <CreatePublisherPage />
          </ProtectedRoute>
        </Layout>
      } />
      <Route path="/reviews/create" element={
        <Layout>
          <ProtectedRoute>
            <CreateReviewPage />
          </ProtectedRoute>
        </Layout>
      } />
      <Route path="/account" element={
        <Layout>
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        </Layout>
      } />

      {/* 404 Route - Must be last */}
      <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
    </Routes>
  );
};

export default AppRoutes;