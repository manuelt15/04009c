"use client";

import { useCallback, useEffect, useState } from "react";
import type { SizeGuideKind } from "@/lib/models/category";
import AdminSelect from "./AdminSelect";
import ConfirmDialog from "./ConfirmDialog";
import { useToast } from "@/components/shared/Toaster";

interface Row {
  _id: string;
  name: string;
  sizeGuide: SizeGuideKind;
  products: number;
}

const GUIDE_OPTIONS = [
  { value: "tops", label: "ROPA · PECHO / LARGO" },
  { value: "bottoms", label: "PANTALÓN · CINTURA / LARGO" },
  { value: "none", label: "TALLA ÚNICA" },
];

const INPUT = "bg-[var(--theme-bg)] border border-border text-off-white font-terminal text-sm px-3 py-2 focus:border-brand-red transition-colors placeholder:text-dim/50";

export default function AdminCategories() {
  const [rows, setRows] = useState<Row[]>([]);
  const [newName, setNewName] = useState("");
  const [newGuide, setNewGuide] = useState<SizeGuideKind>("tops");
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const toast = useToast();

  const load = useCallback(async () => {
    const d = await fetch("/api/admin/categories").then((r) => r.json());
    setRows(d.categories ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function send(method: "POST" | "PATCH" | "DELETE", body: object, ok: string) {
    const r = await fetch("/api/admin/categories", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    toast(r.ok ? ok : (d.error ?? "NO SE PUDO GUARDAR"), r.ok ? "success" : "error");
    if (r.ok) load();
    return r.ok;
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) {
      toast("ESCRIBE EL NOMBRE DE LA CATEGORÍA", "error");
      return;
    }
    if (await send("POST", { name: newName, sizeGuide: newGuide }, "CATEGORÍA CREADA")) setNewName("");
  }

  async function rename() {
    if (!editing) return;
    if (await send("PATCH", { id: editing.id, name: editing.name }, "CATEGORÍA RENOMBRADA")) setEditing(null);
  }

  async function confirmDelete() {
    if (toDelete) await send("DELETE", { id: toDelete._id }, "CATEGORÍA ELIMINADA");
    setToDelete(null);
  }

  const cancelDelete = useCallback(() => setToDelete(null), []);

  return (
    <div className="bg-surface border border-border p-5 flex flex-col gap-4">
      <span className="data-label">{"// CATEGORÍAS"}</span>
      <p className="font-terminal text-[11px] text-dim">
        El orden es el de la barra de la tienda. TODO y NUEVOS son automáticas. La guía decide qué tabla de medidas ve el cliente.
      </p>

      <ul className="divide-y divide-border border border-border">
        {rows.map((c, i) => (
          <li key={c._id} className="flex flex-wrap items-center gap-3 px-3 py-2">
            <span className="flex flex-col">
              <button onClick={() => send("PATCH", { id: c._id, move: "up" }, "ORDEN ACTUALIZADO")} disabled={i === 0}
                aria-label={`Subir ${c.name}`} className="text-dim hover:text-off-white disabled:opacity-20 text-[10px] leading-none">▲</button>
              <button onClick={() => send("PATCH", { id: c._id, move: "down" }, "ORDEN ACTUALIZADO")} disabled={i === rows.length - 1}
                aria-label={`Bajar ${c.name}`} className="text-dim hover:text-off-white disabled:opacity-20 text-[10px] leading-none">▼</button>
            </span>
            {editing?.id === c._id ? (
              <input aria-label={`Renombrar categoría ${c.name}`} autoFocus value={editing.name} onChange={(e) => setEditing({ id: c._id, name: e.target.value })}
                onKeyDown={(e) => { if (e.key === "Enter") rename(); if (e.key === "Escape") setEditing(null); }}
                className={`${INPUT} w-44 py-1`} />
            ) : (
              <span className="font-terminal text-xs text-off-white w-44">{c.name}</span>
            )}
            <span className="font-terminal text-[10px] text-dim w-24">{c.products} PRODUCTO{c.products === 1 ? "" : "S"}</span>
            <AdminSelect value={c.sizeGuide} options={GUIDE_OPTIONS}
              onChange={(v) => send("PATCH", { id: c._id, sizeGuide: v }, "GUÍA ACTUALIZADA")} />
            <span className="flex gap-3 ml-auto">
              {editing?.id === c._id ? (
                <>
                  <button onClick={rename} className="font-terminal text-[10px] text-off-white hover:text-brand-red">GUARDAR</button>
                  <button onClick={() => setEditing(null)} className="font-terminal text-[10px] text-dim hover:text-off-white">CANCELAR</button>
                </>
              ) : (
                <>
                  <button aria-label={`Renombrar ${c.name}`} onClick={() => setEditing({ id: c._id, name: c.name })} className="font-terminal text-[10px] text-dim hover:text-off-white">RENOMBRAR</button>
                  <button aria-label={`Borrar ${c.name}`} onClick={() => setToDelete(c)} className="font-terminal text-[10px] text-dim hover:text-brand-red">BORRAR</button>
                </>
              )}
            </span>
          </li>
        ))}
      </ul>

      <form onSubmit={add} className="flex flex-wrap items-center gap-3">
        <input aria-label="Nueva categoría" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="NUEVA CATEGORÍA" className={`${INPUT} flex-1 min-w-40`} />
        <AdminSelect value={newGuide} options={GUIDE_OPTIONS} onChange={(v) => setNewGuide(v as SizeGuideKind)} />
        <button type="submit" className="font-terminal text-[11px] tracking-widest uppercase px-4 py-2 border border-brand-red text-brand-red hover:bg-brand-red hover:text-off-white press">
          + AÑADIR
        </button>
      </form>

      <ConfirmDialog
        open={toDelete !== null}
        title="// ¿ELIMINAR CATEGORÍA?"
        detail={toDelete ? (toDelete.products > 0 ? `${toDelete.name} tiene ${toDelete.products} producto(s): muévelos antes a otra categoría.` : toDelete.name) : undefined}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
