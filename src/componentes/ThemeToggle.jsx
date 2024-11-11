import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle-btn ${isDark ? "dark" : "light"}`}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
    >
      {isDark ? <BsSun size={24} /> : <BsMoon size={24} />}
    </button>
  );
};

export default ThemeToggle;

// CODIGO NO ACTUALIZADO
