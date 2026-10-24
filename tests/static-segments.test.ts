import { test, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { normalizeStaticSegments } from '../scripts/normalize-static-segments';

function fixture(t: TestContext) {
  const tempParent = resolve(tmpdir());
  const root = mkdtempSync(join(tempParent, 'roadside-static-segments-'));
  t.after(() => {
    if (dirname(resolve(root)) !== tempParent || !basename(root).startsWith('roadside-static-segments-')) throw new Error('Unsafe test cleanup path.');
    rmSync(root, { recursive: true, force: true });
  });
  function put(path: string, contents: string) {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, contents);
  }
  return { root, put, read: (path: string) => readFileSync(join(root, path), 'utf8') };
}

test('Windows RSC exports receive flat root, contact and service payload aliases; originals remain', t => {
  const { root, put, read } = fixture(t);
  const payloads = [
    ['__next.$d$page/__PAGE__.txt', '__next.$d$page.__PAGE__.txt', 'root payload'],
    ['contact/__next.$d$page/__PAGE__.txt', 'contact/__next.$d$page.__PAGE__.txt', 'contact payload'],
    ['services/local-towing/__next.services/$d$service/__PAGE__.txt', 'services/local-towing/__next.services.$d$service.__PAGE__.txt', 'service payload'],
  ];
  for (const route of ['', 'contact/', 'services/local-towing/']) put(`${route}index.html`, '<h1>Fixture</h1>');
  for (const [source, , contents] of payloads) put(source, contents);
  put('images/nested/photo.txt', 'unrelated image notes');
  put('_next/static/chunks/runtime.js', 'unrelated JavaScript');
  put('assets/__next.unrelated/nested.txt', 'non-route asset');
  assert.equal(normalizeStaticSegments(root), 3);
  for (const [source, destination, contents] of payloads) {
    assert.equal(read(source), contents);
    assert.equal(read(destination), contents);
  }
  assert.equal(read('images/nested/photo.txt'), 'unrelated image notes');
  assert.equal(read('_next/static/chunks/runtime.js'), 'unrelated JavaScript');
  assert.equal(read('assets/__next.unrelated/nested.txt'), 'non-route asset');
  assert.ok(!existsSync(join(root, 'assets/__next.unrelated.nested.txt')));
  assert.equal(normalizeStaticSegments(root), 0, 'normalization is idempotent');
});

test('Linux flat exports remain unchanged', t => {
  const { root, put, read } = fixture(t);
  put('index.html', '<h1>Fixture</h1>');
  put('__next.__PAGE__.txt', 'root payload');
  put('contact/index.html', '<h1>Contact</h1>');
  put('contact/__next.$d$page.__PAGE__.txt', 'contact payload');
  assert.equal(normalizeStaticSegments(root), 0);
  assert.equal(read('contact/__next.$d$page.__PAGE__.txt'), 'contact payload');
});

test('differing existing payloads stop normalization before any alias is written', t => {
  const { root, put, read } = fixture(t);
  put('index.html', '<h1>Fixture</h1>');
  put('__next.a/__PAGE__.txt', 'a');
  put('__next.z/__PAGE__.txt', 'new z');
  put('__next.z.__PAGE__.txt', 'existing z');
  assert.throws(() => normalizeStaticSegments(root), /Existing static segment differs/);
  assert.equal(read('__next.z.__PAGE__.txt'), 'existing z');
  assert.ok(!existsSync(join(root, '__next.a.__PAGE__.txt')));
});

test('two nested payloads cannot silently collide at the same dotted destination', t => {
  const { root, put } = fixture(t);
  put('index.html', '<h1>Fixture</h1>');
  put('__next.a/b.c.txt', 'one payload');
  put('__next.a.b/c.txt', 'different payload');
  assert.throws(() => normalizeStaticSegments(root), /Conflicting static segment aliases/);
  assert.ok(!existsSync(join(root, '__next.a.b.c.txt')));
});
