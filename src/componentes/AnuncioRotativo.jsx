import React, { useState, useEffect } from "react";
import { Truck, Calendar, CreditCard, Wallet } from "lucide-react";

const AnuncioRotativo = () => {
  const [indiceActual, setIndiceActual] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const anuncios = [
    {
      texto: "Envío gratis en compras desde $50.000 ARS",
      icono: <Truck size={14} />,
    },
    {
      texto: "Descubre nuevos productos cada semana",
      icono: <Calendar size={14} />,
    },
    { texto: "Hasta 6 cuotas sin interés", icono: <CreditCard size={14} /> },
    {
      texto: "Descuento especial en transferencias",
      icono: <Wallet size={14} />,
    },
  ];

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndiceActual((prevIndice) => (prevIndice + 1) % anuncios.length);
        setIsVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="anuncio-rotativo">
      <div className={`anuncio-contenido ${isVisible ? "visible" : "hidden"}`}>
        {anuncios[indiceActual].icono}
        <span>{anuncios[indiceActual].texto}</span>
      </div>
    </div>
  );
};

export default AnuncioRotativo;


// No actualizado