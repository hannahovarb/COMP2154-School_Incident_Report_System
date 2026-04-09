import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/forgotPasswordPage.css';

const ForgotPassword = () => {
  useEffect(() => {
    document.title = 'Forgot Password · JWT Auth';
    return () => {
      document.title = 'School Incident Reporting';
    };
  }, []);

  return (
    <div className="forgot-password-page">
      <div className="forgot-card">
        <h1>
          Forgot password
          <span className="badge-jwt">JWT</span>
        </h1>
        <p className="forgot-message">
          Password reset is not configured for this demo. Contact your administrator or use the login page.
        </p>
        <Link to="/login" className="forgot-back-link">
          Back to login
        </Link>
        <div className="forgot-demo-note">JWT authentication · demo</div>
      </div>
    </div>
  );
};

export default ForgotPassword;
