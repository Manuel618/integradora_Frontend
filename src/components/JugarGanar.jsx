import "../styles/JugarGanar.css";
import gameImg from "../assets/Imagen Juego.png"; // si cambias el nombre/ruta, ajusta esto

export default function JugarGanar() {
  return (
    <>
      <section id="jugar-ganar" className="game-zone">
        <h2>Zona de Juego</h2>
        <p className="gz-sub">¡Diviértete jugando para ganar puntos!</p>

        <div className="game-card">
          <img className="game-img" src={gameImg} alt="Juego de Pollos" />
          <span className="game-name">Juego de Pollos</span>
        </div>

        <p className="gz-note">
          Haz clic en el botón de abajo para acceder a nuestro juego interactivo.
          ¡Acumula puntos y gana descuentos en tu próxima compra!
        </p>

        <a className="btn-play" href="/juego" aria-label="Jugar ahora">
          <span>Juega Ahora</span>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z"></path>
          </svg>
        </a>
      </section>

      <hr className="sep" />

      <section className="howto">
        <h3>Cómo Jugar</h3>
        <ol>
          <li>Haz clic en el botón para abrir el juego</li>
          <li>Sigue las instrucciones en pantalla</li>
          <li>Acumula puntos jugando</li>
          <li>Canjea tus puntos por descuentos</li>
        </ol>
      </section>
    </>
  );
}
