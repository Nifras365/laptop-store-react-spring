// import React from "react";

// const NavbarBL = ()=>{
//     return(
//         <div>
//             <h2>Navbar</h2>
//         </div>
//     )
// }

// export default NavbarBL;


import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import NavbarBrand from 'react-bootstrap/esm/NavbarBrand';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import NavLink from 'react-bootstrap/esm/NavLink';
import NavbarToggle from 'react-bootstrap/esm/NavbarToggle';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu';

const NavbarBL=()=> {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <NavbarBrand href="#home">React-Bootstrap</NavbarBrand>
        <NavbarToggle aria-controls="basic-navbar-nav" />
        <NavbarCollapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink href="#home">Home</NavLink>
            <NavLink href="#link">Link</NavLink>
            <DropdownMenu title="Dropdown" id="basic-nav-dropdown">
              <DropdownItem href="#action/3.1">Action</DropdownItem>
              <DropdownItem href="#action/3.2">
                Another action
              </DropdownItem>
              <DropdownItem href="#action/3.3">Something</DropdownItem>
              <NavDropdown.Divider />
              <DropdownItem href="#action/3.4">
                Separated link
              </DropdownItem>
            </DropdownMenu>
          </Nav>
        </NavbarCollapse>
      </Container>
    </Navbar>
  );
}

export default NavbarBL;