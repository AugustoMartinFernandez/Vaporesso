import React from "react";
import { Link } from "react-router-dom";

const Item = ({ item }) => {
  return (
    <div className="item-card">
      <Link to={`/item/${item.id}`} className="item-link">
        <img src={item.picturUrl} alt={item.title} className="item-image" />
      </Link>
      <h2 className="item-title">{item.title}</h2>
      <p className="item-description">{item.description}</p>
      <div className="item-footer">
        <span className="item-price">{item.price}</span>
        <button className="item-buy-button" onClick={() => console.log('Buy clicked')}>Comprar</button>
      </div>
    </div>
  );
};

export default Item;