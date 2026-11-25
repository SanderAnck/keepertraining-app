// Controleert dat elk app-bestand in de precache-lijst van sw.js staat (anders werkt het niet offline) en omgekeerd.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const sw = readFileSync(join(root, 'sw.js'), 'utf8');
const list = [...sw.matchAll(/^\s+'([^']+)',?$/gm)].map((m) => m[1]);

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [relative(root, p)];
  });
}

test('alle bestanden in css, js, data en icons staan in de precache', () => {
  const files = ['css', 'js', 'data', 'icons'].flatMap((d) => walk(join(root, d))).filter((f) => !f.endsWith('.DS_Store'));
  for (const f of [...files, 'index.html', 'manifest.webmanifest']) assert.ok(list.includes(f), `${f} ontbreekt in sw.js`);
});

test('elk bestand in de precache bestaat', () => {
  for (const f of list) if (f !== './') assert.ok(existsSync(join(root, f)), `${f} bestaat niet`);
});

test('versienummer staat op één plaats', () => {
  const v = readFileSync(join(root, 'js/version.js'), 'utf8');
  assert.match(v, /self\.KEEPER_VERSION = '\d+\.\d+\.\d+';/);
  assert.ok(sw.includes("importScripts('js/version.js')"));
});
