// src/components/Inventario.jsx
import React, { useEffect, useMemo, useState } from "react";
import "../styles/Inventario.css";

export default function Inventario({ onAddProduct, onUpdateProduct, money }) {
 
  const [items, setItems] = useState(() => {
    try {
      const cached = localStorage.getItem("inv_products");
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  });

  // Persistencia en localStorage
  useEffect(() => {
    try {
      localStorage.setItem("inv_products", JSON.stringify(items));
    } catch {}
  }, [items]);

  // Formateo de dinero (fallback)
  const moneyFmt = useMemo(
    () =>
      money ??
      ((n) =>
        new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(Number(n) || 0)),
    [money]
  );

  /* =========================
     Estado de UI
  ========================= */
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("new"); // 'new' | 'edit'
  const [form, setForm] = useState({
    id: "",
    name: "",
    type: "Pollo Entero",
    pricePerKg: 0,
    stockKg: 0,
    minKg: 10,
    provider: "",
    image: "", // DataURL (opcional)
  });

  // Modal de movimiento
  const [openMov, setOpenMov] = useState(false);
  const [mov, setMov] = useState({
    productId: null,
    type: "Entrada", // Entrada | Salida
    qty: 0,
    reason: "",
    note: "",
  });

  /* =========================
     Helpers
  ========================= */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => {
      const name = (p.name ?? "").toLowerCase();
      const type = (p.type ?? "").toLowerCase();
      const provider = (p.provider ?? "").toLowerCase();
      return name.includes(q) || type.includes(q) || provider.includes(q);
    });
  }, [search, items]);

  const uuid = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const openNewProduct = () => {
    setModalMode("new");
    setForm({
      id: "",
      name: "",
      type: "Pollo Entero",
      pricePerKg: 0,
      stockKg: 0,
      minKg: 10,
      provider: "",
      image: "",
    });
    setOpenModal(true);
  };

  const openEditProduct = (p) => {
    setModalMode("edit");
    setForm({ ...p });
    setOpenModal(true);
  };

  const onFormChange = (e) => {
    const { name, value, files } = e.target;

    // Archivo de imagen
    if (name === "image" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setForm((f) => ({ ...f, image: reader.result || "" }));
      };
      reader.readAsDataURL(file); // guardamos como DataURL en localStorage
      return;
    }

    // Numéricos
    if (["pricePerKg", "stockKg", "minKg"].includes(name)) {
      const n = value === "" ? "" : Number(String(value).replace(",", "."));
      setForm((f) => ({ ...f, [name]: n }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const submitProduct = (e) => {
    e.preventDefault();
    if (!form.name || !form.type || !form.provider) return;

    if (modalMode === "new") {
      const newProd = {
        ...form,
        id: form.id || uuid(),
        pricePerKg: Number(form.pricePerKg) || 0,
        stockKg: Number(form.stockKg) || 0,
        minKg: Number(form.minKg) || 0,
        image: form.image || "", // incluir imagen si hay
      };
      setItems((prev) => [newProd, ...prev]);
      onAddProduct && onAddProduct(newProd);
    } else {
      const upd = {
        ...form,
        pricePerKg: Number(form.pricePerKg) || 0,
        stockKg: Number(form.stockKg) || 0,
        minKg: Number(form.minKg) || 0,
        image: form.image || "",
      };
      setItems((prev) => prev.map((p) => (p.id === upd.id ? upd : p)));
      onUpdateProduct && onUpdateProduct(upd);
    }

    setOpenModal(false);
  };

  // === Movimiento ===
  const selProduct = useMemo(
    () => items.find((p) => p.id === mov.productId),
    [items, mov.productId]
  );

  const openMovement = (p) => {
    setMov({ productId: p.id, type: "Entrada", qty: 0, reason: "", note: "" });
    setOpenMov(true);
  };

  const onMovChange = (e) => {
    const { name, value } = e.target;
    if (name === "qty") {
      const n = value === "" ? "" : Number(String(value).replace(",", "."));
      setMov((m) => ({ ...m, qty: n }));
    } else {
      setMov((m) => ({ ...m, [name]: value }));
    }
  };

  const submitMovement = (e) => {
    e.preventDefault();
    if (!selProduct) return;
    if (!mov.reason.trim()) return;
    const qty = Number(mov.qty) || 0;
    if (qty <= 0) return;

    const sign = mov.type === "Salida" ? -1 : 1;
    const nextStock = Math.max(
      0,
      (Number(selProduct.stockKg) || 0) + sign * qty
    );

    const updated = { ...selProduct, stockKg: nextStock };
    setItems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    onUpdateProduct && onUpdateProduct(updated);

    setOpenMov(false);
  };

  /* =========================
     Render
  ========================= */
  return (
    <div className="inv">
      {/* Header */}
      <div className="inv__head">
        <div>
          <h2 className="inv__title">Inventario</h2>
          <p className="inv__subtitle">Gestiona tus productos y stock</p>
        </div>
        <button className="inv__btn-new" type="button" onClick={openNewProduct}>
          <span className="inv__btn-icn" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M11 5h2v14h-2zM5 11h14v2H5z" />
            </svg>
          </span>
          Nuevo Producto
        </button>
      </div>

      {/* Panel listado */}
      <div className="inv__panel">
        <div className="inv__panel-head">
          <h3 className="inv__panel-title">Lista de Productos</h3>
          <div className="inv__search">
            <span className="inv__search-icn" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </span>
            <input
              className="inv__search-in"
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="inv__list">
          {filtered.map((p) => (
            <div className="inv__item" key={p.id}>
              <div className="inv__item-body">
                <div className="inv__item-name">{p.name}</div>
                <div className="inv__item-line">Stock: {p.stockKg} kg</div>
                <div className="inv__item-line">
                  Precio: {moneyFmt(p.pricePerKg)}/kg
                </div>
                <div className="inv__item-line">Proveedor: {p.provider}</div>
                {/* La imagen NO se muestra en la lista a petición tuya */}
              </div>

              <div className="inv__item-actions">
                <button
                  type="button"
                  className="inv__btn-edit"
                  onClick={() => openEditProduct(p)}
                >
                  <span className="inv__btn-icn" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                      <path d="M14.06 4.94l3.75 3.75" />
                    </svg>
                  </span>
                  Editar
                </button>

                <button
                  type="button"
                  className="inv__btn-mov"
                  onClick={() => openMovement(p)}
                >
                  <span className="inv__btn-icn" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M11 5h2v14h-2zM5 11h14v2H5z" />
                    </svg>
                  </span>
                  Movimiento
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="po__empty">
              No hay productos. Crea uno con “Nuevo Producto”.
            </div>
          )}
        </div>
      </div>

      {/* ===== Modal: Nuevo/Editar Producto ===== */}
      {openModal && (
        <div className="po__modal" role="dialog" aria-modal="true">
          <div className="po__modal-dialog">
            <div className="po__modal-head">
              <h3 className="po__modal-title">
                {modalMode === "new" ? "Nuevo Producto" : "Editar Producto"}
              </h3>
            </div>

            <form className="po__form" onSubmit={submitProduct}>
              <div className="po__form-grid">
                <div className="po__field">
                  <label className="po__label">
                    Nombre del Producto <span className="req">*</span>
                  </label>
                  <input
                    className="po__input"
                    name="name"
                    type="text"
                    placeholder="Ej. Pollo Entero"
                    value={form.name}
                    onChange={onFormChange}
                    required
                  />
                </div>

                <div className="po__field">
                  <label className="po__label">
                    Tipo de Producto <span className="req">*</span>
                  </label>
                  <select
                    className="po__select"
                    name="type"
                    value={form.type}
                    onChange={onFormChange}
                    required
                  >
                    <option>Pollo Entero</option>
                    <option>Pechuga</option>
                    <option>Muslo</option>
                    <option>Alitas</option>
                  </select>
                </div>

                <div className="po__field">
                  <label className="po__label">
                    Precio por Kg <span className="req">*</span>
                  </label>
                  <input
                    className="po__input"
                    name="pricePerKg"
                    type="number"
                    step="0.1"
                    value={form.pricePerKg}
                    onChange={onFormChange}
                    required
                  />
                </div>

                <div className="po__field">
                  <label className="po__label">
                    Stock Inicial (kg) <span className="req">*</span>
                  </label>
                  <input
                    className="po__input"
                    name="stockKg"
                    type="number"
                    step="1"
                    value={form.stockKg}
                    onChange={onFormChange}
                    required
                  />
                </div>

                <div className="po__field">
                  <label className="po__label">
                    Stock Mínimo (kg) <span className="req">*</span>
                  </label>
                  <input
                    className="po__input"
                    name="minKg"
                    type="number"
                    step="1"
                    value={form.minKg}
                    onChange={onFormChange}
                    required
                  />
                </div>

                <div className="po__field">
                  <label className="po__label">
                    Proveedor <span className="req">*</span>
                  </label>
                  <input
                    className="po__input"
                    name="provider"
                    type="text"
                    placeholder="Nombre del proveedor"
                    value={form.provider}
                    onChange={onFormChange}
                    required
                  />
                </div>

                {/* Imagen del producto (opcional) */}
                <div className="po__field po__field--full">
                  <label className="po__label">Imagen (opcional)</label>
                  <input
                    className="po__input"
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={onFormChange}
                  />
                  {form.image && (
                    <div className="po__image-preview" style={{ marginTop: 8 }}>
                      <img
                        src={form.image}
                        alt="Vista previa"
                        style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }}
                      />
                      <div style={{ marginTop: 8 }}>
                        <button
                          type="button"
                          className="po__btn po__btn--danger"
                          onClick={() => setForm((f) => ({ ...f, image: "" }))}
                        >
                          Quitar imagen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="po__form-actions">
                <button
                  type="button"
                  className="po__btn"
                  onClick={() => setOpenModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="po__btn po__btn--primary">
                  {modalMode === "new" ? "Guardar" : "Actualizar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Modal: Registrar Movimiento ===== */}
      {openMov && selProduct && (
        <div className="po__modal" role="dialog" aria-modal="true">
          <div className="po__modal-dialog">
            <div className="po__modal-head">
              <h3 className="po__modal-title">Registrar Movimiento</h3>
              <p className="po__meta">
                <strong>Producto:</strong> {selProduct.name}
                <br />
                <span className="muted">Stock actual: {selProduct.stockKg} kg</span>
              </p>
            </div>

            <form className="po__form" onSubmit={submitMovement}>
              <div className="po__form-grid">
                <div className="po__field">
                  <label className="po__label">
                    Tipo de Movimiento <span className="req">*</span>
                  </label>
                  <select
                    className="po__select"
                    name="type"
                    value={mov.type}
                    onChange={onMovChange}
                    required
                  >
                    <option>Entrada</option>
                    <option>Salida</option>
                  </select>
                </div>

                <div className="po__field">
                  <label className="po__label">
                    Cantidad (kg) <span className="req">*</span>
                  </label>
                  <input
                    className="po__input"
                    name="qty"
                    type="number"
                    step="0.1"
                    min="0"
                    value={mov.qty}
                    onChange={onMovChange}
                    required
                  />
                </div>

                <div className="po__field po__field--full">
                  <label className="po__label">
                    Motivo <span className="req">*</span>
                  </label>
                  <input
                    className="po__input"
                    name="reason"
                    type="text"
                    placeholder="Ej. Compra, Venta, Devolución"
                    value={mov.reason}
                    onChange={onMovChange}
                    required
                  />
                </div>

                <div className="po__field po__field--full">
                  <label className="po__label">Nota</label>
                  <textarea
                    className="po__textarea"
                    name="note"
                    placeholder="Información adicional..."
                    rows={4}
                    value={mov.note}
                    onChange={onMovChange}
                  />
                </div>
              </div>

              <div className="po__form-actions">
                <button
                  type="button"
                  className="po__btn"
                  onClick={() => setOpenMov(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="po__btn po__btn--success">
                  Registrar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
