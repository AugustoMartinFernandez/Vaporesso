//  ESTE CODIGO ES PARA VER LAS CARACTERISTICAS DE LOS PRODUCTOS
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Shield, Truck, Package, Award, ThumbsUp, Star } from "lucide-react";
import { useCart } from "./CartContext";
import { toast } from "react-hot-toast";

const ItemDetailContainer = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { itemId } = useParams();
  const { addToCart, isInCart, cartItems, reservedItems } = useCart();

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "products", itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setItem({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Producto no encontrado");
        }
      } catch (err) {
        console.error("Error fetching item:", err);
        setError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const formatCurrency = (value) => {
    return `$ ${value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= getAvailableStock()) {
      setSelectedQuantity(value);
    }
  };

  const getAvailableStock = () => {
    if (!item) return 0;

    const cartItem = cartItems.find((i) => i.id === item.id);
    const cartQuantity = cartItem ? cartItem.quantity : 0;
    return item.stock - cartQuantity;
  };

  const isReserved = () => {
    return reservedItems.has(itemId);
  };

  const handleAddToCart = () => {
    if (isReserved()) {
      toast.error("Este producto está reservado temporalmente");
      return;
    }

    const availableStock = getAvailableStock();
    if (selectedQuantity > availableStock) {
      toast.error(`Solo hay ${availableStock} unidades disponibles`);
      return;
    }

    addToCart(
      {
        id: item.id,
        title: item.title,
        price: item.price,
        pictureUrl: item.picturUrl,
        stock: item.stock,
      },
      selectedQuantity
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // navegación al checkout
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!item) return <div>Producto no encontrado</div>;

  const availableStock = getAvailableStock();

  return (
    <div className="item-detail-container">
      <div className="item-detail">
        <div className="item-detail-image">
          <div className="image-container">
            <img src={item.picturUrl} alt={item.title} />
            {availableStock < 5 && (
              <span className="stock-badge">
                ¡Últimas {availableStock} unidades!
              </span>
            )}
          </div>
          <div className="item-guarantees mt-4">
            <div className="guarantee-item">
              <Award className="text-purple-600" size={20} />
              <span>Garantía </span>
            </div>
            <div className="guarantee-item">
              <Shield className="text-purple-600" size={20} />
              <span>Compra Protegida </span>
            </div>
            <div className="guarantee-item">
              <Truck className="text-purple-600" size={20} />
              <span>Envío Gratis </span>
            </div>
          </div>
        </div>

        <div className="item-detail-info">
          <div className="seller-info">
            <ThumbsUp className="text-purple-600" size={16} />
            <span>Vendedor con excelente reputación</span>
          </div>

          <h2>{item.title}</h2>
          <div className="rating">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className="text-yellow-400 inline"
                size={16}
                fill="#facc15"
              />
            ))}
            <span className="ml-2 text-gray-400"> 250 valoraciones </span>
          </div>

          <div className="price-container">
            <p className="previous-price">{formatCurrency(item.price * 1.2)}</p>
            <div className="current-price">
              <span className="price">{formatCurrency(item.price)}</span>
              <span className="discount">20% OFF</span>
            </div>
            <p className="installments">
              en 12x {formatCurrency(item.price / 12)} sin interés
            </p>
          </div>

          <div className="product-features">
            <h3>Características principales</h3>
            <div className="features-list">
              <div className="feature-item">
                <Package className="text-purple-600" size={20} />
                <span>
                  {isReserved()
                    ? "Producto reservado temporalmente"
                    : `Nuevo - ${availableStock} unidades disponibles`}
                </span>
              </div>
              {item.features?.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="purchase-section">
            <div className="quantity-selector">
              <label htmlFor="quantity" className="quantity">
                Cantidad:
              </label>
              <select
                id="quantity"
                value={selectedQuantity}
                onChange={handleQuantityChange}
                className="quantity-select"
                disabled={availableStock === 0 || isReserved()}
              >
                {[...Array(availableStock)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span className="available-stock">
                ({availableStock} disponibles)
              </span>
            </div>
            <button
              className="item-cart-button"
              disabled={availableStock === 0 || isReserved()}
              onClick={handleAddToCart}
            >
              {availableStock === 0
                ? "Sin Stock"
                : isReserved()
                ? "Producto Reservado"
                : isInCart(item.id)
                ? "Agregar más al carrito"
                : "Agregar al carrito"}
            </button>
          </div>

          <div className="description-section">
            <h3 className="h3-description">Descripción</h3>
            <p className="description">{item.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailContainer;

