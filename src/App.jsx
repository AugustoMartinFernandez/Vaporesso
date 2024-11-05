import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import appFirebase from "./credenciales";
import Login from "./componentes/Login";
import Home from "./componentes/Home";
import NavBar from "./componentes/NavBar";
import ItemListContainer from "./componentes/ItemListContainer";
import ItemDetailContainer from "./componentes/ItemDetailContainer";
import Footer from "./componentes/Footer";
import { ThemeProvider } from "./componentes/ThemeContext";
import { CartProvider } from "./componentes/CartContext";
import Checkout from "./componentes/Checkout";
import OrderConfirmation from "./componentes/OrderConfirmation";

const auth = getAuth(appFirebase);

function App() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      setUsuario(usuarioFirebase);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div className="loading">Cargando...</div>;

  const ProtectedRoute = ({ children }) => {
    if (!usuario) return <Navigate to="/login" />;
    return children;
  };

  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <NavBar />
            <main>
              <Routes>
                <Route path="/login" element={!usuario ? <Login /> : <Navigate to="/" />} />
                <Route path="/" element={<ProtectedRoute><Home correoUsuario={usuario?.email} /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><ItemListContainer greeting="Con esto vas a dejar de fumar 🚬" /></ProtectedRoute>} />
                <Route path="/category/:categoryId" element={<ProtectedRoute><ItemListContainer /></ProtectedRoute>} />
                <Route path="/item/:itemId" element={<ProtectedRoute><ItemDetailContainer /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: "#363636", color: "#fff" } }} />
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;

