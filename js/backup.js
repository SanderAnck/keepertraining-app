// Back-up en herstel van alle gegevens als JSON-bestand (deelmenu met download als terugvaloptie) en back-upherinnering.
import * as db from './db.js';
import { buildBackup, parseBackup, backupFileName, backupStats } from './logic/backupFormat.js';
import state, { saveSettings, loadAll } from './state.js';
import { toast } from './ui.js';
import { queueAll, scheduleSync } from './cloud.js';

const REMIND_DAYS = 14;

/** Deelt of downloadt een JSON-bestand. Geeft 'gedeeld' | 'gedownload' | 'geannuleerd' terug. */
export async function shareOrDownload(name, obj) {
  const text = JSON.stringify(obj, null, 2);
  const file = new File([text], name, { type: 'application/json' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: name });
      return 'gedeeld';
    } catch (e) {
      if (e && e.name === 'AbortError') return 'geannuleerd';
    }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return 'gedownload';
}

export async function exportBackup() {
  const now = new Date();
  const previous = { lastBackup: state.settings.lastBackup, backupReminderAt: state.settings.backupReminderAt };
  // De tijd van de back-up zit mee in de back-up, zodat herstellen exact dezelfde gegevens oplevert.
  await saveSettings({ lastBackup: now.toISOString(), backupReminderAt: null });
  const data = await db.exportAll();
  const backup = buildBackup(data, { version: self.KEEPER_VERSION, dbVersion: db.DB_VERSION, now });
  const result = await shareOrDownload(backupFileName(now), backup);
  if (result === 'geannuleerd') await saveSettings(previous);
  return result;
}

/** Leest een bestand in en vervangt alle gegevens. Geeft de statistieken terug. */
export async function importBackupFile(file) {
  const text = await file.text();
  const backup = parseBackup(text);
  await db.importAll(backup.data);
  await loadAll();
  // Teruggezette gegevens gaan ook naar de cloud (records die in de cloud recenter gewijzigd zijn, blijven daar winnen).
  await queueAll();
  scheduleSync(0);
  return backupStats(backup.data);
}

/** Toont af en toe een herinnering als er gegevens zijn en de laatste back-up te lang geleden is. */
export function maybeRemind(go) {
  const s = state.settings;
  const hasData = state.sessions.length > 0 || state.own.length > 0;
  if (!hasData) return;
  const day = 86400000;
  const last = s.lastBackup ? Date.parse(s.lastBackup) : 0;
  const reminded = s.backupReminderAt ? Date.parse(s.backupReminderAt) : 0;
  if (Date.now() - last < REMIND_DAYS * day || Date.now() - reminded < 3 * day) return;
  saveSettings({ backupReminderAt: new Date().toISOString() });
  toast(last ? 'Je laatste back-up is meer dan 2 weken oud.' : 'Je hebt nog geen back-up gemaakt.', {
    action: 'Back-up', onAction: go, duration: 7000
  });
}
