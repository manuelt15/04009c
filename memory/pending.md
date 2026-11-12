# Pendientes — 04009C

## Primitivas de UI: está en Base UI y la regla del toolkit pide Radix

Anotado el 2026-11-12, sin fecha de arreglo.

- **Estado actual**: shadcn montado sobre **Base UI** (`@base-ui/react ^1.5.0`). Hoy solo hay un
  componente que lo importe directamente (`components/ui/button`), así que la superficie es pequeña.
- **La regla**: el módulo de diseño del toolkit (`/opt/data/toolkit/modulos/diseno/MODULO.md`) fija
  `npx shadcn@latest init --base radix`, porque **el CLI de shadcn usa Base UI si no se le dice**.
  Es una regla del toolkit, no del proyecto.
- **Por qué importa**: si algún día se añaden componentes con `tk` o con el CLI, van a entrar con
  Radix y el proyecto se queda con **dos librerías de primitivas a la vez**.
- **Cómo se arregla**: rehacer `components.json` con `"style": "radix-nova"`, instalar Radix y
  sustituir los imports de `@base-ui/react/*`. Es cambio visual: lo revisa Manuel, como todo.
- **Cuándo**: cuando se toque el sistema de diseño, no antes. No es urgente y no rompe nada hoy.

Estado del resto de proyectos, para no repetir el análisis: **appointments** y **always-creating**
están en Radix; **conciliador-lab** y **gastos-app** están en Base UI como este.
