export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Franja de maqueta: misma que la del panel, en todas las páginas de la tienda */}
      <div
        role="note"
        className="w-full bg-brand-red text-black font-terminal text-[10px] tracking-[0.12em] uppercase px-4 py-2 text-center"
      >
        Maqueta — productos y precios de ejemplo, no son reales
      </div>
      {children}
    </>
  );
}
