import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Not authenticated, redirect to login
      navigate('/login');
      return;
    }

    setIsAuthenticated(true);

    // Try to get user from localStorage first
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setLoading(false);
        console.log('User loaded from localStorage:', userData);
        return;
      } catch (err) {
        console.log('Failed to parse stored user data');
      }
    }

    // If no stored user, fetch from API
    const fetchUserProfile = async () => {
      try {
        console.log('Fetching user profile from API...');
        console.log('Token:', token);
        
        // Try multiple possible profile endpoints
        const endpoints = [
          'https://localhost:5056/api/auth/profile',
          'https://localhost:5056/api/auth/user',
          'https://localhost:5056/api/user',
          'https://localhost:5056/api/Account/profile'
        ];
        
        let response = null;
        let successEndpoint = null;
        
        for (const endpoint of endpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            response = await axios.get(endpoint, {
              headers: { Authorization: `Bearer ${token}` }
            });
            successEndpoint = endpoint;
            console.log(`✅ Success with ${endpoint}:`, response.data);
            break;
          } catch (endpointErr) {
            console.log(`❌ Failed ${endpoint}:`, endpointErr.response?.status, endpointErr.response?.data);
          }
        }
        
        if (response && response.data) {
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
          setLoading(false);
          setError(`Profile loaded successfully from: ${successEndpoint}`);
        } else {
          throw new Error('All profile endpoints failed');
        }
        
      } catch (err) {
        console.error('Error fetching user profile:', err);
        console.error('Error details:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers
        });
        
        if (err.response?.status === 401) {
          // Token is invalid, clear storage and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setError('Session expired. Please login again.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError(`Failed to load user profile. Status: ${err.response?.status || 'Unknown'}, Message: ${err.response?.data?.message || err.message}`);
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    console.log('User logged out');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1>My Account</h1>
        <p>Loading your account information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>My Account</h1>
        <p className="error-message">{error}</p>
        <div className="account-actions">
          <button onClick={() => navigate('/login')} className="view-button">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-container">
        <h1>My Account</h1>
        <p className="error-message">No user information available.</p>
        <div className="account-actions">
          <button onClick={() => navigate('/login')} className="view-button">
            Please Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>My Account</h1>
      
      <div className="account-info">
        <div className="account-card">
          <h2>Account Information</h2>
          <div className="account-details">
            <h3>{user.userName || user.username || user.name || 'User'}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            {user.fullName && <p><strong>Full Name:</strong> {user.fullName}</p>}
            {user.role && <p><strong>Role:</strong> {user.role}</p>}
            {user.createdAt && (
              <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
        
        <div className="account-card">
          <h2>Account Actions</h2>
          <div className="account-actions">
            <button 
              className="view-button" 
              onClick={() => navigate('/books')}
            >
              View Books
            </button>
            
            <button 
              className="view-button" 
              onClick={() => navigate('/authors')}
            >
              View Authors
            </button>
            
            {(user.role === 'admin' || user.role === 'Admin') && (
              <button 
                className="view-button" 
                onClick={() => navigate('/books/create')}
              >
                Add New Book
              </button>
            )}
            
            <button 
              className="delete-button" 
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Debug info - you can remove this later */}
      <details style={{ marginTop: '20px', fontSize: '12px' }}>
        <summary>Debug: Raw user data</summary>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default AccountPage;