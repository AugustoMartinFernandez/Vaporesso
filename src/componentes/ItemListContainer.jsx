// ItemListContainer.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Asegúrate de importar useParams
import ItemList from "./ItemList";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import FlashSale from "./FlashSale"; // Importa el componente FlashSale

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

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  //  fecha de finalización de la oferta
  const endDate = "2024-10-27T12:02:00";

  // Productos que estarán en oferta
  const flashSaleProducts = items.slice(0, 2);

  return (
    <div className="item-list-container">
      {greeting && <h1>{greeting}</h1>}
      <FlashSale endDate={endDate} products={flashSaleProducts} />
      <ItemList products={items} />
    </div>
  );
};

export default ItemListContainer;
