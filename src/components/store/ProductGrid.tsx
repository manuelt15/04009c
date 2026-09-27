"use client";

import { useState, useEffect } from "react";
import type { IProduct } from "@/lib/models/product";
import CategoryNav from "./CategoryNav";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState("TODO");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0); // cambia al llegar datos nuevos: re-lanza la entrada de las cards

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?category=${activeCategory}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products ?? []);
        setVersion((v) => v + 1);
      })
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <>
      <CategoryNav active={activeCategory} onChange={setActiveCategory} />

      <section className="flex-1 px-6 py-8">
        {/* Al cambiar de categoría se mantienen los productos anteriores hasta que llegan los nuevos */}
        {loading && products.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <span className="font-terminal text-[11px] text-dim tracking-widest animate-pulse">
              // CARGANDO...
            </span>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2">
            <span className="font-terminal text-[11px] text-dim tracking-widest">// SIN PRODUCTOS</span>
            <span className="font-terminal text-[10px] text-dim/50">COLECCIÓN EN PREPARACIÓN</span>
          </div>
        ) : (
          <div
            key={version}
            className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 transition-opacity duration-150 ${loading ? "opacity-60" : ""}`}
          >
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
