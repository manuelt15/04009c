# 04009c · The House of Access

Tienda de ropa exclusiva con acceso por código, catálogo con tallas y stock, carrito, checkout y panel de administración.

En producción: [04009c.vercel.app](https://04009c.vercel.app)

![Panel de administración: listado de productos](docs/panel-admin.png)

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 (tokens en `globals.css`) |
| Animaciones | Framer Motion + View Transitions API |
| Base de datos | MongoDB + Mongoose (Atlas en producción) |
| Auth | JWT (jose) en cookies httpOnly + bcrypt |
| Gráficas | Recharts |
| Tema | next-themes (sigue al sistema) |
| Emails | Nodemailer |
| Deploy | Vercel (push a `main` = producción) |

---

## Arrancar en local

```bash
npm install
npm run dev
```

MongoDB tiene que estar corriendo en `localhost:27017`. La app queda en `http://localhost:3000`.

`.env.local` apunta a la base de datos de **producción**. Para trabajar en local sin tocar la tienda real, arranca con la base local y sin correo:

```bash
MONGODB_URI="mongodb://localhost:27017/04009c" MAIL_USER="" MAIL_PASS="" npm run dev
```

Si un cambio de estilos no aparece, para el servidor y borra `.next`: con el repo en una carpeta sincronizada por iCloud, Turbopack a veces sirve CSS antigua.

---

## Variables de entorno (`.env.local`)

```env
MONGODB_URI=mongodb://localhost:27017/04009c
JWT_SECRET_MEMBER=<genera uno con: openssl rand -base64 32>
JWT_SECRET_ADMIN=<genera uno con: openssl rand -base64 32>
MAIL_USER=
MAIL_PASS=
```

---

## Zonas de la app

### Entrada `/`
- Código de acceso hasheado (bcrypt) en MongoDB
- Audio ambiente en bucle con botón de silencio
- Caballo → `/about` · ADMINISTRADOR (esquina) → login del panel
- Avisos si el código está vacío o es incorrecto

### About `/about` y Solicitar acceso `/subscribe`
- Manifiesto de la marca
- Formulario de solicitud con validación y email de confirmación

### Tienda `/store` (sesión de miembro)
- Cabecera: caballo → about, `04009c` → inicio, modos AUTO / AZUL / NEGRO, carrito, administrador. En móvil, menú lateral
- Categorías gestionables desde el panel. TODO y NUEVOS son automáticas (NUEVOS = creados en los últimos 30 días, con etiqueta en la card)
- Fotos con tratamiento común (encuadre, fondo claro, blanco y negro) y segunda foto en hover
- Ficha: tallas S a XL (o talla única) con stock, guía de medidas, cantidad limitada por stock
- Carrito lateral guardado en el navegador, sin superar el stock de cada talla
- Checkout `/store/checkout` con datos de envío, método de envío y resumen. El pago muestra un aviso: se activará al conectar Stripe
- Pie con ayuda, legal (páginas pendientes de contenido), redes y cierre de sesión

### Panel `/admin` (sesión de administrador)
- **Resumen:** métricas y gráficas (ingresos por mes, pedidos por estado, productos por categoría, últimos suscriptores)
- **Productos:** alta con slug y referencia automáticos, stock por talla, miniatura, etiqueta NUEVO y confirmación al borrar. Subida directa de fotos preparada pero desactivada
- **Pedidos:** detalle desplegable con artículos, talla, datos de envío e historial de estados
- **Suscriptores:** tabla y exportación a CSV
- **Ajustes:** categorías (crear, renombrar, ordenar, guía de medidas), métodos y precios de envío, tablas de medidas, código de acceso y credenciales del administrador
- Barra lateral fija en escritorio, menú lateral en móvil

---

## Estructura

```
src/
├── app/
│   ├── page.tsx                  → Entrada con código de acceso
│   ├── about/  subscribe/
│   ├── store/                    → Catálogo (JWT miembro)
│   │   ├── [slug]/               → Ficha de producto
│   │   └── checkout/
│   ├── admin/                    → Panel (JWT admin): login, products, orders, subscribers, settings
│   └── api/
│       ├── auth/                 → login, logout, admin-login, admin-logout
│       ├── products/             → catálogo (JWT miembro)
│       ├── categories/  store-settings/   → lectura pública (sin datos sensibles)
│       └── admin/                → stats, products, orders, subscribers, settings, categories, store-settings
├── components/
│   ├── gate/  store/  store/cart/  store/checkout/  admin/  admin/charts/  shared/
├── lib/
│   ├── auth/  db/  models/       → product, order, category, store-settings, subscriber, admin, login
│   ├── cart-store.ts             → carrito (localStorage)
│   ├── stock.ts  size-guide.ts  shipping.ts  new-products.ts
│   └── store-config.ts           → categorías y ajustes, con valores iniciales si no existen
└── proxy.ts                      → protección de /store, /api/products, /admin y /api/admin
```

---

## Sistema de diseño

Referencia completa en [`DESIGN.md`](DESIGN.md).

| Token | Valor | Uso |
|---|---|---|
| `brand-blue` | `#04009c` | Fondo del modo azul |
| `black` | `#080808` | Fondo del modo negro |
| `brand-red` | `#FF0000` | Acento: acciones, etiquetas, precios, activo, errores |
| `off-white` | `#E2E2E2` | Texto principal y botón primario |
| `surface` / `border` / `dim` | `#1A1A1A` / `#2A2A2A` / `#6B6B6B` | Paneles, separadores, texto secundario |

- Tipografías: cyGrotesk (solo `04009c`), IBM Plex Mono (interfaz), Bebas Neue (títulos), DM Sans (párrafos)
- Sin `border-radius` ni sombras
- El tema sigue al sistema (claro = azul, oscuro = negro) con selector manual
- Alturas con `dvh` y campos a 16 px en móvil para Safari y Chrome
- Curvas de animación propias (`--motion-ease-*`) y respeto a "reducir movimiento"

---

## Pendiente

- [ ] Stripe: pagos reales y creación de pedidos (el modelo de pedido ya guarda talla, envío e historial)
- [ ] Subida de fotos (Cloudinary o Vercel Blob): el botón está en el panel, desactivado
- [ ] Fotos propias de la marca: las actuales son de prueba
- [ ] Textos de envíos, devoluciones, guía de tallas y legales
- [ ] Medidas y precios de envío reales (se editan en Ajustes)
- [ ] Dominio propio
