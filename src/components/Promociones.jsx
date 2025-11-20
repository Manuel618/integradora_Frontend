import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import "../styles/Promociones.css"; // estilos SOLO de promociones

// Imágenes (cards)
import alaAdob from "../assets/alaAdob.jpg"; // Ala adobada
import alitaNatural from "../assets/alitaNatural.jpg"; // Alita natural
import apla from "../assets/apla.jpg"; // Aplanado de pollo
import bate from "../assets/bate.jpg"; // Bate empanizado de pollo
import bolsaMenu from "../assets/bolsaMenu.jpg"; // Bolsa menú surtida de pollo
import Filete from "../assets/Filete.jpg"; // Filete de pollo
import frito from "../assets/frito.jpg"; // Pollo frito
import hamburguesa from "../assets/hamburguesa.jpg"; // Hamburguesa de pollo
import higado from "../assets/higado.jpg"; // Hígado de pollo
import mezquite from "../assets/mezquite.jpg"; // Pollo sabor mezquite
import molleja from "../assets/molleja.jpg"; // Molleja de pollo
import nugget from "../assets/nugget.jpg"; // Nuggets de pollo
import papas from "../assets/papas.jpg"; // Papas a la francesa
import pata from "../assets/pata.jpg"; // Pata de pollo
import pechuga from "../assets/pechuga.jpg"; // Pechuga de pollo
import picosita from "../assets/picosita.jpg"; // Pechuga picosita
import piernitaAdob from "../assets/piernitaAdob.jpg"; // Piernita adobada
import pollo from "../assets/pollo.jpg"; // Pollo entero
import pym from "../assets/pym.jpg"; // Pierna y muslo (PyM)
import tender from "../assets/tender.jpg"; // Tenders de pollo

// Imagen para el HERO (definida en JSX, no en CSS)
import polloFrito from "../assets/pollo_frito.jpg";

/* ───────────── Datos ───────────── */
const PRODUCTS = Object.freeze([
  { id: 1,  name: "Alita de pollo",               price: 95,  unit: "kg", img: alitaNatural,  cat: "fresco",     discount: 5 },
  { id: 2,  name: "Hamburguesa de pollo",         price: 60,  unit: "pz", img: hamburguesa,   cat: "congelado",  discount: 5 },
  { id: 3,  name: "Papas a la francesa",          price: 40,  unit: "kg", img: papas,         cat: "frito",      discount: 5 },
  { id: 4,  name: "Pollo entero",                 price: 80,  unit: "kg", img: pollo,         cat: "fresco",     discount: 0 },
  { id: 5,  name: "Pechuga de pollo sin hueso",   price: 170, unit: "kg", img: pechuga,       cat: "congelado",  discount: 5 },
  { id: 6,  name: "Ala adobada de pollo",         price: 105, unit: "kg", img: alaAdob,       cat: "fresco",     discount: 5 },
  { id: 7,  name: "Aplanado de pollo",            price: 120, unit: "kg", img: apla,          cat: "congelado",  discount: 5 },
  { id: 8,  name: "Bate empanizado de pollo",     price: 115, unit: "kg", img: bate,          cat: "congelado",  discount: 5 },
  { id: 9,  name: "Bolsa de menudencias",         price: 90,  unit: "kg", img: bolsaMenu,     cat: "fresco",     discount: 5 },
  { id: 10, name: "Filete de pollo",              price: 160, unit: "kg", img: Filete,        cat: "fresco",     discount: 0 },
  { id: 11, name: "Pollo frito",                  price: 25,  unit: "pz", img: frito,         cat: "frito",      discount: 5 },
  { id: 12, name: "Hígado de pollo",              price: 60,  unit: "kg", img: higado,        cat: "fresco",     discount: 5 },
  { id: 13, name: "Pollo sabor mezquite",         price: 110, unit: "kg", img: mezquite,      cat: "fresco",     discount: 5 },
  { id: 14, name: "Molleja de pollo",             price: 55,  unit: "kg", img: molleja,       cat: "fresco",     discount: 0 },
  { id: 15, name: "Nuggets de pollo",             price: 75,  unit: "kg", img: nugget,        cat: "congelado",  discount: 5 },
  { id: 16, name: "Pata de pollo",                price: 45,  unit: "kg", img: pata,          cat: "fresco",     discount: 5 },
  { id: 17, name: "Pechuga picosita de pollo",    price: 180, unit: "kg", img: picosita,      cat: "fresco",     discount: 5 },
  { id: 18, name: "Piernita adobada de pollo",    price: 100, unit: "kg", img: piernitaAdob,  cat: "fresco",     discount: 0 },
  { id: 19, name: "Pierna y muslo de pollo",      price: 85,  unit: "kg", img: pym,           cat: "fresco",     discount: 5 },
  { id: 20, name: "Tenders de pollo",             price: 130, unit: "kg", img: tender,        cat: "congelado",  discount: 0 },
]);

// Orden de pestañas: primero Fresco, luego Congelado, luego Frito
const TABS = Object.freeze([
  { key: "fresco",    label: "Fresco"    },
  { key: "congelado", label: "Congelado" },
  { key: "frito",     label: "Frito"     },
]);

// Pestaña inicial: fresco
const INITIAL_TAB = "fresco";

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
  const normalizedQuery = useMemo(
    () => normalizeText(rawQuery.trim()),
    [rawQuery]
  );

  const items = useMemo(() => {
    if (normalizedQuery) {
      // Búsqueda sobre todo el catálogo (name/cat/unit)
      return PRODUCTS.filter((p) => {
        const bag = normalizeText(
          [p.name, p.cat, p.unit].filter(Boolean).join(" ")
        );
        return bag.includes(normalizedQuery);
      });
    }

    // Sin búsqueda: respeta pestaña seleccionada
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
          background: `linear-gradient(0deg, rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${polloFrito}) center/cover no-repeat`,
        }}
        aria-label="Promociones destacadas"
      >
        <div className="hero-overlay"></div>
      </section>

      {/* Promociones + Tabs */}
      <section className="catalog">
        <div className="catalog-top">
          <h2>Promociones</h2>

          <div
            className="tabs"
            role="tablist"
            aria-label="Categorías en promoción"
          >
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
        <div
          id={`promo-panel-${gridKey}`}
          key={gridKey}
          className="product-grid animate-in"
          role="region"
          aria-live="polite"
        >
          {items.map((p, idx) => {
            return (
              <article
                className="product-card"
                key={p.id}
                style={{ "--i": idx }}
              >
                <div className="product-img">
                  <img src={p.img} alt={p.name} loading="lazy" />
                </div>

                <h3 className="product-title">{p.name}</h3>

                {/* SOLO precio original */}
                <div className="price-box">
                  <div className="price-main">
                    {moneyMXN.format(p.price)} <span>{p.unit}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
