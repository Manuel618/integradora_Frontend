import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import "../styles/Promociones.css"; // estilos SOLO de promociones

// Imágenes (cards)
import alitaNatural from "../assets/alitaNatural.jpg";
import hamburguesa from "../assets/hamburguesa.jpg";
import papas from "../assets/papas.jpg";
import pollo from "../assets/pollo.jpg";
import pechuga from "../assets/pechuga.jpg";

// Imagen para el HERO (definida en JSX, no en CSS)
import polloFrito from "../assets/pollo_frito.jpg";

/* ───────────── Datos ───────────── */
const PRODUCTS = Object.freeze([
  { id: 1, name: "Alita natural",     price: 95,  unit: "kg", img: alitaNatural, cat: "fresco",    discount: 20 },
  { id: 2, name: "Hamburguesa",       price: 60,  unit: "pz", img: hamburguesa,  cat: "congelado", discount: 15 },
  { id: 3, name: "Papas",             price: 40,  unit: "kg", img: papas,        cat: "frito",     discount: 10 },
  { id: 4, name: "Pollo entero",      price: 80,  unit: "kg", img: pollo,        cat: "fresco",    discount: 10 },
  { id: 5, name: "Pechuga sin hueso", price: 170, unit: "kg", img: pechuga,      cat: "congelado", discount: 30 },
]);

const TABS = Object.freeze([
  { key: "congelado", label: "Congelado" },
  { key: "fresco",    label: "Fresco"    },
  { key: "frito",     label: "Frito"     },
]);

const INITIAL_TAB = "congelado";

/* ───────────── Helpers ───────────── */
const normalizeText = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const moneyMXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function Promociones() {
  const [tab, setTab] = useState(INITIAL_TAB);
  const [params] = useSearchParams();

  const rawQuery = params.get("q") || "";
  const normalizedQuery = useMemo(() => normalizeText(rawQuery.trim()), [rawQuery]);

  const items = useMemo(() => {
    if (normalizedQuery) {
      // Búsqueda sobre todo el catálogo (name/cat/unit)
      return PRODUCTS.filter((p) => {
        const bag = normalizeText([p.name, p.cat, p.unit].filter(Boolean).join(" "));
        return bag.includes(normalizedQuery);
      });
    }
    // Sin búsqueda: respeta pestaña
    return PRODUCTS.filter((p) => p.cat === tab);
  }, [tab, normalizedQuery]);

  // Mantiene la animación al cambiar tab o query
  const gridKey = normalizedQuery ? `search-${normalizedQuery}` : tab;

  return (
    <div className="home-page promo-page">
      {/* Hero: fondo movido del CSS al JSX con 'pollo_frito' */}
      <section
        className="hero-banner"
        style={{
          background:
            `linear-gradient(0deg, rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${polloFrito}) center/cover no-repeat`,
        }}
        aria-label="Promociones destacadas"
      >
        <div className="hero-overlay">
         
        </div>
      </section>

      {/* Promociones + Tabs */}
      <section className="catalog">
        <div className="catalog-top">
          <h2>Promociones</h2>

          <div className="tabs" role="tablist" aria-label="Categorías en promoción">
            {TABS.map(({ key, label }) => {
              const active = tab === key;
              return (
                <button
                  key={key}
                  className={`tab ${active ? "active" : ""}`}
                  onClick={() => setTab(key)}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`promo-panel-${key}`}
                  title={`Ver ${label}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid con animación */}
        <div id={`promo-panel-${gridKey}`} key={gridKey} className="product-grid animate-in" role="region" aria-live="polite">
          {items.map((p, idx) => {
            const off = Number.isFinite(p.discount) ? p.discount : 0;
            const finalPrice = Math.max(0, p.price * (1 - off / 100));

            return (
              <article className="product-card" key={p.id} style={{ "--i": idx }}>
                <div className="product-img">
                  <img src={p.img} alt={p.name} loading="lazy" />
                </div>

                <h3 className="product-title">{p.name}</h3>

                {/* Precios: original tachado, promo y porcentaje */}
                <div className="price-box">
                  <div className="price-old">
                    {moneyMXN.format(p.price)} <span>{p.unit}</span>
                  </div>
                  <div className="price-new">
                    {moneyMXN.format(finalPrice)} <span>{p.unit}</span>
                  </div>
                  <div className="price-note">-{off}%</div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
