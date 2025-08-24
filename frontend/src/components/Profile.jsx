import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Nav } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa"; 
import NavbarLogged from "../components/LoggedNavbar/NavbarLogged"; 
import './css/Profile.css';

const ProfileSkeleton = () => (
    <div className="profile-content-card skeleton">
        <div className="profile-header">
            <div className="profile-avatar skeleton-avatar"></div>
            <div>
                <div className="skeleton-line title"></div>
                <div className="skeleton-line subtitle"></div>
            </div>
        </div>
        <hr />
        <div className="user-details-list">
            <div className="skeleton-line detail"></div>
            <div className="skeleton-line detail"></div>
            <div className="skeleton-line detail"></div>
        </div>
    </div>
);

const Profile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const userID = localStorage.getItem('userID');
        if (!userID) {
            setLoading(false);
            return;
        }

        async function getUserDetails() {
            try {
                const response = await axios.get(`http://localhost:8080/users/userdetails/${userID}`);
                setUserDetails(response.data.data[0]);
            } catch (error) {
                console.error("Error fetching details", error);
            } finally {
                setLoading(false);
            }
        }
        getUserDetails();
    }, []);

    const LogOutUser = () => {
        ['token', 'userID', 'userRole'].forEach(Item => localStorage.removeItem(Item));
        window.location.href = '/'; 
    };

    return (
        <div className="profile-page-wrapper">
            <NavbarLogged />
            <Container className="py-5">
                <Row>
                    <Col md={4} lg={3}>
                        <Card className="profile-sidebar">
                            <Nav className="flex-column">
                                <Nav.Link active href="/profile">My Profile</Nav.Link>
                                <Nav.Link href="/orders">My Orders</Nav.Link>
                                <Nav.Link href="/cart">Cart</Nav.Link>
                                <Nav.Link onClick={LogOutUser} className="text-danger">Logout</Nav.Link>
                            </Nav>
                        </Card>
                    </Col>

                    <Col md={8} lg={9}>
                        {loading ? (
                            <ProfileSkeleton />
                        ) : userDetails ? (
                            <Card className="profile-content-card">
                                <div className="profile-header">
                                    <FaUserCircle className="profile-avatar" />
                                    <div>
                                        <h2 className="profile-name">{userDetails.name}</h2>
                                        <p className="profile-email">{userDetails.email}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="details-title">Personal Information</h4>
                                    <Button variant="outline-primary">Edit Profile</Button>
                                </div>
                                <div className="user-details-list">
                                    <div className="detail-item">
                                        <span className="detail-label">Full Name</span>
                                        <span className="detail-value">{userDetails.name}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Country</span>
                                        <span className="detail-value">{userDetails.country}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Address</span>
                                        <span className="detail-value">{userDetails.address}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Phone</span>
                                        <span className="detail-value">{userDetails.phone}</span>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <p>Could not load user details.</p>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Profile;