// src/components/NavBar.jsx
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import "../styles/NavBar.css";
import logo from "../assets/Logo.png";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const navigate = useNavigate();
  const location = useLocation();

  const linkClass = ({ isActive }) => (isActive ? "active" : "");

  // Mantiene el input sincronizado con la URL si cambia ?q=
  useEffect(() => {
    setQuery(params.get("q") || "");
  }, [params]);

  // Rutas que soportan búsqueda
  const isHome = location.pathname === "/";
  const isPromo = location.pathname.startsWith("/promociones");
  const basePath = isPromo ? "/promociones" : "/"; // destino según dónde estés

  // Búsqueda en vivo (debounce) solo en rutas que la soportan (Home o Promociones)
  useEffect(() => {
    const t = setTimeout(() => {
      const q = query.trim();

      if (isHome || isPromo) {
        if (q) {
          navigate(`${basePath}?q=${encodeURIComponent(q)}`, {
            replace: location.pathname === basePath,
          });
        } else if (params.get("q")) {
          // limpia ?q= si estás en una ruta buscable
          navigate(basePath, { replace: true });
        }
      }
      // Si estás en otra página, NO te muevo.
    }, 250);

    return () => clearTimeout(t);
  }, [query, isHome, isPromo, basePath, navigate, location.pathname, params]);

  // Enter (por si el usuario envía el form manualmente)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();

    if (q) {
      if (isHome || isPromo) {
        navigate(`${basePath}?q=${encodeURIComponent(q)}`);
      } else {
        // si estás en otra página, manda la búsqueda al Home
        navigate(`/?q=${encodeURIComponent(q)}`);
      }
    } else if ((isHome || isPromo) && params.get("q")) {
      navigate(basePath, { replace: true });
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo -> Home */}
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
          {/* Buscador antes de Recetario */}
          <form
            className="nav-search"
            onSubmit={handleSearchSubmit}
            onClick={(e) => e.stopPropagation()} // escribir en móvil sin cerrar el menú
            role="search"
            aria-label="Buscar en recetario/promociones"
          >
            <input
              type="search"
              className="nav-search-input"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          {/* Links */}
          <NavLink to="/"                 className={linkClass} end>Inicio</NavLink>
          <NavLink to="/promociones"     className={linkClass}>Promociones</NavLink>
          <NavLink to="/recetario"      className={linkClass}>Recetario</NavLink>
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
