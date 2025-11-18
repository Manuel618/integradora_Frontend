import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import "../styles/Recetario.css";

/* Imágenes nuevas */
import Pollo_a_la_crema_con_chipotle from "../assets/Pollo_a_la_crema_con_chipotle.png";
import Pollo_al_curry_con_leche_de_coco from "../assets/Pollo_al_curry_con_leche_de_coco.png";
import Pollo_al_horno_con_papas_y_verduras from "../assets/Pollo_al_horno_con_papas_y_verduras.png";
import Pollo_con_champiñones_en_crema from "../assets/Pollo_con_champiñones_en_crema.png";
import Pollo_con_papas_estilo_guisado_casero from "../assets/Pollo_con_papas_estilo_guisado_casero.png";
import Pollo_en_adobo_rojo from "../assets/Pollo_en_adobo_rojo.png";
import Pollo_en_salsa_verde from "../assets/Pollo_en_salsa_verde.png";
import Pollo_estilo_Alfredo_con_pasta from "../assets/Pollo_estilo_Alfredo_con_pasta.png";
import Pollo_frito_crujiente_estilo_KFC from "../assets/Pollo_frito_crujiente_estilo_KFC.png";
import Pollo_picosito_estilo_Buffalo_Creamy from "../assets/Pollo_picosito_estilo_Buffalo_Creamy.png";
import Pollo_teriyaki from "../assets/Pollo_teriyaki.png";
import Tinga_de_pollo from "../assets/Tinga_de_pollo.png";

/* Productos (solo estas 12 recetas, ids desde 1) */
const PRODUCTS = Object.freeze([
  { id: 1,  name: "Pollo a la crema con chipotle",           img: Pollo_a_la_crema_con_chipotle },
  { id: 2,  name: "Pollo al horno con papas y verduras",     img: Pollo_al_horno_con_papas_y_verduras },
  { id: 3,  name: "Tinga de pollo",                          img: Tinga_de_pollo },
  { id: 4,  name: "Pollo frito crujiente estilo KFC",        img: Pollo_frito_crujiente_estilo_KFC },
  { id: 5,  name: "Pollo teriyaki",                          img: Pollo_teriyaki },
  { id: 6,  name: "Pollo en salsa verde",                    img: Pollo_en_salsa_verde },
  { id: 7,  name: "Pollo al curry con leche de coco",        img: Pollo_al_curry_con_leche_de_coco },
  { id: 8,  name: "Pollo en adobo rojo",                     img: Pollo_en_adobo_rojo },
  { id: 9,  name: "Pollo con champiñones en crema",          img: Pollo_con_champiñones_en_crema },
  { id: 10, name: "Pollo estilo Alfredo con pasta",          img: Pollo_estilo_Alfredo_con_pasta },
  { id: 11, name: "Pollo con papas estilo guisado casero",   img: Pollo_con_papas_estilo_guisado_casero },
  { id: 12, name: "Pollo picosito estilo Buffalo Creamy",    img: Pollo_picosito_estilo_Buffalo_Creamy },
]);

