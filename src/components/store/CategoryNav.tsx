"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// TODO y NUEVOS son automáticas; el resto se gestiona en el panel → AJUSTES
const FIXED = ["TODO", "NUEVOS"];

interface Props {
  active: string;
  onChange: (cat: string) => void;
}

export default function CategoryNav({ active, onChange }: Props) {
  const [categories, setCategories] = useState<string[]>(FIXED);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d: { categories?: { name: string }[] }) => setCategories([...FIXED, ...(d.categories ?? []).map((c) => c.name)]))
      .catch(() => {});
  }, []);

  return (
    <nav className="sticky top-[53px] z-40 border-b border-border overflow-x-auto transition-colors duration-300" style={{ backgroundColor: "var(--theme-bg)" }}>
      <ul className="flex items-center px-6 gap-0 min-w-max">
        {categories.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => onChange(cat)}
              aria-pressed={active === cat}
              className={`font-terminal text-[11px] tracking-widest uppercase px-4 py-3 transition-colors relative
                ${active === cat
                  ? "text-off-white"
                  : "text-dim hover:text-off-white"
                }`}
            >
              {cat}
              {active === cat && (
                <motion.span
                  layoutId="category-underline"
                  transition={{ duration: 0.2, ease: [0.77, 0, 0.175, 1] }}
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-red"
                />
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
