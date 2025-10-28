// src/components/PanelOperativo.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PanelOperativo.css";

import Dashboard from "./Dashboard";
import Inventario from "./Inventario";
import Rutas from "./Rutas";
import PuntoDeVenta from "./PuntoDeVenta";

export default function PanelOperativo() {
  const [tab, setTab] = useState("dashboard");
  const navigate = useNavigate();

  // =========================
  // Fecha (Dashboard)
  // =========================
  const fecha = useMemo(
    () =>
      new Date().toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    []
  );

  // =========================
  // Estado compartido (solo Rutas)
  // =========================
  const [routes, setRoutes] = useState([]);

  // >>> NO hay lista de productos aquí <<<
  // Solo lectura desde localStorage si algún componente lo requiere.
  const products = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("inv_products") || "[]");
    } catch {
      return [];
    }
  }, [tab]); // se vuelve a leer al cambiar de pestaña

  // =========================
  // Utilidades y helpers
  // =========================
  const handleLogout = () => navigate("/login");

  const money = (n) =>
    (n ?? 0).toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2,
    });

  const createRoute = (data) => {
    setRoutes((arr) => [
      { ...data, id: "r_" + Math.random().toString(36).slice(2, 9) },
      ...arr,
    ]);
  };

  const NavItem = ({ id, label, icon }) => (
    <button
      type="button"
      className={`po__nav-item${tab === id ? " is-active" : ""}`}
      onClick={() => setTab(id)}
    >
      <span className="po__nav-icn" aria-hidden="true">{icon}</span>
      <span className="po__nav-txt">{label}</span>
    </button>
  );

  // =========================
  // Render
  // =========================
  return (
    <section id="panel-operativo" className="po">
      {/* ===================== Sidebar ===================== */}
      <aside className="po__side">
        <div className="po__side-inner">
          <h2 className="po__brand">Panel</h2>

          <nav className="po__nav">
            <NavItem
              id="dashboard"
              label="Dashboard"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
              }
            />
            <NavItem
              id="inventario"
              label="Inventario"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7h18M3 12h18M3 17h18" />
                </svg>
              }
            />
            <NavItem
              id="rutas"
              label="Rutas"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7h11l4 4v6H3z" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="16" cy="17" r="2" />
                  <path d="M14 7v4h4" />
                </svg>
              }
            />
            <NavItem
              id="pos"
              label="Punto de Venta"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="14" rx="2" />
                  <path d="M3 10h18M7 16h2" />
                </svg>
              }
            />

            <div className="po__nav-sep" />

            <button type="button" className="po__nav-item po__logout" onClick={handleLogout}>
              <span className="po__nav-icn" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v10" />
                  <path d="M6.8 6.8a7 7 0 1 0 9.9 0" />
                </svg>
              </span>
              <span className="po__nav-txt">Cerrar sesión</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* ===================== Main ===================== */}
      <main className="po__main">
        {/* Si no quieres pasar products, puedes quitar esa prop sin problema */}
        {tab === "dashboard"  && <Dashboard  fecha={fecha} routes={routes} products={products} money={money} />}
        {tab === "inventario" && <Inventario money={money} />}
        {tab === "rutas"      && <Rutas routes={routes} onCreateRoute={createRoute} />}
        {tab === "pos"        && <PuntoDeVenta products={products} money={money} />}

        <footer className="po__footer">© {new Date().getFullYear()} — Panel operativo</footer>
      </main>
    </section>
  );
}
