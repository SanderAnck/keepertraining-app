// Bron van de seedbibliotheek: genereert data/exercises.json. Uitvoeren met `node tools/build-exercises.mjs`.
// Geen onderdeel van de app zelf (geen build-stap nodig): het JSON-bestand wordt mee gecommit.
import { writeFileSync } from 'node:fs';

const ALL = ['u6_9', 'u10_12', 'u13_15', 'u16_19', 'senioren'];
const FROM10 = ALL.slice(1);
const FROM13 = ALL.slice(2);
const UPTO12 = ALL.slice(0, 2);
const LV_ALL = ['beginner', 'gevorderd', 'elite'];
const LV_ADV = ['gevorderd', 'elite'];
const LV_LOW = ['beginner', 'gevorderd'];

// Diagramhelpers (coördinaten 0–100)
const K = (x, y, label) => ({ t: 'keeper', x, y, ...(label ? { label } : {}) });
const T = (x, y, label) => ({ t: 'trainer', x, y, ...(label ? { label } : {}) });
const S = (x, y, label) => ({ t: 'speler', x, y, ...(label ? { label } : {}) });
const A = (x, y, label) => ({ t: 'aanvaller', x, y, ...(label ? { label } : {}) });
const B = (x, y) => ({ t: 'bal', x, y });
const C = (x, y, label) => ({ t: 'pion', x, y, ...(label ? { label } : {}) });
const H = (x, y) => ({ t: 'hoepel', x, y });
const LAD = (x, y, r = 0) => ({ t: 'ladder', x, y, r });
const HD = (x, y, r = 0) => ({ t: 'horde', x, y, r });
const MG = (x, y, r = 0) => ({ t: 'minigoal', x, y, r });
const RB = (x, y, r = 0) => ({ t: 'rebounder', x, y, r });
const run = (s, ...p) => ({ t: 'loop', p, s });
const pass = (s, ...p) => ({ t: 'bal', p, s });
const drib = (s, ...p) => ({ t: 'dribbel', p, s });
const D = (field, elements, lines) => ({ field, elements, lines });

