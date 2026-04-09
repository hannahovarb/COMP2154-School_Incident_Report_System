import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthToken, getAuthUser, clearAuth } from '../authStorage';
import '../styles/navigationBar.css';

const Navigation = () => {
  const navigate = useNavigate();
  const token = getAuthToken();
  const user = token ? getAuthUser() : null;
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    clearAuth();
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <nav className="app-navigation" aria-label="Main">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          School Incident Reporting
        </Link>

        {!token ? (
          <div className="nav-links">
            <div className="nav-auth-actions">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="btn-primary-sm">
                Sign Up
              </Link>
            </div>
          </div>
        ) : (
          <div className="nav-links">
            <Link to="/report" className="nav-link">
              Report Incident
            </Link>
            {isAdmin && (
              <Link to="/dashboard" className="nav-link">
                Admin Dashboard
              </Link>
            )}
            <div className="nav-user-block">
              <span className="welcome-text">
                Welcome, {user?.username || user?.email}
              </span>
              <button type="button" className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
