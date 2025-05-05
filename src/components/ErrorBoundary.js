import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ 
      error: error,
      errorInfo: errorInfo 
    });
  }

  handleRefresh = () => {
    // Attempt to recover by reloading the page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
          <div className="error-container">
            <h1>Something went wrong.</h1>
            <p>We're sorry, but an unexpected error occurred.</p>
            
            {this.state.error && (
              <details style={{ whiteSpace: 'pre-wrap' }}>
                <summary>Click for error details</summary>
                <p>{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <p>{this.state.errorInfo.componentStack}</p>
                )}
              </details>
            )}
            
            <div className="error-actions">
              <button onClick={this.handleRefresh}>
                Refresh Page
              </button>
              <button onClick={() => window.location.href = '/'}>
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;