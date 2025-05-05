import React, { Component } from 'react';
import { Container, Row, Col, Alert, Button, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

/**
 * Error Boundary component to catch JavaScript errors anywhere in child component tree
 * Displays a fallback UI instead of crashing the whole app
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  // Update state when an error occurs
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Log error information
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  // Reset error state to allow retry
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="shadow">
                <Card.Header as="h4" className="bg-danger text-white">
                  Something went wrong
                </Card.Header>
                <Card.Body>
                  <Alert variant="danger">
                    <p>We couldn&apos;t load this part of the application.</p>
                    <p>Try refreshing the page or come back later.</p>
                  </Alert>
                  
                  {/* Display error details in development */}
                  {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                    <details className="mt-3 mb-3">
                      <summary>Error Details (for developers)</summary>
                      <pre className="mt-2 bg-light p-3">
                        {this.state.error && this.state.error.toString()}
                      </pre>
                      <pre className="bg-light p-3">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                  
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      onClick={this.handleReset}
                      className="mb-2"
                    >
                      Try Again
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => window.location.href = '/'}
                    >
                      Return to Home Page
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

// Add PropTypes validation
ErrorBoundary.propTypes = {
  children: PropTypes.node
};

export default ErrorBoundary;