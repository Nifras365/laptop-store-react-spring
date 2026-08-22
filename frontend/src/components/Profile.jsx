import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Nav, Modal, Form, Spinner } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { IoPersonOutline, IoLocationOutline, IoCallOutline, IoMailOutline, IoCardOutline, IoBagCheckOutline } from "react-icons/io5";
import NavbarLogged from "../components/LoggedNavbar/NavbarLogged";
import apiClient from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { PageHeader, LoadingState, ErrorBanner } from "../components/ui";
import './css/Profile.css';

const Profile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [orders, setOrders] = useState([]);
    const [validOrders, setValidOrders] = useState([]);
    const [cancelledOrders, setCancelledOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    
    const { userID, logout } = useAuth();

    useEffect(() => {
        if (!userID) {
            setLoading(false);
            return;
        }

        async function fetchData() {
            try {
                const [userRes, ordersRes] = await Promise.all([
                    apiClient.get(`/users/userdetails/${userID}`),
                    apiClient.get(`/orders/user/${userID}`)
                ]);
                const fetchedOrders = ordersRes.data.data || [];
                setUserDetails(userRes.data.data[0]);
                setOrders(fetchedOrders);
                setValidOrders(fetchedOrders.filter(o => o.status !== 'CANCELLED'));
                setCancelledOrders(fetchedOrders.filter(o => o.status === 'CANCELLED'));
            } catch (error) {
                setError("Failed to load profile data. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [userID]);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    const handleEditClick = () => {
        setEditData({
            name: userDetails.name,
            email: userDetails.email,
            phone: userDetails.phone,
            address: userDetails.address,
            country: userDetails.country
        });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await apiClient.put(`/users/update-user/${userID}`, editData);
            setUserDetails({ ...userDetails, ...editData });
            setShowEditModal(false);
        } catch (error) {
            alert("Failed to update profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setIsChangingPassword(true);
        try {
            await apiClient.put(`/users/${userID}/change-password`, passwordData);
            setShowPasswordModal(false);
            setPasswordData({ oldPassword: '', newPassword: '' });
            alert("Password changed successfully!");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to change password.");
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="profile-page">
            <NavbarLogged />
            <Container className="profile-container">
                <Row className="profile-layout g-4 align-items-start">
                    {/* Sidebar */}
                    <Col md={4} lg={3}>
                        <Card className="profile-sidebar">
                            <div className="sidebar-header">
                                <FaUserCircle className="sidebar-avatar" />
                                <div className="sidebar-user-info">
                                    <span className="sidebar-user-name">{userDetails?.name || 'Loading...'}</span>
                                    <span className="sidebar-user-email">{userDetails?.email || ''}</span>
                                </div>
                            </div>
                            <Nav className="flex-column sidebar-nav">
                                <Nav.Link href="/profile" className="sidebar-link active">
                                    <IoPersonOutline />
                                    <span>My Profile</span>
                                </Nav.Link>
                                <Nav.Link href="/orders" className="sidebar-link">
                                    <IoLocationOutline />
                                    <span>My Orders</span>
                                </Nav.Link>
                                <Nav.Link href="/cart" className="sidebar-link">
                                    <IoCallOutline />
                                    <span>My Cart</span>
                                </Nav.Link>
                                <Nav.Link onClick={handleLogout} className="sidebar-link logout">
                                    Logout
                                </Nav.Link>
                            </Nav>
                        </Card>
                    </Col>

                    <Col md={8} lg={9}>
                        <PageHeader
                            title="My Profile"
                            subtitle="Manage your personal information"
                        />

                        {error && (
                            <ErrorBanner
                                message={error}
                                onDismiss={() => setError('')}
                            />
                        )}

                        {loading ? (
                            <LoadingState message="Loading profile..." />
                        ) : userDetails ? (
                            <div className="profile-content">
                                <Card className="profile-card">
                                    <div className="profile-card-header">
                                        <h3 className="profile-card-title">Personal Information</h3>
                                        <Button variant="outline-primary" size="sm" className="edit-btn" onClick={handleEditClick}>
                                            Edit Profile
                                        </Button>
                                    </div>
                                    
                                    <div className="profile-details-grid">
                                        <div className="profile-detail-item">
                                            <div className="detail-icon">
                                                <IoPersonOutline />
                                            </div>
                                            <div className="detail-content">
                                                <span className="detail-label">Full Name</span>
                                                <span className="detail-value">{userDetails.name}</span>
                                            </div>
                                        </div>

                                        <div className="profile-detail-item">
                                            <div className="detail-icon">
                                                <IoMailOutline />
                                            </div>
                                            <div className="detail-content">
                                                <span className="detail-label">Email Address</span>
                                                <span className="detail-value">{userDetails.email}</span>
                                            </div>
                                        </div>

                                        <div className="profile-detail-item">
                                            <div className="detail-icon">
                                                <IoCallOutline />
                                            </div>
                                            <div className="detail-content">
                                                <span className="detail-label">Phone Number</span>
                                                <span className="detail-value">{userDetails.phone}</span>
                                            </div>
                                        </div>

                                        <div className="profile-detail-item">
                                            <div className="detail-icon">
                                                <IoLocationOutline />
                                            </div>
                                            <div className="detail-content">
                                                <span className="detail-label">Country</span>
                                                <span className="detail-value">{userDetails.country}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="profile-card">
                                    <div className="profile-card-header">
                                        <h3 className="profile-card-title">Shipping Address</h3>
                                        <Button variant="outline-primary" size="sm" className="edit-btn" onClick={handleEditClick}>
                                            Edit Address
                                        </Button>
                                    </div>
                                    
                                    <div className="address-content">
                                        <p className="address-text">{userDetails.address}</p>
                                        <p className="address-country">{userDetails.country}</p>
                                    </div>
                                </Card>

                                <Card className="profile-card">
                                    <div className="profile-card-header">
                                        <h3 className="profile-card-title">Order Summary</h3>
                                    </div>
                                    <div className="profile-details-grid">
                                        <div className="profile-detail-item">
                                            <div className="detail-icon">
                                                <IoBagCheckOutline />
                                            </div>
                                            <div className="detail-content">
                                                <span className="detail-label">Total Orders</span>
                                                <span className="detail-value">{validOrders.length}</span>
                                            </div>
                                        </div>
                                        <div className="profile-detail-item">
                                            <div className="detail-icon">
                                                <IoCardOutline />
                                            </div>
                                            <div className="detail-content">
                                                <span className="detail-label">Total Spent</span>
                                                <span className="detail-value">
                                                    {new Intl.NumberFormat('en-US').format(validOrders.reduce((sum, o) => sum + (o.finalPrice || 0), 0))} LKR
                                                </span>
                                            </div>
                                        </div>
                                        {cancelledOrders.length > 0 && (
                                            <div className="profile-detail-item" style={{ gridColumn: "1 / -1", borderTop: "1px dashed var(--border-color)", paddingTop: "1rem" }}>
                                                <div className="detail-icon" style={{ color: "var(--danger-color)", backgroundColor: "var(--danger-color-light, #ffebee)" }}>
                                                    <IoBagCheckOutline />
                                                </div>
                                                <div className="detail-content">
                                                    <span className="detail-label" style={{ color: "var(--danger-color)" }}>Cancelled Orders ({cancelledOrders.length})</span>
                                                    <span className="detail-value" style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "normal", marginTop: "4px" }}>
                                                        Money will return to your account within 24 hours.
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                <Card className="profile-card">
                                    <div className="profile-card-header">
                                        <h3 className="profile-card-title">Security</h3>
                                    </div>
                                    <div className="profile-details-grid">
                                        <div className="profile-detail-item">
                                            <div className="detail-content" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                <div>
                                                    <span className="detail-label">Password</span>
                                                    <span className="detail-value">********</span>
                                                </div>
                                                <Button variant="outline-danger" size="sm" onClick={() => setShowPasswordModal(true)}>
                                                    Change Password
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <Card className="profile-card error-card">
                                <p>Could not load user details. Please try again later.</p>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>

            {/* Edit Profile Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleEditSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" name="name" value={editData.name || ''} onChange={handleEditChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" name="email" value={editData.email || ''} onChange={handleEditChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="text" name="phone" value={editData.phone || ''} onChange={handleEditChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Shipping Address</Form.Label>
                            <Form.Control as="textarea" rows={3} name="address" value={editData.address || ''} onChange={handleEditChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control type="text" name="country" value={editData.country || ''} onChange={handleEditChange} required />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={isSaving}>
                            {isSaving ? <Spinner size="sm" animation="border" /> : 'Save Changes'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Change Password Modal */}
            <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handlePasswordSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Old Password</Form.Label>
                            <Form.Control type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={isChangingPassword}>
                            {isChangingPassword ? <Spinner size="sm" animation="border" /> : 'Change Password'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}

export default Profile;