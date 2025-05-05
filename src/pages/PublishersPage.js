import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PublishersPage() {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteStates, setDeleteStates] = useState({});

  useEffect(() => {
    axios.get('https://localhost:5056/api/Publisher')
      .then(res => {
        setPublishers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load publishers.');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    setDeleteStates(prev => ({ ...prev, [id]: true }));
    try {
      await axios.delete(`https://localhost:5056/api/Publisher/${id}`);
      setPublishers(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Delete failed. Make sure this publisher has no books.');
    } finally {
      setDeleteStates(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="page-container">
      <h1>Publishers</h1>
      <div className="top-actions">
        <Link to="/publishers/create" className="add-button">+ Add Publisher</Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ul className="items-list">
          {publishers.map(p => (
            <li key={p.id} className="list-item card">
              <div>
                <h3>{p.name}</h3>
                <p className="book-category">📍 {p.address}</p>
                <p className="book-author">📞 {p.contactNumber}</p>
              </div>
              <div className="list-actions">
                <button
                  className="delete-button"
                  onClick={() => handleDelete(p.id)}
                  disabled={deleteStates[p.id]}
                >
                  {deleteStates[p.id] ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PublishersPage;