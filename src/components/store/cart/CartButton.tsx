"use client";

import { useCallback, useState } from "react";
import { useCart, cartCount } from "@/lib/cart-store";
import CartDrawer from "./CartDrawer";

export default function CartButton() {
  const items = useCart();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const count = cartCount(items);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={count > 0 ? `Abrir carrito, ${count} artículos` : "Abrir carrito"}
        className="relative text-off-white/70 hover:text-brand-red press p-1"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1.5 min-w-4 h-4 px-1 bg-brand-red text-off-white font-terminal text-[9px] leading-4 text-center">
            {count}
          </span>
        )}
      </button>
      <CartDrawer open={open} onClose={close} />
    </>
  );
}
