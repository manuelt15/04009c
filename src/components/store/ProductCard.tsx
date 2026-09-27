"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import type { IProduct } from "@/lib/models/product";
import { isNewProduct } from "@/lib/new-products";
import { isSoldOut } from "@/lib/stock";

interface Props {
  product: IProduct;
  index?: number; // posición en la cuadrícula, para escalonar la entrada
}

export default function ProductCard({ product, index = 0 }: Props) {
  const router = useRouter();

  const hasImages = product.images.length > 0;
  const primaryImage = product.images[0] ?? null;
  const secondaryImage = product.images[1] ?? null;

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
      className="group flex flex-col gap-2 cursor-pointer card-in"
      style={{ animationDelay: `${Math.min(index, 7) * 30}ms` }}
      onClick={handleClick}
    >
      {/* Imagen */}
      <div
        className={`vt-product relative aspect-[3/4] ${hasImages ? "bg-off-white" : "bg-surface"} overflow-hidden border border-border group-hover:border-brand-red transition-colors duration-200`}
        style={{ viewTransitionName: `product-${product.slug}` }}
      >
        {hasImages && primaryImage ? (
          <>
            <Image src={primaryImage} alt={product.name} fill className="product-photo" />
            {/* Segunda foto: fundido real en hover (antes se cambiaba el src y no había transición) */}
            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt=""
                fill
                className="product-photo opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 grain">
            <Image src="/caballo_blanco.png" alt="" width={32} height={32} className="object-contain opacity-10" />
            <span className="font-terminal text-[9px] text-dim tracking-widest">// IMG PENDIENTE</span>
          </div>
        )}

        {isSoldOut(product) && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="font-terminal text-[11px] text-brand-red tracking-widest border border-brand-red px-3 py-1">
              // AGOTADO
            </span>
          </div>
        )}

        {isNewProduct(product.createdAt) && (
          <span className="absolute top-2 left-2 bg-brand-red text-off-white font-terminal text-[9px] tracking-widest uppercase px-2 py-0.5">
            NUEVO
          </span>
        )}

        <span className="absolute bottom-2 left-2 font-terminal text-[9px] text-brand-red tracking-wider">
          {product.ref}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <span className="font-terminal text-[0.65rem] tracking-[0.12em] uppercase text-brand-red">{product.category}</span>
        <p className="font-display text-base text-off-white tracking-wider uppercase leading-tight">
          {product.name}
        </p>
        <p className="font-terminal text-sm text-brand-red">
          {product.price.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
        </p>
      </div>
    </article>
  );
}
