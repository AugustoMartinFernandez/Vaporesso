import React, { Suspense, lazy, useState, useEffect } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import appFirebase from "./credenciales";
import NavBar from "./componentes/NavBar";
import { ThemeProvider } from "./componentes/ThemeContext";
import { CartProvider } from "./componentes/CartContext";
import AnuncioRotativo from "./componentes/AnuncioRotativo";

const Login = lazy(() => import("./componentes/Login"));
const Home = lazy(() => import("./componentes/Home"));
const ItemListContainer = lazy(() => import("./componentes/ItemListContainer"));
const ItemDetailContainer = lazy(() =>
  import("./componentes/ItemDetailContainer")
);
const Checkout = lazy(() => import("./componentes/Checkout"));
const OrderConfirmation = lazy(() => import("./componentes/OrderConfirmation"));
const Footer = lazy(() => import("./componentes/Footer"));
import { SpeedInsights } from "@vercel/speed-insights/react";

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p></p>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(appFirebase);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      setUsuario(usuarioFirebase);
      setLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="App">
      <AnuncioRotativo />
      <NavBar />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={!usuario ? <Login /> : <Navigate to="/" />} />
          <Route 
            path="/" 
            element={<Home correoUsuario={usuario ? usuario.email : null} />} 
          />
          <Route path="/products" element={<ItemListContainer />} />
          <Route path="/category/:categoryId" element={<ItemListContainer />} />
          <Route path="/item/:itemId" element={<ItemDetailContainer />} />
          <Route
            path="/checkout"
            element={
              usuario ? (
                <Checkout />
              ) : (
                <Navigate to="/login" state={{ from: "/checkout" }} />
              )
            }
          />
          <Route
            path="/order-confirmation/:orderId"
            element={
              usuario ? (
                <OrderConfirmation />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
        <SpeedInsights />
      </Suspense>
      <Toaster />
    </div>
  );
}

export default App;