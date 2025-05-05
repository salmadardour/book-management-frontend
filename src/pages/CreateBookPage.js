import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Form.css';

function CreateBookPage() {
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    authorId: '',
    categoryId: '',
    publisherId: ''
  });

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [authorsRes, categoriesRes, publishersRes] = await Promise.all([
          axios.get('https://localhost:5056/api/Author'),
          axios.get('https://localhost:5056/api/Category'),
          axios.get('https://localhost:5056/api/Publisher')
        ]);
        
        setAuthors(authorsRes.data);
        setCategories(categoriesRes.data);
        setPublishers(publishersRes.data);
      } catch (err) {
        console.error('Error loading form data:', err);
        setError('Failed to load form data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        authorId: parseInt(formData.authorId),
        categoryId: parseInt(formData.categoryId),
        publisherId: parseInt(formData.publisherId),
      };

      await axios.post('https://localhost:5056/api/Books', payload);
      navigate('/books');
      
    } catch (err) {
      console.error('Error creating book:', err);
      setError(err.response?.data?.message || 'Failed to create book. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return (
    <div className="form-container">
      <div className="form-content">
        <p style={{ textAlign: 'center' }}>Loading form data...</p>
      </div>
    </div>
  );

  return (
    <div className="form-container">
      <div className="form-content">
        <h2>Create New Book</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input 
              type="text" 
              id="title"
              name="title" 
              placeholder="Enter book title"
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="isbn">ISBN</label>
            <input 
              type="text" 
              id="isbn"
              name="isbn" 
              placeholder="Enter ISBN"
              value={formData.isbn} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="authorId">Author</label>
            <select 
              id="authorId"
              name="authorId" 
              value={formData.authorId} 
              onChange={handleChange} 
              required
            >
              <option value="">Select Author</option>
              {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">Category</label>
            <select 
              id="categoryId"
              name="categoryId" 
              value={formData.categoryId} 
              onChange={handleChange} 
              required
            >
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="publisherId">Publisher</label>
            <select 
              id="publisherId"
              name="publisherId" 
              value={formData.publisherId} 
              onChange={handleChange} 
              required
            >
              <option value="">Select Publisher</option>
              {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <button type="submit" disabled={submitLoading}>
            {submitLoading ? 'Creating...' : 'Create Book'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBookPage;