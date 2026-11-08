"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/components/shared/Toaster";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast("INTRODUCE USUARIO Y CONTRASEÑA", "error");
      return;
    }
    setLoading(true);

    const res = await fetch("/api/auth/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast(data.error ?? "CREDENCIALES INVÁLIDAS", "error");
      setLoading(false);
    } else {
      toast("SESIÓN INICIADA", "success");
      router.push("/admin");
    }
  }

  // Vuelve a la página desde la que se entró (?from=/store...). Solo rutas internas
  function handleBack() {
    const from = new URLSearchParams(window.location.search).get("from");
    router.push(from && from.startsWith("/") && !from.startsWith("//") ? from : "/");
  }

  return (
    <main className="min-h-dvh bg-[var(--theme-bg)] flex flex-col items-center justify-center px-8 grain">
      <h1 className="sr-only">Acceso de administrador</h1>

      <div className="w-full max-w-xs flex flex-col items-center gap-6">
        <Image src="/caballo_blanco.png" alt="04009c" width={40} height={40} className="object-contain opacity-60" />
        <div className="text-center">
          <span className="font-brand text-2xl text-off-white tracking-widest">04009c</span>
          <p className="font-terminal text-[10px] text-brand-red tracking-widest mt-1">{"// PANEL DE ADMINISTRACIÓN"}</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          {/* Nombre accesible vía aria-label: el placeholder "USUARIO" NO cuenta
              como nombre accesible (WCAG 4.1.2 / 2.4.6). */}
          <input
            type="text"
            id="admin-username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="USUARIO"
            aria-label="Usuario"
            autoComplete="username"
            disabled={loading}
            className="w-full bg-surface border border-border text-off-white font-terminal text-sm px-4 py-3 placeholder:text-dim/50 focus:border-brand-red transition-colors"
          />
          <input
            type="password"
            id="admin-password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="CONTRASEÑA"
            aria-label="Contraseña"
            autoComplete="current-password"
            disabled={loading}
            className="w-full bg-surface border border-border text-off-white font-terminal text-sm px-4 py-3 placeholder:text-dim/50 focus:border-brand-red transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-off-white text-black font-terminal text-sm tracking-widest uppercase py-3 hover:bg-brand-red hover:text-off-white press disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "VERIFICANDO..." : "ENTRAR"}
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="self-center font-terminal text-[11px] text-dim hover:text-off-white tracking-widest uppercase transition-colors py-3"
          >
            ← VOLVER
          </button>
        </form>
      </div>
    </main>
  );
}
