"use client";

import AdminCategories from "./AdminCategories";
import AdminStoreSettings from "./AdminStoreSettings";

// Vista de prueba: aquí ya no se cambia ni la clave de acceso ni las
// credenciales del panel. Volverán con better-auth.
export default function AdminSettings() {
  return (
    <div className="p-4 md:p-6 pt-16 md:pt-6 flex flex-col gap-6">
      <div>
        <span className="data-label">{"// CONFIGURACIÓN"}</span>
        <h1 className="font-display text-2xl md:text-3xl text-off-white tracking-wider">AJUSTES</h1>
      </div>

      <AdminCategories />
      <AdminStoreSettings />

      <div className="bg-surface border border-border p-5 flex flex-col gap-3">
        <span className="data-label">{"// ACCESO Y CREDENCIALES"}</span>
        <p className="font-terminal text-[11px] text-dim leading-relaxed">
          En esta maqueta el panel se abre sin contraseña y no se puede cambiar ningún ajuste.
          La clave de acceso y las credenciales del panel vuelven con la autenticación (better-auth).
        </p>
      </div>
    </div>
  );
}
