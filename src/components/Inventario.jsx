// src/components/Inventario.jsx
import React, { useMemo, useState } from "react";
import "../styles/Inventario.css";

export default function Inventario({ products, onAddProduct, onUpdateProduct, money }) {
  // =========================
  // Estado local de Inventario
  // =========================
  const [search, setSearch]   = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("new"); // 'new' | 'edit'
  const [form, setForm] = useState({
    id:"", name:"", type:"Pollo Entero", pricePerKg:0, stockKg:0, minKg:10, provider:""
  });

  // =========================
  // Helpers
  // =========================
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.provider.toLowerCase().includes(q)
    );
  }, [search, products]);

  const openNewProduct = () => {
    setModalMode("new");
    setForm({ id:"", name:"", type:"Pollo Entero", pricePerKg:0, stockKg:0, minKg:10, provider:"" });
    setOpenModal(true);
  };

  const openEditProduct = (p) => {
    setModalMode("edit");
    setForm({ ...p });
    setOpenModal(true);
  };

  const onFormChange = (e) => {
    const { name, value } = e.target;
    if (["pricePerKg","stockKg","minKg"].includes(name)) {
      const n = value === "" ? "" : Number(String(value).replace(",", "."));
      setForm((f) => ({ ...f, [name]: n }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.type || !form.provider) return;

    if (modalMode === "new") onAddProduct(form);
    else onUpdateProduct(form);

    setOpenModal(false);
  };

  // =========================
  // Render
  // =========================
  return (
    <div className="inv">
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

      <div className="inv__panel">
        <div className="inv__panel-head">
          <h3 className="inv__panel-title">Lista de Productos</h3>
          <div className="inv__search">
            <span className="inv__search-icn" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2">
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
                <div className="inv__item-line">Precio: {money(p.pricePerKg)}/kg</div>
                <div className="inv__item-line">Proveedor: {p.provider}</div>
              </div>
              <div className="inv__item-actions">
                <button type="button" className="inv__btn-edit" onClick={() => openEditProduct(p)}>
                  <span className="inv__btn-icn" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                      <path d="M14.06 4.94l3.75 3.75" />
                    </svg>
                  </span>
                  Editar
                </button>
                <button type="button" className="inv__btn-mov">
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
            <div className="po__empty" style={{ background:"#fff", borderRadius:12 }}>
              No hay productos que coincidan con la búsqueda.
            </div>
          )}
        </div>
      </div>

      {/* ===== Modal ===== */}
      {openModal && (
        <div className="po__modal" role="dialog" aria-modal="true">
          <div className="po__modal-dialog">
            <div className="po__modal-head">
              <h3 className="po__modal-title">{modalMode === "new" ? "Nuevo Producto" : "Editar Producto"}</h3>
            </div>

            <form className="po__form" onSubmit={submit}>
              <div className="po__field">
                <label className="po__label">Nombre del Producto <span className="req">*</span></label>
                <input className="po__input" name="name" type="text" placeholder="Ej. Pollo Entero" value={form.name} onChange={onFormChange} required />
              </div>

              <div className="po__field">
                <label className="po__label">Tipo de Producto <span className="req">*</span></label>
                <select className="po__select" name="type" value={form.type} onChange={onFormChange} required>
                  <option>Pollo Entero</option>
                  <option>Pechuga</option>
                  <option>Muslo</option>
                  <option>Alitas</option>
                </select>
              </div>

              <div className="po__field">
                <label className="po__label">Precio por Kg <span className="req">*</span></label>
                <input className="po__input" name="pricePerKg" type="number" step="0.1" value={form.pricePerKg} onChange={onFormChange} required />
              </div>

              <div className="po__field">
                <label className="po__label">Stock Inicial (kg) <span className="req">*</span></label>
                <input className="po__input" name="stockKg" type="number" step="1" value={form.stockKg} onChange={onFormChange} required />
              </div>

              <div className="po__field">
                <label className="po__label">Stock Mínimo (kg) <span className="req">*</span></label>
                <input className="po__input" name="minKg" type="number" step="1" value={form.minKg} onChange={onFormChange} required />
              </div>

              <div className="po__field">
                <label className="po__label">Proveedor <span className="req">*</span></label>
                <input className="po__input" name="provider" type="text" placeholder="Nombre del proveedor" value={form.provider} onChange={onFormChange} required />
              </div>

              <div className="po__form-actions">
                <button type="button" className="po__btn" onClick={() => setOpenModal(false)}>Cancelar</button>
                <button type="submit" className="po__btn po__btn--primary">{modalMode === "new" ? "Guardar" : "Actualizar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
