// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./componentes/NavBar";
import ItemListContainer from "./componentes/ItemListContainer";
import ItemDetailContainer from "./componentes/ItemDetailContainer";
import Footer from "./componentes/Footer";
import Home from "./componentes/Home";
import { ThemeProvider } from "./componentes/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div id="root">
          <div className="App">
            <NavBar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/products"
                  element={
                    <ItemListContainer greeting="¿Listo para dejar el pucho?" />
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
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
