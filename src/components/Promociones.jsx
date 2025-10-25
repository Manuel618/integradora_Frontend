import { useMemo, useState } from "react";

import "../styles/Promociones.css";       // estilos SOLO de promociones

// Imágenes
import alitaNatural from "../assets/alitaNatural.jpg";
import hamburguesa from "../assets/hamburguesa.jpg";
import papas from "../assets/papas.jpg";
import pollo from "../assets/pollo.jpg";
import pechuga from "../assets/pechuga.jpg";

// Catálogo con descuentos (en %)
const PRODUCTS = [
  { id: 1, name: "Alita natural",     price: 95,  unit: "kg", img: alitaNatural, cat: "fresco",    discount: 20 },
  { id: 2, name: "Hamburguesa",       price: 60,  unit: "pz", img: hamburguesa,  cat: "congelado", discount: 15 },
  { id: 3, name: "Papas",             price: 40,  unit: "kg", img: papas,        cat: "frito",     discount: 10 },
  { id: 4, name: "Pollo entero",      price: 80,  unit: "kg", img: pollo,        cat: "fresco",    discount: 10 },
  { id: 5, name: "Pechuga sin hueso", price: 170, unit: "kg", img: pechuga,      cat: "congelado", discount: 30 },
];

const TABS = [
  { key: "congelado", label: "Congelado" },
  { key: "fresco",    label: "Fresco"    },
  { key: "frito",     label: "Frito"     },
];

const money = (n) => n.toFixed(2);

export default function Promociones() {
  const [tab, setTab] = useState("congelado");
  const items = useMemo(() => PRODUCTS.filter(p => p.cat === tab), [tab]);

  return (
    <div className="home-page promo-page">
      {/* Hero */}
      <section className="hero-banner">
        <div className="hero-overlay">
          <h1>Descubre<br/>nuestras promociones</h1>
        </div>
      </section>

      {/* Promociones + Tabs */}
      <section className="catalog">
        <div className="catalog-top">
          <h2>Promociones</h2>

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

        {/* Grid con animación */}
        <div key={tab} className="product-grid animate-in">
          {items.map((p, idx) => {
            const off = p.discount ?? 20;
            const finalPrice = p.price * (1 - off / 100);
            return (
              <article className="product-card" key={p.id} style={{ "--i": idx }}>
                <div className="product-img">
                  <img src={p.img} alt={p.name} />
                </div>

                <h3 className="product-title">{p.name}</h3>

                {/* Precios: original tachado, promo verde, -% gris */}
                <div className="price-box">
                  <div className="price-old">
                    ${money(p.price)} <span>{p.unit}</span>
                  </div>
                  <div className="price-new">
                    ${money(finalPrice)} <span>{p.unit}</span>
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
