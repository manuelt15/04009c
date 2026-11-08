/**
 * Sesiones revocables (hallazgos 04009c-2026-11-07-022 y -023).
 *
 * Carga los módulos TypeScript del repo compilándolos en memoria con la API
 * del compilador de TypeScript (ya es dependencia, no se añade ninguna) y
 * comprueba el comportamiento real de la versión de sesión:
 *
 *  - 022: un token de miembro firmado con la versión anterior deja de valer
 *    cuando se rota el código de acceso.
 *  - 023: un token de admin firmado con la versión anterior deja de valer
 *    cuando se cambian las credenciales.
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

process.env.JWT_SECRET_ADMIN ??= "secreto-admin-de-prueba";
process.env.JWT_SECRET_MEMBER ??= "secreto-miembro-de-prueba";

const { versionSesionVigente } = cargar("src/lib/auth/session-version.ts");
const { signAdminToken, verifyAdminToken, signMemberToken, verifyMemberToken } = cargar("src/lib/auth/jwt.ts");

test("un token con la versión vigente vale y uno anterior no", () => {
  assert.equal(versionSesionVigente(2, 2), true, "misma versión: sesión vigente");
  assert.equal(versionSesionVigente(1, 2), false, "versión anterior: sesión revocada");
});

test("un token sin versión (emitido antes del arreglo) no vale", () => {
  assert.equal(versionSesionVigente(undefined, 0), false);
});

test("un documento sin contador se lee como versión 0", () => {
  assert.equal(versionSesionVigente(0, undefined), true);
  assert.equal(versionSesionVigente(1, undefined), false);
});

test("rotar el código de acceso invalida el token de miembro anterior", async () => {
  const antes = await verifyMemberToken(await signMemberToken(3));
  assert.equal(antes.tv, 3, "el token lleva la versión con la que se firmó");

  // Rotar el código crea el documento con la versión 4.
  const despuesDeRotar = 4;
  assert.equal(versionSesionVigente(antes.tv, despuesDeRotar), false);
});

test("cambiar las credenciales invalida el token de admin anterior", async () => {
  const antes = await verifyAdminToken(await signAdminToken("64b000000000000000000000", 1));
  assert.equal(antes.sub, "64b000000000000000000000");
  assert.equal(antes.tv, 1);

  const despuesDeCambiar = 2;
  assert.equal(versionSesionVigente(antes.tv, despuesDeCambiar), false);
  // El token reemitido tras el cambio sí sigue valiendo.
  const nuevo = await verifyAdminToken(await signAdminToken("64b000000000000000000000", 2));
  assert.equal(versionSesionVigente(nuevo.tv, despuesDeCambiar), true);
});
