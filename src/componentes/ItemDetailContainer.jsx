// ItemDetailContainer.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const ItemDetailContainer = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!item) return <div>Producto no encontrado</div>;

  return (
    <div className="item-detail-container">
      <div className="item-detail">
        <div className="item-detail-image">
          <img src={item.picturUrl} alt={item.title} />
        </div>
        <div className="item-detail-info">
          <h2>{item.title}</h2>
          <p className="description">{item.description}</p>
          <p className="price">${item.price}</p>
          <p className="stock">
            Stock disponible: {item.stock}{" "}
            {item.stock < 5 && "(¡Últimas unidades!)"}
          </p>
          <button className="item-buy-button" disabled={item.stock === 0}>
            {item.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailContainer;
