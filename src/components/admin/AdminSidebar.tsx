"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

const NAV = [
  { href: "/admin",             label: "RESUMEN",      icon: "▣" },
  { href: "/admin/products",    label: "PRODUCTOS",    icon: "◈" },
  { href: "/admin/orders",      label: "PEDIDOS",      icon: "◎" },
  { href: "/admin/subscribers", label: "SUSCRIPTORES", icon: "◉" },
  { href: "/admin/settings",    label: "ACCESO",       icon: "◆" },
];

function IconSun() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/>
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
    </svg>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  async function handleLogout() {
    await fetch("/api/auth/admin-logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="w-56 min-h-screen bg-[var(--theme-bg)] border-r border-border flex flex-col shrink-0 transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
        <Image src="/caballo_blanco.png" alt="04009c" width={22} height={22} className="object-contain opacity-80" />
        <div className="flex flex-col">
          <span className="font-brand text-sm text-off-white tracking-widest leading-none">04009c</span>
          <span className="font-terminal text-[9px] text-amber/60 tracking-wider mt-0.5">ADMIN</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        <ul className="flex flex-col">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-5 py-3 font-terminal text-[11px] tracking-widest transition-colors relative
                    ${active ? "text-off-white" : "text-dim hover:text-off-white"}`}
                >
                  {active && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-amber" />}
                  <span className={active ? "text-amber" : "text-dim"}>{icon}</span>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer — tema + logout */}
      <div className="px-5 py-4 border-t border-border flex flex-col gap-3">
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-2 font-terminal text-[10px] text-dim hover:text-amber tracking-widest uppercase transition-colors w-full text-left"
          >
            <span className="text-amber">{theme === "dark" ? <IconSun /> : <IconMoon />}</span>
            {theme === "dark" ? "MODO AZUL" : "MODO NEGRO"}
          </button>
        )}
        <button
          onClick={handleLogout}
          className="font-terminal text-[10px] text-dim hover:text-brand-red tracking-widest uppercase transition-colors w-full text-left"
        >
          ← CERRAR SESIÓN
        </button>
      </div>
    </aside>
  );
}
