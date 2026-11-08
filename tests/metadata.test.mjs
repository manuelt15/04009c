import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

test('025: cada ruta define un título de documento distinto', () => {
  const pages = readdirSync('src/app', { recursive: true }).filter(p => p.endsWith('page.tsx'));
  const titles = pages.filter(p => !p.includes('[slug]')).map(p => {
    const source = readFileSync(join('src/app', p), 'utf8');
    const title = source.match(/title:\s*"([^"]+)"/);
    assert.ok(title, p);
    return title[1];
  });
  assert.equal(new Set(titles).size, titles.length);
  assert.match(readFileSync('src/app/store/[slug]/page.tsx', 'utf8'), /generateMetadata[\s\S]*await params/);
});
