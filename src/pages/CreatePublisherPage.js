import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Form.css';

function CreatePublisherPage() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    axios.post('https://localhost:5056/api/Publisher', formData)
      .then(() => {
        navigate('/publishers');
      })
      .catch(err => {
        console.error('Error creating publisher:', err);
        setError('Failed to create publisher. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="form-container">
      <div className="form-content">
        <h2>Create New Publisher</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Publisher Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Enter publisher name"
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input 
              type="text" 
              id="address" 
              name="address" 
              placeholder="Enter address"
              value={formData.address} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input 
              type="text" 
              id="contactNumber" 
              name="contactNumber" 
              placeholder="Enter contact number"
              value={formData.contactNumber} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Add Publisher'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePublisherPage;