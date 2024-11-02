import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import "./App.css";
import NavBar from "./componentes/NavBar";
import ItemListContainer from "./componentes/ItemListContainer";
import ItemDetailContainer from "./componentes/ItemDetailContainer";
import Footer from "./componentes/Footer";
import Home from "./componentes/Home";
import { ThemeProvider } from "./componentes/ThemeContext";
import { CartProvider } from './componentes/CartContext';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <NavBar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/products"
                  element={
                    <ItemListContainer greeting="Con esto vas a dejar de fumar 🚬" />
                  }
                />
                <Route
                  path="/category/:categoryId"
                  element={<ItemListContainer />}
                />
                <Route path="/item/:itemId" element={<ItemDetailContainer />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
