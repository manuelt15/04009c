# Verificación local de dependencias — 2026-11-08

## 04009c-2026-11-07-041 — scripts de instalación

Comprobación sin red ni instalación: `npm ls msw sharp unrs-resolver --all --omit=dev`.
La única coincidencia en producción es `next@16.4.5 → sharp@0.35.5`.

- `msw@2.14.6` sigue en el árbol de desarrollo por `shadcn@4.8.3`, no en producción. Conserva `postinstall` (importación del script de configuración de msw).
- `unrs-resolver@1.12.2` es de desarrollo, por `eslint-config-next → eslint-import-resolver-typescript`. Conserva `postinstall: node postinstall.js`.
- `sharp@0.35.5` no declara `preinstall`, `install` ni `postinstall`; tampoco `hasInstallScript` en el lock actual. El antiguo script ya no aplica a esta versión.

Se verificaron los campos `dev` y `hasInstallScript` del lock y los manifiestos locales. No se ejecutaron scripts de instalación. Mantener instalación de producción sin dependencias de desarrollo; cualquier nueva instalación requiere su revisión normal de cadena de suministro.

## 04009c-2026-11-07-042 — lock y duplicados (pendiente)

`npm ls postcss --all` muestra una única versión, `8.5.23`, compartida por Next, Tailwind y shadcn. `postcss@8.4.31` ya no existe en el lock actual: esa parte estaba resuelta antes de esta pasada.
El inventario del lock cuenta 42 nombres con versiones divergentes (incluye ramas con versiones mayores incompatibles, como ajv 6/8 y zod 3/4).
`npm cache ls postcss` no devuelve entradas. No se ha regenerado el lock: están prohibidos install/ci y no se han intentado descargas ni deduplicaciones manuales que falseen el grafo. La consolidación restante queda pendiente de una pasada con resolución de dependencias autorizada y pruebas.

