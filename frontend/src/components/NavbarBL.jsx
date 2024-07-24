import React from 'react';
import { Navbar, Nav, NavDropdown, Container, NavbarBrand,Form, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoPersonOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import './NavbarBL.css'

const NavbarBL = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <NavbarBrand href="#home">MyLapStore</NavbarBrand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
          </Nav>
          <Form className="d-flex mx-auto">
            <FormControl
              type="search"
              placeholder="Search"
              className="form-navbar"
              aria-label="Search"
            />
            <IoSearch size={40}/>
          </Form>
          <Nav className="ms-auto">
            <NavDropdown className='dropdown-title' title={<IoPersonOutline size={25}/>} id="basic-nav-dropdown">
              <NavDropdown.Item href="/login">Login</NavDropdown.Item>
              <NavDropdown.Item href="/register">Register</NavDropdown.Item>
              <NavDropdown.Item href="/cart">Cart</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Contact Us</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarBL;
