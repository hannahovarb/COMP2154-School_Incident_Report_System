import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import ReportIncident from './components/ReportIncident';
import Navigation from './components/Navigation';
import Home from './components/Home';
import ForgotPassword from './components/ForgotPassword';
import { getAuthToken, getAuthUser } from './authStorage';

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const token = getAuthToken();
  const user = getAuthUser() || {};
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/report" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

const AppLayout = () => {
  const location = useLocation();
  const hideNavigationRoutes = ['/login', '/signup', '/dashboard', '/forgot-password'];
  const shouldShowNavigation = !hideNavigationRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowNavigation && <Navigation />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/report"
          element={
            <PrivateRoute requireAdmin={false}>
              <ReportIncident />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requireAdmin={true}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;