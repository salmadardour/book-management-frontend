import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../redux/slices/BookSlice';
import { fetchAuthors } from '../redux/slices/AuthorSlice';
import { fetchCategories } from '../redux/slices/CategorySlice';
import { fetchPublishers } from '../redux/slices/PublisherSlice';
import './HomePage.css';

function HomePage() {
  const dispatch = useDispatch();
  const { books } = useSelector(state => state.books);
  const { authors } = useSelector(state => state.authors);
  const { categories } = useSelector(state => state.categories);
  const { publishers } = useSelector(state => state.publishers);
  
  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchAuthors());
    dispatch(fetchCategories());
    dispatch(fetchPublishers());
  }, [dispatch]);

  // Get the featured books (latest 3)
  const featuredBooks = books.slice(0, 3);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Book Management System</h1>
          <p>Your comprehensive solution for managing books, authors, categories, publishers, and reviews in one place.</p>
          <div className="hero-buttons">
            <Link to="/books" className="hero-button primary">Browse Books</Link>
            <Link to="/authors" className="hero-button secondary">View Authors</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="book-stack">
            <div className="book book-1"></div>
            <div className="book book-2"></div>
            <div className="book book-3"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card">
          <h3>{books.length}</h3>
          <p>Books</p>
        </div>
        <div className="stat-card">
          <h3>{authors.length}</h3>
          <p>Authors</p>
        </div>
        <div className="stat-card">
          <h3>{categories.length}</h3>
          <p>Categories</p>
        </div>
        <div className="stat-card">
          <h3>{publishers.length}</h3>
          <p>Publishers</p>
        </div>
      </section>

      {/* Featured Books Section */}
      {featuredBooks.length > 0 && (
        <section className="featured-section">
          <h2>Featured Books</h2>
          <div className="featured-books">
            {featuredBooks.map(book => (
              <div key={book.id} className="featured-book-card">
                <div className="book-cover">
                  <div className="book-spine"></div>
                  <div className="book-title">{book.title}</div>
                </div>
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="book-author">{book.authorName}</p>
                  <p className="book-category">{book.categoryName}</p>
                  <Link to={`/books/${book.id}`} className="view-button">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Access Section */}
      <section className="quick-access-section">
        <h2>Quick Access</h2>
        <div className="quick-access-grid">
          <Link to="/books" className="quick-access-card books-card">
            <div className="icon-container">
              <span className="icon">📚</span>
            </div>
            <h3>Books</h3>
            <p>Browse and manage your book collection</p>
          </Link>
          <Link to="/authors" className="quick-access-card authors-card">
            <div className="icon-container">
              <span className="icon">✍️</span>
            </div>
            <h3>Authors</h3>
            <p>View and manage authors</p>
          </Link>
          <Link to="/categories" className="quick-access-card categories-card">
            <div className="icon-container">
              <span className="icon">🏷️</span>
            </div>
            <h3>Categories</h3>
            <p>Organize books by categories</p>
          </Link>
          <Link to="/publishers" className="quick-access-card publishers-card">
            <div className="icon-container">
              <span className="icon">🏢</span>
            </div>
            <h3>Publishers</h3>
            <p>Manage publishing houses</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;