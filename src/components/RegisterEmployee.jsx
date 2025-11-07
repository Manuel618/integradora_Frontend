// src/components/RegisterEmployee.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterEmployee.css";

/**
 * Registro de Empleados (demo sin backend)
 * - Guarda empleados en localStorage ("employees").
 * - Valida email único y contraseñas.
 * - Redirige a /login al terminar.
 *
 * Nota: No incluye campos de "rol" ni "departamento".
 */
export default function RegisterEmployee({ onRegister, redirectTo = "/login" }) {
  const navigate = useNavigate();

  // Carga inicial de empleados (localStorage)
  const [employees, setEmployees] = useState(() => {
    try {
      const raw = localStorage.getItem("employees");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Formulario
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    phone: "", // opcional
  });

  // UI
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Helpers
  const uuid = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Ingresa el nombre completo.";
    if (!emailRegex.test(form.email.trim())) e.email = "Email no válido.";
    if ((form.password ?? "").length < 6) e.password = "Mínimo 6 caracteres.";
    if (form.password !== form.confirm) e.confirm = "Las contraseñas no coinciden.";

    const exists = employees.some(
      (u) => (u.email || "").toLowerCase() === form.email.trim().toLowerCase()
    );
    if (exists) e.email = "Este email ya está registrado.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const persistEmployees = (list) => {
    setEmployees(list);
    try {
      localStorage.setItem("employees", JSON.stringify(list));
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const newEmployee = {
      id: uuid(),
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      // ⚠️ Demo: la contraseña se guarda en claro. En producción usa hashing (p. ej., bcrypt).
      password: form.password,
      phone: form.phone.trim(),
      createdAt: new Date().toISOString(),
      active: true,
    };

    try {
      if (typeof onRegister === "function") {
        await onRegister(newEmployee);
      }
      persistEmployees([newEmployee, ...employees]);

      setForm({ name: "", email: "", password: "", confirm: "", phone: "" });
      navigate(redirectTo);
    } catch {
      setErrors((prev) => ({ ...prev, submit: "No se pudo registrar. Intenta de nuevo." }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="registro" className="reg-page">
      <div className="reg-shell">
        <form className="reg-card" onSubmit={handleSubmit} autoComplete="off">
          <h1 className="reg-title">Registro de Empleado</h1>

          {/* Nombre */}
          <label htmlFor="name" className="reg-label">Nombre completo</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Ej. Ana López"
            value={form.name}
            onChange={handleChange}
            className={`reg-input${errors.name ? " is-error" : ""}`}
          />
          {errors.name && <small className="reg-err">{errors.name}</small>}

          {/* Email */}
          <label htmlFor="email" className="reg-label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="empleado@empresa.com"
            value={form.email}
            onChange={handleChange}
            className={`reg-input${errors.email ? " is-error" : ""}`}
          />
          {errors.email && <small className="reg-err">{errors.email}</small>}

          {/* Contraseña */}
          <label htmlFor="password" className="reg-label">Contraseña</label>
          <div className="reg-input-group">
            <input
              id="password"
              name="password"
              type={showPwd ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={handleChange}
              className={`reg-input${errors.password ? " is-error" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="reg-reveal"
              aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPwd ? "Ocultar" : "Ver"}
            </button>
          </div>
          {errors.password && <small className="reg-err">{errors.password}</small>}

          {/* Confirmar */}
          <label htmlFor="confirm" className="reg-label">Confirmar contraseña</label>
          <div className="reg-input-group">
            <input
              id="confirm"
              name="confirm"
              type={showPwd2 ? "text" : "password"}
              placeholder="Repite tu contraseña"
              value={form.confirm}
              onChange={handleChange}
              className={`reg-input${errors.confirm ? " is-error" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPwd2((s) => !s)}
              className="reg-reveal"
              aria-label={showPwd2 ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPwd2 ? "Ocultar" : "Ver"}
            </button>
          </div>
          {errors.confirm && <small className="reg-err">{errors.confirm}</small>}

          {/* Teléfono (opcional) */}
          <label htmlFor="phone" className="reg-label">Teléfono (opcional)</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="10 dígitos"
            value={form.phone}
            onChange={handleChange}
            className="reg-input"
          />

          {errors.submit && <small className="reg-err mt-6">{errors.submit}</small>}

          {/* Acciones */}
          <button type="submit" disabled={loading} className="reg-btn">
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>

          <button type="button" onClick={() => navigate("/login")} className="reg-link-btn">
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </form>
      </div>
    </section>
  );
}
