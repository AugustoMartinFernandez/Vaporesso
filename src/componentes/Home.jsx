import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const Home = ({ correoUsuario }) => {
  const navigate = useNavigate();
  const auth = getAuth();

  // Verificar si el usuario está autenticado
  if (!auth.currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <main className="home-container">
      <div className="welcome-section">
        <h3 className="text-center">
          Bienvenido Usuario <strong className="strong-usuario">{correoUsuario}</strong>
        </h3>
      </div>

      <div className="hero-section">
        <div className="hero-content">
          <Link to="/products" className="explore-button">
            Explorar
          </Link>
        </div>
      </div>

      <section className="gif-grid">
        <div className="gif-container">
          <img
            src="https://leakbio.com/wp-content/uploads/2023/10/mike-tyson-vape-brand-1024x683.jpg"
            alt="Comparación entre vapeador y cigarrillo"
            loading="lazy"
          />
        </div>
        <div className="text-container">
          <h2>¿Por qué elegir vapeadores en lugar de cigarrillos?</h2>
          <p>
            Los vapeadores se presentan como una alternativa más segura y
            moderna frente a los cigarrillos tradicionales. A continuación,
            algunos beneficios clave:
          </p>
          <ul>
            <li>
              <strong className="highlight-text">Menos sustancias tóxicas:</strong>{" "}
              A diferencia de los cigarrillos, que contienen más de 7,000
              productos químicos nocivos, los vapeadores suelen tener una
              fórmula más simple con menos ingredientes dañinos.
            </li>
            <li>
              <strong className="highlight-text">Herramienta para dejar de fumar:</strong>{" "}
              Muchas personas utilizan los vapeadores como una manera de
              disminuir su consumo de nicotina y dejar de fumar gradualmente.
            </li>
          </ul>
        </div>
      </section>

      <article className="info-sections">
        <section className="history-section info-card">
          <h2>La Evolución del Vapeo</h2>
          <ul>
            <li>2003: Se introduce el primer e-cigarrillo en el mercado.</li>
            <li>2010: Comienza la popularización global del vapeo.</li>
            <li>
              2020: El vapeo se consolida como una alternativa viable al
              tabaquismo tradicional.
            </li>
          </ul>
        </section>

        <section className="tips-section info-card">
          <h2>Consejos para Nuevos Vapers</h2>
          <ol>
            <li>Comienza con un dispositivo sencillo.</li>
            <li>Experimenta con diferentes sabores.</li>
            <li>Mantén tu equipo limpio.</li>
          </ol>
        </section>

        <section className="stats-section info-card">
          <h2>Datos Interesantes sobre el Vapeo</h2>
          <ul>
            <li>Más de 40 millones de personas han probado el vapeo.</li>
            <li>El 50% de los usuarios son exfumadores.</li>
            <li>Más de 3000 sabores diferentes disponibles.</li>
          </ul>
        </section>
      </article>
    </main>
  );
};

export default Home;
