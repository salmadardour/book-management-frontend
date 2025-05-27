import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteStates, setDeleteStates] = useState({});
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

  const handleDelete = async (id) => {
    console.log(`Deleting author ID: ${id}`);
    setDeleteStates(prev => ({ ...prev, [id]: true }));
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`https://localhost:5056/api/Author/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      setAuthors(prev => prev.filter(author => author.id !== id));
      console.log(`Author ${id} deleted successfully`);
      
    } catch (err) {
      console.error('Delete failed:', err.response?.status, err.response?.data);
      alert('Delete failed.');
    } finally {
      setDeleteStates(prev => ({ ...prev, [id]: false }));
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
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(author.id)}
                    disabled={deleteStates[author.id]}
                  >
                    {deleteStates[author.id] ? 'Deleting...' : 'Delete'}
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

export default AuthorsPage;