import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoPersonOutline } from "react-icons/io5";
import { Link, useLocation } from 'react-router-dom';
import './css/NavbarBL.css';

const NavbarBL = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <Navbar variant="light" expand="lg" className="site-navbar" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
                    <span className="brand-icon">💻</span>
                    <span className="brand-text">LaptopStore</span>
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="main-navbar" />
                
                <Navbar.Collapse id="main-navbar">
                    <Nav className="mx-auto main-nav">
                        <Nav.Link 
                            as={Link} 
                            to="/" 
                            className={`nav-link-custom ${isActive('/') ? 'active' : ''}`}
                        >
                            Home
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/" 
                            className="nav-link-custom"
                        >
                            Laptops
                        </Nav.Link>
                    </Nav>

                    <div className="d-flex align-items-center navbar-actions gap-2">
                        <Button 
                            as={Link} 
                            to="/login" 
                            variant="outline-primary" 
                            className="auth-btn login-btn"
                        >
                            <IoPersonOutline size={18} />
                            <span>Login</span>
                        </Button>
                        <Button 
                            as={Link} 
                            to="/register" 
                            variant="primary" 
                            className="auth-btn register-btn"
                        >
                            Sign Up
                        </Button>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarBL;