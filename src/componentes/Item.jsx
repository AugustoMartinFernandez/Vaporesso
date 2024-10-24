import React from "react";
import { Link } from "react-router-dom";

const Item = ({ item }) => {
  if (!item) return null;

  const isLowStock = item.stock < 5;

  return (
    <div className="item-card">
      <Link to={`/item/${item.id}`} className="item-link">
        {item.picturUrl && (
          <img
            src={item.picturUrl}
            alt={item.title}
            className="item-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-image.jpg";
            }}
          />
        )}
      </Link>
      <h2 className="item-title">{item.title}</h2>
      <p className="item-description">{item.description}</p>
      <div
        className="stock-info"
        style={{
          color: isLowStock ? "#ff4444" : "#00ff00",
          marginBottom: "10px",
          fontSize: "0.9em",
        }}
      >
        {isLowStock ? (
          <span>¡Últimas {item.stock} unidades!</span>
        ) : (
          <span>Stock disponible: {item.stock}</span>
        )}
      </div>
      <div className="item-footer">
        <span className="item-price">
          ${typeof item.price === "number" ? item.price.toLocaleString() : 0}
        </span>
        <button
          className="item-buy-button"
          disabled={item.stock === 0}
          onClick={() => console.log("Buy clicked")}
        >
          {item.stock === 0 ? "Sin Stock" : "Comprar"}
        </button>
      </div>
    </div>
  );
};

export default Item;
