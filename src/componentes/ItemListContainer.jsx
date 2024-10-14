import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ItemList from "./ItemList.jsx";
import { productos } from "../mocks/productos.js";

const ItemListContainer = ({ greeting }) => {
  const [items, setItems] = useState([]);
  const { categoryId } = useParams();

  useEffect(() => {
    const getProducts = new Promise((resolve) => {
      setTimeout(() => {
        resolve(productos);
      }, 2000);
    });

    getProducts.then((res) => {
      if (categoryId) {
        const filteredProducts = res.filter(
          (prod) => prod.categoryId === parseInt(categoryId)
        );
        setItems(filteredProducts);
      } else {
        setItems(res);
      }
    });
  }, [categoryId]);

  return (
    <div style={{textAlign:"center", margin:"25px", color:"white"}} className="item-list-container">
      {greeting && <h1>{greeting}</h1>}
      <ItemList products={items} />
    </div>
  );
};

export default ItemListContainer;