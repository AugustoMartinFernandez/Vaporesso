import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [reservedItems, setReservedItems] = useState(new Map());

  // Actualizar localStorage cuando cambia el carrito
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    calculateTotals();
  }, [cartItems]);

  // Calcular totales
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

  // Reservar item por 30 minutos
  const reserveItem = (itemId, quantity) => {
    const expirationTime = new Date().getTime() + 30 * 60 * 1000; // 30 minutos
    setReservedItems(prev => new Map(prev).set(itemId, {
      quantity,
      expirationTime
    }));

    // Programar la liberación del item
    setTimeout(() => {
      removeReservation(itemId);
    }, 30 * 60 * 1000);
  };

  // Remover reservación
  const removeReservation = (itemId) => {
    setReservedItems(prev => {
      const newMap = new Map(prev);
      newMap.delete(itemId);
      return newMap;
    });
    toast.error('El tiempo de reserva ha expirado', {
      icon: '⏰'
    });
  };

  // Agregar al carrito
  const addToCart = (product, quantity = 1) => {
    if (reservedItems.has(product.id)) {
      toast.error('Este producto está reservado');
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        if (existingItem.quantity + quantity > product.stock) {
          toast.error('Stock no disponible');
          return prevItems;
        }
        
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      reserveItem(product.id, quantity);
      return [...prevItems, { ...product, quantity }];
    });

    toast.success('Producto agregado al carrito');
  };

  // Remover del carrito
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast.success('Producto eliminado del carrito');
  };

  // Actualizar cantidad
  const updateQuantity = (productId, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, Math.min(quantity, item.stock)) }
          : item
      )
    );
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
    setReservedItems(new Map());
    toast.success('Carrito vaciado');
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
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
        reservedItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};