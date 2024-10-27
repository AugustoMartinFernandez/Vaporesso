import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Shield, Truck, Package, Award, ThumbsUp, Star } from "lucide-react";

const ItemDetailContainer = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { itemId } = useParams();

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

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= item.stock) {
      setSelectedQuantity(value);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!item) return <div>Producto no encontrado</div>;

  return (
    <div className="item-detail-container">
      <div className="item-detail">
        <div className="item-detail-image">
          <div className="image-container">
            <img src={item.picturUrl} alt={item.title} />
            {item.stock < 5 && (
              <span className="stock-badge">¡Últimas unidades!</span>
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
            <p className="previous-price">${(item.price * 1.2).toFixed(2)}</p>
            <div className="current-price">
              <span className="price">${item.price}</span>
              <span className="discount">20% OFF</span>
            </div>
            <p className="installments">
              en 12x ${(item.price / 12).toFixed(2)} sin interés
            </p>
          </div>

          <div className="product-features">
            <h3>Características principales</h3>
            <div className="features-list">
              <div className="feature-item">
                <Package className="text-purple-600" size={20} />
                <span>Nuevo - {item.stock} unidades disponibles</span>
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
              >
                {[...Array(item.stock)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span className="available-stock">
                ({item.stock} disponibles)
              </span>
            </div>

            <button className="item-buy-button" disabled={item.stock === 0}>
              {item.stock === 0 ? "Sin Stock" : "Comprar ahora"}
            </button>
            <button className="item-cart-button" disabled={item.stock === 0}>
              {item.stock === 0 ? "Sin Stock" : "Agregar al carrito"}
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
