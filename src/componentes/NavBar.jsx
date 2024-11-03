// NavBar.jsx
import React, { useState, useContext } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import CartWidget from "./CartWidget";
import ThemeToggle from "./ThemeToggle";
import { ThemeContext } from "./ThemeContext";
import { getAuth } from "firebase/auth";

const NavBar = () => {
  const { isDark } = useContext(ThemeContext);
  const [expanded, setExpanded] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleNavClick = () => {
    setExpanded(false);
    if (!user) {
      navigate('/login');
    }
  };

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      className={`NavBar ${isDark ? "" : "light-theme"} ${expanded ? "open" : ""}`}
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
          />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          {user ? (
            // Mostrar navegación solo si el usuario está autenticado
            <>
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
              <div className="d-flex align-items-center">
                {/* <span className="me-3 text-light">
                  {user.email}
                </span>
                <button 
                  onClick={() => auth.signOut()} 
                  className="btn btn-outline-light me-3"
                >
                  Salir
                </button> */}
                <ThemeToggle />
                <CartWidget />
              </div>
            </>
          ) : (
            // Si no hay usuario, solo mostrar el toggle de tema
            <div className="ms-auto">
              <ThemeToggle />
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
