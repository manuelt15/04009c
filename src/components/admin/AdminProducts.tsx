"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { IProduct, ISizeStock, SizeKey } from "@/lib/models/product";
import type { SizeGuideKind } from "@/lib/models/category";
import AdminSelect from "./AdminSelect";
import ConfirmDialog from "./ConfirmDialog";
import { useToast } from "@/components/shared/Toaster";
import { isNewProduct } from "@/lib/new-products";
import { isSoldOut, stockSummary } from "@/lib/stock";

interface CategoryOption {
  name: string;
  sizeGuide: SizeGuideKind;
}

const EMPTY: Partial<IProduct> = { name: "", price: 0, category: "", images: [], description: "", soldOut: false, sizes: [], slug: "", ref: "" };
const CLOTHING_SIZES: SizeKey[] = ["S", "M", "L", "XL"];
const INPUT = "bg-[var(--theme-bg)] border border-border text-off-white font-terminal text-sm px-3 py-2 focus:outline-none focus:border-brand-red transition-colors";

// "Archive Hoodie 003" → "archive-hoodie-003"
function slugify(text: string): string {
  return text
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Siguiente referencia libre: REF-010 → REF-011
function nextRef(products: IProduct[]): string {
  const max = products.reduce((m, p) => Math.max(m, Number(/REF-(\d+)/.exec(p.ref)?.[1] ?? 0)), 0);
  return `REF-${String(max + 1).padStart(3, "0")}`;
}

export default function AdminProducts() {
  const [products, setProducts]     = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [form, setForm]             = useState<Partial<IProduct>>(EMPTY);
  const [editing, setEditing]       = useState<string | null>(null);
  const [showForm, setShowForm]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [toDelete, setToDelete]     = useState<IProduct | null>(null);
  const toast = useToast();

  async function load() {
    const [rp, rc] = await Promise.all([fetch("/api/admin/products"), fetch("/api/admin/categories")]);
    const [dp, dc] = await Promise.all([rp.json(), rc.json()]);
    setProducts(dp.products ?? []);
    setCategories(dc.categories ?? []);
  }

  useEffect(() => { load(); }, []);

  const guideOf = (cat?: string) => categories.find((c) => c.name === cat)?.sizeGuide ?? "tops";
  const sizeKeys = (cat?: string): SizeKey[] => (guideOf(cat) === "none" ? ["U"] : CLOTHING_SIZES);
  const manageStock = (form.sizes?.length ?? 0) > 0;

  function startNew() {
    setForm({ ...EMPTY, category: categories[0]?.name ?? "", ref: nextRef(products) });
    setEditing(null);
    setSlugTouched(false);
    setShowForm(true);
  }

  function startEdit(p: IProduct) {
    setForm({ ...p, sizes: p.sizes ?? [] });
    setEditing(p._id);
    setSlugTouched(true); // al editar no se reescribe el slug: cambiaría la URL del producto
    setShowForm(true);
  }

  function setName(name: string) {
    setForm((p) => ({ ...p, name, slug: slugTouched ? p.slug : slugify(name) }));
  }

  function setCategory(category: string) {
    // Si cambia entre ropa y talla única, las tallas guardadas dejan de tener sentido
    setForm((p) => {
      const sameKind = (guideOf(p.category) === "none") === (guideOf(category) === "none");
      return { ...p, category, sizes: sameKind || !(p.sizes?.length) ? p.sizes : sizeKeys(category).map((size) => ({ size, stock: 0 })) };
    });
  }

  function toggleStock(on: boolean) {
    setForm((p) => ({ ...p, sizes: on ? sizeKeys(p.category).map((size) => ({ size, stock: 0 })) : [] }));
  }

  function setStock(size: SizeKey, stock: number) {
    setForm((p) => ({
      ...p,
      sizes: (p.sizes ?? []).map((s): ISizeStock => (s.size === size ? { size, stock: Math.max(0, Math.floor(stock) || 0) } : s)),
    }));
  }

  async function handleSave() {
    const missing = [
      !form.name?.trim() && "NOMBRE",
      !form.slug?.trim() && "SLUG",
      !form.ref?.trim() && "REF",
      !(Number(form.price) > 0) && "PRECIO",
      !form.category && "CATEGORÍA",
    ].filter(Boolean);
    if (missing.length > 0) {
      toast(`FALTAN DATOS: ${missing.join(", ")}`, "error");
      return;
    }
    const clash = products.find((p) => p._id !== editing && p.slug === form.slug);
    if (clash) {
      toast(`EL SLUG YA LO USA ${clash.name}`, "error");
      return;
    }

    setLoading(true);
    const res = editing
      ? await fetch("/api/admin/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing, ...form }) })
      : await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);

    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      toast(d.error ?? "NO SE PUDO GUARDAR", "error");
      return;
    }
    toast(editing ? "PRODUCTO ACTUALIZADO" : "PRODUCTO CREADO", "success");
    setForm(EMPTY); setEditing(null); setShowForm(false); load();
  }

  const confirmDelete = useCallback(async () => {
    if (!toDelete) return;
    const res = await fetch("/api/admin/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: toDelete._id }) });
    toast(res.ok ? "PRODUCTO ELIMINADO" : "NO SE PUDO ELIMINAR", res.ok ? "success" : "error");
    setToDelete(null);
    load();
  }, [toDelete, toast]);

  const cancelDelete = useCallback(() => setToDelete(null), []);

  async function toggleSoldOut(p: IProduct) {
    await fetch("/api/admin/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p._id, soldOut: !p.soldOut }) });
    load();
  }

  return (
    <div className="p-4 md:p-6 pt-16 md:pt-6 flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="data-label">{"// GESTIÓN"}</span>
          <h1 className="font-display text-2xl md:text-3xl text-off-white tracking-wider">PRODUCTOS</h1>
        </div>
        <button onClick={startNew}
          className="font-terminal text-[11px] tracking-widest uppercase px-4 py-2 border border-brand-red text-brand-red hover:bg-brand-red hover:text-off-white press">
          + NUEVO
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-surface border border-border p-4 md:p-5 flex flex-col gap-4">
          <span className="data-label">{editing ? "// EDITAR PRODUCTO" : "// NUEVO PRODUCTO"}</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="data-label">NOMBRE</span>
              <input type="text" value={form.name ?? ""} onChange={(e) => setName(e.target.value)} className={INPUT} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="data-label">SLUG {slugTouched ? "" : "· AUTOMÁTICO"}</span>
              <input type="text" value={form.slug ?? ""} className={INPUT}
                onChange={(e) => { setSlugTouched(true); setForm((p) => ({ ...p, slug: slugify(e.target.value) })); }} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="data-label">REF</span>
              <input type="text" value={form.ref ?? ""} onChange={(e) => setForm((p) => ({ ...p, ref: e.target.value.toUpperCase() }))} className={INPUT} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="data-label">PRECIO (€)</span>
              <input type="number" min={0} step="0.01" value={form.price ?? 0}
                onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} className={INPUT} />
            </label>
            <div className="flex flex-col gap-1">
              <span className="data-label">CATEGORÍA</span>
              <AdminSelect
                label="Categoría del producto"
                value={form.category ?? ""}
                options={categories.map((c) => ({ value: c.name, label: c.name }))}
                onChange={setCategory}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="data-label">IMÁGENES (URLs separadas por coma)</span>
              <div className="flex gap-2">
                <input type="text" value={form.images?.join(",") ?? ""} className={`${INPUT} flex-1 min-w-0`} aria-label="URLs de las imágenes"
                  onChange={(e) => setForm((p) => ({ ...p, images: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))} />
                {/* Pendiente de conectar almacenamiento (Cloudinary o Vercel Blob) */}
                <button type="button" disabled title="Disponible cuando se conecte el almacenamiento de fotos"
                  className="flex items-center gap-2 shrink-0 border border-border text-dim font-terminal text-[10px] tracking-widest uppercase px-3 opacity-50 cursor-not-allowed">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                    <path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" />
                  </svg>
                  SUBIR FOTOS
                </button>
              </div>
              <span className="font-terminal text-[9px] text-dim">SUBIDA DIRECTA: PRÓXIMAMENTE</span>
            </div>
          </div>

          <label className="flex flex-col gap-1">
            <span className="data-label">DESCRIPCIÓN</span>
            <textarea value={form.description ?? ""} rows={2} className={`${INPUT} resize-none`}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </label>

          {/* Stock por talla */}
          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={manageStock} onChange={(e) => toggleStock(e.target.checked)} className="accent-[var(--color-brand-red)]" />
              <span className="font-terminal text-[11px] text-off-white tracking-widest">GESTIONAR STOCK POR TALLA</span>
            </label>
            {manageStock ? (
              <div className="flex flex-wrap gap-3">
                {(form.sizes ?? []).map((s) => (
                  <label key={s.size} className="flex flex-col gap-1 w-20">
                    <span className="data-label">{s.size === "U" ? "ÚNICA" : s.size}</span>
                    <input type="number" min={0} value={s.stock} onChange={(e) => setStock(s.size, Number(e.target.value))} className={INPUT} />
                  </label>
                ))}
              </div>
            ) : (
              <span className="font-terminal text-[10px] text-dim">
                SIN CONTROL DE STOCK: SE OFRECEN TODAS LAS TALLAS SIN LÍMITE.
              </span>
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.soldOut ?? false} className="accent-[var(--color-brand-red)]"
                onChange={(e) => setForm((p) => ({ ...p, soldOut: e.target.checked }))} />
              <span className="font-terminal text-[11px] text-dim">MARCAR COMO AGOTADO (AUNQUE TENGA STOCK)</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={loading}
              className="font-terminal text-[11px] tracking-widest uppercase px-4 py-2 bg-off-white text-black hover:bg-brand-red hover:text-off-white press disabled:opacity-40">
              {loading ? "GUARDANDO..." : "GUARDAR"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="font-terminal text-[11px] tracking-widest uppercase px-4 py-2 border border-border text-dim hover:text-off-white press">
              CANCELAR
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-surface border border-border overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <caption className="sr-only">Productos del catálogo</caption>
          <thead className="border-b border-border">
            <tr>
              {["", "REF", "NOMBRE", "CAT", "PRECIO", "STOCK", "ESTADO", "ACCIONES"].map((h, i) => (
                <th scope="col" key={i} className="text-left px-4 py-3 font-terminal text-[10px] text-dim tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => {
              const out = isSoldOut(p);
              return (
                <tr key={p._id} className="hover:bg-black/30 transition-colors">
                  <td className="pl-4 py-2">
                    <div className={`relative w-8 aspect-[3/4] ${p.images[0] ? "bg-off-white" : "bg-[var(--theme-bg)]"}`}>
                      {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="32px" className="product-photo" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-terminal text-[11px] text-brand-red">{p.ref}</td>
                  <td className="px-4 py-3 font-terminal text-[11px] text-off-white">
                    <span className="flex items-center gap-2">
                      {p.name}
                      {isNewProduct(p.createdAt) && (
                        <span className="bg-brand-red text-off-white text-[8px] tracking-widest px-1.5 py-0.5">NUEVO</span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-terminal text-[11px] text-dim">{p.category}</td>
                  <td className="px-4 py-3 font-terminal text-[11px] text-off-white">{p.price}€</td>
                  <td className="px-4 py-3 font-terminal text-[10px] text-dim whitespace-nowrap">{stockSummary(p.sizes)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleSoldOut(p)} title={p.soldOut ? "Quitar agotado manual" : "Marcar agotado a mano"}
                      className={`font-terminal text-[10px] tracking-widest px-2 py-0.5 border transition-colors
                        ${out ? "border-brand-red text-brand-red hover:bg-brand-red hover:text-off-white" : "border-off-white/40 text-off-white hover:bg-off-white hover:text-black"}`}>
                      {out ? "AGOTADO" : "DISPONIBLE"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex gap-3">
                      <button onClick={() => startEdit(p)} className="font-terminal text-[10px] text-dim hover:text-off-white transition-colors">EDITAR</button>
                      <button onClick={() => setToDelete(p)} className="font-terminal text-[10px] text-dim hover:text-brand-red transition-colors">BORRAR</button>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="// ¿ELIMINAR PRODUCTO?"
        detail={toDelete ? `${toDelete.ref} · ${toDelete.name}. No se puede deshacer.` : undefined}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
