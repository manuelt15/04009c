"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function IconSun() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/>
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
    </svg>
  );
}

export default function StoreHeader() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <header className="sticky top-0 z-50 bg-[var(--theme-bg)] border-b border-border flex items-center justify-between px-6 py-3 transition-colors duration-300">
      <button
        onClick={() => router.push("/about")}
        className="flex items-center gap-3 bg-transparent border-none cursor-pointer group"
      >
        <Image src="/caballo_blanco.png" alt="04009c" width={28} height={28} className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
        <span className="font-brand text-xl text-off-white tracking-widest">04009c</span>
      </button>

      <div className="flex items-center gap-5">
        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className="text-off-white/50 hover:text-amber transition-colors"
            title={theme === "dark" ? "Modo azul" : "Modo negro"}
          >
            {theme === "dark" ? <IconSun /> : <IconMoon />}
          </button>
        )}

        <a
          href="https://www.instagram.com/04009c/"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-50 hover:opacity-100 transition-opacity"
        >
          <Image src="/instagram_white.png" alt="Instagram" width={16} height={16} />
        </a>

        <button
          onClick={handleLogout}
          className="font-terminal text-[10px] text-dim hover:text-brand-red tracking-widest uppercase transition-colors"
        >
          SALIR
        </button>
      </div>
    </header>
  );
}
