// src/pages/JugarGanar.jsx
import { Link } from "react-router-dom";
import "../styles/JugarGanar.css";
import gameImg from "../assets/Imagen Juego.png";

export default function JugarGanar() {
  return (
    <section id="jugar-ganar" className="game-hero" aria-labelledby="jg-title">
      <div className="game-grid">
        {/* Imagen (izquierda) dentro del card */}
        <figure className="jg-card" aria-label="Ilustración del juego">
          <img
            className="game-img"
            src={gameImg}
            alt="Pollo animado corriendo"
            loading="lazy"
          />
          <figcaption className="game-name">Juego de Pollos</figcaption>
        </figure>

        {/* Panel de contenido (derecha) */}
        <div className="jg-panel game-copy game-copy--center">
          <header className="jg-header">
            <h2 id="jg-title" className="jg-title">Zona de Juego</h2>
            <p className="gz-sub">¡Diviértete jugando para ganar puntos!</p>
          </header>

          <section className="howto-stack" aria-labelledby="jg-howto-title">
            <h3 id="jg-howto-title" className="jg-subtitle">Cómo Jugar</h3>
            <ul className="howto-steps">
              <li>Haz clic en el botón para abrir el juego</li>
              <li>Sigue las instrucciones en pantalla</li>
              <li>Acumula puntos jugando</li>
              <li>Canjea tus puntos por descuentos</li>
            </ul>
          </section>

          <p className="gz-note">
            Haz clic en el botón de abajo para acceder a nuestro juego interactivo.
            ¡Acumula puntos y gana descuentos en tu próxima compra!
          </p>

          <Link className="btn-play" to="/juego" aria-label="Jugar ahora">
            <span>Juega Ahora</span>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 3h7v7h-2V7.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
