import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservedItems] = useState(new Set());

  const loadSavedCart = async () => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const { items, timestamp } = JSON.parse(savedCart);
        const thirtyMinutesInMs = 30 * 60 * 1000;
        
        if (Date.now() - timestamp < thirtyMinutesInMs) {
          const updatedItems = await Promise.all(
            items.map(async (item) => {
              try {
                const docRef = doc(db, "products", item.id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                  const currentStock = docSnap.data().stock;
                  if (currentStock < item.quantity) {
                    toast.warning(`Stock actualizado para ${item.title}`);
                  }
                  return {
                    ...item,
                    quantity: Math.min(item.quantity, currentStock),
                    stock: currentStock
                  };
                }
                return null;
              } catch (error) {
                console.error(`Error al verificar stock para ${item.id}:`, error);
                return null;
              }
            })
          );
          
          const validItems = updatedItems.filter(item => item !== null);
          setCartItems(validItems);
          saveCartToLocalStorage(validItems);
        } else {
          localStorage.removeItem("cart");
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      setError("Error al cargar el carrito guardado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedCart();
  }, []);

  const saveCartToLocalStorage = (items) => {
    const cartData = {
      items,
      timestamp: Date.now()
    };
    localStorage.setItem("cart", JSON.stringify(cartData));
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const addToCart = async (product, quantity) => {
    try {
      const docRef = doc(db, "products", product.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentStock = docSnap.data().stock;
        const existingItem = cartItems.find(item => item.id === product.id);
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        
        if (currentQuantity + quantity > currentStock) {
          toast.error(`Solo hay ${currentStock} unidades disponibles`);
          return;
        }

        const newItems = existingItem
          ? cartItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity, stock: currentStock }
                : item
            )
          : [...cartItems, { ...product, quantity, stock: currentStock }];

        setCartItems(newItems);
        saveCartToLocalStorage(newItems);
        toast.success("Producto agregado al carrito");
      } else {
        toast.error("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      toast.error("Error al agregar el producto");
    }
  };

  const removeFromCart = (productId) => {
    const newItems = cartItems.filter(item => item.id !== productId);
    setCartItems(newItems);
    saveCartToLocalStorage(newItems);
    toast.success("Producto eliminado del carrito");
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentStock = docSnap.data().stock;
        
        if (newQuantity > currentStock) {
          toast.error(`Solo hay ${currentStock} unidades disponibles`);
          return;
        }

        const newItems = cartItems.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity, stock: currentStock }
            : item
        );

        setCartItems(newItems);
        saveCartToLocalStorage(newItems);
      }
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      toast.error("Error al actualizar la cantidad");
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    toast.success("Carrito vaciado");
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        isInCart,
        loading,
        error,
        reservedItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };