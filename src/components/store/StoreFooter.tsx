"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const HEADING = "font-terminal text-[0.65rem] tracking-[0.12em] uppercase text-brand-red";
const LINK = "font-terminal text-[11px] text-dim hover:text-off-white tracking-widest uppercase transition-colors text-left";
// Páginas que toda tienda necesita pero que aún no existen: se muestran sin enlace hasta tener contenido
const PENDING = "font-terminal text-[11px] text-dim tracking-widest uppercase cursor-default";

const HELP = ["ENVÍOS Y DEVOLUCIONES", "GUÍA DE TALLAS", "PREGUNTAS FRECUENTES"];
const LEGAL = ["AVISO LEGAL", "POLÍTICA DE PRIVACIDAD", "POLÍTICA DE COOKIES", "CONDICIONES DE COMPRA"];

export default function StoreFooter() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <footer className="border-t border-border px-6 pt-12 pb-6 transition-colors duration-300">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Marca */}
        <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Image src="/caballo_blanco_recortado.png" alt="" width={30} height={20} className="object-contain opacity-80" />
            <span className="font-brand text-lg text-off-white tracking-widest">04009c</span>
          </div>
          <p className="font-body text-sm text-dim leading-relaxed max-w-xs">
            Acceso exclusivo a diseñadores de todo el mundo: moda, arte y más allá.
          </p>
        </div>

        {/* Ayuda */}
        <div className="flex flex-col gap-3">
          <span className={HEADING}>AYUDA</span>
          {HELP.map((item) => (
            <span key={item} className={PENDING} title="Próximamente">{item}</span>
          ))}
          <a href="mailto:04009c@gmail.com" className={LINK}>CONTACTO</a>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3">
          <span className={HEADING}>LEGAL</span>
          {LEGAL.map((item) => (
            <span key={item} className={PENDING} title="Próximamente">{item}</span>
          ))}
        </div>

        {/* Comunidad */}
        <div className="flex flex-col gap-3">
          <span className={HEADING}>SÍGUENOS</span>
          <a
            href="https://www.instagram.com/04009c/"
            target="_blank"
            aria-label="Instagram (abre en una pestaña nueva)"
            title="Instagram (abre en una pestaña nueva)"
            rel="noopener noreferrer"
            className={`${LINK} flex items-center gap-2`}
          >
            <Image src="/instagram_white.png" alt="" width={14} height={14} className="opacity-60" />
            INSTAGRAM
          </a>
          <button onClick={() => router.push("/about")} className={LINK}>SOBRE NOSOTROS</button>
          <button onClick={() => router.push("/subscribe")} className={LINK}>SOLICITAR ACCESO</button>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-border flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="font-terminal text-[10px] text-dim tracking-wider uppercase">
          © {new Date().getFullYear()} <span className="normal-case">04009c</span>. Todos los derechos reservados.
        </span>
        <button
          onClick={handleLogout}
          className="font-terminal text-[10px] text-dim hover:text-brand-red tracking-widest uppercase transition-colors"
        >
          CERRAR SESIÓN
        </button>
      </div>
    </footer>
  );
}
