import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteStates, setDeleteStates] = useState({});
  
  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    // Fetch reviews
    axios.get('https://localhost:5056/api/Review')
      .then(res => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load reviews.');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    setDeleteStates(prev => ({ ...prev, [id]: true }));
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://localhost:5056/api/Review/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch {
      alert('Delete failed.');
    } finally {
      setDeleteStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const renderStars = (rating) => (
    <span>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
  );

  return (
    <div className="page-container">
      <h1>Reviews</h1>
      <div className="top-actions">
        <Link to="/reviews/create" className="add-button">+ Add Review</Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ul className="items-list">
          {reviews.map(r => (
            <li key={r.id} className="list-item card">
              <div>
                <h3>{r.bookTitle}</h3>
                <p className="review-stars">{renderStars(r.rating)}</p>
                <p className="review-comment">&quot;{r.comment}&quot;</p>
                <p className="review-meta">
                  <strong>By:</strong> {r.reviewerName || 'Anonymous'} •{' '}
                  <strong>Date:</strong> {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              {isAuthenticated && (
                <div className="list-actions">
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(r.id)}
                    disabled={deleteStates[r.id]}
                  >
                    {deleteStates[r.id] ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReviewsPage;