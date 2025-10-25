// src/components/PuntoDeVenta.jsx
import React, { useMemo, useState } from "react";
import "../styles/PuntoDeVenta.css";

export default function PuntoDeVenta({ products, money }) {
  // =========================
  // Estado local POS
  // =========================
  const [posCart, setPosCart]   = useState([]); // [{id,name,pricePerKg,qty}]
  const [posName, setPosName]   = useState("");
  const [posPhone, setPosPhone] = useState("");
  const [payment, setPayment]   = useState("Efectivo");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("$"); // "$" | "%"
  const [cash, setCash]         = useState(0);
  const [note, setNote]         = useState("");

  // =========================
  // Handlers
  // =========================
  const addToCart = (p) => {
    setPosCart((list) => {
      const ix = list.findIndex((i) => i.id === p.id);
      if (ix >= 0) {
        const cp = [...list];
        cp[ix] = { ...cp[ix], qty: cp[ix].qty + 1 };
        return cp;
      }
      return [...list, { id: p.id, name: p.name, pricePerKg: p.pricePerKg, qty: 1 }];
    });
  };
  const incQty     = (id) => setPosCart((l) => l.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  const decQty     = (id) => setPosCart((l) => l.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i)));
  const removeItem = (id) => setPosCart((l) => l.filter((i) => i.id !== id));

  const subtotal = useMemo(() => posCart.reduce((s, i) => s + i.pricePerKg * i.qty, 0), [posCart]);
  const discountAmount = useMemo(
    () => Math.min(discountType === "%" ? subtotal * (Number(discount)||0)/100 : (Number(discount)||0), subtotal),
    [discount, discountType, subtotal]
  );
  const total  = Math.max(subtotal - discountAmount, 0);
  const change = payment === "Efectivo" ? Math.max((Number(cash)||0) - total, 0) : 0;

  const finalizeSale = (e) => {
    e.preventDefault();
    if (posCart.length === 0) return;
    if (payment === "Efectivo" && (Number(cash)||0) < total) return;
    alert("¡Venta finalizada!");
    setPosCart([]); setPosName(""); setPosPhone(""); setPayment("Efectivo");
    setDiscount(0); setDiscountType("$"); setCash(0); setNote("");
  };

  // =========================
  // Render
  // =========================
  return (
    <div className="pos">
      <h2 className="pos__title">Punto de Venta</h2>
      <p className="pos__subtitle">Sistema de caja para venta directa</p>

      {/* Catálogo */}
      <div className="pos__block">
        <div className="pos__block-head">Productos Disponibles</div>
        <div className="pos__catalog">
          {products.map((p) => (
            <button key={p.id} className="pos__prod" onClick={() => addToCart(p)} title="Agregar al carrito">
              <div className="pos__prod-name">{p.name}</div>
              <div className="pos__prod-price">{money(p.pricePerKg)}/kg</div>
              <span className="pos__badge">{p.stockKg}kg</span>
            </button>
          ))}
        </div>
      </div>

      {/* Carrito + Form */}
      <div className="pos__block">
        <div className="pos__block-head">Carrito de Compra</div>

        <div className="pos__cart">
          {posCart.length === 0 ? (
            <div className="po__empty" style={{ background:"#fff", borderRadius:12 }}>
              Aún no hay productos en el carrito.
            </div>
          ) : (
            posCart.map((item) => (
              <div className="pos__row" key={item.id}>
                <div className="pos__row-info">
                  <div className="pos__row-name">{item.name}</div>
                  <div className="pos__row-sub">{money(item.pricePerKg)}/kg</div>
                </div>

                <div className="pos__qty">
                  <button type="button" onClick={() => decQty(item.id)} aria-label="Restar">–</button>
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => {
                      const v = Math.max(1, Number(e.target.value) || 1);
                      setPosCart((list) => list.map((i) => (i.id === item.id ? { ...i, qty: v } : i)));
                    }}
                  />
                  <button type="button" onClick={() => incQty(item.id)} aria-label="Sumar">+</button>
                </div>

                <button type="button" className="pos__remove" onClick={() => removeItem(item.id)}>
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>

        <form className="pos__form" onSubmit={finalizeSale}>
          <div className="po__field">
            <label className="po__label">Nombre del Cliente</label>
            <input className="po__input" value={posName} onChange={(e) => setPosName(e.target.value)} placeholder="Opcional" />
          </div>
          <div className="po__field">
            <label className="po__label">Teléfono</label>
            <input className="po__input" value={posPhone} onChange={(e) => setPosPhone(e.target.value)} placeholder="Opcional" />
          </div>
          <div className="po__field">
            <label className="po__label">Método de Pago</label>
            <select className="po__select" value={payment} onChange={(e) => setPayment(e.target.value)}>
              <option>Efectivo</option>
              <option>Tarjeta</option>
              <option>Transferencia</option>
            </select>
          </div>

          <div className="po__field pos__discount-field">
            <label className="po__label">Descuento</label>
            <div className="pos__discount">
              <input className="po__input" type="number" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} />
              <select className="po__select pos__discount-type" value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                <option value="$">$</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>

          <div className="po__field">
            <label className="po__label">Efectivo Recibido</label>
            <input className="po__input" type="number" step="0.01" value={cash} onChange={(e) => setCash(e.target.value)} disabled={payment !== "Efectivo"} />
          </div>

          <div className="po__field pos__notes">
            <label className="po__label">Notas</label>
            <textarea className="po__input" rows="3" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Referencia o comentarios" />
          </div>

          <div className="pos__totals">
            <div className="pos__line"><span>Subtotal:</span><span>{money(subtotal)}</span></div>
            <div className="pos__line pos__disc"><span>Descuento:</span><span>-{money(discountAmount)}</span></div>
            <div className="pos__line pos__total"><span>Total:</span><span>{money(total)}</span></div>
            <div className="pos__line pos__change"><span>Cambio:</span><span>{money(change)}</span></div>

            <button
              className="pos__btn"
              type="submit"
              disabled={posCart.length === 0 || (payment === "Efectivo" && (Number(cash) || 0) < total)}
            >
              Finalizar Venta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
