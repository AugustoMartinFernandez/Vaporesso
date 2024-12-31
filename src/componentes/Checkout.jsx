import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const cartTotal = getCartTotal();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    number: "",
    city: "",
    province: "",
    postalCode: "",
    description: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(value);

  useEffect(() => {
    const requiredFields = [
      "name",
      "email",
      "phone",
      "street",
      "number",
      "city",
      "province",
      "postalCode",
    ];
    const isValid = requiredFields.every(
      (field) => formData[field].trim() !== ""
    );
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const postalCodeRegex = /^\d{4}$/;
    const isEmailValid = emailRegex.test(formData.email);
    const isPhoneValid = phoneRegex.test(formData.phone);
    const isPostalCodeValid = postalCodeRegex.test(formData.postalCode);
    setIsFormValid(
      isValid && isEmailValid && isPhoneValid && isPostalCodeValid
    );
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Ingrese un email válido";
        }
        break;
      case "phone":
        if (!/^\d{10}$/.test(value)) {
          return "El teléfono debe tener 10 dígitos";
        }
        break;
      case "postalCode":
        if (!/^\d{4}$/.test(value)) {
          return "El código postal debe tener 4 dígitos";
        }
        break;
      default:
        if (!value.trim()) {
          return "Este campo es requerido";
        }
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Por favor, complete todos los campos correctamente");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }
    setIsSubmitting(true);
    setLoading(true);
    try {
      const order = {
        buyer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.street,
            number: formData.number,
            city: formData.city,
            province: formData.province,
            postalCode: formData.postalCode,
            description: formData.description || "Sin descripción adicional",
          },
        },
        items: cartItems.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          picturUrl: item.picturUrl,
        })),
        total: cartTotal,
        date: new Date(),
        status: "generada",
      };
      const docRef = await addDoc(collection(db, "orders"), order);
      for (const item of cartItems) {
        const productRef = doc(db, "products", item.id);
        await updateDoc(productRef, {
          stock: increment(-item.quantity),
        });
      }
      clearCart();
      toast.success("¡Orden creada exitosamente!");
      navigate(`/order-confirmation/${docRef.id}`);
    } catch (error) {
      console.error("Error al crear la orden:", error);
      toast.error("Error al procesar la orden");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="order-summary">
        <span className="order-status">Orden en proceso</span>
        <h3>Resumen de la compra</h3>
        {cartItems.map((item) => (
          <div key={item.id} className="order-item">
            <span>{item.title}</span>
            <span>Cantidad: {item.quantity}</span>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="order-total">
          <span>Total a pagar</span>
          <span>{formatCurrency(cartTotal)}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-section">
          <h4 style={{ color: "#8a2be2", textAlign: "center" }}>
            Información Personal
          </h4>
          <div className="form-group">
            <label htmlFor="name">Nombre completo </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Martin Fernandez"
              required
            />
            {formData.name && validateField("name", formData.name) && (
              <span className="error-message">
                {validateField("name", formData.name)}
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              required
            />
            {formData.email && validateField("email", formData.email) && (
              <span className="error-message">
                {validateField("email", formData.email)}
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="phone">Teléfono </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ej: +54 3815949243"
              required
            />
            {formData.phone && validateField("phone", formData.phone) && (
              <span className="error-message">
                {validateField("phone", formData.phone)}
              </span>
            )}
          </div>
        </div>
        <div className="form-section">
          <h4>Dirección de Envío</h4>
          <div className="form-group">
            <label htmlFor="province">Provincia </label>
            <input
              type="text"
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              placeholder="Ej: Tucuman"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">Ciudad </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ej: San Miguel de Tucuman"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="street">Calle </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Ej: Av. Libertador"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="number">Número </label>
            <input
              type="number"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="Ej: 1234"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="postalCode">Código Postal </label>
            <input
              type="number"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Ej: 1234"
              required
            />
            {formData.postalCode &&
              validateField("postalCode", formData.postalCode) && (
                <span className="error-message">
                  {validateField("postalCode", formData.postalCode)}
                </span>
              )}
          </div>
          <div className="form-group">
            <label htmlFor="description">
              Descripción adicional (opcional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ej: Entre calles, referencias, piso, departamento..."
              rows="3"
            />
          </div>
        </div>
        <button
          type="submit"
          className="submit-button"
          disabled={!isFormValid || isSubmitting || loading}
        >
          {loading ? (
            <div className="loading-spinner-small">
              <div className="spinner"></div>
              <span>Procesando...</span>
            </div>
          ) : (
            "Confirmar Compra"
          )}
        </button>
      </form>
    </div>
  );
};

export default Checkout;


// CODIGO ACTUALIZADO