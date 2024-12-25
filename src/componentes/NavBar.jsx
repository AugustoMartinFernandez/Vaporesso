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

  // Función para cerrar el menú
  const handleNavLinkClick = () => {
    setExpanded(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirige al inicio después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      className={`NavBar ${isDark ? "" : "light-theme"}`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="titulo" onClick={handleNavLinkClick}>
          <span className="titulo-inicial">N</span>eo
          <span className="titulo-inicial">V</span>ape
        </Navbar.Brand>
        <CartWidget />
        <Navbar.Toggle>
          <AiOutlineMenu size={24} color={isDark ? "white" : "black"} />
        </Navbar.Toggle>
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/products" onClick={handleNavLinkClick}>
              Productos
            </Nav.Link>
            <Nav.Link as={Link} to="/category/Recargable" onClick={handleNavLinkClick}>
              Recargables
            </Nav.Link>
            <Nav.Link as={Link} to="/category/Descartable" onClick={handleNavLinkClick}>
              Descartables
            </Nav.Link>
          </Nav>
          {user && (
            <div className="user-section">
              <span className="user-email">{user.email}</span>
              <Button onClick={handleLogout}>Cerrar Sesión</Button>
            </div>
          )}
        </Navbar.Collapse>
        <ThemeToggle />
      </Container>
    </Navbar>
  );
};

export default NavBar;
