import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const css = readFileSync('src/app/globals.css', 'utf8');
function luminance(hex) {
  const rgb = hex.match(/../g).map(v => parseInt(v, 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return rgb.reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
}
function contrast(a, b) {
  const [low, high] = [luminance(a), luminance(b)].sort((a, b) => a - b);
  return (high + 0.05) / (low + 0.05);
}
test('007: texto secundario oscuro cumple WCAG AA', () => {
  const color = css.match(/:root \{\s*--theme-dim:\s*#([\da-f]+)/i)[1];
  assert.ok(contrast(color, '080808') >= 4.5);
});
