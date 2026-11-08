import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { NextResponse, type NextRequest } from "next/server";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const MAX_KEYS = 10_000;

// Memoria por proceso: no sustituye un límite compartido en despliegues distribuidos.
export function createLoginLimiter(limit = MAX_ATTEMPTS, windowMs = WINDOW_MS, maxKeys = MAX_KEYS) {
  const attempts = new Map<string, number[]>();
  return (realm: string, ip: string, identity: string, now = Date.now()): number => {
    for (const [key, times] of attempts) {
      const live = times.filter((time) => time > now - windowMs);
      if (live.length) attempts.set(key, live);
      else attempts.delete(key);
    }
    const digest = createHash("sha256").update(identity).digest("hex");
    // El límite por IP impide evadirlo cambiando el usuario; nunca se guarda la contraseña.
    const keys = [`${realm}:ip:${ip}`, `${realm}:identity:${ip}:${digest}`];
    const waits = keys.map((key) => {
      const times = attempts.get(key) ?? [];
      return times.length >= limit ? Math.ceil((times[0] + windowMs - now) / 1000) : 0;
    });
    const wait = Math.max(...waits);
    if (wait) return wait;
    if (attempts.size + keys.filter((key) => !attempts.has(key)).length > maxKeys) {
      return Math.max(1, Math.ceil(windowMs / 1000));
    }
    for (const key of keys) attempts.set(key, [...(attempts.get(key) ?? []), now]);
    return 0;
  };
}

const consume = createLoginLimiter();

export function limitLoginAttempt(req: NextRequest, realm: "member" | "admin", identity: string) {
  // Solo fiable si el proxy de entrada sobrescribe esta cabecera, no si la añade.
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "";
  const ip = isIP(forwarded) ? forwarded : "unknown";
  const retryAfter = consume(realm, ip, identity);
  return retryAfter ? NextResponse.json({ error: "DEMASIADOS INTENTOS. INTÉNTALO MÁS TARDE" }, {
    status: 429,
    headers: { "Retry-After": String(retryAfter), "Cache-Control": "no-store" },
  }) : null;
}
