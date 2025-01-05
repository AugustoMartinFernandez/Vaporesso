/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import { db, auth } from "../credenciales";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaStar, FaClock } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "reviews"),
          where("productId", "==", productId),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        setReviews(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error al obtener las reseñas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Debes iniciar sesión para dejar una reseña");
      return;
    }
    try {
      const reviewData = {
        productId,
        userId: user.uid,
        userEmail: user.email,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, "reviews"), reviewData);
      setReviews([
        { id: docRef.id, ...reviewData, createdAt: new Date() },
        ...reviews,
      ]);
      setNewReview({ rating: 5, comment: "" });
    } catch (error) {
      console.error("Error al enviar la reseña:", error);
      alert(
        "Hubo un error al enviar tu reseña. Por favor, inténtalo de nuevo."
      );
    }
  };

  if (loading) {
    return <div className="loading">Cargando reseñas...</div>;
  }

  return (
    <div className="product-reviews">
      <h3 style={{color:"#8a2be2"}}>Reseñas del producto</h3>
      {reviews.length === 0 ? (
        <p className="no-reviews">
          Aún no hay reseñas para este producto. ¡Sé el primero en opinar!
        </p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <span className="review-author">{review.userEmail}</span>
              <span className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    color={i < review.rating ? "#ffc107" : "#e4e5e9"}
                  />
                ))}
              </span>
            </div>
            <p className="review-comment">{review.comment}</p>
            <span className="review-date">
              <FaClock />{" "}
              {review.createdAt instanceof Date
                ? review.createdAt.toLocaleDateString()
                : review.createdAt?.toDate?.().toLocaleDateString() ||
                  "Fecha no disponible"}
            </span>
          </div>
        ))
      )}
      {user ? (
        <form onSubmit={handleSubmitReview} className="review-form">
          <h4>Deja tu reseña</h4>
          <div className="rating-select">
            <label>Calificación:</label>
            <select
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: parseInt(e.target.value) })
              }
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>
                  {num} estrellas
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            placeholder="Escribe tu reseña aquí"
            required
          />
          <button type="submit" className="submit-review-button">
            Enviar reseña
          </button>
        </form>
      ) : (
        <p style={{color:"#8a2be2"}} className="login-prompt">Inicia sesión para dejar una reseña</p>
      )}
    </div>
  );
};

export default ProductReviews;

// CODIGO NO ACTUALIZADO 