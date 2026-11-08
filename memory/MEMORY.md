# 04009c — Moya Memory

Fuente de verdad del proyecto. Leer al iniciar cada sesión.

## Índice
- [Avisos de maqueta en tienda, ficha y pago (2026-11-08)](handovers/HANDOVER-2026-11-08-avisos-de-maqueta.md) — franjas de ejemplo en el layout de `/store`, en el pago y junto a las tallas; quedan tres avisos en el checkout y sobra el recuadro viejo.
- [Maqueta pública, portada `// ENTRAR` y `/subscribe` cerrado (2026-11-08)](handovers/HANDOVER-2026-11-08-maqueta-publica-y-demo-sin-hidratacion.md) — cierre de la tanda: la pista de la portada, el aviso de suscripción, y el hallazgo de que `next dev` no hidrata en este entorno (0 fibers, `__next_f` vacío, sin errores); el demo compila y se sirve en producción.
- [Autenticación retirada (2026-11-08)](auth-aparcada.md) — la web es pública; el JWT antiguo se retiró y vuelve con better-auth.
- [Cierre local de hallazgos 2026-11-08](handovers-archive/HANDOVER-2026-11-08-cierre-hallazgos-local.md) — 35 cierres, 3 residuales; tsc/tests verdes, lint previo y build offline bloqueado; SIN PUSH.
- [Estado de remediación](security-remediation.md) — tokens, accesibilidad, dependencias y límites de login.
- [Handover 2026-09-27](handovers-archive/HANDOVER-2026-09-27-pulido-tienda-carrito-y-panel.md) — pulido completo: tema del sistema, carrito y checkout con aviso de Stripe, tallas con stock, panel con categorías, envíos y medidas editables; todo en producción.
- [[design-system]] — Tokens, colores, tipografía, reglas visuales (el acento es ahora el rojo)
- [[architecture]] — Stack, estructura, rutas, colecciones y cómo arrancar en local sin tocar producción
- [[auth]] — Flujo JWT, zonas de acceso, miembro vs admin, qué rutas protege el proxy
- [[lessons]] — Errores encontrados y sus fixes
- `DESIGN.md` en el repo — referencia visual completa medida sobre el código (2026-09-27)

## Estado local — 2026-11-08 (demo pública)

- La web es **pública, sin clave**: portada con número pulsable → ACCEDER → `/store`.
- La pista sobre el número es **`// ENTRAR`** (antes «Pulsa los números»): etiqueta de zona en estilo terminal, no instrucción.
- `/subscribe` está **cerrado como aviso**: «// PRÓXIMAMENTE» + «Pronto tendrás más acceso…» + «MIENTRAS TANTO, LA COLECCIÓN ESTÁ ABIERTA.». Sin formulario; la API sigue existiendo pero nadie la llama.
- Panel `/admin` = vista de prueba de solo lectura con datos inventados (`src/lib/demo-data.ts`); banner fijo en todas las pantallas; `/api/admin/*` solo `GET`, el resto `405`.
- Checkout de ejemplo: carrito de ejemplo, «Pago con Stripe — próximamente», sin escribir pedidos.
- El JWT antiguo se retiró: no queda código de sesión ni variables `JWT_SECRET_*`. Vuelve con better-auth.
- `JWT_SECRET_MEMBER` y `JWT_SECRET_ADMIN` borradas de Vercel: ninguna ruta las acepta.
- **Maqueta sin secretos**: `npm run demo` levanta un Mongo en memoria, siembra `src/lib/demo-data.ts` y arranca Next en 3006. `mongodb-memory-server` es devDependency; el binario no se commitea. Sin fallback en producción: sin `MONGODB_URI` la app falla.
- Verificación: tsc, 15 tests y build, todos con salida real. `npm run demo` compila y sirve en producción (con `next dev` no hidrata en este entorno).
- `next dev` (Turbopack) **no hidrata en esta máquina**: sirve el HTML correcto pero React no engancha (0 elementos con fiber, `window.__next_f` vacío, sin errores en consola). No lo causaron los cambios: el commit original falla igual. El demo compila y sirve con `next build` + `next start`.

## Estado local — 2026-11-08 (tanda anterior)

- Remediación de 35 hallazgos registrada; abiertos ALTA 2026-11-08-001 y BAJA 042/044.
- Sin push ni despliegue. tsc y 23 tests verdes; lint previo (20 errores/2 avisos); build bloqueado por fuentes remotas en modo offline.
- Próximo paso de Manuel: rotación del ALTA, tratamiento del rojo pequeño sobre azul, desbloqueo del build y aprobación antes de cualquier push.
- Baseline enlaces rotos de memoria: 0 (2026-11-08).

