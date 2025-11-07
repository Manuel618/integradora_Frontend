import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar.jsx";
import HomeScreen from "./components/HomeScreen.jsx";      // Recetario (Home)
import Recetario from "./components/Recetario.jsx";  
import Promociones from "./components/Promociones.jsx";
import Login from "./components/Login.jsx";
import JugarGanar from "./components/JugarGanar.jsx";
import PanelOperativo from "./components/PanelOperativo";

export default function App() {
  return (
    <HashRouter>
      {/* Navbar visible en todas las páginas */}
      <NavBar />

      <Routes>
        <Route path="/" element={<HomeScreen />} />
          <Route path="/recetario" element={<Recetario />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jugar-ganar" element={<JugarGanar />} />
        <Route path="/panel-operativo" element={<PanelOperativo />} />
      </Routes>
    </HashRouter>
  );
}
