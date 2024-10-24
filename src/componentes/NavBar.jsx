// NavBar.jsx
import React, { useContext } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import CartWidget from "./CartWidget";
import ThemeToggle from "./ThemeToggle";
import { ThemeContext } from "./ThemeContext";

const NavBar = () => {
  const { isDark } = useContext(ThemeContext);

  return (
    <Navbar expand="lg" className={`NavBar ${isDark ? "" : "light-theme"}`}>
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
            <Nav.Link as={Link} to="/category/Recargable" className="Navlink">
              Recargables
            </Nav.Link>
            <Nav.Link as={Link} to="/category/Descartable" className="Navlink">
              Descartables
            </Nav.Link>
          </Nav>
          <ThemeToggle />
          <CartWidget />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;


