import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Form.css';

function CreateAuthorPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    axios.post('https://localhost:5056/api/Author', { name })
      .then(() => {
        navigate('/authors');
      })
      .catch(err => {
        console.error('Error creating author:', err);
        setError('Failed to create author. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="form-container">
      <div className="form-content">
        <h2>Create New Author</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="authorName">Author Name</label>
            <input
              type="text"
              id="authorName"
              placeholder="Enter author name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Add Author'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAuthorPage;