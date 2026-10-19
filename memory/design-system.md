# Design System — 04009c

Referencia completa y medida sobre el código en `DESIGN.md` (raíz del repo). Esto es el resumen.

## Colores
```
#04009c  → Brand Blue    fondo del modo azul (claro del sistema)
#080808  → Black         fondo del modo negro (oscuro del sistema)
#FF0000  → Brand Red     ACENTO: etiquetas, precios, activo, foco, NUEVO, errores, AGOTADO
#E2E2E2  → Off-white     texto principal y botón primario
#1A1A1A  → Surface       cards, paneles (en azul: rgba(0,0,80,0.35))
#2A2A2A  → Border        separadores (en azul: rgba(255,255,255,0.15))
#6B6B6B  → Dim           texto secundario
#F0A500  → Amber         YA NO SE USA (2026-09-27 Manuel pidió rojo en toda la web y el panel)
```

Cuando el rojo tapa una distinción que antes hacía el ámbar, se usa blanco o gris:
DISPONIBLE en blanco (AGOTADO rojo), pedido "cancelado" gris tachado ("pendiente" rojo).

## Tipografía
```
Nombre de marca  → cyGrotesk (fuente custom local), solo "04009c"
Títulos          → Bebas Neue
UI / datos       → IBM Plex Mono, mayúsculas
Cuerpo           → DM Sans
```

## Reglas visuales
- Sin border-radius ni sombras
- Scan lines via CSS overlay (sutil) y grano en fondos
- Tema: sigue al sistema; selector AUTO / AZUL / NEGRO con iconos
- Fotos de producto con `.product-photo`: contain + fondo claro + multiply + blanco y negro
- Caballo: `caballo_blanco_recortado.png` (el original tiene mucho margen transparente)
- Móvil: `dvh` en vez de `vh`, campos a 16 px (sin zoom en iOS), `viewport-fit=cover`

## Movimiento
- Curvas `--motion-ease-out`, `--motion-ease-in-out`, `--motion-ease-drawer` (no `--ease-*`: pisaría Tailwind)
- `.press` (scale 0.97) en botones, salidas más rápidas que entradas, reduced motion respetado

## Estética de referencia
- Body scan retro, menú VCR azul, dameapresparis.com (grid, hover swap, categorías sticky)
