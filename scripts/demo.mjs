/**
 * Maqueta pública de 04009c — `npm run demo`
 *
 * Levanta un Mongo en memoria, siembra los DATOS DE EJEMPLO (los mismos que
 * usa el panel de administración, para que las dos partes cuenten la misma
 * historia) y arranca Next en el puerto 3006 escuchando en 0.0.0.0.
 *
 * No hace falta ninguna credencial: ni Atlas, ni .env.local, ni secretos.
 *
 * Al cerrar (Ctrl+C o SIGTERM) mata el servidor de Next y para el Mongo,
 * sin dejar nada colgado.
 *
 *   npm run demo   →  http://100.79.99.13:3006
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

const PUERTO = Number(process.env.DEMO_PORT ?? 3006);
const HOST = process.env.DEMO_HOST ?? "0.0.0.0";
const DB_NAME = "demo";

// ---------------------------------------------------------------------------
// Cargador de TypeScript
// Los datos de ejemplo y los modelos viven en .ts. Los compilamos en memoria
// con la API del compilador (ya es dependencia del repo: typescript).
// ---------------------------------------------------------------------------
const ts = require("typescript");

const cache = new Map();

function cargar(relativo) {
  if (cache.has(relativo)) return cache.get(relativo).exports;

  const fichero = path.join(RAIZ, relativo);
  const fuente = readFileSync(fichero, "utf8");
  const { outputText } = ts.transpileModule(fuente, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: fichero,
  });

  const modulo = { exports: {} };
  cache.set(relativo, modulo);

  const requireLocal = (id) => {
    // Alias del repo: "@/lib/x" → src/lib/x.ts
    if (id.startsWith("@/")) {
      const destino = path.join("src", id.slice(2));
      const candidatos = [`${destino}.ts`, `${destino}.tsx`, path.join(destino, "index.ts")];
      for (const c of candidatos) {
        try {
          return cargar(c);
        } catch {
          /* siguiente candidato */
        }
      }
      throw new Error(`No se encuentra el módulo ${id}`);
    }
    return require(id);
  };

  new Function("exports", "require", "module", outputText)(modulo.exports, requireLocal, modulo);
  return modulo.exports;
}

// ---------------------------------------------------------------------------
// Mongo en memoria
// ---------------------------------------------------------------------------
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = (await import("mongoose")).default;

async function sembrar(uri) {
  await mongoose.connect(uri, { dbName: DB_NAME });

  const { DEMO_CATEGORIES, DEMO_PRODUCTS, DEMO_SHIPPING, DEMO_SIZE_GUIDES } = cargar("src/lib/demo-data.ts");
  const { Category } = cargar("src/lib/models/category.ts");
  const { Product } = cargar("src/lib/models/product.ts");
  const { StoreSettings } = cargar("src/lib/models/store-settings.ts");

  // Idempotente: se busca por la clave natural (nombre de categoría, slug de
  // producto) y se actualiza. Correrlo dos veces no duplica nada.
  for (const [i, cat] of DEMO_CATEGORIES.entries()) {
    await Category.updateOne(
      { name: cat.name },
      { $set: { name: cat.name, sizeGuide: cat.sizeGuide, order: i } },
      { upsert: true },
    );
  }

  for (const p of DEMO_PRODUCTS) {
    // El _id lo pone Mongo: el de ejemplo es solo para el panel de prueba.
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

  const [nProductos, nCategorias] = await Promise.all([Product.countDocuments(), Category.countDocuments()]);
  console.log(`[demo] sembrado: ${nProductos} productos, ${nCategorias} categorías (datos de ejemplo)`);

  await mongoose.disconnect();
}

// ---------------------------------------------------------------------------
// Ciclo de vida
// ---------------------------------------------------------------------------
let mongo = null;
let next = null;
let cerrado = false;

async function apagar() {
  if (cerrado) return;
  cerrado = true;
  console.log("\n[demo] parando…");

  if (next && !next.killed) {
    next.kill("SIGTERM");
    await new Promise((r) => {
      const t = setTimeout(() => {
        next.kill("SIGKILL");
        r();
      }, 5000);
      next.once("exit", () => {
        clearTimeout(t);
        r();
      });
    });
  }

  if (mongo) {
    await mongo.stop().catch(() => {});
    console.log("[demo] mongo en memoria parado");
  }

  process.exit(0);
}

process.on("SIGINT", apagar);
process.on("SIGTERM", apagar);

// Ejecuta un comando y espera a que termine. Rechaza si sale con error: una
// compilación rota no puede pasar desapercibida detrás de un `spawn`.
function ejecutar(binario, args, env) {
  return new Promise((resolve, reject) => {
    const p = spawn(binario, args, { cwd: RAIZ, stdio: "inherit", env });
    p.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`next ${args.join(" ")} terminó con código ${code}`));
    });
    p.on("error", reject);
  });
}

async function main() {
  console.log("[demo] levantando Mongo en memoria…");
  mongo = await MongoMemoryServer.create({
    instance: { dbName: DB_NAME },
  });
  const uri = mongo.getUri(DB_NAME);
  console.log(`[demo] mongo listo en ${uri}`);

  await sembrar(uri);

  const binario = path.join(RAIZ, "node_modules", ".bin", "next");
  const entorno = {
    ...process.env,
    MONGODB_URI: uri,
    // Sin correo: la maqueta no envía emails.
    MAIL_USER: "",
    MAIL_PASS: "",
  };

  // `next dev` (Turbopack) no hidrata en este entorno: sirve la página pero React
  // nunca engancha, y todo lo que anima se queda en opacidad 0. Compilada, va bien,
  // así que la maqueta se compila y se sirve en modo producción.
  console.log("[demo] compilando la maqueta (tarda un poco)…");
  await ejecutar(binario, ["build"], entorno);

  console.log(`[demo] arrancando Next en http://${HOST}:${PUERTO} …`);
  next = spawn(binario, ["start", "-p", String(PUERTO), "-H", HOST], {
    cwd: RAIZ,
    stdio: "inherit",
    env: entorno,
  });

  next.on("exit", (code) => {
    console.log(`[demo] Next terminó (código ${code})`);
    apagar();
  });
}

main().catch(async (err) => {
  console.error("[demo] error:", err);
  await apagar();
  process.exit(1);
});
