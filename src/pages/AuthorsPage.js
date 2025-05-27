import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authorToDelete, setAuthorToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Check if user is authenticated (simple check)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    // Fetch authors
    axios.get('https://localhost:5056/api/Author')
      .then(res => {
        setAuthors(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load authors.');
        setLoading(false);
        console.error('Error fetching authors:', err);
      });
  }, []);

  const handleDeleteClick = (author) => {
    setAuthorToDelete(author);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!authorToDelete) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://localhost:5056/api/Author/${authorToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuthors(prev => prev.filter(author => author.id !== authorToDelete.id));
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting author:', err);
      alert('Delete failed.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Authors</h1>
      <div className="top-actions">
        <Link to="/authors/create" className="add-button">+ Add Author</Link>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ul className="items-list">
          {authors.map(author => (
            <li key={author.id} className="list-item card">
              <div>
                <h3>{author.name}</h3>
              </div>
              {isAuthenticated && (
                <div className="list-actions">
                  <button className="delete-button" onClick={() => handleDeleteClick(author)}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete author "{authorToDelete?.name}"?</p>
            <div className="modal-actions">
              <button 
                className="cancel-button" 
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                className="delete-button" 
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthorsPage;