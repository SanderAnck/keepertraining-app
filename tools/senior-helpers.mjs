// Gedeelde hulpfuncties voor de seniorenuitbreiding (tools/senior-*.mjs). Geen onderdeel van de app.

export const ALL = ['u6_9', 'u10_12', 'u13_15', 'u16_19', 'senioren'];
export const FROM13 = ALL.slice(2);
export const FROM16 = ALL.slice(3);
export const SEN = ['senioren'];
export const LV_ALL = ['beginner', 'gevorderd', 'elite'];
export const LV_ADV = ['gevorderd', 'elite'];
export const LV_MID = ['beginner', 'gevorderd'];
export const GEV = ['gevorderd'];

export const K = (x, y, label) => ({ t: 'keeper', x, y, ...(label ? { label } : {}) });
export const T = (x, y, label) => ({ t: 'trainer', x, y, ...(label ? { label } : {}) });
export const S = (x, y, label) => ({ t: 'speler', x, y, ...(label ? { label } : {}) });
export const A = (x, y, label) => ({ t: 'aanvaller', x, y, ...(label ? { label } : {}) });
export const B = (x, y) => ({ t: 'bal', x, y });
export const C = (x, y, label) => ({ t: 'pion', x, y, ...(label ? { label } : {}) });
export const H = (x, y) => ({ t: 'hoepel', x, y });
export const LAD = (x, y, r = 0) => ({ t: 'ladder', x, y, r });
export const HD = (x, y, r = 0) => ({ t: 'horde', x, y, r });
export const MG = (x, y, r = 0) => ({ t: 'minigoal', x, y, r });
export const RB = (x, y, r = 0) => ({ t: 'rebounder', x, y, r });
export const run = (s, ...p) => ({ t: 'loop', p, s });
export const pass = (s, ...p) => ({ t: 'bal', p, s });
export const drib = (s, ...p) => ({ t: 'dribbel', p, s });
export const D = (field, elements, lines) => ({ field, elements, lines });
export const F = (fault, fix) => ({ fault, fix });

/** Standaard voor de uitbreiding: senioren en U16–U19, gevorderd niveau. Elke oefening vermeldt enkel wat afwijkt. */
export const E = (o) => ({
  ages: FROM16, levels: LV_ADV, intensity: 'gemiddeld', materials: ['ballen'], keepers: { min: 1, max: 3 }, trainers: 1,
  zone: 'Doel en doelgebied', duration: 10, sets: 3, reps: 6, rest: 60, divesPerRep: 0, explosive: false,
  blockTypes: ['kern'], complexity: 2, ...o
});
