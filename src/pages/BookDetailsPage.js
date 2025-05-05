import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function BookDetailsPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://localhost:5056/api/Books/${id}`)
      .then(res => setBook(res.data))
      .catch(() => setError('Book not found or failed to load.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-container"><p>Loading...</p></div>;
  if (error) return <div className="page-container"><p>{error}</p></div>;

  return (
    <div className="page-container">
      <h2>{book.title}</h2>
      <p><strong>Author:</strong> {book.authorName}</p>
      <p><strong>Category:</strong> {book.categoryName}</p>
      <p><strong>Publisher:</strong> {book.publisherName}</p>
      <p><strong>ISBN:</strong> {book.isbn}</p>
      <p><strong>Publisher Address:</strong> {book.publisherAddress}</p>
      <p><strong>Publisher Contact:</strong> {book.publisherContactNumber}</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/books" className="view-button">← Back to Books</Link>
      </div>
    </div>
  );
}

export default BookDetailsPage;
