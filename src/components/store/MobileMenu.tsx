"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";

// Menú de móvil: se abre desde la derecha con los modos y el acceso al panel
export default function MobileMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function goToAdmin() {
    setOpen(false);
    router.push(`/admin/login?from=${encodeURIComponent(pathname)}`);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={open}
        className="text-off-white/70 hover:text-brand-red press p-1"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60]">
            <motion.div
              className="absolute inset-0 bg-black/60"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2 }}
            />
            <motion.nav
              aria-label="Menú"
              className="absolute top-0 right-0 h-full w-64 bg-[var(--theme-bg)] border-l border-border flex flex-col"
              initial={{ transform: "translateX(100%)" }}
              animate={{ transform: "translateX(0%)" }}
              exit={{ transform: "translateX(100%)", transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] } }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="flex justify-end px-6 py-4 border-b border-border">
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar menú"
                  className="text-dim hover:text-off-white transition-colors p-1"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-8 px-6 py-8">
                <div className="self-start">
                  <ThemeSwitcher />
                </div>
                <button
                  onClick={goToAdmin}
                  className="self-start font-terminal text-[11px] text-dim hover:text-brand-red tracking-widest uppercase transition-colors"
                >
                  ADMINISTRADOR
                </button>
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
