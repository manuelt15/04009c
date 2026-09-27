"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function StripeNotice({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
          <motion.div
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="stripe-notice-title"
            className="relative w-full max-w-md bg-[var(--theme-bg)] border border-border px-8 py-10 flex flex-col items-center gap-6 text-center"
            initial={{ opacity: 0, transform: "scale(0.96)" }}
            animate={{ opacity: 1, transform: "scale(1)" }}
            exit={{ opacity: 0, transform: "scale(0.98)", transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] } }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="font-terminal text-[0.65rem] tracking-[0.12em] uppercase text-brand-red">
              {"// PAGO PENDIENTE DE ACTIVAR"}
            </span>

            <div className="flex items-center gap-3">
              <span className="font-terminal text-[10px] text-dim tracking-widest uppercase">PAGOS CON</span>
              <Image src="/stripe-wordmark-white.svg" alt="Stripe" width={86} height={36} />
            </div>

            <h2 id="stripe-notice-title" className="font-display text-3xl text-off-white tracking-wider uppercase leading-tight">
              Muy pronto podrás pagar aquí
            </h2>

            <p className="font-body text-sm text-dim leading-relaxed">
              El pago con tarjeta funcionará en cuanto conectemos Stripe. Tu carrito queda guardado en este
              navegador, así que no perderás nada.
            </p>

            <button
              onClick={onClose}
              autoFocus
              className="w-full bg-off-white text-black font-terminal text-sm tracking-widest uppercase py-3 hover:bg-brand-red hover:text-off-white press"
            >
              ENTENDIDO
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
