import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { fetchUserProfile, logout } from '../redux/slices/AuthSlice';
import './Account.css';

function AccountPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get auth state from Redux
  const { user, loading, error, isAuthenticated } = useSelector(state => state.auth);
  
  // Add state to track if profile fetch has been attempted
  const [profileFetchAttempted, setProfileFetchAttempted] = useState(false);

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Only fetch the profile once to avoid rate limiting
    if (!profileFetchAttempted && !user) {
      setProfileFetchAttempted(true);
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated, navigate, profileFetchAttempted, user]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Render loading spinner
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  // Render error message
  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={() => navigate('/login')} variant="outline-danger">
              Go to Login
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // Render user data
  return (
    <Container className="py-4">
      <h1 className="mb-4">My Account</h1>
      
      {user ? (
        <Row>
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header as="h5">Account Information</Card.Header>
              <Card.Body>
                <Card.Title>{user.username || user.name || 'User'}</Card.Title>
                <Card.Text>
                  <strong>Email:</strong> {user.email}<br />
                  {user.role && <><strong>Role:</strong> {user.role}<br /></>}
                  {user.createdAt && (
                    <><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}<br /></>
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card>
              <Card.Header as="h5">Account Actions</Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button variant="primary" onClick={() => navigate('/books')}>
                    View Books
                  </Button>
                  {user.role === 'admin' && (
                    <Button variant="outline-primary" onClick={() => navigate('/books/create')}>
                      Add New Book
                    </Button>
                  )}
                  <Button variant="outline-secondary" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Alert variant="warning">
          No user information available. Please <Alert.Link onClick={() => navigate('/login')}>login</Alert.Link> again.
        </Alert>
      )}
    </Container>
  );
}

export default AccountPage;