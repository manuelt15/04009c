"use client";

import { useEffect, useState } from "react";
import type { ShippingMethod } from "@/lib/shipping";
import { SIZES, type SizeGuide } from "@/lib/size-guide";

type Guides = { tops: SizeGuide; bottoms: SizeGuide };

const GUIDE_TITLES: Record<keyof Guides, string> = { tops: "ROPA (HOODIES, CAMISETAS…)", bottoms: "PANTALONES" };

// Vista de prueba: los envíos y las medidas se enseñan, pero no se guardan.
export default function AdminStoreSettings() {
  const [shipping, setShipping] = useState<ShippingMethod[]>([]);
  const [guides, setGuides] = useState<Guides | null>(null);

  useEffect(() => {
    fetch("/api/admin/store-settings").then((r) => r.json()).then((d) => {
      setShipping(d.shipping ?? []);
      setGuides(d.sizeGuides ?? null);
    });
  }, []);

  return (
    <>
      {/* Envíos */}
      <div className="bg-surface border border-border p-5 flex flex-col gap-4">
        <span className="data-label">{"// MÉTODOS DE ENVÍO"}</span>
        <p className="font-terminal text-[11px] text-dim">Lo que el cliente elige en el checkout. Precios en euros, IVA incluido.</p>
        <ul className="flex flex-col gap-2">
          {shipping.map((m) => (
            <li key={m.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_110px] gap-2 items-center border border-border px-3 py-2">
              <span className="font-terminal text-xs text-off-white">{m.label}</span>
              <span className="font-terminal text-[10px] text-dim">{m.detail}</span>
              <span className="font-terminal text-xs text-off-white">{m.price}€</span>
            </li>
          ))}
        </ul>
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
                      <th scope="col" className="text-left text-dim font-normal pr-2 pb-2">TALLA</th>
                      {[0, 1].map((col) => (
                        <th key={col} className="pr-2 pb-2" scope="col">{guides[kind].columns[col]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SIZES.map((s) => (
                      <tr key={s}>
                        <td className="text-off-white pr-2 py-1">{s}</td>
                        {[0, 1].map((col) => (
                          <td key={col} className="pr-2 py-1">{guides[kind].rows[s][col]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
