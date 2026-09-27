"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCart, setQty, removeFromCart, cartCount, cartSubtotal, formatPrice, lineLimit,
} from "@/lib/cart-store";

interface Props {
  open: boolean;
  onClose: () => void;
}

const LABEL = "font-terminal text-[0.65rem] tracking-[0.12em] uppercase text-brand-red";

export default function CartDrawer({ open, onClose }: Props) {
  const items = useCart();
  const router = useRouter();

  // Escape para cerrar y sin scroll de fondo mientras está abierto
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  function goToCheckout() {
    onClose();
    router.push("/store/checkout");
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2 }}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrito"
            className="absolute top-0 right-0 h-full w-full sm:w-[420px] bg-[var(--theme-bg)] border-l border-border flex flex-col"
            initial={{ transform: "translateX(100%)" }}
            animate={{ transform: "translateX(0%)" }}
            exit={{ transform: "translateX(100%)", transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] } }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <span className={LABEL}>{`// CARRITO (${cartCount(items)})`}</span>
              <button
                onClick={onClose}
                aria-label="Cerrar carrito"
                className="font-terminal text-[11px] text-dim hover:text-off-white tracking-widest uppercase transition-colors py-2 -my-2"
              >
                CERRAR ✕
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
                <span className="font-terminal text-[11px] text-dim tracking-widest">{"// CARRITO VACÍO"}</span>
                <button
                  onClick={onClose}
                  className="font-terminal text-[11px] text-off-white hover:text-brand-red tracking-widest uppercase transition-colors underline underline-offset-4"
                >
                  SEGUIR COMPRANDO
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto divide-y divide-border">
                  {items.map((item) => (
                    <li key={item.key} className="flex gap-4 px-6 py-4">
                      <div className={`relative w-16 aspect-[3/4] shrink-0 ${item.image ? "bg-off-white" : "bg-surface"}`}>
                        {item.image && <Image src={item.image} alt={item.name} fill sizes="64px" className="product-photo" />}
                      </div>
                      <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <span className="font-display text-base text-off-white tracking-wider uppercase leading-tight truncate">
                          {item.name}
                        </span>
                        <span className="font-terminal text-[10px] text-dim tracking-widest uppercase">
                          {item.size ? `TALLA ${item.size}` : "TALLA ÚNICA"}
                        </span>
                        <div className="flex items-center justify-between mt-auto pt-2">
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => setQty(item.key, item.qty - 1)}
                              disabled={item.qty <= 1}
                              aria-label={`Quitar una unidad de ${item.name}`}
                              className="w-8 h-8 font-terminal text-off-white hover:text-brand-red press disabled:opacity-30"
                            >
                              −
                            </button>
                            <span className="w-7 text-center font-terminal text-xs text-off-white">{item.qty}</span>
                            <button
                              onClick={() => setQty(item.key, item.qty + 1)}
                              disabled={item.qty >= lineLimit(item)}
                              aria-label={`Añadir una unidad de ${item.name}`}
                              className="w-8 h-8 font-terminal text-off-white hover:text-brand-red press disabled:opacity-30"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-terminal text-sm text-brand-red">{formatPrice(item.price * item.qty)}</span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.key)}
                          className="self-start font-terminal text-[10px] text-dim hover:text-brand-red tracking-widest uppercase transition-colors mt-1"
                        >
                          ELIMINAR
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border px-6 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-terminal text-[11px] text-dim tracking-widest uppercase">SUBTOTAL</span>
                    <span className="font-terminal text-base text-off-white">{formatPrice(cartSubtotal(items))}</span>
                  </div>
                  <span className="font-terminal text-[10px] text-dim tracking-wider uppercase">
                    IVA incluido. El envío se calcula en el siguiente paso.
                  </span>
                  <button
                    onClick={goToCheckout}
                    className="w-full bg-off-white text-black font-terminal text-sm tracking-widest uppercase py-4 hover:bg-brand-red hover:text-off-white press"
                  >
                    TRAMITAR PEDIDO
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
