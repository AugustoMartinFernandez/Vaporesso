import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";
import { toast } from "react-hot-toast";

const Item = ({ item }) => {
  const [addingToCart, setAddingToCart] = useState(false);
  
  if (!item) return null;
  
  const { addToCart, isInCart, cartItems, operationLoading } = useCart();
  const isLowStock = item.stock < 4;

  const handleAddToCart = async () => {
    const cartItem = cartItems.find((cartItem) => cartItem.id === item.id);
    const currentQuantity = cartItem ? cartItem.quantity : 0;

    if (currentQuantity < item.stock) {
      setAddingToCart(true);
      try {
        await addToCart(item, 1);
      } finally {
        setAddingToCart(false);
      }
    } else {
      toast.error("No hay más stock disponible");
    }
  };

  const itemInCart = cartItems.find((cartItem) => cartItem.id === item.id);
  const cartQuantity = itemInCart ? itemInCart.quantity : 0;

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
        {cartQuantity > 0 && (
          <span className="ms-2 text-primary">({cartQuantity} en carrito)</span>
        )}
      </div>
      <div className="item-footer">
        <span className="item-price">
          ${typeof item.price === "number" ? item.price.toLocaleString() : 0}
        </span>
        <button
          style={{ width: "auto" }}
          className={`item-buy-button ${
            cartQuantity >= item.stock ? "btn-secondary" : "btn-primary"
          }`}
          disabled={
            item.stock === 0 ||
            cartQuantity >= item.stock ||
            addingToCart ||
            operationLoading
          }
          onClick={handleAddToCart}
        >
          {item.stock === 0 ? (
            "Sin Stock"
          ) : cartQuantity >= item.stock ? (
            "Stock máximo"
          ) : addingToCart || operationLoading ? (
            <div className="loading-button-content">
              <div className="spinner-border spinner-border-sm" role="status" />
              <span className="ms-2">Agregando...</span>
            </div>
          ) : (
            <>
              <ShoppingCart size={18} className="me-2" />
              Al carrito
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Item;
