import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ItemDetailContainer = () => {
  const [item, setItem] = useState(null);
  const { itemId } = useParams();

  useEffect(() => {
    const getItem = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    getItem.then((res) => {
      setItem(res);
    });
  }, [itemId]);

  if (!item) {
    return <div>Espera por favor 😊..</div>;
  }

  return (
    <div>
      <h2>{item.title}</h2>
      <img src={item.picturUrl} alt={item.title} />
      <p>{item.description}</p>
      <span>{item.price}</span>
      {}
    </div>
  );
};

export default ItemDetailContainer;
