import React from 'react';
import { useParams } from 'react-router-dom';
import ItemListContainer from './ItemListContainer';

const CategoryPage = () => {
  const { categoryId } = useParams();

  return (
    <div className="category-page">
      <h1>{categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}</h1>
      <ItemListContainer categoryId={categoryId} />
    </div>
  );
};

export default CategoryPage;