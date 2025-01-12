import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency", 
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(value);

  const generatePDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;

    // Color corporativo
    const corporatePurple = [138, 43, 226];
    const white = [255, 255, 255];

    // Header
    pdf.setFillColor(...corporatePurple);
    pdf.rect(0, 0, pageWidth, 50, 'F');
    
    // Logo y título
    pdf.setTextColor(...white);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('NeoVape', margin, 30);
    
    // Detalles de orden
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Orden #${order.id}`, pageWidth - margin - pdf.getTextWidth(`Orden #${order.id}`), 30);
    pdf.text(order.date.toDate().toLocaleString(), pageWidth - margin - pdf.getTextWidth(order.date.toDate().toLocaleString()), 40);

    // Información del cliente
    pdf.setTextColor(...corporatePurple);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Información del Cliente', margin, 70);

    // Box de detalles del cliente
    pdf.setDrawColor(...corporatePurple);
    pdf.setFillColor(245, 243, 255);
    pdf.roundedRect(margin, 80, pageWidth - (margin * 2), 45, 3, 3, 'F');
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...corporatePurple);
    pdf.text(`Cliente: ${order.buyer.name}`, margin + 10, 95);
    pdf.text(`Email: ${order.buyer.email}`, margin + 10, 105);
    pdf.text('Dirección de envío:', margin + 10, 115);
    pdf.text(
      `${order.buyer.address.street} ${order.buyer.address.number}, ${order.buyer.address.city}`,
      margin + 10, 
      120
    );

    // Tabla de productos
    const tableColumn = [
      { header: 'Producto', dataKey: 'product' },
      { header: 'Cant.', dataKey: 'quantity' },
      { header: 'Estado de Envío', dataKey: 'shipping' },
      { header: 'Precio Unit.', dataKey: 'price' },
      { header: 'Total', dataKey: 'total' }
    ];

    // Calcular costo de envío
    const shippingCost = order.total >= 50000 ? 0 : order.total * 0.15;

    const tableRows = order.items.map((item) => ({
      product: item.title,
      quantity: item.quantity,
      shipping: order.total >= 50000 ? 'Envío Gratis' : 'Envío Regular',
      price: formatCurrency(item.price),
      total: formatCurrency(item.price * item.quantity)
    }));

    pdf.autoTable({
      startY: 155,
      columns: tableColumn,
      body: tableRows,
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: corporatePurple,
        textColor: white,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 10,
        lineWidth: 0.5,
        lineColor: [220, 220, 220],
        textColor: [80, 80, 80]
      },
      alternateRowStyles: {
        fillColor: [250, 248, 255]
      }
    });

    // Resumen y totales
    const finalY = pdf.previousAutoTable.finalY + 10;
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    pdf.setFillColor(245, 243, 255);
    pdf.roundedRect(pageWidth - 140, finalY, 120, 45, 3, 3, 'F');
    
    pdf.setTextColor(...corporatePurple);
    pdf.setFontSize(11);
    
    const rightAlign = (text, y) => {
      pdf.text(text, pageWidth - margin - pdf.getTextWidth(text), y);
    };
    
    pdf.text('Subtotal:', pageWidth - 130, finalY + 15);
    pdf.text('Costo de envío:', pageWidth - 130, finalY + 30);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Total Final:', pageWidth - 130, finalY + 45);
    
    rightAlign(formatCurrency(subtotal), finalY + 15);
    rightAlign(formatCurrency(shippingCost), finalY + 30);
    pdf.setFont('helvetica', 'bold');
    rightAlign(formatCurrency(subtotal + shippingCost), finalY + 45);

    // Footer
    pdf.setFillColor(...corporatePurple);
    pdf.rect(0, pageHeight - 40, pageWidth, 40, 'F');

    pdf.setTextColor(...white);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const footerText = [
      '¡Gracias por confiar en NeoVape!',
      'Email: tinchodeev@gmail.com | Tel: +54 3815949243',
      'Av. Principal 123, San Miguel, Tucumán | www.neovape.com.ar'
    ];
    
    footerText.forEach((text, index) => {
      const textWidth = pdf.getTextWidth(text);
      pdf.text(text, (pageWidth - textWidth) / 2, pageHeight - 25 + (index * 10));
    });

    pdf.save(`NeoVape-Orden-${order.id}.pdf`);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const orderDoc = await getDoc(doc(db, "orders", orderId));
        if (orderDoc.exists()) {
          setOrder({ id: orderDoc.id, ...orderDoc.data() });
        } else {
          setError("La orden no fue encontrada.");
        }
      } catch (err) {
        console.error("Error al obtener la orden:", err);
        setError("Hubo un problema al cargar la información de la orden.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="loading-container"><div className="loading-spinner"><div className="spinner"></div><p>Cargando información de la orden...</p></div></div>;
  if (error) return <div className="error-container"><div className="error-message"><i className="fas fa-exclamation-circle"></i><p>{error}</p></div></div>;
  if (!order) return <div className="not-found-container"><div className="not-found-message"><i className="fas fa-search"></i><p>No se encontró la orden.</p></div></div>;

  return (
<div className="order-confirmation">
  <div className="order-success-header">
    <div className="success-icon">✓</div>
    <h2>¡Listo! Se generó tu orden</h2>
    <p>Número de orden: {order.id}</p>
  </div>

  <div className="order-details-container">
    <div className="order-details-header">
      <h3>Detalles de la compra</h3>
    </div>

    <div className="order-info">
      <div className="order-info-item">
        <span className="order-info-label">Fecha de compra</span>
        <span className="order-info-value">
          {order.date.toDate().toLocaleString()}
        </span>
      </div>
      <div className="order-info-item">
        <span className="order-info-label">Comprador</span>
        <span className="order-info-value">{order.buyer.name}</span>
      </div>
      <div className="order-info-item">
        <span className="order-info-label">Dirección de envío</span>
        <span className="order-info-value">
          {`${order.buyer.address.street} ${order.buyer.address.number}, ${order.buyer.address.city}, ${order.buyer.address.province} (CP: ${order.buyer.address.postalCode})`}
        </span>
      </div>
      <div className="order-info-item">
        <span className="order-info-label">Estado del envío</span>
        <span className="order-info-value">
          {order.total >= 50000 ? 'Envío Gratis' : 'Envío Regular'}
        </span>
      </div>
    </div>

    <div className="order-products">
      {order.items.map((item) => (
        <div key={item.id} className="product-item">
          <div className="product-image-container">
            <img src={item.picturUrl} alt={item.title} className="product-image" />
          </div>
          <div className="product-details">
            <div className="product-title">{item.title}</div>
            <div className="product-quantity">Cantidad: {item.quantity}</div>
            <div className="product-price">{formatCurrency(item.price)}</div>
          </div>
        </div>
      ))}
    </div>

    <div className="order-total">
      <span className="total-label">Subtotal</span>
      <span className="total-amount">{formatCurrency(order.total)}</span>
    </div>
    <div className="order-total">
      <span className="total-label">Costo de envío</span>
      <span className="total-amount">
        {order.total >= 50000 ? 'Gratis' : formatCurrency(order.total * 0.15)}
      </span>
    </div>
    <div className="order-total">
      <span className="total-label">Total Final</span>
      <span className="total-amount">
        {formatCurrency(order.total + (order.total >= 50000 ? 0 : order.total * 0.15))}
      </span>
    </div>
  </div>

  <div className="action-buttons">
    <button onClick={generatePDF} className="action-button primary-button" style={{backgroundColor: "#8a2be2"}}>
      Descargar PDF
    </button>
    <Link to="/" className="action-button primary-button">
      Volver al inicio
    </Link>
  </div>
</div>
  );
};

export default OrderConfirmation;
