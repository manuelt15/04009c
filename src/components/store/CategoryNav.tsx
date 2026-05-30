"use client";

const CATEGORIES = ["ALL", "NUEVOS", "HOODIES", "CAMISETAS", "TOPS", "PANTALONES", "ACCESORIOS", "CHAQUETAS"];

interface Props {
  active: string;
  onChange: (cat: string) => void;
}

export default function CategoryNav({ active, onChange }: Props) {
  return (
    <nav className="sticky top-[53px] z-40 border-b border-border overflow-x-auto transition-colors duration-300" style={{ backgroundColor: "var(--theme-bg)" }}>
      <ul className="flex items-center px-6 gap-0 min-w-max">
        {CATEGORIES.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => onChange(cat)}
              className={`font-terminal text-[11px] tracking-widest uppercase px-4 py-3 transition-colors relative
                ${active === cat
                  ? "text-off-white"
                  : "text-dim hover:text-off-white"
                }`}
            >
              {cat}
              {active === cat && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
