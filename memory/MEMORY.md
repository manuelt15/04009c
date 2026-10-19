# 04009c — Moya Memory

Fuente de verdad del proyecto. Leer al iniciar cada sesión.

## Índice
- [Handover 2026-09-27](handovers-archive/HANDOVER-2026-09-27-pulido-tienda-carrito-y-panel.md) — pulido completo: tema del sistema, carrito y checkout con aviso de Stripe, tallas con stock, panel con categorías, envíos y medidas editables; todo en producción.
- [[design-system]] — Tokens, colores, tipografía, reglas visuales (el acento es ahora el rojo)
- [[architecture]] — Stack, estructura, rutas, colecciones y cómo arrancar en local sin tocar producción
- [[auth]] — Flujo JWT, zonas de acceso, miembro vs admin, qué rutas protege el proxy
- [[lessons]] — Errores encontrados y sus fixes
- `DESIGN.md` en el repo — referencia visual completa medida sobre el código (2026-09-27)

## Estado actual
> Actualizado: 2026-09-27

- **Fase:** Producción, live en https://04009c.vercel.app
- **Repo:** https://github.com/manuelt15/04009c (privado, rama main, cuenta **personal** manuelt15 / manueltorres1512@gmail.com)
- **MongoDB:** Atlas en producción (base `04009c`). Local: `mongodb://localhost:27017/04009c`
- **Deploy:** Vercel, equipo `manuel-torres-projects-e73c5395`, proyecto `04009c`. Push a `main` = producción
- **Último commit:** `edafcf2` docs: update README with today's store and admin features and a panel screenshot
- **Decidido 2026-09-27:** se pule esta tienda y ya. Descartado convertirla en plataforma multi-tienda o plantilla.

## Todo construido y funcionando
- Entrada `/` con código, audio, esquinas (coordenadas de LA, ADMINISTRADOR → login, BLOQUEADA)
- About y Solicitar acceso en español, sin esquinas, con validación y avisos
- Tema que sigue al sistema (azul/negro) con selector AUTO / AZUL / NEGRO
- Tienda: cabecera con carrito y menú móvil, pie, categorías desde BD, TODO/NUEVOS automáticas, NUEVO en card
- Ficha: tallas con stock, guía de medidas, cantidad; carrito lateral (localStorage); checkout con modal de Stripe
- Panel: barra lateral fija con iconos, stock por talla, slug/REF automáticos, pedidos con detalle e historial, AJUSTES (categorías, envíos, medidas, código, credenciales)
- Avisos propios (Toaster), animaciones revisadas, dvh y 16 px en campos móviles
- `/api/products` exige sesión de miembro

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
- requireAdmin() en TODAS las rutas /api/admin/* (defense in depth)
- Emails NO bloquean el registro — Promise.all con .catch(() => {})
- HTML escapado en templates de email con helper esc()
- View Transitions con `view-transition-class: product` en card y ficha
- Categorías y ajustes de tienda en BD, sembrados solos con valores iniciales (`lib/store-config.ts`)
- Producto sin `sizes` = sin control de stock (todas las tallas); agotado = manual o todas a 0 (`lib/stock.ts`)
- Carrito solo en el navegador; precios a recalcular en servidor cuando llegue Stripe
- Sin dependencias nuevas: avisos, carrito y modales hechos a mano
