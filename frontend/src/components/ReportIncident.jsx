import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { getAuthToken } from '../authStorage';
import '../styles/reportIncidentPage.css';

const ReportIncident = () => {
  const [formData, setFormData] = useState({
    type: 'Maintenance',
    location: '',
    subject: '',
    description: '',
    is_anonymous: false,
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const incidentTypes = [
    'Bullying',
    'Maintenance',
    'Safety',
    'Lost Item',
    'Other'
  ];

  useEffect(() => {
    document.title = 'Report Incident · School System';
    return () => {
      document.title = 'School Incident Reporting';
    };
  }, []);

  const fileName = useMemo(() => {
    if (!photo) return 'No file chosen';
    return photo.name || 'No file chosen';
  }, [photo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, or GIF).');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB.');
        return;
      }
      
      setPhoto(file);
      setError('');
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.location.trim()) {
      setError('Please enter a location.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please enter a description.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const composedDescription = formData.subject.trim()
        ? `Subject: ${formData.subject.trim()}\n\n${formData.description}`
        : formData.description;

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('type', formData.type);
      submitData.append('location', formData.location);
      submitData.append('description', composedDescription);
      submitData.append('is_anonymous', formData.is_anonymous);
      
      if (photo) {
        submitData.append('image', photo);
      }
      
      const token = getAuthToken();
      const config = token ? {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      } : {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      
      await axios.post('/api/incidents', submitData, config);
      
      setSuccess(true);
      setFormData({
        type: 'Maintenance',
        location: '',
        subject: '',
        description: '',
        is_anonymous: false,
      });
      handleRemovePhoto();
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (err) {
      console.error('Error submitting report:', err);
      setError(err.response?.data?.error || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page-root">
      <div className="report-card">
        <h1 className="report-title">School Incident Reporting</h1>
        <div className="report-subhead">Report an Incident</div>

        {success && (
          <div className="report-alert report-alert-success" role="status" aria-live="polite">
            Report submitted successfully.
          </div>
        )}

        {error && (
          <div className="report-alert report-alert-error" role="alert" aria-live="polite">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="report-form-group">
            <label htmlFor="incidentType" className="report-label">
              Incident Type
            </label>
            <select
              id="incidentType"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="report-select"
              required
            >
              {incidentTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="report-form-group">
            <label htmlFor="location" className="report-label">
              Location
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="report-input"
              placeholder="Type here"
              autoComplete="off"
              required
            />
          </div>

          <div className="report-form-group">
            <label htmlFor="subject" className="report-label">
              Brief title / subject
            </label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="report-input"
              placeholder="Type here"
              autoComplete="off"
            />
            <div className="report-hint">e.g., "Broken projector" or "Noise complaint"</div>
          </div>

          <div className="report-form-group">
            <label htmlFor="description" className="report-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="report-textarea"
              placeholder="Provide detailed information about the incident..."
              required
            />
          </div>

          <div className="report-form-group">
            <label className="report-label">Upload photo (Optional)</label>
            <div className="report-file-row">
              <label htmlFor="photoUpload" className="report-file-btn">
                Choose File
              </label>
              <input
                id="photoUpload"
                ref={fileInputRef}
                type="file"
                name="photo"
                className="report-file-input"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <span className="report-file-name" aria-live="polite">
                {fileName}
              </span>
              {photo && (
                <button type="button" className="report-file-clear" onClick={handleRemovePhoto}>
                  Remove
                </button>
              )}
            </div>
          </div>

          <button type="submit" className="report-submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>

        <div className="report-footer-note">JWT secured · incident reporting</div>
      </div>
    </div>
  );
};

export default ReportIncident;