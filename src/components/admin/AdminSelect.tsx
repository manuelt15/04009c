"use client";

interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  label?: string;
}

export default function AdminSelect({ value, options, onChange, label = "Seleccionar opción" }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="bg-[var(--theme-bg)] border border-border hover:border-brand-red text-off-white font-terminal text-[10px] tracking-widest uppercase px-3 py-1.5 press min-w-[130px]"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
