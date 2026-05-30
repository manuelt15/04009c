"use client";

import { useEffect, useState } from "react";
import type { IProduct } from "@/lib/models/product";
import AdminSelect from "./AdminSelect";

const EMPTY: Partial<IProduct> = { name: "", price: 0, category: "HOODIES", images: [], description: "", soldOut: false, slug: "", ref: "" };
const CATEGORIES = ["HOODIES","CAMISETAS","TOPS","PANTALONES","ACCESORIOS","CHAQUETAS"];

export default function AdminProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [form, setForm]         = useState<Partial<IProduct>>(EMPTY);
  const [editing, setEditing]   = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]   = useState(false);

  async function load() {
    const r = await fetch("/api/admin/products");
    const d = await r.json();
    setProducts(d.products ?? []);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    setLoading(true);
    if (editing) {
      await fetch("/api/admin/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing, ...form }) });
    } else {
      await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setForm(EMPTY); setEditing(null); setShowForm(false); setLoading(false); load();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar producto?")) return;
    await fetch("/api/admin/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  }

  async function toggleSoldOut(p: IProduct) {
    await fetch("/api/admin/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p._id, soldOut: !p.soldOut }) });
    load();
  }

  function startEdit(p: IProduct) {
    setForm(p); setEditing(p._id); setShowForm(true);
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="data-label">// GESTIÓN</span>
          <h1 className="font-display text-3xl text-off-white tracking-wider">PRODUCTOS</h1>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }}
          className="font-terminal text-[11px] tracking-widest uppercase px-4 py-2 border border-amber text-amber hover:bg-amber hover:text-black transition-colors">
          + NUEVO
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-surface border border-border p-5 flex flex-col gap-3">
          <span className="data-label">{editing ? "// EDITAR PRODUCTO" : "// NUEVO PRODUCTO"}</span>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "name", label: "NOMBRE", type: "text" },
              { key: "slug", label: "SLUG", type: "text" },
              { key: "ref",  label: "REF",   type: "text" },
              { key: "price", label: "PRECIO (€)", type: "number" },
            ].map(({ key, label, type }) => (
              <div key={key} className="flex flex-col gap-1">
                <span className="data-label">{label}</span>
                <input type={type} value={(form as Record<string, unknown>)[key] as string ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: type === "number" ? Number(e.target.value) : e.target.value }))}
                  className="bg-black border border-border text-off-white font-terminal text-sm px-3 py-2 focus:outline-none focus:border-amber transition-colors" />
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <span className="data-label">CATEGORÍA</span>
              <AdminSelect
                value={form.category ?? "HOODIES"}
                options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                onChange={(val) => setForm((p) => ({ ...p, category: val }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="data-label">IMÁGENES (URLs separadas por coma)</span>
              <input type="text" value={form.images?.join(",") ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, images: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))}
                className="bg-black border border-border text-off-white font-terminal text-sm px-3 py-2 focus:outline-none focus:border-amber" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="data-label">DESCRIPCIÓN</span>
            <textarea value={form.description ?? ""} rows={2}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="bg-black border border-border text-off-white font-terminal text-sm px-3 py-2 focus:outline-none focus:border-amber resize-none" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="soldout" checked={form.soldOut ?? false}
              onChange={(e) => setForm((p) => ({ ...p, soldOut: e.target.checked }))} />
            <label htmlFor="soldout" className="font-terminal text-[11px] text-dim">AGOTADO</label>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={loading}
              className="font-terminal text-[11px] tracking-widest uppercase px-4 py-2 bg-off-white text-black hover:bg-amber transition-colors disabled:opacity-40">
              {loading ? "GUARDANDO..." : "GUARDAR"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="font-terminal text-[11px] tracking-widest uppercase px-4 py-2 border border-border text-dim hover:text-off-white transition-colors">
              CANCELAR
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-surface border border-border overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr>
              {["REF","NOMBRE","CAT","PRECIO","ESTADO","ACCIONES"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-terminal text-[10px] text-dim tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-black/30 transition-colors">
                <td className="px-4 py-3 font-terminal text-[11px] text-amber">{p.ref}</td>
                <td className="px-4 py-3 font-terminal text-[11px] text-off-white">{p.name}</td>
                <td className="px-4 py-3 font-terminal text-[11px] text-dim">{p.category}</td>
                <td className="px-4 py-3 font-terminal text-[11px] text-off-white">{p.price}€</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleSoldOut(p)}
                    className={`font-terminal text-[10px] tracking-widest px-2 py-0.5 border transition-colors
                      ${p.soldOut ? "border-brand-red text-brand-red hover:bg-brand-red hover:text-black" : "border-amber text-amber hover:bg-amber hover:text-black"}`}>
                    {p.soldOut ? "AGOTADO" : "DISPONIBLE"}
                  </button>
                </td>
                <td className="px-4 py-3 flex gap-3">
                  <button onClick={() => startEdit(p)} className="font-terminal text-[10px] text-dim hover:text-off-white transition-colors">EDITAR</button>
                  <button onClick={() => handleDelete(p._id)} className="font-terminal text-[10px] text-dim hover:text-brand-red transition-colors">BORRAR</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
