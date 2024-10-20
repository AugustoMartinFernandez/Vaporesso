import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import CartWidget from "./CartWidget";

const NavBar = () => {
  return (
    <Navbar expand="lg" className="NavBar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="titulo">
          Vapeo 3.5{" "}
          <img width="35" height="35" src="/images/vapear.png" alt="iqos" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/products" className="Navlink">
              Productos
            </Nav.Link>
            <Nav.Link as={Link} to="/category/1" className="Navlink">
              Recargables
            </Nav.Link>
            <Nav.Link as={Link} to="/category/2" className="Navlink">
              Descartables
            </Nav.Link>
            <Nav.Link as={Link} to="/category/3" className="Navlink">
              Puff
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <CartWidget />
      </Container>
    </Navbar>
  );
};

export default NavBar;
