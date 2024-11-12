import React, { Suspense, lazy, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import appFirebase from "./credenciales";

// Componentes que se cargan inmediatamente
import NavBar from "./componentes/NavBar";
import { ThemeProvider } from "./componentes/ThemeContext";
import { CartProvider } from "./componentes/CartContext";
import AnuncioRotativo from "./componentes/AnuncioRotativo";

// Componentes con lazy loading
const Login = lazy(() => import("./componentes/Login"));
const Home = lazy(() => import("./componentes/Home"));
const ItemListContainer = lazy(() => import("./componentes/ItemListContainer"));
const ItemDetailContainer = lazy(() =>
  import("./componentes/ItemDetailContainer")
);
const Checkout = lazy(() => import("./componentes/Checkout"));
const OrderConfirmation = lazy(() => import("./componentes/OrderConfirmation"));
const Footer = lazy(() => import("./componentes/Footer"));

// Componente de carga
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
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      setUsuario(usuarioFirebase);
      setLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  if (loading) return <LoadingSpinner />;

  const ProtectedRoute = ({ children }) => {
    if (!usuario) return <Navigate to="/login" />;
    return children;
  };

  return (
    <div className="App">
      {!isLoginPage && <AnuncioRotativo />}
      <NavBar />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route
            path="/login"
            element={!usuario ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home correoUsuario={usuario?.email} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ItemListContainer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/:categoryId"
            element={
              <ProtectedRoute>
                <ItemListContainer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/item/:itemId"
            element={
              <ProtectedRoute>
                <ItemDetailContainer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </Suspense>
      <Toaster />
    </div>
  );
}

export default App;
