"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}

export default function AdminSelect({ value, options, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger */}
      <button
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 bg-[var(--theme-bg)] border border-border hover:border-brand-red text-off-white font-terminal text-[10px] tracking-widest uppercase px-3 py-1.5 press min-w-[130px] justify-between"
      >
        <span>{selected?.label ?? value.toUpperCase()}</span>
        <span className={`text-brand-red transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
      {open && (
        <motion.div
          role="listbox"
          className="absolute top-full left-0 mt-0.5 z-50 bg-[var(--theme-bg)] border border-brand-red min-w-full origin-top"
          initial={{ opacity: 0, transform: "scaleY(0.96) translateY(-4px)" }}
          animate={{ opacity: 1, transform: "scaleY(1) translateY(0px)" }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left flex items-center gap-2 px-3 py-2 font-terminal text-[10px] tracking-widest uppercase transition-colors
                ${opt.value === value
                  ? "text-brand-red bg-brand-red/5"
                  : "text-dim hover:text-off-white hover:bg-off-white/5"
                }`}
            >
              <span className="w-3">{opt.value === value ? "✓" : ""}</span>
              {opt.label}
            </button>
          ))}
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
