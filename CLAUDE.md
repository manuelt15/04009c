@AGENTS.md

# 04009c — Moya Project

## Al iniciar cada sesión — leer SIEMPRE primero
- `~/Desktop/moya/moya-memory/MEMORY.md`
- `~/Desktop/moya/moya-memory/design-system.md`
- `~/Desktop/moya/moya-memory/architecture.md`
- `~/Desktop/moya/moya-memory/lessons.md`

## Al cerrar cada sesión
1. Actualizar topic file relevante en `moya-memory/`
2. Actualizar `moya-memory/lessons.md` con errores y fixes
3. Actualizar `moya-memory/MEMORY.md` — estado actual y próximo paso

## Stack
- Next.js 16 + TypeScript
- Tailwind CSS v4
- shadcn/ui (componentes base, sin estilos por defecto)
- Framer Motion
- MongoDB + Mongoose
- JWT (miembro y admin separados)

## Estructura
```
src/
├── app/(gate)/          ← Página de contraseña (pública)
├── app/(store)/         ← Zona miembro (requiere JWT miembro)
├── app/admin/           ← Dashboard admin (requiere JWT admin)
├── app/api/             ← API routes
├── components/gate/
├── components/store/
├── components/admin/
├── components/shared/
├── components/ui/       ← shadcn
├── lib/auth/
├── lib/db/
└── lib/models/
```

## Reglas del design system
- NUNCA usar colores por defecto de Tailwind (blue-, red-, gray-...)
- SOLO usar tokens definidos: brand-blue, brand-red, amber, black, off-white, surface, border, dim
- NUNCA border-radius — esquinas siempre cuadradas (--radius: 0)
- Amber (#F0A500) solo para datos de sistema, labels, bordes de escáner
- cyGrotesk exclusivamente para el nombre de marca `04009c`
- IBM Plex Mono para UI, datos, labels, navegación
- Bebas Neue para títulos de sección
- DM Sans para cuerpo y descripciones

## Reglas TypeScript
- Sin `any` — tipar siempre correctamente
- Interfaces para modelos de datos, types para uniones y props
- Imports con alias `@/`

## Reglas Auth
- JWT miembro y admin completamente separados
- httpOnly cookies — nunca localStorage para tokens
- Middleware Next.js para proteger rutas (store y admin)

## Reglas generales
- No añadir co-author Claude en ningún commit
- Pensar antes de codificar. Si hay duda, preguntar.
- Mínimo código que resuelve el problema.
- Nunca marcar tarea como completada sin verificar visualmente.
