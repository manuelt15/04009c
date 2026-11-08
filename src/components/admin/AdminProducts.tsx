"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { IProduct } from "@/lib/models/product";
import { isNewProduct } from "@/lib/new-products";
import { isSoldOut, stockSummary } from "@/lib/stock";

// Vista de prueba: el catálogo se enseña, pero no se puede modificar nada.
export default function AdminProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    fetch("/api/admin/products").then((r) => r.json()).then((d) => setProducts(d.products ?? []));
  }, []);

  return (
    <div className="p-4 md:p-6 pt-16 md:pt-6 flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="data-label">{"// GESTIÓN"}</span>
          <h1 className="font-display text-2xl md:text-3xl text-off-white tracking-wider">PRODUCTOS</h1>
        </div>
        <span className="font-terminal text-[10px] text-dim tracking-widest uppercase">
          Solo lectura · {products.length} productos de ejemplo
        </span>
      </div>

      {/* Tabla */}
      <div className="bg-surface border border-border overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <caption className="sr-only">Productos del catálogo (datos de ejemplo)</caption>
          <thead className="border-b border-border">
            <tr>
              {["", "REF", "NOMBRE", "CAT", "PRECIO", "STOCK", "ESTADO"].map((h, i) => (
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
                    <span
                      className={`font-terminal text-[10px] tracking-widest px-2 py-0.5 border
                        ${out ? "border-brand-red text-brand-red" : "border-off-white/40 text-off-white"}`}
                    >
                      {out ? "AGOTADO" : "DISPONIBLE"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
