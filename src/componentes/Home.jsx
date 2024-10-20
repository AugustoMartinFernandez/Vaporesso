const Home = () => {
  return (
    <main>
      <section className="gif-grid">
        <div className="gif-container">
          <img
            src="/images/vaper vs cigarrillo .webp"
            alt="Comparación entre vapeador y cigarrillo"
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
              <strong>Menos sustancias tóxicas:</strong> A diferencia de los
              cigarrillos, que contienen más de 7,000 productos químicos
              nocivos, los vapeadores suelen tener una fórmula más simple con
              menos ingredientes dañinos.
            </li>
            <li>
              <strong>Herramienta para dejar de fumar:</strong> Muchas personas
              utilizan los vapeadores como una manera de disminuir su consumo de
              nicotina y dejar de fumar gradualmente.
            </li>
          </ul>
        </div>
      </section>

      <article>
        <section className="history-section">
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

        <section className="tips-section">
          <h2>Consejos para Nuevos Vapers</h2>
          <ol>
            <li>Comienza con un dispositivo sencillo.</li>
            <li>Experimenta con diferentes sabores.</li>
            <li>Mantén tu equipo limpio.</li>
          </ol>
        </section>

        <section className="stats-section">
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
