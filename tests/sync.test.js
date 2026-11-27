// Tests voor de pure sync-logica: wachtrij-items, rijen voor de server en "laatste wijziging wint".
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SYNC_STORES, stamp, outboxEntry, toRow, decide, maxSeq, validEmail, cleanCode, needsRefresh } from '../js/logic/sync.js';
import { BACKUP_STORES } from '../js/logic/backupFormat.js';

const rec = (id, updatedAt, extra = {}) => ({ id, title: 't-' + id, updatedAt, ...extra });
const row = (id, updated_at, data, extra = {}) => ({ kind: 'sessions', id, updated_at, data, deleted: !data, seq: 1, ...extra });

test('alleen trainingen, oefeningen en keepers gaan naar de cloud', () => {
  assert.deepEqual(SYNC_STORES, ['sessions', 'exercises', 'keepers']);
  for (const s of SYNC_STORES) assert.ok(BACKUP_STORES.includes(s));
  assert.ok(!SYNC_STORES.includes('settings') && !SYNC_STORES.includes('fieldState'));
});

test('stamp gebruikt updatedAt, anders createdAt', () => {
  assert.equal(stamp({ updatedAt: 5, createdAt: 2 }), 5);
  assert.equal(stamp({ createdAt: 2 }), 2);
  assert.equal(stamp(null), 0);
});

test('wachtrij-item en rij voor bewaren en verwijderen', () => {
  const e = outboxEntry('keepers', 'k1', rec('k1', 100));
  assert.deepEqual(e, { key: 'keepers:k1', kind: 'keepers', id: 'k1', updatedAt: 100, deleted: false });
  assert.deepEqual(toRow(e, rec('k1', 100), 'u'), { user_id: 'u', kind: 'keepers', id: 'k1', data: rec('k1', 100), updated_at: 100, deleted: false });
  const d = outboxEntry('keepers', 'k1', null, 200);
  assert.equal(d.deleted, true);
  assert.equal(d.updatedAt, 200);
  assert.equal(toRow(d, null, 'u').data, null);
  // Record bestaat lokaal niet meer: dan als verwijderd versturen.
  assert.equal(toRow(e, undefined, 'u').deleted, true);
});

test('nieuw record van de server wordt bewaard', () => {
  assert.equal(decide(row('a', 100, rec('a', 100))), 'put');
});

test('nieuwere versie van de server overschrijft, oudere niet', () => {
  assert.equal(decide(row('a', 200, rec('a', 200)), rec('a', 100)), 'put');
  assert.equal(decide(row('a', 100, rec('a', 100)), rec('a', 200)), 'skip');
});

test('identiek record wordt overgeslagen', () => {
  assert.equal(decide(row('a', 100, rec('a', 100)), rec('a', 100)), 'skip');
});

test('lokale wijziging in de wachtrij die nieuwer is, wint', () => {
  const pending = outboxEntry('sessions', 'a', rec('a', 300));
  assert.equal(decide(row('a', 200, rec('a', 200)), rec('a', 300), pending), 'skip');
  // Lokaal verwijderd (wachtrij) na de wijziging op de server: niet terugzetten.
  assert.equal(decide(row('a', 200, rec('a', 200)), undefined, outboxEntry('sessions', 'a', null, 300)), 'skip');
});

test('verwijdering van de server wist lokaal, tenzij lokaal nieuwer', () => {
  assert.equal(decide(row('a', 200, null), rec('a', 100)), 'delete');
  assert.equal(decide(row('a', 200, null), rec('a', 300)), 'skip');
  assert.equal(decide(row('a', 200, null), undefined), 'skip');
});

test('onbekende soort wordt genegeerd', () => {
  assert.equal(decide(row('a', 1, { key: 'me' }, { kind: 'settings' })), 'skip');
});

test('volgnummer, e-mail, code en token', () => {
  assert.equal(maxSeq([{ seq: 3 }, { seq: '12' }, { seq: 7 }], 5), 12);
  assert.equal(maxSeq([], 5), 5);
  assert.ok(validEmail(' sander@voorbeeld.be '));
  assert.ok(!validEmail('sander@'));
  assert.equal(cleanCode('123 456'), '123456');
  assert.equal(cleanCode('12a456'), null);
  assert.equal(cleanCode('123'), null);
  const now = 1_000_000_000_000;
  assert.ok(needsRefresh(null, now));
  assert.ok(needsRefresh({ expires_at: now / 1000 + 30 }, now));
  assert.ok(!needsRefresh({ expires_at: now / 1000 + 3600 }, now));
});
