// src/components/ApiModeToggle.js

import React, { useState, useEffect } from 'react';
import { Card, Form, Badge, Alert } from 'react-bootstrap';
import { isUsingLocalStorage, useLocalStorageMode, useApiMode } from '../services/serviceFactory';

const ApiModeToggle = () => {
  const [usingLocalStorage, setUsingLocalStorage] = useState(isUsingLocalStorage());
  const [apiUrl, setApiUrl] = useState(process.env.REACT_APP_API_URL || 'http://localhost:5060/api');

  // Update component state when localStorage changes
  useEffect(() => {
    const checkMode = () => {
      setUsingLocalStorage(isUsingLocalStorage());
    };

    // Check initial mode
    checkMode();

    // Set up an event listener for storage changes (in case mode is changed in another tab)
    window.addEventListener('storage', checkMode);
    
    return () => {
      window.removeEventListener('storage', checkMode);
    };
  }, []);

  const handleToggleChange = (e) => {
    const useLocalStorage = e.target.checked;
    
    if (useLocalStorage) {
      useLocalStorageMode();
    } else {
      useApiMode();
    }
    
    setUsingLocalStorage(useLocalStorage);
  };

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>API Connection Mode</span>
        <Badge bg={usingLocalStorage ? 'warning' : 'success'}>
          {usingLocalStorage ? 'Using LocalStorage' : 'Using Backend API'}
        </Badge>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Check 
            type="switch"
            id="api-mode-switch"
            label="Use LocalStorage mode (no backend required)"
            checked={usingLocalStorage}
            onChange={handleToggleChange}
          />
        </Form>
        
        <Alert variant="info" className="mt-3 mb-0">
          <Alert.Heading>Current Mode:</Alert.Heading>
          {usingLocalStorage ? (
            <p>
              Using <strong>LocalStorage</strong> to simulate the backend API. 
              This allows you to test the application without running the backend server.
              Your data will be stored in the browser's localStorage.
            </p>
          ) : (
            <p>
              Using the <strong>Backend API</strong> at: <code>{apiUrl}</code>. 
              Make sure your backend server is running and properly configured with CORS.
            </p>
          )}
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default ApiModeToggle;