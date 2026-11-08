# Autenticación (retirada el 2026-11-08)

La web pasó a ser **pública**: se enseña como maqueta completa, sin clave de acceso.
El código de autenticación con JWT se **retiró** en esa misma tanda, no se aparcó:
seguía citando `JWT_SECRET_MEMBER` y `JWT_SECRET_ADMIN` dentro de `src/`, y esos dos
secretos estuvieron publicados en el README en 2026-05, así que conservarlo era
mantener vivo un cabo suelto sin uso.

Vuelve con **better-auth**, que gestiona sus propias sesiones y su propio secreto.
Del esquema viejo **no se reutiliza nada**.

## Qué había antes y qué hay ahora

| Zona | Antes | Ahora |
|---|---|---|
| `/` (portada) | Campo de contraseña (bcrypt contra el documento `Login`) | Número `04009c` pulsable → botón **ACCEDER** → `/store` |
| `/store`, `/api/products` | Cookie `member_token` (JWT con `JWT_SECRET_MEMBER`) | Abiertos, sin sesión |
| `/admin` | Cookie `admin_token` (JWT con `JWT_SECRET_ADMIN`) | Abierto, vista de prueba de solo lectura |
| `/admin/login` | Formulario de usuario y contraseña de admin | No existe |
| `/subscribe` | Formulario de solicitud con validación y correo | Aviso «próximamente», sin campos ni envío |

## Qué se retiró exactamente

- `src/proxy.ts`: fuera las dos ramas de verificación. El fichero se queda con
  `proxy()` devolviendo `NextResponse.next()` y el `matcher` intacto: es donde vuelve
  better-auth.
- Rutas `api/auth/{login,logout,admin-login,admin-logout}`.
- `src/lib/auth/{jwt,rate-limit,session-version}.ts` y los guards de miembro y admin.
- Componente `AdminLogin` y la página `/admin/login`.
- Los tests que cubrían ese código (`sesiones`, `rate-limit`, accesibilidad del login):
  sin sujeto que probar, se van con él. El total pasó de 25 a 15 y siguen en verde.

Todo sigue en el historial de git, antes del commit `cb52410`.

## Variables de entorno

`JWT_SECRET_MEMBER` y `JWT_SECRET_ADMIN` **ya no existen en producción ni en el código**:
se borraron de Vercel al desmontar los dos accesos. Cualquier valor antiguo que alguien
tenga en su poder ya no abre nada, porque no queda ninguna ruta que lo acepte.

## Cómo vuelve (better-auth)

1. Instalar better-auth y generar su secreto (`BETTER_AUTH_SECRET`).
2. Definir las tablas de usuario y sesión que pide better-auth.
3. Proteger `/store`, `/api/products` y `/admin` en `src/proxy.ts` o con sus helpers.
4. Añadir pruebas de sesión nuevas; no recuperar las viejas.

## La maqueta sin secretos: `npm run demo`

No hay URI de Atlas y no se va a pedir (Manuel no la saca de Vercel para una maqueta).
La tienda se ve entera con un **Mongo en memoria**:

```
npm run demo   →  http://100.79.99.13:3006
```

`scripts/demo.mjs` hace cinco cosas:

1. levanta un Mongo en memoria (`dbName: "demo"`),
2. siembra **desde `src/lib/demo-data.ts`**, el mismo fichero que usa el panel
   (las dos partes cuentan la misma historia),
3. **compila** la maqueta (`next build`),
4. la sirve compilada en el puerto 3006 con `0.0.0.0` y `MONGODB_URI` apuntando al
   Mongo efímero,
5. al cerrar (Ctrl+C o SIGTERM) mata el servidor y para el Mongo.

Compila, y no usa `next dev`, porque en este entorno **`next dev` (Turbopack) sirve la
página pero no hidrata**: React no engancha, todo lo que anima se queda en opacidad 0
y la portada sale vacía sin ningún error en consola. Compilada funciona igual que en
producción, que es lo que se quiere enseñar.

La siembra es **idempotente**: busca por la clave natural (nombre de categoría,
slug de producto) y actualiza; correrla dos veces no duplica nada.

`mongodb-memory-server` es **devDependency**: nunca en producción. El binario que
descarga vive en la caché de `node_modules` y está en `.gitignore`.

**Sin fallback silencioso en producción**: si no hay `MONGODB_URI`, la app falla
al arrancar. Que producción enseñara datos falsos por un fallo de conexión sería
peor que un error. Los datos de ejemplo entran solo por el script de demo.

## Datos del panel de prueba

`/admin/*` se alimenta de `src/lib/demo-data.ts`, con datos **inventados** (correos con
dominio de ejemplo, nombres y direcciones ficticios). En producción hay suscriptores y
pedidos con datos personales, y exponerlos en una maqueta pública sería un problema de
protección de datos, no de diseño. El bloqueo de escrituras va en los dos lados:
en cliente no hay botones de añadir, editar, borrar ni guardar, y en servidor
`/api/admin/*` solo admite `GET` (el resto responde `405`).
