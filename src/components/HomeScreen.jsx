import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/HomeScreen.css";

/** ───────────── Assets (recomendado: evitar espacios en nombres de archivo) ─────────────
 * Si puedes, renombra "pollo frito.jpg" a "pollo-frito.jpg" y actualiza el import.
 */
import alitaNatural from "../assets/alitaNatural.jpg";
import hamburguesa from "../assets/hamburguesa.jpg";
import papas from "../assets/papas.jpg";
import pollo from "../assets/pollo.jpg";
import pollo_frito from "../assets/pollo_frito.jpg"; // Hero background
import pechuga from "../assets/pechuga.jpg";

/** ───────────── Catálogo y tabs ───────────── */
const PRODUCTS = Object.freeze([
  { id: 1, name: "Alita natural",     price: 95,  unit: "kg", img: alitaNatural, cat: "fresco"     },
  { id: 2, name: "Hamburguesa",       price: 60,  unit: "pz", img: hamburguesa,  cat: "congelado"  },
  { id: 3, name: "Papas",             price: 40,  unit: "kg", img: papas,        cat: "frito"      },
  { id: 4, name: "Pollo entero",      price: 80,  unit: "kg", img: pollo,        cat: "fresco"     },
  { id: 5, name: "Pechuga sin hueso", price: 170, unit: "kg", img: pechuga,      cat: "congelado"  },
]);

const TABS = Object.freeze([
  { key: "congelado", label: "Congelado" },
  { key: "fresco",    label: "Fresco"    },
  { key: "frito",     label: "Frito"     },
]);

const INITIAL_TAB = "congelado";

/** ───────────── Utils ───────────── */
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

export default function HomeScreen() {
  const [tab, setTab] = useState(INITIAL_TAB);
  const [params] = useSearchParams();

  // Query en URL (?q=) -> búsqueda por nombre
  const rawQuery = params.get("q") || "";
  const normalizedQuery = useMemo(() => normalizeText(rawQuery.trim()), [rawQuery]);

  // Lista mostrada: si hay búsqueda, ignora pestaña; si no, filtra por pestaña
  const items = useMemo(() => {
    if (normalizedQuery) {
      return PRODUCTS.filter((p) => normalizeText(p.name).includes(normalizedQuery));
    }
    return PRODUCTS.filter((p) => p.cat === tab);
  }, [tab, normalizedQuery]);

  // Clave para animación cuando cambian tab o query (sin afectar el layout)
  const gridKey = normalizedQuery ? `search-${normalizedQuery}` : tab;

  return (
    <div className="home-page">
      {/* Hero: imagen movida al JSX */}
      <section
        className="hero-banner"
        style={{
          background: `linear-gradient(0deg, rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${pollo_frito}) center/cover no-repeat`,
        }}
        aria-label="Destacados"
      >
        <div className="hero-overlay">
          <h1>
            Descubre
            <br />
            nuestras recetas
          </h1>
        </div>
      </section>

      {/* Recetario digital + Tabs */}
      <section className="catalog">
        <div className="catalog-top">
          <h2>Recetario digital</h2>

          <div className="tabs" role="tablist" aria-label="Categorías de productos">
            {TABS.map(({ key, label }) => {
              const active = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  className={`tab ${active ? "active" : ""}`}
                  onClick={() => setTab(key)}
                  role="tab"
                  aria-selected={active}
                  aria-controls={`panel-${key}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de productos */}
        <div id={`panel-${gridKey}`} key={gridKey} className="product-grid animate-in" role="region" aria-live="polite">
          {items.map((p, idx) => (
            <article className="product-card" key={p.id} style={{ "--i": idx }}>
              <div className="product-img">
                <img src={p.img} alt={p.name} loading="lazy" />
              </div>
              <h3 className="product-title">{p.name}</h3>
              <div className="product-price">
                {moneyMXN.format(p.price)} <span>{p.unit}</span>
              </div>
            </article>
          ))}
        </div>

        {/* CTA inferior */}
        <div className="buy-cta-wrap">
          <a href="#comprar" className="buy-cta" aria-label="Comprar ahora">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M7 4h-2l-1 2v1h2l3.6 7.59-1.35 2.44A2 2 0 0 0 10 20h9v-2h-9l1.1-2h6.45a2 2 0 0 0 1.79-1.11L22 9H7.42l-.72-1.45L6.16 6H21V4H7Z"
                fill="currentColor"
              />
            </svg>
            Comprar ahora
          </a>
        </div>
      </section>
    </div>
  );
}
