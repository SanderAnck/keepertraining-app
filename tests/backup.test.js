// Tests voor het back-upformaat: exporteren en terugzetten levert exact dezelfde gegevens op.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBackup, parseBackup, backupFileName, BACKUP_STORES } from '../js/logic/backupFormat.js';

const data = {
  sessions: [{ id: 'a', title: 'Training', blocks: [{ type: 'kern', items: [{ exerciseId: 'x', note: 'é"\n' }] }] }],
  exercises: [{ id: 'eigen-1', diagram: { field: 'doel', elements: [{ t: 'keeper', x: 50, y: 12.5 }] } }],
  keepers: [],
  settings: [{ key: 'me', sound: true, favorites: ['x'] }],
  fieldState: [{ key: 'active', sessionId: 'a', timer: { running: false, banked: 1234 } }]
};

test('rondreis via JSON is identiek', () => {
  const b = buildBackup(data, { version: '0.1.0', dbVersion: 1, now: new Date('2026-01-02T10:00:00Z') });
  const back = parseBackup(JSON.stringify(b, null, 2));
  assert.deepEqual(back.data, data);
  assert.equal(back.exportedAt, '2026-01-02T10:00:00.000Z');
  for (const s of BACKUP_STORES) assert.ok(Array.isArray(back.data[s]));
});

test('ongeldige bestanden worden geweigerd met uitleg', () => {
  assert.throws(() => parseBackup('geen json'), /geldig JSON/);
  assert.throws(() => parseBackup('{"app":"Pace","data":{}}'), /KeeperCoach/);
  assert.throws(() => parseBackup({ app: 'KeeperCoach', format: 99, data: {} }), /nieuwere versie/);
  assert.throws(() => parseBackup({ app: 'KeeperCoach', format: 1, data: { sessions: {} } }), /ongeldig/);
});

test('bestandsnaam bevat de datum', () => {
  assert.equal(backupFileName(new Date(2026, 10, 5)), 'keepercoach-backup-2026-11-05.json');
});
