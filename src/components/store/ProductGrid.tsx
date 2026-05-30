"use client";

import { useState, useEffect } from "react";
import type { IProduct } from "@/lib/models/product";
import CategoryNav from "./CategoryNav";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?category=${activeCategory}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <>
      <CategoryNav active={activeCategory} onChange={setActiveCategory} />

      <section className="px-6 py-8">
        {loading ? (
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
