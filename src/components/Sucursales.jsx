import { useEffect, useMemo, useState } from "react";
import "../styles/Sucursales.css";

/* Leaflet (mapa) */
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

/* Sucursales (Durango) */
const branches = [
  {
    id: 1,
    name: "Calle Pino Suárez",
    address: "Calle Pino Suárez, Durango, Dgo.",
    hours: "09:00 - 19:00",
    lat: 24.0236,
    lng: -104.6700
  },
  {
    id: 2,
    name: "Calle Las Flores",
    address: "Calle Las Flores, Durango, Dgo.",
    hours: "09:00 - 19:00",
    lat: 24.0280,
    lng: -104.6600
  },
];

/* Vuela al punto seleccionado */
function FlyTo({ center, zoom = 14 }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { duration: 0.8 });
  }, [center, zoom, map]);
  return null;
}

export default function Sucursales() {
  const [selectedId, setSelectedId] = useState(branches[0].id);
  const selected = useMemo(() => branches.find(b => b.id === selectedId), [selectedId]);

  return (
    <div className="suc-page">
      {/* Hero */}
      <section className="suc-hero">
        <div className="hero-overlay">
          <h1>Descubre<br/>nuestras sucursales</h1>
        </div>
      </section>

      {/* Contenido: Mapa (izq) + Lista (der) */}
      <section className="suc-content">
        <div className="suc-map">
          <MapContainer
            center={[selected.lat, selected.lng]}
            zoom={13}
            scrollWheelZoom={false}
            className="leaflet-container-fixed"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {branches.map(b => (
              <Marker key={b.id} position={[b.lat, b.lng]}>
                <Popup>
                  <strong>{b.name}</strong><br />
                  {b.address}<br />
                  <small>{b.hours}</small>
                </Popup>
              </Marker>
            ))}
            <FlyTo center={[selected.lat, selected.lng]} />
          </MapContainer>
        </div>

        <aside className="suc-list">
          <h2 className="suc-title">Sucursales</h2>

          <ul className="branch-list">
            {branches.map(b => (
              <li
                key={b.id}
                className={`branch-item ${b.id === selectedId ? "is-active" : ""}`}
                onClick={() => setSelectedId(b.id)}
              >
                <div className="branch-name">{b.name}</div>
                <div className="branch-meta">
                  <span className="branch-addr">{b.address}</span>
                  <span className="branch-hours">{b.hours}</span>
                </div>
                <button className="btn small">Ver en mapa</button>
              </li>
            ))}
          </ul>

          {/* Contacto con iconos (como en tu imagen) */}
          <h2 className="suc-title">Contacto</h2>
          <div className="contact-lines">
            <div className="contact-line">
              <span className="contact-icon" aria-hidden="true">
                {/* Teléfono (trazo naranja) */}
                <svg viewBox="0 0 24 24" width="24" height="24"
                     fill="none" stroke="currentColor" strokeWidth="2.2"
                     strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v2.98a2 2 0 0 1-2.18 2
                           19.8 19.8 0 0 1-8.63-3.07
                           19.5 19.5 0 0 1-6-6
                           19.8 19.8 0 0 1-3.07-8.63
                           A2 2 0 0 1 4.11 2h2.98a2 2 0 0 1 2 1.72
                           c.12.89.31 1.76.57 2.59a2 2 0 0 1-.45 2.11L8.09 9.91
                           a16 16 0 0 0 6 6l1.49-1.14a2 2 0 0 1 2.11-.45
                           c.83.26 1.7.45 2.59.57A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <a className="contact-text" href="tel:5551233456">555-123-3456</a>
            </div>

            <div className="contact-line">
              <span className="contact-icon" aria-hidden="true">
                {/* Correo (sobre naranja) */}
                <svg viewBox="0 0 24 24" width="24" height="24"
                     fill="none" stroke="currentColor" strokeWidth="2.2"
                     strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" ry="2"/>
                  <path d="M3 7l9 6 9-6"/>
                </svg>
              </span>
              <a className="contact-text" href="mailto:pollo@gmail.com">pollo@gmail.com</a>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
