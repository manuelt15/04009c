"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { handleRadioKeys } from "@/lib/a11y/radio";

// "system" sigue al modo claro/oscuro del dispositivo: claro = azul de marca, oscuro = negro
const OPTIONS = [
  { value: "system", title: "Seguir al sistema", icon: "M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h6v2H8v2h8v-2h-2v-2h6c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H4V4h16v12z" },
  { value: "light",  title: "Modo azul",         icon: "M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z" },
  { value: "dark",   title: "Modo negro",        icon: "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" },
] as const;

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  // false en el servidor y en la hidratación, true en el cliente: el tema solo se conoce en el
  // cliente y sin esto el servidor pintaría una opción activa distinta
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) return null;

  return (
    <div className="flex items-center border border-border" role="radiogroup" aria-label="Tema" onKeyDown={handleRadioKeys}>
      {OPTIONS.map((opt) => {
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            tabIndex={active || (!theme && opt.value === "system") ? 0 : -1}
            title={opt.title}
            aria-label={opt.title}
            onClick={() => setTheme(opt.value)}
            className={`p-1.5 press ${
              active ? "bg-brand-red text-off-white" : "text-dim hover:text-off-white"
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={opt.icon} />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
