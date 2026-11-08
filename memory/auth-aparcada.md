# Autenticación aparcada (2026-11-08)

La web pasa a ser **pública**: se enseña como maqueta completa, sin clave de acceso.
La autenticación no se borra: se aparca para cuando vuelva con **better-auth**.

## Qué había antes

| Zona | Antes | Ahora |
|---|---|---|
| `/` (portada) | Campo de contraseña (bcrypt contra el documento `Login`) | Número `04009c` pulsable → botón **ACCEDER** → `/store` |
| `/store`, `/api/products` | Cookie `member_token` (JWT con `JWT_SECRET_MEMBER`) | Abiertos, sin sesión |
| `/admin` | Cookie `admin_token` (JWT con `JWT_SECRET_ADMIN`) | Abierto, vista de prueba de solo lectura |
| `/admin/login` | Formulario de usuario y contraseña de admin | No existe |

## Dónde está el código

Todo lo de la sesión está en `legacy/auth/` (fuera de `src/`, no se compila ni se
lintéa, y no entra en el build):

```
legacy/auth/
├── api-auth/login/route.ts          → POST /api/auth/login (cookie member_token)
├── api-auth/logout/route.ts         → POST /api/auth/logout
├── api-auth/admin-login/route.ts    → POST /api/auth/admin-login (cookie admin_token)
├── api-auth/admin-logout/route.ts   → POST /api/auth/admin-logout
├── admin-guard.ts                   → requireAdmin() de /api/admin/*
├── member-guard.ts                  → requireMemberSession() de /api/products
├── admin-login-page/page.tsx        → /admin/login
├── AdminLogin.tsx                   → componente del formulario de admin
└── admin-login-accesibilidad.test.mjs → test de accesibilidad del login (ya no aplica)
```

En `src/lib/auth/` se conserva lo que no tiene cookies y sigue siendo útil:
`jwt.ts` (firmar y verificar tokens), `rate-limit.ts` (límite de intentos) y
`session-version.ts` (revocar sesiones al rotar credenciales). Los modelos
`Login` y `Admin` también siguen en `src/lib/models/`.

`src/proxy.ts` sigue existiendo con el `matcher` intacto y devuelve
`NextResponse.next()`: es el sitio donde vuelve better-auth.

## Cómo vuelve

1. Instalar better-auth y sus variables de entorno.
2. Traer de `legacy/auth/` la lógica de sesión al modelo de better-auth
   (la de cookies `member_token` / `admin_token` no vuelve: better-auth gestiona
   las suyas).
3. Volver a proteger `/store`, `/api/products`, `/admin` y `/api/admin` en
   `src/proxy.ts` o con los helpers de better-auth.
4. `JWT_SECRET_MEMBER` y `JWT_SECRET_ADMIN` son las variables del esquema viejo:
   dejan de usarse en 2026-11 y el README las marca como «sin uso».

## Variables de entorno sin uso desde 2026-11

`JWT_SECRET_MEMBER` y `JWT_SECRET_ADMIN` siguen en el `.env.local` de producción
pero la web ya no las lee. No se borran: vuelven con better-auth.

## La maqueta sin secretos: `npm run demo`

No hay URI de Atlas y no se va a pedir (Manuel no la saca de Vercel para una
maqueta). La tienda se ve entera con un **Mongo en memoria**:

```
npm run demo   →  http://100.79.99.13:3006
```

`scripts/demo.mjs` hace cuatro cosas:

1. levanta un Mongo en memoria (`dbName: "demo"`),
2. siembra **desde `src/lib/demo-data.ts`**, el mismo fichero que usa el panel
   (las dos partes cuentan la misma historia),
3. arranca Next en el puerto 3006 con `0.0.0.0` y `MONGODB_URI` apuntando a ese
   Mongo efímero,
4. al cerrar (Ctrl+C o SIGTERM) mata el servidor y para el Mongo.

La siembra es **idempotente**: busca por la clave natural (nombre de categoría,
slug de producto) y actualiza; correrla dos veces no duplica nada.
`scripts/demo-idempotencia.mjs` lo comprueba sembrando tres veces seguidas.

`mongodb-memory-server` es **devDependency**: nunca en producción. El binario que
descarga vive en la caché de `node_modules` y está en `.gitignore`.

**Sin fallback silencioso en producción**: si no hay `MONGODB_URI`, la app falla
al arrancar, como antes. Que producción enseñara datos falsos por un fallo de
conexión sería peor que un error. Los datos de ejemplo entran solo por el
script de demo.

## Nota sobre datos

El panel de administración es una vista de prueba: `/admin/*` se alimenta de
`src/lib/demo-data.ts`, con datos **inventados** (correos con dominio de ejemplo,
nombres y direcciones ficticios). En producción hay suscriptores y pedidos con
datos personales, y exponerlos en una maqueta pública sería un problema de
protección de datos, no de diseño. El bloqueo de escrituras va en los dos lados:
en cliente no hay botones de añadir, editar, borrar ni guardar, y en servidor
`/api/admin/*` solo admite `GET` (el resto responde `405`).
