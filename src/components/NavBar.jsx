// src/components/NavBar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/NavBar.css";
import logo from "../assets/Logo.png";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const linkClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo que lleva al Home (Recetario) */}
        <NavLink to="/" className="brand" aria-label="Inicio" onClick={() => setOpen(false)}>
          <span className="brand-logo">
            <img src={logo} alt="Logo" />
          </span>
        </NavLink>

        <button
          className="navbar-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        <nav className={`links ${open ? "is-open" : ""}`} onClick={() => setOpen(false)}>
          {/* Recetario -> Home */}
          <NavLink to="/" className={linkClass} end>Recetario</NavLink>

          {/* Páginas */}
          <NavLink to="/sucursales"      className={linkClass}>Sucursales</NavLink>
          <NavLink to="/promociones"     className={linkClass}>Promociones</NavLink>
          <NavLink to="/panel-operativo" className={linkClass}>Panel Operativo</NavLink>
          <NavLink to="/login"           className={linkClass}>Login</NavLink>

          <NavLink
            to="/jugar-ganar"
            className={({ isActive }) => `cta ${isActive ? "active" : ""}`}
          >
            Jugar y ganar
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
