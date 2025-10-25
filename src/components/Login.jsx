// src/components/Login.jsx
import React from "react";
import "../styles/Login.css";
import logo from "../assets/Logo.png"; // ajusta la ruta si es necesario

export default function Login() {
  const onSubmit = (e) => e.preventDefault(); // Solo UI

  return (
    <section id="login" className="login-page">
      <form className="login-card" onSubmit={onSubmit} autoComplete="off">
        <div className="logo-wrap">
          <img src={logo} alt="Logo" className="login-logo" />
        </div>

        <h1 className="login-title">Porta de Empleados</h1>
        <p className="login-subtitle">Ingresa con tu cuenta corporativa</p>

        <label className="login-label" htmlFor="email">Email</label>
        <input id="email" type="email" className="login-input" />

        <label className="login-label" htmlFor="password">Contraseña</label>
        <input id="password" type="password" className="login-input" />

        <button type="submit" className="login-button">
          <span className="btn-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M13 7l5 5-5 5M6 12h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          Iniciar Sesión
        </button>

        <small className="login-help">
          ¿Problemas para acceder? Contacta al administrador
        </small>
      </form>
    </section>
  );
}
