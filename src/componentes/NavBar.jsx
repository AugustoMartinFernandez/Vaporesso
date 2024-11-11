import React, { useState, useContext } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  const handleNavClick = () => setExpanded(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
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
        <Navbar.Brand
          as={Link}
          to="/"
          className="titulo"
          onClick={handleNavClick}
        >
          <span className="titulo-inicial">N</span>eo
          <span className="titulo-inicial">V</span>ape
        </Navbar.Brand>

        {!isLoginPage && user && <CartWidget />}
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <AiOutlineMenu size={24} color={isDark ? "white" : "black"} />
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          {user && !isLoginPage ? (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/products" onClick={handleNavClick}>
                  Productos
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/category/Recargable"
                  onClick={handleNavClick}
                >
                  Recargables
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/category/Descartable"
                  onClick={handleNavClick}
                >
                  Descartables
                </Nav.Link>
              </Nav>
              <div className="user-section">
                <span className="user-email">{user.email}</span>
                <Button
                  className="cerrar-secion"
                  style={{ backgroundColor: "#8a2be2" }}
                  onClick={handleLogout}
                  variant={isDark ? "outline-light" : "outline-dark"}
                  size="sm"
                >
                  Cerrar Sesión
                </Button>
              </div>
            </>
          ) : null}
        </Navbar.Collapse>
        <Nav className="ms-auto">
          <ThemeToggle />
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;

// CODIGO NO ACTUALIZADO
