// src/pages/ApiTestPage.js

import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Table, Badge, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../redux/slices/bookSlice';
import { fetchAuthors } from '../redux/slices/authorSlice';
import { fetchCategories } from '../redux/slices/categorySlice';
import { fetchPublishers } from '../redux/slices/publisherSlice';
import { isUsingLocalStorage } from '../services/serviceFactory';

const ApiTestPage = () => {
  const dispatch = useDispatch();
  const { books, loading: booksLoading, error: booksError } = useSelector(state => state.books);
  const { authors, loading: authorsLoading, error: authorsError } = useSelector(state => state.authors);
  const { categories, loading: categoriesLoading, error: categoriesError } = useSelector(state => state.categories);
  const { publishers, loading: publishersLoading, error: publishersError } = useSelector(state => state.publishers);
  
  const [testResults, setTestResults] = useState({
    books: { tested: false, success: false },
    authors: { tested: false, success: false },
    categories: { tested: false, success: false },
    publishers: { tested: false, success: false }
  });
  
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
  
  const loading = booksLoading || authorsLoading || categoriesLoading || publishersLoading;
  
  const testAllConnections = () => {
    // Reset test results
    setTestResults({
      books: { tested: false, success: false },
      authors: { tested: false, success: false },
      categories: { tested: false, success: false },
      publishers: { tested: false, success: false }
    });
    
    // Test books API
    dispatch(fetchBooks())
      .unwrap()
      .then(() => {
        setTestResults(prev => ({
          ...prev,
          books: { tested: true, success: true }
        }));
      })
      .catch(() => {
        setTestResults(prev => ({
          ...prev,
          books: { tested: true, success: false }
        }));
      });
    
    // Test authors API
    dispatch(fetchAuthors())
      .unwrap()
      .then(() => {
        setTestResults(prev => ({
          ...prev,
          authors: { tested: true, success: true }
        }));
      })
      .catch(() => {
        setTestResults(prev => ({
          ...prev,
          authors: { tested: true, success: false }
        }));
      });
    
    // Test categories API
    dispatch(fetchCategories())
      .unwrap()
      .then(() => {
        setTestResults(prev => ({
          ...prev,
          categories: { tested: true, success: true }
        }));
      })
      .catch(() => {
        setTestResults(prev => ({
          ...prev,
          categories: { tested: true, success: false }
        }));
      });
    
    // Test publishers API
    dispatch(fetchPublishers())
      .unwrap()
      .then(() => {
        setTestResults(prev => ({
          ...prev,
          publishers: { tested: true, success: true }
        }));
      })
      .catch(() => {
        setTestResults(prev => ({
          ...prev,
          publishers: { tested: true, success: false }
        }));
      });
  };
  
  const getOverallStatus = () => {
    const { books, authors, categories, publishers } = testResults;
    
    if (!books.tested && !authors.tested && !categories.tested && !publishers.tested) {
      return { tested: false, success: false };
    }
    
    const allTested = books.tested && authors.tested && categories.tested && publishers.tested;
    const allSuccess = books.success && authors.success && categories.success && publishers.success;
    
    return { tested: allTested, success: allSuccess };
  };
  
  const overallStatus = getOverallStatus();

  return (
    <Container className="py-4">
      <h1>API Connection Test</h1>
      <p className="lead">
        This page tests the connection between your frontend and the {usingLocalStorage ? 'localStorage fallback' : 'backend API'}.
      </p>
      
      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <span>Connection Status</span>
            {overallStatus.tested && (
              <Badge bg={overallStatus.success ? 'success' : 'danger'}>
                {overallStatus.success ? 'All Connections OK' : 'Connection Issues'}
              </Badge>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          <p>
            Your application is currently using <strong>{usingLocalStorage ? 'localStorage mode' : 'backend API mode'}</strong>.
            {usingLocalStorage 
              ? ' This means all data is stored locally in your browser and no server connection is required.'
              : ' This means the app needs to connect to your backend server to function properly.'}
          </p>
          
          <Button 
            variant="primary" 
            onClick={testAllConnections}
            disabled={loading}
            className="mb-4"
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
                {' '}Testing Connections...
              </>
            ) : (
              'Test All Connections'
            )}
          </Button>
          
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th>API Endpoint</th>
                <th>Status</th>
                <th>Results</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Books API</td>
                <td>
                  {!testResults.books.tested ? (
                    <Badge bg="secondary">Not Tested</Badge>
                  ) : testResults.books.success ? (
                    <Badge bg="success">Success</Badge>
                  ) : (
                    <Badge bg="danger">Failed</Badge>
                  )}
                </td>
                <td>
                  {testResults.books.success && (
                    <span>{books?.length || 0} books found</span>
                  )}
                  {testResults.books.tested && !testResults.books.success && (
                    <span className="text-danger">
                      {booksError ? 
                        (typeof booksError === 'string' ? booksError : 'Connection error') 
                        : 'Failed to fetch books'}
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td>Authors API</td>
                <td>
                  {!testResults.authors.tested ? (
                    <Badge bg="secondary">Not Tested</Badge>
                  ) : testResults.authors.success ? (
                    <Badge bg="success">Success</Badge>
                  ) : (
                    <Badge bg="danger">Failed</Badge>
                  )}
                </td>
                <td>
                  {testResults.authors.success && (
                    <span>{authors?.length || 0} authors found</span>
                  )}
                  {testResults.authors.tested && !testResults.authors.success && (
                    <span className="text-danger">
                      {authorsError ? 
                        (typeof authorsError === 'string' ? authorsError : 'Connection error') 
                        : 'Failed to fetch authors'}
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td>Categories API</td>
                <td>
                  {!testResults.categories.tested ? (
                    <Badge bg="secondary">Not Tested</Badge>
                  ) : testResults.categories.success ? (
                    <Badge bg="success">Success</Badge>
                  ) : (
                    <Badge bg="danger">Failed</Badge>
                  )}
                </td>
                <td>
                  {testResults.categories.success && (
                    <span>{categories?.length || 0} categories found</span>
                  )}
                  {testResults.categories.tested && !testResults.categories.success && (
                    <span className="text-danger">
                      {categoriesError ? 
                        (typeof categoriesError === 'string' ? categoriesError : 'Connection error') 
                        : 'Failed to fetch categories'}
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td>Publishers API</td>
                <td>
                  {!testResults.publishers.tested ? (
                    <Badge bg="secondary">Not Tested</Badge>
                  ) : testResults.publishers.success ? (
                    <Badge bg="success">Success</Badge>
                  ) : (
                    <Badge bg="danger">Failed</Badge>
                  )}
                </td>
                <td>
                  {testResults.publishers.success && (
                    <span>{publishers?.length || 0} publishers found</span>
                  )}
                  {testResults.publishers.tested && !testResults.publishers.success && (
                    <span className="text-danger">
                      {publishersError ? 
                        (typeof publishersError === 'string' ? publishersError : 'Connection error') 
                        : 'Failed to fetch publishers'}
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </Table>
          
          {overallStatus.tested && (
            <Alert variant={overallStatus.success ? 'success' : 'danger'}>
              {overallStatus.success ? (
                <>
                  <Alert.Heading>All connections successful!</Alert.Heading>
                  <p>
                    Your application is successfully connected to the {usingLocalStorage ? 'localStorage fallback' : 'backend API'}.
                    You can now use all features of the application.
                  </p>
                </>
              ) : (
                <>
                  <Alert.Heading>Connection issues detected</Alert.Heading>
                  <p>
                    There were issues connecting to some of the API endpoints. 
                    {!usingLocalStorage && (
                      <>
                        <br />
                        Please make sure your backend server is running and CORS is properly configured.
                        <br />
                        You can also switch to localStorage mode to use the application without a backend.
                      </>
                    )}
                  </p>
                </>
              )}
            </Alert>
          )}
        </Card.Body>
        <Card.Footer className="text-muted">
          API URL: {usingLocalStorage ? 'Using localStorage (no API URL)' : (process.env.REACT_APP_API_URL || 'http://localhost:5060/api')}
        </Card.Footer>
      </Card>
      
      {/* Display data samples if tests successful */}
      {testResults.books.success && books && books.length > 0 && (
        <Card className="mb-4">
          <Card.Header>Sample Books Data</Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Year</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {books.slice(0, 5).map(book => (
                  <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>{book.title}</td>
                    <td>{book.authorName || book.author}</td>
                    <td>{book.publishYear}</td>
                    <td>{book.categoryName || book.category}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {books.length > 5 && (
              <p className="text-muted">Showing 5 of {books.length} books</p>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ApiTestPage;