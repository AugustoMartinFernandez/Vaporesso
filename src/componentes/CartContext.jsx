import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartCache, setCartCache] = useState(new Map());

  const saveCartToLocalStorage = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
  };

  // Función para obtener productos del caché o desde Firebase
  const getProductFromCache = async (productId) => {
    if (cartCache.has(productId)) {
      return cartCache.get(productId);
    }
    try {
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const productData = docSnap.data();
        setCartCache((prev) => new Map(prev).set(productId, productData));
        return productData;
      }
      return null;
    } catch (error) {
      console.error("Error al obtener producto:", error);
      return null;
    }
  };

  // Cargar carrito desde almacenamiento local y verificar stock
  const loadSavedCart = async () => {
    setLoading(true);
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const items = JSON.parse(savedCart);
        const updatedItems = await Promise.all(
          items.map(async (item) => {
            const cachedProduct = await getProductFromCache(item.id);
            if (cachedProduct) {
              return {
                ...item,
                quantity: Math.min(item.quantity, cachedProduct.stock),
                stock: cachedProduct.stock,
              };
            }
            return null;
          })
        );
        const validItems = updatedItems.filter((item) => item !== null);
        setCartItems(validItems);
        saveCartToLocalStorage(validItems);
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

  useEffect(() => {
    return () => setCartCache(new Map());
  }, []);

  const addToCart = async (product, quantity) => {
    setOperationLoading(true);
    try {
      const cachedProduct = await getProductFromCache(product.id);
      if (cachedProduct) {
        const currentStock = cachedProduct.stock;
        const existingItem = cartItems.find((item) => item.id === product.id);
        const currentQuantity = existingItem ? existingItem.quantity : 0;

        if (currentQuantity + quantity > currentStock) {
          toast.error(`Solo hay ${currentStock} unidades disponibles`);
          return;
        }

        const newItems = existingItem
          ? cartItems.map((item) =>
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
    } finally {
      setOperationLoading(false);
    }
  };

  const removeFromCart = (productId) => {
    const newItems = cartItems.filter((item) => item.id !== productId);
    setCartItems(newItems);
    saveCartToLocalStorage(newItems);
    toast.success("Producto eliminado del carrito");
  };

  const updateQuantity = async (productId, newQuantity) => {
    const cachedProduct = await getProductFromCache(productId);
    if (cachedProduct && newQuantity <= cachedProduct.stock) {
      const newItems = cartItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(newItems);
      saveCartToLocalStorage(newItems);
    } else {
      toast.error(`Cantidad inválida. Stock disponible: ${cachedProduct?.stock}`);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    toast.success("Carrito vaciado");
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const isInCart = (productId) => {
    return cartItems.some((item) => item.id === productId);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    itemCount,
    loading,
    operationLoading,
    error,
    isInCart,
    setCartItems,
    setLoading,
    setOperationLoading,
    setError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartContext };

