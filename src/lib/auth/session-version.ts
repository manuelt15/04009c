/**
 * Comparación única de versiones de sesión.
 *
 * Un token solo vale mientras su `tv` coincide con el contador que guarda el
 * documento del que salió. Sin esto, rotar el código de acceso o cambiar las
 * credenciales de admin deja vivos los tokens ya emitidos hasta que caducan.
 *
 * Los documentos anteriores a este campo no tienen `tokenVersion`: se leen
 * como 0, que es el valor con el que se firman los tokens nuevos mientras no
 * se rote nada.
 */
export function versionSesionVigente(tv: unknown, actual: unknown): boolean {
  const vigente = typeof actual === "number" ? actual : 0;
  return typeof tv === "number" && tv === vigente;
}
