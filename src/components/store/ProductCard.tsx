"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { IProduct } from "@/lib/models/product";

interface Props {
  product: IProduct;
}

export default function ProductCard({ product }: Props) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const hasImages = product.images.length > 0;
  const primaryImage = product.images[0] ?? null;
  const secondaryImage = product.images[1] ?? product.images[0] ?? null;
  const showImage = hovered && secondaryImage ? secondaryImage : primaryImage;

  function handleClick() {
    const navigate = () => router.push(`/store/${product.slug}`);
    if (typeof document !== "undefined" && document.startViewTransition) {
      document.startViewTransition(navigate);
    } else {
      navigate();
    }
  }

  return (
    <article
      className="group flex flex-col gap-2 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Imagen */}
      <div
        className="relative aspect-[3/4] bg-surface overflow-hidden border border-border group-hover:border-amber transition-colors duration-300"
        style={{ viewTransitionName: `product-${product.slug}` }}
      >
        {hasImages && showImage ? (
          <Image
            src={showImage}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 grain">
            <Image src="/caballo_blanco.png" alt="" width={32} height={32} className="object-contain opacity-10" />
            <span className="font-terminal text-[9px] text-dim tracking-widest">// IMG PENDIENTE</span>
          </div>
        )}

        {product.soldOut && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="font-terminal text-[11px] text-brand-red tracking-widest border border-brand-red px-3 py-1">
              // AGOTADO
            </span>
          </div>
        )}

        <span className="absolute bottom-2 left-2 font-terminal text-[9px] text-amber/50 tracking-wider">
          {product.ref}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <span className="data-label">{product.category}</span>
        <p className="font-display text-base text-off-white tracking-wider uppercase leading-tight">
          {product.name}
        </p>
        <p className="font-terminal text-sm text-amber">
          {product.price.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
        </p>
      </div>
    </article>
  );
}
