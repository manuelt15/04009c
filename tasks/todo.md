# Mejoras del panel (2026-09-27)

Compatibilidad: todo campo nuevo tiene valor por defecto. Un producto sin tallas guardadas se
comporta como hasta ahora (todas las tallas, sin límite de stock). Categorías y ajustes se crean
solos la primera vez que se leen, con los valores actuales del código.

## 1. Tallas y stock por producto
- [x] Modelo `Product`: `sizes: [{ size, stock }]` (vacío = sin control de stock)
- [x] Helper `isSoldOut` compartido: agotado manual o todas las tallas a 0
- [x] Panel: casilla "gestionar stock por talla" + stock de S/M/L/XL (o talla única)
- [x] Ficha: tallas sin stock deshabilitadas, cantidad máxima = stock de la talla
- [x] Carrito: no deja superar el stock de cada línea
- Verificación: producto con M=0 no deja elegir M; con L=2 no deja pedir 3

## 3. Guía de medidas y envíos editables
- [x] Modelo `StoreSettings` (envíos + guías) con valores por defecto de `size-guide.ts` y `shipping.ts`
- [x] API pública de lectura y API de admin para guardar
- [x] Panel AJUSTES: editar envíos y tablas de medidas
- [x] Ficha y checkout leen de la base de datos
- Verificación: cambiar el precio del envío exprés en el panel y verlo en el checkout

## 4. Categorías gestionables
- [x] Modelo `Category` (nombre, orden, tipo de guía de medidas), sembrado con la lista actual
- [x] API pública + API de admin (crear, renombrar, reordenar, borrar si no tiene productos)
- [x] Tienda y panel leen las categorías de la base de datos
- Verificación: crear una categoría en el panel y verla en la barra de la tienda

## 5. Crear productos con menos trabajo
- [x] Slug automático desde el nombre, REF automática (siguiente número)
- [x] Tabla con miniatura, etiqueta NUEVO y resumen de stock
- [x] Confirmación de borrado con el estilo de la web en vez de `confirm()`
- Verificación: crear un producto rellenando solo nombre, precio y categoría

## 6. Pedidos listos para Stripe
- [x] Modelo `Order`: talla por artículo, dirección y teléfono, método de envío, historial de estados
- [x] Vista de detalle del pedido en el panel
- [x] Cambio de estado guarda historial y avisa
- Verificación: abrir un pedido, cambiar su estado y ver la entrada en el historial

## 2. Subir fotos (pendiente de decisión)
Necesita servicio de almacenamiento (Cloudinary o Vercel Blob) y una dependencia nueva.
