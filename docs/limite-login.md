# Limitación local de login (04009c-2026-11-07-046)

Ambas rutas (`/api/auth/login` y `/api/auth/admin-login`) consumen el límite antes de MongoDB y bcrypt. Máximo 10 intentos por IP y por par IP/identidad en una ventana deslizante de 15 minutos. Los intentos correctos también cuentan; no se reinicia la cuota al cambiar de usuario. En el gate la identidad es constante (`gate`), nunca la contraseña.

La respuesta de exceso es HTTP 429 con `Retry-After` en segundos y `Cache-Control: no-store`. La memoria tiene como máximo 10.000 claves; al saturarse, rechaza nuevas claves hasta que expiren las antiguas. No hay timers ni tareas en segundo plano. La identidad se guarda como SHA-256, sin contraseñas ni cuerpos de solicitudes.

## Límites de despliegue

- **Por proceso/instancia**, no distribuido. Reiniciar o escalar crea cuotas independientes. Para protección entre instancias se necesita un contador compartido o regla en el proxy/WAF; no se ha configurado infraestructura ni producción.
- La IP se obtiene del primer valor de `x-forwarded-for`, validado como IP. El proxy de entrada debe **sobrescribir** esa cabecera y bloquear el acceso directo al proceso. Una cabecera reenviada sin sanear permite falsear la IP. Se debe verificar esta configuración antes de desplegar; no se han sondeado servicios externos.
- Sin IP válida se usa una cuota común `unknown` (fallo cerrado), que puede afectar a varios clientes del mismo proxy.
- Los clientes tras NAT comparten cuota. Los valores 10/15 minutos son configuraciones técnicas locales, ajustables tras observación autorizada.

Pruebas locales sin servidores: expiración exacta y deslizante, rotación de identidad, separación de IP y zonas, saturación de memoria y respuesta 429 real de NextResponse.
