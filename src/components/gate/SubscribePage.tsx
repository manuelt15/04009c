"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const FIELDS = [
  { key: "name",   label: "NOMBRE",   type: "text",  placeholder: "Tu nombre", required: true  },
  { key: "email",  label: "EMAIL",    type: "email", placeholder: "tu@email.com", required: true  },
  { key: "mobile", label: "MÓVIL",    type: "tel",   placeholder: "+34 600 000 000", required: false },
  { key: "city",   label: "CIUDAD",   type: "text",  placeholder: "Madrid", required: false },
];

export default function SubscribePage() {
  const router = useRouter();
  const [form, setForm]       = useState({ name: "", email: "", mobile: "", city: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  function handleBack() {
    const navigate = () => router.back();
    if (typeof document !== "undefined" && document.startViewTransition) {
      document.startViewTransition(navigate);
    } else {
      navigate();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "// ERROR DESCONOCIDO");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("// ERROR: CONEXIÓN FALLIDA");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-brand-blue flex flex-col items-center justify-between overflow-hidden grain">

      {/* Decoraciones de esquina */}
      <div className="absolute top-4 left-4 font-terminal text-[10px] text-amber/60 leading-relaxed pointer-events-none">
        <p>// REGISTRO</p>
        <p>FILE: SUBSCRIBER</p>
        <p>STATUS: OPEN</p>
      </div>
      <div className="absolute top-4 right-4 font-terminal text-[10px] text-amber/60 text-right leading-relaxed pointer-events-none">
        <p>FORM: SUB-001</p>
        <p>ACCESS: PUBLIC</p>
        <p>REF: 04009c-003</p>
      </div>

      {/* Contenido central */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 py-16 w-full max-w-sm">

        <motion.button
          onClick={() => router.push("/about")}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-transparent border-none cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
        >
          <Image src="/caballo_blanco.png" alt="04009c" width={44} height={44} className="object-contain" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center flex flex-col gap-1"
        >
          <span className="font-brand text-3xl text-off-white tracking-widest">04009c</span>
          <span className="data-label">// SOLICITUD DE ACCESO</span>
        </motion.div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col items-center gap-4 text-center"
            >
              <div className="scan-border px-6 py-5 flex flex-col gap-2">
                <span className="font-terminal text-[11px] text-amber tracking-widest">// REGISTRO COMPLETADO</span>
                <p className="font-body text-sm text-off-white/80 leading-relaxed mt-1">
                  Tu solicitud ha sido recibida. Te contactaremos cuando tu acceso esté listo.
                </p>
              </div>
              <button
                onClick={handleBack}
                className="font-terminal text-[11px] text-off-white/50 hover:text-off-white tracking-widest uppercase transition-colors underline underline-offset-4"
              >
                ← VOLVER
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col gap-3"
            >
              {FIELDS.map(({ key, label, type, placeholder, required }) => (
                <div key={key} className="flex flex-col gap-1">
                  <span className="data-label">{label}{required ? " *" : ""}</span>
                  <input
                    type={type}
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    required={required}
                    disabled={loading}
                    className="w-full bg-transparent border border-off-white/30 text-off-white font-terminal text-sm px-4 py-2.5 placeholder:text-off-white/25 focus:outline-none focus:border-amber transition-colors disabled:opacity-50"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading || !form.name || !form.email}
                className="w-full bg-off-white text-brand-blue font-terminal text-sm tracking-widest uppercase py-3 hover:bg-amber transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed mt-1"
              >
                {loading ? "ENVIANDO..." : "SOLICITAR ACCESO"}
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

              <button
                type="button"
                onClick={handleBack}
                className="font-terminal text-[10px] text-off-white/30 hover:text-off-white/70 tracking-widest uppercase transition-colors text-center mt-1"
              >
                ← VOLVER
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="w-full flex items-center justify-between px-6 py-4 border-t border-off-white/10">
        <span className="font-terminal text-[10px] text-off-white/30 uppercase tracking-wider">
          House of Access
        </span>
        <a
          href="https://www.instagram.com/04009c/"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-40 hover:opacity-100 transition-opacity"
        >
          <Image src="/instagram_white.png" alt="Instagram" width={16} height={16} />
        </a>
      </footer>
    </main>
  );
}
