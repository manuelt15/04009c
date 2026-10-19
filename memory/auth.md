# Auth — 04009c

## Flujo miembro
1. El usuario introduce el código en la entrada
2. `/api/auth/login` valida contra MongoDB (bcrypt) y pone la cookie httpOnly `member_token` (7 días)
3. Acceso a `/store` y a `/api/products`

## Flujo admin
1. Credenciales propias en `/admin/login` (VOLVER lleva a `?from=`, solo rutas internas)
2. `/api/auth/admin-login` devuelve JWT admin (8 h) con `sub` = id del admin (desde 2026-09-27)
3. Cambiar credenciales busca al admin por `sub`, no por el usuario nuevo. Sesiones sin `sub`
   (anteriores al cambio) tienen que volver a entrar

## Qué protege el proxy (`src/proxy.ts`)
- `/store/*` → sin sesión de miembro redirige a `/`
- `/api/products/*` → sin sesión de miembro, 401 JSON
- `/admin/*` y `/api/admin/*` → sesión de admin, y además `requireAdmin()` en cada handler
- Públicas a propósito: `/api/categories`, `/api/store-settings` (sin datos sensibles), `/api/subscribe`

## Reglas
- JWT miembro y admin completamente independientes, siempre en cookies httpOnly
- La barra lateral del panel no se renderiza en `/admin/login` (comparte layout)
