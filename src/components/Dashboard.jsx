// src/components/Dashboard.jsx
import React, { useMemo } from "react";
import "../styles/Dashboard.css";

export default function Dashboard({ fecha, products, routes, money }) {
  const lowStock = useMemo(
    () => products.filter((p) => p.stockKg <= p.minKg).length,
    [products]
  );

  const routesToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return routes.filter((r) => r.date === today).length;
  }, [routes]);

  return (
    <div className="po__dash">
      <div className="po__welcome">
        <h2 className="po__welcome-title">¡Bienvenido!</h2>
        <p className="po__date">{fecha}</p>
      </div>

      {/* KPIs */}
      <div className="po__kpis">
        <div className="po__kpi">
          <div className="po__kpi-title">Productos en Stock</div>
          <div className="po__kpi-icn" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7l9-4 9 4-9 4-9-4z" />
              <path d="M3 7v10l9 4 9-4V7" />
              <path d="M12 11v10" />
            </svg>
          </div>
          <div className="po__kpi-value">{products.length}</div>
          <div className="po__kpi-sub">{lowStock} con stock bajo</div>
        </div>

        <div className="po__kpi">
          <div className="po__kpi-title">Rutas de Hoy</div>
          <div className="po__kpi-icn" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7h11l4 4v6H3z" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="16" cy="17" r="2" />
              <path d="M14 7v4h4" />
            </svg>
          </div>
          <div className="po__kpi-value">{routesToday}</div>
          <div className="po__kpi-sub">0 completadas</div>
        </div>

        <div className="po__kpi">
          <div className="po__kpi-title">Ventas de Hoy</div>
          <div className="po__kpi-icn" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12l6 6L21 6" />
            </svg>
          </div>
          <div className="po__kpi-value">0</div>
          <div className="po__kpi-sub">ventas realizadas</div>
        </div>

        <div className="po__kpi">
          <div className="po__kpi-title">Total del Día</div>
          <div className="po__kpi-icn" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1v22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="po__kpi-value">{money(0)}</div>
          <div className="po__kpi-sub">ingresos</div>
        </div>
      </div>

      {/* Secciones */}
      <section className="po__section">
        <div className="po__section-h">Alertas de Stock</div>
        <div className="po__section-b">
          {lowStock === 0 ? (
            <div className="po__empty">
              <span className="po__empty-icn" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7l9-4 9 4-9 4-9-4z" />
                  <path d="M3 7v10l9 4 9-4V7" />
                  <path d="M12 11v10" />
                </svg>
              </span>
              No hay productos con Stock bajo
            </div>
          ) : (
            <ul className="po__list">
              {products
                .filter((p) => p.stockKg <= p.minKg)
                .map((p) => (
                  <li key={p.id}>{p.name} — {p.stockKg}kg (mín. {p.minKg}kg)</li>
                ))}
            </ul>
          )}
        </div>
      </section>

      <section className="po__section">
        <div className="po__section-h">Rutas Activas</div>
        <div className="po__section-b">
          <div className="po__empty">
            <span className="po__empty-icn" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7h11l4 4v6H3z" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="16" cy="17" r="2" />
                <path d="M14 7v4h4" />
              </svg>
            </span>
            No hay rutas activas
          </div>
        </div>
      </section>

      <section className="po__section">
        <div className="po__section-h">Últimas Ventas</div>
        <div className="po__section-b">
          <div className="po__empty">
            <span className="po__empty-icn" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12l6 6L21 6" />
              </svg>
            </span>
            No hay ventas registradas
          </div>
        </div>
      </section>
    </div>
  );
}
