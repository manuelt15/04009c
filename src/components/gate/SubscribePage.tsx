"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SubscribePage() {
  const router = useRouter();

  function handleBack() {
    const navigate = () => router.back();
    if (typeof document !== "undefined" && document.startViewTransition) {
      document.startViewTransition(navigate);
    } else {
      navigate();
    }
  }

  return (
    <main className="relative min-h-dvh bg-[var(--theme-bg)] flex flex-col items-center justify-between overflow-hidden grain">
      <h1 className="sr-only">Solicitud de acceso</h1>

      {/* Contenido central */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 py-16 w-full max-w-sm">

        <motion.button
          onClick={() => router.push("/about")}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-transparent border-none cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
        >
          <Image src="/caballo_blanco.png" alt="04009c" width={44} height={44} className="object-contain" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center flex flex-col gap-1"
        >
          <span className="font-brand text-3xl text-off-white tracking-widest">04009c</span>
          <span className="font-terminal text-[0.65rem] tracking-[0.12em] uppercase text-brand-red">{"// SOLICITUD DE ACCESO"}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          role="status"
          aria-live="polite"
          className="w-full flex flex-col items-center gap-5 text-center"
        >
          <div className="border border-brand-red px-6 py-5 flex flex-col gap-2 w-full">
            <span className="font-terminal text-[11px] text-brand-red tracking-widest">{"// PRÓXIMAMENTE"}</span>
            <p className="font-body text-sm text-off-white/80 leading-relaxed mt-1">
              Pronto tendrás más acceso. Estamos preparando la entrada y las solicitudes
              abrirán con la próxima temporada.
            </p>
            <p className="font-terminal text-[10px] text-off-white/40 tracking-wider mt-1">
              MIENTRAS TANTO, LA COLECCIÓN ESTÁ ABIERTA.
            </p>
          </div>

          <button
            onClick={handleBack}
            className="font-terminal text-[11px] text-off-white/50 hover:text-off-white tracking-widest uppercase transition-colors underline underline-offset-4"
          >
            ← VOLVER
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full flex items-center justify-between px-6 py-4 border-t border-off-white/10">
        <span className="font-terminal text-[10px] text-off-white/30 uppercase tracking-wider">
          House of Access
        </span>
        <a
          href="https://www.instagram.com/04009c/"
          target="_blank"
          aria-label="Instagram (abre en una pestaña nueva)"
          title="Instagram (abre en una pestaña nueva)"
          rel="noopener noreferrer"
          className="opacity-40 hover:opacity-100 transition-opacity"
        >
          <Image src="/instagram_white.png" alt="Instagram" width={16} height={16} />
        </a>
      </footer>
    </main>
  );
}
