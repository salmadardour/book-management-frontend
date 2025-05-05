// src/components/ApiTest.js

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../redux/slices/bookSlice';
import { Alert, Button, Card, Container, Spinner, Table } from 'react-bootstrap';
import ApiModeToggle from './ApiModeToggle';
import { isUsingLocalStorage } from '../services/serviceFactory';

const ApiTest = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.books);
  const [apiStatus, setApiStatus] = useState({ tested: false, success: false });
  const [usingLocalStorage, setUsingLocalStorage] = useState(isUsingLocalStorage());

  // Update component when localStorage mode changes
  useEffect(() => {
    const checkMode = () => {
      setUsingLocalStorage(isUsingLocalStorage());
    };

    window.addEventListener('storage', checkMode);
    
    return () => {
      window.removeEventListener('storage', checkMode);
    };
  }, []);

  const testApiConnection = () => {
    setApiStatus({ tested: false, success: false });
    
    dispatch(fetchBooks())
      .unwrap()
      .then(() => {
        setApiStatus({ tested: true, success: true });
      })
      .catch((err) => {
        console.error("API connection error:", err);
        setApiStatus({ tested: true, success: false });
      });
  };

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Book Management System</h1>
      
      <ApiModeToggle />
      
      <Card>
        <Card.Header>API Connection Test</Card.Header>
        <Card.Body>
          <Card.Title>Test your backend connection</Card.Title>
          <Card.Text>
            Click the button below to {usingLocalStorage ? 'test the localStorage simulation' : 'test if your React frontend can connect to your .NET backend API'}.
          </Card.Text>
          
          <Button 
            variant="primary" 
            onClick={testApiConnection}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                {' '}Testing...
              </>
            ) : (
              'Fetch Books'
            )}
          </Button>
          
          {apiStatus.tested && (
            <Alert 
              variant={apiStatus.success ? 'success' : 'danger'}
              className="mt-3"
            >
              {apiStatus.success 
                ? usingLocalStorage 
                  ? 'Successfully retrieved books from localStorage! 🎉' 
                  : 'Successfully connected to the backend API! 🎉'
                : usingLocalStorage
                  ? 'Failed to retrieve books from localStorage.'
                  : 'Failed to connect to the backend API. Make sure your backend is running and CORS is configured correctly.'}
            </Alert>
          )}
          
          {error && (
            <Alert variant="danger" className="mt-3">
              Error: {typeof error === 'string' ? error : JSON.stringify(error)}
            </Alert>
          )}
          
          {apiStatus.success && books && books.length > 0 && (
            <div className="mt-4">
              <h5>Books retrieved from {usingLocalStorage ? 'localStorage' : 'API'}:</h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Year</th>
                    <th>Category</th>
                    <th>ISBN</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book.id}>
                      <td>{book.id}</td>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.publishYear}</td>
                      <td>{book.category}</td>
                      <td>{book.isbn}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          
          {apiStatus.success && (!books || books.length === 0) && (
            <Alert variant="warning" className="mt-3">
              No books found. Try adding some books first.
            </Alert>
          )}
        </Card.Body>
        <Card.Footer className="text-muted">
          {usingLocalStorage 
            ? 'Using localStorage mode (no backend required)'
            : `Using API URL: ${process.env.REACT_APP_API_URL || 'http://localhost:5060/api'}`}
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default ApiTest;