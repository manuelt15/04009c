"use client";

import { Fragment, useEffect, useState } from "react";
import type { IOrder, OrderStatus } from "@/lib/models/order";
import { motion } from "framer-motion";
import AdminSelect from "./AdminSelect";
import { useToast } from "@/components/shared/Toaster";

const STATUS_OPTIONS = [
  { value: "pendiente",  label: "PENDIENTE"  },
  { value: "confirmado", label: "CONFIRMADO" },
  { value: "enviado",    label: "ENVIADO"    },
  { value: "entregado",  label: "ENTREGADO"  },
  { value: "cancelado",  label: "CANCELADO"  },
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pendiente:  "border-brand-red text-brand-red",
  confirmado: "border-off-white/40 text-off-white/70",
  enviado:    "border-off-white text-off-white",
  entregado:  "border-dim text-dim",
  cancelado:  "border-border text-dim line-through",
};

const LABEL = "font-terminal text-[0.65rem] tracking-[0.12em] uppercase text-brand-red";

function formatDate(d: Date | string): string {
  return new Date(d).toLocaleString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function OrderDetail({ order }: { order: IOrder }) {
  const c = order.customer;
  const address = [c.address, [c.postalCode, c.city].filter(Boolean).join(" "), c.province].filter(Boolean);
  const history = [{ status: "pendiente" as OrderStatus, at: order.createdAt }, ...(order.statusHistory ?? [])];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 py-5 bg-[var(--theme-bg)]">
      <div className="flex flex-col gap-2">
        <span className={LABEL}>ARTÍCULOS</span>
        <ul className="flex flex-col gap-1.5">
          {order.items.map((it, i) => (
            <li key={i} className="flex justify-between gap-3 font-terminal text-[11px]">
              <span className="text-off-white">
                {it.quantity} × {it.name}
                <span className="text-dim"> · {it.size ? `TALLA ${it.size}` : "TALLA —"} · {it.ref}</span>
              </span>
              <span className="text-off-white whitespace-nowrap">{it.price * it.quantity}€</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-terminal text-[11px] border-t border-border pt-2 mt-1">
          <span className="text-dim">ENVÍO {order.shippingMethod ? `(${order.shippingMethod.label})` : ""}</span>
          <span className="text-off-white">{order.shippingMethod ? `${order.shippingMethod.price}€` : "—"}</span>
        </div>
        <div className="flex justify-between font-terminal text-xs">
          <span className="text-dim">TOTAL</span>
          <span className="text-brand-red">{order.total}€</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className={LABEL}>CLIENTE Y ENVÍO</span>
        <p className="font-terminal text-[11px] text-off-white">{c.name}</p>
        <p className="font-terminal text-[11px] text-dim">{c.email}</p>
        <p className="font-terminal text-[11px] text-dim">{c.phone || "SIN TELÉFONO"}</p>
        <p className="font-terminal text-[11px] text-off-white leading-relaxed">
          {address.length > 0 ? address.join(", ") : "SIN DIRECCIÓN (PEDIDO ANTERIOR AL CHECKOUT)"}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className={LABEL}>HISTORIAL</span>
        <ol className="flex flex-col gap-1.5">
          {history.map((h, i) => (
            <li key={i} className="flex justify-between gap-3 font-terminal text-[11px]">
              <span className="text-off-white">{h.status.toUpperCase()}</span>
              <span className="text-dim">{formatDate(h.at)}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const toast = useToast();

  async function load() {
    const r = await fetch("/api/admin/orders");
    const d = await r.json();
    setOrders(d.orders ?? []);
  }

  useEffect(() => { load(); }, []);

  async function changeStatus(o: IOrder, status: OrderStatus) {
    if (status === o.status) return;
    const r = await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: o._id, status }) });
    toast(r.ok ? `${o.orderNumber} → ${status.toUpperCase()}` : "NO SE PUDO CAMBIAR EL ESTADO", r.ok ? "success" : "error");
    load();
  }

  return (
    <div className="p-4 md:p-6 pt-16 md:pt-6 flex flex-col gap-6">
      <div>
        <span className="data-label">{"// GESTIÓN"}</span>
        <h1 className="font-display text-2xl md:text-3xl text-off-white tracking-wider">PEDIDOS</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface border border-border p-8 flex flex-col items-center gap-2">
          <span className="font-terminal text-[11px] text-dim tracking-widest">{"// SIN PEDIDOS AÚN"}</span>
          <span className="font-terminal text-[10px] text-dim">Los pedidos aparecerán aquí cuando se conecte Stripe</span>
        </div>
      ) : (
        <div className="bg-surface border border-border overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <caption className="sr-only">Pedidos de la tienda</caption>
            <thead className="border-b border-border">
              <tr>
                {["PEDIDO","FECHA","CLIENTE","TOTAL","ESTADO","CAMBIAR",""].map((h, i) => (
                  <th scope="col" key={i} className="text-left px-4 py-3 font-terminal text-[10px] text-dim tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((o) => (
                <Fragment key={o._id}>
                  <tr className="hover:bg-black/30 transition-colors">
                    <td className="px-4 py-3 font-terminal text-[11px] text-brand-red">{o.orderNumber}</td>
                    <td className="px-4 py-3 font-terminal text-[10px] text-dim whitespace-nowrap">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3">
                      <p className="font-terminal text-[11px] text-off-white">{o.customer.name}</p>
                      <p className="font-terminal text-[10px] text-dim">{o.customer.city || "—"}</p>
                    </td>
                    <td className="px-4 py-3 font-terminal text-[11px] text-off-white">{o.total}€</td>
                    <td className="px-4 py-3">
                      <span className={`font-terminal text-[10px] border px-2 py-0.5 ${STATUS_COLORS[o.status]}`}>
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <AdminSelect value={o.status} options={STATUS_OPTIONS} onChange={(val) => changeStatus(o, val as OrderStatus)} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setOpen((id) => (id === o._id ? null : o._id))}
                        aria-expanded={open === o._id}
                        aria-controls={`order-detail-${o._id}`}
                        className="font-terminal text-[10px] text-dim hover:text-off-white tracking-widest transition-colors whitespace-nowrap"
                      >
                        {open === o._id ? "CERRAR ▴" : "DETALLE ▾"}
                      </button>
                    </td>
                  </tr>
                  <tr id={`order-detail-${o._id}`} hidden={open !== o._id}>
                      <td colSpan={7} className="p-0 border-t border-border">
                        <motion.div
                          initial={{ opacity: 0, transform: "translateY(-4px)" }}
                          animate={{ opacity: 1, transform: "translateY(0px)" }}
                          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                        >
                          <OrderDetail order={o} />
                        </motion.div>
                      </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
