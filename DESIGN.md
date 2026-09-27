# 04009c — Style Reference
> Terminal de acceso en azul de señal

**Theme:** dark por defecto (`#080808`), con un modo "light" que no es claro: es el azul de marca `#04009c`.

Valores medidos en el código a 2026-09-27 (`src/app/globals.css`, `src/app/layout.tsx` y las clases de `src/components/`). Los roles y las recomendaciones son interpretación a partir de cómo se usan. Los ejemplos son reconstrucciones, no componentes copiados.

04009c es una tienda de ropa exclusiva que se presenta como un sistema cerrado: antes del catálogo hay una puerta con código de acceso, y toda la interfaz habla como un terminal de los 80 o un menú de VCR. Fondo casi negro (`#080808`) o azul eléctrico (`#04009c`), texto blanco roto, y un único color de "sistema", el ámbar `#F0A500`, reservado para lo que la máquina dice de sí misma: coordenadas, referencias, estados, precios. El rojo `#FF0000` es la alarma: errores, AGOTADO, cerrar sesión. No hay una sola esquina redondeada ni una sombra; la profundidad sale de bordes de 1px y de dos capas de textura (scan lines fijas y grano). La tipografía hace el trabajo de marca: IBM Plex Mono en mayúsculas espaciadas para casi todo, Bebas Neue para los nombres de producto y títulos, DM Sans solo para leer párrafos, y cyGrotesk únicamente para escribir `04009c`. El resultado es denso en los bordes (lecturas de sistema en las esquinas a 9-10px) y vacío en el centro, como una pantalla de escáner con una figura en medio.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Brand Blue | `#04009c` | `--color-brand-blue` | Fondo de la puerta de acceso y de `/about`, fondo global en modo light, texto del botón primario sobre blanco roto. Es el nombre de la marca: nunca como acento pequeño |
| Brand Red | `#FF0000` | `--color-brand-red` | Alarma: errores de acceso, sello AGOTADO, hover de cerrar sesión, el `04009c` destacado en el manifiesto |
| Amber | `#F0A500` | `--color-amber` | Voz del sistema: `data-label`, lecturas de esquina, precios, subrayado de categoría activa, borde del input de acceso y hover de cards. Nunca decorativo |
| Black | `#080808` | `--color-black` | Fondo raíz en modo dark, fondo del login de admin, texto sobre botones ámbar o blanco roto |
| Off-white | `#E2E2E2` | `--color-off-white` | Texto principal y relleno del botón primario. Sustituye al blanco puro en todo |
| Dim | `#6B6B6B` | `--color-dim` | Texto secundario, descripciones, placeholders, navegación inactiva |
| Surface (dark) | `#1A1A1A` | `--theme-surface` → `--color-surface` | Fondo de cards de producto, paneles e inputs del admin |
| Surface (light) | `rgba(0, 0, 80, 0.35)` | `--theme-surface` → `--color-surface` | Lo mismo en modo azul: un azul más profundo translúcido |
| Border (dark) | `#2A2A2A` | `--theme-border` → `--color-border` | Todos los separadores y bordes de 1px |
| Border (light) | `rgba(255, 255, 255, 0.15)` | `--theme-border` → `--color-border` | Separadores en modo azul |

Opacidades en uso (derivadas, no tokens propios): `amber/40-80` para lecturas de sistema secundarias, `off-white/10-50` para bordes y enlaces apagados sobre azul, `dim/50` para placeholders, `black/60-70` para velos (AGOTADO, drawer del admin).

## Tokens — Typography

### cyGrotesk — Solo el nombre de marca `04009c` · `--font-brand`
- **Archivo:** local, `public/fonts/CyGroteskStd-GrandDemi.otf`, weight 700
- **Sizes:** 14px (sidebar admin), 18px (cabecera de detalle), 20px (cabecera de tienda), 24px (login admin), 48-60px (puerta de acceso)
- **Letter spacing:** `tracking-widest` (0.1em) siempre
- **Role:** es un logotipo tipográfico, no una fuente de lectura. Si aparece para otra palabra, deja de ser marca.

### IBM Plex Mono — La voz de la interfaz · `--font-terminal`
- **Weights cargados:** 400, 500, 700 (en la práctica se usa 400)
- **Sizes:** 9, 10, 11, 13, 14, 20px
- **Letter spacing:** `tracking-widest` (0.1em) en navegación y botones, `tracking-wider` (0.05em) en lecturas de sistema, 0.12em en `data-label`, 0.3em en el campo del código de acceso
- **Casing:** mayúsculas para todo lo que sea UI
- **Role:** 107 usos, la familia dominante. Navegación, botones, inputs, precios, referencias, estados, lecturas de esquina.

### Bebas Neue — Nombres de producto y títulos · `--font-display`
- **Weight:** 400 (única)
- **Sizes:** 16px (nombre en card), 30px (títulos de sección del admin), 36-48px (nombre en ficha de producto)
- **Letter spacing:** `tracking-wider` (0.05em)
- **Line height:** `leading-tight` (1.25)
- **Role:** el único momento "editorial". Condensada y alta, contrasta con la anchura del mono.

### DM Sans — Solo párrafos · `--font-body`
- **Weights cargados:** 300, 400, 500
- **Sizes:** 14px
- **Line height:** `leading-relaxed` (1.625)
- **Role:** descripciones de producto y el manifiesto. Es la fuente por defecto del `body`, pero casi todo lo sobrescribe con `font-terminal`.

### Type Scale

| Role | Family | Size | Line Height | Letter Spacing | Uso real |
|------|--------|------|-------------|----------------|----------|
| micro | IBM Plex Mono | 9px | — | 0.05-0.1em | Refs sobre la imagen de producto, subtítulo del sidebar |
| readout | IBM Plex Mono | 10px | 1.625 | 0.05em | Lecturas de esquina (`// SYS.INIT`, `COORD`), enlaces de pie |
| label | IBM Plex Mono | 10.4px (0.65rem) | — | 0.12em | `.data-label`: categoría, `REF`, títulos de campo |
| nav | IBM Plex Mono | 11px | — | 0.1em | Categorías, botones del admin, volver, errores |
| stamp | IBM Plex Mono | 13px | — | 0.1em | Sello AGOTADO en la ficha |
| ui | IBM Plex Mono | 14px | — | 0.1em | Inputs, botones primarios, precio en card |
| body | DM Sans | 14px | 1.625 | normal | Descripciones |
| product-name | Bebas Neue | 16px | 1.25 | 0.05em | Nombre en card |
| price-lg | IBM Plex Mono | 20px | — | normal | Precio en ficha |
| heading | Bebas Neue | 30px | — | 0.05em | Títulos de sección del admin |
| product-title | Bebas Neue | 36 → 48px | 1.25 | 0.05em | Nombre en ficha (móvil → desktop) |
| brand-hero | cyGrotesk | 48 → 60px | — | 0.1em | `04009c` en la puerta |

## Tokens — Spacing & Shapes

**Density:** compacta en los bordes, vacía en el centro. Escala de Tailwind (1 = 4px); los valores más usados son 4 (16px), 3 (12px), 2 (8px) y 6 (24px).

### Spacing Scale

| Name | Value | Uso típico |
|------|-------|------------|
| 0.5 | 2px | Separación nombre / precio en card |
| 1 | 4px | Entre label y valor |
| 2 | 8px | Gap interno de card, iconos |
| 3 | 12px | Padding vertical de inputs, botones y tabs; gap de formularios |
| 4 | 16px | Padding horizontal de tabs, gap del grid en móvil, esquinas de lecturas |
| 6 | 24px | Padding horizontal de página, gap del grid en desktop, gap del bloque de acceso |
| 8 | 32px | Padding vertical del grid, lateral del bloque de acceso |
| 12 / 16 | 48 / 64px | Padding de la columna de texto en la ficha (desktop) |
| 24 | 96px | Estados vacíos y de carga |

### Border Radius

| Element | Value |
|---------|-------|
| Todo | `0` (`--radius: 0rem`) |

Sin excepciones. `src/components/ui/button.tsx` (shadcn) trae `rounded-lg` y compila a `0.5rem` porque `--radius-lg` no está redefinido; hoy no lo importa ningún componente. No usarlo sin quitarle el radio.

### Shadows

Ninguna. La elevación es un borde de 1px (`--color-border`) o un cambio de fondo a `--color-surface`.

### Layout

- **Page padding:** 24px horizontal (`px-6`)
- **Cabecera:** sticky, 53px de alto (`py-3` + borde), la barra de categorías se pega justo debajo (`top-[53px]`)
- **Grid de productos:** 2 columnas → 3 (`sm`) → 4 (`lg`), gap 16px → 24px
- **Ficha de producto:** dos mitades a partir de `lg`; imagen a sangre a la izquierda, texto centrado verticalmente a la derecha con `max-w-sm` en la descripción
- **Formularios:** bloques estrechos centrados, `max-w-xs` (admin) o `max-w-sm` (puerta)
- **Admin:** sidebar fija de 224px (`w-56`) en desktop, drawer de 256px en móvil

## Components

### Access Gate
**Role:** Primera pantalla y filtro de la marca

Pantalla completa en `#04009c` con grano. Cuatro zonas: lecturas de sistema en las esquinas superiores (IBM Plex Mono 10px, `amber/60`, p. ej. `// SYS.INIT`, `COORD: 40.4168° N 3.7038° W`, `STATUS: LOCKED`), el caballo como icono, `04009c` en cyGrotesk 48-60px, y debajo el input de código y el botón. Pie con borde `off-white/10`, enlaces a suscripción, Instagram y el toggle de audio. Hay audio ambiente en bucle.

### Access Code Input
**Role:** El único campo de la puerta

Fondo transparente, borde 1px ámbar, texto off-white IBM Plex Mono 14px centrado con `tracking-[0.3em]`, placeholder `amber/40`, 12px 16px de padding. En foco el borde pasa a off-white. Sin radio.

### Primary Button
**Role:** Acción principal (entrar, guardar, acceder)

Fondo off-white `#E2E2E2`, texto `#04009c` en la puerta o `#080808` en el admin, IBM Plex Mono 14px uppercase `tracking-widest`, 12px de padding vertical, ancho completo en formularios. Hover: fondo ámbar. Disabled: opacidad 40%.

### Amber Outline Button
**Role:** Acción secundaria con peso (nuevo producto, exportar)

Transparente, borde 1px ámbar, texto ámbar IBM Plex Mono 11px uppercase `tracking-widest`, 8px 16px. Hover: se rellena de ámbar con texto negro.

### Ghost Button
**Role:** Acción terciaria (cancelar)

Transparente, borde 1px `--color-border`, texto dim IBM Plex Mono 11px uppercase. Hover: texto off-white.

### Text Action
**Role:** Navegación y acciones de bajo peso (volver, cerrar sesión, modo claro/oscuro)

Sin fondo ni borde. IBM Plex Mono 10-11px uppercase `tracking-widest`, color dim u `off-white/40`. Hover: off-white para navegar, ámbar para ajustes, rojo para cerrar sesión.

### Data Label
**Role:** El sello del sistema

Clase `.data-label`: IBM Plex Mono 0.65rem, `letter-spacing: 0.12em`, uppercase, ámbar. Marca categoría, referencia y títulos de campo. Suele ir con prefijo `//`.

### System Readout
**Role:** Textura narrativa en las esquinas

Bloques de 2-6 líneas en IBM Plex Mono 10px, `amber/40-60`, `leading-relaxed`, posicionados absolutos a 16px de las esquinas y con `pointer-events: none`. Formato `CLAVE: VALOR` en mayúsculas (`FILE`, `STATUS`, `REF`, `EST: MMXXIV`). No son datos reales: son decorado de sistema, y por eso son lo único ámbar que puede ser inventado.

### Store Header
**Role:** Navegación global de la tienda

Sticky, fondo `--theme-bg`, borde inferior 1px, 12px 24px de padding. Izquierda: caballo + `04009c` en cyGrotesk 20px. Derecha: toggle de tema (`off-white/50`, hover ámbar), Instagram, y `SALIR` (IBM Plex Mono 10px dim, hover rojo). Transición de fondo de 300ms al cambiar de tema.

### Category Tabs
**Role:** Filtro del catálogo

Barra sticky bajo la cabecera, scroll horizontal en móvil. Cada pestaña: IBM Plex Mono 11px uppercase `tracking-widest`, 12px 16px de padding. La activa lleva una barra ámbar de 2px pegada al borde inferior. Categorías fijas en el código: `ALL, NUEVOS, HOODIES, CAMISETAS, TOPS, PANTALONES, ACCESORIOS, CHAQUETAS`.

### Product Card
**Role:** Unidad del catálogo

Imagen 3:4 sobre `--color-surface` con borde 1px que pasa a ámbar en hover (300ms). Hover cambia a la segunda imagen. Sin imagen: caballo al 10% con grano y `NO IMAGE` a 9px. Ref en la esquina inferior izquierda (9px, `amber/50`). Debajo: `data-label` de categoría, nombre en Bebas Neue 16px y precio en IBM Plex Mono 14px ámbar.

### Sold Out Stamp
**Role:** Estado AGOTADO

Velo `black/70` sobre la imagen y, centrado, la palabra en IBM Plex Mono 11px (13px en la ficha) rojo, con borde 1px rojo y 4px 12px de padding. Parece un sello, no una etiqueta.

### Product Detail
**Role:** Ficha de producto

Barra superior con `← VOLVER`, marca y ref. Imagen a media pantalla con View Transition (`product-image`) que morfea desde la card. Columna de texto: `data-label`, nombre en Bebas Neue 36-48px, precio ámbar 20px, descripción DM Sans 14px dim, y una ficha técnica separada por borde superior con pares `data-label` + valor en 12px. El CTA de compra es un placeholder a la espera de Stripe.

### Admin Shell
**Role:** Panel de gestión

Sidebar de 224px con marca (cyGrotesk 14px + subtítulo 9px ámbar), navegación con indicador activo de 2px ámbar a la izquierda, y abajo el toggle de tema y cerrar sesión. En móvil, barra superior fija de 53px y drawer con velo `black/60`. Paneles y tablas en `--color-surface` con borde 1px; inputs en `#080808` con borde 1px que pasa a ámbar en foco.

## Do's and Don'ts

### Do
- Usa IBM Plex Mono en mayúsculas con tracking amplio para cualquier texto de interfaz
- Reserva el ámbar para lo que dice el sistema: labels, refs, precios, estados, foco, activo
- Usa el rojo solo para errores, AGOTADO y acciones destructivas o de salida
- Separa con bordes de 1px de `--color-border`; eleva cambiando a `--color-surface`
- Usa `#E2E2E2` para texto y rellenos claros, y `#080808` para negro
- Mantén las lecturas de sistema en las esquinas y el contenido en el centro
- Usa los tokens semánticos (`bg-surface`, `border-border`, `--theme-bg`) para que el modo azul funcione solo
- Transiciones cortas de color (200-300ms) y View Transitions para ir de card a ficha

### Don't
- Nunca uses border-radius, ni siquiera 2px
- Nunca uses sombras, ni para elevar ni para dar foco
- Nunca uses colores por defecto de Tailwind (`white`, `gray-*`, `blue-*`, `red-*`): hoy queda un `bg-white/5` que habría que cambiar
- Nunca uses ámbar como adorno ni para bloques grandes de color
- Nunca escribas otra palabra en cyGrotesk que no sea `04009c`
- Nunca uses DM Sans para UI ni IBM Plex Mono para párrafos largos
- Nunca pongas hex sueltos en componentes si existe el token (hoy solo hay en las tres gráficas del admin, 23 en total, porque Recharts pide colores como texto)
- Nunca uses `#04009c` como acento pequeño: es un fondo o una firma

## Surfaces

| Level | Name | Dark | Light (azul) | Purpose |
|-------|------|------|--------------|---------|
| 0 | Canvas | `#080808` | `#04009c` | Fondo de página |
| 1 | Surface | `#1A1A1A` | `rgba(0,0,80,0.35)` | Cards, paneles, inputs del admin |
| 2 | Veil | `black/60-70` | `black/60-70` | Velos sobre imagen (AGOTADO) y tras el drawer |
| — | Gate | `#04009c` | `#04009c` | La puerta y `/about` son siempre azules, sin importar el tema |

## Elevation

- **Card / Panel:** `border: 1px solid var(--color-border)` sobre `--color-surface`
- **Card en hover:** el borde pasa a `--color-amber`
- **Foco:** el borde pasa a ámbar (admin) u off-white (puerta); nunca ring ni sombra

## Textures

Dos capas, siempre sutiles:
- **Scan lines** en `body::before`: gradiente repetido de 2px transparente / 2px `rgba(0,0,0,0.03)`, fijo, por encima de todo (`z-index: 9999`) y sin eventos.
- **Grain** con la clase `.grain`: ruido SVG `feTurbulence` al 4% de opacidad en un `::after`. Se usa en la puerta, el login del admin y los huecos sin imagen.

## Imagery

- **Producto:** fotos en 3:4, `object-cover`, a sangre dentro de la card; la segunda imagen aparece en hover. Hoy la base local no tiene imágenes y la subida (Cloudinary o S3) está pendiente.
- **Marca:** un caballo en silueta (`caballo_blanco.png`, `caballo_negro.png`) como icono de la puerta, cabecera y placeholder. En la puerta, pulsarlo lleva a `/about`.
- **Nada más:** sin ilustración, sin 3D, sin gradientes de color. La referencia visual es un escáner corporal retro y un menú de VCR azul.

## Layout

Página a ancho completo con 24px de margen lateral, sin contenedor máximo en la tienda. Arriba, cabecera sticky y barra de categorías sticky; debajo, el grid. La ficha rompe a dos mitades en desktop. La puerta, el login y el manifiesto son composiciones centradas a pantalla completa con decorado de sistema en las esquinas. El admin es una aplicación de dos columnas (sidebar + contenido) que en móvil pasa a barra superior + drawer.

## Agent Prompt Guide

**Quick Color Reference**
- Background: `#080808` (dark) / `#04009c` (light y puerta)
- Text: `#E2E2E2`
- Secondary text: `#6B6B6B`
- Border: `#2A2A2A`
- System accent: `#F0A500`
- Alarm: `#FF0000`
- Primary action: fondo `#E2E2E2`, hover `#F0A500`

**Example Component Prompts**

1. Crea un bloque de acceso: fondo `#04009c` a pantalla completa con grano al 4%. Centrado, `04009c` en cyGrotesk 60px `tracking-widest` color `#E2E2E2`. Debajo, un `data-label` ámbar `// INTRODUCE EL CÓDIGO DE ACCESO`, un input transparente con borde 1px `#F0A500`, texto IBM Plex Mono 14px centrado con `letter-spacing: 0.3em`, y un botón de ancho completo con fondo `#E2E2E2`, texto `#04009c` IBM Plex Mono 14px uppercase, hover fondo `#F0A500`. Sin radio en nada.

2. Crea una card de producto: contenedor 3:4 con fondo `#1A1A1A` y borde 1px `#2A2A2A` que pasa a `#F0A500` en hover en 300ms. Debajo, label de categoría IBM Plex Mono 10.4px ámbar `letter-spacing: 0.12em` uppercase, nombre en Bebas Neue 16px `#E2E2E2` `tracking-wider`, precio en IBM Plex Mono 14px `#F0A500`.

3. Crea una lectura de sistema: bloque absoluto a 16px de la esquina superior izquierda, IBM Plex Mono 10px, color `#F0A500` al 60%, `line-height: 1.625`, líneas `// SYS.INIT`, `FILE: ACCESS_GATE`, `STATUS: LOCKED`. Sin eventos de puntero.

4. Crea un sello de agotado: velo `rgba(8,8,8,0.7)` sobre la imagen y, centrada, la palabra `AGOTADO` en IBM Plex Mono 11px `#FF0000` `tracking-widest`, con borde 1px `#FF0000` y padding 4px 12px.

5. Crea una barra de categorías: sticky bajo una cabecera de 53px, fondo `--theme-bg`, borde inferior 1px `#2A2A2A`, scroll horizontal. Pestañas en IBM Plex Mono 11px uppercase `tracking-widest`, padding 12px 16px; la activa en `#E2E2E2` con una barra de 2px `#F0A500` en el borde inferior, las demás en `#6B6B6B`.

## Typographic Discipline

