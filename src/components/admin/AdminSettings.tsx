"use client";

import { useState } from "react";

export default function AdminSettings() {
  const [gatePassword, setGatePassword] = useState("");
  const [currentPass, setCurrentPass]   = useState("");
  const [newUsername, setNewUsername]   = useState("");
  const [newPassword, setNewPassword]   = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  async function handleGatePassword(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "gate_password", value: gatePassword }),
    });
    setMsg(r.ok ? { text: "// CONTRASEÑA DE ACCESO ACTUALIZADA", ok: true } : { text: "// ERROR", ok: false });
    setGatePassword("");
  }

  async function handleAdminCredentials(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "admin_credentials", currentPassword: currentPass, newUsername, newPassword }),
    });
    const d = await r.json();
    setMsg(r.ok ? { text: "// CREDENCIALES ACTUALIZADAS", ok: true } : { text: d.error, ok: false });
    setCurrentPass(""); setNewUsername(""); setNewPassword("");
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <span className="data-label">// CONFIGURACIÓN</span>
        <h1 className="font-display text-3xl text-off-white tracking-wider">ACCESO</h1>
      </div>

      {msg && (
        <div className={`border px-4 py-3 font-terminal text-[11px] tracking-wider ${msg.ok ? "border-amber text-amber" : "border-brand-red text-brand-red"}`}>
          {msg.text}
        </div>
      )}

      {/* Cambiar clave del gate */}
      <div className="bg-surface border border-border p-5 flex flex-col gap-4">
        <span className="data-label">// CONTRASEÑA DEL GATE</span>
        <p className="font-terminal text-[11px] text-dim">La clave que los miembros introducen para acceder a la tienda.</p>
        <form onSubmit={handleGatePassword} className="flex gap-3">
          <input type="text" value={gatePassword} onChange={(e) => setGatePassword(e.target.value)}
            placeholder="NUEVA CONTRASEÑA"
            className="flex-1 bg-black border border-border text-off-white font-terminal text-sm px-4 py-2 focus:outline-none focus:border-amber transition-colors placeholder:text-dim/50" />
          <button type="submit" disabled={!gatePassword}
            className="font-terminal text-[11px] tracking-widest uppercase px-5 py-2 bg-amber text-black hover:bg-off-white transition-colors disabled:opacity-40">
            GUARDAR
          </button>
        </form>
      </div>

      {/* Cambiar credenciales admin */}
      <div className="bg-surface border border-border p-5 flex flex-col gap-4">
        <span className="data-label">// CREDENCIALES DE ADMIN</span>
        <p className="font-terminal text-[11px] text-dim">Cambia tu usuario y contraseña de acceso al panel.</p>
        <form onSubmit={handleAdminCredentials} className="flex flex-col gap-3">
          <input type="password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)}
            placeholder="CONTRASEÑA ACTUAL"
            className="bg-black border border-border text-off-white font-terminal text-sm px-4 py-2 focus:outline-none focus:border-amber transition-colors placeholder:text-dim/50" />
          <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)}
            placeholder="NUEVO USUARIO"
            className="bg-black border border-border text-off-white font-terminal text-sm px-4 py-2 focus:outline-none focus:border-amber transition-colors placeholder:text-dim/50" />
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            placeholder="NUEVA CONTRASEÑA"
            className="bg-black border border-border text-off-white font-terminal text-sm px-4 py-2 focus:outline-none focus:border-amber transition-colors placeholder:text-dim/50" />
          <button type="submit" disabled={!currentPass || !newUsername || !newPassword}
            className="self-start font-terminal text-[11px] tracking-widest uppercase px-5 py-2 bg-off-white text-black hover:bg-amber transition-colors disabled:opacity-40">
            ACTUALIZAR
          </button>
        </form>
      </div>
    </div>
  );
}
