/**
 * Accesibilidad de la portada pública (demo sin clave).
 *
 * La portada ya no pide un código de acceso: el número "04009c" es el control
 * real de entrada y el texto "Pulsa los números" es solo una pista visual.
 * Este test parsea el componente con la API del compilador de TypeScript
 * (dependencia ya presente en el repo, sin dependencias nuevas) y comprueba que:
 *
 *  - no queda ningún campo de contraseña en la portada,
 *  - el número es un <button> (real, no un div) con nombre accesible,
 *  - el botón de acceso es un <button> con texto visible que lleva a /store,
 *  - no hay divs con onClick en la portada.
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
const FICHERO = path.join(RAIZ, "src/components/gate/PasswordGate.tsx");

const fuente = readFileSync(FICHERO, "utf8");
const arbol = ts.createSourceFile(FICHERO, fuente, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

/** Atributos JSX de un elemento, como mapa nombre -> valor literal de texto. */
function atributosDe(elemento) {
  const mapa = new Map();
  const apertura = ts.isJsxElement(elemento) ? elemento.openingElement : elemento;
  for (const prop of apertura.attributes?.properties ?? []) {
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

/**
 * Elementos JSX de un tipo dado.
 * "button" incluye <motion.button>: el número de la portada es uno de ellos.
 * En un elemento con contenido, el nombre y los atributos están en su
 * JsxOpeningElement.
 */
function elementosDe(tipo) {
  const encontrados = [];
  const visitar = (nodo) => {
    if (ts.isJsxElement(nodo) || ts.isJsxSelfClosingElement(nodo)) {
      const apertura = ts.isJsxElement(nodo) ? nodo.openingElement : nodo;
      const tag = apertura.tagName?.getText(arbol) ?? "";
      const nombre = tag === `motion.${tipo}` ? tipo : tag;
      if (nombre === tipo) encontrados.push(nodo);
    }
    ts.forEachChild(nodo, visitar);
  };
  visitar(arbol);
  return encontrados;
}

/** Texto visible de un elemento (sus hijos de texto). */
function textoDe(elemento) {
  if (!ts.isJsxElement(elemento)) return "";
  return elemento.children
    .filter((h) => ts.isJsxText(h))
    .map((h) => h.getText(arbol))
    .join(" ")
    .trim();
}

const inputs = elementosDe("input");
const botones = elementosDe("button");

test("la portada no pide ningún código de acceso", () => {
  assert.equal(inputs.length, 0, "la portada no debe tener campos de entrada");
  assert.doesNotMatch(fuente, /type="password"/);
});

test("la portada no llama a la API de autenticación", () => {
  assert.doesNotMatch(fuente, /\/api\/auth\//);
});

test("el número es un botón con nombre accesible", () => {
  const numero = botones.find(
    (b) => atributosDe(b).get("aria-label") === "Entrar en la tienda"
  );
  assert.ok(numero, "debe existir el botón del número con nombre accesible");
  assert.equal(textoDe(numero), "04009c", "el número es su texto visible");
});

test("el botón de acceso es un botón real con texto visible", () => {
  const acceso = botones.find((b) => textoDe(b).includes("ACCEDER"));
  assert.ok(acceso, "debe existir el botón ACCEDER");
  assert.equal(atributosDe(acceso).get("type"), "button");
});

test("el acceso lleva a la tienda y no hace ninguna petición", () => {
  assert.match(fuente, /router\.push\("\/store"\)/);
  assert.doesNotMatch(fuente, /method:\s*"POST"/);
});

test("no hay divs con onClick en la portada", () => {
  const divsConClick = elementosDe("div").filter((d) => atributosDe(d).has("onClick"));
  assert.equal(divsConClick.length, 0, "nada interactivo puede depender solo del ratón");
});
