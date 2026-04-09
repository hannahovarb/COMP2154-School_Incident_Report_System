import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthToken } from '../authStorage';

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
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
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
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('type', formData.type);
      submitData.append('location', formData.location);
      submitData.append('description', formData.description);
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
        type: 'Bullying',
        location: '',
        description: '',
        is_anonymous: false
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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="report-phone">
        <div className="report-phone-screen">
          <header className="report-header">
            <button type="button" onClick={() => navigate(-1)} className="report-back-btn" aria-label="Go back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h1 className="report-header-title">Report an Incident</h1>
          </header>

          <div className="p-6">
            {success && (
              <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                Report submitted successfully.
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="report-label">Incident Type:</label>
                <select name="type" value={formData.type} onChange={handleChange} className="report-input" required>
                  {incidentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-5">
                <label className="report-label">Location:</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="report-input"
                  placeholder="Type here"
                  required
                />
              </div>

              <div className="mb-5">
                <label className="report-label">Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="report-input resize-none"
                  placeholder="Type here"
                  required
                />
              </div>

              <div className="mb-8">
                <label className="report-photo-label">
                  Upload photo <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  className="hidden"
                  id="photo-upload"
                />

                <div className="mt-3 flex gap-3 items-end">
                  <label htmlFor="photo-upload" className="report-photo-box">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-14 h-14 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.5-4.5a2 2 0 012.8 0L16 16m-2-2 1.5-1.5a2 2 0 012.8 0L20 14M8 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </label>

                  <div className="flex-1">
                    <p className="text-lg font-semibold text-slate-700 mb-2">{photo?.name || 'photo.jpg'}</p>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="report-photo-btn">
                        Change
                      </button>
                      <button type="button" onClick={handleRemovePhoto} className="report-photo-btn">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="report-submit-btn">
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;