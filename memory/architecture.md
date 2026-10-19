# Arquitectura — 04009c

## Stack
- Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, Framer Motion
- MongoDB + Mongoose, JWT (jose) miembro + admin separados, bcrypt, Recharts, next-themes, Nodemailer

## Arrancar en local SIN tocar producción
`.env.local` apunta a Atlas de producción. En local:
```
MONGODB_URI="mongodb://localhost:27017/04009c" MAIL_USER="" MAIL_PASS="" npx next dev -p 3001
```
Si no aparecen cambios de CSS: parar, `rm -rf .next`, arrancar (iCloud + Turbopack).

## Rutas
```
/                     entrada con código
/about  /subscribe
/store                catálogo (JWT miembro)
/store/[slug]         ficha (guía de medidas cargada en servidor)
/store/checkout       checkout (pago → modal Stripe, sin cobro)
/admin/*              panel (JWT admin): products, orders, subscribers, settings (AJUSTES)
/api/products         catálogo (JWT miembro)
/api/categories       lectura pública
/api/store-settings   lectura pública (envíos, guías de medidas)
/api/admin/*          categories, store-settings, products, orders, stats, subscribers, settings
```

## Colecciones
- `products` (+ `sizes: [{size, stock}]`, vacío = sin control de stock)
- `categories` (name, order, sizeGuide tops/bottoms/none) — sembrada con la lista original
- `storesettings` (key "main": shipping, sizeGuides) — sembrada con los valores iniciales
- `orders` (+ talla por artículo, dirección, método de envío, statusHistory)
- `subscribers`, `admins`, `logins`

## Piezas clave
- `lib/store-config.ts` — getCategories / getStoreSettings con siembra automática
- `lib/cart-store.ts` — carrito en localStorage con useSyncExternalStore, límite por stock
- `lib/stock.ts`, `lib/size-guide.ts`, `lib/shipping.ts`, `lib/new-products.ts`
- `components/shared/Toaster.tsx` (avisos), `ThemeSwitcher.tsx`, `admin/ConfirmDialog.tsx`

## Verificación usada
Chromium headless con playwright-core de `~/Developer/Master-SH/node_modules/.pnpm/playwright-core@*`
(scripts en el scratchpad, no en el repo). No abrir el Chrome de Manuel sin pedirlo.
