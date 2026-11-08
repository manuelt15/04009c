# Cierre de hallazgos 04009C — 2026-11-08

## Resultado

Pasada manual de ARREGLO desde `66f0cec`, no auditoría nueva. Se cerraron en el registro 35 hallazgos existentes: 12 MEDIA (007–018) y 23 BAJA. Quedan abiertos ALTA `04009c-2026-11-08-001` y BAJA `04009c-2026-11-07-042` / `044`.

Código final de la pasada: `0bfa40b`. Todos los cambios son locales en main, sin push, despliegue, servidores, instalaciones ni descargas. No se tocaron README, .env ni historia del ALTA.

## Cambios y commits

- Contraste secundario por tema: `9eba3bb` (007) y `47399e1` (008). WCAG: #888888 sobre #080808 = 5,64965:1; #999999 sobre #04009c = 4,96285:1.
- Labels/campos y selector nativo: `951f376` (009), `76345d1` (010), `44403c2` (011: gatePassword enmascarado).
- Foco, diálogo modal, bloqueo de scroll y retorno: `746aaf5` (012, hook compartido), `c47a017` (013, cancelar por defecto), `8744321` (015), `e90cbc2` (016), `f62f7d4` (018). Ajuste del doble DOM del test: `2defff6` (012).
- Estado de categoría y validación con error asociado/foco: `0f8b0d5` (014), `62b3945` (017, checkout y suscripción).
- BAJA de accesibilidad: un commit por ID, del `1fa4826` (002) al `83910fb` (040). Incluye enlaces de productos, metadata por ruta, h1, tablas, labels por fila, avisos, carga, opacidad, foco visible y radios con flechas/roving tabindex.
- Dependencias: `b99b299` documenta scripts (041), `cb7b137` documenta 042 sin cerrarlo, `419bcb7` retira tipos redundantes (043), `2e210cf` retira lucide-react sin imports (045). Manifiesto y lock concordantes; no se reinstaló node_modules.
- Rate limit en ambos logins: `0bfa40b` (046). 10 intentos / ventana deslizante de 15 min; IP y par IP/identidad; 429 + Retry-After; memoria acotada a 10.000 claves. Véase [límite de login](../../docs/limite-login.md).

## Verificación real

Autorización expresa para cadena técnica local, sin sandbox de auditoría ni sondeos externos.

- Tras MEDIA: `npx --no-install tsc --noEmit` exit 0; `npm test` 16/16. Lint inicial 21 errores / 2 avisos: se corrigió el único error nuevo del doble DOM del test.
- Tras BAJA y cierre: `npx --no-install tsc --noEmit` exit 0; `npm test` 23/23.
- `npm run lint` exit 1: 20 errores / 2 avisos. Comparación con ESLint sobre `git show 66f0cec:<fichero>` frente al actual: mismo número y mismas reglas por fichero, sin regresiones. No se tocó lo ajeno al alcance.
- ÚNICO `npm run build -- --webpack`: exit 1, no OOM. `next/font` intenta descargar IBM Plex Mono, Bebas Neue y DM Sans de Google; el guard local que bloquea sockets rechaza la red. No se usaron respuestas falsas, no se cambiaron fuentes, no se reintentó el build.
- Build con URI Mongo local/dummy, secretos dummy, correo vacío y telemetría desactivada. No hay `.next/BUILD_ID` tras ese intento: no existe build nuevo servido/verificado.
- `python3 /opt/data/scripts/procesos-abiertos.py`: puertos limpios, sin procesos de trabajo.

## Registro y evidencia

Informe con tabla completa ID → fichero:línea actual → SHA, logs y JSON:
`/opt/data/audit/security/04009c/remediation-2026-11-08/REPORT.md`.

Registro `/opt/data/audit/registro.jsonl` actualizado solo mediante `hallazgos.py update --estado arreglado --commit <sha>`. Relectura exacta de cada estado/commit: 35 cierres y 3 residuales. `findings.json` y `coverage-ledger.json` son artefactos de remediación con validación local de coherencia; NO se presentan como auditoría Cloudflare de seis fases ni como verificación independiente.

## Pendiente y dueño

- Manuel: ALTA histórico JWT y rotación; ni README ni historia tocados aquí.
- Manuel: rojo de marca sobre azul sigue 3,53617:1 para texto pequeño; el arreglo de 008 solo cambia el texto secundario. Decidir tratamiento sin alterar marca unilateralmente.
- 042: PostCSS ya era 8.5.23 en todo el árbol, no 8.4.31. Quedan 42 nombres con versiones divergentes, varios con majors incompatibles. Consolidación requiere resolución de dependencias autorizada.
- 044: actualizaciones de paquetes necesitan red autorizada; no se consultaron versiones ni se subieron.
- Manuel: desbloquear build de fuentes con activos locales o red en entorno autorizado; no dar por verde este build.
- Antes de desplegar 046: confirmar que el proxy SOBRESCRIBE x-forwarded-for y bloquea el acceso directo. Limitador por proceso; contador compartido/WAF para varias instancias queda fuera.
- Manuel: revisión visual/teclado real. Agente no inició navegador ni preview.

Todo en local, esperando OK; el padre ejecuta cualquier push solo tras aprobación de Manuel.
