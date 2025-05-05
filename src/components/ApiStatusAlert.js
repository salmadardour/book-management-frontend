import React, { useState, useEffect } from 'react';
import { isUsingLocalStorage } from '../services/apiHelper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../redux/slices/bookSlice';

const ApiStatusAlert = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.books);
  const [apiStatus, setApiStatus] = useState({
    checked: false,
    connected: false
  });
  const [usingLocalStorage, setUsingLocalStorage] = useState(isUsingLocalStorage());

  // Check API connection on mount and when mode changes
  useEffect(() => {
    const checkMode = () => {
      setUsingLocalStorage(isUsingLocalStorage());
      checkApiConnection();
    };

    checkMode();
    
    // Set up an event listener for storage changes
    window.addEventListener('storage', checkMode);
    
    return () => {
      window.removeEventListener('storage', checkMode);
    };
  }, []);

  // Function to check API connection
  const checkApiConnection = () => {
    // Only check if we're in API mode
    if (!isUsingLocalStorage()) {
      // Try to fetch books as a connection test
      dispatch(fetchBooks())
        .unwrap()
        .then(() => {
          setApiStatus({ checked: true, connected: true });
        })
        .catch(() => {
          setApiStatus({ checked: true, connected: false });
        });
    } else {
      // If we're in localStorage mode, no need to check
      setApiStatus({ checked: false, connected: false });
    }
  };

  // If we're in localStorage mode, don't show anything
  if (usingLocalStorage) {
    return null;
  }

  // If we haven't checked the connection yet, show loading
  if (!apiStatus.checked) {
    return (
      <div className="alert alert-info mb-3">
        <div className="spinner-border spinner-border-sm me-2" role="status">
          <span className="visually-hidden">Checking API connection...</span>
        </div>
        Checking connection to backend API...
      </div>
    );
  }

  // If we've checked and we're connected, show success
  if (apiStatus.connected) {
    return (
      <div className="alert alert-success mb-3">
        <i className="bi bi-check-circle-fill me-2"></i>
        Connected to backend API successfully.
      </div>
    );
  }

  // If we've checked and we're not connected, show error
  return (
    <div className="alert alert-danger mb-3">
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      Failed to connect to backend API. Please check that your backend server is running.
      <button 
        className="btn btn-sm btn-outline-danger ms-3" 
        onClick={checkApiConnection} 
        disabled={loading}
      >
        {loading ? 'Checking...' : 'Retry Connection'}
      </button>
    </div>
  );
};

export default ApiStatusAlert;