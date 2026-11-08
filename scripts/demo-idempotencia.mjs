/**
 * Comprobación de idempotencia de la siembra del script de demo.
 *
 * Levanta un Mongo en memoria, siembra dos veces con la misma lógica que
 * scripts/demo.mjs y comprueba que la segunda siembra no duplica productos
 * ni categorías.
 *
 * Ejecutar: node scripts/demo-idempotencia.mjs
 */
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");

const cache = new Map();
function cargar(relativo) {
  if (cache.has(relativo)) return cache.get(relativo).exports;
  const fichero = path.join(RAIZ, relativo);
  const { outputText } = ts.transpileModule(readFileSync(fichero, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: fichero,
  });
  const modulo = { exports: {} };
  cache.set(relativo, modulo);
  const requireLocal = (id) => {
    if (id.startsWith("@/")) {
      const destino = path.join("src", id.slice(2));
      for (const c of [`${destino}.ts`, `${destino}.tsx`]) {
        try { return cargar(c); } catch { /* siguiente */ }
      }
      throw new Error(`No se encuentra ${id}`);
    }
    return require(id);
  };
  new Function("exports", "require", "module", outputText)(modulo.exports, requireLocal, modulo);
  return modulo.exports;
}

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = (await import("mongoose")).default;

const { DEMO_CATEGORIES, DEMO_PRODUCTS, DEMO_SHIPPING, DEMO_SIZE_GUIDES } = cargar("src/lib/demo-data.ts");
const { Category } = cargar("src/lib/models/category.ts");
const { Product } = cargar("src/lib/models/product.ts");
const { StoreSettings } = cargar("src/lib/models/store-settings.ts");

async function sembrar() {
  for (const [i, cat] of DEMO_CATEGORIES.entries()) {
    await Category.updateOne(
      { name: cat.name },
      { $set: { name: cat.name, sizeGuide: cat.sizeGuide, order: i } },
      { upsert: true },
    );
  }
  for (const p of DEMO_PRODUCTS) {
    // El _id del ejemplo es solo para el panel: aquí lo pone Mongo
    const resto = { ...p };
    delete resto._id;
    await Product.updateOne(
      { slug: p.slug },
      { $set: { ...resto, createdAt: p.createdAt } },
      { upsert: true },
    );
  }
  await StoreSettings.updateOne(
    { key: "main" },
    { $set: { shipping: DEMO_SHIPPING, sizeGuides: DEMO_SIZE_GUIDES } },
    { upsert: true },
  );
  return {
    productos: await Product.countDocuments(),
    categorias: await Category.countDocuments(),
  };
}

const mongo = await MongoMemoryServer.create({ instance: { dbName: "demo" } });
await mongoose.connect(mongo.getUri("demo"), { dbName: "demo" });

const primera = await sembrar();
const segunda = await sembrar();
const tercera = await sembrar();

console.log(`1ª siembra: ${primera.productos} productos, ${primera.categorias} categorías`);
console.log(`2ª siembra: ${segunda.productos} productos, ${segunda.categorias} categorías`);
console.log(`3ª siembra: ${tercera.productos} productos, ${tercera.categorias} categorías`);

const esperadoProductos = DEMO_PRODUCTS.length;
const esperadoCategorias = DEMO_CATEGORIES.length;
const ok =
  primera.productos === esperadoProductos &&
  segunda.productos === esperadoProductos &&
  tercera.productos === esperadoProductos &&
  primera.categorias === esperadoCategorias &&
  segunda.categorias === esperadoCategorias &&
  tercera.categorias === esperadoCategorias;

console.log(ok ? "IDEMPOTENTE: sembrar dos veces no duplica" : "FALLO: la siembra duplica");

await mongoose.disconnect();
await mongo.stop();
process.exit(ok ? 0 : 1);