/* Recetas para el modal (solo estas 12, ids 1–12) */
const RECIPES = {
  1: {
    // Pollo a la crema con chipotle
    ingredients: [
      "2 pechugas en cubos",
      "1 taza crema",
      "1–2 chipotles",
      "½ taza leche",
      "½ cebolla",
      "2 ajos",
      "Aceite",
      "Consomé opcional",
      "Sal y pimienta",
    ],
    steps: [
      "Corta el pollo en cubos y sazona con sal y pimienta.",
      "Sella el pollo en sartén con aceite 5–7 minutos y reserva.",
      "En la misma sartén sofríe cebolla 2 minutos y ajo 1 minuto.",
      "Licúa crema, leche, chipotle y consomé.",
      "Vierte la salsa en la sartén y agrega el pollo.",
      "Cocina a fuego medio-bajo 7–10 minutos hasta espesar.",
      "Sirve con arroz, pasta o tortillas.",
    ],
  },
  2: {
    // Pollo al horno con papas y verduras
    ingredients: [
      "4 piezas de pollo",
      "3 papas",
      "2 zanahorias",
      "1 cebolla",
      "Aceite de oliva",
      "Paprika",
      "Orégano",
      "Sal y pimienta",
    ],
    steps: [
      "Precalienta el horno a 200°C.",
      "Corta papas y zanahorias en cubos, cebolla en tiras.",
      "Coloca verduras en charola, agrega aceite, paprika, orégano, sal y pimienta.",
      "Acomoda el pollo encima y sazónalo igual.",
      "Cubre con aluminio y hornea 25 minutos.",
      "Retira el aluminio y hornea 20–30 minutos más para dorar.",
      "Revisa que el pollo esté bien cocido, sin partes rosadas.",
    ],
  },
  3: {
    // Tinga de pollo
    ingredients: [
      "2 pechugas cocidas y deshebradas",
      "3 jitomates",
      "2 chipotles",
      "½ cebolla",
      "1 ajo",
      "Caldo del pollo",
      "Sal",
    ],
    steps: [
      "Cuece las pechugas con sal y ajo y reserva el caldo.",
      "Licúa jitomates, chipotles, ajo, un poco de cebolla y una taza de caldo.",
      "Sofríe cebolla en julianas hasta que esté transparente.",
      "Agrega la salsa licuada y deja hervir 3–5 minutos.",
      "Incorpora el pollo deshebrado y mezcla.",
      "Cocina a fuego bajo 10 minutos para que tome sabor.",
      "Sirve en tostadas o tacos.",
    ],
  },
  4: {
    // Pollo frito crujiente estilo KFC
    ingredients: [
      "1 kg piezas de pollo",
      "2 tazas harina",
      "Paprika, ajo y cebolla en polvo",
      "Sal y pimienta",
      "1 huevo",
      "1 taza leche",
      "Aceite para freír",
    ],
    steps: [
      "Sazona el pollo con sal y pimienta y deja reposar 10 minutos (opcional).",
      "Mezcla la harina con las especias.",
      "Bate el huevo con la leche.",
      "Empaniza: harina → huevo → harina de nuevo, presionando bien.",
      "Fríe en aceite caliente 10–12 minutos por lado a fuego medio.",
      "Escurre sobre papel absorbente.",
    ],
  },
  5: {
    // Pollo teriyaki
    ingredients: [
      "Pechuga en cubos",
      "Salsa de soya",
      "Azúcar o miel",
      "Vinagre",
      "Ajo",
      "Jengibre",
      "Agua",
    ],
    steps: [
      "Mezcla soya, azúcar, vinagre, agua, ajo picado y jengibre.",
      "Sella el pollo en sartén hasta que pierda lo rosado.",
      "Agrega la salsa y baja el fuego.",
      "Cocina 8 minutos moviendo hasta que espese y brille.",
      "Sirve con arroz blanco.",
    ],
  },
  6: {
    // Pollo en salsa verde
    ingredients: [
      "Pollo",
      "Tomates verdes",
      "Chile serrano",
      "Cebolla",
      "Ajo",
      "Cilantro",
      "Sal",
    ],
    steps: [
      "Hierve tomates, chile, cebolla y ajo 10 minutos.",
      "Licúa con cilantro y sal.",
      "Fríe la salsa en una olla con aceite.",
      "Agrega el pollo y cocina 25 minutos a fuego medio.",
      "Sirve con frijoles y arroz.",
    ],
  },
  7: {
    // Pollo al curry con leche de coco
    ingredients: [
      "2 pechugas en cubos",
      "1 lata de leche de coco",
      "1 cda curry",
      "1 cdta cúrcuma (opcional)",
      "½ cebolla picada",
      "2 ajos picados",
      "1 cda aceite",
      "Sal y pimienta",
    ],
    steps: [
      "Sofríe cebolla en aceite 2 minutos.",
      "Agrega ajo y cocina 1 minuto.",
      "Añade el pollo y dora hasta que esté blanco por fuera.",
      "Incorpora curry y cúrcuma y mezcla.",
      "Vierte la leche de coco y mezcla bien.",
      "Cocina a fuego medio 10–12 minutos hasta espesar.",
      "Sirve con arroz blanco o jazmín.",
    ],
  },
  8: {
    // Pollo en adobo rojo
    ingredients: [
      "4 piezas de pollo",
      "3 chiles guajillo",
      "2 chiles ancho",
      "3 jitomates",
      "1 ajo",
      "¼ cebolla",
      "1 cdta orégano",
      "Sal",
      "Aceite",
    ],
    steps: [
      "Limpia los chiles quitando semillas y venas.",
      "Hiérvelos 10 minutos junto con los jitomates.",
      "Licúa con ajo, cebolla, orégano, sal y un poco del agua de cocción.",
      "Cuela la salsa.",
      "Dora el pollo en una olla con aceite.",
      "Agrega el adobo sobre el pollo.",
      "Cocina tapado 25–30 minutos moviendo ocasionalmente.",
    ],
  },
  9: {
    // Pollo con champiñones en crema
    ingredients: [
      "2 pechugas en tiras",
      "1 taza champiñones",
      "1 taza crema",
      "½ taza leche",
      "½ cebolla",
      "1 ajo",
      "Aceite",
      "Sal y pimienta",
    ],
    steps: [
      "Sofríe cebolla y ajo en aceite.",
      "Agrega el pollo y dora 5 minutos.",
      "Añade champiñones y cocina hasta que suelten jugo.",
      "Mezcla crema y leche y agrégalas a la sartén.",
      "Sazona con sal y pimienta.",
      "Cocina 7–10 minutos hasta espesar.",
      "Sirve con arroz o pasta.",
    ],
  },
  10: {
    // Pollo estilo Alfredo con pasta
    ingredients: [
      "Pechugas en cubos",
      "1 taza crema",
      "½ taza leche",
      "¾ taza queso parmesano",
      "2 ajos picados",
      "200 g pasta",
      "Sal y pimienta",
    ],
    steps: [
      "Cuece la pasta según instrucciones, escurre y reserva.",
      "Sofríe ajo en mantequilla o aceite 1 minuto.",
      "Agrega pollo y dóralo 5 minutos.",
      "Añade crema, leche y parmesano, mezclando bien.",
      "Cocina 3–5 minutos hasta que la salsa espese.",
      "Mezcla con la pasta cocida.",
      "Sirve con más parmesano encima si deseas.",
    ],
  },
  11: {
    // Pollo con papas estilo guisado casero
    ingredients: [
      "2 pechugas o 4 piezas de pollo",
      "3 papas en cubos",
      "2 jitomates picados",
      "¼ cebolla",
      "1 ajo",
      "Sal y pimienta",
      "1 taza agua",
      "Aceite",
    ],
    steps: [
      "Sofríe cebolla y ajo picados en una cazuela.",
      "Agrega jitomate picado y cocina 5 minutos hasta que haga salsa.",
      "Añade el pollo y dora ligeramente.",
      "Incorpora las papas en cubos y mezcla.",
      "Vierte una taza de agua y tapa.",
      "Cocina 20–25 minutos hasta que las papas estén suaves.",
    ],
  },
  12: {
    // Pollo picosito estilo Buffalo Creamy
    ingredients: [
      "2 pechugas en tiras",
      "½ taza salsa búfalo",
      "¼ taza crema",
      "2 cdas mantequilla",
      "1 cdta ajo en polvo",
      "Sal y pimienta",
    ],
    steps: [
      "Corta el pollo en tiras y sazona con sal, pimienta y ajo en polvo.",
      "Derrite mantequilla con un chorrito de aceite en sartén.",
      "Dora el pollo 5–7 minutos a fuego medio-alto.",
      "Mezcla crema con salsa búfalo aparte.",
      "Vierte la salsa sobre el pollo dorado.",
      "Cocina 3–5 minutos hasta que espese y quede cremosa.",
      "Sirve con arroz, papas o en tacos.",
    ],
  },
};

