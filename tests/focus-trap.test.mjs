import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';

test('012: modal mueve, atrapa y devuelve el foco y restaura scroll', () => {
  let effect, cleanup, active;
  const handlers = new Map();
  class Element {
    isConnected = true;
    tabIndex = 0;
    focus() { active = this; }
    getClientRects() { return [1]; }
  }
  const trigger = new Element();
  const first = new Element();
  const last = new Element();
  const dialog = new Element();
  dialog.querySelectorAll = () => [first, last];
  dialog.contains = e => [dialog, first, last].includes(e);
  active = trigger;
  const document = {
    get activeElement() { return active; },
    body: { style: { overflow: 'auto' } },
    addEventListener: (k, f) => handlers.set(k, f),
    removeEventListener: k => handlers.delete(k),
  };
  const exports = {};
  const source = ts.transpileModule(readFileSync('src/lib/a11y/useFocusTrap.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(source, { exports, document, HTMLElement: Element, require: () => ({
    useRef: () => ({ current: dialog }), useEffect: f => { effect = f; },
  }) });
  exports.useFocusTrap(true);
  cleanup = effect();
  assert.equal(active, first);
  assert.equal(document.body.style.overflow, 'hidden');
  let prevented = false;
  last.focus();
  handlers.get('keydown')({ key: 'Tab', shiftKey: false, preventDefault() { prevented = true; } });
  assert.equal(active, first);
  assert.ok(prevented);
  handlers.get('keydown')({ key: 'Tab', shiftKey: true, preventDefault() {} });
  assert.equal(active, last);
  trigger.focus();
  handlers.get('focusin')({ target: trigger });
  assert.equal(active, first);
  cleanup();
  assert.equal(active, trigger);
  assert.equal(document.body.style.overflow, 'auto');
  assert.equal(handlers.size, 0);
});
