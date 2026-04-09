import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/incidentDetailsPage.css';

const formatStatus = (status) => {
    switch (status) {
        case 'pending':
            return 'Pending';
        case 'in_progress':
            return 'In Review';
        case 'resolved':
            return 'Resolved';
        default:
            return status;
    }
};

const IncidentDetails = () => {
    const { id } = useParams();
    const [incident, setIncident] = useState(null);

    useEffect(() => {
        const fetchIncident = async () => {
            try {
                const res = await axios.get(`/api/incidents/${id}`);
                setIncident(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchIncident();
    }, [id]);

    if (!incident) {
        return (
            <div className="incident-details-page">
                <div className="incident-details-card">
                    <h1 className="incident-details-title">Incident Details</h1>
                    <p className="incident-details-subtitle">Loading incident...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="incident-details-page">
            <div className="incident-details-card">
                <div className="incident-details-topbar">
                    <h1 className="incident-details-title">Incident Details</h1>
                </div>

                <p className="incident-details-subtitle">
                    Review the full report information submitted by the user.
                </p>

                <div className="incident-details-group">
                    <label className="incident-details-label">Incident ID</label>
                    <div className="incident-details-box">#{incident.id}</div>
                </div>

                <div className="incident-details-group">
                    <label className="incident-details-label">Incident Type</label>
                    <div className="incident-details-box">{incident.type}</div>
                </div>

                <div className="incident-details-group">
                    <label className="incident-details-label">Location</label>
                    <div className="incident-details-box">{incident.location}</div>
                </div>

                <div className="incident-details-group">
                    <label className="incident-details-label">Status</label>
                    <div className="incident-details-box">{formatStatus(incident.status)}</div>
                </div>

                <div className="incident-details-group">
                    <label className="incident-details-label">Reporter</label>
                    <div className="incident-details-box">
                        {incident.reporter_name || 'Anonymous'}
                    </div>
                </div>

                <div className="incident-details-group">
                    <label className="incident-details-label">Description</label>
                    <div className="incident-details-textarea">
                        {incident.description}
                    </div>
                </div>

                {incident.image_url && (
                    <div className="incident-details-group">
                        <label className="incident-details-label">Attached Image</label>
                        <div className="incident-details-image-wrap">
                            <img
                                src={incident.image_url}
                                alt="Incident"
                                className="incident-details-image"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncidentDetails;