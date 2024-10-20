import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

const Footer = () => {
  const { isDark } = useContext(ThemeContext);

  return (
    <footer className={`footer ${isDark ? "" : "light-theme"}`}>
      <div className="footer-content">
        <p>
          &copy; <strong className="strong">2024 By TinchoDev</strong> Todos los
          derechos reservados.
        </p>
        <div className="social-links">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
