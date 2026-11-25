// Vaste lijsten van KeeperCoach: thema's, leeftijdsgroepen, niveaus, intensiteit, materiaal, ondergrond en bloktypes.
// Dit is de enige plaats waar deze waarden gedefinieerd worden; alle andere modules lezen ze hier.

export const THEMES = [
  { id: 'vangen', label: 'Basistechniek vangen', short: 'Vangen', color: '#2f80ed',
    icon: '<circle cx="12" cy="12" r="5"/><path d="M4 8c0-2 2-4 4-4M20 8c0-2-2-4-4-4M4 16c0 2 2 4 4 4M20 16c0 2-2 4-4 4"/>' },
  { id: 'duiken', label: 'Valtechniek en duiken', short: 'Duiken', color: '#eb5757',
    icon: '<path d="M3 19l7-6 4 3 7-9"/><circle cx="19" cy="5" r="2.5"/>' },
  { id: 'voetenwerk', label: 'Voetenwerk en positionering', short: 'Voetenwerk', color: '#27ae60',
    icon: '<ellipse cx="8" cy="8" rx="2.5" ry="4"/><ellipse cx="16" cy="15" rx="2.5" ry="4"/>' },
  { id: 'hogeballen', label: 'Hoge ballen en kruisballen', short: 'Hoge ballen', color: '#9b51e0',
    icon: '<path d="M3 20C6 6 18 6 21 14"/><circle cx="21" cy="17" r="2.5"/>' },
  { id: 'eentegeneen', label: '1-tegen-1 en uitkomen', short: '1-tegen-1', color: '#f2994a',
    icon: '<circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="3"/><path d="M9 12h6"/>' },
  { id: 'reflexen', label: 'Reflexen en reactiesnelheid', short: 'Reflexen', color: '#e2b400',
    icon: '<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>' },
  { id: 'distributie', label: 'Distributie (werpen, uittrap, inspelen)', short: 'Distributie', color: '#00a3a3',
    icon: '<path d="M4 18L18 6M18 6h-7M18 6v7"/>' },
  { id: 'opbouw', label: 'Opbouw van achteruit en meevoetballen', short: 'Opbouw', color: '#56ccf2',
    icon: '<circle cx="5" cy="18" r="2"/><circle cx="12" cy="10" r="2"/><circle cx="19" cy="5" r="2"/><path d="M6.5 16.5l4-5M13.5 8.5l4-2.5"/>' },
  { id: 'communicatie', label: 'Communicatie en coaching', short: 'Communicatie', color: '#bb6bd9',
    icon: '<path d="M4 5h16v10H9l-5 4z"/>' },
  { id: 'wedstrijd', label: 'Wedstrijdvoorbereiding', short: 'Wedstrijd', color: '#828282',
    icon: '<path d="M7 4h10v5a5 5 0 0 1-10 0zM12 14v4M8 20h8"/>' }
];

export const INTENSITIES = [
  { id: 'laag', label: 'Laag', rank: 1, workRest: '1:3', restFactor: 3, actions: [4, 6], rpe: [3, 4] },
  { id: 'gemiddeld', label: 'Gemiddeld', rank: 2, workRest: '1:2', restFactor: 2, actions: [6, 8], rpe: [5, 6] },
  { id: 'hoog', label: 'Hoog', rank: 3, workRest: '1:1', restFactor: 1, actions: [8, 12], rpe: [7, 8] }
];

// maxIntensity: hoogste toegelaten intensiteit; maxDives: richtwaarde duiken per sessie; youth: jeugdregels.
export const AGE_GROUPS = [
  { id: 'u6_9', label: 'U6–U9', rank: 1, maxIntensity: 'gemiddeld', maxDives: 12, maxSetSec: 60, youth: true },
  { id: 'u10_12', label: 'U10–U12', rank: 2, maxIntensity: 'hoog', maxDives: 30, maxSetSec: 90, youth: true },
  { id: 'u13_15', label: 'U13–U15', rank: 3, maxIntensity: 'hoog', maxDives: 45, maxSetSec: 120, youth: true },
  { id: 'u16_19', label: 'U16–U19', rank: 4, maxIntensity: 'hoog', maxDives: 70, maxSetSec: 180, youth: false },
  { id: 'senioren', label: 'Senioren', rank: 5, maxIntensity: 'hoog', maxDives: 90, maxSetSec: 180, youth: false }
];

