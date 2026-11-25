// Formulier voor trainingsparameters (doel, intensiteit, leeftijd, niveau, praktisch), gebruikt in trainingen en instellingen.
import { html } from '../ui.js';
import { THEMES, INTENSITIES, AGE_GROUPS, LEVELS, MATERIALS, SURFACES, KEEPER_RANGE, TRAINER_RANGE, TIME_RANGE } from '../logic/constants.js';
import { structuredCopy } from '../logic/session.js';
import { themeIcon } from '../ui.js';

const seg = (name, list, value) => html`<div class="seg" role="radiogroup">${list.map((x) => html`
  <label class="seg-opt"><input type="radio" name="${name}" value="${x.id}" ${x.id === value ? 'checked' : ''}><span>${x.label}</span></label>`)}</div>`;

const stepper = (name, value, [min, max], step = 1, unit = '') => html`<div class="stepper" data-stepper="${name}" data-min="${min}" data-max="${max}" data-step="${step}">
  <button type="button" class="btn" data-dir="-1" aria-label="Minder">−</button>
  <output name="${name}">${value}${unit ? ' ' + unit : ''}</output>
  <button type="button" class="btn" data-dir="1" aria-label="Meer">+</button></div>`;

export function paramsForm(p) {
  const int = INTENSITIES.find((i) => i.id === p.intensity) || INTENSITIES[1];
  return html`<form class="params" onsubmit="return false">
    <fieldset><legend>Hoofddoel</legend>
      <div class="theme-grid">${THEMES.map((t) => html`<label class="theme-opt" style="--tc:${t.color}"><input type="radio" name="mainTheme" value="${t.id}" ${t.id === p.mainTheme ? 'checked' : ''}><span>${themeIcon(t.id, 18)}${t.short}</span></label>`)}</div>
    </fieldset>
    <fieldset><legend>Extra thema's</legend>
      <div class="theme-grid">${THEMES.map((t) => html`<label class="theme-opt small" style="--tc:${t.color}"><input type="checkbox" name="themes" value="${t.id}" ${(p.themes || []).includes(t.id) || t.id === p.mainTheme ? 'checked' : ''} ${t.id === p.mainTheme ? 'disabled' : ''}><span>${t.short}</span></label>`)}</div>
    </fieldset>
    <fieldset><legend>Intensiteit</legend>${seg('intensity', INTENSITIES, p.intensity)}
      <p class="hint">Werk-rust ${int.workRest} · ${int.actions[0]}–${int.actions[1]} acties per serie · RPE ${int.rpe[0]}–${int.rpe[1]}</p></fieldset>
    <fieldset><legend>Leeftijdsgroep</legend>${seg('age', AGE_GROUPS, p.age)}</fieldset>
    <fieldset><legend>Niveau</legend>${seg('level', LEVELS, p.level)}</fieldset>
    <fieldset class="grid2"><legend>Praktisch</legend>
      <div><span class="label">Keepers</span>${stepper('keepers', p.keepers, KEEPER_RANGE)}</div>
      <div><span class="label">Trainers</span>${stepper('trainers', p.trainers, TRAINER_RANGE)}</div>
      <div class="span2"><span class="label">Beschikbare tijd</span>${stepper('time', p.time, TIME_RANGE, 5, 'min')}</div>
    </fieldset>
    <fieldset><legend>Materiaal</legend>
      <div class="checks">${MATERIALS.map((m) => html`<label class="check"><input type="checkbox" name="materials" value="${m.id}" ${(p.materials || []).includes(m.id) ? 'checked' : ''}><span>${m.label}</span></label>`)}</div>
    </fieldset>
    <fieldset><legend>Ondergrond</legend>${seg('surface', SURFACES, p.surface)}</fieldset>
  </form>`;
}

/** Koppelt het formulier: bij elke wijziging wordt onChange(nieuweParams) opgeroepen. */
export function bindParams(root, initial, onChange) {
  let p = structuredCopy(initial);
  const form = root.querySelector('form.params');
  const emit = () => onChange(structuredCopy(p));
  form.addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'mainTheme') {
      p.mainTheme = t.value;
      if (!p.themes.includes(t.value)) p.themes = [t.value, ...p.themes];
      form.querySelectorAll('input[name="themes"]').forEach((c) => { c.disabled = c.value === t.value; if (c.value === t.value) c.checked = true; });
    } else if (t.name === 'themes') {
      p.themes = [...form.querySelectorAll('input[name="themes"]:checked')].map((c) => c.value);
      if (!p.themes.includes(p.mainTheme)) p.themes.unshift(p.mainTheme);
    } else if (t.name === 'materials') {
      p.materials = [...form.querySelectorAll('input[name="materials"]:checked')].map((c) => c.value);
    } else if (['intensity', 'age', 'level', 'surface'].includes(t.name)) {
      p[t.name] = t.value;
      if (t.name === 'intensity') {
        const int = INTENSITIES.find((i) => i.id === t.value);
        form.querySelector('fieldset:nth-of-type(3) .hint').textContent = `Werk-rust ${int.workRest} · ${int.actions[0]}–${int.actions[1]} acties per serie · RPE ${int.rpe[0]}–${int.rpe[1]}`;
      }
    } else return;
    emit();
  });
  form.addEventListener('click', (e) => {
    const b = e.target.closest('[data-dir]');
    if (!b) return;
    const st = b.closest('[data-stepper]');
    const name = st.dataset.stepper;
    const v = Math.min(+st.dataset.max, Math.max(+st.dataset.min, (+p[name] || 0) + (+b.dataset.dir) * (+st.dataset.step)));
    p[name] = v;
    st.querySelector('output').textContent = v + (name === 'time' ? ' min' : '');
    emit();
  });
}
