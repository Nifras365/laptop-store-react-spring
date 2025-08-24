import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, InputGroup, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoPersonOutline, IoSearch } from "react-icons/io5";
import './css/NavbarBL.css';

const NavbarBL = () => {
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
                title={<IoPersonOutline size={25} />} 
                id="basic-nav-dropdown"
                align="end" 
              >
                <NavDropdown.Item href="/login">Login</NavDropdown.Item>
                <NavDropdown.Item href="/register">Register</NavDropdown.Item>
                <NavDropdown.Item href="/cart">My Cart</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Contact Us</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </div>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarBL;