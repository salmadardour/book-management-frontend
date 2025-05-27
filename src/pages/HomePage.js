import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

function HomePage() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all data simultaneously
    const fetchAllData = async () => {
      try {
        const [booksRes, authorsRes, categoriesRes, publishersRes] = await Promise.allSettled([
          axios.get('https://localhost:5056/api/Books'),
          axios.get('https://localhost:5056/api/Author'),
          axios.get('https://localhost:5056/api/Category'),
          axios.get('https://localhost:5056/api/Publisher')
        ]);

        // Handle books
        if (booksRes.status === 'fulfilled') {
          setBooks(booksRes.value.data);
          console.log('Books loaded:', booksRes.value.data.length);
        } else {
          console.error('Failed to load books:', booksRes.reason);
        }

        // Handle authors
        if (authorsRes.status === 'fulfilled') {
          setAuthors(authorsRes.value.data);
          console.log('Authors loaded:', authorsRes.value.data.length);
        } else {
          console.error('Failed to load authors:', authorsRes.reason);
        }

        // Handle categories
        if (categoriesRes.status === 'fulfilled') {
          setCategories(categoriesRes.value.data);
          console.log('Categories loaded:', categoriesRes.value.data.length);
        } else {
          console.error('Failed to load categories:', categoriesRes.reason);
        }

        // Handle publishers
        if (publishersRes.status === 'fulfilled') {
          setPublishers(publishersRes.value.data);
          console.log('Publishers loaded:', publishersRes.value.data.length);
        } else {
          console.error('Failed to load publishers:', publishersRes.reason);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Get the featured books (latest 3)
  const featuredBooks = books.slice(0, 3);

  if (loading) {
    return (
      <div className="home-page">
        <h1>Loading...</h1>
        <p>Fetching your library data...</p>
      </div>
    );
  }

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