const ex = [
  {
    id: 'mobiliteit-pionnen', name: 'Mobiliteit en loopscholing langs pionnen',
    summary: 'Rustige opwarming met loopscholing en mobiliteitsoefeningen langs een rij pionnen.',
    description: 'Zet zes pionnen in een zigzag op 4 meter van elkaar. De keeper loopt de zigzag met telkens een andere opdracht: knieheffen, hielen naar de billen, zijwaarts kruispas, armcirkels voorwaarts en achterwaarts, heupopener (poort open, poort dicht) en een lichte versnelling op het einde. Terug wandelen is de rust.',
    themes: ['voetenwerk'], ages: ALL, levels: LV_ALL, intensity: 'laag', materials: ['pionnen'],
    keepers: { min: 1, max: 6 }, trainers: 1, zone: '20 × 10 m', duration: 6, sets: 6, reps: 1, rest: 15,
    divesPerRep: 0, explosive: false, blockTypes: ['opwarming'], warmup: ['mobiliteit'], complexity: 1,
    coaching: ['Rechtop, borst vooruit', 'Op de voorvoet blijven', 'Armen actief mee', 'Rustig opbouwen naar tempo'],
    mistakes: [
      { fault: 'Platvoets lopen', fix: 'Laat de hielen net los van de grond, alsof je op eieren loopt.' },
      { fault: 'Te snel starten', fix: 'Eerste twee reeksen op halve snelheid, dan pas versnellen.' }
    ],
    variants: { easier: 'Vier pionnen en enkel lopen, knieheffen en armcirkels. Voor U6–U9 als "volg de leider".', harder: 'Elke pion een lage kniebuiging en op het einde een korte sprint van 5 meter.' },
    diagram: D('vrij', [K(8, 50), C(18, 35), C(32, 65), C(46, 35), C(60, 65), C(74, 35), C(88, 65)],
      [run(1, [8, 50], [18, 42], [32, 58], [46, 42], [60, 58], [74, 42], [86, 56])])
  },
  {
    id: 'balgewenning-duo', name: 'Balgewenning in duo\'s',
    summary: 'Twee keepers gooien elkaar de bal toe op verschillende hoogtes om handen en ogen op te warmen.',
    description: 'Twee keepers staan op 6 tot 8 meter van elkaar. Ze werpen de bal onderhands op borsthoogte, dan op buikhoogte, dan rollend en tot slot boven het hoofd. Na elke tien ballen wisselt de opdracht. Met één keeper gooit de trainer de ballen aan.',
    themes: ['vangen'], ages: ALL, levels: LV_ALL, intensity: 'laag', materials: ['ballen'],
    keepers: { min: 1, max: 6 }, trainers: 1, zone: '8 × 4 m per duo', duration: 6, sets: 3, reps: 10, rest: 20,
    divesPerRep: 0, explosive: false, blockTypes: ['opwarming'], warmup: ['balgewenning'], complexity: 1,
    coaching: ['Handen achter de bal', 'Duimen tegen elkaar (W)', 'Bal naar het lichaam trekken'],
    mistakes: [
      { fault: 'Bal vangen met gestrekte armen en harde handen', fix: 'Ellebogen licht gebogen en de bal "zacht" laten landen.' },
      { fault: 'Ogen weg van de bal', fix: 'Kijk de bal tot in de handen, roep "ja" bij het vangen.' }
    ],
    variants: { easier: 'Kortere afstand (4 m) en enkel borsthoogte. Grotere of zachtere bal voor de jongsten.', harder: 'Twee ballen tegelijk of na elke vangbal een zijwaartse pas.' },
    diagram: D('vrij', [K(22, 50, 'K1'), K(78, 50, 'K2'), B(27, 44)],
      [pass(1, [26, 44], [74, 44]), pass(2, [74, 57], [26, 57])])
  },
  {
    id: 'valvormen-kniestand', name: 'Lichte valvormen vanuit zit en kniestand',
    summary: 'Opbouw van de valtechniek: eerst vanuit zit, dan vanuit kniestand en hurkzit, naar een bal naast het lichaam.',
    description: 'De keeper zit op de grond, de trainer rolt of werpt de bal op 1 meter naast de keeper. De keeper rolt over de zijkant naar de bal: eerst vanuit zit, dan vanuit kniestand en tot slot vanuit hurkzit. Telkens afwisselend links en rechts. Dit is de verplichte lichte valvorm in de opwarming.',
    themes: ['duiken'], ages: ALL, levels: LV_ALL, intensity: 'laag', materials: ['ballen'],
    keepers: { min: 1, max: 4 }, trainers: 1, zone: '6 × 6 m', duration: 6, sets: 3, reps: 6, rest: 30,
    divesPerRep: 0.5, explosive: false, blockTypes: ['opwarming'], warmup: ['valvorm'], complexity: 1,
    coaching: ['Landen op de zijkant', 'Bal vóór het lichaam', 'Onderste hand achter de bal', 'Zachte landing, geen buik'],
    mistakes: [
      { fault: 'Landen op de elleboog of de buik', fix: 'Laat de heup en de zijkant van de romp eerst landen, de armen blijven aan de bal.' },
      { fault: 'Bal tegen de grond slaan', fix: 'Bovenste hand op de bal, onderste hand erachter: de grond is je derde hand.' }
    ],
    variants: { easier: 'Enkel vanuit zit, bal stilliggend naast de keeper.', harder: 'Vanuit hurkzit met een kleine afzet, bal iets verder (1,5 m).' },
    diagram: D('vrij', [K(50, 40), T(50, 88), B(46, 84)],
      [pass(1, [48, 84], [32, 46]), run(2, [46, 41], [34, 46]), pass(3, [52, 84], [68, 46]), run(4, [54, 41], [66, 46])])
  },
  {
    id: 'vangen-w-greep-kom', name: 'Vangen in W-greep en kom',
    summary: 'Ballen op borst- en hoofdhoogte vangen in W-greep, ballen op buikhoogte in de kom.',
    description: 'De trainer staat op 8 tot 10 meter en werpt of schiet afwisselend op hoofdhoogte (W-greep), borsthoogte (W-greep) en buikhoogte (kom met de onderarmen). De keeper zet bij elke bal een kleine stap naar voren en vangt in balans. Na elke vangbal terug in de basishouding.',
    themes: ['vangen'], ages: ALL, levels: LV_ALL, intensity: 'gemiddeld', materials: ['ballen'],
    keepers: { min: 1, max: 3 }, trainers: 1, zone: 'Doel en doelgebied', duration: 8, sets: 3, reps: 8, rest: 40,
    divesPerRep: 0, explosive: false, blockTypes: ['opwarming', 'kern'], complexity: 1,
    coaching: ['Eerste stap naar voren', 'Handen achter de bal', 'Duimen en wijsvingers vormen een W', 'Bal meteen tegen de borst'],
    mistakes: [
      { fault: 'Achteruit vangen of op de hielen staan', fix: 'Gewicht op de voorvoet, kleine stap naar de bal toe.' },
      { fault: 'Handen naast de bal', fix: 'Handen achter de bal, vingers gespreid naar boven.' },
      { fault: 'Kom met gespreide armen', fix: 'Ellebogen bij elkaar zodat de bal niet door de armen glipt.' }
    ],
    variants: { easier: 'Werpen in plaats van schieten, afstand 6 m, één hoogte per serie.', harder: 'Harder schieten, hoogte niet aankondigen, start vanuit zijwaartse pas.' },
    diagram: D('doel', [K(50, 12), T(50, 62), B(50, 57)],
      [run(1, [50, 13], [50, 20]), pass(2, [50, 56], [50, 24])])
  },
  {
    id: 'afrollen-oprapen', name: 'Rollende ballen oprapen',
    summary: 'Rollende ballen recht op de keeper oprapen met gesloten benen of in de knielvorm.',
    description: 'De trainer rolt de bal vanop 10 meter door een poortje van pionnen. De keeper komt een stap naar voren en raapt de bal op: bij jonge keepers met gesloten benen en gebogen rug (handen als een schep), bij oudere keepers in de knielvorm (knie naast de hiel, geen opening). Na het oprapen rolt de keeper de bal terug.',
    themes: ['vangen'], ages: ALL, levels: LV_LOW, intensity: 'laag', materials: ['ballen', 'pionnen'],
    keepers: { min: 1, max: 4 }, trainers: 1, zone: '10 × 6 m', duration: 6, sets: 3, reps: 8, rest: 30,
    divesPerRep: 0, explosive: false, blockTypes: ['opwarming', 'kern'], warmup: ['balgewenning'], complexity: 1,
    coaching: ['Achter de bal komen', 'Geen gat tussen de benen', 'Handen als een schep', 'Bal tegen de borst'],
    mistakes: [
      { fault: 'Bal naast het lichaam oprapen', fix: 'Eerst voetenwerk: zorg dat het lichaam achter de bal zit.' },
      { fault: 'Opening tussen de benen in de knielvorm', fix: 'Knie naast de hiel van de andere voet zetten.' }
    ],
    variants: { easier: 'Langzaam rollen en vanop 5 m, als spel: wie raapt er 10 zonder fout?', harder: 'Bal stuitert vlak voor de keeper of rolt schuin, zodat hij eerst moet verplaatsen.' },
    diagram: D('doel', [K(50, 12), T(50, 66), B(50, 61), C(43, 40), C(57, 40)],
      [pass(1, [50, 60], [50, 26]), run(2, [50, 13], [50, 21])])
  },
  {
    id: 'vangen-na-draai', name: 'Vangen na een draai',
    summary: 'De keeper staat met de rug naar de trainer, draait op het signaal en vangt de bal.',
    description: 'De keeper staat met de rug naar de trainer, 6 tot 8 meter van hem. Op "draai!" draait de keeper zich om, zoekt meteen de bal en vangt hem. De trainer werpt pas wanneer de keeper bijna rond is. Wissel de draairichting af.',
    themes: ['vangen', 'reflexen'], ages: ALL, levels: LV_ALL, intensity: 'gemiddeld', materials: ['ballen'],
    keepers: { min: 1, max: 3 }, trainers: 1, zone: 'Doel en doelgebied', duration: 6, sets: 3, reps: 6, rest: 40,
    divesPerRep: 0, explosive: false, blockTypes: ['kern'], complexity: 2,
    coaching: ['Snel het hoofd eerst draaien', 'Klein in balans landen', 'Handen al omhoog bij het draaien'],
    mistakes: [
      { fault: 'Te ver doordraaien en uit balans', fix: 'Draai op de voorvoeten en stop in de basishouding.' },
      { fault: 'Handen pas laat omhoog', fix: 'Handen tijdens de draai al voor de borst brengen.' }
    ],
    variants: { easier: 'Trainer roept de kant en wacht tot de keeper helemaal rond is.', harder: 'Bal meteen gooien of laten stuiteren, ook laag of hoog.' },
    diagram: D('doel', [K(50, 18), T(50, 60), B(50, 55)],
      [run(1, [56, 14], [60, 19], [56, 24]), pass(2, [50, 54], [50, 27])])
  },
  {
    id: 'zijwaarts-laag-duiken', name: 'Zijwaartse duik naar lage ballen',
    summary: 'Lage ballen naast de keeper met een zijwaartse duik, afwisselend links en rechts.',
    description: 'De trainer staat op 8 meter en werpt of schiet laag naast de keeper, net binnen bereik. De keeper zet een kleine stap naar de bal (stap naar voren-opzij), duikt en landt op de zijkant met de bal vóór zich. Opstaan, terug naar het midden, volgende bal naar de andere kant.',
    themes: ['duiken'], ages: FROM10, levels: LV_ALL, intensity: 'gemiddeld', materials: ['ballen'],
    keepers: { min: 1, max: 3 }, trainers: 1, zone: 'Doel en doelgebied', duration: 8, sets: 3, reps: 6, rest: 60,
    divesPerRep: 1, explosive: false, blockTypes: ['kern'], complexity: 2,
    coaching: ['Stap schuin naar voren', 'Landen op de zijkant', 'Handen eerst naar de bal', 'Snel terug recht'],
    mistakes: [
      { fault: 'Achteruit vallen in plaats van naar de bal', fix: 'Afzetten van het been aan de balkant, schuin naar voren.' },
      { fault: 'Bal klemmen onder het lichaam', fix: 'Bal vóór het lichaam houden, bovenste hand bovenop.' }
    ],
    variants: { easier: 'Werpen in plaats van schieten en starten vanuit kniestand.', harder: 'Harder en verder naast de keeper, met een tweede bal kort na de eerste.' },
    diagram: D('doel', [K(50, 12), T(50, 62), B(50, 57)],
      [pass(1, [48, 56], [40, 14]), run(2, [48, 12], [41, 15]), pass(3, [52, 56], [60, 14]), run(4, [52, 12], [59, 15])])
  },
  {
    id: 'hoepels-duik', name: 'Voetenwerk door hoepels en duik',
    summary: 'Zijwaarts door een rij hoepels langs de doellijn, dan een duik naar de bal in de verste hoek.',
    description: 'Drie hoepels liggen evenwijdig aan de doellijn. De keeper start aan de eerste paal, stapt zijwaarts met korte pasjes in elke hoepel en duikt na de laatste hoepel naar de bal die de trainer naar de verste hoek speelt. Terug wandelen langs de andere kant is de rust.',
    themes: ['duiken', 'voetenwerk'], ages: FROM10, levels: LV_ADV, intensity: 'gemiddeld', materials: ['ballen', 'hoepels'],
    keepers: { min: 1, max: 3 }, trainers: 1, zone: 'Doel en doelgebied', duration: 8, sets: 3, reps: 6, rest: 60,
    divesPerRep: 1, explosive: false, blockTypes: ['kern'], complexity: 2,
    coaching: ['Korte, snelle pasjes', 'Schouders naar het veld', 'Laatste pas is de afzet', 'Landen op de zijkant'],
    mistakes: [
      { fault: 'Benen kruisen in de hoepels', fix: 'Altijd bijzetten, nooit kruisen: zo blijf je in balans.' },
      { fault: 'Stilstaan voor de duik', fix: 'Laatste hoepel = afzet, zonder extra pas.' }
    ],
    variants: { easier: 'Twee hoepels en de bal rollend toespelen.', harder: 'Bal op halve hoogte of de trainer kiest pas op het laatste moment de hoek.' },
    diagram: D('doel', [K(37, 16), H(44, 16), H(50, 16), H(56, 16), T(50, 64), B(50, 59)],
      [run(1, [38, 16], [44, 16], [50, 16], [56, 16]), pass(2, [52, 58], [61, 11]), run(3, [57, 16], [62, 12])])
  },
  {
    id: 'hoge-duik-hoek', name: 'Hoge duik naar de bovenhoek',
    summary: 'Explosieve duik naar ballen in de bovenhoek, met afzet van het been aan de balkant.',
    description: 'De trainer schiet of werpt vanop 11 meter naar de bovenhoek. De keeper start in de basishouding in het midden van het doel, zet een kleine voorbereidende stap en zet explosief af naar de bal. Hij vangt of tikt de bal over of naast het doel. Volledige rust tussen elke duik, want dit is zeer explosief.',
    themes: ['duiken'], ages: FROM13, levels: LV_ADV, intensity: 'hoog', materials: ['ballen'],
    keepers: { min: 1, max: 2 }, trainers: 1, zone: 'Doel en doelgebied', duration: 8, sets: 2, reps: 5, rest: 90,
    divesPerRep: 1, explosive: true, blockTypes: ['kern'], complexity: 2,
    coaching: ['Afzet met het been aan de balkant', 'Bovenste hand eerst', 'Hoofd achter de bal', 'Tik de bal weg van het doel'],
    mistakes: [
      { fault: 'Afzetten met het verkeerde been (kruisen)', fix: 'Laatste stap met het been aan de kant van de bal.' },
      { fault: 'Achterwaarts duiken', fix: 'Duik schuin naar voren, naar de paal toe.' }
    ],
    variants: { easier: 'Op halve hoogte en vanop een mat of zachte ondergrond, werpen in plaats van schieten.', harder: 'Start vanuit een zijwaartse verplaatsing of na een eerste reddingsactie.' },
    diagram: D('doel', [K(50, 12), T(50, 64), B(50, 59)],
      [pass(1, [51, 58], [60, 7]), run(2, [52, 12], [59, 9]), pass(3, [49, 58], [40, 7]), run(4, [48, 12], [41, 9])])
  },
  {
    id: 'ladder-schot', name: 'Ladder en afwerking op doel',
    summary: 'Snelle voetjes door de ladder, terug naar doel en meteen een schot verwerken.',
    description: 'Een ladder ligt evenwijdig aan de doellijn op 8 meter. De keeper doet een ladderpatroon (zijwaarts in-in-uit-uit), sprint terug naar zijn positie in doel en verwerkt het schot van de trainer die ondertussen klaarstaat. Varieer het ladderpatroon per serie.',
    themes: ['voetenwerk'], ages: FROM10, levels: LV_ALL, intensity: 'gemiddeld', materials: ['ballen', 'ladders'],
    keepers: { min: 1, max: 4 }, trainers: 1, zone: '16 × 10 m', duration: 8, sets: 3, reps: 6, rest: 45,
    divesPerRep: 0.5, explosive: false, blockTypes: ['kern', 'opwarming'], complexity: 2,
    coaching: ['Korte grondcontacten', 'Kijk op tijd naar de bal', 'In balans voor het schot', 'Basishouding bij het schot'],
    mistakes: [
      { fault: 'Nog in beweging bij het schot', fix: 'Kleine sprongstop (split step) net voor de trainer schiet.' },
      { fault: 'Naar de voeten kijken in de ladder', fix: 'Blik vooruit, de voeten weten de weg.' }
    ],
    variants: { easier: 'Enkel vooruit door de ladder en een werpbal op het lichaam.', harder: 'Complex patroon (Ickey shuffle) en schot naar de hoek.' },
    diagram: D('doel', [LAD(50, 40), K(38, 40), T(50, 74), B(50, 69)],
      [run(1, [38, 40], [62, 40]), run(2, [62, 40], [52, 14]), pass(3, [50, 68], [45, 15])])
  },
  {
    id: 'positie-hoekpionnen', name: 'Positiespel tegenover de bal',
    summary: 'De trainer verplaatst de bal tussen pionnen op een boog; de keeper past telkens zijn positie aan.',
    description: 'Vijf pionnen staan in een boog rond het strafschopgebied. De trainer dribbelt van pion naar pion en schiet op een willekeurig moment. De keeper verplaatst mee op de denkbeeldige lijn tussen bal en midden van het doel en staat in de basishouding op het moment van het schot.',
    themes: ['voetenwerk'], ages: FROM10, levels: LV_ALL, intensity: 'gemiddeld', materials: ['ballen', 'pionnen'],
    keepers: { min: 1, max: 3 }, trainers: 1, zone: 'Strafschopgebied', duration: 8, sets: 3, reps: 6, rest: 45,
    divesPerRep: 0.5, explosive: false, blockTypes: ['kern'], complexity: 2,
    coaching: ['Op de lijn bal–midden doel', 'Kleine zijwaartse pasjes', 'Stilstaan bij het schot', 'Iets voor de lijn bij een schuine hoek'],
    mistakes: [
      { fault: 'Te diep op de doellijn blijven staan', fix: 'Stap 1 à 2 meter uit doel bij een centrale bal.' },
      { fault: 'Bewegen tijdens het schot', fix: 'Lees de trainer: bij het uithalen sta je stil.' }
    ],
    variants: { easier: 'Trainer stopt bij elke pion en roept "nu" voor hij schiet.', harder: 'Trainer mag ook passen naar een tweede schutter of een voorzet geven.' },
    diagram: D('zestien', [K(50, 12), C(18, 50), C(32, 64), C(50, 70), C(68, 64), C(82, 50), T(18, 46), B(21, 50)],
      [drib(1, [22, 50], [32, 60]), run(1, [50, 12], [46, 13]), pass(2, [33, 60], [45, 8])])
  },
  {
    id: 'horden-reactie', name: 'Hordesprongen en reactiebal',
    summary: 'Zijwaartse sprongen over lage hordes, meteen gevolgd door een bal naar de korte hoek.',
    description: 'Drie lage hordes staan op een rij evenwijdig aan de doellijn. De keeper springt zijwaarts over de hordes (twee voeten, snel grondcontact) en verwerkt meteen daarna de bal die de trainer naar de korte hoek speelt. Daarna volledige rust: dit is explosief werk.',
    themes: ['voetenwerk', 'reflexen'], ages: FROM13, levels: LV_ADV, intensity: 'hoog', materials: ['ballen', 'hordes'],
    keepers: { min: 1, max: 3 }, trainers: 1, zone: 'Doel en doelgebied', duration: 8, sets: 3, reps: 5, rest: 75,
    divesPerRep: 1, explosive: true, blockTypes: ['kern'], complexity: 2,
    coaching: ['Kort en krachtig landen', 'Romp rechtop', 'Na de laatste horde meteen de bal zoeken'],
    mistakes: [
      { fault: 'Te hoge, trage sprongen', fix: 'Net over de horde, zo kort mogelijk grondcontact.' },
      { fault: 'Pas na de landing naar de bal kijken', fix: 'Hoofd draait al naar de trainer tijdens de laatste sprong.' }
    ],
    variants: { easier: 'Pionnen in plaats van hordes en een werpbal op het lichaam.', harder: 'Na de bal meteen een tweede bal naar de andere hoek.' },
    diagram: D('doel', [HD(42, 30, 90), HD(50, 30, 90), HD(58, 30, 90), K(36, 30), T(50, 70), B(50, 65)],
      [run(1, [37, 30], [46, 30], [54, 30], [63, 30]), pass(2, [52, 64], [60, 12]), run(3, [63, 28], [60, 16])])
  },
  {
    id: 'hoge-bal-hoogste-punt', name: 'Hoge bal vangen op het hoogste punt',
    summary: 'Hoge ballen vangen boven het hoofd met een afzet op één been en de knie omhoog.',
    description: 'De trainer werpt hoge ballen vanop 10 tot 12 meter in het doelgebied. De keeper neemt een aanloop van twee of drie passen, zet af op één been, brengt de knie van het andere been omhoog ter bescherming en vangt de bal op het hoogste punt vóór het hoofd.',
    themes: ['hogeballen'], ages: FROM10, levels: LV_ALL, intensity: 'gemiddeld', materials: ['ballen'],
    keepers: { min: 1, max: 3 }, trainers: 1, zone: 'Doelgebied', duration: 8, sets: 3, reps: 6, rest: 45,
    divesPerRep: 0, explosive: false, blockTypes: ['kern'], complexity: 1,
    coaching: ['Vangen vóór het hoofd', 'Knie omhoog ter bescherming', 'Afzet op één been', 'Bal meteen naar de borst'],
    mistakes: [
      { fault: 'Wachten tot de bal zakt', fix: 'Vertrek vroeg en vang de bal op het hoogste punt.' },
      { fault: 'Afzet op twee benen', fix: 'Eén been afzetten, de andere knie omhoog: hoger en veiliger.' }
    ],
    variants: { easier: 'Lagere ballen, stilstaand vangen boven het hoofd.', harder: 'Met een tegenstander (pad of trainer) die licht duwt, of ballen met meer effect.' },
    diagram: D('doel', [K(50, 12), T(50, 66), B(50, 61)],
      [pass(1, [50, 60], [50, 40], [52, 26]), run(2, [50, 13], [52, 24])])
  },
  {
    id: 'kruisballen-flank', name: 'Kruisballen vanaf de flank',
    summary: 'Voorzetten vanaf de flank onderscheppen: lezen, starten, vangen of wegboksen.',
    description: 'De trainer geeft voorzetten vanaf de rechter- en linkerflank, ter hoogte van de zestien. De keeper staat iets naar de tweede paal, leest de baan van de bal, roept "keeper!" en onderschept de bal op het hoogste punt. Wat niet veilig te vangen is, wordt weggebokst naar de zijkant.',
    themes: ['hogeballen'], ages: FROM13, levels: LV_ADV, intensity: 'gemiddeld', materials: ['ballen', 'pionnen'],
    keepers: { min: 1, max: 3 }, trainers: 1, zone: 'Strafschopgebied', duration: 10, sets: 2, reps: 8, rest: 60,
    divesPerRep: 0, explosive: false, blockTypes: ['kern'], complexity: 3,
    coaching: ['Startpositie iets naar de tweede paal', 'Eerst lezen, dan vertrekken', 'Luid "keeper!" roepen', 'Niet zeker? Wegboksen naar de zijkant'],
    mistakes: [
      { fault: 'Te vroeg vertrekken en onder de bal door lopen', fix: 'Eerst de baan lezen, dan pas starten.' },
      { fault: 'Op de lijn blijven bij een bal in het doelgebied', fix: 'Het doelgebied is jouw zone: kom eruit.' }
    ],
    variants: { easier: 'Voorzet werpen vanaf 15 meter, zonder tegenstand.', harder: 'Met een aanvaller en een verdediger in het doelgebied.' },
    diagram: D('zestien', [K(52, 10), T(88, 40), B(86, 36), C(90, 46)],
      [pass(1, [85, 36], [70, 22], [56, 20]), run(2, [52, 11], [56, 18])])
  },
  {
    id: 'wegboksen-druk', name: 'Wegboksen onder druk',
    summary: 'Voorzetten wegboksen met twee vuisten of één vuist terwijl een tegenstander hindert.',
    description: 'De trainer geeft voorzetten vanaf de flank. Een tweede keeper speelt aanvaller en staat in het doelgebied om licht te hinderen. De keeper komt uit, roept en bokst de bal met twee vuisten terug in de richting van de bal of met één vuist verder door naar de andere flank. Wissel van rol na elke serie.',
    themes: ['hogeballen', 'communicatie'], ages: FROM13, levels: LV_ADV, intensity: 'hoog', materials: ['ballen'],
    keepers: { min: 2, max: 4 }, trainers: 1, zone: 'Strafschopgebied', duration: 10, sets: 3, reps: 6, rest: 60,
    divesPerRep: 0, explosive: true, blockTypes: ['kern'], complexity: 3,
    coaching: ['Hoog en ver wegboksen', 'Twee vuisten bij een bal van voren', 'Knie omhoog', 'Luid roepen voor je vertrekt'],
    mistakes: [
      { fault: 'Boksen in plaats van vangen bij een makkelijke bal', fix: 'Vangen als het kan, boksen als het moet.' },
      { fault: 'Bal centraal terugboksen', fix: 'Naar de zijkant, hoog en ver: tijd winnen.' }
    ],
    variants: { easier: 'Zonder tegenstander en met geworpen voorzetten.', harder: 'Twee aanvallers of voorzetten met meer snelheid naar de eerste paal.' },
    diagram: D('zestien', [K(50, 10), A(54, 22, 'K2'), T(88, 40), B(86, 36)],
      [pass(1, [85, 36], [62, 19]), run(2, [50, 11], [58, 17]), pass(3, [59, 16], [80, 50])])
  },
  {
    id: 'uitkomen-blok', name: '1-tegen-1: uitkomen en blokkeren',
    summary: 'Een aanvaller dribbelt op doel; de keeper komt uit, verkleint de hoek en blokkeert in een stervorm of knielblok.',
    description: 'De aanvaller (trainer) start op 25 meter en dribbelt op doel. De keeper komt uit zolang de bal ver van de voet van de aanvaller is, remt af in de basishouding op 5 à 6 meter en blijft lang staan. Bij het schot blokkeert hij met een stervorm of knielblok. Schiet de aanvaller niet, dan duikt de keeper in de voeten.',
    themes: ['eentegeneen'], ages: FROM13, levels: LV_ADV, intensity: 'hoog', materials: ['ballen', 'pionnen'],
    keepers: { min: 1, max: 3 }, trainers: 1, zone: 'Strafschopgebied', duration: 10, sets: 3, reps: 5, rest: 75,
    divesPerRep: 0.5, explosive: true, blockTypes: ['kern'], complexity: 3,
    coaching: ['Uitkomen als de bal los is', 'Remmen en lang blijven staan', 'Groot maken: stervorm', 'Hoek verkleinen'],
    mistakes: [
      { fault: 'Doorlopen tot op de voeten en voorbijgespeeld worden', fix: 'Afremmen en in basishouding wachten op de fout van de aanvaller.' },
      { fault: 'Te vroeg gaan liggen', fix: 'Blijf staan tot de aanvaller schiet of de bal te ver voorlegt.' }
    ],
    variants: { easier: 'Aanvaller dribbelt aan wandeltempo en schiet op een vast punt.', harder: 'Aanvaller mag ook afwerken met een stift of de keeper omspelen.' },
    diagram: D('zestien', [K(50, 9), A(50, 82), B(50, 77), C(44, 84), C(56, 84)],
      [drib(1, [50, 76], [50, 48]), run(1, [50, 10], [50, 26]), pass(2, [50, 46], [44, 8])])
  },
  {
    id: 'duik-in-de-voeten', name: 'Uitkomen in de voeten',
    summary: 'De keeper duikt veilig in de voeten van een aanvaller die de bal te ver voorlegt.',
    description: 'De trainer dribbelt vanop 15 meter op doel en legt de bal bewust te ver voor zich. De keeper komt uit en duikt zijwaarts met het lichaam dwars op de looprichting, handen eerst naar de bal, hoofd achter de armen. Zo is de keeper veilig en groot.',
    themes: ['eentegeneen', 'duiken'], ages: FROM10, levels: LV_ALL, intensity: 'gemiddeld', materials: ['ballen'],
    keepers: { min: 1, max: 3 }, trainers: 1, zone: 'Doel en doelgebied', duration: 8, sets: 3, reps: 5, rest: 60,
    divesPerRep: 1, explosive: false, blockTypes: ['kern'], complexity: 2,
    coaching: ['Handen eerst naar de bal', 'Lichaam dwars op de aanvaller', 'Hoofd achter de armen', 'Durven gaan'],
    mistakes: [
      { fault: 'Met het hoofd eerst duiken', fix: 'Handen en armen vooraan, hoofd beschermd erachter.' },
      { fault: 'Recht op de aanvaller vallen', fix: 'Zijwaarts liggen, zo blokkeer je de breedte.' }
    ],
    variants: { easier: 'Stilliggende bal, keeper duikt erop vanuit kniestand.', harder: 'De aanvaller beslist zelf: voorleggen, schieten of uitspelen.' },
    diagram: D('doel', [K(50, 12), A(50, 64), B(50, 58)],
      [drib(1, [50, 57], [50, 40]), run(2, [50, 13], [48, 34])])
  },
  {
    id: 'diepe-bal-onderscheppen', name: 'Diepe bal onderscheppen als vrije verdediger',
    summary: 'Een diepe bal achter de verdediging lezen en buiten de zestien onderscheppen met de voet.',
    description: 'De trainer speelt een lange bal vanaf de middenlijn in de ruimte achter een denkbeeldige verdediging. Een aanvaller sprint mee. De keeper staat hoog (rand van de zestien), leest de bal en beslist: uitkomen en wegtrappen of inspelen met de voet naar een medespeler op de flank, of terug naar doel.',
    themes: ['eentegeneen', 'opbouw'], ages: FROM13, levels: LV_ADV, intensity: 'gemiddeld', materials: ['ballen', 'pionnen'],
    keepers: { min: 1, max: 3 }, trainers: 1, zone: 'Halve veld', duration: 10, sets: 3, reps: 5, rest: 60,
    divesPerRep: 0, explosive: true, blockTypes: ['kern'], complexity: 3,
    coaching: ['Hoge startpositie', 'Snel beslissen: gaan of blijven', 'Eerste balcontact naar de zijkant', 'Daarna terug naar doel'],
    mistakes: [
      { fault: 'Twijfelen en halverwege blijven', fix: 'Beslis op de eerste meters van de bal en ga voluit.' },
      { fault: 'Centraal wegtrappen', fix: 'Naar de zijlijn of naar een vrije medespeler.' }
    ],
    variants: { easier: 'Zonder aanvaller en met een rollende bal.', harder: 'Aanvaller start dichterbij, of de bal stuitert zodat de keeper moet kiezen tussen hand en voet.' },
    diagram: D('halfveld', [K(50, 14), T(50, 92), B(50, 87), A(66, 70), S(88, 60), C(23.1, 34.3), C(76.9, 34.3)],
      [pass(1, [50, 86], [55, 48]), run(2, [50, 15], [54, 44]), pass(3, [56, 46], [85, 58])])
  },
  {
    id: 'rebounder-reactie', name: 'Reactieballen van de rebounder',
    summary: 'De trainer werpt tegen een rebounder; de keeper reageert op de onvoorspelbare terugkaatsing.',
    description: 'Een rebounder staat schuin voor het doel op 5 meter. De trainer staat erachter en werpt de bal hard tegen het net. De keeper ziet de bal pas laat en reageert op de terugkaatsing. Varieer de hoek en hoogte van de worp.',
    themes: ['reflexen'], ages: FROM10, levels: LV_ALL, intensity: 'gemiddeld', materials: ['ballen', 'rebounder'],
    keepers: { min: 1, max: 3 }, trainers: 1, zone: 'Doel en doelgebied', duration: 8, sets: 3, reps: 8, rest: 45,
    divesPerRep: 0.5, explosive: false, blockTypes: ['kern'], complexity: 2,
    coaching: ['Laag en breed staan', 'Handen vóór het lichaam', 'Op de voorvoeten', 'Reageren, niet gokken'],
    mistakes: [
      { fault: 'Handen naast de heupen', fix: 'Handen vóór het lichaam, klaar om te reageren.' },
      { fault: 'Al vertrekken voor de bal terugkaatst', fix: 'Wacht op de terugkaatsing, kleine sprongstop.' }
    ],
    variants: { easier: 'Rebounder verder weg (8 m) en zachter werpen.', harder: 'Rebounder dichterbij, twee ballen kort na elkaar of de keeper start met de rug naar de rebounder.' },
    diagram: D('doel', [K(50, 12), RB(50, 52), T(50, 78), B(50, 73)],
      [pass(1, [50, 72], [50, 56]), pass(2, [49, 49], [43, 14])])
  },
  {
    id: 'kort-schot-reflexen', name: 'Reflexen op korte afstand',
    summary: 'Snelle schoten van dichtbij (6 meter) op en naast het lichaam om de reactiesnelheid te trainen.',
    description: 'De trainer staat op 6 meter met een rij ballen. Hij schiet of volleert snel na elkaar op en naast het lichaam van de keeper. De keeper herstelt zich zo snel mogelijk na elke bal. Korte series, volledige rust.',
    themes: ['reflexen'], ages: FROM13, levels: LV_ADV, intensity: 'hoog', materials: ['ballen'],
    keepers: { min: 1, max: 2 }, trainers: 1, zone: 'Doelgebied', duration: 6, sets: 3, reps: 6, rest: 75,
    divesPerRep: 0.5, explosive: true, blockTypes: ['kern'], complexity: 2,
    coaching: ['Klein en compact staan', 'Handen vóór het lichaam', 'Snel herstellen', 'Bal weg van het doel'],
    mistakes: [
      { fault: 'Te diep in de knieën en traag', fix: 'Licht gebogen knieën, gewicht vooraan.' },
      { fault: 'Ogen dicht bij harde bal', fix: 'Blijf kijken: reageer op de bal, niet op het geluid.' }
    ],
    variants: { easier: 'Afstand 9 meter en werpen met de hand.', harder: 'Afstand 5 meter en twee schutters die om beurt schieten.' },
    diagram: D('doel', [K(50, 12), T(50, 46), B(46, 50), B(50, 51), B(54, 50)],
      [pass(1, [49, 42], [42, 13]), pass(2, [51, 42], [58, 13])])
  },
  {
    id: 'bal-achter-scherm', name: 'Schot achter een scherm',
    summary: 'Een medespeler staat als scherm voor de keeper; de keeper ziet de bal pas laat.',
    description: 'Een tweede keeper of medespeler staat met gespreide benen op 6 meter voor het doel. De trainer schiet vanop 14 meter langs of door de benen van het scherm. De keeper beweegt licht om de bal zo vroeg mogelijk te zien en reageert pas als de bal het scherm voorbij is.',
    themes: ['reflexen'], ages: FROM10, levels: LV_ADV, intensity: 'gemiddeld', materials: ['ballen'],
    keepers: { min: 2, max: 4 }, trainers: 1, zone: 'Doel en doelgebied', duration: 8, sets: 3, reps: 6, rest: 45,
    divesPerRep: 0.5, explosive: false, blockTypes: ['kern'], complexity: 3,
    coaching: ['Zoek de bal naast het scherm', 'Rustig blijven staan', 'Reageer pas na het scherm'],
    mistakes: [
      { fault: 'Gokken op een hoek', fix: 'Blijf in de basishouding tot je de bal ziet.' },
      { fault: 'Te diep in doel staan', fix: 'Stap iets naar voren om meer reactieruimte te maken.' }
    ],
    variants: { easier: 'Scherm opzij (enkel naast het scherm schieten) en zachter.', harder: 'Scherm beweegt of springt weg vlak voor het schot.' },
    diagram: D('doel', [K(50, 12), S(50, 34, 'K2'), T(50, 66), B(50, 61)],
      [pass(1, [50, 60], [53, 38], [56, 14])])
  },
  {
    id: 'werpen-doeltjes', name: 'Werpen naar mini-goals',
    summary: 'Onderhands rollen, zijwaarts werpen en bovenhands werpen naar mini-goals op 15 tot 35 meter.',
    description: 'Drie mini-goals staan op verschillende afstanden. De keeper werpt om beurt: onderhands (bowlingworp) naar het dichtste doeltje, zijwaartse worp naar het middelste en bovenhandse (katapult)worp naar het verste. Tel de treffers per serie.',
    themes: ['distributie'], ages: ALL, levels: LV_ALL, intensity: 'laag', materials: ['ballen', 'minigoals'],
    keepers: { min: 1, max: 6 }, trainers: 1, zone: '35 × 20 m', duration: 8, sets: 3, reps: 6, rest: 30,
    divesPerRep: 0, explosive: false, blockTypes: ['kern', 'afsluiting'], complexity: 1,
    coaching: ['Stap naar je doel', 'Bal laag laten rollen', 'Arm gestrekt bij bovenhands', 'Wijs na met je hand'],
    mistakes: [
      { fault: 'Bal stuitert bij de onderhandse worp', fix: 'Diep door de knieën, bal laag loslaten.' },
      { fault: 'Gebogen arm bij de katapultworp', fix: 'Arm gestrekt, zwaai over de schouder.' }
    ],
    variants: { easier: 'Kortere afstanden en grote doeltjes (pionnen als poort). Spelvorm voor de jongsten.', harder: 'Bewegend doel: een medespeler loopt met het doeltje of je hebt 3 seconden.' },
    diagram: D('vrij', [K(14, 50), B(18, 50), MG(55, 20, 90), MG(72, 50, 90), MG(90, 80, 90)],
      [pass(1, [18, 47], [50, 22]), pass(2, [18, 50], [67, 50]), pass(3, [18, 54], [85, 78])])
  },
  {
    id: 'uittrap-zones', name: 'Uittrap en dropkick naar zones',
    summary: 'Uittrappen en dropkicks naar afgebakende zones op de flanken.',
    description: 'Twee zones van 10 × 10 meter staan op de flanken, voorbij de middencirkel. De keeper trapt afwisselend uit uit de hand (volley of dropkick) en vanaf de grond naar de linker- en rechterzone. Een medespeler in de zone vangt of neemt aan.',
    themes: ['distributie'], ages: FROM10, levels: LV_ALL, intensity: 'laag', materials: ['ballen', 'pionnen'],
    keepers: { min: 1, max: 4 }, trainers: 1, zone: 'Halve veld', duration: 10, sets: 2, reps: 8, rest: 30,
    divesPerRep: 0, explosive: false, blockTypes: ['kern', 'afsluiting'], complexity: 1,
    coaching: ['Bal laten vallen, niet opgooien', 'Kijk naar de bal bij het raken', 'Wreef strak', 'Lichaam over de bal voor een lage baan'],
    mistakes: [
      { fault: 'Bal opgooien en scheef raken', fix: 'Laat de bal vanaf heuphoogte vallen op je wreef.' },
      { fault: 'Te hoge, korte trap', fix: 'Leun licht over de bal en zwaai door naar je doel.' }
    ],
    variants: { easier: 'Grotere zones, kortere afstand en enkel uit de hand.', harder: 'Kleinere zones en de trainer roept pas na de vangbal welke zone.' },
    diagram: D('halfveld', [K(50, 8), B(50, 11), C(20, 66), C(36, 66), C(20, 84), C(36, 84), C(64, 66), C(80, 66), C(64, 84), C(80, 84), S(28, 75), S(72, 75)],
      [pass(1, [49, 12], [29, 72]), pass(2, [51, 12], [71, 72])])
  },
  {
    id: 'snelle-uitworp', name: 'Snelle uitworp na een redding',
    summary: 'Schot vangen en meteen een tegenaanval starten met een snelle worp naar de flank.',
    description: 'De trainer schiet vanop 16 meter. De keeper vangt, kijkt meteen op en werpt de bal binnen 3 seconden naar een medespeler die op de flank wegsprint. Wissel de flank af. Telt als goed als de worp de medespeler in de loop bereikt.',
    themes: ['distributie', 'wedstrijd'], ages: FROM10, levels: LV_ALL, intensity: 'gemiddeld', materials: ['ballen', 'pionnen'],
    keepers: { min: 2, max: 4 }, trainers: 1, zone: 'Strafschopgebied', duration: 10, sets: 3, reps: 6, rest: 45,
    divesPerRep: 0, explosive: false, blockTypes: ['kern'], complexity: 3,
    coaching: ['Eerst vangen, dan kijken', 'Snel opkijken', 'Werp vóór de medespeler', 'Lage, snelle worp'],
    mistakes: [
      { fault: 'Te lang wachten en de kans voorbij laten gaan', fix: 'Na de vangbal meteen opkijken naar de flank.' },
      { fault: 'Worp in de rug van de medespeler', fix: 'Werp in de ruimte vóór hem.' }
    ],
    variants: { easier: 'Werpbal in plaats van schot, medespeler staat stil.', harder: 'Een aanvaller dekt één flank: kies zelf de vrije kant.' },
    diagram: D('zestien', [K(50, 10), T(50, 60), B(50, 55), S(12, 44, 'K2'), C(8, 64)],
      [pass(1, [50, 54], [49, 13]), pass(2, [47, 12], [12, 56])])
  },
  {
    id: 'inspelen-onder-druk', name: 'Inspelen met de voet onder druk',
    summary: 'Een terugspeelbal aannemen en onder druk van een aanvaller naar de vrije poort spelen.',
    description: 'De trainer speelt de bal terug naar de keeper. Een aanvaller zet druk en sluit één kant af. De keeper neemt de bal aan met de voet weg van de aanvaller en speelt door een van de twee poortjes op de flanken, naar de vrije kant. Varieer: soms meteen in één tijd.',
    themes: ['opbouw'], ages: FROM10, levels: LV_ALL, intensity: 'gemiddeld', materials: ['ballen', 'pionnen'],
    keepers: { min: 1, max: 3 }, trainers: 1, zone: 'Halve veld (zestien en flanken)', duration: 10, sets: 3, reps: 6, rest: 45,
    divesPerRep: 0, explosive: false, blockTypes: ['kern'], complexity: 3,
    coaching: ['Voor de aanname al kijken', 'Open lichaamshouding', 'Aanname weg van de druk', 'Strak en laag inspelen'],
    mistakes: [
      { fault: 'Bal aannemen naar de aanvaller toe', fix: 'Kijk vooraf en neem aan met de voet die het verst van de aanvaller is.' },
      { fault: 'Gesloten houding met de rug naar het veld', fix: 'Sta open, zodat je beide kanten ziet.' }
    ],
    variants: { easier: 'Zonder aanvaller; trainer roept links of rechts.', harder: 'Aanvaller start dichterbij en de keeper mag maar twee keer raken.' },
    diagram: D('halfveld', [K(50, 10), T(50, 60), B(50, 56), A(40, 30), C(14, 50), C(22, 50), C(78, 50), C(86, 50)],
      [pass(1, [50, 55], [50, 14]), pass(2, [53, 12], [82, 48])])
  },
  {
    id: 'rondo-keeper', name: 'Rondo met keepers',
    summary: 'Drie keepers houden de bal rond tegen één afdekker; enkel spelen met de voet.',
    description: 'Drie keepers spelen in een vierkant van 10 × 10 meter de bal rond met de voet. De trainer of een vierde keeper probeert te onderscheppen. Maximaal twee balcontacten. Wie de bal verliest, wordt afdekker. Traint aanname, scanning en communicatie.',
    themes: ['opbouw', 'communicatie'], ages: ALL, levels: LV_ALL, intensity: 'gemiddeld', materials: ['ballen', 'pionnen'],
    keepers: { min: 3, max: 6 }, trainers: 1, zone: '10 × 10 m', duration: 10, sets: 4, reps: 1, rest: 45,
    divesPerRep: 0, explosive: false, blockTypes: ['kern', 'afsluiting'], complexity: 3,
    coaching: ['Vraag de bal: "hier!"', 'Kijk voor je aanneemt', 'Aanname in de loop', 'Speel naar de vrije voet'],
    mistakes: [
      { fault: 'Stilstaan in een hoek', fix: 'Beweeg mee om een passlijn te openen.' },
      { fault: 'Stil spelen', fix: 'Vraag de bal en geef informatie: "tijd" of "man".' }
    ],
    variants: { easier: 'Groter vierkant en drie balcontacten. Voor U6–U9 met de hand.', harder: 'Klein vierkant en één balcontact, of twee afdekkers.' },
    diagram: D('vrij', [C(15, 15), C(85, 15), C(85, 85), C(15, 85), K(50, 15, 'K1'), K(85, 50, 'K2'), K(50, 85, 'K3'), A(50, 50, 'T')],
      [pass(1, [53, 18], [82, 47]), pass(2, [82, 54], [54, 82])])
  },
  {
    id: 'coachen-muur', name: 'Coachen van de muur bij een vrije trap',
    summary: 'De keeper zet een muur van pionnen correct op en coacht luid en kort.',
    description: 'De trainer legt de bal op verschillende plaatsen rond de zestien. De keeper bepaalt hoeveel man in de muur moet, zet de buitenste "speler" (pion) op de lijn bal–paal en coacht met korte commando\'s. Daarna schiet de trainer de vrije trap. Met meerdere keepers staan de anderen als muur.',
    themes: ['communicatie'], ages: FROM10, levels: LV_ALL, intensity: 'laag', materials: ['ballen', 'pionnen'],
    keepers: { min: 1, max: 6 }, trainers: 1, zone: 'Strafschopgebied', duration: 8, sets: 2, reps: 6, rest: 30,
    divesPerRep: 0.5, explosive: false, blockTypes: ['kern', 'afsluiting'], complexity: 2,
    coaching: ['Kort en luid: "twee man!"', 'Buitenste man op de lijn bal–paal', 'Zelf de andere hoek dekken', 'Zicht op de bal houden'],
    mistakes: [
      { fault: 'Te lange of vage commando\'s', fix: 'Een woord of twee: "links", "stop", "twee man".' },
      { fault: 'Achter de muur staan zonder zicht', fix: 'Sta naast de muur, aan de kant van de vrije hoek.' }
    ],
    variants: { easier: 'Enkel de muur zetten, zonder schot.', harder: 'Tijdsdruk: de trainer neemt de vrije trap na 8 seconden.' },
    diagram: D('zestien', [K(56, 10), C(36, 44), C(40, 45), C(44, 46), T(26, 70), B(30, 66)],
      [run(1, [56, 11], [58, 14]), pass(2, [31, 64], [40, 40], [47, 7])])
  },
  {
    id: 'communicatie-hoge-bal', name: '"Keeper!" of "Weg!": communicatie bij hoge ballen',
    summary: 'Keeper en verdediger beslissen samen wie de hoge bal neemt, met één duidelijk commando.',
    description: 'Een tweede keeper speelt verdediger in het doelgebied. De trainer geeft voorzetten of hoge ballen. De keeper roept vroeg "keeper!" als hij komt, of "weg!" als de verdediger moet koppen of wegtrappen. Wie niet geroepen wordt, maakt ruimte.',
    themes: ['communicatie', 'hogeballen'], ages: FROM10, levels: LV_ALL, intensity: 'gemiddeld', materials: ['ballen'],
    keepers: { min: 2, max: 4 }, trainers: 1, zone: 'Strafschopgebied', duration: 8, sets: 3, reps: 6, rest: 45,
    divesPerRep: 0, explosive: false, blockTypes: ['kern'], complexity: 3,
    coaching: ['Vroeg en luid roepen', 'Eén woord: "keeper!" of "weg!"', 'Na de roep is het jouw bal'],
    mistakes: [
      { fault: 'Te laat roepen', fix: 'Roep zodra de bal vertrokken is en je weet wat je gaat doen.' },
      { fault: 'Roepen en toch blijven staan', fix: 'Wie roept, moet gaan.' }
    ],
    variants: { easier: 'Trainer werpt de bal hoog, zonder voorzet.', harder: 'Een aanvaller erbij die ook naar de bal gaat.' },
    diagram: D('zestien', [K(50, 10), S(56, 22, 'V'), T(86, 42), B(84, 38)],
      [pass(1, [83, 38], [68, 24], [57, 18]), run(2, [50, 11], [55, 17])])
  },
  {
    id: 'shoot-out', name: 'Shoot-out tussen keepers',
    summary: 'Wedstrijdvorm: keepers dagen elkaar om beurt uit in een 1-tegen-1 vanaf 25 meter.',
    description: 'Twee keepers spelen tegen elkaar. Een keeper start met de bal op 25 meter en heeft 8 seconden om te scoren; de andere verdedigt het doel. Daarna wisselen. Wie na vijf beurten het meest scoort, wint. Tel ook reddingen.',
    themes: ['wedstrijd', 'eentegeneen'], ages: FROM10, levels: LV_ALL, intensity: 'hoog', materials: ['ballen', 'pionnen'],
    keepers: { min: 2, max: 6 }, trainers: 1, zone: 'Strafschopgebied plus 10 m', duration: 10, sets: 2, reps: 5, rest: 60,
    divesPerRep: 0.5, explosive: true, blockTypes: ['kern', 'afsluiting'], complexity: 3,
    coaching: ['Uitkomen als de bal los is', 'Remmen in de basishouding', 'Lang blijven staan'],
    mistakes: [
      { fault: 'Op de lijn blijven staan', fix: 'Kom uit en verklein de hoek, zeker als de bal los ligt.' },
      { fault: 'Te vroeg gaan liggen', fix: 'Wacht tot de aanvaller schiet of de bal te ver voorlegt.' }
    ],
    variants: { easier: 'Start op 15 meter, aanvaller mag enkel schieten (geen dribbel rond de keeper).', harder: '6 seconden, of de aanvaller mag ook terugleggen naar de trainer.' },
    diagram: D('zestien', [K(50, 9), A(50, 84, 'K2'), B(50, 79), C(44, 86), C(56, 86)],
      [drib(1, [50, 78], [50, 52]), run(1, [50, 10], [50, 26]), pass(2, [50, 50], [57, 7])])
  },
  {
    id: 'schotreeks-hoeken', name: 'Wedstrijdopwarming: schotreeks uit alle hoeken',
    summary: 'Vaste schotreeks vanuit vijf posities zoals in de opwarming voor een wedstrijd.',
    description: 'Vijf ballen liggen in een boog rond de zestien (posities 1 tot 5). De trainer schiet in volgorde: eerst rustig op het lichaam, dan iets naast de keeper en tot slot naar de hoeken. De keeper verplaatst telkens naar de juiste positie. Dit is de vaste wedstrijdroutine.',
    themes: ['wedstrijd', 'voetenwerk'], ages: FROM10, levels: LV_ALL, intensity: 'gemiddeld', materials: ['ballen', 'pionnen'],
    keepers: { min: 1, max: 2 }, trainers: 1, zone: 'Strafschopgebied', duration: 10, sets: 2, reps: 5, rest: 45,
    divesPerRep: 0.5, explosive: false, blockTypes: ['opwarming', 'kern'], complexity: 2,
    coaching: ['Positie kiezen per bal', 'Basishouding bij het schot', 'Opbouwen: eerst vangen, dan duiken'],
    mistakes: [
      { fault: 'Te snel naar harde schoten', fix: 'Houd de opbouw aan: lichaam, naast het lichaam, hoek.' },
      { fault: 'Positie niet aanpassen aan de hoek', fix: 'Verplaats bij elke bal op de lijn bal–midden doel.' }
    ],
    variants: { easier: 'Werpen in plaats van schieten en enkel posities 2 tot 4.', harder: 'Na elke bal een tweede bal (rebound) of een voorzet erbij.' },
    diagram: D('zestien', [K(50, 10), C(18, 52, '1'), C(32, 64, '2'), C(50, 70, '3'), C(68, 64, '4'), C(82, 52, '5'), B(20, 48), B(34, 60), B(50, 66), B(66, 60), B(80, 48), T(50, 76)],
      [pass(1, [21, 47], [43, 9]), pass(2, [35, 59], [47, 9]), pass(3, [50, 64], [55, 8]), pass(4, [65, 59], [54, 8]), pass(5, [79, 47], [56, 9])])
  },
  {
    id: 'keepersvoetvolley', name: 'Keepersvoetvolley',
    summary: 'Speelse afsluiter: voetvolley over een lijn pionnen, met de handen enkel om te vangen en uit te trappen.',
    description: 'Een lijn pionnen vormt het net. Twee keepers (of twee duo\'s) spelen de bal over het net. De bal mag één keer stuiteren. De keeper mag de bal vangen en meteen uittrappen of werpen naar het andere vak. Punt als de bal in het vak van de tegenstander landt.',
    themes: ['distributie', 'communicatie'], ages: ALL, levels: LV_ALL, intensity: 'laag', materials: ['ballen', 'pionnen'],
    keepers: { min: 2, max: 6 }, trainers: 1, zone: '20 × 10 m', duration: 8, sets: 2, reps: 1, rest: 60,
    divesPerRep: 0, explosive: false, blockTypes: ['afsluiting'], complexity: 1,
    coaching: ['Communiceer met je duo', 'Precies trappen of werpen', 'Plezier!'],
    mistakes: [
      { fault: 'Te hard en buiten het vak', fix: 'Gecontroleerd: eerst raak, dan pas hard.' },
      { fault: 'Niet communiceren in duo', fix: 'Roep "mijn bal" of "jij".' }
    ],
    variants: { easier: 'Groter vak en de bal mag twee keer stuiteren.', harder: 'Enkel met de voet, of kleiner vak.' },
    diagram: D('vrij', [C(50, 15), C(50, 32), C(50, 50), C(50, 68), C(50, 85), K(24, 50, 'K1'), K(76, 50, 'K2')],
      [pass(1, [28, 46], [50, 34], [72, 44]), pass(2, [72, 56], [50, 68], [28, 56])])
  },
  {
    id: 'kasteel-verdedigen', name: 'Spelvorm: verdedig je kasteel',
    summary: 'Speelse vorm voor de jongsten: de keeper beschermt pionnen tegen geworpen of gerolde ballen.',
    description: 'Drie pionnen vormen het kasteel. De keeper staat ertussen en verdedigt. De trainer en de andere keepers staan rond een cirkel van 6 meter en proberen de pionnen om te rollen of te raken. Elke vangbal is een punt voor de keeper, elke omgevallen pion een punt voor de werpers. Wissel na een minuut.',
    themes: ['vangen', 'reflexen'], ages: UPTO12, levels: LV_LOW, intensity: 'gemiddeld', materials: ['ballen', 'pionnen'],
    keepers: { min: 1, max: 6 }, trainers: 1, zone: 'Cirkel van 6 m', duration: 8, sets: 4, reps: 1, rest: 45,
    divesPerRep: 0, explosive: false, blockTypes: ['opwarming', 'kern', 'afsluiting'], warmup: ['balgewenning'], complexity: 1,
    coaching: ['Klein en klaar staan', 'Achter de bal komen', 'Bal vasthouden'],
    mistakes: [
      { fault: 'Rug naar de werper', fix: 'Draai mee, zodat je altijd naar de bal kijkt.' },
      { fault: 'Enkel met de voeten tegenhouden', fix: 'Probeer met de handen te vangen.' }
    ],
    variants: { easier: 'Twee pionnen en enkel rollen.', harder: 'Meer werpers, of de werpers mogen ook laag werpen en stuiteren.' },
    diagram: D('vrij', [C(45, 46), C(55, 46), C(50, 58), K(50, 40), T(14, 30), S(86, 30, 'K2'), S(50, 94, 'K3'), B(18, 34)],
      [pass(1, [18, 34], [44, 47]), pass(2, [82, 33], [55, 46]), run(2, [52, 40], [55, 42])])
  },
  {
    id: 'cooldown-uitlopen', name: 'Cool-down: uitlopen en stretchen',
    summary: 'Rustig uitlopen rond het veld gevolgd door lichte stretchoefeningen voor heupen, liezen en schouders.',
    description: 'De keepers lopen twee rondjes rustig rond vier pionnen, dan stretchen ze telkens 20 tot 30 seconden: kuiten, hamstrings, heupbuigers, liezen, schouders en polsen. Ondertussen bespreekt de trainer kort wat goed ging.',
    themes: ['voetenwerk', 'communicatie'], ages: ALL, levels: LV_ALL, intensity: 'laag', materials: ['pionnen'],
    keepers: { min: 1, max: 6 }, trainers: 1, zone: '20 × 20 m', duration: 6, sets: 1, reps: 1, rest: 0,
    divesPerRep: 0, explosive: false, blockTypes: ['afsluiting'], warmup: ['mobiliteit'], complexity: 1,
    coaching: ['Rustig ademen', 'Niet verend stretchen', 'Kort evalueren: wat ging goed?'],
    mistakes: [
      { fault: 'Verend stretchen', fix: 'Houd de positie rustig vast, 20 tot 30 seconden.' },
      { fault: 'Overslaan na een zware training', fix: 'Juist dan: kort uitlopen helpt het herstel.' }
    ],
    variants: { easier: 'Enkel wandelen en drie stretchoefeningen.', harder: 'Mobiliteitsflow (wereldse stretch, 90-90 heup) in plaats van statische stretch.' },
    diagram: D('vrij', [C(20, 20), C(80, 20), C(80, 80), C(20, 80), K(28, 20)],
      [run(1, [28, 24], [74, 24], [76, 74], [26, 76], [24, 30])])
  },
  {
    id: 'strafschoppen', name: 'Strafschoppen',
    summary: 'Strafschoppen verwerken met een vaste routine: positie, wachten en explosief vertrekken.',
    description: 'De trainer en de andere keepers trappen om beurt een strafschop. De keeper heeft een vaste routine: op de lijn, armen breed, kleine beweging en vertrekken op het moment van de trap. Houd een lijstje bij van de voorkeurshoek per schutter.',
    themes: ['wedstrijd', 'duiken'], ages: FROM10, levels: LV_ALL, intensity: 'gemiddeld', materials: ['ballen'],
    keepers: { min: 1, max: 6 }, trainers: 1, zone: 'Strafschopgebied', duration: 8, sets: 2, reps: 5, rest: 45,
    divesPerRep: 1, explosive: true, blockTypes: ['kern', 'afsluiting'], complexity: 3,
    coaching: ['Eén voet op de lijn', 'Groot maken', 'Lang wachten, explosief vertrekken', 'Schuin naar voren duiken'],
    mistakes: [
      { fault: 'Te vroeg kiezen', fix: 'Wacht tot de standbeen-voet van de schutter staat.' },
      { fault: 'Achterwaarts duiken', fix: 'Duik schuin naar voren, naar de paal.' }
    ],
    variants: { easier: 'Strafschop vanop 8 meter en niet te hard, keeper mag het doel half verkleinen.', harder: 'Schutter mag een aanloop met stop maken; de keeper moet blijven staan.' },
    diagram: D('zestien', [K(50, 7), T(50, 40), B(50, 37.1)],
      [pass(1, [50, 35], [44, 6]), run(2, [48, 7], [44, 7])])
  },
  {
    id: 'reactie-kleurpionnen', name: 'Reactiestart op kleurpionnen',
    summary: 'Op een geroepen nummer sprint de keeper naar de juiste pion en verwerkt daarna een bal.',
    description: 'Vier genummerde pionnen staan rond de keeper op 3 meter. De trainer roept een nummer; de keeper tikt zo snel mogelijk de pion aan, keert terug naar het midden en verwerkt de bal die de trainer meteen speelt. Reactie, voetenwerk en vangen in één.',
    themes: ['reflexen', 'voetenwerk'], ages: ALL, levels: LV_ALL, intensity: 'gemiddeld', materials: ['ballen', 'pionnen'],
    keepers: { min: 1, max: 3 }, trainers: 1, zone: 'Doel en doelgebied', duration: 8, sets: 3, reps: 6, rest: 45,
    divesPerRep: 0, explosive: false, blockTypes: ['opwarming', 'kern'], complexity: 2,
    coaching: ['Op de voorvoeten wachten', 'Eerste stap snel en kort', 'Terug in balans voor de bal'],
    mistakes: [
      { fault: 'Gokken voor het nummer geroepen is', fix: 'Wacht in de basishouding tot je het nummer hoort.' },
      { fault: 'Nog in beweging als de bal komt', fix: 'Sprongstop in het midden, dan pas de bal.' }
    ],
    variants: { easier: 'Twee pionnen en de trainer wijst in plaats van te roepen. Spelvorm voor U6–U9.', harder: 'Kleuren én nummers combineren, of twee pionnen na elkaar aantikken.' },
    diagram: D('doel', [K(50, 22), C(40, 15, '1'), C(60, 15, '2'), C(40, 32, '3'), C(60, 32, '4'), T(50, 66), B(50, 61)],
      [run(1, [50, 22], [58, 16], [51, 21]), pass(2, [50, 60], [50, 27])])
  }
];

const out = { version: 1, exercises: ex };
writeFileSync(new URL('../data/exercises.json', import.meta.url), JSON.stringify(out, null, 1) + '\n');
console.log(`data/exercises.json: ${ex.length} oefeningen`);
