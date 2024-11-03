// CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getAuth } from "firebase/auth";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const auth = getAuth();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [reservedItems, setReservedItems] = useState(new Map());

  // Limpiar carrito cuando el usuario cierra sesión
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setCartItems([]);
        setReservedItems(new Map());
        localStorage.removeItem("cart");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Actualizar localStorage cuando cambia el carrito
  useEffect(() => {
    if (auth.currentUser) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
      calculateTotals();
    }
  }, [cartItems, auth.currentUser]);

  const calculateTotals = () => {
    const { total, count } = cartItems.reduce(
      (acc, item) => ({
        total: acc.total + item.price * item.quantity,
        count: acc.count + item.quantity,
      }),
      { total: 0, count: 0 }
    );
    setCartTotal(total);
    setItemCount(count);
  };

  const checkAuth = () => {
    if (!auth.currentUser) {
      toast.error("Debes iniciar sesión primero");
      return false;
    }
    return true;
  };

  const reserveItem = (itemId, quantity) => {
    if (!checkAuth()) return;

    const expirationTime = new Date().getTime() + 30 * 60 * 1000;
    setReservedItems((prev) =>
      new Map(prev).set(itemId, {
        quantity,
        expirationTime,
      })
    );

    setTimeout(() => {
      removeReservation(itemId);
    }, 30 * 60 * 1000);
  };

  const removeReservation = (itemId) => {
    if (!checkAuth()) return;

    setReservedItems((prev) => {
      const newMap = new Map(prev);
      newMap.delete(itemId);
      return newMap;
    });
    toast.error("El tiempo de reserva ha expirado", {
      icon: "⏰",
    });
  };

  const addToCart = (product, quantity = 1) => {
    if (!checkAuth()) return;

    if (reservedItems.has(product.id)) {
      toast.error("Este producto está reservado");
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity + quantity > product.stock) {
          toast.error("Stock no disponible");
          return prevItems;
        }

        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      reserveItem(product.id, quantity);
      return [...prevItems, { ...product, quantity }];
    });

    toast.success("Producto agregado al carrito");
  };

  const removeFromCart = (productId) => {
    if (!checkAuth()) return;

    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
    toast.success("Producto eliminado del carrito");
  };

  const updateQuantity = (productId, quantity) => {
    if (!checkAuth()) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, Math.min(quantity, item.stock)) }
          : item
      )
    );
  };

  const clearCart = () => {
    if (!checkAuth()) return;

    setCartItems([]);
    setReservedItems(new Map());
    toast.success("Carrito vaciado");
  };

  const isInCart = (productId) => {
    return cartItems.some((item) => item.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        reservedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
