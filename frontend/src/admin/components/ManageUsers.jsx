import React, { useState, useEffect } from "react";
import '../css/ManageUsers.css';
import apiClient from '../../api/client';
import { Spinner, Modal, Form, Button } from "react-bootstrap";
import { ConfirmModal } from "../../components/ui";
import { 
    FaUser, 
    FaEnvelope, 
    FaPhone, 
    FaMapMarkerAlt, 
    FaEdit, 
    FaTrash, 
    FaTimes,
    FaUsers,
    FaUserShield
} from "react-icons/fa";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editModal, setEditModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
        address: '',
        role: ''
    });

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

    const handleEditClick = (user) => {
        setFormData({
            id: user.id,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            contact: user.contact || '',
            address: user.address || '',
            role: user.role || 'USER'
        });
        setEditModal(true);
    };

    const handleDeleteClick = (id, name) => {
        setDeleteConfirm({ show: true, id, name });
    };

    const confirmDelete = async () => {
        try {
            await apiClient.delete(`/users/delete-user/${deleteConfirm.id}`);
            setDeleteConfirm({ show: false, id: null, name: '' });
            fetchUsers();
        } catch (err) {
            console.error('Delete failed:', err);
            setError('Failed to delete user.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await apiClient.put(`/users/update-user/${formData.id}`, formData);
            setEditModal(false);
            fetchUsers();
        } catch (err) {
            console.error('Update failed:', err);
            setError('Failed to update user.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="manage-users-loading">
                <Spinner animation="border" variant="primary" />
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className="manage-users-container">
            <div className="manage-users-header">
                <h2>Manage Users</h2>
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
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Contact</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-sm">
                                                <FaUser />
                                            </div>
                                            <div>
                                                <div className="user-name">{user.firstName} {user.lastName}</div>
                                                <div className="user-email">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contact-cell">
                                            {user.contact && (
                                                <span><FaPhone /> {user.contact}</span>
                                            )}
                                            {user.address && (
                                                <span><FaMapMarkerAlt /> {user.address}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${user.role?.toLowerCase()}`}>
                                            <FaUserShield />
                                            {user.role || 'USER'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-icon edit"
                                                onClick={() => handleEditClick(user)}
                                                title="Edit user"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn-icon delete"
                                                onClick={() => handleDeleteClick(user.id, `${user.firstName} ${user.lastName}`)}
                                                title="Delete user"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            <Modal show={editModal} onHide={() => setEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <Form.Group className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contact</Form.Label>
                            <Form.Control
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                            >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </Form.Select>
                        </Form.Group>
                        <div className="modal-actions">
                            <Button variant="secondary" onClick={() => setEditModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Spinner size="sm" className="me-2" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmModal
                show={deleteConfirm.show}
                onHide={() => setDeleteConfirm({ show: false, id: null, name: '' })}
                onConfirm={confirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
};

export default ManageUsers;