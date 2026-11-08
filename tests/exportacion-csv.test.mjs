/**
 * Exportación de suscriptores a CSV (hallazgo 04009c-2026-11-07-024).
 *
 * Carga src/lib/csv.ts compilándolo en memoria con la API del compilador de
 * TypeScript (ya es dependencia, no se añade ninguna) y comprueba que una
 * celda que empieza por = + - @ no se exporta como fórmula, que es lo que
 * ejecuta la hoja de cálculo al abrir el fichero.
 *
 * Ejecutar: npm test
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";
import ts from "typescript";

const require = createRequire(import.meta.url);
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Compila un .ts del repo y devuelve su módulo CommonJS. */
function cargar(relativo) {
  const fichero = path.join(RAIZ, relativo);
  const fuente = readFileSync(fichero, "utf8");
  const { outputText } = ts.transpileModule(fuente, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: fichero,
  });
  const modulo = { exports: {} };
  new Function("exports", "require", "module", outputText)(modulo.exports, require, modulo);
  return modulo.exports;
}

const { celdaCSV, filasACSV } = cargar("src/lib/csv.ts");

test("una celda que empieza por = no se exporta como fórmula", () => {
  const salida = celdaCSV('=HYPERLINK("http://malo","pulsa")');
  assert.equal(salida.startsWith("\"'="), true, "apóstrofo delante de la fórmula, y entrecomillada por llevar comas");
  assert.equal(salida.includes("\"'=HYPERLINK"), true);
});

test("las cuatro iniciales peligrosas quedan neutralizadas", () => {
  for (const inicial of ["=", "+", "-", "@"]) {
    const salida = celdaCSV(`${inicial}1+1`);
    assert.equal(salida.startsWith("'"), true, `debe neutralizar ${inicial}`);
  }
});

test("un texto normal se exporta tal cual y las comas se entrecomillan", () => {
  assert.equal(celdaCSV("Manuel Torres"), "Manuel Torres");
  assert.equal(celdaCSV("Calle Mayor, 3"), "\"Calle Mayor, 3\"");
  assert.equal(celdaCSV(null), "");
  assert.equal(celdaCSV(undefined), "");
});

test("la exportación de suscriptores neutraliza el nombre malicioso en su fila", () => {
  const csv = filasACSV(
    ["Nombre", "Email", "Móvil", "Ciudad", "Fecha"],
    [["=cmd|'/c calc'!A1", "ana@example.test", "", "Madrid", "8/11/2026"]]
  );
  const filas = csv.split("\n");
  assert.equal(filas[0], "Nombre,Email,Móvil,Ciudad,Fecha");
  assert.equal(filas[1].startsWith("'=cmd"), true, "la fila empieza con la celda neutralizada");
  assert.equal(filas[1].includes("ana@example.test"), true);
});
