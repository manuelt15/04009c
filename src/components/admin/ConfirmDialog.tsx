"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  title: string;
  detail?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Sustituye a window.confirm() con el estilo del panel
export default function ConfirmDialog({ open, title, detail, confirmLabel = "ELIMINAR", onConfirm, onCancel }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
          <motion.div
            className="absolute inset-0 bg-black/70"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="relative w-full max-w-sm bg-[var(--theme-bg)] border border-brand-red p-6 flex flex-col gap-4"
            initial={{ opacity: 0, transform: "scale(0.96)" }}
            animate={{ opacity: 1, transform: "scale(1)" }}
            exit={{ opacity: 0, transform: "scale(0.98)", transition: { duration: 0.15 } }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <span id="confirm-title" className="font-terminal text-[11px] text-brand-red tracking-widest uppercase">
              {title}
            </span>
            {detail && <p className="font-terminal text-xs text-off-white">{detail}</p>}
            <div className="flex gap-3 mt-2">
              <button
                onClick={onConfirm}
                autoFocus
                className="font-terminal text-[11px] tracking-widest uppercase px-4 py-2 bg-brand-red text-off-white hover:bg-off-white hover:text-black press"
              >
                {confirmLabel}
              </button>
              <button
                onClick={onCancel}
                className="font-terminal text-[11px] tracking-widest uppercase px-4 py-2 border border-border text-dim hover:text-off-white press"
              >
                CANCELAR
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
