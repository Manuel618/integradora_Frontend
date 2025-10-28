// src/components/Sucursales.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import "../styles/Sucursales.css";

/* Leaflet (mapa) */
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

/* Imagen para el hero (definida en JSX, no en CSS) */
import sucursalesHero from "../assets/pollo_frito.jpg";

/* Configurar íconos por defecto de Leaflet (una sola vez por módulo) */
let _leafletIconsPatched = false;
if (!_leafletIconsPatched) {
  L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });
  _leafletIconsPatched = true;
}

/* ───────────────────────── Datos ───────────────────────── */
const BRANCHES = Object.freeze([
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

const INITIAL_BRANCH_ID = BRANCHES[0].id;

/* ───────────────────────── Helpers ───────────────────────── */
function FlyTo({ center, zoom = 14 }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { duration: 0.8 });
  }, [center, zoom, map]);
  return null;
}

/* Item de lista (clicable + accesible) */
function BranchItem({ branch, active, onSelect }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(branch.id);
      }
    },
    [branch.id, onSelect]
  );

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
      <button className="btn small" type="button">
        Ver en mapa
      </button>
    </li>
  );
}

/* ───────────────────────── Página ───────────────────────── */
export default function Sucursales() {
  const [selectedId, setSelectedId] = useState(INITIAL_BRANCH_ID);

  const selected = useMemo(
    () => BRANCHES.find((b) => b.id === selectedId),
    [selectedId]
  );

  const center = useMemo(() => [selected.lat, selected.lng], [selected.lat, selected.lng]);

  const handleSelect = useCallback((id) => setSelectedId(id), []);

  return (
    <div className="suc-page">
      {/* Hero: fondo movido del CSS al JSX */}
      <section
        className="suc-hero"
        style={{
          background: `linear-gradient(0deg, rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${sucursalesHero}) center/cover no-repeat`,
        }}
      >
        <div className="hero-overlay">
          <h1>
            Descubre
            <br />
            nuestras sucursales
          </h1>
        </div>
      </section>

      {/* Contenido: Mapa (izq) + Lista (der) */}
      <section className="suc-content">
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

            {BRANCHES.map((b) => (
              <Marker key={b.id} position={[b.lat, b.lng]}>
                <Popup>
                  <strong>{b.name}</strong>
                  <br />
                  {b.address}
                  <br />
                  <small>{b.hours}</small>
                </Popup>
              </Marker>
            ))}

            {/* Vuelo suave al seleccionar otra sucursal */}
            <FlyTo center={center} />
          </MapContainer>
        </div>

        <aside className="suc-list">
          <h2 className="suc-title">Sucursales</h2>

          <ul className="branch-list">
            {BRANCHES.map((b) => (
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
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v2.98a2 2 0 0 1-2.18 2
                           19.8 19.8 0 0 1-8.63-3.07
                           19.5 19.5 0 0 1-6-6
                           19.8 19.8 0 0 1-3.07-8.63
                           A2 2 0 0 1 4.11 2h2.98a2 2 0 0 1 2 1.72
                           c.12.89.31 1.76.57 2.59a2 2 0 0 1-.45 2.11L8.09 9.91
                           a16 16 0 0 0 6 6l1.49-1.14a2 2 0 0 1 2.11-.45
                           c.83.26 1.7.45 2.59.57A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <a className="contact-text" href="tel:5551233456">
                555-123-3456
              </a>
            </div>

            <div className="contact-line">
              <span className="contact-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </span>
              <a className="contact-text" href="mailto:pollo@gmail.com">
                pollo@gmail.com
              </a>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
