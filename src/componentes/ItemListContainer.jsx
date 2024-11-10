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
        <img
          src="https://vapeuk.co.uk/media/wysiwyg/8-freemax-maxus-2-200w-kit-desktop.jpeg"
          className="image"
          alt="Vape Kit"
        />
        <img
          src="https://cdn.awsli.com.br/970/970430/arquivos/Smok-RPM85.jpeg"
          alt="Smok RPM85"
          className="image"
        />
      </div>
      {greeting && <h1>{greeting}</h1>}
      <ItemList products={items} />
    </div>
  );
};

export default ItemListContainer;
