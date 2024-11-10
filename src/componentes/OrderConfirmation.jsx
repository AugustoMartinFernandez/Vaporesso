import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(value);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const orderDoc = await getDoc(doc(db, "orders", orderId));
        if (orderDoc.exists()) {
          setOrder({ id: orderDoc.id, ...orderDoc.data() });
        } else {
          setError("La orden no fue encontrada.");
        }
      } catch (err) {
        console.error("Error al obtener la orden:", err);
        setError("Hubo un problema al cargar la información de la orden.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando información de la orden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="not-found-container">
        <div className="not-found-message">
          <i className="fas fa-search"></i>
          <p>No se encontró la orden.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="order-success-header">
        <div className="success-icon">✓</div>
        <h2>¡Listo! Se generó tu orden</h2>
        <p>Número de orden: {order.id}</p>
      </div>

      <div className="order-details-container">
        <div className="order-details-header">
          <h3>Detalles de la compra</h3>
        </div>

        <div className="order-info">
          <div className="order-info-item">
            <span className="order-info-label">Fecha de compra</span>
            <span className="order-info-value">
              {order.date.toDate().toLocaleString()}
            </span>
          </div>
          <div className="order-info-item">
            <span className="order-info-label">Comprador</span>
            <span className="order-info-value">{order.buyer.name}</span>
          </div>
        </div>

        <div className="order-products">
          {order.items.map((item) => (
            <div key={item.id} className="product-item">
              <div className="product-image-container">
                <img
                  src={item.picturUrl}
                  alt={item.title}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                    e.target.onerror = null;
                  }}
                />
              </div>
              <div className="product-details">
                <div className="product-title">{item.title}</div>
                <div className="product-quantity">
                  Cantidad: {item.quantity}
                </div>
                <div className="product-price">
                  {formatCurrency(item.price)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="order-total">
          <span className="total-label">Total</span>
          <span className="total-amount">{formatCurrency(order.total)}</span>
        </div>
      </div>

      <div className="action-buttons">
        <Link
          style={{ backgroundColor: "#8a2be2" }}
          to="/"
          className="action-button primary-button"
        >
          Volver al inicio
        </Link>
        <Link to="/products" className="action-button secondary-button">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;

// CODIGO NO ACTUALIZADO