Cuatro familias, cada una con un trabajo y solo uno. cyGrotesk escribe `04009c` y nada más. IBM Plex Mono lleva toda la interfaz, siempre en mayúsculas y con tracking abierto, y baja hasta 9-10px en las lecturas de sistema sin perder legibilidad porque el contraste lo pone el color, no el tamaño. Bebas Neue da nombre a las prendas: es lo único que se lee como una revista. DM Sans aparece solo cuando hay que leer una frase entera. Los tamaños de interfaz son casi todos 10, 11 y 14px; lo grande está reservado para la marca y el nombre del producto.

## The Amber Protocol

El ámbar es la voz de la máquina. Todo lo que la interfaz "informa" sobre sí misma va en ámbar: la categoría, la referencia, el precio, el estado, el campo con foco, la pestaña activa, la card bajo el cursor. Por eso funciona: si algo es ámbar, es un dato. Usarlo como decoración (un fondo, un titular, un icono de adorno) rompe el código. Las lecturas de esquina son la única licencia: son datos de ficción, pero siguen siendo "sistema".

## Similar Brands

Interpretación, no fuente:
- **dameapresparis.com** — Referencia explícita del proyecto: estructura de grid, hover que cambia la imagen, categorías sticky
- **Menús de VCR y escáneres corporales retro** — Referencia explícita de la estética: fondo azul, texto bitmap blanco en mayúsculas, datos en ámbar alrededor de una figura central

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Marca (fijos) */
  --color-brand-blue: #04009c;
  --color-brand-red:  #FF0000;
  --color-amber:      #F0A500;
  --color-black:      #080808;
  --color-off-white:  #E2E2E2;
  --color-dim:        #6B6B6B;

  /* Tema dark (por defecto) */
  --theme-bg:      #080808;
  --theme-surface: #1A1A1A;
  --theme-border:  #2A2A2A;

  /* Tipografía */
  --font-brand:    "cyGrotesk", monospace;
  --font-terminal: "IBM Plex Mono", monospace;
  --font-display:  "Bebas Neue", sans-serif;
  --font-body:     "DM Sans", sans-serif;

  /* Forma */
  --radius: 0rem;
}

/* Tema light: el azul de marca */
:root:not(.dark) {
  --theme-bg:      #04009c;
  --theme-surface: rgba(0, 0, 80, 0.35);
  --theme-border:  rgba(255, 255, 255, 0.15);
}

.data-label {
  font-family: var(--font-terminal);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-amber);
}
```

### Tailwind v4

Los tokens viven en `src/app/globals.css` con `@theme inline` (no hay `tailwind.config.js`):

```css
@theme inline {
  --color-brand-blue: #04009c;
  --color-brand-red:  #FF0000;
  --color-amber:      #F0A500;
  --color-black:      #080808;
  --color-off-white:  #E2E2E2;
  --color-dim:        #6B6B6B;

  --color-bg:      var(--theme-bg);
  --color-surface: var(--theme-surface);
  --color-border:  var(--theme-border);

  --radius: 0rem;

  --font-brand:    "cyGrotesk", monospace;
  --font-terminal: "IBM Plex Mono", monospace;
  --font-display:  "Bebas Neue", sans-serif;
  --font-body:     "DM Sans", sans-serif;
}
```

Las fuentes de Google se cargan con `next/font` en `src/app/layout.tsx` (IBM Plex Mono 400/500/700, Bebas Neue 400, DM Sans 300/400/500) y cyGrotesk con `@font-face` local.

## Desviaciones encontradas al medir

Para pulir, no para copiar:
- `components/ui/button.tsx` (shadcn) lleva `rounded-lg` = 0.5rem. No se usa en ningún sitio.
- Un `bg-white/5` (color por defecto de Tailwind) fuera de tokens.
- 23 hex escritos a mano en `components/admin/charts/` (Recharts recibe colores como texto). Podrían leer los tokens con `getComputedStyle` o una constante compartida.
- Tamaños sueltos fuera de la escala: `text-xs` (4), `text-lg` (4) y `text-[0.8rem]` (1) aparecen poco y sin patrón claro.
- Las categorías están fijas en `CategoryNav.tsx` en vez de salir de los productos o del admin.
