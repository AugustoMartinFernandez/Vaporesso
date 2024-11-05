import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getAuth } from 'firebase/auth';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const auth = getAuth();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const { items, timestamp } = JSON.parse(savedCart);
      const thirtyMinutesInMs = 30 * 60 * 1000;
      if (Date.now() - timestamp < thirtyMinutesInMs) {
        return items;
      }
    }
    return [];
  });
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [reservedItems, setReservedItems] = useState(new Map());

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        const cartWithTimestamp = { items: cartItems, timestamp: Date.now() };
        localStorage.setItem("cart", JSON.stringify(cartWithTimestamp));
        setCartItems([]);
        setReservedItems(new Map());
      }
    });
    return () => unsubscribe();
  }, [auth, cartItems]);

  useEffect(() => {
    if (auth.currentUser) {
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
    localStorage.removeItem("cart");
    toast.success("Carrito vaciado");
  };

  const isInCart = (productId) => {
    return cartItems.some((item) => item.id === productId);
  };

  const loadSavedCart = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const { items, timestamp } = JSON.parse(savedCart);
        const thirtyMinutesInMs = 30 * 60 * 1000;
        if (Date.now() - timestamp < thirtyMinutesInMs) {
          setCartItems(items);
          toast.success("Carrito restaurado");
        } else {
          localStorage.removeItem("cart");
          toast.error("El carrito ha expirado");
        }
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
        localStorage.removeItem("cart");
      }
    }
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
        loadSavedCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };