"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function IconSpeaker() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
    </svg>
  );
}

function IconMuted() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>
  );
}

export default function PasswordGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [muted, setMuted] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (showInput) inputRef.current?.focus();
  }, [showInput]);

  function toggleMute() {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted((prev) => !prev);
  }

  function handleBrandClick() {
    if (!audioStarted && audioRef.current) {
      audioRef.current.play().then(() => setAudioStarted(true)).catch(() => {});
    }
    setShowInput(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "// ERROR: CÓDIGO INVÁLIDO");
        setPassword("");
        inputRef.current?.focus();
      } else {
        router.push("/store");
      }
    } catch {
      setError("// ERROR: CONEXIÓN FALLIDA");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-brand-blue flex flex-col items-center justify-between overflow-hidden grain">
      <audio ref={audioRef} src="/alien-static.mp3" loop preload="auto" />

      {/* Decoraciones de esquina — estilo terminal */}
      <div className="absolute top-4 left-4 font-terminal text-[10px] text-amber/60 leading-relaxed pointer-events-none">
        <p>// SYS.INIT</p>
        <p>FILE: ACCESS_GATE</p>
        <p>COORD: 40.4168° N 3.7038° W</p>
      </div>
      <div className="absolute top-4 right-4 font-terminal text-[10px] text-amber/60 text-right leading-relaxed pointer-events-none">
        <p>VERSION: 2.0</p>
        <p>STATUS: LOCKED</p>
        <p>REF: 04009c-001</p>
      </div>

      {/* Centro */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 w-full max-w-sm">

        {/* Logo caballo → lleva a /about */}
        <motion.button
          onClick={() => router.push("/about")}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-transparent border-none cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
        >
          <Image
            src="/caballo_blanco.png"
            alt="04009c"
            width={60}
            height={60}
            className="object-contain"
          />
        </motion.button>

        {/* Nombre de marca */}
        <motion.button
          onClick={handleBrandClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-brand text-5xl sm:text-6xl text-off-white tracking-widest uppercase cursor-pointer hover:text-amber transition-colors duration-200 bg-transparent border-none"
        >
          04009c
        </motion.button>

        {/* Formulario */}
        <AnimatePresence>
          {showInput && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col gap-3"
            >
              <span className="data-label text-center">// INTRODUCE EL CÓDIGO DE ACCESO</span>

              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="_ _ _ _ _ _"
                className="w-full bg-transparent border border-amber text-off-white font-terminal text-sm text-center tracking-[0.3em] px-4 py-3 placeholder:text-amber/40 focus:outline-none focus:border-off-white transition-colors disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={loading || !password.trim()}
                className="w-full bg-off-white text-brand-blue font-terminal text-sm tracking-widest uppercase py-3 hover:bg-amber transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "VERIFICANDO..." : "ACCEDER"}
              </button>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-terminal text-[11px] text-brand-red text-center tracking-wider"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="w-full flex items-center justify-between px-6 py-4 border-t border-off-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/subscribe")}
            className="font-terminal text-[10px] text-off-white/40 hover:text-off-white uppercase tracking-wider transition-colors"
          >
            SOLICITAR ACCESO
          </button>
          <button
            onClick={toggleMute}
            className="text-off-white/40 hover:text-off-white transition-colors"
            title={muted ? "Activar sonido" : "Silenciar"}
          >
            {muted ? <IconMuted /> : <IconSpeaker />}
          </button>
        </div>
        <a
          href="https://www.instagram.com/04009c/"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-50 hover:opacity-100 transition-opacity"
        >
          <Image src="/instagram_white.png" alt="Instagram" width={18} height={18} />
        </a>
      </footer>
    </main>
  );
}
