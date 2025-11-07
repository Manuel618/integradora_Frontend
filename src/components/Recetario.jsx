import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/Recetario.css";

/* Imágenes */
import alitaNatural from "../assets/alitaNatural.jpg";
import hamburguesa from "../assets/hamburguesa.jpg";
import papas from "../assets/papas.jpg";
import pollo from "../assets/pollo.jpg";
import pollo_frito from "../assets/pollo_frito.jpg"; // Hero background
import pechuga from "../assets/3365t8.jpeg";

/* Datos de ejemplo */
const PRODUCTS = Object.freeze([
  { id: 1, name: "Alita natural",     price: 95,  unit: "kg", img: alitaNatural, desc: "Marinado ligero y jugoso." },
  { id: 2, name: "Hamburguesa",       price: 60,  unit: "pz", img: hamburguesa, desc: "Carne 100% seleccionada." },
  { id: 3, name: "Papas",             price: 40,  unit: "kg", img: papas, desc: "Crujientes por fuera, suaves por dentro." },
  { id: 4, name: "Pollo entero",      price: 80,  unit: "kg", img: pollo, desc: "Ideal para asados familiares." },
  { id: 5, name: "Pechuga sin hueso", price: 170, unit: "kg", img: pechuga, desc: "Baja en grasa y muy tierna." },
]);

/* Recetas rápidas para el modal */
const RECIPES = {
  1: {
    ingredients: [
      "1 kg de alitas",
      "2 cdas salsa de soya",
      "2 cdas miel",
      "1 cda aceite",
      "Sal y pimienta",
    ],
    steps: [
      "Mezcla soya, miel, aceite, sal y pimienta.",
      "Barniza y marina 20 minutos.",
      "Hornea 25–30 min a 200°C o fríe hasta dorar.",
      "Sirve con tu dip favorito.",
    ],
  },
  2: {
    ingredients: [
      "1 carne para hamburguesa",
      "1 pan",
      "Queso, lechuga, jitomate",
      "Mostaza o mayo",
      "Sal y pimienta",
    ],
    steps: [
      "Sazona la carne.",
      "Sella 3–4 min por lado.",
      "Monta con queso y vegetales.",
      "Agrega la salsa y ¡listo!",
    ],
  },
  3: {
    ingredients: [
      "500 g de papas",
      "Aceite para freír",
      "Sal",
      "Pimienta/paprika (opcional)",
    ],
    steps: [
      "Corta en bastones y enjuaga.",
      "Seca bien y fríe a 170–175°C.",
      "Escurre y sazona.",
    ],
  },
  4: {
    ingredients: [
      "1 pollo entero",
      "2 dientes de ajo",
      "1 cda mantequilla",
      "Hierbas, sal, pimienta",
      "Jugo de 1 limón",
    ],
    steps: [
      "Unta mezcla de mantequilla, ajo, limón y hierbas.",
      "Hornea a 190°C por 60–75 min (75°C internos).",
      "Reposa 10 min y porciona.",
    ],
  },
  5: {
    ingredients: [
      "500 g pechuga sin hueso",
      "1 cda aceite de oliva",
      "Sal y pimienta",
      "Jugo de 1/2 limón",
    ],
    steps: [
      "Sazona y rocía con limón.",
      "Sella 4–5 min por lado.",
      "Reposa 3 min y rebana.",
    ],
  },
};

/* Utils */
const normalizeText = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const moneyMXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function HomeScreen() {
  const [params] = useSearchParams();
  const rawQuery = params.get("q") || "";
  const normalizedQuery = useMemo(() => normalizeText(rawQuery.trim()), [rawQuery]);

  const items = useMemo(() => {
    if (normalizedQuery) {
      return PRODUCTS.filter((p) => normalizeText(p.name).includes(normalizedQuery));
    }
    return PRODUCTS;
  }, [normalizedQuery]);

  /* ===== Modal ===== */
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const onOpen = (product) => {
    setSelected(product);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setSelected(null);
  };

  // Cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="recetario">
      <section
        className="hero-banner"
        style={{
          background: `linear-gradient(0deg, rgba(0,0,0,.20), rgba(0,0,0,.20)), url(${pollo_frito}) center/cover no-repeat`,
        }}
        aria-label="Destacados"
      />

      <section className="section-head">
        <h1 className="page-title">Recetario</h1>
        <p className="page-subtitle">Explora nuestras recetas y platillos.</p>
      </section>

      <section className="catalog">
        <div className="product-grid" role="region" aria-live="polite">
          {items.map((p) => (
            <article
              className="product-card"
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpen(p)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(p)}
            >
              <div className="product-img">
                <img src={p.img} alt={p.name} loading="lazy" />
              </div>

              <div className="product-body">
                <h3 className="product-title">{p.name}</h3>
                <p className="product-desc">{p.desc}</p>

                <div className="product-footer">
                  <div className="product-price">
                    <span className="price-value">{moneyMXN.format(p.price)}</span>
                    <span className="price-unit">/{p.unit}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

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

      {/* ===== Ventana flotante ===== */}
      {open && selected && (
        <div
          className="rx-modal-backdrop"
          onClick={(e) => {
            if (e.target.classList.contains("rx-modal-backdrop")) onClose();
          }}
        >
          <article className="rx-modal" role="dialog" aria-modal="true" aria-label={`Receta de ${selected.name}`}>
            <div className="rx-modal-hero">
              <img src={selected.img} alt={selected.name} />
            </div>

            <header className="rx-modal-header">
              <h2>{selected.name}</h2>
              <button className="rx-modal-close" type="button" aria-label="Cerrar" onClick={onClose}>
                ✕
              </button>
            </header>

            <section className="rx-modal-body">
              <div className="rx-col">
                <h3>Ingredientes</h3>
                <ul>
                  {(RECIPES[selected.id]?.ingredients ?? ["—"]).map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              </div>

              <div className="rx-col">
                <h3>Preparación</h3>
                <ol>
                  {(RECIPES[selected.id]?.steps ?? ["—"]).map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ol>
              </div>
            </section>

            <footer className="rx-modal-footer">
              <div className="rx-price">
                {moneyMXN.format(selected.price)}
                <span>/{selected.unit}</span>
              </div>
              <button type="button" className="rx-primary" onClick={onClose}>
                Entendido
              </button>
            </footer>
          </article>
        </div>
      )}
    </div>
  );
}
