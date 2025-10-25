// src/components/Rutas.jsx
import React, { useRef, useState } from "react";
import "../styles/Rutas.css";

export default function Rutas({ routes, onCreateRoute }) {
  // =========================
  // Estado local de Rutas
  // =========================
  const [rtOpen, setRtOpen] = useState(false);
  const routeFormRef = useRef(null);
  const [rtForm, setRtForm] = useState({
    name: "", driver: "", vehicle: "",
    date: new Date().toISOString().slice(0,10),
    startTime: "", etaTime: "",
  });

  // =========================
  // Handlers
  // =========================
  const openNewRoute = () => {
    setRtForm({ name:"", driver:"", vehicle:"", date:new Date().toISOString().slice(0,10), startTime:"", etaTime:"" });
    setRtOpen(true);
    setTimeout(() => routeFormRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
  };

  const cancelNewRoute = () => setRtOpen(false);
  const onRtChange = (e) => setRtForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submitNewRoute = (e) => {
    e.preventDefault();
    if (!rtForm.name || !rtForm.driver || !rtForm.date) return;
    onCreateRoute(rtForm);
    setRtOpen(false);
  };

  // =========================
  // Render
  // =========================
  return (
    <div className="rt">
      <div className="rt__head">
        <div>
          <h2 className="rt__title">Control de Rutas</h2>
          <p className="rt__subtitle">Gestiona las entregas y rutas de distribución</p>
        </div>
        <button type="button" className="rt__btn-new" onClick={openNewRoute}>
          <span className="rt__btn-icn" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M11 5h2v14h-2zM5 11h14v2H5z" />
            </svg>
          </span>
          Nueva Ruta
        </button>
      </div>

      {rtOpen && (
        <div className="rt__panel" ref={routeFormRef}>
          <div className="rt__panel-title">Nueva Ruta</div>
          <form className="rt__form" onSubmit={submitNewRoute}>
            <div className="po__field">
              <label className="po__label">Nombre de la Ruta <span className="req">*</span></label>
              <input className="po__input" name="name" type="text" placeholder="Ej. Ruta centro" value={rtForm.name} onChange={onRtChange} required />
            </div>
            <div className="po__field">
              <label className="po__label">Conductor <span className="req">*</span></label>
              <input className="po__input" name="driver" type="text" placeholder="Nombre del Conductor" value={rtForm.driver} onChange={onRtChange} required />
            </div>
            <div className="po__field">
              <label className="po__label">Vehículo</label>
              <input className="po__input" name="vehicle" type="text" placeholder="Placa del vehículo" value={rtForm.vehicle} onChange={onRtChange} />
            </div>
            <div className="po__field">
              <label className="po__label">Fecha <span className="req">*</span></label>
              <input className="po__input" name="date" type="date" value={rtForm.date} onChange={onRtChange} required />
            </div>
            <div className="po__field">
              <label className="po__label">Hora de Salida</label>
              <input className="po__input" name="startTime" type="time" value={rtForm.startTime} onChange={onRtChange} />
            </div>
            <div className="po__field">
              <label className="po__label">Hora Estimada Llegada</label>
              <input className="po__input" name="etaTime" type="time" value={rtForm.etaTime} onChange={onRtChange} />
            </div>
            <div className="rt__form-actions">
              <button type="button" className="po__btn" onClick={cancelNewRoute}>Cancelar</button>
              <button type="submit" className="po__btn po__btn--primary">Crear Ruta</button>
            </div>
          </form>
        </div>
      )}

      <section className="po__section">
        <div className="po__section-h">Rutas Programadas</div>
        <div className="po__section-b">
          {routes.length === 0 ? (
            <div className="po__empty">
              <span className="po__empty-icn" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7h11l4 4v6H3z" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="16" cy="17" r="2" />
                  <path d="M14 7v4h4" />
                </svg>
              </span>
              No hay rutas programadas
            </div>
          ) : (
            <div className="rt__cards">
              {routes.map((r) => (
                <div className="rt__card" key={r.id}>
                  <div className="rt__card-title">{r.name}</div>
                  <div className="rt__card-grid">
                    <div><span className="muted">Conductor:</span> {r.driver || "-"}</div>
                    <div><span className="muted">Vehículo:</span> {r.vehicle || "-"}</div>
                    <div><span className="muted">Fecha:</span> {r.date}</div>
                    <div><span className="muted">Salida:</span> {r.startTime || "--:--"}</div>
                    <div><span className="muted">Est. llegada:</span> {r.etaTime || "--:--"}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
