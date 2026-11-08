# Estado de remediación — 2026-11-08

- Pasada local desde `66f0cec`, código final `0bfa40b`, sin push. [Handover](handovers-archive/HANDOVER-2026-11-08-cierre-hallazgos-local.md).
- 35 IDs existentes arreglados (12 MEDIA + 23 BAJA); 3 abiertos: ALTA 2026-11-08-001 y BAJA 042/044. Evidencia acumulativa en `/opt/data/audit/security/04009c/remediation-2026-11-08/`.
- tsc verde; tests 23/23; lint 20 errores/2 avisos previos, cotejados con baseline; único build bloqueado por Google Fonts sin red. No afirmar build verde ni despliegue verificado.
- Hook compartido `lib/a11y/useFocusTrap.ts`: entrada, trap, retorno y scroll. `lib/a11y/radio.ts`: flechas, Home/End, roving tabindex en consumidores.
- Nuevos tokens secundarios: oscuro #888888 (5,65:1) y azul #999999 (4,96:1). Rojo pequeño sobre azul (3,54:1) sigue siendo decisión de Manuel.
- Limitador de login por proceso con IP y par IP/identidad, 429/Retry-After y ventana deslizante. Proxy debe sobrescribir cabecera IP; véase [documentación](../docs/limite-login.md).
- @types/mongoose, @types/bcryptjs y lucide-react retirados de manifiesto y lock sin instalaciones. [Scripts y duplicados](../docs/dependencias-locales-2026-11-08.md).
- Esta pasada no reemplaza una auditoría completa ni la revisión visual de Manuel.
