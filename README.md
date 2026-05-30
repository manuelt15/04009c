# 04009c — The House of Access

Plataforma de moda exclusiva con acceso por contraseña, catálogo de productos y panel de administración.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 |
| Componentes | shadcn/ui (customizados) |
| Animaciones | Framer Motion |
| Base de datos | MongoDB + Mongoose |
| Auth | JWT (jose) + bcrypt |
| Gráficas | Recharts |

---

## Arrancar en local

```bash
npm install
npm run dev
```

MongoDB debe estar corriendo en `localhost:27017`. App en `http://localhost:3000`.

---

## Variables de entorno (`.env.local`)

```env
MONGODB_URI=mongodb://localhost:27017/04009c
JWT_SECRET_MEMBER=min-32-chars-secret
JWT_SECRET_ADMIN=min-32-chars-secret
```

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                  → Gate (contraseña de acceso)
│   ├── about/                    → Descripción de la marca
│   ├── store/                    → Catálogo (protegido JWT miembro)
│   │   └── [slug]/               → Detalle de producto
│   ├── admin/                    → Dashboard admin (protegido JWT admin)
│   │   ├── login/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── subscribers/
│   │   └── settings/
│   └── api/
│       ├── auth/                 → login, logout, admin-login, admin-logout
│       ├── products/             → GET catálogo público
│       └── admin/                → stats, products (CRUD), orders, subscribers, settings
├── components/
│   ├── gate/                     → PasswordGate
│   ├── store/                    → Header, CategoryNav, ProductCard, ProductGrid, ProductDetail
│   ├── admin/                    → Dashboard, Sidebar, Products, Orders, Subscribers, Settings, AdminSelect
│   │   └── charts/               → RevenueChart, OrdersDonut, CategoryChart
│   └── shared/                   → Providers, AboutBrand
├── lib/
│   ├── auth/                     → jwt.ts, admin-guard.ts
│   ├── db/                       → mongoose.ts
│   └── models/                   → login, product, order, subscriber, admin
└── proxy.ts                      → Protección rutas (store + admin + api/admin)
```

---

## Zonas de la app

### Gate `/`
- Contraseña hasheada (bcrypt) en MongoDB
- Audio ambiente en loop + toggle mute
- Click en caballo → `/about`

### About `/about`
- Manifiesto de la marca — siempre fondo azul `#04009c`

### Tienda `/store` — JWT miembro
- Header con dark/light mode y logout
- Categorías sticky (ALL / NUEVOS / HOODIES / CAMISETAS / TOPS / PANTALONES / ACCESORIOS / CHAQUETAS)
- Grid con hover swap de imagen + overlay AGOTADO
- View Transitions al abrir detalle
- Detalle: imagen grande + ficha técnica + CTA (placeholder Stripe)

### Admin `/admin` — JWT admin
- **Resumen** — stats + gráficas (ingresos por mes, pedidos por estado, productos por categoría, últimos suscriptores)
- **Productos** — CRUD completo con formulario inline
- **Pedidos** — tabla + cambio de estado con dropdown custom
- **Suscriptores** — tabla + exportar CSV
- **Acceso** — cambiar clave del gate y credenciales admin
- Toggle dark/light mode en sidebar

---

## Sistema de diseño

### Colores
| Token | Valor | Uso |
|---|---|---|
| `brand-blue` | `#04009c` | Fondo gate/about, light mode |
| `brand-red` | `#FF0000` | Acciones, alertas, énfasis |
| `amber` | `#F0A500` | Datos de sistema, labels, activos |
| `black` | `#080808` | Fondo dark mode |
| `off-white` | `#E2E2E2` | Texto principal |
| `surface` | `#1A1A1A` | Cards, panels |
| `border` | `#2A2A2A` | Separadores |
| `dim` | `#6B6B6B` | Texto secundario |

### Tipografía
| Fuente | Uso |
|---|---|
| cyGrotesk | Nombre de marca `04009c` |
| IBM Plex Mono | UI, datos, labels, navegación |
| Bebas Neue | Títulos de sección |
| DM Sans | Cuerpo, descripciones |

### Reglas
- Sin `border-radius` en ningún componente
- Amber solo para datos de sistema
- Scan lines CSS global
- View Transitions API en navegación store

---

## Pendiente

- [ ] Integración Stripe — pagos y pedidos reales
- [ ] Subida de imágenes de productos (Cloudinary / S3)
- [ ] Página de suscripción de miembros
- [ ] Deploy — Vercel + MongoDB Atlas
- [ ] Dominio y variables de entorno producción
