import React, { useState, useEffect } from "react";
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

const DeveloperAd = () => {
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    // Verificar si el anuncio ya se mostró anteriormente
    const adShown = sessionStorage.getItem("adShown");

    if (!adShown) {
      // Si no se ha mostrado, programar para mostrarlo en 10 segundos
      const timer = setTimeout(() => {
        setShowAd(true);
        // Marcar el anuncio como mostrado en esta sesión
        sessionStorage.setItem("adShown", "true");
      }, 10000); // 10 segundos

      return () => clearTimeout(timer);
    }
  }, []);

  if (!showAd) return null;

  return (
    <div className="developer-ad">
      <button className="close-button" onClick={() => setShowAd(false)}>
        <AiOutlineClose size={20} />
      </button>
      <div className="ad-content">
        <h3>
          NeoVape fue creada por
          <span className="highlighted-name"> Martin Fernandez</span>
        </h3>
        <p>FrontEnd Developer React</p>
        <img
          src="/images/Martin Fernandez.jpg"
          alt="Martin Fernandez"
          className="developer-photo"
        />
        <p className="follow-text">Sígueme en mis redes sociales</p>
        <div className="social-linkss">
          <a
            href="https://www.instagram.com/tinchoo_dev/profilecard/?igsh=ZXV4eGl3amgyYWE0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={30} />
          </a>
          <a
            href="https://www.linkedin.com/in/tinchodev?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin size={30} />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=100058211406066&mibextid=ZbWKwL"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={30} />
          </a>
          <a
            href="https://www.threads.net/@tinchoo_dev?invite=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter size={30} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DeveloperAd;
