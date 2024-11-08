import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { Trash2, Plus, Minus, Shield, Truck, CreditCard } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import "../App.css";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, getCartTotal, removeFromCart, updateQuantity, clearCart, reservedItems } = useCart();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const navigate = useNavigate();

  const cartTotal = getCartTotal();

  useEffect(() => {
    const calculateShipping = () => {
      if (cartTotal >= 50000) {
        return 0;
      } else {
        return cartTotal * 0.25;
      }
    };
    setShippingCost(calculateShipping());
  }, [cartTotal]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);

  const getEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today.setDate(today.getDate() + 3));
    return deliveryDate.toLocaleDateString("es-AR", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const calculateInstallments = () => {
    const installmentOptions = [
      { months: 6, interest: 0 },
      { months: 3, interest: 0 },
    ];
    return installmentOptions.map((option) => ({
      months: option.months,
      amount: cartTotal / option.months,
    }));
  };

  const calculateTransferDiscount = () => {
    return cartTotal * 0.92; // 10% de descuento
  };

  const handleGenerateOrder = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  const installments = calculateInstallments();
  const estimatedDelivery = getEstimatedDelivery();

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-header border-bottom p-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Tu carrito tiene {cartItems.length} productos</h5>
          <button onClick={onClose} className="btn-close" aria-label="Cerrar" />
        </div>
        {cartItems.length === 0 ? (
          <div className="empty-cart d-flex flex-column align-items-center justify-content-center p-4">
            <div className="empty-cart-icon mb-3">
              <svg className="bi bi-cart" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>
            </div>
            <p className="text-muted mb-3">Tu carrito está vacío</p>
            <button onClick={onClose} className="btn btn-primary">Seguir comprando</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item border-bottom p-3">
                  <div className="row">
                    <div className="col-3">
                      <img src={item.picturUrl} alt={item.title} className="img-fluid rounded" />
                    </div>
                    <div className="col-9">
                      <div className="d-flex justify-content-between">
                        <h6 className="mb-1">{item.title}</h6>
                        <button onClick={() => removeFromCart(item.id)} className="btn btn-link text-danger p-0">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-success small mb-2">
                        {reservedItems.has(item.id) ? "Reservado por 30 minutos" : "En stock"}
                      </p>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div className="btn-group" role="group">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="btn btn-outline-secondary btn-sm"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="btn btn-outline-secondary btn-sm disabled">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="btn btn-outline-secondary btn-sm"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <small className="text-muted">(máx. {item.stock})</small>
                      </div>
                      <p className="mb-0 fw-bold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="shipping-info bg-light p-3">
                <div className="d-flex align-items-center gap-2 text-primary mb-2">
                  <Truck size={20} />
                  <span className="fw-medium">
                    {shippingCost === 0 ? "¡Envío gratis!" : `Envío: ${formatCurrency(shippingCost)}`}
                  </span>
                </div>
                <p className="small text-muted mb-0">Llegará el {estimatedDelivery}</p>
              </div>
            </div>
            <div className="cart-summary border-top p-3">
              <div className="mb-3">
                <div className="d-flex justify-content-between text-muted mb-2">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="d-flex justify-content-between text-muted mb-2">
                  <span>Envío</span>
                  <span>{formatCurrency(shippingCost)}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal + shippingCost)}</span>
                </div>
              </div>
              <div className="payment-options bg-light rounded p-3 mb-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <CreditCard size={20} className="text-success" />
                  <span className="fw-medium">Medios de pago</span>
                </div>
                {installments.map(({ months, amount }) => (
                  <p key={months} className="small text-muted mb-1">
                    {months}x {formatCurrency(amount)} sin interés
                  </p>
                ))}
                <p className="small text-muted mb-1 text-success">
                  Transferencia: {formatCurrency(calculateTransferDiscount())} (10% descuento)
                </p>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={handleGenerateOrder}>
                  Generar orden
                </button>
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="btn btn-danger"
                >
                  Vaciar carrito
                </button>
              </div>
              <div className="d-flex align-items-center gap-2 mt-3">
                <Shield size={20} className="text-warning" />
                <span className="small text-muted">
                  Todos los pagos están protegidos y te devolvemos tu dinero.
                </span>
              </div>
            </div>
          </>
        )}
        {showConfirmClear && (
          <div className="confirm-clear-modal">
            <div className="modal-content shadow">
              <h5 className="text-center">
                ¿Estás seguro de que deseas vaciar el carrito?
              </h5>
              <div className="modal-actions d-flex justify-content-center gap-3 mt-4">
                <button
                  onClick={() => {
                    clearCart();
                    setShowConfirmClear(false);
                  }}
                  className="btn btn-vaciar btn-lg"
                >
                  Vaciar
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="btn btn-cancelar btn-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;