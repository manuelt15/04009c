# Avisos de maqueta en tienda, ficha y pago — 2026-11-08

## Resultado

La web avisa en todos los sitios donde alguien podría creer que compra de verdad. Cuatro
avisos, cada uno en el sitio donde ocurre el gesto, no repetidos por la página entera:

| Dónde | Qué dice | Cómo se monta |
|---|---|---|
| Todas las páginas de `/store` | «Maqueta — productos y precios de ejemplo, no son reales» | `src/app/store/layout.tsx`, franja roja rellena como la del panel |
| `/store/checkout` | «Proceso de prueba — el pago solo muestra un ejemplo de cómo será; no se cobra ni se guarda ningún pedido» | Franja en contorno, debajo de la anterior, para que las dos lean como jerarquía |
| Ficha de producto, junto a las tallas | «Maqueta — talla y precio de ejemplo: se añade al carrito, pero no se compra nada» | `ProductDetail.tsx`, recuadro encima del selector de talla |
| `/admin/*` | «Vista de prueba — datos de ejemplo, no se puede modificar nada» | Ya existía, sin cambios |

Todas llevan `role="note"`, tipografía de terminal, mayúsculas y el rojo de la marca. La del
layout cubre catálogo, ficha y pago; las otras dos añaden el detalle donde el visitante ya está
interactuando.

## Commits

| Commit | Qué |
|---|---|
| `2bca50b` | Avisa en la tienda y en el pago de que es una maqueta: productos y precios de ejemplo |
| `1e41460` | Avisa junto a las tallas de que la talla y el precio son de ejemplo |

## Verificación

```
tsc --noEmit   0
npm test       15/15
GET /store, /store/[slug], /store/checkout   200, con sus avisos dentro del HTML
```

Comprobado en el navegador sobre el build de producción (`npm run demo`): las franjas se ven y
la del checkout queda bajo la del catálogo.

## Pendiente de decisión

En `/store/checkout` conviven **tres** avisos: la franja de maqueta, la del proceso de prueba y
el recuadro `// CHECKOUT DE EJEMPLO` que ya existía y dice casi lo mismo que el segundo.
Recomendación: quitar el recuadro. Manuel no lo ha decidido todavía.

## Nota para cuando vuelva better-auth

Los avisos de maqueta son temporales por definición: el día que la tienda venda de verdad, hay
que retirarlos todos. Están localizados en tres sitios (`store/layout.tsx`, `checkout/page.tsx`
y el bloque de tallas de `ProductDetail.tsx`), así que quitarlos es borrar tres bloques.
