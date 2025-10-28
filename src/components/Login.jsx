// src/components/Login.jsx
import React, { useState } from "react";
import "../styles/Login.css";
import logo from "../assets/Logo.png"; // ajusta la ruta si es necesario

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);

  const onSubmit = (e) => e.preventDefault(); // Solo UI

  return (
    <section id="login" className="login-page">
      {/* Marco naranja que centra el card blanco */}
      <div className="login-shell">
        <form className="login-card" onSubmit={onSubmit} autoComplete="off">
          <div className="logo-wrap">
            <img src={logo} alt="Logo" className="login-logo" />
          </div>

          <h1 className="login-title">Portal de Empleados</h1>

          <label className="login-label" htmlFor="email">Email</label>
          <div className="input-group">
            <span className="input-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16v16H4z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </span>
            <input id="email" type="email" className="login-input" placeholder="tu@empresa.com" />
          </div>

          <label className="login-label" htmlFor="password">Contraseña</label>
          <div className="input-group">
            <span className="input-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="password"
              type={showPwd ? "text" : "password"}
              className="login-input"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="input-addon"
              aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShowPwd((s) => !s)}
            >
              {showPwd ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94L6.06 6.06" />
                  <path d="M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 2.42-4.42M9.88 5.09A10.44 10.44 0 0 1 12 5c6 0 10 7 10 7a18.07 18.07 0 0 1-3.12 3.82M6.1 6.1A18.1 18.1 0 0 0 2 12s4 7 10 7a10.7 10.7 0 0 0 3.1-.46" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <button type="submit" className="login-button">
            <span className="btn-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M13 7l5 5-5 5M6 12h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            Iniciar Sesión
          </button>

          <div className="login-meta single">
            <a className="forgot" href="#" onClick={(e)=>e.preventDefault()}>¿Olvidaste tu contraseña?</a>
          </div>

          <small className="login-help">
            ¿Problemas para acceder? Contacta al administrador
          </small>
        </form>
      </div>
    </section>
  );
}
