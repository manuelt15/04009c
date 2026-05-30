"use client";

import { useState, useRef, useEffect } from "react";

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
        className="flex items-center gap-2 bg-black border border-border hover:border-amber text-off-white font-terminal text-[10px] tracking-widest uppercase px-3 py-1.5 transition-colors min-w-[130px] justify-between"
      >
        <span>{selected?.label ?? value.toUpperCase()}</span>
        <span className={`text-amber transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-0.5 z-50 bg-black border border-amber min-w-full shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left flex items-center gap-2 px-3 py-2 font-terminal text-[10px] tracking-widest uppercase transition-colors
                ${opt.value === value
                  ? "text-amber bg-amber/5"
                  : "text-dim hover:text-off-white hover:bg-white/5"
                }`}
            >
              <span className="w-3">{opt.value === value ? "✓" : ""}</span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
