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
import { SpeedInsights } from "@vercel/speed-insights/react";
import DeveloperAd from "./componentes/DeveloperAd";
import { HelmetProvider, Helmet } from 'react-helmet-async';

const Login = lazy(() => import("./componentes/Login"));
const Home = lazy(() => import("./componentes/Home"));
const ItemListContainer = lazy(() => import("./componentes/ItemListContainer"));
const ItemDetailContainer = lazy(() => import("./componentes/ItemDetailContainer"));
const Checkout = lazy(() => import("./componentes/Checkout"));
const OrderConfirmation = lazy(() => import("./componentes/OrderConfirmation"));
const Footer = lazy(() => import("./componentes/Footer"));
const Contact = lazy(() => import("./componentes/Contact"));
const CartDrawer = lazy(() => import("./componentes/CartDrawer"));

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Cargando...</p>
  </div>
);

const auth = getAuth(appFirebase);

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userFirebase) => {
      setUser(userFirebase);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <>
 <HelmetProvider>
      <Helmet>
        <title>NeoVape - La mejor tienda de vaporizadores en Argentina</title>
        <meta name="description" content="Encuentra los mejores vapeadores y accesorios. Envíos a todo el país." />
        <meta property="og:title" content="NeoVape - Tienda de Vaporizadores" />
        <meta property="og:description" content="La mejor selección de vapeadores en Argentina" />
        <meta property="og:image" content="/images/logo.png" />
        <link rel="canonical" href="https://neovape.com.ar" />
      </Helmet>
      <ThemeProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </ThemeProvider>
    </HelmetProvider>
    </>
  );
}

function AppContent() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      setUsuario(usuarioFirebase);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="App">
      <AnuncioRotativo />
      <NavBar />
      <DeveloperAd />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={!usuario ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={<Home correoUsuario={usuario ? usuario.email : null} />} />
          <Route path="/products" element={<ItemListContainer />} />
          <Route path="/category/:categoryId" element={<ItemListContainer />} />
          <Route path="/item/:itemId" element={<ItemDetailContainer />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartDrawer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation/:orderId"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />
          <Route path="/contact" element={<Contact />} />
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

