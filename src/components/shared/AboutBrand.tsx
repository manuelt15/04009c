"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AboutBrand() {
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

      {/* Contenido central */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8 py-16 w-full max-w-2xl text-center">

        {/* Logo */}
        <Image
          src="/caballo_blanco.png"
          alt="04009c"
          width={50}
          height={50}
          className="object-contain opacity-80"
        />

        {/* Título */}
        <div className="flex flex-col gap-1">
          <h1 className="font-brand text-5xl sm:text-6xl text-brand-red tracking-widest uppercase leading-tight">
            04009c
          </h1>
          <p className="font-terminal text-[11px] text-off-white/80 tracking-[0.3em] uppercase">
            The House of Access
          </p>
        </div>

        {/* Separador estilo terminal */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <span className="flex-1 h-px bg-off-white/20" />
          <span className="font-terminal text-[9px] text-off-white/50 tracking-widest">{"// MANIFESTO"}</span>
          <span className="flex-1 h-px bg-off-white/20" />
        </div>

        {/* Descripción */}
        <p className="font-body text-base sm:text-lg text-off-white/90 leading-relaxed max-w-xl">
          Nuestra misión es encontrar y ofrecer exclusividad a través de diseñadores de todo el mundo,
          uniendo nombres consagrados con talento emergente dentro de un universo cuidado al detalle.
        </p>
        <p className="font-body text-base sm:text-lg text-off-white/90 leading-relaxed max-w-xl">
          Marcas, mentes e ideas distintas conviven bajo un lenguaje común que mezcla el arte en
          todas sus formas: moda, joyería, bellas artes, escultura y más allá.
        </p>
        <p className="font-body text-base sm:text-lg text-off-white/90 leading-relaxed max-w-xl">
          Una propuesta experimental, disruptiva y oscura, construida abiertamente a través de
          colaboraciones que amplían este relato y lo llevan más adentro del mundo de{" "}
          <span className="font-brand text-brand-red">04009c</span>.
        </p>

        {/* Botón volver */}
        <button
          onClick={handleBack}
          className="font-terminal text-[11px] text-off-white/50 hover:text-brand-red tracking-widest uppercase transition-colors mt-4 underline underline-offset-4"
        >
          ← VOLVER
        </button>
      </div>

      {/* Footer */}
      <footer className="w-full flex items-center justify-center px-6 py-4 border-t border-off-white/10">
        <span className="font-terminal text-[10px] text-off-white/30 uppercase tracking-wider">
          House of Access — 04009c
        </span>
      </footer>
    </main>
  );
}
