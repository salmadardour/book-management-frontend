// src/components/ApiStatusBanner.js

import React from 'react';
import { Alert, Container, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLocalStorageMode, useApiMode, isUsingLocalStorage } from '../services/serviceFactory';

const ApiStatusBanner = ({ mode }) => {
  const usingLocalStorage = isUsingLocalStorage();
  
  const handleToggleMode = () => {
    if (usingLocalStorage) {
      useApiMode();
    } else {
      useLocalStorageMode();
    }
  };

  return (
    <Alert variant={usingLocalStorage ? 'warning' : 'info'} className="mb-0 py-2">
      <Container className="d-flex justify-content-between align-items-center">
        <div>
          <strong>API Mode:</strong>{' '}
          <Badge bg={usingLocalStorage ? 'warning' : 'success'}>
            {usingLocalStorage ? 'LocalStorage' : 'Backend API'}
          </Badge>
          {usingLocalStorage && (
            <span className="ms-2">
              (No backend required - using simulated data)
            </span>
          )}
        </div>
        <div>
          <button 
            onClick={handleToggleMode} 
            className="btn btn-sm btn-outline-secondary me-2"
          >
            Switch to {usingLocalStorage ? 'Backend API' : 'LocalStorage'}
          </button>
          <Link to="/api-test" className="btn btn-sm btn-primary">
            Test Connection
          </Link>
        </div>
      </Container>
    </Alert>
  );
};

export default ApiStatusBanner;