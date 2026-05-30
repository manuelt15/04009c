"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "// ERROR: CREDENCIALES INVÁLIDAS");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-8 grain">
      <div className="absolute top-4 left-4 font-terminal text-[10px] text-amber/40 leading-relaxed">
        <p>// ADMIN ACCESS</p>
        <p>RESTRICTED ZONE</p>
      </div>

      <div className="w-full max-w-xs flex flex-col items-center gap-6">
        <Image src="/caballo_blanco.png" alt="04009c" width={40} height={40} className="object-contain opacity-60" />
        <div className="text-center">
          <span className="font-brand text-2xl text-off-white tracking-widest">04009c</span>
          <p className="font-terminal text-[10px] text-amber/60 tracking-widest mt-1">// ADMIN PANEL</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="USUARIO"
            disabled={loading}
            className="w-full bg-surface border border-border text-off-white font-terminal text-sm px-4 py-3 placeholder:text-dim/50 focus:outline-none focus:border-amber transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="CONTRASEÑA"
            disabled={loading}
            className="w-full bg-surface border border-border text-off-white font-terminal text-sm px-4 py-3 placeholder:text-dim/50 focus:outline-none focus:border-amber transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full bg-off-white text-black font-terminal text-sm tracking-widest uppercase py-3 hover:bg-amber transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "VERIFICANDO..." : "ENTRAR"}
          </button>

          {error && (
            <p className="font-terminal text-[11px] text-brand-red text-center tracking-wider">{error}</p>
          )}
        </form>
      </div>
    </main>
  );
}
