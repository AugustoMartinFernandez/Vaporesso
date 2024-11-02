import React, { useState, useContext } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai"; // Icono moderno
import CartWidget from "./CartWidget";
import ThemeToggle from "./ThemeToggle";
import { ThemeContext } from "./ThemeContext";

const NavBar = () => {
  const { isDark } = useContext(ThemeContext);
  const [expanded, setExpanded] = useState(false); // Estado para controlar la apertura

  // Función para cerrar el Navbar
  const handleNavClick = () => setExpanded(false);

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)} // Cambia el estado al abrir/cerrar
      className={`NavBar ${isDark ? "" : "light-theme"} ${
        expanded ? "open" : ""
      }`} 
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="titulo"
          onClick={handleNavClick}
        >
          Vapeo 3.5{" "}
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="custom-toggler"
        >
          <AiOutlineMenu
            size={24}
            className={`menu-icon ${expanded ? "rotate" : ""}`}
          />{" "}
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/products"
              onClick={handleNavClick}
              className="Navlink"
            >
              Productos
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/category/Recargable"
              onClick={handleNavClick}
              className="Navlink"
            >
              Recargables
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/category/Descartable"
              onClick={handleNavClick}
              className="Navlink"
            >
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
