"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import type { IProduct } from "@/lib/models/product";

interface Props {
  product: IProduct;
}

export default function ProductDetail({ product }: Props) {
  const router = useRouter();

  function handleBack() {
    const navigate = () => router.back();
    if (typeof document !== "undefined" && document.startViewTransition) {
      document.startViewTransition(navigate);
    } else {
      navigate();
    }
  }

  const hasImage = product.images.length > 0;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--theme-bg)" }}>

      {/* Header minimal */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button
          onClick={handleBack}
          className="font-terminal text-[11px] text-dim hover:text-off-white tracking-widest uppercase transition-colors flex items-center gap-2"
        >
          <span>←</span> VOLVER
        </button>
        <span className="font-brand text-lg text-off-white tracking-widest">04009c</span>
        <span className="font-terminal text-[10px] text-amber/60">{product.ref}</span>
      </header>

      {/* Contenido */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-57px)]">

        {/* Imagen — morphea desde la card */}
        <div
          className="relative w-full lg:w-1/2 aspect-[3/4] lg:aspect-auto lg:min-h-full bg-surface"
          style={{ viewTransitionName: `product-${product.slug}` }}
        >
          {hasImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 grain">
              <Image src="/caballo_blanco.png" alt="" width={48} height={48} className="object-contain opacity-10" />
              <span className="font-terminal text-[10px] text-dim tracking-widest">// IMG PENDIENTE</span>
            </div>
          )}

          {product.soldOut && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="font-terminal text-[13px] text-brand-red tracking-widest border border-brand-red px-4 py-2">
                // AGOTADO
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 lg:px-16 gap-6">

          <div className="flex flex-col gap-1">
            <span className="data-label">{product.category}</span>
            <h1 className="font-display text-4xl lg:text-5xl text-off-white tracking-wider uppercase leading-tight">
              {product.name}
            </h1>
            <p className="font-terminal text-xl text-amber mt-1">
              {product.price.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
            </p>
          </div>

          {product.description && (
            <p className="font-body text-sm text-dim leading-relaxed max-w-sm">
              {product.description}
            </p>
          )}

          {/* Datos de sistema */}
          <div className="border-t border-border pt-4 flex flex-col gap-1">
            <span className="font-terminal text-[10px] text-amber/50 tracking-wider">// FICHA TÉCNICA</span>
            <div className="flex gap-6 mt-1">
              <div>
                <span className="data-label block">REF</span>
                <span className="font-terminal text-xs text-off-white">{product.ref}</span>
              </div>
              <div>
                <span className="data-label block">CATEGORÍA</span>
                <span className="font-terminal text-xs text-off-white">{product.category}</span>
              </div>
              <div>
                <span className="data-label block">ESTADO</span>
                <span className={`font-terminal text-xs ${product.soldOut ? "text-brand-red" : "text-amber"}`}>
                  {product.soldOut ? "AGOTADO" : "DISPONIBLE"}
                </span>
              </div>
            </div>
          </div>

          {/* CTA — placeholder para Stripe */}
          <button
            disabled={product.soldOut}
            className="w-full max-w-sm bg-off-white text-black font-terminal text-sm tracking-widest uppercase py-4 hover:bg-amber transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
          >
            {product.soldOut ? "// AGOTADO" : "AÑADIR AL CARRITO"}
          </button>

        </div>
      </div>
    </main>
  );
}
