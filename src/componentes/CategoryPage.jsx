import React from 'react';
import { useParams } from 'react-router-dom';
import ItemListContainer from './ItemListContainer';

const categoryNames = {
  '1': 'Recargables',
  '2': 'Descartables'
};

const CategoryPage = () => {
  const { categoryId } = useParams();
  
  // Obtener el nombre de la categoría o usar un valor por defecto si no existe
  const categoryName = categoryNames[categoryId] || `Categoría ${categoryId}`;

  return (
    <div className="category-page">
      <h1 style={{textAlign:"center", color:"white", margin:"25px"}}> Vapers {categoryName}</h1>
      <ItemListContainer categoryId={categoryId} />
    </div>
  );
};

export default CategoryPage;

// CODIGO ACTUALIZADO, SAQUE LA CATEGORIA DE PUFF