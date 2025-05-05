import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteStates, setDeleteStates] = useState({});

  useEffect(() => {
    axios.get('https://localhost:5056/api/Category')
      .then(res => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load categories.');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    setDeleteStates(prev => ({ ...prev, [id]: true }));
    try {
      await axios.delete(`https://localhost:5056/api/Category/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch {
      alert('Delete failed. Make sure this category has no books.');
    } finally {
      setDeleteStates(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="page-container">
      <h1>Categories</h1>
      <div className="top-actions">
        <Link to="/categories/create" className="add-button">+ Add Category</Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ul className="items-list">
          {categories.map(cat => (
            <li key={cat.id} className="list-item card">
              <div>
                <h3>{cat.name}</h3>
                {cat.bookCount > 0 && (
                  <p className="book-category">Books: {cat.bookCount}</p>
                )}
              </div>
              <div className="list-actions">
                <button
                  className="delete-button"
                  onClick={() => handleDelete(cat.id)}
                  disabled={deleteStates[cat.id]}
                >
                  {deleteStates[cat.id] ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoriesPage;
