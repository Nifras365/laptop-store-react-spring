import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Nav } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { IoPersonOutline, IoLocationOutline, IoCallOutline, IoMailOutline } from "react-icons/io5";
import NavbarLogged from "../components/LoggedNavbar/NavbarLogged";
import apiClient from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { PageHeader, LoadingState, ErrorBanner } from "../components/ui";
import './css/Profile.css';

const Profile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userID, logout } = useAuth();

    useEffect(() => {
        if (!userID) {
            setLoading(false);
            return;
        }

        async function getUserDetails() {
            try {
                const response = await apiClient.get(`/users/userdetails/${userID}`);
                setUserDetails(response.data.data[0]);
            } catch (error) {
                setError("Failed to load profile. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        getUserDetails();
    }, [userID]);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
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
                                        <Button variant="outline-primary" size="sm" className="edit-btn">
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
                                        <Button variant="outline-primary" size="sm" className="edit-btn">
                                            Edit Address
                                        </Button>
                                    </div>
                                    
                                    <div className="address-content">
                                        <p className="address-text">{userDetails.address}</p>
                                        <p className="address-country">{userDetails.country}</p>
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
        </div>
    );
}

export default Profile;