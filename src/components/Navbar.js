import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Check login status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate('/');
    window.location.reload();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {!isLoggedIn ? (
          <button className="login-button" onClick={handleLoginClick}>
            Login
          </button>
        ) : (
          <div className="user-icon-container" onClick={toggleDropdown}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="user-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {showDropdown && (
              <div className="user-dropdown">
                <Link to="/account" onClick={() => setShowDropdown(false)}>My Account</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
        
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/books">Books</Link>
          <Link to="/authors">Authors</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/publishers">Publishers</Link>
          <Link to="/reviews">Reviews</Link>
        </div>
      </div>
      
      <div className="navbar-right">
        {/* I can an add search or other elements here */}
      </div>
    </nav>
  );
}

export default Navbar;