## Estado de producción (histórico)
> Actualizado: 2026-09-27

- **Fase:** Producción, live en https://04009c.vercel.app
- **Repo:** https://github.com/manuelt15/04009c (privado, rama main, cuenta **personal** manuelt15 / manueltorres1512@gmail.com)
- **MongoDB:** Atlas en producción (base `04009c`). Local: `mongodb://localhost:27017/04009c`
- **Deploy:** Vercel, equipo `manuel-torres-projects-e73c5395`, proyecto `04009c`. Push a `main` = producción
- **Último commit:** `edafcf2` docs: update README with today's store and admin features and a panel screenshot
- **Decidido 2026-09-27:** se pule esta tienda y ya. Descartado convertirla en plataforma multi-tienda o plantilla.

## Todo construido y funcionando
- Entrada `/` con audio, esquinas (coordenadas de LA, ADMINISTRADOR → panel) y número pulsable, con la pista `// ENTRAR`
- About en español; Solicitar acceso es un aviso «próximamente» (formulario desactivado)
- Tema que sigue al sistema (azul/negro) con selector AUTO / AZUL / NEGRO
- Tienda: cabecera con carrito y menú móvil, pie, categorías desde BD, TODO/NUEVOS automáticas, NUEVO en card
- Ficha: tallas con stock, guía de medidas, cantidad; carrito lateral (localStorage); checkout con modal de Stripe
- Panel: barra lateral fija con iconos, stock por talla, slug/REF automáticos, pedidos con detalle e historial, AJUSTES (categorías, envíos, medidas, código, credenciales)
- Avisos propios (Toaster), animaciones revisadas, dvh y 16 px en campos móviles
- `/api/products` es público (la sesión de miembro quedó aparcada)

## Credenciales locales (NO subir a git)
- Gate: `123456`
- Admin: `admin` / `admin123`
- Mail: `04009c@gmail.com` / app password en .env.local
- **Producción:** las claves no están anotadas en ningún sitio (Manuel sí puede entrar al panel de prod)

## Variables de entorno en Vercel
- MONGODB_URI, JWT_SECRET_MEMBER, JWT_SECRET_ADMIN, MAIL_USER, MAIL_PASS

## Pendiente
- [ ] Fotos propias de la marca (las de `public/products/` son de otras tiendas, puestas como prueba)
- [ ] Almacenamiento de fotos (Vercel Blob o Cloudinary) para activar SUBIR FOTOS del panel
- [ ] Stripe: pagos reales y creación de pedidos (recalcular precio y stock en servidor)
- [ ] Textos de envíos, devoluciones, guía de tallas y legales (el pie los muestra como "Próximamente")
- [ ] Medidas y precios de envío reales (se editan en el panel → AJUSTES)
- [ ] Dominio propio en Vercel
- [ ] Opcional: caballo recortado también en entrada, about, subscribe y login
- [ ] Opcional: mover el repo fuera de iCloud (Turbopack sirve CSS antigua)

## Decisiones técnicas clave
- Next.js 16 — proxy.ts (no middleware.ts), params son Promise en rutas dinámicas
- Tailwind v4 — tokens en globals.css con @theme inline, NO tailwind.config.js
- Passwords bcrypt cost 12 — gate, admin login y settings
- /api/admin/* solo admite GET y devuelve datos de ejemplo; el resto de métodos, 405
- Emails NO bloquean el registro — Promise.all con .catch(() => {})
- HTML escapado en templates de email con helper esc()
- View Transitions con `view-transition-class: product` en card y ficha
- Categorías y ajustes de tienda en BD, sembrados solos con valores iniciales (`lib/store-config.ts`)
- Datos de ejemplo del panel en `src/lib/demo-data.ts` (inventados, dominio de ejemplo)
- Producto sin `sizes` = sin control de stock (todas las tallas); agotado = manual o todas a 0 (`lib/stock.ts`)
- Carrito solo en el navegador; precios a recalcular en servidor cuando llegue Stripe
- Sin dependencias nuevas: avisos, carrito y modales hechos a mano
- La maqueta se sirve compilada (`next build` + `next start`), no con `next dev`: el dev server de Turbopack no hidrata en esta máquina