/* Utils */
const normalizeText = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function HomeScreen() {
  const [params] = useSearchParams();
  const location = useLocation();

  // Texto que viene del navbar por state (navigate("/recetario", { state: { search } }))
  const navSearch = (location.state && location.state.search) || "";
  // Texto que viene como query param (?q=pollo)
  const paramSearch = params.get("q") || "";
  // Prioridad: query param > state
  const rawQuery = paramSearch || navSearch;

  const normalizedQuery = useMemo(
    () => normalizeText(rawQuery.trim()),
    [rawQuery]
  );

  const items = useMemo(() => {
    if (normalizedQuery) {
      return PRODUCTS.filter((p) =>
        normalizeText(p.name).includes(normalizedQuery)
      );
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
          background: `linear-gradient(0deg, rgba(0,0,0,.20), rgba(0,0,0,.20)), url(${Pollo_frito_crujiente_estilo_KFC}) center/cover no-repeat`,
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
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && onOpen(p)
              }
            >
              <div className="product-img">
                <img src={p.img} alt={p.name} loading="lazy" />
              </div>

              <div className="product-body">
                <h3 className="product-title">{p.name}</h3>
                <div className="product-footer" />
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
          <article
            className="rx-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Receta de ${selected.name}`}
          >
            <div className="rx-modal-hero">
              <img src={selected.img} alt={selected.name} />
            </div>

            <header className="rx-modal-header">
              <h2>{selected.name}</h2>
              <button
                className="rx-modal-close"
                type="button"
                aria-label="Cerrar"
                onClick={onClose}
              >
                ✕
              </button>
            </header>

            <section className="rx-modal-body">
              <div className="rx-col">
                <h3>Ingredientes</h3>
                <ul>
                  {(RECIPES[selected.id]?.ingredients ?? ["—"]).map(
                    (it, idx) => (
                      <li key={idx}>{it}</li>
                    )
                  )}
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

            {/* Footer sin botón */}
            <footer className="rx-modal-footer" />
          </article>
        </div>
      )}
    </div>
  );
}
