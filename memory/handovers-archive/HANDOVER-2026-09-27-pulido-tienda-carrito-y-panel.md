# Handover 2026-09-27 · Pulido de la tienda, carrito, checkout y panel

Sesión larga de pulido para dejar 04009c como tienda de ropa exclusiva. Se descartó (a propósito)
convertirla en plataforma multi-tienda o en plantilla: se pule esta tienda y ya. Todo quedó en
producción en https://04009c.vercel.app.

## Commits (repo `manuelt15/04009c`, rama `main`, cuenta personal)

| SHA | Qué |
|---|---|
| `a2d27fd` | Skills de diseño del proyecto (`.claude/skills`, emilkowalski + taste-skill) y `DESIGN.md` |
| `01ca5d0` | Tienda, entrada, about, solicitar acceso y componentes compartidos |
| `9d9120c` | Panel de administración y arreglo de credenciales |
| `45ff786` | `/api/products` exige sesión de miembro |
| `edafcf2` | README actualizado con captura del panel (`docs/panel-admin.png`) |

## Qué se hizo

**Entrada, about y solicitar acceso.** Esquinas de la entrada: coordenadas de Los Ángeles +
ADMINISTRADOR (→ login) a la izquierda, BLOQUEADA / 04009c a la derecha. El ámbar pasa a rojo.
Fuera las esquinas de about y subscribe. Todo en español (manifiesto traducido, `lang="es"`).
"House of Access", HOODIES y TOPS se quedan en inglés a propósito.

**Tema.** Sigue al sistema (claro = azul `#04009c`, oscuro = negro) en toda la web, con selector
AUTO / AZUL / NEGRO con iconos (`ThemeSwitcher`).

**Tienda.** Cabecera: caballo → about, `04009c` → `/store`, modos, carrito y ADMINISTRADOR; en
móvil, carrito + menú lateral desde la derecha. Pie nuevo (`StoreFooter`) con ayuda, legal
(páginas sin contenido, marcadas "Próximamente"), redes y cerrar sesión. Pestaña TODO (antes ALL).
NUEVOS automático = creados en los últimos 30 días, con etiqueta roja en la card
(`lib/new-products.ts`). Fotos con tratamiento común (`.product-photo`: contain, fondo claro,
multiply, blanco y negro). Favicon del caballo sobre azul (`app/icon.png`, `apple-icon.png`).

**Ficha, carrito y checkout.** Tallas S a XL (talla única en accesorios), guía de medidas,
cantidad. Carrito en localStorage (`lib/cart-store.ts`, `useSyncExternalStore`). Checkout
`/store/checkout` con validaciones; al pagar, modal con el logo de Stripe (pagos pendientes).
VOLVER de la ficha usa ruta fija `/store` (con `router.back()` salía de la web si no había historial).

**Panel.** Iconos SVG en la barra lateral, fija a la altura de la ventana en escritorio, drawer en
móvil. Ámbar → rojo (DISPONIBLE pasa a blanco y "cancelado" a gris tachado para no chocar con el
rojo). Productos: stock por talla, slug y REF automáticos, miniatura, NUEVO, confirmación de
borrado propia, botón SUBIR FOTOS visible pero desactivado. Pedidos: detalle con artículos,
envío e historial. AJUSTES (antes ACCESO): categorías, envíos y guías de medidas editables, más
código de acceso y credenciales. Login del admin con VOLVER (a `?from=`, solo rutas internas).

**Base de datos (nuevo).** `Product.sizes` (vacío = sin control de stock), colecciones
`categories` y `storesettings` sembradas solas al primer acceso (`lib/store-config.ts`),
`Order` con talla, dirección, método de envío y `statusHistory`.

**Otros.** Avisos propios (`Toaster`, sin dependencias). Animaciones revisadas con la skill de
Emil (curvas `--motion-ease-*`, `.press`, View Transition card→ficha con `view-transition-class`,
reduced motion). Alturas con `dvh`, campos a 16 px en móvil, `viewport-fit=cover`.

**Producción.** Se asignaron las 10 fotos de `public/products/` a sus productos, se borró
"PRUEBA 000" (copia EJSON guardada solo en el scratchpad de la sesión) y se marcaron como nuevos
ARCHIVE HOODIE 001 y TECH JACKET 001 (hasta el 2026-10-27).

## Cómo se verificó

- Chromium headless (playwright-core de Master-SH) en escritorio e iPhone 13: formularios y
  avisos, tallas con stock (M=0 deshabilitada, L=2 bloquea el +), carrito y checkout, modal de
  Stripe, envío editable reflejado en checkout (12,50 €), categoría nueva visible en la tienda,
  historial de pedido, barra lateral fija tras 1046 px de scroll, `min-height` = alto de ventana,
  campos a 16 px en móvil, sin ámbar en ninguna página del panel.
- `npm run build` en verde antes del push. Vercel `success` en cada commit.
- Producción: entrada nueva servida, assets 200, 10 productos con foto, NUEVOS con 2,
  `/api/products` sin sesión → 401. Manuel entró al panel de prod después del cambio de token.

## Pendiente y de quién depende

- **Manuel / su amigo:** fotos propias (las actuales son de otras tiendas), textos de envíos,
  devoluciones, guía de tallas y legales, medidas y precios de envío reales (Ajustes), clave del
  panel de producción (no está anotada en ninguna parte).
- **Decisión pendiente:** almacenamiento de fotos (Vercel Blob o Cloudinary) para activar SUBIR FOTOS.
- **Stripe:** pagos reales y creación de pedidos; recalcular precios y stock en servidor.
- **Opcional:** caballo recortado en entrada, about, subscribe y login (solo cabecera, pie y panel
  lo usan); mover el repo fuera de iCloud.

## Trampas

- `.env.local` apunta a **Atlas de producción**. En local, arrancar con `MONGODB_URI` local y
  `MAIL_USER`/`MAIL_PASS` vacíos. Ver [[lessons]].
- Turbopack sirvió CSS antigua tres veces (repo en el Escritorio con iCloud). Solución: parar,
  `rm -rf .next`, arrancar.
- Tras el cambio de token (`sub` = id del admin), las sesiones de admin antiguas no pueden cambiar
  credenciales: hay que volver a entrar.
