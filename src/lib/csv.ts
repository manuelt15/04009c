/**
 * Escritura de celdas CSV a prueba de fórmulas.
 *
 * Si un valor empieza por = + - @ (o por tabulador / retorno de carro), las
 * hojas de cálculo lo interpretan como fórmula al abrir el fichero. Se
 * antepone un apóstrofo y se entrecomilla cuando el valor lleva coma, comilla
 * o salto de línea, que es lo único que rompe el CSV.
 */
const INICIO_PELIGROSO = /^[=+\-@\t\r]/;

export function celdaCSV(valor: unknown): string {
  const texto = valor === null || valor === undefined ? "" : String(valor);
  const seguro = INICIO_PELIGROSO.test(texto) ? `'${texto}` : texto;
  return /[",\n\r]/.test(seguro) ? `"${seguro.replace(/"/g, '""')}"` : seguro;
}

export function filasACSV(cabecera: string[], filas: unknown[][]): string {
  return [cabecera.map(celdaCSV).join(","), ...filas.map((f) => f.map(celdaCSV).join(","))].join("\n");
}
