import React, { useState, useEffect } from "react";
import '../css/ViewUsers.css';
import apiClient from '../../api/client';
import { Spinner } from "react-bootstrap";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserShield, FaTimes, FaUsers } from "react-icons/fa";

const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get('/users/get-all');
            setUsers(response.data || []);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="view-users-loading">
                <Spinner animation="border" variant="primary" />
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className="view-users-container">
            <div className="view-users-header">
                <h2>All Users</h2>
                <p>{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
            </div>

            {error && (
                <div className="error-banner">
                    <span>{error}</span>
                    <button onClick={() => setError('')}><FaTimes /></button>
                </div>
            )}

            {users.length === 0 ? (
                <div className="empty-state">
                    <FaUsers className="empty-icon" />
                    <h3>No users found</h3>
                    <p>There are no registered users yet</p>
                </div>
            ) : (
                <div className="users-grid">
                    {users.map((user) => (
                        <div key={user.id} className="user-card">
                            <div className="user-avatar">
                                <FaUser />
                            </div>
                            <div className="user-info">
                                <h3>{user.firstName} {user.lastName}</h3>
                                <span className={`role-badge ${user.role?.toLowerCase()}`}>
                                    <FaUserShield />
                                    {user.role || 'USER'}
                                </span>
                            </div>
                            <div className="user-details">
                                <div className="detail-item">
                                    <FaEnvelope />
                                    <span>{user.email}</span>
                                </div>
                                {user.contact && (
                                    <div className="detail-item">
                                        <FaPhone />
                                        <span>{user.contact}</span>
                                    </div>
                                )}
                                {user.address && (
                                    <div className="detail-item">
                                        <FaMapMarkerAlt />
                                        <span>{user.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewUsers;