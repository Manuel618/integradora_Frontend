import React, { useMemo, useEffect, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/HomeScreen.css";

/* Leaflet */
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

/* Configurar íconos por defecto de Leaflet (una sola vez por módulo) */
let _leafletIconsPatched = false;
if (!_leafletIconsPatched) {
  L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });
  _leafletIconsPatched = true;
}

/* ====== Separadores ====== */
const Divider = () => <div className="divider divider--soft" aria-hidden="true" />;
// Si prefieres ondulado, usa WaveSep en lugar de Divider
// const WaveSep = () => (
//   <div className="wave-sep" aria-hidden="true">
//     <svg viewBox="0 0 1200 80" preserveAspectRatio="none">
//       <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z"></path>
//     </svg>
//   </div>
// );

export default function HomeScreen() {
  /* Datos para el mapa/lista */
  const BRANCHES_MAP = Object.freeze([
    {
      id: 1,
      name: "Calle Pino Suárez",
      address: "Calle Pino Suárez, Durango, Dgo.",
      hours: "09:00 - 19:00",
      lat: 24.0236,
      lng: -104.6700,
    },
    {
      id: 2,
      name: "Calle Las Flores",
      address: "Calle Las Flores, Durango, Dgo.",
      hours: "09:00 - 19:00",
      lat: 24.0280,
      lng: -104.6600,
    },
  ]);
  const INITIAL_BRANCH_ID = BRANCHES_MAP[0].id;

  function FlyTo({ center, zoom = 14 }) {
    const map = useMap();
    useEffect(() => { if (center) map.flyTo(center, zoom, { duration: 0.8 }); }, [center, zoom, map]);
    return null;
  }

  function BranchItem({ branch, active, onSelect }) {
    const handleKeyDown = useCallback((e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(branch.id); }
    }, [branch.id, onSelect]);

    return (
      <li
        className={`branch-item ${active ? "is-active" : ""}`}
        onClick={() => onSelect(branch.id)}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-pressed={active}
      >
        <div className="branch-name">{branch.name}</div>
        <div className="branch-meta">
          <span className="branch-addr">{branch.address}</span>
          <span className="branch-hours">{branch.hours}</span>
        </div>
        <button className="btn small" type="button">Ver en mapa</button>
      </li>
    );
  }

  const [selectedId, setSelectedId] = useState(INITIAL_BRANCH_ID);
  const selected = useMemo(() => BRANCHES_MAP.find((b) => b.id === selectedId), [selectedId]);
  const center = useMemo(() => [selected.lat, selected.lng], [selected.lat, selected.lng]);
  const handleSelect = useCallback((id) => setSelectedId(id), []);

  return (
    <main className="home-page">
      {/* HERO principal */}
      <section className="hero-banner full-bleed">
        <div className="hero-inner">
          <h1 className="hero-title">Expendio El Pollo</h1>
          <p className="hero-sub">El mejor sabor de la ciudad solo lo encuentras aquí</p>
          <Link to="/recetario" className="hero-cta">Ver Menú</Link>
        </div>
      </section>

      {/* ¿Por qué elegirnos? */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">Nuestro valor</span>
          <h2 className="section-title">¿Por qué elegir Expendio El Pollo?</h2>
          <div className="features">
            <div className="feature">
              <div className="feature-emoji">🍗</div>
              <h3>Calidad Premium</h3>
              <p>Pollos a granel frescos seleccionados diariamente</p>
            </div>
            <div className="feature">
              <div className="feature-emoji">⚡</div>
              <h3>Entrega Rápida</h3>
              <p>Tu pedido listo en minutos</p>
            </div>
            <div className="feature">
              <div className="feature-emoji">⭐</div>
              <h3>Sabor Único</h3>
              <p>Receta familiar tradicional</p>
            </div>
          </div>
        </div>
      </section>

      {/* Separación natural */}
      <Divider />

      {/* Horarios */}
      <section className="section-hours">
        <div className="container">
          <h2 className="hours-title">Horarios de Atención</h2>
          <p className="hours-days">Lunes a Domingo</p>
          <p className="hours-time">10:00 AM - 10:00 PM</p>
        </div>
      </section>

      {/* Otra separación natural */}
      <Divider />

      {/* Título + mapa en la MISMA sección (compacto y elegante) */}
      <section className="section full-bleed suc-block">
        <div className="container">
          <h2 className="section-title">Descubre nuestras sucursales</h2>
        </div>

        <div className="suc-content">
          <div className="suc-map">
            <MapContainer
              center={center}
              zoom={13}
              scrollWheelZoom={false}
              className="leaflet-container-fixed"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {BRANCHES_MAP.map((b) => (
                <Marker key={b.id} position={[b.lat, b.lng]}>
                  <Popup>
                    <strong>{b.name}</strong><br />
                    {b.address}<br />
                    <small>{b.hours}</small>
                  </Popup>
                </Marker>
              ))}
              <FlyTo center={center} />
            </MapContainer>
          </div>

          <aside className="suc-list">
            <h2 className="suc-title">Sucursales</h2>
            <ul className="branch-list">
              {BRANCHES_MAP.map((b) => (
                <BranchItem
                  key={b.id}
                  branch={b}
                  active={b.id === selectedId}
                  onSelect={handleSelect}
                />
              ))}
            </ul>

            <h2 className="suc-title">Contacto</h2>
            <div className="contact-lines">
              <div className="contact-line">
                <span className="contact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v2.98a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h2.98a2 2 0 0 1 2 1.72c.12.89.31 1.76.57 2.59a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.49-1.14a2 2 0 0 1 2.11-.45c.83.26 1.7.45 2.59.57A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <a className="contact-text" href="tel:5551233456">555-123-3456</a>
              </div>

              <div className="contact-line">
                <span className="contact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </span>
                <a className="contact-text" href="mailto:pollo@gmail.com">pollo@gmail.com</a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
