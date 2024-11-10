import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa"; // Importa el ícono del carrito
import { useCart } from "./CartContext"; // Importa el contexto del carrito
import CartDrawer from "./CartDrawer"; // Importa el componente del drawer

const CartWidget = () => {
  // Obtiene el contador de items del contexto del carrito
  const { itemCount } = useCart();
  // Estado local para controlar la visibilidad del drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <button
        className="btn btn-link position-relative p-2"
        onClick={() => setIsDrawerOpen(true)}
      >
        <FaShoppingCart size={24} />
        {itemCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {itemCount}
            <span className="visually-hidden">productos en el carrito</span>
          </span>
        )}
      </button>
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};

export default CartWidget;

// CODIGO NO ACTUALIZADO
