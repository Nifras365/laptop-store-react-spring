import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoPersonCircleOutline, IoCartOutline, IoHeartOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { TbLogout2 } from "react-icons/tb";
import { BsBoxSeam } from "react-icons/bs";
import { Link, useLocation } from 'react-router-dom';
import './NavbarLogged.css';
import apiClient from '../../api/client';
import { useAuth } from '../../auth/AuthContext';

const NavbarLogged = () => {
    const [userName, setUserName] = useState('');
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const { userID, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!userID) return;

        async function fetchUserData() {
            try {
                const [userResponse, cartResponse, wishlistResponse] = await Promise.all([
                    apiClient.get(`/users/id/${userID}`),
                    apiClient.get(`/cart/user/${userID}`).catch(() => ({ data: { data: [] } })),
                    apiClient.get(`/wishlist/user/${userID}`).catch(() => ({ data: { data: [] } }))
                ]);
                
                setUserName(userResponse.data.data);
                setCartCount(cartResponse.data.data?.length || 0);
                setWishlistCount(wishlistResponse.data.data?.length || 0);
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        }
        fetchUserData();
    }, [userID, location.pathname]);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    const isActive = (path) => location.pathname === path;

    const UserMenu = (
        <div className="d-flex align-items-center user-menu-trigger">
            <IoPersonCircleOutline size={24} />
            <span className="user-name">{userName || 'Account'}</span>
        </div>
    );

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

                    <div className="d-flex align-items-center navbar-actions">
                        {/*wishlist button*/}
                        <Link to="/wishlist" className="cart-button">
                            <IoHeartOutline size={24} />
                            {wishlistCount > 0 && (
                                <span className="cart-badge">{wishlistCount > 9 ? '9+' : wishlistCount}</span>
                            )}
                        </Link>

                        {/*cart button*/}
                        <Link to="/cart" className="cart-button" style={{ marginLeft: '10px' }}>
                            <IoCartOutline size={24} />
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>
                            )}
                        </Link>

                        {/*User Dropdown*/}
                        <Nav>
                            <NavDropdown
                                className='user-dropdown'
                                title={UserMenu}
                                id="user-nav-dropdown"
                                align="end"
                            >
                                <NavDropdown.Header className="dropdown-header">
                                    <span className="signed-in-text">Signed in as</span>
                                    <strong className="user-email">{userName || '...'}</strong>
                                </NavDropdown.Header>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/profile" className="dropdown-item-custom">
                                    <CgProfile className="dropdown-icon" />
                                    <span>My Profile</span>
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/orders" className="dropdown-item-custom">
                                    <BsBoxSeam className="dropdown-icon" />
                                    <span>My Orders</span>
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/cart" className="dropdown-item-custom">
                                    <IoCartOutline className="dropdown-icon" />
                                    <span>My Cart</span>
                                    {cartCount > 0 && <span className="item-badge">{cartCount}</span>}
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/wishlist" className="dropdown-item-custom">
                                    <IoHeartOutline className="dropdown-icon" />
                                    <span>My Wishlist</span>
                                    {wishlistCount > 0 && <span className="item-badge">{wishlistCount}</span>}
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout} className="dropdown-item-custom logout-item">
                                    <TbLogout2 className="dropdown-icon" />
                                    <span>Logout</span>
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarLogged;