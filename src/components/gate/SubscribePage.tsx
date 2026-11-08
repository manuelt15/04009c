"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useToast } from "@/components/shared/Toaster";

const FIELDS: { key: "name" | "email" | "mobile" | "city"; label: string; type: string; placeholder: string; required: boolean }[] = [
  { key: "name",   label: "NOMBRE",   type: "text",  placeholder: "Tu nombre", required: true  },
  { key: "email",  label: "EMAIL",    type: "email", placeholder: "tu@email.com", required: true  },
  { key: "mobile", label: "MÓVIL",    type: "tel",   placeholder: "+34 600 000 000", required: false },
  { key: "city",   label: "CIUDAD",   type: "text",  placeholder: "Madrid", required: false },
];

export default function SubscribePage() {
  const router = useRouter();
  const [form, setForm]       = useState({ name: "", email: "", mobile: "", city: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const toast = useToast();

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

    const nextErrors: Partial<Record<keyof typeof form, string>> = {};
    for (const f of FIELDS) {
      if (f.required && !form[f.key].trim()) nextErrors[f.key] = `${f.label}: CAMPO OBLIGATORIO`;
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "EL EMAIL NO ES VÁLIDO";
    }
    setErrors(nextErrors);
    const firstInvalid = FIELDS.find((f) => nextErrors[f.key]);
    if (firstInvalid) {
      toast("REVISA LOS CAMPOS MARCADOS", "error");
      requestAnimationFrame(() => document.getElementById(`subscribe-${firstInvalid.key}`)?.focus());
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        toast(data.error ?? "ERROR DESCONOCIDO", "error");
      } else {
        toast("SOLICITUD ENVIADA", "success");
        setSuccess(true);
      }
    } catch {
      toast("CONEXIÓN FALLIDA", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-dvh bg-[var(--theme-bg)] flex flex-col items-center justify-between overflow-hidden grain">
      <h1 className="sr-only">Solicitud de acceso</h1>


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
          <span className="font-terminal text-[0.65rem] tracking-[0.12em] uppercase text-brand-red">{"// SOLICITUD DE ACCESO"}</span>
        </motion.div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              tabIndex={-1}
              role="status"
              aria-live="polite"
              aria-label="Solicitud enviada. Tu solicitud ha sido recibida. Te contactaremos cuando tu acceso esté listo."
              ref={(node) => { node?.focus(); }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col items-center gap-4 text-center"
            >
              <div className="border border-brand-red px-6 py-5 flex flex-col gap-2">
                <span className="font-terminal text-[11px] text-brand-red tracking-widest">{"// REGISTRO COMPLETADO"}</span>
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
              noValidate
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col gap-3"
            >
              {FIELDS.map(({ key, label, type, placeholder, required }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label htmlFor={`subscribe-${key}`} className="font-terminal text-[0.65rem] tracking-[0.12em] uppercase text-brand-red">{label}{required ? " *" : ""}</label>
                  <input
                    id={`subscribe-${key}`}
                    required={required}
                    aria-invalid={Boolean(errors[key])}
                    aria-describedby={errors[key] ? `subscribe-${key}-error` : undefined}
                    type={type}
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    disabled={loading}
                    className="w-full bg-transparent border border-off-white/30 text-off-white font-terminal text-sm px-4 py-2.5 placeholder:text-off-white/25 focus:outline-none focus:border-brand-red transition-colors disabled:opacity-50"
                  />
                  {errors[key] && <span id={`subscribe-${key}-error`} className="font-terminal text-xs text-off-white">{errors[key]}</span>}
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-off-white text-brand-blue font-terminal text-sm tracking-widest uppercase py-3 hover:bg-brand-red hover:text-off-white press disabled:opacity-40 disabled:cursor-not-allowed mt-1"
              >
                {loading ? "ENVIANDO..." : "SOLICITAR ACCESO"}
              </button>


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
          aria-label="Instagram (abre en una pestaña nueva)"
          title="Instagram (abre en una pestaña nueva)"
          rel="noopener noreferrer"
          className="opacity-40 hover:opacity-100 transition-opacity"
        >
          <Image src="/instagram_white.png" alt="Instagram" width={16} height={16} />
        </a>
      </footer>
    </main>
  );
}
