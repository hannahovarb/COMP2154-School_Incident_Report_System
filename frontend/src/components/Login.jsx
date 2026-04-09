import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setAuth } from '../authStorage';
import '../styles/loginPage.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    document.title = 'JWT Authentication · Login';
    return () => {
      document.title = 'School Incident Reporting';
    };
  }, []);

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setFieldErrors(errs);
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      if (errs.email) emailRef.current?.focus();
      else passwordRef.current?.focus();
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { email, password });

      const { token, user } = response.data;

      setAuth(token, user, remember);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-root">
      <div className="login-page-card">
        <h1 className="login-page-title">JWT Authentication</h1>

        <div className="login-page-section-title">
          <h2 className="login-page-h2">User Login</h2>
          <span className="login-page-access-badge" aria-hidden="true">
            Access Secure Area
          </span>
        </div>

        {error && (
          <div className="login-page-alert" role="alert" aria-live="polite">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="login-page-form-group">
            <label htmlFor="email" className="login-page-label">
              Email
            </label>
            <input
              id="email"
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`login-page-input-email ${fieldErrors.email ? 'login-page-field-error' : ''}`}
              placeholder="you@example.com"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <p id="email-error" className="login-page-field-msg">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="login-page-form-group">
            <label htmlFor="password" className="login-page-label">
              Password
            </label>
            <div
              className={`login-page-password-wrap ${fieldErrors.password ? 'login-page-field-error' : ''}`}
            >
              <input
                id="password"
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-page-toggle-btn"
                onClick={() => setShowPassword((s) => !s)}
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {fieldErrors.password && (
              <p id="password-error" className="login-page-field-msg">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div className="login-page-flex-row">
            <label className="login-page-checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="login-page-forgot-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="login-page-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login →'}
          </button>
        </form>

        <div className="login-page-signup">
          Not registered:
          <Link to="/signup" className="login-page-signup-link">
            Sign up here
          </Link>
        </div>

        <div className="login-page-footer-note">JWT • stateless auth</div>
      </div>
    </div>
  );
};

export default Login;
