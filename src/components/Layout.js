import React from 'react';
import Navbar from './Navbar';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Book Management System</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;