"use client";

import { useEffect, useState } from "react";
import type { SizeGuideKind } from "@/lib/models/category";

interface Row {
  _id: string;
  name: string;
  sizeGuide: SizeGuideKind;
  products: number;
}

const GUIDE_LABEL: Record<SizeGuideKind, string> = {
  tops: "ROPA · PECHO / LARGO",
  bottoms: "PANTALÓN · CINTURA / LARGO",
  none: "TALLA ÚNICA",
};

// Vista de prueba: las categorías se enseñan, pero no se pueden crear,
// renombrar, reordenar ni borrar.
export default function AdminCategories() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then((d) => setRows(d.categories ?? []));
  }, []);

  return (
    <div className="bg-surface border border-border p-5 flex flex-col gap-4">
      <span className="data-label">{"// CATEGORÍAS"}</span>
      <p className="font-terminal text-[11px] text-dim">
        El orden es el de la barra de la tienda. TODO y NUEVOS son automáticas. La guía decide qué tabla de medidas ve el cliente.
      </p>

      <ul className="divide-y divide-border border border-border">
        {rows.map((c, i) => (
          <li key={c._id} className="flex flex-wrap items-center gap-3 px-3 py-2">
            <span className="flex flex-col w-6 text-dim text-[10px] leading-none">
              <span aria-hidden="true">▲</span>
              <span aria-hidden="true">▼</span>
            </span>
            <span className="font-terminal text-xs text-off-white w-44">{i + 1}. {c.name}</span>
            <span className="font-terminal text-[10px] text-dim w-24">{c.products} PRODUCTO{c.products === 1 ? "" : "S"}</span>
            <span className="font-terminal text-[10px] text-dim">{GUIDE_LABEL[c.sizeGuide] ?? c.sizeGuide}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
