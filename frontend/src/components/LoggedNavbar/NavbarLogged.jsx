import React from 'react';
import { Navbar, Nav, NavDropdown, Container, NavbarBrand,Form, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoPersonOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import './NavbarLogged.css';
import { useEffect, useState } from 'react';
import axios from 'axios';


const NavbarLogged = () => {

  const [userName, setUserName] = useState();

  useEffect(() => {
    const userID = localStorage.getItem('userID');

    async function getName() {
      try {
        const response = await axios.get(`http://localhost:8080/users/id/${userID}`);
        setUserName(response.data.data);
        console.log("Heres The name: ",response.data.data);
      } catch (error) {
        console.error("Error fetching name: ", error);      }
    }
    getName();
  }, []);

  const LogOutUser = () => {
    ['token', 'userID', 'userRole'].forEach(Item => localStorage.removeItem(Item));
    window.location.reload();
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <NavbarBrand href="#home">MyLapStore </NavbarBrand>
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
          <div className="welcome-message">
            {userName ? `Welcome, ${userName}!` : 'Loading...'}
          </div>
          <Nav className="ms-auto">
            <NavDropdown className='dropdown-title' title={<IoPersonOutline size={25}/>} id="basic-nav-dropdown">
              <NavDropdown.Item href="/profile">My Profile</NavDropdown.Item>
              <NavDropdown.Item href="/orders">Orders</NavDropdown.Item>
              <NavDropdown.Item href="/cart">Cart</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item >Contact Us</NavDropdown.Item>
              <NavDropdown.Item onClick={LogOutUser}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarLogged;
