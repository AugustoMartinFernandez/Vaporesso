import React, { useState, useEffect } from "react";

const FlashSale = ({ endDate, products }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const remainingTime = calculateTimeLeft();
      setTimeLeft(remainingTime);

      // Verificar si la oferta ha expirado
      if (Object.keys(remainingTime).length === 0) {
        setIsExpired(true);
        clearInterval(timer);
      }
    }, 1000);

    // Verificar inmediatamente si ya está expirado
    if (Object.keys(timeLeft).length === 0) {
      setIsExpired(true);
    }

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const difference = +new Date(endDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  // Si la oferta ha expirado, no renderizar nada
  if (isExpired) {
    return null;
  }

  return (
    <div className="flash-sale">
      <h2 className="flash-sale-title">¡Ofertas Flash!</h2>
      <div className="countdown-timer">
        <span className="timer-item">{timeLeft.days}d</span>
        <span className="timer-item">{timeLeft.hours}h</span>
        <span className="timer-item">{timeLeft.minutes}m</span>
        <span className="timer-item">{timeLeft.seconds}s</span>
      </div>
      <h3 className="flash-sale-subtitle">Productos en oferta:</h3>
      <div className="flash-sale-products">
        {products.map((product) => (
          <div key={product.id} className="flash-sale-product">
            <img
              src={product.picturUrl}
              alt={product.title}
              className="product-image"
            />
            <h4 className="product-title">{product.title}</h4>
            <p className="product-price">${product.price}</p>
            <button className="item-buy-button">Comprar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashSale;
