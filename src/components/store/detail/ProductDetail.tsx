"use client";

import { useState } from "react";
import { handleRadioKeys } from "@/lib/a11y/radio";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { IProduct } from "@/lib/models/product";
import StoreFooter from "@/components/store/StoreFooter";
import { useToast } from "@/components/shared/Toaster";
import { SIZES, type Size, type SizeGuide } from "@/lib/size-guide";
import { addToCart, useCart, cartKey, MAX_QTY } from "@/lib/cart-store";
import { isSoldOut } from "@/lib/stock";
import CartButton from "@/components/store/cart/CartButton";

const LABEL = "font-terminal text-[0.65rem] tracking-[0.12em] uppercase text-brand-red";

interface Props {
  product: IProduct;
  guide: SizeGuide | null; // null = categoría de talla única
}

export default function ProductDetail({ product, guide }: Props) {
  const router = useRouter();
  const toast = useToast();
  const cart = useCart();
  const [size, setSize] = useState<Size | null>(null);
  const [qty, setQty] = useState(1);
  const soldOut = isSoldOut(product);
  const sizes = product.sizes ?? [];

  // Sin control de stock (sizes vacío): todas las tallas, hasta MAX_QTY por línea
  function stockOf(s: Size | "U"): number {
    if (sizes.length === 0) return MAX_QTY;
    return sizes.find((x) => x.size === s)?.stock ?? 0;
  }

  const selectedStock = guide ? (size ? stockOf(size) : MAX_QTY) : stockOf("U");
  const maxQty = Math.max(1, Math.min(MAX_QTY, selectedStock));

  function chooseSize(s: Size) {
    setSize(s);
    setQty((q) => Math.min(q, Math.max(1, Math.min(MAX_QTY, stockOf(s)))));
  }

  function handleAddToCart() {
    if (guide && !size) {
      toast("SELECCIONA UNA TALLA", "error");
      return;
    }
    const lineSize = guide ? size : null;
    const talla = lineSize ? `TALLA ${lineSize}` : "TALLA ÚNICA";
    const stock = Math.min(MAX_QTY, guide && size ? stockOf(size) : stockOf("U"));
    const inCart = cart.find((i) => i.key === cartKey(product._id, lineSize))?.qty ?? 0;
    const room = stock - inCart;
    if (room <= 0) {
      toast(`YA TIENES EN EL CARRITO TODO EL STOCK DISPONIBLE · ${talla}`, "error");
      return;
    }
    const added = Math.min(qty, room);
    addToCart(
      {
        productId: product._id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0] ?? null,
        size: lineSize,
        maxQty: stock,
      },
      added,
    );
    toast(
      added < qty
        ? `SOLO QUEDABAN ${added} UD. MÁS · AÑADIDAS AL CARRITO (${talla})`
        : `AÑADIDO AL CARRITO: ${added} × ${product.name} · ${talla}`,
      added < qty ? "info" : "success",
    );
    setQty(1);
  }

  function handleBack() {
    // Ruta fija y no router.back(): si la ficha se abrió directamente (enlace compartido,
    // pestaña recargada en el móvil) no hay historial y back() saca al usuario de la web
    const navigate = () => router.push("/store");
    if (typeof document !== "undefined" && document.startViewTransition) {
      document.startViewTransition(navigate);
    } else {
      navigate();
    }
  }

  const hasImage = product.images.length > 0;

  return (
    <main className="min-h-dvh" style={{ backgroundColor: "var(--theme-bg)" }}>

      {/* Header minimal */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button
          onClick={handleBack}
          className="font-terminal text-[11px] text-dim hover:text-off-white tracking-widest uppercase transition-colors flex items-center gap-2 py-3.5 -my-3.5 pr-4"
        >
          <span>←</span> VOLVER
        </button>
        <span className="font-brand text-lg text-off-white tracking-widest">04009c</span>
        <div className="flex items-center gap-4">
          <span className="font-terminal text-[10px] text-brand-red">{product.ref}</span>
          <CartButton />
        </div>
      </header>

      {/* Contenido */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100dvh-57px)]">

        {/* Imagen — morphea desde la card */}
        <div
          className={`vt-product relative w-full lg:w-1/2 aspect-[3/4] lg:aspect-auto lg:min-h-full ${hasImage ? "bg-off-white" : "bg-surface"}`}
          style={{ viewTransitionName: `product-${product.slug}` }}
        >
          {hasImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="product-photo"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 grain">
              <Image src="/caballo_blanco.png" alt="" width={48} height={48} className="object-contain opacity-10" />
              <span className="font-terminal text-[10px] text-dim tracking-widest">// IMG PENDIENTE</span>
            </div>
          )}

          {soldOut && (
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
            <span className="font-terminal text-[0.65rem] tracking-[0.12em] uppercase text-brand-red">{product.category}</span>
            <h1 className="font-display text-4xl lg:text-5xl text-off-white tracking-wider uppercase leading-tight">
              {product.name}
            </h1>
            <p className="font-terminal text-xl text-brand-red mt-1">
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
            <span className="font-terminal text-[10px] text-brand-red tracking-wider">// FICHA TÉCNICA</span>
            <div className="flex gap-6 mt-1">
              <div>
                <span className="font-terminal text-[0.65rem] tracking-[0.12em] uppercase text-brand-red block">REF</span>
                <span className="font-terminal text-xs text-off-white">{product.ref}</span>
              </div>
              <div>
                <span className="font-terminal text-[0.65rem] tracking-[0.12em] uppercase text-brand-red block">CATEGORÍA</span>
                <span className="font-terminal text-xs text-off-white">{product.category}</span>
              </div>
              <div>
                <span className="font-terminal text-[0.65rem] tracking-[0.12em] uppercase text-brand-red block">ESTADO</span>
                <span className={`font-terminal text-xs ${soldOut ? "text-brand-red" : "text-off-white"}`}>
                  {soldOut ? "AGOTADO" : "DISPONIBLE"}
                </span>
              </div>
            </div>
          </div>

          {!soldOut && (
            <div className="flex flex-col gap-5 max-w-sm">
              {/* Aviso de maqueta junto al gesto de compra */}
              <p
                role="note"
                className="font-terminal text-[10px] tracking-[0.12em] uppercase text-brand-red border border-brand-red px-3 py-2 leading-relaxed"
              >
                Maqueta — talla y precio de ejemplo: se añade al carrito, pero no se compra nada
              </p>

              {/* Talla */}
              <div className="flex flex-col gap-2">
                <span className={LABEL}>TALLA</span>
                {guide ? (
                  <div className="flex gap-2" role="radiogroup" aria-label="Talla" onKeyDown={handleRadioKeys}>
                    {SIZES.map((s) => {
                      const out = stockOf(s) <= 0;
                      return (
                        <button
                          key={s}
                          role="radio"
                          aria-checked={size === s}
                          tabIndex={size === s || (size === null && SIZES.find((option) => stockOf(option) > 0) === s) ? 0 : -1}
                          aria-label={out ? `Talla ${s}, agotada` : `Talla ${s}`}
                          disabled={out}
                          onClick={() => chooseSize(s)}
                          className={`w-12 h-11 font-terminal text-sm tracking-widest border press disabled:cursor-not-allowed ${
                            out
                              ? "border-border text-dim line-through"
                              : size === s
                                ? "bg-off-white text-black border-off-white"
                                : "border-border text-off-white hover:border-brand-red"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <span className="font-terminal text-xs text-off-white">TALLA ÚNICA</span>
                )}
              </div>

              {/* Guía de medidas */}
              {guide && (
                <div className="flex flex-col gap-2">
                  <span className={LABEL}>GUÍA DE MEDIDAS (CM)</span>
                  <table className="w-full font-terminal text-[11px] text-dim border-collapse">
                    <caption className="sr-only">Guía de medidas en centímetros</caption>
                    <thead>
                      <tr className="border-b border-border">
                        <th scope="col" className="text-left font-normal py-1.5">TALLA</th>
                        <th scope="col" className="text-left font-normal py-1.5">{guide.columns[0]}</th>
                        <th scope="col" className="text-left font-normal py-1.5">{guide.columns[1]}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SIZES.map((s) => (
                        <tr key={s} className={`border-b border-border ${size === s ? "text-off-white" : ""}`}>
                          <td className="py-1.5">{s}</td>
                          <td className="py-1.5">{guide.rows[s][0]}</td>
                          <td className="py-1.5">{guide.rows[s][1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <span className="font-terminal text-[10px] text-dim">MEDIDAS DE LA PRENDA EN PLANO</span>
                </div>
              )}

              {/* Cantidad */}
              <div className="flex flex-col gap-2">
                <span className={LABEL}>CANTIDAD</span>
                <div className="flex items-center border border-border w-fit">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    aria-label="Quitar una unidad"
                    className="w-11 h-11 font-terminal text-off-white hover:text-brand-red press disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-terminal text-sm text-off-white" aria-live="polite">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    disabled={qty >= maxQty}
                    aria-label="Añadir una unidad"
                    className="w-11 h-11 font-terminal text-off-white hover:text-brand-red press disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CTA — placeholder para Stripe */}
          <button
            onClick={handleAddToCart}
            disabled={soldOut}
            className="w-full max-w-sm bg-off-white text-black font-terminal text-sm tracking-widest uppercase py-4 hover:bg-brand-red hover:text-off-white press disabled:opacity-40 disabled:cursor-not-allowed mt-2"
          >
            {soldOut ? "// AGOTADO" : "AÑADIR AL CARRITO"}
          </button>

        </div>
      </div>

      <StoreFooter />
    </main>
  );
}
