import React from "react";
import { FaShoppingCart } from "react-icons/fa";

const CartWidget = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", color: "black" }}>
      <FaShoppingCart size={24} />
      <span style={{ marginLeft: "5px" }}>3</span>
    </div>
  );
};

export default CartWidget;
