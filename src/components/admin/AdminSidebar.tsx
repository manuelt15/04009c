"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";

// Iconos de trazo (24x24) para la navegación del panel
const ICONS: Record<string, string> = {
  resumen:      "M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z",
  productos:    "M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01",
  pedidos:      "M6 2h12v20l-3-2-3 2-3-2-3 2zM9 7h6M9 11h6M9 15h4",
  suscriptores: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  ajustes:      "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
  salir:        "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  menu:         "M3 6h18M3 12h18M3 18h18",
  cerrar:       "M18 6 6 18M6 6l12 12",
};

function Icon({ name, size = 16 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

const NAV = [
  { href: "/admin",             label: "RESUMEN",      icon: "resumen" },
  { href: "/admin/products",    label: "PRODUCTOS",    icon: "productos" },
  { href: "/admin/orders",      label: "PEDIDOS",      icon: "pedidos" },
  { href: "/admin/subscribers", label: "SUSCRIPTORES", icon: "suscriptores" },
  { href: "/admin/settings",    label: "AJUSTES",      icon: "ajustes" },
];

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <Image src="/caballo_blanco_recortado.png" alt="" width={34} height={23} className="object-contain opacity-90 shrink-0" />
      <div className="flex flex-col gap-1">
        <span className="font-brand text-base text-off-white tracking-widest leading-none">04009c</span>
        <span className="font-terminal text-[9px] text-brand-red tracking-[0.2em] leading-none">PANEL ADMIN</span>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // El login vive dentro del layout del panel, pero sin sesión no tiene sentido mostrar el menú
  if (pathname === "/admin/login") return null;

  async function handleLogout() {
    await fetch("/api/auth/admin-logout", { method: "POST" });
    router.push("/admin/login");
  }

  const nav = (
    <nav className="flex-1 py-4 overflow-y-auto" aria-label="Panel">
      <ul className="flex flex-col">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-3 h-11 px-5 font-terminal text-[11px] tracking-widest transition-colors
                  ${active ? "text-off-white bg-off-white/[0.04]" : "text-dim hover:text-off-white"}`}
              >
                {active && (
                  <motion.span
                    layoutId="admin-nav-indicator"
                    transition={{ duration: 0.2, ease: [0.77, 0, 0.175, 1] }}
                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-red"
                  />
                )}
                <span className={active ? "text-brand-red" : ""}><Icon name={icon} /></span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const footer = (
    <div className="px-5 py-4 border-t border-border flex flex-col gap-4">
      <div className="self-start">
        <ThemeSwitcher />
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 font-terminal text-[10px] text-dim hover:text-brand-red tracking-widest uppercase press self-start"
      >
        <Icon name="salir" size={14} />
        CERRAR SESIÓN
      </button>
    </div>
  );

  return (
    <>
      {/* Escritorio: fija a la altura de la ventana, el contenido hace scroll al lado */}
      <aside className="hidden md:flex sticky top-0 h-dvh w-60 shrink-0 flex-col bg-[var(--theme-bg)] border-r border-border transition-colors duration-300">
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Brand />
        </div>
        {nav}
        {footer}
      </aside>

      {/* Móvil: barra superior fija + menú lateral */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 h-14 bg-[var(--theme-bg)] border-b border-border flex items-center justify-between px-4">
        <Brand />
        <button
          onClick={() => setOpen((p) => !p)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          className="p-2 -mr-2 text-off-white/80 hover:text-brand-red press"
        >
          <Icon name={open ? "cerrar" : "menu"} size={20} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <div className="md:hidden fixed inset-0 z-40">
            <motion.div
              className="absolute inset-0 bg-black/60"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2 }}
            />
            <motion.aside
              className="absolute top-14 bottom-0 left-0 w-64 flex flex-col bg-[var(--theme-bg)] border-r border-border pb-[env(safe-area-inset-bottom)]"
              initial={{ transform: "translateX(-100%)" }}
              animate={{ transform: "translateX(0%)" }}
              exit={{ transform: "translateX(-100%)", transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] } }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            >
              {nav}
              {footer}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Hueco para que el contenido no quede debajo de la barra móvil */}
      <div className="md:hidden h-14 w-0 shrink-0" />
    </>
  );
}
