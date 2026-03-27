import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user') || '{}') : null;
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!token) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <Link to="/report" className="text-xl font-bold text-blue-600">
              School Incident Reporting
            </Link>
            <div className="space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-800">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <Link to="/report" className="text-xl font-bold text-blue-600">
            School Incident Reporting
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/report" className="text-gray-600 hover:text-gray-800">
              Report Incident
            </Link>
            {isAdmin && (
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">
                Admin Dashboard
              </Link>
            )}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                Welcome, {user?.username || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;