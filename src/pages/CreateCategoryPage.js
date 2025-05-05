import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Form.css';

function CreateCategoryPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    axios.post('https://localhost:5056/api/Category', { name })
      .then(() => {
        navigate('/categories');
      })
      .catch(err => {
        console.error('Error creating category:', err);
        setError('Failed to create category. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="form-container">
      <div className="form-content">
        <h2>Create New Category</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="categoryName">Category Name</label>
            <input
              type="text"
              id="categoryName"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Add Category'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCategoryPage;