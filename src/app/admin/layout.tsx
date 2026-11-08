import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh" style={{ backgroundColor: "var(--theme-bg)" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto min-w-0">
        {/* Banner de vista de prueba: fijo en todas las pantallas del panel */}
        <div
          role="note"
          className="sticky top-0 z-40 w-full bg-brand-red text-black font-terminal text-[10px] tracking-[0.12em] uppercase px-4 py-2 text-center"
        >
          Vista de prueba — datos de ejemplo, no se puede modificar nada
        </div>
        {children}
      </main>
    </div>
  );
}
