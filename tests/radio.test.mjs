import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';
const exports = {};
vm.runInNewContext(ts.transpileModule(readFileSync('src/lib/a11y/radio.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, { exports });
test('040: flechas, Home y End cambian selección y foco con vuelta circular', () => {
  let focused, selected;
  const radios = [0, 1, 2].map(i => ({ focus() { focused = i; }, click() { selected = i; } }));
  for (const [key, from, to] of [['ArrowRight', 0, 1], ['ArrowDown', 2, 0], ['ArrowLeft', 0, 2], ['ArrowUp', 1, 0], ['Home', 2, 0], ['End', 0, 2]]) {
    let prevented = false;
    exports.handleRadioKeys({ key, target: radios[from], currentTarget: {
      querySelectorAll(selector) { assert.match(selector, /:not\(:disabled\)/); return radios; },
    }, preventDefault() { prevented = true; } });
    assert.equal(focused, to, key);
    assert.equal(selected, to, key);
    assert.ok(prevented);
  }
});
