import { useMemo, useState } from "react";
import "../styles/HomeScreen.css";

// importa tus imágenes
import alitaNatural from "../assets/alitaNatural.jpg";
import hamburguesa from "../assets/hamburguesa.jpg";
import papas from "../assets/papas.jpg";
import pollo from "../assets/pollo.jpg";
import pechuga from "../assets/pechuga.jpg";

// catálogo
const PRODUCTS = [
  { id: 1, name: "Alita natural",      price: 95,  unit: "kg", img: alitaNatural, cat: "fresco"     },
  { id: 2, name: "Hamburguesa",        price: 60,  unit: "pz", img: hamburguesa,  cat: "congelado"  },
  { id: 3, name: "Papas",              price: 40,  unit: "kg", img: papas,        cat: "frito"      },
  { id: 4, name: "Pollo entero",       price: 80,  unit: "kg", img: pollo,        cat: "fresco"     },
  { id: 5, name: "Pechuga sin hueso",  price: 170, unit: "kg", img: pechuga,      cat: "congelado"  },
];

const TABS = [
  { key: "congelado", label: "Congelado" },
  { key: "fresco",    label: "Fresco"    },
  { key: "frito",     label: "Frito"     },
];

export default function HomeScreen() {
  const [tab, setTab] = useState("congelado");
  const items = useMemo(() => PRODUCTS.filter(p => p.cat === tab), [tab]);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-banner">
        <div className="hero-overlay">
          <h1>Descubre<br/>nuestras recetas</h1>
        </div>
      </section>

      {/* Recetario digital + Tabs */}
      <section className="catalog">
        <div className="catalog-top">
          <h2>Recetario digital</h2>

          <div className="tabs">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`tab ${tab === t.key ? "active" : ""}`}
                onClick={() => setTab(t.key)}
                type="button"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de productos con animación al cambiar de tab */}
        <div key={tab} className="product-grid animate-in">
          {items.map((p, idx) => (
            <article className="product-card" key={p.id} style={{ "--i": idx }}>
              <div className="product-img">
                <img src={p.img} alt={p.name} />
              </div>
              <h3 className="product-title">{p.name}</h3>
              <div className="product-price">
                ${p.price.toFixed(2)} <span>{p.unit}</span>
              </div>
            </article>
          ))}
        </div>

        {/* CTA inferior */}
        <div className="buy-cta-wrap">
          <a href="#comprar" className="buy-cta">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M7 4h-2l-1 2v1h2l3.6 7.59-1.35 2.44A2 2 0 0 0 10 20h9v-2h-9l1.1-2h6.45a2 2 0 0 0 1.79-1.11L22 9H7.42l-.72-1.45L6.16 6H21V4H7Z" fill="currentColor"/>
            </svg>
            Comprar ahora
          </a>
        </div>
      </section>
    </div>
  );
}