export const LEVELS = [
  { id: 'beginner', label: 'Beginner', rank: 1 },
  { id: 'gevorderd', label: 'Gevorderd', rank: 2 },
  { id: 'elite', label: 'Competitief / elite', rank: 3 }
];

export const MATERIALS = [
  { id: 'ballen', label: 'Ballen' },
  { id: 'pionnen', label: 'Pionnen' },
  { id: 'hoepels', label: 'Hoepels' },
  { id: 'ladders', label: 'Ladders' },
  { id: 'hordes', label: 'Hordes' },
  { id: 'rebounder', label: 'Rebounder' },
  { id: 'minigoals', label: 'Mini-goals' }
];

export const SURFACES = [
  { id: 'gras', label: 'Gras' },
  { id: 'kunstgras', label: 'Kunstgras' },
  { id: 'indoor', label: 'Indoor' }
];

export const BLOCK_TYPES = [
  { id: 'opwarming', label: 'Opwarming' },
  { id: 'kern', label: 'Kern' },
  { id: 'afsluiting', label: 'Afsluiting' }
];

export const VARIANTS = [
  { id: 'makkelijker', label: 'Makkelijker', rpeDelta: -1 },
  { id: 'basis', label: 'Basis', rpeDelta: 0 },
  { id: 'moeilijker', label: 'Moeilijker', rpeDelta: 1 }
];

export const FIELD_TYPES = [
  { id: 'doel', label: 'Doel en doelgebied' },
  { id: 'zestien', label: 'Strafschopgebied' },
  { id: 'halfveld', label: 'Halve veld' },
  { id: 'vrij', label: 'Vrije zone' }
];

export const DIAGRAM_ELEMENTS = [
  { id: 'keeper', label: 'Keeper' },
  { id: 'trainer', label: 'Trainer / schutter' },
  { id: 'speler', label: 'Medespeler' },
  { id: 'aanvaller', label: 'Aanvaller' },
  { id: 'bal', label: 'Bal' },
  { id: 'pion', label: 'Pion' },
  { id: 'hoepel', label: 'Hoepel' },
  { id: 'ladder', label: 'Ladder' },
  { id: 'horde', label: 'Horde' },
  { id: 'minigoal', label: 'Mini-goal' },
  { id: 'rebounder', label: 'Rebounder' }
];

export const LINE_TYPES = [
  { id: 'loop', label: 'Loopbeweging keeper' },
  { id: 'bal', label: 'Baltraject (pass of schot)' },
  { id: 'dribbel', label: 'Dribbel' }
];

export const KEEPER_RANGE = [1, 6];
export const TRAINER_RANGE = [1, 2];
export const TIME_RANGE = [30, 120];

export const DEFAULT_PARAMS = {
  themes: ['vangen'],
  mainTheme: 'vangen',
  intensity: 'gemiddeld',
  age: 'u13_15',
  level: 'gevorderd',
  keepers: 2,
  trainers: 1,
  time: 60,
  materials: ['ballen', 'pionnen', 'hoepels'],
  surface: 'gras'
};

const index = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
export const THEME = index(THEMES);
export const INTENSITY = index(INTENSITIES);
export const AGE = index(AGE_GROUPS);
export const LEVEL = index(LEVELS);
export const MATERIAL = index(MATERIALS);
export const SURFACE = index(SURFACES);
export const BLOCK = index(BLOCK_TYPES);
export const VARIANT = index(VARIANTS);

export const labelOf = (list, id) => (list.find((x) => x.id === id) || {}).label || id;
