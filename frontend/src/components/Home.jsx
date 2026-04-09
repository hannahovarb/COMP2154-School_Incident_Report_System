import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/homePage.css';

const Home = () => {
  useEffect(() => {
    document.title = 'School Incident Reporting · Home';
    return () => {
      document.title = 'School Incident Reporting';
    };
  }, []);

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="hero">
          <h1>
            School Incident Reporting System
            <span className="jwt-badge">JWT secured</span>
          </h1>
          <p>
            Report incidents quickly, track updates, and help administrators respond faster with a
            secure, role-based dashboard.
          </p>
        </div>

        <div className="card-grid">
          <div className="info-card">
            <h2>Report Incidents</h2>
            <p>Submit bullying, safety, maintenance, and lost-item reports in one place.</p>
            <div className="card-action">
              <Link to="/report" className="btn btn-primary">
                Go to Report Form
              </Link>
            </div>
          </div>

          <div className="info-card">
            <h2>Secure Access</h2>
            <p>Use JWT-based authentication for students, teachers, and administrators.</p>
            <div className="card-action">
              <div className="btn-group">
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h2>Admin Dashboard</h2>
            <p>Review all reports, filter by status, and update incidents in real time.</p>
            <div className="card-action">
              <Link to="/dashboard" className="btn btn-primary">
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="home-footer">JWT Authentication · School Incident Reporting System</div>
      </div>
    </div>
  );
};

export default Home;
