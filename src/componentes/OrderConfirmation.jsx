import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
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

  const containerStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    marginTop: "20px",
  };

  const buttonStyle = {
    width: "200px",
    margin: "5px",
  };

  if (loading)
    return (
      <div style={containerStyle}>Cargando información de la orden...</div>
    );
  if (error) return <div style={containerStyle}>Error: {error}</div>;
  if (!order) return <div style={containerStyle}>No se encontró la orden.</div>;

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Pedido Confirmado</h2>

      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <p>
          <strong>Número de orden:</strong> {order.id}
        </p>
        <p>
          <strong>Total:</strong> ${order.total.toFixed(2)}
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ color: "#444" }}>Detalles del comprador:</h3>
        <div style={{ padding: "10px" }}>
          <p>
            <strong>Nombre:</strong> {order.buyer.name}
          </p>
          <p>
            <strong>Email:</strong> {order.buyer.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {order.buyer.phone}
          </p>
          <p>
            <strong>Dirección:</strong>
          </p>
          <div style={{ marginLeft: "15px" }}>
            <p>
              {order.buyer.address?.street} {order.buyer.address?.number}
            </p>
            <p>
              {order.buyer.address?.city}, {order.buyer.address?.province}
            </p>
            <p>CP: {order.buyer.address?.postalCode}</p>
            {order.buyer.address?.description && (
              <p>{order.buyer.address.description}</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ color: "#444" }}>Productos:</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {order.items.map((item) => (
            <li
              key={item.id}
              style={{
                padding: "10px",
                borderBottom: "1px solid #eee",
                fontSize: "14px",
              }}
            >
              {item.title} - Cantidad: {item.quantity} - Precio: $
              {item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <p style={{ marginBottom: "20px" }}>
        <strong>Fecha de la orden:</strong>{" "}
        {order.date.toDate().toLocaleString()}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <Link to="/" className="btn btn-primary" style={buttonStyle}>
          Volver a inicio
        </Link>
        <Link to="/products" className="btn btn-primary" style={buttonStyle}>
          Seguir comprando
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
