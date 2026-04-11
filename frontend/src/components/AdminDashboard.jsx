import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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

function RecentStatusBadge({ apiStatus }) {
  if (apiStatus === 'resolved') {
    return <span className="status-badge status-resolved">Resolved</span>;
  }
  if (apiStatus === 'in_progress') {
    return <span className="status-badge status-review">Under Review</span>;
  }
  return <span className="status-badge status-open">Open</span>;
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

function formatReportDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
}

function shortReporterName(name) {
  const n = (name || 'Anonymous').trim();
  if (!n || n === 'Anonymous') return 'Anonymous';
  const parts = n.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const last = parts[parts.length - 1];
  const initial = last[0] ? `${last[0].toUpperCase()}.` : '';
  return `${first} ${initial}`;
}

const AdminDashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const user = getAuthUser() || {};

  useEffect(() => {
    document.title = 'School Incident Report · Dashboard';
    return () => {
      document.title = 'School Incident Reporting';
    };
  }, []);

  const handleLogout = useCallback(() => {
    clearAuth();
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  }, [navigate]);

  const fetchRecentIncidents = useCallback(async () => {
    try {
      setRecentLoading(true);
      const response = await axios.get('/api/incidents');
      const sorted = [...response.data].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setRecentIncidents(sorted.slice(0, 3));
    } catch (error) {
      console.error('Error fetching recent incidents:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setRecentLoading(false);
    }
  }, [handleLogout]);

  const fetchIncidents = useCallback(async () => {
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
  }, [typeFilter, statusFilter, search, handleLogout]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchRecentIncidents();
  }, [navigate, fetchRecentIncidents]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchIncidents();
  }, [fetchIncidents]);

  const handleStatusUpdate = async (incidentId, newStatus) => {
    setUpdating(true);
    try {
      await axios.patch(`/api/incidents/${incidentId}/status`, {
        status: newStatus,
        notes: `Status updated by admin to ${newStatus}`,
      });
      await fetchIncidents();
      await fetchRecentIncidents();
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
        <header className="top-header">
          <h1>School Incident Report</h1>
          <div className="top-header-right">
            <nav className="nav-links" aria-label="Dashboard navigation">
              <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Dashboard
              </NavLink>
              <a href="#incident-reports" className="nav-link">
                Reports
              </a>
              <button type="button" className="nav-link" title="Not available in this build">
                Settings
              </button>
            </nav>
            <button type="button" className="top-sign-out" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </header>

        <div className="card-grid-four">
          <Link to="/report" className="stat-card">
            <h3>New Incident</h3>
            <p>Report a New Incident</p>
          </Link>
          <a href="#incident-reports" className="stat-card">
            <h3>View Incidents</h3>
            <p>Search &amp; Manage Reports</p>
          </a>
        </div>

        <section className="section-card" aria-labelledby="recent-incidents-heading">
          <div className="section-header">
            <h2 id="recent-incidents-heading">Recent Incidents</h2>
            <span className="badge-light">Last 3 reports</span>
          </div>
          <div className="recent-table-wrapper table-wrapper">
            {recentLoading ? (
              <div className="adm-loading" style={{ padding: '2rem 1rem' }}>
                <div className="adm-spinner" aria-hidden="true" />
                <p style={{ marginTop: '1rem' }}>Loading recent incidents…</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIncidents.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#6a7e99' }}>
                        No incidents yet.
                      </td>
                    </tr>
                  ) : (
                    recentIncidents.map((inc) => {
                      const reporter =
                        inc.reporter_name || inc.username || user.username || 'Anonymous';
                      return (
                        <tr key={inc.id}>
                          <td>{formatReportDate(inc.created_at)}</td>
                          <td>{shortReporterName(reporter)}</td>
                          <td>{inc.type}</td>
                          <td>
                            <RecentStatusBadge apiStatus={inc.status} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <div className="quick-links-card">
          <span className="quick-links-title">Quick Links</span>
          <div className="links-group">
            <button type="button" className="quick-link" title="Not available in this build">
              Incident Guidelines
            </button>
            <button type="button" className="quick-link" title="Not available in this build">
              Emergency Contacts
            </button>
            <button type="button" className="quick-link" title="Not available in this build">
              Safety Resources
            </button>
            <button type="button" className="quick-link" title="Not available in this build">
              Help &amp; Support
            </button>
          </div>
        </div>

        <div id="incident-reports" className="filter-card">
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
            <button type="button" className="filter-button" onClick={() => fetchIncidents()} disabled={loading}>
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
                      const reporter =
                        incident.reporter_name || incident.username || user.username || 'Anonymous';
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
                                  onClick={() =>
                                    alert(
                                      `Details:\nType: ${incident.type}\nDescription: ${incident.description}\nLocation: ${incident.location}\nStatus: ${displayStatus}`
                                    )
                                  }
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

        <div className="footer-note">JWT secured · School Incident Reporting</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
