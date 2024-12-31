import React, { useState, useEffect } from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const Contact = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    productId: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false); // Estado para el botón de envío

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
        }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        toast.error("Error al cargar la lista de productos");
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: new Date(),
      });

      toast.success("Mensaje enviado correctamente");
      setFormData({ name: "", email: "", message: "", productId: "" });
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      toast.error("Error al enviar el mensaje");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-info-section">
        <h1>Conecta con nosotros</h1>
        <h3>Estamos aquí para ayudarte con lo que necesites</h3>
        <p>
          Nuestro equipo está listo para asistirte. Completa el formulario y nos
          pondremos en contacto contigo lo antes posible.
        </p>
        <div className="icon-section">
          <Mail size={32} />
          <Phone size={32} />
          <MessageCircle size={32} />
        </div>
      </div>
      <div className="contact-form-section">
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Nombre completo</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="productId">Producto</label>
            <select
              id="productId"
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              required
            >
              <option value="">Seleccione un producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.title}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="message">Mensaje</label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows="4"
            />
          </div>
          <button type="submit" className="submit-button">
            {isSending ? "Enviando..." : "Enviar Mensaje"}
          </button>
        </form>
        <div className="security-info">
          <span>Horario de atención: Lunes a Viernes de 9:00 a 18:00</span>
        </div>
      </div>
      <a href="https://wa.me/1234567890" className="whatsapp-float" target="_blank" rel="noopener noreferrer">
        <FaWhatsapp size={32} />
      </a>
    </div>
  );
};

export default Contact;
