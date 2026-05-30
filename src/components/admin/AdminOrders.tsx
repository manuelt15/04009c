"use client";

import { useEffect, useState } from "react";
import type { IOrder, OrderStatus } from "@/lib/models/order";
import AdminSelect from "./AdminSelect";

const STATUS_OPTIONS = [
  { value: "pendiente",  label: "PENDIENTE"  },
  { value: "confirmado", label: "CONFIRMADO" },
  { value: "enviado",    label: "ENVIADO"    },
  { value: "entregado",  label: "ENTREGADO"  },
  { value: "cancelado",  label: "CANCELADO"  },
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pendiente:  "border-amber text-amber",
  confirmado: "border-brand-blue text-off-white",
  enviado:    "border-off-white text-off-white",
  entregado:  "border-dim text-dim",
  cancelado:  "border-brand-red text-brand-red",
};

const STATUSES: OrderStatus[] = ["pendiente","confirmado","enviado","entregado","cancelado"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<IOrder[]>([]);

  async function load() {
    const r = await fetch("/api/admin/orders");
    const d = await r.json();
    setOrders(d.orders ?? []);
  }

  useEffect(() => { load(); }, []);

  async function changeStatus(id: string, status: OrderStatus) {
    await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    load();
  }

  return (
    <div className="p-4 md:p-6 pt-16 md:pt-6 flex flex-col gap-6">
      <div>
        <span className="data-label">// GESTIÓN</span>
        <h1 className="font-display text-2xl md:text-3xl text-off-white tracking-wider">PEDIDOS</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface border border-border p-8 flex flex-col items-center gap-2">
          <span className="font-terminal text-[11px] text-dim tracking-widest">// SIN PEDIDOS AÚN</span>
          <span className="font-terminal text-[10px] text-dim/50">Los pedidos aparecerán aquí cuando integres Stripe</span>
        </div>
      ) : (
        <div className="bg-surface border border-border overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-border">
              <tr>
                {["PEDIDO","CLIENTE","CIUDAD","TOTAL","ESTADO","CAMBIAR"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-terminal text-[10px] text-dim tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-black/30 transition-colors">
                  <td className="px-4 py-3 font-terminal text-[11px] text-amber">{o.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-terminal text-[11px] text-off-white">{o.customer.name}</p>
                    <p className="font-terminal text-[10px] text-dim">{o.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 font-terminal text-[11px] text-dim">{o.customer.city || "—"}</td>
                  <td className="px-4 py-3 font-terminal text-[11px] text-amber">{o.total}€</td>
                  <td className="px-4 py-3">
                    <span className={`font-terminal text-[10px] border px-2 py-0.5 ${STATUS_COLORS[o.status]}`}>
                      {o.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <AdminSelect
                    value={o.status}
                    options={STATUS_OPTIONS}
                    onChange={(val) => changeStatus(o._id, val as OrderStatus)}
                  />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
