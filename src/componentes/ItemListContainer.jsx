import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ItemList from "./ItemList";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../credenciales";

const ItemListContainer = ({ greeting }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let q = collection(db, "products");
        if (categoryId) {
          q = query(q, where("category", "==", categoryId));
        }
        const querySnapshot = await getDocs(q);
        const productsFromDb = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(productsFromDb);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(
          "Error al cargar los productos. Por favor, intente más tarde."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
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

  return (
    <div className="item-list-container">
<div className="image-section">
  {/* Primera imagen */}
  <div className="image-container">
    <img
      src="https://th.bing.com/th/id/R.4ae28078fc0734161c25618c0fba6be1?rik=tuY7SaWfGF71uA&pid=ImgRaw&r=0"
      className="image"
      alt="Vape Kit"
      loading="lazy"
    />
    <div className="image-overlay">
      <h3>Productos Premium</h3>
      <p>Descubre nuestra colección exclusiva</p>
    </div>
  </div>

  {/* Segunda imagen (GIF) */}
  <div className="image-container">
    <img
      src="https://i.pinimg.com/originals/f0/b1/18/f0b1183d2f018a4d895d795c48da50fd.gif"
      alt="Smok RPM85"
      className="image"
      loading="lazy"
    />
    <div className="image-overlay">
      <h3>Últimas Novedades</h3>
      <p>Innovación en cada producto</p>
    </div>
  </div>
</div>
      {greeting && <h1>{greeting}</h1>}
      <ItemList products={items} />
    </div>
  );
};

export default ItemListContainer;

// CODIGO NO ACTUALIZADO