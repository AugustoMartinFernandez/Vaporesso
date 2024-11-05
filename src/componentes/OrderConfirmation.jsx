import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderDoc = await getDoc(doc(db, 'orders', orderId));
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

  if (loading) return <div>Cargando información de la orden...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!order) return <div>No se encontró la orden.</div>;

  return (
    <div className="order-confirmation">
      <h2>Orden Confirmada</h2>
      <p><strong>Número de orden:</strong> {order.id}</p>
      <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
      
      <h3>Detalles del comprador:</h3>
      <div className="buyer-info">
        <p><strong>Nombre:</strong> {order.buyer.name}</p>
        <p><strong>Email:</strong> {order.buyer.email}</p>
        <p><strong>Teléfono:</strong> {order.buyer.phone}</p>
        <p><strong>Dirección:</strong></p>
        <div className="address-details">
          <p>{order.buyer.address?.street} {order.buyer.address?.number}</p>
          <p>{order.buyer.address?.city}, {order.buyer.address?.province}</p>
          <p>CP: {order.buyer.address?.postalCode}</p>
          {order.buyer.address?.description && <p>{order.buyer.address.description}</p>}
        </div>
      </div>

      <h3>Productos:</h3>
      <ul>
        {order.items.map(item => (
          <li key={item.id}>
            {item.title} - Cantidad: {item.quantity} - Precio: ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>

      <p><strong>Fecha de la orden:</strong> {order.date.toDate().toLocaleString()}</p>
    </div>
  );
};

export default OrderConfirmation;