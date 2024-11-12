import React, { useState, useEffect } from 'react';
import { Truck, Calendar, CreditCard, Wallet } from 'lucide-react'; 

const AnuncioRotativo = () => {
  const anuncios = [
    { texto: "Envío gratis en compras desde $90.000", icono: <Truck size={14} /> },
    { texto: "Descubre nuevos productos cada semana", icono: <Calendar size={14} /> },
    { texto: "Hasta 6 cuotas sin interés", icono: <CreditCard size={14} /> },
    { texto: "Descuento especial en transferencias", icono: <Wallet size={14} /> } 
  ];

  const [indiceActual, setIndiceActual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceActual((prevIndice) => (prevIndice + 1) % anuncios.length);
    }, 8000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="anuncio-rotativo">
      <div className="anuncio-contenido">
        {anuncios[indiceActual].icono}
        <span>{anuncios[indiceActual].texto}</span>
      </div>
    </div>
  );
};

export default AnuncioRotativo;
