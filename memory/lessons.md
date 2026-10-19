# Lessons — 04009c

Errores encontrados y sus fixes. Actualizar tras cada corrección.

---

**Error:** Build falla en Vercel con `Type error` en RevenueChart tooltip formatter
**Fix:** Cambiar `(v: number)` a `(v)` y usar `Number(v)` dentro — Recharts pasa `ValueType | undefined`
**No hacer:** No tipar manualmente los parámetros de callbacks de Recharts

---

**Error:** proxy.ts genera warning "middleware is deprecated" en Next.js 16
**Fix:** Renombrar `middleware.ts` a `proxy.ts` y la función `middleware` a `proxy`
**No hacer:** No usar el nombre `middleware` en Next.js 16+

---

**Error:** Favicon SVG de 146KB con base64 embebido no renderiza en navegadores
**Fix:** Usar SVG limpio con formas vectoriales puras, sin `<image>` con base64
**No hacer:** No embeber PNGs en base64 dentro de SVG usados como favicon

---

**Error:** Admin API routes accesibles sin auth si el proxy falla
**Fix:** Añadir `requireAdmin()` en cada handler + incluir `/api/admin/:path*` en el matcher del proxy
**No hacer:** No confiar solo en el proxy para proteger APIs — siempre defense in depth

---

**Error:** HTML injection en templates de email con datos de usuarios
**Fix:** Helper `esc()` que escapa `&`, `<`, `>`, `"`, `'` aplicado a todos los valores interpolados
**No hacer:** No interpolar datos de usuario en HTML sin escapar

---

**Error:** NoSQL injection en settings — `findOne({ password: x })` permite objetos como `{ $gt: "" }`
**Fix:** Buscar solo por username, luego `bcrypt.compare()`. Coercionar inputs a string antes de cualquier query
**No hacer:** No hacer queries de MongoDB con valores de usuario sin validar tipo

---

**Error:** Archivo duplicado `page 2.tsx` colado en commit por macOS Finder
**Fix:** `rm "src/app/store/page 2.tsx"` + commit limpieza
**No hacer:** Revisar `git status` antes de commit para detectar archivos con espacios

---

**Error:** Admin sidebar bloquea todo el contenido en móvil (w-56 fijo)
**Fix:** `hidden md:flex` en sidebar desktop + top bar móvil con drawer overlay
**No hacer:** No usar anchos fijos en sidebars sin breakpoints responsive

---

**Error:** Tablas del admin se rompen en móvil — contenido desbordado
**Fix:** `overflow-x-auto` en el wrapper + `min-w-[Xpx]` en la tabla
**No hacer:** No poner tablas con muchas columnas sin scroll horizontal en móvil

---

## 2026-09-27

**Error:** `.env.local` apunta a Atlas de **producción**: arrancar `npm run dev` tal cual lee y escribe en la tienda real (y manda emails reales)
**Fix:** Arrancar con `MONGODB_URI="mongodb://localhost:27017/04009c" MAIL_USER="" MAIL_PASS=""` delante; no hace falta tocar `.env.local`
**No hacer:** No arrancar el dev server de este repo sin mirar antes a qué base apunta

---

**Error:** Turbopack siguió sirviendo CSS antigua tres veces (clases nuevas de `globals.css` ausentes), incluso tras reiniciar
**Fix:** Parar el servidor, `rm -rf .next`, arrancar. La causa probable es el repo en `~/Desktop` sincronizado con iCloud
**No hacer:** No dar por aplicado un cambio de estilos sin comprobar el CSS servido o el estilo computado

---

**Error (corrección de Manuel):** dije que la gráfica de pedidos estaba rota; era la captura hecha a mitad de su animación de entrada (Recharts anima 1,5 s)
**Fix:** Capturar después de que termine la animación; además se bajó la animación a 400 ms
**No hacer:** No diagnosticar un fallo visual con una captura tomada durante una animación

---

**Error:** Pasar todo el ámbar a rojo borró distinciones: DISPONIBLE y AGOTADO, o pendiente y cancelado, quedaron del mismo color
**Fix:** DISPONIBLE en blanco, cancelado en gris tachado
**No hacer:** Al fusionar dos colores, revisar qué estados se distinguían solo por ese color

---

**Error:** VOLVER de la ficha con `router.back()` sacaba de la web si la ficha se abría directa (enlace, pestaña recargada en móvil)
**Fix:** Ruta fija `router.push("/store")`; el login del admin usa `?from=` validado (solo rutas que empiezan por `/` y no por `//`)
**No hacer:** No usar `router.back()` como único camino de vuelta

---

**Error:** Cambiar credenciales buscaba al admin por el usuario NUEVO (el token no identificaba a nadie)
**Fix:** El JWT admin lleva `sub` = id del admin y la ruta busca por él; las sesiones antiguas deben volver a entrar
**No hacer:** No buscar el registro a modificar con datos que envía el propio formulario
