import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import vm from 'node:vm';
const require = createRequire(import.meta.url);
const exports = {};
vm.runInNewContext(ts.transpileModule(readFileSync('src/lib/auth/rate-limit.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, { exports, require });
const { createLoginLimiter, limitLoginAttempt } = exports;

test('046: ambas rutas rechazan intentos excesivos antes de consultar MongoDB', () => {
  for (const route of ['login', 'admin-login']) {
    const source = readFileSync(`src/app/api/auth/${route}/route.ts`, 'utf8');
    assert.match(source, /limitLoginAttempt/);
    assert.ok(source.indexOf('const limited = limitLoginAttempt') < source.indexOf('await connectDB()'));
    assert.match(source, /if \(limited\) return limited/);
  }
});

test('046: ventana deslizante expira cada intento, no reinicia por intervalos fijos', () => {
  const consume = createLoginLimiter(2, 1000);
  assert.equal(consume('admin', 'ip1', 'usuario', 0), 0);
  assert.equal(consume('admin', 'ip1', 'usuario', 500), 0);
  assert.equal(consume('admin', 'ip1', 'usuario', 999), 1);
  assert.equal(consume('admin', 'ip1', 'usuario', 1000), 0);
  assert.equal(consume('admin', 'ip1', 'usuario', 1001), 1);
  assert.equal(consume('admin', 'ip1', 'usuario', 1500), 0);
});

test('046: cambiar identidad no elude el límite por IP; IP y ámbitos separados', () => {
  const consume = createLoginLimiter(1, 1000);
  assert.equal(consume('admin', 'ip1', 'uno', 0), 0);
  assert.equal(consume('admin', 'ip1', 'dos', 1), 1);
  assert.equal(consume('admin', 'ip2', 'uno', 1), 0);
  assert.equal(consume('member', 'ip1', 'gate', 1), 0);
});

test('046: capacidad acotada rechaza claves nuevas sin expulsar límites activos', () => {
  const consume = createLoginLimiter(1, 1000, 2);
  assert.equal(consume('admin', 'ip1', 'uno', 0), 0);
  assert.equal(consume('admin', 'ip2', 'dos', 1), 1);
  assert.equal(consume('admin', 'ip1', 'uno', 1), 1);
  assert.equal(consume('admin', 'ip2', 'dos', 1000), 0);
});

test('046: respuesta real 429 con Retry-After y sin caché para ambas zonas', async () => {
  for (const realm of ['admin', 'member']) {
    const req = { headers: new Headers({ 'x-forwarded-for': '192.0.2.1' }) };
    for (let i = 0; i < 10; i++) assert.equal(limitLoginAttempt(req, realm, 'fixture'), null);
    const response = limitLoginAttempt(req, realm, 'fixture');
    assert.equal(response.status, 429);
    assert.ok(Number(response.headers.get('retry-after')) > 0);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.match((await response.json()).error, /DEMASIADOS INTENTOS/);
  }
});
