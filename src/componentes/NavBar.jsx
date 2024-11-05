import React, { useState, useContext } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import CartWidget from "./CartWidget";
import ThemeToggle from "./ThemeToggle";
import { ThemeContext } from "./ThemeContext";
import { getAuth, signOut } from "firebase/auth";

const NavBar = () => {
  const { isDark } = useContext(ThemeContext);
  const [expanded, setExpanded] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleNavClick = () => {
    setExpanded(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
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
        <Navbar.Brand as={Link} to="/" className="titulo" onClick={handleNavClick}>
         NeoVape
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler">
          <AiOutlineMenu size={24} className={`menu-icon ${expanded ? "rotate" : ""}`} />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          {user ? (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/products" onClick={handleNavClick} className="Navlink">
                  Productos
                </Nav.Link>
                <Nav.Link as={Link} to="/category/Recargable" onClick={handleNavClick} className="Navlink">
                  Recargables
                </Nav.Link>
                <Nav.Link as={Link} to="/category/Descartable" onClick={handleNavClick} className="Navlink">
                  Descartables
                </Nav.Link>
              </Nav>
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center" id="seccion">
                <span className="me-3 text-light">{user.email}</span>
                <Button onClick={handleLogout} variant="outline-light" className="me-3">
                  Cerrar Sesión
                </Button>
                </div>
                <ThemeToggle />
                <CartWidget />
              </div>
            </>
          ) : (
            <Nav className="ms-auto">
              <ThemeToggle />
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
