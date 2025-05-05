import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Form.css';

// Create star rating component
const StarRating = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          style={{
            cursor: 'pointer',
            fontSize: '28px',
            color: (hoverRating || rating) >= star ? '#ffbf00' : '#ccc',
            transition: 'color 0.2s'
          }}
          onClick={() => onRatingChange(star.toString())}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

// Add PropTypes for the StarRating component
StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func.isRequired
};

function CreateReviewPage() {
  const [formData, setFormData] = useState({
    rating: '5', // Default to 5 stars
    content: '',  // Changed from 'comment' to 'content' to match backend
    bookId: '',
    bookTitle: '',  // Added bookTitle field to match DTO requirements
    reviewerName: 'Anonymous' // Add reviewer name with default value
  });

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://localhost:5056/api/Books')
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading books:', err);
        setError('Failed to load books. Please refresh the page.');
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'bookId') {
      // When bookId changes, also update the bookTitle
      const selectedBook = books.find(book => book.id.toString() === e.target.value);
      
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value,
        bookTitle: selectedBook ? selectedBook.title : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    }
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      // Make sure bookTitle is set before submitting
      if (!formData.bookTitle && formData.bookId) {
        const selectedBook = books.find(book => book.id.toString() === formData.bookId.toString());
        if (selectedBook) {
          formData.bookTitle = selectedBook.title;
        }
      }

      const payload = {
        rating: parseInt(formData.rating),
        content: formData.content,
        bookId: parseInt(formData.bookId),
        bookTitle: formData.bookTitle, // Include bookTitle in the payload
        reviewerName: formData.reviewerName
      };

      // Log the payload to check if it matches the expected format
      console.log('Submitting review payload:', payload);

      const response = await axios.post('https://localhost:5056/api/Review', payload);
      console.log('Review created successfully:', response.data);
      navigate('/reviews');
      
    } catch (err) {
      console.error('Error creating review:', err);
      
      let errorMessage = 'Failed to create review. Please try again.';
      
      if (err.response) {
        console.error('Error response data:', err.response.data);
        
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.errors) {
          // Handle validation errors
          const errors = err.response.data.errors;
          const errorMessages = [];
          
          // Process different error formats
          Object.keys(errors).forEach(key => {
            if (Array.isArray(errors[key])) {
              errorMessages.push(...errors[key]);
            } else if (typeof errors[key] === 'string') {
              errorMessages.push(errors[key]);
            }
          });
          
          errorMessage = errorMessages.join('. ');
        } else if (err.response.data.title) {
          errorMessage = `${err.response.data.title}: ${JSON.stringify(err.response.data.errors)}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return (
    <div className="form-container">
      <div className="form-content">
        <p style={{ textAlign: 'center' }}>Loading book data...</p>
      </div>
    </div>
  );

  return (
    <div className="form-container">
      <div className="form-content">
        <h2>Create Review</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="bookId">Book</label>
            <select
              id="bookId"
              name="bookId"
              value={formData.bookId}
              onChange={handleChange}
              required
            >
              <option value="">Select Book</option>
              {books.map(book => (
                <option key={book.id} value={book.id}>{book.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="reviewerName">Your Name</label>
            <input
              type="text"
              id="reviewerName"
              name="reviewerName"
              value={formData.reviewerName}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Rating</label>
            <StarRating 
              rating={parseInt(formData.rating) || 0} 
              onRatingChange={(value) => handleChange({ target: { name: 'rating', value } })}
            />
            <input
              type="hidden"
              name="rating"
              value={formData.rating}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Comment</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Share your thoughts about this book..."
            ></textarea>
          </div>

          <button type="submit" disabled={submitLoading}>
            {submitLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateReviewPage;