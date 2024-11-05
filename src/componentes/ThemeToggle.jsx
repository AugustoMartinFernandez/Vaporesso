import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle-btn ${isDark ? "dark" : "light"}`}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
};

export default ThemeToggle;

// NO ACTUALIZADO 