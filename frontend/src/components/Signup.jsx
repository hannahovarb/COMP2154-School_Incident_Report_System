import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setAuth } from '../authStorage';
import '../styles/signupPage.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'JWT Authentication · Sign Up';
    return () => {
      document.title = 'School Incident Reporting';
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const confirmMismatch =
    formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      const response = await axios.post('/api/auth/register', userData);

      const { token, user } = response.data;

      setAuth(token, user, remember);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page-root">
      <div className="signup-page-card">
        <h1 className="signup-page-title">JWT Authentication</h1>
        <div className="signup-page-subhead">
          Secure access for authorized users. Join the School Incident Reporting System.
        </div>

        <div className="signup-page-section-title">
          <h2 className="signup-page-h2">Create Account</h2>
        </div>
        <div className="signup-page-tagline">Join the School Incident Reporting System</div>

        {error && (
          <div className="signup-page-alert" role="alert" aria-live="polite">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="signup-page-fields">
          <div className="signup-page-form-group">
            <label htmlFor="signup-username" className="signup-page-label">
              Username
            </label>
            <input
              id="signup-username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="signup-page-input"
              placeholder="Choose a username"
              autoComplete="username"
              required
            />
          </div>

          <div className="signup-page-form-group">
            <label htmlFor="signup-email" className="signup-page-label">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="signup-page-input"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="signup-page-form-group">
            <label htmlFor="signup-password" className="signup-page-label">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="signup-page-input"
              placeholder="Create a password"
              autoComplete="new-password"
              required
              minLength={6}
            />
            <div className="signup-page-password-hint">Minimum 6 characters</div>
          </div>

          <div className="signup-page-form-group">
            <label htmlFor="signup-confirm" className="signup-page-label">
              Confirm Password
            </label>
            <input
              id="signup-confirm"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`signup-page-input ${confirmMismatch ? 'signup-page-field-error' : ''}`}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
            />
          </div>
          </div>

          <div className="signup-page-form-group">
            <label htmlFor="signup-role" className="signup-page-label">
              Role
            </label>
            <select
              id="signup-role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="signup-page-input"
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            <div className="signup-page-admin-note">
              <span>Admins are assigned by system administrators.</span>
            </div>
          </div>

          <div className="signup-page-remember-row">
            <label className="signup-page-checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
          </div>

          <button type="submit" className="signup-page-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="signup-page-login-prompt">
          Already have an account?
          <Link to="/login" className="signup-page-login-link">
            Login here
          </Link>
        </div>

        <div className="signup-page-footer">JWT • secure registration</div>
      </div>
    </div>
  );
};

export default Signup;
