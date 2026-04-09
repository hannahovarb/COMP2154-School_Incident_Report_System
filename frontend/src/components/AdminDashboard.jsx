import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthToken, getAuthUser, clearAuth } from '../authStorage';
import '../styles/adminDashboardPage.css';

const STATUSES = ['All Statuses', 'Pending', 'Resolved', 'In Review', 'Open'];
const TYPES = ['All Types', 'Bullying', 'Maintenance', 'Safety', 'Lost Item', 'Other'];

function StatusBadge({ status }) {
  const map = {
    Pending: 'status-badge status-pending',
    Resolved: 'status-badge status-resolved',
    'In Review': 'status-badge status-inreview',
    Open: 'status-badge status-open',
  };
  const cls = map[status] || 'status-badge';
  return <span className={cls}>{status}</span>;
}

function apiStatusToFilterParam(uiStatus) {
  switch (uiStatus) {
    case 'Pending':
    case 'Open':
      return 'pending';
    case 'Resolved':
      return 'resolved';
    case 'In Review':
      return 'in_progress';
    default:
      return 'all';
  }
}

function rowToDisplayStatus(apiStatus) {
  switch (apiStatus) {
    case 'pending':
      return 'Pending';
    case 'in_progress':
      return 'In Review';
    case 'resolved':
      return 'Resolved';
    default:
      return 'Pending';
  }
}

const AdminDashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const user = getAuthUser() || {};

  useEffect(() => {
    document.title = 'Admin Dashboard · Incident Reports';
    return () => {
      document.title = 'School Incident Reporting';
    };
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      const typeKey = typeFilter === 'All Types' ? 'all' : typeFilter;
      const statusKey = apiStatusToFilterParam(statusFilter);

      if (typeKey !== 'all') params.append('type', typeKey);
      if (statusKey !== 'all') params.append('status', statusKey);
      if (search.trim()) params.append('search', search.trim());

      const response = await axios.get(`/api/incidents?${params.toString()}`);
      setIncidents(response.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchIncidents();
  }, [typeFilter, statusFilter, search]);

  const handleLogout = () => {
    clearAuth();
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const handleStatusUpdate = async (incidentId, newStatus) => {
    setUpdating(true);
    try {
      await axios.patch(`/api/incidents/${incidentId}/status`, {
        status: newStatus,
        notes: `Status updated by admin to ${newStatus}`,
      });
      await fetchIncidents();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdating(false);
      setSelectedIncident(null);
    }
  };

  const displayBadgeForRow = (incident) => {
    if (statusFilter === 'Open' && incident.status === 'pending') return 'Open';
    return rowToDisplayStatus(incident.status);
  };

  const countLabel =
    incidents.length === 1 ? '1 report' : `${incidents.length} reports`;

  return (
    <div className="admin-dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="dashboard-header-actions">
            <span className="badge-light">Incident Management</span>
            <button type="button" className="adm-sign-out" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>

        <div className="filter-card">
          <div className="filter-title">Filter by type</div>
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="adm-type-filter">Type</label>
              <select
                id="adm-type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="filter-select"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="adm-status-filter">Status</label>
              <select
                id="adm-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group filter-group--grow">
              <label htmlFor="adm-search">Search</label>
              <input
                id="adm-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchIncidents()}
                className="filter-input"
                placeholder="ID, reporter, location..."
              />
            </div>
            <button
              type="button"
              className="filter-button"
              onClick={() => fetchIncidents()}
              disabled={loading}
            >
              Filter
            </button>
          </div>
        </div>

        <div className="reports-card">
          <div className="section-header">
            <h2>Incident Reports</h2>
            <span className="report-count">{loading ? '…' : countLabel}</span>
          </div>

          <div className="table-wrapper">
            {loading ? (
              <div className="adm-loading">
                <div className="adm-spinner" aria-hidden="true" />
                <p style={{ marginTop: '1rem' }}>Loading incidents…</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Reporter</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#6a7e99' }}>
                        No reports found.
                      </td>
                    </tr>
                  ) : (
                    incidents.map((incident) => {
                      const displayStatus = displayBadgeForRow(incident);
                      const reporter = incident.reporter_name || 'Anonymous';
                      return (
                        <tr key={incident.id}>
                          <td>
                            <span style={{ fontWeight: 500 }}>{incident.id}</span>
                          </td>
                          <td>{incident.type}</td>
                          <td>{reporter}</td>
                          <td>{incident.location}</td>
                          <td>
                            <StatusBadge status={displayStatus} />
                          </td>
                          <td className="action-links">
                            {selectedIncident === incident.id ? (
                              <>
                                <button
                                  type="button"
                                  className="action-link update-link"
                                  disabled={updating}
                                  onClick={() => handleStatusUpdate(incident.id, 'in_progress')}
                                >
                                  In review
                                </button>
                                <button
                                  type="button"
                                  className="action-link update-link"
                                  disabled={updating}
                                  onClick={() => handleStatusUpdate(incident.id, 'resolved')}
                                >
                                  Resolve
                                </button>
                                <button
                                  type="button"
                                  className="action-link"
                                  disabled={updating}
                                  onClick={() => setSelectedIncident(null)}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="action-link update-link"
                                  onClick={() => setSelectedIncident(incident.id)}
                                >
                                  Update
                                </button>
                                <button
                                  type="button"
                                  className="action-link"
                                  onClick={() => navigate(`/dashboard/incidents/${incident.id}`)}
                                >
                                  View
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="dashboard-footer">JWT secured · admin panel</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
