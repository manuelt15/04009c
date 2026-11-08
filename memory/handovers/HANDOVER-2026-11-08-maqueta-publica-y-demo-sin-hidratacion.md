# Handover 04009C — maqueta pública, portada `// ENTRAR` y `/subscribe` cerrado — 2026-11-08

## Resultado

Tanda de cierre sobre `main` ya pusheada por el padre (`49f8529..7f6f699`, 10 commits,
árbol limpio). Este handover documenta la tanda; no introduce cambios de código.

Lo que quedó firme:

- La web es **pública y sin clave**: no queda autenticación en el repo.
- La portada comunica la entrada con la pista **`// ENTRAR`**, en el estilo terminal
  auxiliar de la casa, encima del número `04009c`.
- `/subscribe` es un **aviso**, no un formulario.
- `npm run demo` **compila y sirve en producción**: el catálogo se ve con los 7 productos
  de ejemplo y el panel de prueba funciona.

## Cambios de la tanda

### Portada: la pista pasa a `// ENTRAR` (`5531ce7`)

Antes la pista sobre el número era «Pulsa los números». Se queda **`// ENTRAR`**:

- Mismo tratamiento que el resto de textos auxiliares: `font-terminal`, cuerpo pequeño,
  `tracking` amplio, color `brand-red`, prefijo `//` como el resto de la casa.
- El número `04009c` sigue siendo el **control real** (`aria-label="Entrar en la tienda"`).
  La pista es apoyo visual, no la etiqueta: al pulsarlo se reproduce la animación y
  aparece el botón **ACCEDER** → `/store`. Sin API, sin cookie, sin POST.

Por qué: «Pulsa los números» leía como instrucción y como pista de accesibilidad a la
vez, y la web ya no tiene nada que pulsar más que el número. `// ENTRAR` es una
etiqueta de zona, del mismo registro que `// PRÓXIMAMENTE` o `// CHECKOUT`, y no
promete un mecanismo que no existe.

### `/subscribe` sin formulario (`7438d52`)

El formulario de solicitud se desactivó. La página es ahora un aviso:

- `// PRÓXIMAMENTE`
- «Pronto tendrás más acceso. Estamos preparando la entrada y las solicitudes abrirán
  con la próxima temporada.»
- «MIENTRAS TANTO, LA COLECCIÓN ESTÁ ABIERTA.»

Sin campos, sin envío, sin toast. La API `POST /api/subscribe` **sigue existiendo**
pero ya nadie la llama: se conserva por si la funcionalidad vuelve, y porque
`src/lib/mailer.ts` y los modelos de suscriptor siguen en el repo.

Motivo: con la web abierta al público, pedir «acceso» no encaja con que la colección
ya está abierta. El aviso dice lo mismo con el tono de la marca.

### `npm run demo` compila y sirve en producción (`27fc510`)

El script cambió de `next dev` a **`next build` + `next start`** (misma URI de Mongo
en memoria, mismo puerto 3006, misma siembra idempotente, mismo apagado limpio).

Verificado por el padre: **6 de 6 elementos hidratados** y catálogo con los 7 productos
sembrados.

## El hallazgo: `next dev` (Turbopack) no hidrata en este entorno

**Síntoma.** La página se sirve bien pero no reacciona: el número se queda en
`style="opacity:0"` (el valor inicial de framer-motion) y nunca cambia, `/store` se
queda en «// CARGANDO...», y el clic en el número no navega.

**Evidencia medida (no supuesta).**

| Medida | Valor |
|---|---|
| Elementos con fiber de React | **0 de 13** (luego 0/82 en la portada completa) |
| `window.next.router` | existe → el runtime de Next sí carga |
| Recursos `_next` | 28, **todos 200** |
| `window.onerror` / `console.error` | **sin ningún mensaje** |
| `window.__next_f` | **array vacío** tras el arranque |
| `window.React` | **undefined** |

**Aislamiento.** El fallo **no lo causaron los cambios de la web**: con el commit
original `49f8529` levantado aparte (worktree, puerto 3007) falla igual, con el mismo
`0 fibers` y el mismo `__next_f` vacío. Tampoco es el script de demo (con `next dev`
a pelo pasa igual), ni una mezcla de `.next` (se borró antes de arrancar), ni la base
de datos (la portada no consulta Mongo), ni las versiones (React 19.2.4,
react-dom 19.2.4, Next 16.4.5, framer-motion 12.40).

**Causa, hasta donde se pudo llegar.** El HTML servido es correcto y está bien formado
(el parser no reporta problemas de anidamiento). Los segmentos del payload RSC sí se
empujan (`[0]` de bootstrap + seis `[1]` de datos). El runtime de App Router los
consume: `hydrate()` hace `const initialRSCPayload = await initialServerResponse`, y
`initialServerResponse` nace de `createFromReadableStream(readable, ...)` sobre un
`ReadableStream` alimentado por `nextServerDataCallback(seg)`. Si ese **stream nunca se
cierra**, la promesa no resuelve, `hydrateRoot` no llega a llamarse y no hay
hidratación. Como es una promesa que no resuelve, **no hay ningún error en consola**:
todo el síntoma es «no pasa nada».

Lo que queda abierto: **por qué** el stream no se cierra en `next dev` con Turbopack en
esta máquina y no en producción compilada. Candidatos sin confirmar: el
`next.config.ts` vacío, el aviso de `allowedDevOrigins` que Next 16.4 escribe en el
log del dev server, o el comportamiento del dev server de Turbopack en este VPS.

**Decisión tomada:** la maqueta **compila y se sirve en producción** (`next build` +
`next start`). El bug de `next dev` queda documentado y no se parchea a ciegas: parcheado
el síntoma (`opacity: 1` por CSS) la maqueta seguiría sin ser interactiva.

Coste: el primer arranque del demo tarda un par de minutos (compila antes de servir).

### README al día (`7f6f699`)

- Captura de la portada en `docs/portada.png`.
- `/subscribe` descrito como aviso, no como formulario.
- Estructura sin `legacy/`.
- `JWT_SECRET_MEMBER` y `JWT_SECRET_ADMIN` marcadas como **retiradas** (ya no existen
  en producción ni en el código; se borraron de Vercel).

## Verificación

- `npm run demo` compila y sirve: **6 de 6 elementos hidratados**, catálogo con los 7
  productos de ejemplo.
- Semilla idempotente: correrla dos veces no duplica (7 productos, 4 categorías).
- Escrituras al panel bloqueadas en los dos lados: cliente sin botones y
  `/api/admin/*` solo `GET`, el resto `405`.
- `npx tsc --noEmit` y `npm test` en verde (15 tests).

## Pendiente y dueño

- **Manuel:** el `next dev` sin hidratar sigue sin causa cerrada. No bloquea la maqueta
  (va compilada), pero conviene abrirlo en un ticket propio con la evidencia de arriba.
- **Manuel:** cuando vuelva better-auth, reponer la autenticación y revisar si la
  pista `// ENTRAR` sigue siendo la correcta con el gate de vuelta (entonces sí
  convendría una instrucción de pulsación).
- **Manuel:** revisar visualmente `/subscribe` y la portada con la pista nueva.
- Stripe, fotos propias de la marca, textos legales y dominio propio: siguen igual que
  en la lista de pendientes de `MEMORY.md`.
