/**
 * Accesibilidad del login de administración (hallazgo 04009c-2026-11-07-001).
 *
 * Los <input> de usuario y contraseña solo llevaban placeholder ("USUARIO",
 * "CONTRASEÑA"). El placeholder NO es un nombre accesible: sin <label>,
 * aria-label, aria-labelledby ni title, un lector de pantalla anuncia el
 * campo sin nombre y el formulario de entrada del panel es inaccesible
 * (WCAG 2.4.6 Labels e 4.1.2 Name, Role, Value).
 *
 * Este test parsea el componente con la API del compilador de TypeScript
 * (dependencia ya presente en el repo, sin dependencias nuevas) y comprueba
 * que TODO <input> tiene nombre accesible de verdad.
 *
 * Ejecutar: npm test
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import ts from "typescript";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FICHERO = path.join(RAIZ, "src/components/admin/AdminLogin.tsx");

const fuente = readFileSync(FICHERO, "utf8");
const arbol = ts.createSourceFile(FICHERO, fuente, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

/** Atributos JSX de un elemento, como mapa nombre -> valor literal de texto. */
function atributosDe(elemento) {
  const mapa = new Map();
  const props = elemento.attributes?.properties ?? [];
  for (const prop of props) {
    if (!ts.isJsxAttribute(prop)) continue;
    const nombre = prop.name.getText(arbol);
    if (!prop.initializer) {
      mapa.set(nombre, true); // boolean shorthand
    } else if (ts.isStringLiteral(prop.initializer)) {
      mapa.set(nombre, prop.initializer.text);
    } else if (ts.isJsxExpression(prop.initializer) && ts.isStringLiteral(prop.initializer.expression)) {
      mapa.set(nombre, prop.initializer.expression.text);
    } else {
      mapa.set(nombre, null); // expresión: valor no estático
    }
  }
  return mapa;
}

/** Todos los elementos <input> del componente. */
function inputs() {
  const encontrados = [];
  const visitar = (nodo) => {
    if (
      (ts.isJsxSelfClosingElement(nodo) || ts.isJsxElement(nodo)) &&
      nodo.tagName?.getText(arbol) === "input"
    ) {
      encontrados.push(nodo);
    }
    ts.forEachChild(nodo, visitar);
  };
  visitar(arbol);
  return encontrados;
}

/** Elementos <label> del componente, con su htmlFor. */
function labels() {
  const encontrados = [];
  const visitar = (nodo) => {
    if (
      (ts.isJsxSelfClosingElement(nodo) || ts.isJsxElement(nodo)) &&
      nodo.tagName?.getText(arbol) === "label"
    ) {
      encontrados.push(atributosDe(nodo).get("htmlFor") ?? null);
    }
    ts.forEachChild(nodo, visitar);
  };
  visitar(arbol);
  return encontrados;
}

const inputsDelFormulario = inputs();

test("el login de admin tiene exactamente los dos campos esperados", () => {
  assert.equal(inputsDelFormulario.length, 2, "el formulario debe tener 2 campos");
});

test("cada <input> del login de admin tiene nombre accesible", () => {
  const htmlFor = labels();
  for (const input of inputsDelFormulario) {
    const attrs = atributosDe(input);
    const id = attrs.get("id");
    const nombre =
      (typeof attrs.get("aria-label") === "string" && attrs.get("aria-label").trim()) ||
      (typeof attrs.get("title") === "string" && attrs.get("title").trim()) ||
      (typeof attrs.get("aria-labelledby") === "string" && attrs.get("aria-labelledby").trim()) ||
      (typeof id === "string" && htmlFor.includes(id) ? id : "");

    assert.ok(
      nombre,
      `El <input>${id ? ` id="${id}"` : ""} no tiene nombre accesible: ` +
        `aria-label, aria-labelledby, title o un <label htmlFor> asociado. ` +
        `El placeholder no cuenta como nombre accesible.`
    );
  }
});

test("el campo de usuario se anuncia como Usuario", () => {
  const usuario = inputsDelFormulario.find(
    (i) => atributosDe(i).get("type") === "text" || atributosDe(i).get("name") === "username"
  );
  assert.ok(usuario, "debe existir el campo de usuario");
  assert.equal(atributosDe(usuario).get("aria-label"), "Usuario");
});

test("el campo de contraseña se anuncia como Contraseña y enmascara la entrada", () => {
  const clave = inputsDelFormulario.find(
    (i) => atributosDe(i).get("type") === "password" || atributosDe(i).get("name") === "password"
  );
  assert.ok(clave, "debe existir el campo de contraseña");
  assert.equal(atributosDe(clave).get("aria-label"), "Contraseña");
  assert.equal(atributosDe(clave).get("type"), "password");
});
