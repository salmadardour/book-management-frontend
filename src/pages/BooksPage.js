import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [deleteStates, setDeleteStates] = useState({});
  
  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    // Fetch books - using the correct endpoint that worked
    axios.get('https://localhost:5056/api/Books')
      .then(res => {
        console.log('Books fetched successfully:', res.data);
        setBooks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching books:', err);
        setError('Failed to load books.');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    setDeleteStates(prev => ({ ...prev, [id]: true }));
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://localhost:5056/api/Books/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setBooks(prev => prev.filter(book => book.id !== id));
      console.log(`Book ${id} deleted successfully`);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Delete failed.');
    } finally {
      setDeleteStates(prev => ({ ...prev, [id]: false }));
    }
  };

  // Get unique categories for filter
  const categories = [...new Set(books.map(book => book.categoryName).filter(Boolean))];

  // Filter books based on search and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authorName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || book.categoryName === filterCategory;
    return matchesSearch && matchesCategory;
  });

  console.log('Render - Books:', books.length, 'Filtered:', filteredBooks.length);

  return (
    <div className="page-container">
      <h1>My Book Collection</h1>
      
      <div className="top-actions">
        <Link to="/books/create" className="add-button">+ Add Book</Link>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="filters" style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', minWidth: '200px' }}
        />
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {(searchTerm || filterCategory) && (
          <button 
            onClick={() => {setSearchTerm(''); setFilterCategory('');}}
            style={{ padding: '8px 12px', background: '#f0f0f0', border: '1px solid #ccc', cursor: 'pointer' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading books...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p className="error-message" style={{ color: 'red' }}>{error}</p>
        </div>
      ) : (
        <>
          {/* Results Summary */}
          <div style={{ marginBottom: '15px', color: '#666' }}>
            Showing {filteredBooks.length} of {books.length} books
            {(searchTerm || filterCategory) && (
              <span> (filtered)</span>
            )}
          </div>

          {/* Books List */}
          {filteredBooks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              {books.length === 0 ? 'No books available.' : 'No books match your search criteria.'}
            </div>
          ) : (
            <div className="items-list">
              {filteredBooks.map(book => (
                <div key={book.id} className="list-item card" style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '15px', 
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{book.title}</h3>
                    <p className="book-author" style={{ margin: '4px 0', color: '#666' }}>
                      📖 By {book.authorName}
                    </p>
                    <p className="book-category" style={{ margin: '4px 0', color: '#666' }}>
                      🏷️ {book.categoryName}
                    </p>
                    <p className="book-publisher" style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>
                      🏢 {book.publisherName}
                    </p>
                    {book.isbn && (
                      <p className="book-isbn" style={{ margin: '4px 0', color: '#999', fontSize: '12px' }}>
                        ISBN: {book.isbn}
                      </p>
                    )}
                  </div>
                  
                  <div className="list-actions">
                    <Link to={`/books/${book.id}`} className="view-button">View</Link>
                    {isAuthenticated && (
                      <button 
                        className="delete-button" 
                        onClick={() => handleDelete(book.id)}
                        disabled={deleteStates[book.id]}
                      >
                        {deleteStates[book.id] ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BooksPage;