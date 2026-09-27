"use client";

import { useEffect, useState } from "react";
import type { ShippingMethod } from "@/lib/shipping";
import { SIZES, type SizeGuide } from "@/lib/size-guide";
import { useToast } from "@/components/shared/Toaster";

type Guides = { tops: SizeGuide; bottoms: SizeGuide };

const INPUT = "bg-[var(--theme-bg)] border border-border text-off-white font-terminal text-sm px-3 py-2 focus:outline-none focus:border-brand-red transition-colors placeholder:text-dim/50";
const SAVE = "self-start font-terminal text-[11px] tracking-widest uppercase px-5 py-2 bg-off-white text-black hover:bg-brand-red hover:text-off-white press disabled:opacity-40";
const GUIDE_TITLES: Record<keyof Guides, string> = { tops: "ROPA (HOODIES, CAMISETAS…)", bottoms: "PANTALONES" };

export default function AdminStoreSettings() {
  const [shipping, setShipping] = useState<ShippingMethod[]>([]);
  const [guides, setGuides] = useState<Guides | null>(null);
  const [saving, setSaving] = useState<"shipping" | "guides" | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetch("/api/admin/store-settings").then((r) => r.json()).then((d) => {
      setShipping(d.shipping ?? []);
      setGuides(d.sizeGuides ?? null);
    });
  }, []);

  async function save(part: "shipping" | "guides") {
    setSaving(part);
    const body = part === "shipping" ? { shipping } : { sizeGuides: guides };
    const r = await fetch("/api/admin/store-settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    setSaving(null);
    if (!r.ok) {
      toast(d.error ?? "NO SE PUDO GUARDAR", "error");
      return;
    }
    setShipping(d.shipping); setGuides(d.sizeGuides);
    toast(part === "shipping" ? "ENVÍOS ACTUALIZADOS" : "GUÍA DE MEDIDAS ACTUALIZADA", "success");
  }

  function editMethod(i: number, patch: Partial<ShippingMethod>) {
    setShipping((list) => list.map((m, j) => (j === i ? { ...m, ...patch } : m)));
  }

  function editCell(kind: keyof Guides, size: (typeof SIZES)[number], col: 0 | 1, value: number) {
    setGuides((g) => {
      if (!g) return g;
      const row = [...g[kind].rows[size]] as [number, number];
      row[col] = value;
      return { ...g, [kind]: { ...g[kind], rows: { ...g[kind].rows, [size]: row } } };
    });
  }

  function editColumn(kind: keyof Guides, col: 0 | 1, value: string) {
    setGuides((g) => {
      if (!g) return g;
      const columns = [...g[kind].columns] as [string, string];
      columns[col] = value.toUpperCase();
      return { ...g, [kind]: { ...g[kind], columns } };
    });
  }

  return (
    <>
      {/* Envíos */}
      <div className="bg-surface border border-border p-5 flex flex-col gap-4">
        <span className="data-label">{"// MÉTODOS DE ENVÍO"}</span>
        <p className="font-terminal text-[11px] text-dim">Lo que el cliente elige en el checkout. Precios en euros, IVA incluido.</p>
        <div className="flex flex-col gap-3">
          {shipping.map((m, i) => (
            <div key={m.id + i} className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_110px_auto] gap-2 items-center">
              <input value={m.label} onChange={(e) => editMethod(i, { label: e.target.value.toUpperCase() })} placeholder="NOMBRE" className={INPUT} aria-label="Nombre del envío" />
              <input value={m.detail} onChange={(e) => editMethod(i, { detail: e.target.value.toUpperCase() })} placeholder="PLAZO" className={INPUT} aria-label="Plazo" />
              <input type="number" min={0} step="0.01" value={m.price} onChange={(e) => editMethod(i, { price: Number(e.target.value) })} className={INPUT} aria-label="Precio" />
              <button onClick={() => setShipping((l) => l.filter((_, j) => j !== i))} disabled={shipping.length <= 1}
                className="font-terminal text-[10px] text-dim hover:text-brand-red disabled:opacity-30 px-2">QUITAR</button>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShipping((l) => [...l, { id: `envio-${Date.now()}`, label: "", detail: "", price: 0 }])} disabled={shipping.length >= 6}
            className="font-terminal text-[11px] tracking-widest uppercase px-4 py-2 border border-border text-dim hover:text-off-white press disabled:opacity-30">
            + MÉTODO
          </button>
          <button onClick={() => save("shipping")} disabled={saving !== null} className={SAVE}>
            {saving === "shipping" ? "GUARDANDO..." : "GUARDAR ENVÍOS"}
          </button>
        </div>
      </div>

      {/* Guía de medidas */}
      <div className="bg-surface border border-border p-5 flex flex-col gap-4">
        <span className="data-label">{"// GUÍA DE MEDIDAS (CM)"}</span>
        <p className="font-terminal text-[11px] text-dim">Medidas de la prenda en plano. Cada categoría usa una de estas dos tablas (se elige en CATEGORÍAS).</p>
        {guides && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(Object.keys(GUIDE_TITLES) as (keyof Guides)[]).map((kind) => (
              <div key={kind} className="flex flex-col gap-2">
                <span className="font-terminal text-[10px] text-off-white tracking-widest">{GUIDE_TITLES[kind]}</span>
                <table className="font-terminal text-xs">
                  <thead>
                    <tr>
                      <th className="text-left text-dim font-normal pr-2 pb-2">TALLA</th>
                      {[0, 1].map((col) => (
                        <th key={col} className="pr-2 pb-2">
                          <input value={guides[kind].columns[col]} onChange={(e) => editColumn(kind, col as 0 | 1, e.target.value)}
                            className={`${INPUT} w-full py-1 text-[11px]`} aria-label={`Columna ${col + 1}`} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SIZES.map((s) => (
                      <tr key={s}>
                        <td className="text-off-white pr-2 py-1">{s}</td>
                        {[0, 1].map((col) => (
                          <td key={col} className="pr-2 py-1">
                            <input type="number" min={1} value={guides[kind].rows[s][col]}
                              onChange={(e) => editCell(kind, s, col as 0 | 1, Number(e.target.value))}
                              className={`${INPUT} w-full py-1`} aria-label={`${s} ${guides[kind].columns[col]}`} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => save("guides")} disabled={saving !== null || !guides} className={SAVE}>
          {saving === "guides" ? "GUARDANDO..." : "GUARDAR MEDIDAS"}
        </button>
      </div>
    </>
  );
}
