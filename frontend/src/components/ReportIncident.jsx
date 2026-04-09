import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthToken } from '../authStorage';
import '../styles/reportIncidentPage.css';

const ReportIncident = () => {
  const [formData, setFormData] = useState({
    type: 'Bullying',
    location: '',
    description: '',
    is_anonymous: false
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const incidentTypes = [
    'Bullying',
    'Maintenance',
    'Safety',
    'Lost Item',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      return;
    }

    setPhoto(file);
    setError('');

    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.location.trim()) {
      setError('Location required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([k, v]) => submitData.append(k, v));

      if (photo) submitData.append('image', photo);

      const token = getAuthToken();

      await axios.post('/api/incidents', submitData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      setFormData({
        type: 'Bullying',
        location: '',
        description: '',
        is_anonymous: false
      });
      handleRemovePhoto();

      setTimeout(() => setSuccess(false), 4000);

    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="report-incident-page">
        <div className="report-card">

          <div className="report-topbar">
            <h1 className="report-title">Report an Incident</h1>
          </div>

          <p className="report-subtitle">
            Submit a report securely to help maintain a safe environment.
          </p>

          {success && <div className="report-alert-success">Report submitted successfully</div>}
          {error && <div className="report-alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>

            <div className="report-form-group">
              <label className="report-label">Incident Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="report-input">
                {incidentTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="report-form-group">
              <label className="report-label">Location</label>
              <input name="location" value={formData.location} onChange={handleChange} className="report-input" />
            </div>

            <div className="report-form-group">
              <label className="report-label">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="report-textarea" />
            </div>

            <div className="report-form-group">
              <label className="report-label">Upload Photo (optional)</label>
              <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="report-file-input" />

              {photoPreview && (
                  <div className="report-photo-preview">
                    <img src={photoPreview} alt="preview" />
                  </div>
              )}
            </div>

            <label className="report-checkbox-row">
              <input type="checkbox" name="is_anonymous" checked={formData.is_anonymous} onChange={handleChange} />
              Submit anonymously
            </label>

            <button type="submit" className="report-submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>

          </form>
        </div>
      </div>
  );
};

export default ReportIncident;