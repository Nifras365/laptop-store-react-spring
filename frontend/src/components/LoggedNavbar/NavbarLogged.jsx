import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, InputGroup, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoPersonCircleOutline, IoSearch } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { TbLogout2 } from "react-icons/tb";
import { BsBoxSeam } from "react-icons/bs";
import './NavbarLogged.css';
import axios from 'axios';


const NavbarLogged = () => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const userID = localStorage.getItem('userID');
        if (!userID) return;

        async function getName() {
            try {
                const response = await axios.get(`http://localhost:8080/users/id/${userID}`);
                setUserName(response.data.data);
            } catch (error) {
                console.error("Error fetching name: ", error);
            }
        }
        getName();
    }, []);

    const LogOutUser = () => {
        ['token', 'userID', 'userRole'].forEach(Item => localStorage.removeItem(Item));
        window.location.href = '/'; 
    };

    const UserMenu = (
        <div className="d-flex align-items-center">
            <IoPersonCircleOutline size={28} className="me-2" />
            <span>{userName || 'Account'}</span>
        </div>
    );

    return (
        <Navbar variant="light" expand="lg" className="custom-navbar shadow-sm" sticky="top">
            <Container>
                <Navbar.Brand href="/" className="navbar-brand-custom">MyLapStore</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link href="/" className="nav-link-custom">Home</Nav.Link>
                        <Nav.Link href="/" className="nav-link-custom">Laptops</Nav.Link>
                        <Nav.Link href="/" className="nav-link-custom">Accessories</Nav.Link>
                    </Nav>

                    <div className="d-flex align-items-center">
                        <Form className="d-flex search-form">
                            <InputGroup>
                                <FormControl
                                    type="search"
                                    placeholder="Search products..."
                                    className="search-input"
                                    aria-label="Search"
                                />
                                <Button variant="outline-secondary" type="submit" className="search-button">
                                    <IoSearch />
                                </Button>
                            </InputGroup>
                        </Form>

                        <Nav>
                            <NavDropdown
                                className='profile-dropdown'
                                title={UserMenu}
                                id="basic-nav-dropdown"
                                align="end"
                            >
                                <NavDropdown.Header>
                                    Signed in as<br />
                                    <strong>{userName || '...'}</strong>
                                </NavDropdown.Header>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="/profile"><CgProfile className="me-2" />My Profile</NavDropdown.Item>
                                <NavDropdown.Item href="/orders"><BsBoxSeam className="me-2" />Orders</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={LogOutUser} className="text-danger">
                                    <TbLogout2 className="me-2" />Logout
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