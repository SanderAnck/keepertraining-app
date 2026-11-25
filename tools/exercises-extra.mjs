// Uitbreiding van de seedbibliotheek (oefeningen 37–100). Wordt ingelezen door tools/build-exercises.mjs.

const ALL = ['u6_9', 'u10_12', 'u13_15', 'u16_19', 'senioren'];
const FROM10 = ALL.slice(1);
const FROM13 = ALL.slice(2);
const FROM16 = ALL.slice(3);
const UPTO12 = ALL.slice(0, 2);
const UPTO15 = ALL.slice(0, 3);
const LV_ALL = ['beginner', 'gevorderd', 'elite'];
const LV_ADV = ['gevorderd', 'elite'];
const LV_LOW = ['beginner', 'gevorderd'];
const ELITE = ['elite'];

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
const F = (fault, fix) => ({ fault, fix });

/** Standaardwaarden, zodat elke oefening enkel vermeldt wat afwijkt. */
const E = (o) => ({
  ages: FROM10, levels: LV_ALL, intensity: 'gemiddeld', materials: ['ballen'], keepers: { min: 1, max: 3 }, trainers: 1,
  zone: 'Doel en doelgebied', duration: 8, sets: 3, reps: 6, rest: 45, divesPerRep: 0, explosive: false,
  blockTypes: ['kern'], complexity: 2, ...o
});

export default [
  // ---------------- Vangen ----------------
  E({
    id: 'vangen-stuiterbal', name: 'Stuiterballen vangen',
    summary: 'De trainer laat de bal vlak voor de keeper stuiteren; de keeper vangt hem in balans tegen het lichaam.',
    description: 'De trainer werpt of trapt de bal vanop 8 meter zodat hij 1 à 2 meter voor de keeper stuitert. De keeper stapt naar voren om de bal zo snel mogelijk na de stuit te vangen, met het lichaam achter de bal. Wissel lage en hoge stuiters af.',
    themes: ['vangen'], ages: ALL, levels: LV_ALL, materials: ['ballen'],
    coaching: ['Naar de bal toe stappen', 'Lichaam achter de bal', 'Vangen net na de stuit'],
    mistakes: [F('Wachten tot de bal hoog opspringt', 'Stap naar voren en vang hem kort na de grond.'), F('Bal klapt uit de handen', 'Handen en borst vormen samen een kom.')],
    variants: { easier: 'Zachte, voorspelbare stuit op 3 meter.', harder: 'Stuit op nat gras of met effect, vanop 12 meter.' },
    diagram: D('doel', [K(50, 12), T(50, 62), B(50, 57)], [pass(1, [50, 56], [50, 30], [50, 22]), run(2, [50, 13], [50, 20])])
  }),
  E({
    id: 'vangen-zijwaartse-pas', name: 'Vangen na zijwaartse verplaatsing',
    summary: 'De keeper verplaatst met bijzetpassen tussen twee pionnen en vangt de bal die naar zijn positie gespeeld wordt.',
    description: 'Twee pionnen staan 3 meter uit elkaar op de doellijn. De keeper verplaatst met bijzetpassen naar een pion, de trainer speelt de bal naar die kant op borsthoogte. Na het vangen rolt de keeper terug en verplaatst naar de andere pion.',
    themes: ['vangen', 'voetenwerk'], ages: ALL, levels: LV_ALL, materials: ['ballen', 'pionnen'],
    coaching: ['Bijzetten, niet kruisen', 'Schouders recht naar de bal', 'Stilstaan voor het vangen'],
    mistakes: [F('Vangen terwijl je nog beweegt', 'Kleine sprongstop, dan pas vangen.'), F('Benen kruisen', 'Altijd bijzetpassen met de voeten op schouderbreedte.')],
    variants: { easier: 'Werpbal en de trainer wacht tot de keeper staat.', harder: 'De trainer kiest de kant op het laatste moment.' },
    diagram: D('doel', [K(50, 12), C(40, 12), C(60, 12), T(50, 60), B(50, 55)], [run(1, [50, 12], [58, 12]), pass(2, [51, 54], [58, 17])])
  }),
  E({
    id: 'vangen-twee-ballen', name: 'Twee ballen kort na elkaar',
    summary: 'Twee trainers of keepers spelen om beurt kort na elkaar; de keeper vangt, legt neer en is klaar voor de volgende.',
    description: 'Twee schutters staan op 10 meter, een links en een rechts. De eerste speelt op het lichaam, de keeper vangt, legt de bal opzij en stelt zich meteen op tegenover de tweede schutter, die 2 seconden later speelt. Traint snel herstellen van de positie.',
    themes: ['vangen', 'voetenwerk'], levels: LV_ADV, keepers: { min: 2, max: 4 },
    coaching: ['Na het vangen meteen bijdraaien', 'Basishouding voor elke bal', 'Bal veilig opzij leggen'],
    mistakes: [F('Positie niet aanpassen aan de tweede schutter', 'Draai mee tot je recht voor de bal staat.'), F('Bal laten vallen om tijd te winnen', 'Eerst veilig, dan snel.')],
    variants: { easier: '4 seconden tussen de ballen.', harder: 'Tweede bal meteen na de eerste en harder.' },
    diagram: D('doel', [K(50, 12), T(35, 58), S(65, 58, 'K2'), B(36, 53), B(64, 53)], [pass(1, [37, 52], [48, 17]), run(2, [50, 12], [52, 13]), pass(3, [63, 52], [53, 17])])
  }),
  E({
    id: 'vangen-afstandsschot', name: 'Afstandsschoten vangen',
    summary: 'Harde schoten vanop 18 tot 20 meter op en net naast het lichaam vangen zonder rebound.',
    description: 'De trainer schiet vanaf de rand van de zestien. De keeper staat iets voor de lijn, zet zijn voeten net voor het schot (sprongstop) en vangt de bal tegen de borst of in de kom. Elke bal die uit de handen springt is een rebound voor een aanvaller: daar wordt op gelet.',
    themes: ['vangen'], ages: FROM13, levels: LV_ADV, zone: 'Strafschopgebied', reps: 8, divesPerRep: 0.3,
    coaching: ['Sprongstop voor het schot', 'Geen rebound geven', 'Handen achter de bal'],
    mistakes: [F('Voeten nog in beweging bij het schot', 'Lees het uithalen van de schutter en sta stil.'), F('Bal wegtikken die je kunt vangen', 'Vangen is altijd de eerste keuze.')],
    variants: { easier: 'Afstand 14 meter en schoten recht op het lichaam.', harder: 'Een aanvaller volgt in op elke rebound.' },
    diagram: D('zestien', [K(50, 12), T(50, 62), B(50, 57)], [pass(1, [50, 56], [48, 16])])
  }),
  E({
    id: 'vangen-zitten-opstaan', name: 'Vangen vanuit zit',
    summary: 'De keeper zit, staat op het signaal snel recht en vangt de bal die meteen volgt.',
    description: 'De keeper zit op de grond met de benen gekruist. Op het signaal van de trainer staat hij zo snel mogelijk recht zonder de handen te gebruiken (of met één hand voor de jongsten) en vangt de bal die de trainer op borsthoogte werpt. Leuk als wedstrijdje tussen keepers.',
    themes: ['vangen', 'reflexen'], ages: ALL, levels: LV_LOW, intensity: 'laag', blockTypes: ['opwarming', 'kern'], warmup: ['balgewenning'], complexity: 1,
    coaching: ['Snel in de basishouding', 'Handen klaar voor de borst', 'Kijk naar de bal'],
    mistakes: [F('Rechtkomen en meteen vangen zonder balans', 'Eerst stabiel staan, dan vangen.'), F('Ogen naar de grond bij het rechtstaan', 'Blijf de trainer aankijken.')],
    variants: { easier: 'Starten vanuit kniestand.', harder: 'Starten vanuit buiklig of met een duik na het rechtstaan.' },
    diagram: D('doel', [K(50, 16), T(50, 55), B(50, 50)], [run(1, [52, 20], [52, 15]), pass(2, [50, 49], [50, 22])])
  }),
  E({
    id: 'vangen-tennisbal', name: 'Handjes met tennisballen',
    summary: 'Vangen en gooien met kleine ballen om de hand-oogcoördinatie en zachte handen te verbeteren.',
    description: 'Twee keepers staan op 3 meter van elkaar. Ze gooien een kleine bal (of een gewone bal voor de jongsten) met één hand, vangen met één hand, dan met de andere, dan via een stuit. Ideaal als rustige opwarming of tussendoor.',
    themes: ['vangen', 'reflexen'], ages: ALL, levels: LV_ALL, intensity: 'laag', keepers: { min: 1, max: 6 }, zone: '4 × 4 m per duo', duration: 6, reps: 10, rest: 20,
    blockTypes: ['opwarming'], warmup: ['balgewenning'], complexity: 1,
    coaching: ['Zachte handen', 'Kijk de bal in de hand', 'Afwisselen links en rechts'],
    mistakes: [F('Harde, gespannen handen', 'Laat de hand meegeven met de bal.'), F('Enkel met de sterke hand', 'Elke serie start met de zwakke hand.')],
    variants: { easier: 'Grote bal, twee handen en korte afstand.', harder: 'Twee ballen tegelijk of jongleren met drie.' },
    diagram: D('vrij', [K(38, 50, 'K1'), K(62, 50, 'K2'), B(42, 44)], [pass(1, [42, 44], [58, 44]), pass(2, [58, 56], [50, 64], [42, 56])])
  }),

  // ---------------- Duiken ----------------
  E({
    id: 'duik-halve-hoogte', name: 'Duiken op halve hoogte',
    summary: 'Ballen op heuphoogte naast de keeper: afzet, vangen in de lucht en landen op de zijkant.',
    description: 'De trainer werpt of schiet vanop 9 meter op heuphoogte, net buiten het bereik van een stap. De keeper zet af met het been aan de balkant, vangt de bal in de lucht (onderste hand achter, bovenste hand bovenop) en landt op de zijkant. Afwisselend links en rechts.',
    themes: ['duiken'], levels: LV_ALL, divesPerRep: 1, rest: 60, reps: 6,
    coaching: ['Afzet met het been aan de balkant', 'Bal vangen in de lucht', 'Landen op de zijkant'],
    mistakes: [F('Eerst landen en dan pas vangen', 'Vang de bal voor je de grond raakt.'), F('Duiken met de rug naar het veld', 'Borst blijft naar de schutter gericht.')],
    variants: { easier: 'Vanuit kniestand op een zachte ondergrond.', harder: 'Na een zijwaartse verplaatsing of met een tweede bal.' },
    diagram: D('doel', [K(50, 12), T(50, 60), B(50, 55)], [pass(1, [48, 54], [41, 12]), run(2, [48, 12], [42, 11]), pass(3, [52, 54], [59, 12]), run(4, [52, 12], [58, 11])])
  }),
  E({
    id: 'duik-over-horde', name: 'Duik over een lage horde',
    summary: 'Een lage horde dwingt de keeper om echt af te zetten en over het obstakel te duiken in plaats van te vallen.',
    description: 'Een lage horde (of pion op zijn kant) ligt naast de keeper. De trainer speelt de bal over de horde, de keeper zet af en duikt eroverheen. Traint een echte afzet en een duik naar voren-opzij.',
    themes: ['duiken'], ages: FROM13, levels: LV_ADV, intensity: 'hoog', materials: ['ballen', 'hordes'], divesPerRep: 1, rest: 75, reps: 5, explosive: true,
    coaching: ['Explosieve afzet', 'Schuin naar voren duiken', 'Handen eerst', 'Veilig landen'],
    mistakes: [F('Op de horde vallen', 'Begin met een zachte horde en vergroot de afstand pas als de afzet goed is.'), F('Achterwaarts duiken', 'Kies een punt vóór je als landingsplaats.')],
    variants: { easier: 'Een pion of een lint in plaats van een horde.', harder: 'Hogere bal en de keeper start vanuit een verplaatsing.' },
    diagram: D('doel', [K(50, 12), HD(42, 13, 90), T(50, 60), B(50, 55)], [pass(1, [48, 54], [36, 12]), run(2, [48, 12], [37, 12])])
  }),
  E({
    id: 'duik-recovery', name: 'Duik en snel herstel',
    summary: 'Na een duik meteen recht en klaar voor een tweede bal naar de andere kant.',
    description: 'De trainer speelt een eerste bal laag naast de keeper. Na de duik legt de keeper de bal weg, komt meteen recht en verwerkt de tweede bal die de assistent of tweede keeper naar de andere hoek speelt. Herstellen gaat over één knie, zonder op de rug te rollen.',
    themes: ['duiken', 'reflexen'], ages: FROM13, levels: LV_ADV, intensity: 'hoog', divesPerRep: 2, reps: 4, rest: 90, explosive: true, keepers: { min: 2, max: 3 },
    coaching: ['Herstellen over één knie', 'Hoofd meteen naar de bal', 'Kort en explosief'],
    mistakes: [F('Over de rug rollen om recht te komen', 'Draai naar de buik, één knie neer, recht.'), F('Te laat kijken naar de tweede schutter', 'Hoofd draait al tijdens het rechtkomen.')],
    variants: { easier: 'Tweede bal pas na 3 seconden en gerold.', harder: 'Tweede bal hoog naar de verre hoek.' },
    diagram: D('doel', [K(50, 12), T(42, 58), S(58, 58, 'K2'), B(43, 53), B(57, 53)], [pass(1, [43, 52], [41, 13]), run(2, [48, 12], [42, 13]), pass(3, [57, 52], [60, 12]), run(4, [43, 14], [59, 13])])
  }),
  E({
    id: 'duik-vanuit-knie', name: 'Duiktechniek vanuit kniestand',
    summary: 'Opbouw van de duik: vanuit kniestand naar de bal duiken, eerst kort en dan verder.',
    description: 'De keeper zit op de knieën. De trainer werpt de bal op 1 tot 2 meter naast de keeper op halve hoogte. De keeper duikt vanuit kniestand, vangt en landt op de zijkant. Een veilige manier om de duik aan te leren bij jonge of beginnende keepers.',
    themes: ['duiken'], ages: ALL, levels: LV_LOW, intensity: 'laag', divesPerRep: 1, reps: 5, rest: 40, blockTypes: ['opwarming', 'kern'], warmup: ['valvorm'], complexity: 1,
    coaching: ['Onderste hand achter de bal', 'Landen op heup en schouder', 'Bal vóór het gezicht'],
    mistakes: [F('Landen op de buik', 'Draai de borst naar de trainer, dan land je op de zijkant.'), F('Ellebogen eerst op de grond', 'De armen blijven bij de bal.')],
    variants: { easier: 'Bal op de grond naast de keeper, enkel omvallen.', harder: 'Vanuit hurkzit en de bal verder weg.' },
    diagram: D('vrij', [K(50, 45), T(50, 88), B(50, 83)], [pass(1, [48, 82], [34, 45]), run(2, [47, 45], [36, 45])])
  }),
  E({
    id: 'duik-doelpaal', name: 'Duiken bij de paal',
    summary: 'Ballen tegen de voet van de paal: korte, snelle duik zonder de paal te raken.',
    description: 'De keeper staat een meter van de paal. De trainer speelt laag naar de korte hoek. De keeper duikt kort en vangt de bal of duwt hem rond de paal. Daarna dezelfde oefening aan de andere paal. Let op een veilige afstand tot de paal.',
    themes: ['duiken', 'voetenwerk'], ages: FROM10, levels: LV_ADV, divesPerRep: 1, reps: 5, rest: 60,
    coaching: ['Kort en laag duiken', 'Bal rond de paal duwen', 'Hoofd weg van de paal'],
    mistakes: [F('Te ver van de paal staan', 'Positie op een meter, de paal is je oriëntatie.'), F('Bal terug in het doelgebied duwen', 'Duw de bal naast het doel.')],
    variants: { easier: 'Rollende bal en meer afstand tot de paal.', harder: 'Schot op halve hoogte naar de korte hoek.' },
    diagram: D('doel', [K(42, 12), T(30, 58), B(31, 53)], [pass(1, [32, 52], [38, 9]), run(2, [42, 12], [39, 10])])
  }),
  E({
    id: 'duik-dubbele-duik', name: 'Dubbele redding',
    summary: 'Eerste schot wegduiken, meteen een tweede bal op de rebound verwerken.',
    description: 'De trainer schiet naar de hoek; de keeper duikt. Meteen daarna rolt of speelt een tweede schutter een bal naar de plaats waar een rebound zou vallen. De keeper komt recht en duikt opnieuw. Wedstrijdecht en zwaar: korte series.',
    themes: ['duiken', 'wedstrijd'], ages: FROM16, levels: ELITE, intensity: 'hoog', divesPerRep: 2, reps: 4, sets: 3, rest: 90, explosive: true, keepers: { min: 2, max: 3 }, complexity: 3,
    coaching: ['Eerste bal weg van het doel', 'Recht over één knie', 'Tweede duik naar voren'],
    mistakes: [F('Na de eerste duik blijven liggen', 'Meteen recht, de rebound komt altijd.'), F('Tweede duik achterwaarts', 'Duik naar de bal toe, schuin vooruit.')],
    variants: { easier: 'Tweede bal pas na 3 seconden en gerold.', harder: 'Tweede bal van een aanvaller die in één tijd afwerkt.' },
    diagram: D('doel', [K(50, 12), T(50, 62), S(30, 36, 'K2'), B(50, 57), B(32, 32)], [pass(1, [50, 56], [61, 13]), run(2, [52, 12], [60, 13]), pass(3, [33, 31], [44, 18]), run(4, [58, 14], [46, 18])])
  }),
  E({
    id: 'duik-zittend-duo', name: 'Valwedstrijd in duo',
    summary: 'Speelse valvorm: twee keepers zitten tegenover elkaar en proberen elkaar te verrassen met rollende ballen.',
    description: 'Twee keepers zitten op 4 meter van elkaar, benen gespreid. Om beurt rollen ze de bal net naast de ander. Die valt opzij naar de bal. Wie de bal mist, geeft een punt weg. Speels en veilig voor de jongsten.',
    themes: ['duiken'], ages: ALL, levels: LV_LOW, intensity: 'laag', keepers: { min: 2, max: 6 }, zone: '4 × 4 m per duo', duration: 6, reps: 8, rest: 30,
    divesPerRep: 0.5, blockTypes: ['opwarming'], warmup: ['valvorm'], complexity: 1,
    coaching: ['Vallen op de zijkant', 'Bal vóór het lichaam', 'Snel terug rechtop zitten'],
    mistakes: [F('Vallen op de rug', 'Draai de borst naar de bal.'), F('Alleen met de handen reiken', 'Laat het hele lichaam meegaan.')],
    variants: { easier: 'Bal trager en dichter bij het lichaam.', harder: 'Vanuit kniestand en de bal stuiteren.' },
    diagram: D('vrij', [K(35, 50, 'K1'), K(65, 50, 'K2'), B(61, 48)], [pass(1, [61, 48], [37, 36]), run(2, [35, 47], [36, 38])])
  }),

  // ---------------- Voetenwerk ----------------
  E({
    id: 'voetenwerk-hoepelparcours', name: 'Hoepelparcours met vangbal',
    summary: 'Korte voetjes door een hoepelparcours (vooruit, zijwaarts, in en uit) en een vangbal op het einde.',
    description: 'Zes hoepels liggen in een zigzag. De keeper stapt met één voet in elke hoepel, daarna met twee voeten, daarna zijwaarts. Aan het einde vangt hij een bal van de trainer. Ideaal voor de opwarming en voor jonge keepers.',
    themes: ['voetenwerk'], ages: ALL, levels: LV_ALL, intensity: 'laag', materials: ['ballen', 'hoepels'], keepers: { min: 1, max: 6 }, zone: '12 × 6 m', duration: 6, reps: 6, rest: 20,
    blockTypes: ['opwarming', 'kern'], warmup: ['mobiliteit'], complexity: 1,
    coaching: ['Op de voorvoeten', 'Korte, snelle passen', 'Armen mee'],
    mistakes: [F('Lange, trage passen', 'Klein en snel: zo vaak mogelijk de grond raken.'), F('Kijken naar de voeten', 'Blik vooruit naar de trainer.')],
    variants: { easier: 'Wandelen door de hoepels, dan rustig vangen.', harder: 'Patroon niet aangekondigd: de trainer roept het.' },
    diagram: D('vrij', [H(15, 40), H(25, 60), H(35, 40), H(45, 60), H(55, 40), H(65, 60), K(6, 50), T(88, 50), B(84, 50)],
      [run(1, [7, 50], [15, 40], [25, 60], [35, 40], [45, 60], [55, 40], [65, 60], [72, 52]), pass(2, [84, 47], [75, 48])])
  }),
  E({
    id: 'voetenwerk-ladder-varianten', name: 'Ladderpatronen',
    summary: 'Verschillende ladderpatronen als opwarming en coördinatie: twee voeten in, zijwaarts, in-uit.',
    description: 'Een ladder ligt op de grond. De keeper doet een patroon per reeks: twee voeten in elk vak, zijwaarts in-in-uit-uit, Ickey shuffle en hink-stap. Na de ladder versnelt hij 5 meter. Terug wandelen is de rust.',
    themes: ['voetenwerk'], ages: ALL, levels: LV_ALL, intensity: 'laag', materials: ['ladders'], keepers: { min: 1, max: 6 }, zone: '12 × 4 m', duration: 6, reps: 6, rest: 20,
    blockTypes: ['opwarming'], warmup: ['mobiliteit'], complexity: 1,
    coaching: ['Licht op de voeten', 'Armen meebewegen', 'Kort grondcontact'],
    mistakes: [F('Op de sporten trappen', 'Eerst traag en correct, dan sneller.'), F('Rug gebogen', 'Borst vooruit, kin omhoog.')],
    variants: { easier: 'Eén voet in elk vak, wandelend.', harder: 'Na de ladder een reactiesprint op signaal.' },
    diagram: D('vrij', [LAD(45, 50), K(25, 50), C(80, 50)], [run(1, [26, 50], [64, 50]), run(2, [64, 50], [78, 50])])
  }),
  E({
    id: 'voetenwerk-kruispas-hoge-bal', name: 'Kruispas naar de verre paal',
    summary: 'De keeper verplaatst met een kruispas over het doel en vangt een bal bij de verre paal.',
    description: 'De keeper start aan de eerste paal. De trainer speelt een bal hoog naar de verre paal. De keeper gebruikt de kruispas (eerste pas opzij, tweede pas kruisen) om snel over het doel te verplaatsen en vangt of tikt de bal bij de tweede paal.',
    themes: ['voetenwerk', 'hogeballen'], ages: FROM13, levels: LV_ADV, divesPerRep: 0.5,
    coaching: ['Eerste pas opzij', 'Kruispas voor afstand', 'Afzet op het laatste been'],
    mistakes: [F('Achteruit lopen', 'Zijwaarts verplaatsen met de borst naar het veld.'), F('Te laat vertrekken', 'Vertrek zodra de trainer de bal raakt.')],
    variants: { easier: 'Lagere bal en meer tijd.', harder: 'Met een aanvaller die meegaat naar de tweede paal.' },
    diagram: D('doel', [K(40, 12), T(30, 60), B(31, 55)], [pass(1, [32, 54], [50, 25], [61, 12]), run(2, [41, 12], [60, 12])])
  }),
  E({
    id: 'voetenwerk-sprongstop', name: 'Sprongstop op het schotmoment',
    summary: 'De keeper loopt naar voren en zet op het juiste moment een sprongstop, zodat hij stilstaat als de bal vertrekt.',
    description: 'De keeper start op de doellijn en komt enkele passen uit terwijl de trainer de bal klaarlegt. Net voor het schot zet de keeper een kleine sprongstop (split step) en verwerkt het schot. Het doel is timing: stilstaan op het moment van het schot.',
    themes: ['voetenwerk'], ages: FROM10, levels: LV_ALL, reps: 8, divesPerRep: 0.5,
    coaching: ['Sprongstop vlak voor het schot', 'Landen op de voorvoeten', 'Gewicht licht naar voren'],
    mistakes: [F('Te vroeg stoppen en stilstaan', 'Blijf bewegen tot de schutter uithaalt.'), F('Nog bewegen bij het schot', 'Lees het standbeen van de schutter.')],
    variants: { easier: 'Trainer roept "nu" voor hij schiet.', harder: 'Trainer varieert het tempo en schiet soms meteen.' },
    diagram: D('doel', [K(50, 10), T(50, 66), B(50, 61)], [run(1, [50, 11], [50, 22]), pass(2, [50, 60], [44, 24])])
  }),
  E({
    id: 'voetenwerk-pionnenster', name: 'Pionnenster',
    summary: 'Vanuit het midden van een ster van pionnen naar de pion die de trainer aanwijst, terug en een bal verwerken.',
    description: 'Vijf pionnen staan in een ster rond de keeper op 3 meter. De trainer wijst een pion aan; de keeper verplaatst zijwaarts of voorwaarts, tikt de pion aan, keert terug en verwerkt een bal. De keeper blijft altijd met de borst naar de trainer.',
    themes: ['voetenwerk', 'reflexen'], ages: ALL, levels: LV_ALL, materials: ['ballen', 'pionnen'], reps: 6,
    coaching: ['Borst naar de trainer', 'Korte passen', 'In balans terug in het midden'],
    mistakes: [F('Rug naar de trainer bij het aantikken', 'Verplaats zijwaarts of achterwaarts, nooit met de rug.'), F('Grote passen', 'Kleine, snelle passen geven meer controle.')],
    variants: { easier: 'Drie pionnen en de trainer zegt welke.', harder: 'Twee pionnen na elkaar en een duikbal op het einde.' },
    diagram: D('doel', [K(50, 28), C(36, 18), C(64, 18), C(34, 38), C(66, 38), C(50, 44), T(50, 75), B(50, 70)],
      [run(1, [50, 28], [62, 19], [51, 27]), pass(2, [50, 69], [50, 33])])
  }),
  E({
    id: 'voetenwerk-achterwaarts-hoge-bal', name: 'Achterwaarts verplaatsen naar een lob',
    summary: 'De keeper staat hoog, de trainer lobt; de keeper verplaatst achterwaarts-zijwaarts en tikt de bal over.',
    description: 'De keeper staat 6 meter voor zijn doel. De trainer lobt de bal richting het doel. De keeper draait zijdelings, verplaatst met kruispassen achteruit en tikt de bal met de verste hand over de lat of vangt hem.',
    themes: ['voetenwerk', 'hogeballen'], ages: FROM13, levels: LV_ADV, intensity: 'hoog', divesPerRep: 0.5, explosive: true, rest: 75, reps: 5,
    coaching: ['Zijdelings draaien, niet achteruit lopen', 'Kruispas', 'Tikken met de verste hand'],
    mistakes: [F('Achteruit lopen en vallen', 'Draai de heupen en loop zijwaarts.'), F('Bal in het doel tikken', 'Tik de bal over de lat, niet ertegen.')],
    variants: { easier: 'Keeper start op 3 meter en de lob is traag.', harder: 'Start op 10 meter, na een eerste reddingsactie.' },
    diagram: D('doel', [K(50, 30), T(50, 75), B(50, 70)], [pass(1, [50, 69], [50, 40], [52, 8]), run(2, [50, 30], [53, 18], [52, 11])])
  }),

  // ---------------- Hoge ballen ----------------
  E({
    id: 'hoge-bal-tweetal', name: 'Hoge ballen in tweetal',
    summary: 'Twee keepers werpen elkaar hoge ballen toe en vangen op het hoogste punt met de knie omhoog.',
    description: 'Twee keepers staan op 10 meter. De ene werpt hoog, de andere neemt twee passen aanloop, zet af op één been en vangt op het hoogste punt. Na tien worpen wisselen. Geschikt om de techniek in te slijpen zonder trainer.',
    themes: ['hogeballen'], ages: ALL, levels: LV_LOW, intensity: 'laag', keepers: { min: 2, max: 6 }, zone: '10 × 5 m', reps: 8, rest: 30, complexity: 1,
    coaching: ['Knie omhoog', 'Vangen boven het hoofd', 'Afzet op één been'],
    mistakes: [F('Vangen achter het hoofd', 'Handen vóór het hoofd zodat je de bal ziet.'), F('Twee benen afzetten', 'Eén been: hoger en beter beschermd.')],
    variants: { easier: 'Stilstaand vangen boven het hoofd.', harder: 'Ballen met meer effect of via een stuit.' },
    diagram: D('vrij', [K(25, 50, 'K1'), K(75, 50, 'K2'), B(28, 45)], [pass(1, [29, 45], [50, 20], [70, 44]), run(2, [76, 52], [72, 46])])
  }),
  E({
    id: 'hoge-bal-tweede-paal', name: 'Voorzetten naar de tweede paal',
    summary: 'Lange voorzetten naar de tweede paal onderscheppen of laten gaan.',
    description: 'De trainer geeft voorzetten vanaf de flank richting de tweede paal. De keeper beslist: onderscheppen in het doelgebied of terugzakken naar de tweede paal en klaarstaan voor een kopbal. Na elke bal kort benoemen waarom.',
    themes: ['hogeballen'], ages: FROM13, levels: LV_ADV, zone: 'Strafschopgebied', reps: 8, sets: 2, rest: 60, complexity: 3,
    coaching: ['Startpositie in het midden', 'Lees de baan', 'Niet zeker? Terug naar de paal'],
    mistakes: [F('Halverwege blijven staan', 'Kies: helemaal gaan of terug naar de paal.'), F('Te ver op de eerste paal starten', 'Begin iets naar het midden van het doel.')],
    variants: { easier: 'Voorzet werpen vanaf 15 meter.', harder: 'Met een aanvaller aan de tweede paal.' },
    diagram: D('zestien', [K(48, 10), T(12, 40), B(14, 36), C(10, 46)], [pass(1, [15, 36], [40, 18], [60, 16]), run(2, [48, 10], [57, 15])])
  }),
  E({
    id: 'hoge-bal-hoekschop', name: 'Hoekschoppen met drukte',
    summary: 'Hoekschoppen verwerken met spelers en een aanvaller in het doelgebied.',
    description: 'De trainer neemt hoekschoppen. Twee of drie spelers (keepers of medespelers) staan in het doelgebied, waarvan één de keeper hindert. De keeper kiest zijn startpositie, coacht, komt uit en vangt of bokst. Daarna kort bespreken.',
    themes: ['hogeballen', 'communicatie'], ages: FROM13, levels: LV_ADV, intensity: 'hoog', keepers: { min: 3, max: 6 }, zone: 'Strafschopgebied', reps: 6, sets: 2, rest: 60, explosive: true, complexity: 3,
    coaching: ['Startpositie midden van het doel', 'Luid roepen', 'Hoog onderscheppen', 'Twijfel = boksen'],
    mistakes: [F('Ingesloten door spelers', 'Zoek ruimte voor de aanloop vóór de bal vertrekt.'), F('Te laat roepen', 'Roep bij het vertrek van de bal.')],
    variants: { easier: 'Zonder hindernis en met geworpen hoekschoppen.', harder: 'Twee aanvallers die actief naar de bal gaan.' },
    diagram: D('zestien', [K(50, 9), A(52, 16, 'A'), S(42, 18, 'V'), T(97, 6), B(95, 7)], [pass(1, [94, 8], [70, 6], [54, 14]), run(2, [50, 10], [53, 14])])
  }),
  E({
    id: 'hoge-bal-boksen-techniek', name: 'Boksen: techniek',
    summary: 'Wegboksen met één en twee vuisten aanleren tegen een aangegooide bal.',
    description: 'De trainer werpt de bal op hoofdhoogte en iets hoger. Eerst boksen met twee vuisten (bal komt recht van voren) terug naar de trainer, daarna met één vuist (bal komt van opzij) verder door naar de flank. Vuisten gesloten, duimen bovenop.',
    themes: ['hogeballen'], ages: FROM10, levels: LV_ALL, intensity: 'laag', reps: 8, rest: 30, complexity: 1,
    coaching: ['Vuisten gesloten, duim bovenop', 'Twee vuisten bij een bal van voren', 'Hoog en ver'],
    mistakes: [F('Met open hand slaan', 'Sluit de vuist en raak de bal met de knokkels.'), F('Kort boksen', 'Strek de armen door, alsof je ver weg slaat.')],
    variants: { easier: 'Zachte bal, stilstaand.', harder: 'Met aanloop en een tegenstander die licht duwt.' },
    diagram: D('doel', [K(50, 14), T(50, 50), B(50, 46)], [pass(1, [50, 45], [50, 30], [50, 19]), pass(2, [50, 18], [70, 40])])
  }),
  E({
    id: 'hoge-bal-terugzakken', name: 'Ingeworpen bal naar het doel',
    summary: 'Lange inworpen of vrije trappen in het doelgebied onderscheppen tussen meerdere spelers.',
    description: 'De trainer werpt of trapt de bal vanaf de zijlijn in het doelgebied. Twee spelers staan voor de keeper. De keeper zakt niet terug op zijn lijn maar kiest het moment om uit te komen. Belangrijk bij lange inworpen in de jeugd.',
    themes: ['hogeballen', 'communicatie'], ages: FROM13, levels: LV_ADV, keepers: { min: 3, max: 6 }, zone: 'Strafschopgebied', reps: 6, complexity: 3,
    coaching: ['Positie iets naar voren', 'Ruimte voor je aanloop houden', 'Duidelijk roepen'],
    mistakes: [F('Op de lijn gekluisterd', 'Een inworp hangt lang in de lucht: je hebt tijd.'), F('Tussen spelers gaan staan', 'Zoek een vrije lijn naar de bal.')],
    variants: { easier: 'Zonder spelers in het doelgebied.', harder: 'Spelers springen mee naar de bal.' },
    diagram: D('zestien', [K(50, 10), S(46, 20, 'S'), A(56, 19), T(99, 32), B(97, 30)], [pass(1, [96, 30], [70, 18], [52, 17]), run(2, [50, 11], [52, 16])])
  }),
  E({
    id: 'hoge-bal-tikken-over-lat', name: 'Over de lat tikken',
    summary: 'Hoge ballen die onder de lat komen met de open hand over de lat tikken.',
    description: 'De trainer werpt of trapt hoge ballen die net onder de lat vallen. De keeper verplaatst met de kruispas en tikt de bal met de open hand (of vuist) over de lat. Altijd met de hand die het verst van het doel is.',
    themes: ['hogeballen', 'duiken'], ages: FROM13, levels: LV_ADV, divesPerRep: 0.5, reps: 6, rest: 60,
    coaching: ['Tikken met de verste hand', 'Hand onder de bal', 'Kruispas naar achteren'],
    mistakes: [F('Bal tegen de lat tikken', 'Raak de onderkant van de bal zodat hij omhoog gaat.'), F('Met de dichtste hand tikken', 'De verste hand reikt hoger en houdt je borst open.')],
    variants: { easier: 'Werpbal vanop korte afstand.', harder: 'Na een eerste bal op het lichaam.' },
    diagram: D('doel', [K(50, 16), T(50, 62), B(50, 57)], [pass(1, [50, 56], [55, 25], [57, 7]), run(2, [50, 16], [55, 10])])
  }),
  E({
    id: 'hoge-bal-spelvorm-jong', name: 'Spelvorm: vang de regenboog',
    summary: 'Speels voor de jongsten: hoge ballen vangen boven het hoofd en punten scoren per vangbal.',
    description: 'De trainer werpt de bal in een boog (de regenboog) in een zone met hoepels. De keeper loopt naar de bal en vangt hem boven het hoofd. Vangen in een hoepel is dubbele punten. Speels en veilig voor U6 tot U12.',
    themes: ['hogeballen', 'vangen'], ages: UPTO12, levels: LV_LOW, intensity: 'laag', materials: ['ballen', 'hoepels'], keepers: { min: 1, max: 6 }, zone: '10 × 10 m', reps: 8, rest: 30,
    blockTypes: ['kern', 'afsluiting'], complexity: 1,
    coaching: ['Handen boven het hoofd', 'Kijk de bal in de handen', 'Lopen naar de bal'],
    mistakes: [F('Wachten tot de bal valt', 'Loop naar de plek waar de bal gaat landen.'), F('Bal tegen het gezicht', 'Handen voor het hoofd, duimen samen.')],
    variants: { easier: 'Lage boog en een grotere bal.', harder: 'Hogere boog of eerst draaien.' },
    diagram: D('vrij', [H(40, 35), H(60, 35), H(50, 60), K(50, 80), T(50, 10), B(50, 15)], [pass(1, [50, 16], [45, 25], [40, 35]), run(2, [50, 78], [42, 40])])
  }),

  // ---------------- 1-tegen-1 ----------------
  E({
    id: 'eentegeneen-hoek-verkleinen', name: 'Hoek verkleinen bij een schuine aanval',
    summary: 'Een aanvaller komt schuin op doel; de keeper verkleint de hoek aan de korte paal zonder de verre hoek open te laten.',
    description: 'De aanvaller dribbelt vanaf de zijkant van de zestien schuin richting doel. De keeper verplaatst langs de denkbeeldige boog en komt uit tot hij de korte hoek dicht heeft. Bij het schot blokkeert hij. Daarna wordt de kant gewisseld.',
    themes: ['eentegeneen', 'voetenwerk'], ages: FROM13, levels: LV_ADV, intensity: 'hoog', materials: ['ballen', 'pionnen'], zone: 'Strafschopgebied', reps: 5, rest: 75, divesPerRep: 0.5, explosive: true, complexity: 3,
    coaching: ['Korte hoek eerst dicht', 'Op de lijn bal–midden doel', 'Lang blijven staan'],
    mistakes: [F('Korte hoek open laten', 'Sta een halve meter naar de korte paal.'), F('Te ver uitkomen bij een schuine hoek', 'Hoe schuiner, hoe dichter bij de paal.')],
    variants: { easier: 'Aanvaller wandelt en schiet op een pion.', harder: 'Aanvaller mag ook een voorzet geven naar een tweede aanvaller.' },
    diagram: D('zestien', [K(50, 9), A(15, 55), B(18, 52), C(12, 60)], [drib(1, [19, 51], [32, 34]), run(1, [50, 10], [45, 14]), pass(2, [33, 33], [44, 6])])
  }),
  E({
    id: 'eentegeneen-twee-aanvallers', name: '2-tegen-1 met keeper',
    summary: 'Twee aanvallers tegen een verdediger en de keeper: de keeper kiest tussen bal en pass.',
    description: 'Twee aanvallers starten op 30 meter, een verdediger zakt terug. De keeper coacht de verdediger, positioneert zich voor de balbezitter en reageert op de pass. Na elke aanval wisselen de rollen. Vraagt meerdere keepers of medespelers.',
    themes: ['eentegeneen', 'communicatie'], ages: FROM13, levels: LV_ADV, intensity: 'hoog', materials: ['ballen', 'pionnen'], keepers: { min: 4, max: 6 }, zone: 'Strafschopgebied plus 15 m', duration: 10, reps: 5, rest: 60, divesPerRep: 0.5, explosive: true, complexity: 3,
    coaching: ['Coach de verdediger', 'Positie voor de bal', 'Niet te vroeg kiezen'],
    mistakes: [F('Op de pass gokken', 'Blijf voor de bal tot de pass vertrekt.'), F('Zwijgen', 'Zeg de verdediger welke man hij neemt.')],
    variants: { easier: 'Verdediger mag de bal niet afpakken, enkel de pass afschermen.', harder: 'Een tweede verdediger komt achteraan mee.' },
    diagram: D('zestien', [C(30, 76), C(70, 76), K(50, 9), A(35, 70, 'A1'), A(65, 70, 'A2'), S(50, 50, 'V'), B(35, 66)], [drib(1, [35, 65], [40, 44]), pass(2, [41, 43], [60, 38]), run(2, [50, 10], [54, 18]), pass(3, [60, 37], [52, 6])])
  }),
  E({
    id: 'eentegeneen-knielblok', name: 'Knielblok en stervorm',
    summary: 'Techniektraining voor de twee blokvormen bij een schot van dichtbij.',
    description: 'De trainer staat op 6 meter met de bal aan de voet. Bij een schot langs de grond blokkeert de keeper met een knielblok (knie naar de grond, handen naast de knie). Bij een schot hoger of onvoorspelbaar maakt hij een stervorm (armen en benen breed). Eerst op aankondiging, dan vrij.',
    themes: ['eentegeneen'], ages: FROM10, levels: LV_ALL, materials: ['ballen'], reps: 6, rest: 45, divesPerRep: 0.5,
    coaching: ['Knielblok: handen naast de knie', 'Stervorm: groot en breed', 'Ogen open'],
    mistakes: [F('Opening tussen de benen bij het knielblok', 'Knie sluit de ruimte met de andere voet.'), F('Wegdraaien bij de stervorm', 'Borst naar de bal, blijf groot.')],
    variants: { easier: 'Trainer kondigt aan welke blokvorm en schiet zacht.', harder: 'Trainer kiest zelf: schieten, stiften of uitspelen.' },
    diagram: D('doel', [K(50, 22), T(50, 46), B(50, 42)], [pass(1, [50, 41], [47, 27]), run(2, [50, 22], [50, 24])])
  }),
  E({
    id: 'eentegeneen-ruimte-in-de-rug', name: 'Doorgebroken aanvaller van achteruit',
    summary: 'Een aanvaller breekt door achter de verdediging; de keeper vertrekt snel en sluit de ruimte.',
    description: 'De trainer speelt de bal diep in de zestien voor een aanvaller die van op 25 meter vertrekt. De keeper moet snel beslissen: de bal onderscheppen voor de aanvaller, of in de basishouding wachten als de aanvaller eerst is.',
    themes: ['eentegeneen'], ages: FROM13, levels: LV_ADV, intensity: 'hoog', zone: 'Strafschopgebied plus 10 m', reps: 5, rest: 75, divesPerRep: 0.5, explosive: true, complexity: 3,
    coaching: ['Snel beslissen', 'Eerst aan de bal? Ga!', 'Anders afremmen en blokken'],
    mistakes: [F('Twijfelen', 'Beslis op de eerste meters van de bal.'), F('Doorlopen als de aanvaller eerst is', 'Afremmen en de hoek verkleinen.')],
    variants: { easier: 'Aanvaller start verder weg zodat de keeper vaak eerst is.', harder: 'Aanvaller start dichter en de pass is sneller.' },
    diagram: D('zestien', [K(50, 9), T(50, 95), A(35, 75), B(50, 90)], [pass(1, [50, 89], [50, 40]), run(2, [50, 10], [50, 34])])
  }),
  E({
    id: 'eentegeneen-spelvorm-jong', name: 'Spelvorm: rover en keeper',
    summary: 'Speelse 1-tegen-1 voor jonge keepers: de rover dribbelt naar een klein doel, de keeper pakt de bal af.',
    description: 'Een klein doel van pionnen (3 meter). De rover (andere keeper of trainer) dribbelt vanop 10 meter traag naar het doel. De keeper komt uit en pakt de bal in de voeten. Na elke beurt wisselen. Speels en veilig, aan laag tempo.',
    themes: ['eentegeneen'], ages: UPTO12, levels: LV_LOW, materials: ['ballen', 'pionnen'], keepers: { min: 1, max: 6 }, zone: '12 × 8 m', reps: 6, rest: 30, divesPerRep: 0.5,
    blockTypes: ['kern', 'afsluiting'], complexity: 1,
    coaching: ['Naar de bal toe', 'Handen eerst', 'Durven!'],
    mistakes: [F('Met de voeten de bal afpakken', 'Keepers gebruiken de handen.'), F('Op de rover springen', 'Ga naar de bal, niet naar de speler.')],
    variants: { easier: 'De rover wandelt en legt de bal ver voor.', harder: 'De rover mag een schijnbeweging maken.' },
    diagram: D('vrij', [C(42, 20), C(58, 20), K(50, 28), A(50, 85), B(50, 80)], [drib(1, [50, 79], [50, 50]), run(2, [50, 29], [50, 46])])
  }),
  E({
    id: 'eentegeneen-penalty-in-loop', name: 'Shoot-out met tijdsdruk',
    summary: 'Aanvaller start op de middenlijn met 8 seconden; keeper kiest timing van uitkomen.',
    description: 'Zoals een shoot-out in het hockey: de aanvaller start op 35 meter met de bal en heeft 8 seconden om te scoren. De keeper beslist hoe ver hij uitkomt en wanneer hij afremt. Wedstrijdvorm voor oudere keepers.',
    themes: ['eentegeneen', 'wedstrijd'], ages: FROM16, levels: LV_ADV, intensity: 'hoog', materials: ['ballen', 'pionnen'], keepers: { min: 2, max: 6 }, zone: 'Halve veld', duration: 10, reps: 5, sets: 2, rest: 75, divesPerRep: 0.5, explosive: true, blockTypes: ['kern', 'afsluiting'], complexity: 3,
    coaching: ['Druk zetten zonder te springen', 'Afremmen op 5 meter', 'Lang staan'],
    mistakes: [F('Wachten op de lijn', 'Zet druk zodat de aanvaller moet kiezen.'), F('Te vroeg duiken', 'Wacht op de fout van de aanvaller.')],
    variants: { easier: '10 seconden en de aanvaller mag enkel schieten.', harder: '6 seconden en een verdediger achtervolgt.' },
    diagram: D('halfveld', [K(50, 6), A(50, 92, 'K2'), B(50, 88), C(44, 94), C(56, 94)], [drib(1, [50, 87], [50, 40]), run(1, [50, 7], [50, 22]), pass(2, [50, 38], [54, 4])])
  }),
  E({
    id: 'eentegeneen-afstand-inschatten', name: 'Afstand inschatten bij een dribbel',
    summary: 'De keeper komt uit wanneer de bal los van de voet is en stopt wanneer de aanvaller de bal weer raakt.',
    description: 'De trainer dribbelt traag op doel en duwt de bal af en toe verder voor zich. Telkens de bal los is, zet de keeper twee snelle passen naar voren. Raakt de trainer de bal, dan staat de keeper stil in de basishouding. Leert het ritme van uitkomen.',
    themes: ['eentegeneen', 'voetenwerk'], ages: FROM10, levels: LV_ALL, reps: 5, rest: 45, complexity: 2,
    coaching: ['Bal los? Uitkomen', 'Aanvaller raakt bal? Stilstaan', 'Kort en snel'],
    mistakes: [F('In één ruk uitlopen', 'Uitkomen in stukjes, telkens als de bal los is.'), F('Stilstaan met de benen gestrekt', 'Basishouding, knieën licht gebogen.')],
    variants: { easier: 'Trainer roept "los" en "stop".', harder: 'Trainer varieert het tempo en schiet op het onverwachte moment.' },
    diagram: D('zestien', [K(50, 9), A(50, 70), B(50, 66)], [drib(1, [50, 65], [50, 40]), run(2, [50, 10], [50, 24])])
  }),

  // ---------------- Reflexen ----------------
  E({
    id: 'reflex-afgeweken-bal', name: 'Afgeweken schot',
    summary: 'Schoten worden afgeweken door een pion of medespeler voor het doel; de keeper reageert op de nieuwe richting.',
    description: 'Twee pionnen of een kleine hoepel staan op 6 meter voor het doel. De trainer schiet zo dat sommige ballen tegen de pionnen afwijken. De keeper blijft laag en reageert op de afwijking. Leert niet te vroeg te kiezen.',
    themes: ['reflexen'], ages: FROM10, levels: LV_ADV, materials: ['ballen', 'pionnen'], reps: 8, divesPerRep: 0.5,
    coaching: ['Niet te vroeg kiezen', 'Laag en klaar', 'Handen vóór het lichaam'],
    mistakes: [F('Al vertrekken naar de eerste richting', 'Wacht tot de bal voorbij de pionnen is.'), F('Te rechtop staan', 'Lage basishouding, gewicht vooraan.')],
    variants: { easier: 'Grotere afstand tussen pionnen en doel.', harder: 'Dichterbij en harder.' },
    diagram: D('doel', [K(50, 12), C(46, 32), C(54, 32), T(50, 66), B(50, 61)], [pass(1, [50, 60], [53, 34], [44, 13])])
  }),
  E({
    id: 'reflex-rug-naar-schutter', name: 'Draai en reageer',
    summary: 'De keeper staat met de rug naar de schutter, draait op het schot en reageert op de bal.',
    description: 'De keeper kijkt naar het doel. De trainer roept en schiet tegelijk. De keeper draait zo snel mogelijk om en reageert op de bal. Afstand 10 meter, zodat er net genoeg tijd is. Reactiesnelheid en oriëntatie.',
    themes: ['reflexen'], ages: FROM13, levels: LV_ADV, reps: 6, divesPerRep: 0.5,
    coaching: ['Hoofd eerst draaien', 'Klein draaien, in balans', 'Meteen de bal zoeken'],
    mistakes: [F('Groot draaien en uit balans', 'Draai op de voorvoeten, kort.'), F('Te laat de handen omhoog', 'Handen draaien mee voor de borst.')],
    variants: { easier: 'Trainer roept, wacht een seconde en werpt.', harder: 'Afstand 7 meter en schot naar de hoek.' },
    diagram: D('doel', [K(50, 18), T(50, 52), B(50, 48)], [run(1, [55, 14], [58, 18], [55, 22]), pass(2, [50, 47], [44, 22])])
  }),
  E({
    id: 'reflex-tennisbal-muur', name: 'Kaatsbal tegen de muur',
    summary: 'De trainer gooit een bal tegen een muur of rebounder achter de keeper; de keeper reageert op de terugkaatsing.',
    description: 'De keeper staat 3 meter voor een muur of rebounder, met de rug naar de trainer. De trainer werpt de bal over de keeper tegen de rebounder. De keeper ziet de bal pas na de terugkaatsing en vangt of wert af.',
    themes: ['reflexen'], ages: FROM10, levels: LV_ALL, materials: ['ballen', 'rebounder'], reps: 8, rest: 40,
    coaching: ['Laag en breed', 'Handen klaar', 'Reageer, gok niet'],
    mistakes: [F('Te dicht bij de rebounder', 'Minstens 3 meter, anders is het geen reflex maar geluk.'), F('Rechtop staan', 'Laag zitten zodat je beide kanten haalt.')],
    variants: { easier: 'Grotere afstand en zachter werpen.', harder: 'Kortere afstand of twee ballen na elkaar.' },
    diagram: D('vrij', [RB(50, 20), K(50, 42), T(50, 82), B(50, 77)], [pass(1, [50, 76], [52, 24]), pass(2, [50, 26], [44, 40])])
  }),
  E({
    id: 'reflex-kleurroep', name: 'Kleur of nummer roepen',
    summary: 'Twee schutters, de trainer roept wie schiet; de keeper moet snel kiezen en positie nemen.',
    description: 'Twee schutters met elk een kleur of nummer staan op 12 meter, links en rechts. De trainer roept een kleur, die schutter schiet meteen. De keeper verplaatst zo snel mogelijk naar de juiste positie en verwerkt het schot.',
    themes: ['reflexen', 'voetenwerk'], ages: FROM10, levels: LV_ALL, keepers: { min: 2, max: 4 }, trainers: 1, reps: 8, divesPerRep: 0.5,
    coaching: ['Luisteren en kiezen', 'Snel positie nemen', 'Sprongstop voor het schot'],
    mistakes: [F('Gokken op de kleur', 'Blijf in het midden tot je de roep hoort.'), F('Te diep in doel', 'Stap mee naar voren voor een betere hoek.')],
    variants: { easier: 'Schutter wacht 2 seconden na de roep.', harder: 'Drie schutters en de roep komt vlak voor het schot.' },
    diagram: D('doel', [K(50, 14), T(30, 58, '1'), S(70, 58, '2'), B(32, 53), B(68, 53)], [run(1, [50, 14], [45, 15]), pass(2, [33, 52], [41, 14])])
  }),
  E({
    id: 'reflex-liggend-starten', name: 'Starten vanuit buiklig',
    summary: 'De keeper ligt op de buik, springt op het signaal recht en verwerkt meteen een schot.',
    description: 'De keeper ligt op de buik op 2 meter voor de doellijn. Op het fluitsignaal komt hij zo snel mogelijk recht in de basishouding, en de trainer schiet meteen. Zwaar en explosief: lange rust.',
    themes: ['reflexen', 'duiken'], ages: FROM13, levels: LV_ADV, intensity: 'hoog', reps: 5, rest: 75, divesPerRep: 0.5, explosive: true,
    coaching: ['Explosief recht', 'Meteen in basishouding', 'Klaar voor elk schot'],
    mistakes: [F('Rechtkomen over de knieën in drie stappen', 'Duw je op met beide handen in één beweging.'), F('Nog niet klaar bij het schot', 'Eerst positie, dan pas de bal.')],
    variants: { easier: 'Starten vanuit zit.', harder: 'Starten vanuit rugligging of na een koprol.' },
    diagram: D('doel', [K(50, 18), T(50, 58), B(50, 53)], [run(1, [50, 20], [50, 15]), pass(2, [50, 52], [42, 13])])
  }),
  E({
    id: 'reflex-voetvolley', name: 'Volleys op korte afstand',
    summary: 'De trainer volleert uit de hand vanop 8 meter; korte reactietijd en harde ballen.',
    description: 'De trainer laat de bal uit de hand vallen en volleert naar het doel. Varieer: op het lichaam, naast het hoofd, laag aan de voeten. De keeper blijft klein en reageert. Korte series met volledige rust.',
    themes: ['reflexen'], ages: FROM16, levels: ELITE, intensity: 'hoog', reps: 6, rest: 75, divesPerRep: 0.5, explosive: true, keepers: { min: 1, max: 2 },
    coaching: ['Klein en compact', 'Handen vóór het lichaam', 'Bal weg van het doel'],
    mistakes: [F('Ogen dicht', 'Kijk de bal tot het contact.'), F('Te diep in de knieën', 'Licht gebogen, snel weg te springen.')],
    variants: { easier: 'Werpen in plaats van volleren.', harder: 'Twee trainers die om beurt volleren.' },
    diagram: D('doel', [K(50, 12), T(50, 40), B(50, 37)], [pass(1, [49, 36], [44, 13]), pass(2, [51, 36], [57, 13])])
  }),

  // ---------------- Distributie ----------------
  E({
    id: 'distributie-onderhands-rollen', name: 'Onderhands rollen naar de voet',
    summary: 'Na een vangbal de bal onderhands en vlak naar de voet van een medespeler rollen.',
    description: 'Twee medespelers (keepers) staan op 15 meter, links en rechts. De keeper vangt een bal van de trainer en rolt hem onderhands vlak naar de voet van de vrije medespeler, die met één aanname kan doorspelen.',
    themes: ['distributie'], ages: ALL, levels: LV_ALL, intensity: 'laag', keepers: { min: 2, max: 5 }, zone: 'Strafschopgebied', reps: 8, rest: 30, complexity: 1,
    coaching: ['Diep door de knieën', 'Bal vlak loslaten', 'Naar de goede voet'],
    mistakes: [F('Bal stuitert', 'Laat de bal los net boven de grond.'), F('Bal in de rug van de speler', 'Rol naar de voet die het verst van de druk is.')],
    variants: { easier: 'Kortere afstand en medespeler staat stil.', harder: 'Medespeler beweegt en de bal moet in de loop.' },
    diagram: D('zestien', [K(50, 10), T(50, 50), S(15, 30, 'K2'), S(85, 30, 'K3'), B(50, 46)], [pass(1, [50, 45], [50, 14]), pass(2, [47, 13], [18, 29])])
  }),
  E({
    id: 'distributie-katapult', name: 'Bovenhandse katapultworp',
    summary: 'Lange, gestrekte werpbeweging over de schouder tot voorbij de middenlijn.',
    description: 'De keeper werpt de bal met een gestrekte arm over de schouder (katapult) naar een medespeler of zone op 30 tot 40 meter. Aanloop van twee passen, steunbeen gericht naar het doel. Tel hoeveel ballen in de zone landen.',
    themes: ['distributie'], ages: FROM13, levels: LV_ALL, intensity: 'laag', materials: ['ballen', 'pionnen'], zone: 'Halve veld', reps: 8, rest: 30, complexity: 1,
    coaching: ['Arm gestrekt', 'Steunbeen naar het doel', 'Doorzwaaien'],
    mistakes: [F('Gebogen elleboog', 'Hou de arm gestrekt als een katapult.'), F('Te hoge baan', 'Laat de bal later los voor een vlakkere baan.')],
    variants: { easier: 'Kortere afstand en grote zone.', harder: 'Naar een lopende medespeler.' },
    diagram: D('halfveld', [K(50, 10), B(50, 13), C(70, 55), C(85, 55), C(70, 70), C(85, 70), S(78, 62)], [pass(1, [52, 14], [76, 60])])
  }),
  E({
    id: 'distributie-uittrap-grond', name: 'Doeltrap naar de flanken',
    summary: 'Doeltrappen vanaf de grond precies naar een medespeler op de flank.',
    description: 'De bal ligt op de rand van het doelgebied. De keeper trapt lang naar een medespeler op de linker- of rechterflank, ter hoogte van de middenlijn. Werk aan aanloop (schuin), standbeen naast de bal en contact met de wreef.',
    themes: ['distributie'], ages: FROM13, levels: LV_ALL, intensity: 'laag', materials: ['ballen', 'pionnen'], zone: 'Halve veld', reps: 8, sets: 2, rest: 30, complexity: 1,
    coaching: ['Schuine aanloop', 'Standbeen naast de bal', 'Raken met de wreef'],
    mistakes: [F('Bal tegen de grond trappen', 'Raak de onderkant van de bal, lichaam licht achterover.'), F('Rechte aanloop', 'Kom schuin aan voor meer kracht.')],
    variants: { easier: 'Kortere afstand en een grote zone.', harder: 'Medespeler loopt diep, trap in zijn loop.' },
    diagram: D('halfveld', [K(50, 13), B(50, 10), S(12, 80), S(88, 80), C(8, 90), C(92, 90)], [run(1, [42, 18], [48, 12]), pass(2, [49, 10], [14, 77])])
  }),
  E({
    id: 'distributie-snelle-tegenaanval', name: 'Uitworp in de loop',
    summary: 'De keeper vangt een voorzet en werpt meteen naar een medespeler die diep loopt.',
    description: 'De trainer geeft een voorzet die de keeper vangt. Op dat moment sprint een medespeler diep op de flank. De keeper werpt binnen 3 seconden in de loop van de medespeler, ver genoeg zodat hij niet hoeft te vertragen.',
    themes: ['distributie', 'wedstrijd'], ages: FROM13, levels: LV_ADV, keepers: { min: 2, max: 4 }, zone: 'Halve veld', reps: 6, complexity: 3,
    coaching: ['Vangen, kijken, werpen', 'Voor de speler uit', 'Snel maar precies'],
    mistakes: [F('Te kort werpen', 'Werp naar de ruimte waar de speler over twee seconden is.'), F('Eerst laten stuiteren', 'De bal is sneller door de lucht of vlak over de grond.')],
    variants: { easier: 'Medespeler loopt trager en kortere worp.', harder: 'Een verdediger loopt mee met de medespeler.' },
    diagram: D('halfveld', [K(50, 8), T(85, 25), B(83, 22), S(20, 40, 'K2')], [pass(1, [82, 22], [60, 10], [52, 9]), pass(2, [49, 10], [15, 60])])
  }),
  E({
    id: 'distributie-precisie-pionnen', name: 'Precisietrap naar pionnen',
    summary: 'Vanuit de hand of de grond pionnen raken op verschillende afstanden.',
    description: 'Vier pionnen staan op 20, 30, 40 en 50 meter. De keeper probeert met volley, dropkick of doeltrap elke pion te raken of binnen 3 meter te laten landen. Punten per afstand. Leuk als afsluiter.',
    themes: ['distributie'], ages: FROM10, levels: LV_ALL, intensity: 'laag', materials: ['ballen', 'pionnen'], keepers: { min: 1, max: 6 }, zone: 'Halve veld', reps: 8, sets: 2, rest: 30,
    blockTypes: ['kern', 'afsluiting'], complexity: 1,
    coaching: ['Rustig mikken', 'Kijk naar de bal bij het raken', 'Doorzwaaien naar je doel'],
    mistakes: [F('Te hard willen trappen', 'Precisie eerst, kracht volgt.'), F('Bal opgooien voor de volley', 'Laat hem vallen van heuphoogte.')],
    variants: { easier: 'Enkel de dichtste pionnen, grote zone.', harder: 'Enkel de verste pionnen of met de zwakke voet.' },
    diagram: D('halfveld', [K(50, 8), B(50, 11), C(40, 35, '1'), C(60, 50, '2'), C(35, 65, '3'), C(65, 85, '4')], [pass(1, [49, 12], [40, 33]), pass(2, [51, 12], [60, 48])])
  }),
  E({
    id: 'distributie-werpen-jong', name: 'Spelvorm: bowlen met de keeper',
    summary: 'Speelse rolworp voor de jongsten: pionnen omrollen als kegels.',
    description: 'Vijf pionnen staan als kegels op 8 meter. De keeper rolt de bal onderhands en probeert zoveel mogelijk pionnen om te rollen. Telkens drie pogingen, dan wisselen. Leert de onderhandse worp spelenderwijs.',
    themes: ['distributie'], ages: UPTO12, levels: LV_LOW, intensity: 'laag', materials: ['ballen', 'pionnen'], keepers: { min: 1, max: 6 }, zone: '10 × 5 m', duration: 6, reps: 6, rest: 20,
    blockTypes: ['kern', 'afsluiting'], complexity: 1,
    coaching: ['Door de knieën', 'Bal laag laten rollen', 'Wijs na naar je doel'],
    mistakes: [F('Bal gooien in plaats van rollen', 'Laat los vlak bij de grond.'), F('Rechtop werpen', 'Zak diep, alsof je gaat bowlen.')],
    variants: { easier: 'Kortere afstand en meer kegels.', harder: 'Langere afstand en één bepaalde kegel raken.' },
    diagram: D('vrij', [K(15, 50), B(19, 50), C(75, 42), C(80, 47), C(80, 53), C(85, 40), C(85, 58)], [pass(1, [20, 50], [74, 48])])
  }),
  E({
    id: 'distributie-dropkick-lijn', name: 'Dropkick met lage baan',
    summary: 'Dropkick aanleren: bal laten vallen en net na de stuit raken voor een strakke, lage baan.',
    description: 'De keeper laat de bal vallen en raakt hem net nadat hij de grond raakt (dropkick). Doel is een vlakke, snelle bal naar een medespeler op 30 meter. Eerst stilstaand, dan met een kleine aanloop.',
    themes: ['distributie'], ages: FROM13, levels: LV_ADV, intensity: 'laag', zone: 'Halve veld', reps: 8, sets: 2, rest: 30, complexity: 2,
    coaching: ['Bal laten vallen, niet gooien', 'Raken net na de stuit', 'Lichaam over de bal'],
    mistakes: [F('Raken voor de stuit', 'Wacht op de stuit: dat is een volley, geen dropkick.'), F('Bal gaat hoog', 'Knie over de bal, teen naar beneden.')],
    variants: { easier: 'Kortere afstand en stilstaand.', harder: 'Naar een lopende medespeler op 40 meter.' },
    diagram: D('halfveld', [K(50, 10), B(50, 13), S(70, 55, 'K2')], [pass(1, [51, 14], [68, 52])])
  }),

  // ---------------- Opbouw ----------------
  E({
    id: 'opbouw-driehoek', name: 'Opbouw in een driehoek',
    summary: 'De keeper speelt met twee centrale verdedigers in een driehoek de bal rond en kiest de vrije kant.',
    description: 'Twee medespelers staan breed aan de rand van de zestien. Een aanvaller zet druk op een van hen. De keeper krijgt de bal, scant en speelt naar de vrije verdediger. Daarna speelt die terug of door. Met de voet, maximaal twee contacten.',
    themes: ['opbouw'], ages: FROM13, levels: LV_ADV, materials: ['ballen', 'pionnen'], keepers: { min: 3, max: 6 }, zone: 'Strafschopgebied', duration: 10, reps: 6, complexity: 3,
    coaching: ['Scan voor de aanname', 'Open houding', 'Speel naar de vrije man'],
    mistakes: [F('Naar de gedekte man spelen', 'Kijk eerst waar de druk staat.'), F('Te traag', 'Twee contacten: aannemen en spelen.')],
    variants: { easier: 'Zonder aanvaller, vrij rondspelen.', harder: 'Twee aanvallers en één contact.' },
    diagram: D('zestien', [C(12, 52), C(88, 52), K(50, 10), S(20, 48, 'V1'), S(80, 48, 'V2'), A(30, 40), B(50, 14)], [pass(1, [22, 46], [48, 14]), pass(2, [53, 13], [78, 46])])
  }),
  E({
    id: 'opbouw-aanname-zwakke-voet', name: 'Aanname met beide voeten',
    summary: 'Ballen aannemen en doorspelen met links en rechts, met een open lichaamshouding.',
    description: 'De trainer speelt de bal naar de keeper, die hem met de verste voet aanneemt richting een poortje links of rechts en erdoor speelt. Telkens afwisselen. Ook de zwakke voet moet de bal kunnen aannemen en doorspelen.',
    themes: ['opbouw'], ages: ALL, levels: LV_ALL, intensity: 'laag', materials: ['ballen', 'pionnen'], zone: 'Strafschopgebied', reps: 8, rest: 30, blockTypes: ['opwarming', 'kern'], warmup: ['balgewenning'], complexity: 1,
    coaching: ['Aannemen met de verste voet', 'Open naar het veld', 'Kijk naar je doel'],
    mistakes: [F('Aannemen met de dichtste voet', 'De verste voet opent je lichaam.'), F('Bal onder het lichaam', 'Neem aan naar de kant waar je gaat spelen.')],
    variants: { easier: 'Trage pass en één poortje.', harder: 'In één tijd doorspelen met de zwakke voet.' },
    diagram: D('zestien', [K(50, 12), T(50, 50), B(50, 46), C(20, 25), C(26, 25), C(74, 25), C(80, 25)], [pass(1, [50, 45], [50, 16]), pass(2, [52, 13], [77, 24])])
  }),
  E({
    id: 'opbouw-lange-bal-of-kort', name: 'Kort of lang beslissen',
    summary: 'De keeper kiest bij de opbouw tussen een korte pass en een lange bal, afhankelijk van de druk.',
    description: 'Twee korte opties (verdedigers) en één lange optie (aanvaller op de middenlijn). Twee aanvallers zetten druk; de trainer bepaalt bij elke herhaling waar ze staan. De keeper speelt kort als er een vrije man is, anders lang.',
    themes: ['opbouw', 'distributie'], ages: FROM16, levels: LV_ADV, materials: ['ballen', 'pionnen'], keepers: { min: 4, max: 6 }, zone: 'Halve veld', duration: 10, reps: 6, complexity: 3,
    coaching: ['Eerst kijken, dan beslissen', 'Vrije man kort, anders lang', 'Kwaliteit van de pass'],
    mistakes: [F('Altijd lang trappen', 'Kijk eerst of er een veilige korte optie is.'), F('Kort spelen onder druk', 'Als de korte man gedekt is, kies de lange bal.')],
    variants: { easier: 'Eén aanvaller, de keeper heeft tijd.', harder: 'Aanvallers verplaatsen nog net voor de pass.' },
    diagram: D('halfveld', [C(50, 70), C(70, 70), K(50, 8), S(25, 28, 'V1'), S(75, 28, 'V2'), A(30, 22), A(65, 30), S(60, 85, 'S'), B(50, 11)], [pass(1, [50, 12], [58, 82])])
  }),
  E({
    id: 'opbouw-terugspeelbal-onder-druk', name: 'Terugspeelbal in één tijd',
    summary: 'Een medespeler speelt terug onder druk; de keeper speelt in één tijd naar de andere flank.',
    description: 'Een medespeler aan de rand van de zestien krijgt een aanvaller in de rug en speelt de bal terug naar de keeper. De keeper speelt in één tijd door naar een medespeler op de andere flank. Snel en zonder risico.',
    themes: ['opbouw'], ages: FROM13, levels: LV_ADV, materials: ['ballen', 'pionnen'], keepers: { min: 3, max: 6 }, zone: 'Strafschopgebied', reps: 6, complexity: 3,
    coaching: ['Vooraf kijken', 'In één tijd', 'Strak langs de grond'],
    mistakes: [F('Eerst aannemen onder druk', 'Je weet al waar de bal heen moet: speel meteen.'), F('Bal hoog doorspelen', 'Knie over de bal, binnenkant voet.')],
    variants: { easier: 'Twee contacten toegestaan.', harder: 'De aanvaller loopt mee door op de keeper.' },
    diagram: D('zestien', [C(20, 54), C(30, 54), K(50, 10), S(25, 50, 'V'), A(28, 58), S(85, 40, 'K3'), B(26, 46)], [pass(1, [27, 46], [48, 14]), pass(2, [53, 12], [82, 38])])
  }),
  E({
    id: 'opbouw-rondo-groot', name: 'Positiespel 4-tegen-2 met keeper',
    summary: 'Vier spelers en de keeper houden de bal tegen twee afdekkers in een zone met doel.',
    description: 'In een zone van 25 × 20 meter voor het doel spelen de keeper en vier spelers de bal rond tegen twee afdekkers. De keeper is de diepste man en moet altijd aanspeelbaar zijn. Na 8 passes een punt. Verliest de ploeg de bal, dan mogen de afdekkers op doel spelen.',
    themes: ['opbouw', 'communicatie'], ages: FROM13, levels: LV_ADV, materials: ['ballen', 'pionnen'], keepers: { min: 6, max: 6 }, trainers: 1, zone: '25 × 20 m', duration: 12, sets: 3, reps: 1, rest: 60, complexity: 3,
    coaching: ['Altijd aanspeelbaar', 'Coach je medespelers', 'Speel weg van de druk'],
    mistakes: [F('Achter een tegenstander staan', 'Beweeg zodat er een vrije passlijn is.'), F('Stil blijven', 'Geef info: "man", "tijd", "draai".')],
    variants: { easier: '5-tegen-1 en grotere zone.', harder: '4-tegen-3 of beperkte contacten.' },
    diagram: D('zestien', [C(8, 70), C(92, 70), K(50, 12), S(15, 35), S(85, 35), S(30, 60), S(70, 60), A(42, 38), A(60, 45), B(16, 32)], [pass(1, [18, 33], [47, 15]), pass(2, [53, 15], [82, 33])])
  }),
  E({
    id: 'opbouw-passen-poortjes', name: 'Passen door poortjes',
    summary: 'Technische passvorm voor de keeper: korte en lange passes door poortjes op verschillende afstanden.',
    description: 'Vier poortjes van pionnen staan op 10, 15, 20 en 25 meter. De keeper speelt de bal met binnenkant en wreef door elk poortje naar een medespeler of trainer. Eerst stilstaande bal, dan na een aanname.',
    themes: ['opbouw', 'distributie'], ages: ALL, levels: LV_ALL, intensity: 'laag', materials: ['ballen', 'pionnen'], keepers: { min: 1, max: 6 }, zone: '25 × 20 m', reps: 8, rest: 30, blockTypes: ['opwarming', 'kern'], warmup: ['balgewenning'], complexity: 1,
    coaching: ['Standbeen naast de bal', 'Binnenkant voor korte passes', 'Kijk naar je doel'],
    mistakes: [F('Bal tikken met de teen', 'Gebruik de binnenkant voor precisie.'), F('Achteroverleunen', 'Lichaam over de bal voor een lage pass.')],
    variants: { easier: 'Grote poortjes op korte afstand.', harder: 'Kleine poortjes en enkel de zwakke voet.' },
    diagram: D('vrij', [K(10, 50), B(14, 50), C(30, 38), C(30, 46), C(50, 58), C(50, 66), C(70, 30), C(70, 38), T(90, 50)], [pass(1, [15, 50], [30, 42], [88, 49]), pass(2, [15, 52], [50, 62], [88, 52])])
  }),
  E({
    id: 'opbouw-spelvorm-meevoetballen', name: 'Spelvorm: keeper als laatste man',
    summary: 'Kleine partij waarin de keeper meevoetbalt als vrije man en zijn doel verdedigt.',
    description: 'Partijtje 3-tegen-3 op een half veld van 30 × 20 meter met twee doelen en twee keepers. De keepers mogen de bal enkel met de voet terugspelen binnen hun zone en zijn de vrije man voor hun ploeg. Doelpunt na een pass via de keeper telt dubbel.',
    themes: ['opbouw', 'wedstrijd'], ages: ALL, levels: LV_ALL, materials: ['ballen', 'pionnen'], keepers: { min: 2, max: 6 }, trainers: 1, zone: '30 × 20 m', duration: 12, sets: 3, reps: 1, rest: 60, blockTypes: ['kern', 'afsluiting'], complexity: 3,
    coaching: ['Altijd aanspeelbaar', 'Rustig blijven aan de bal', 'Kies de veilige kant'],
    mistakes: [F('Risico in de eigen zestien', 'Twijfel? Speel naar de zijkant.'), F('Te ver uit doel', 'Blijf binnen bereik van je doel.')],
    variants: { easier: 'Keepers mogen ook met de hand spelen.', harder: 'Twee contacten maximum voor de keeper.' },
    diagram: D('vrij', [C(4, 4), C(96, 4), C(96, 96), C(4, 96), MG(50, 5), MG(50, 95, 180), K(50, 12, 'K1'), K(50, 88, 'K2'), S(30, 40), S(70, 45), A(40, 60), A(65, 65), B(32, 44)], [pass(1, [33, 43], [48, 15]), pass(2, [52, 14], [68, 42])])
  }),

  // ---------------- Communicatie ----------------
  E({
    id: 'communicatie-coachen-verdediging', name: 'Verdediging coachen bij een aanval',
    summary: 'De keeper coacht twee verdedigers terwijl de trainer aanvalt: druk zetten, dekken, schuiven.',
    description: 'Twee verdedigers staan voor de zestien. De trainer en een aanvaller combineren. De keeper geeft korte, duidelijke opdrachten: "druk!", "dekken!", "schuif links!". Na elke aanval bespreekt de trainer welke commando\'s duidelijk waren.',
    themes: ['communicatie'], ages: FROM13, levels: LV_ADV, materials: ['ballen', 'pionnen'], keepers: { min: 4, max: 6 }, zone: 'Strafschopgebied plus 15 m', duration: 10, reps: 6, divesPerRep: 0.3, complexity: 3,
    coaching: ['Kort en luid', 'Naam plus opdracht', 'Coach vóór het gevaar'],
    mistakes: [F('Lange zinnen', 'Twee woorden: naam en opdracht.'), F('Pas roepen als het te laat is', 'Kijk vooruit en coach de volgende actie.')],
    variants: { easier: 'De trainer pauzeert na elke pass zodat de keeper kan coachen.', harder: 'Aanval aan wedstrijdtempo met twee aanvallers.' },
    diagram: D('zestien', [C(25, 80), C(75, 80), K(50, 10), S(38, 45, 'V1'), S(62, 45, 'V2'), A(45, 70), T(70, 75), B(70, 71)], [pass(1, [69, 70], [47, 66]), drib(2, [46, 65], [52, 55]), pass(3, [52, 54], [56, 8])])
  }),
  E({
    id: 'communicatie-roepen-duo', name: 'Roepen in duo: "Ik!" of "Jij!"',
    summary: 'Twee keepers staan samen in doel en roepen wie de bal neemt; een snel en speels communicatiespel.',
    description: 'Twee keepers staan naast elkaar in een doel van 7 meter. De trainer werpt of schiet tussen beide in. Een van de keepers roept "ik!" en neemt de bal, de andere maakt ruimte. Wie zwijgt of botst, levert een punt in. Leuk voor alle leeftijden.',
    themes: ['communicatie'], ages: ALL, levels: LV_ALL, intensity: 'laag', keepers: { min: 2, max: 6 }, reps: 8, rest: 30, blockTypes: ['opwarming', 'kern', 'afsluiting'], complexity: 1,
    coaching: ['Vroeg roepen', 'Wie roept, gaat', 'De ander maakt ruimte'],
    mistakes: [F('Allebei naar de bal', 'De eerste roep beslist.'), F('Te zacht roepen', 'Roep zo dat ook je verdedigers het horen.')],
    variants: { easier: 'Trainer werpt traag en duidelijk naar het midden.', harder: 'Schot harder en sneller na elkaar.' },
    diagram: D('doel', [K(44, 12, 'K1'), K(56, 12, 'K2'), T(50, 60), B(50, 55)], [pass(1, [50, 54], [50, 16])])
  }),
  E({
    id: 'communicatie-afstemming-buitenspel', name: 'Lijn hoog houden met de verdediging',
    summary: 'De keeper stuurt de verdedigingslijn naar voren en achteren en volgt zelf mee.',
    description: 'Vier verdedigers (pionnen of spelers) vormen een lijn. De trainer speelt de bal naar voren of naar achteren. De keeper roept "stap!" of "zak!" en verplaatst zelf mee, zodat de afstand tot de lijn klein blijft. Daarna een diepe bal: de keeper onderschept.',
    themes: ['communicatie', 'eentegeneen'], ages: FROM16, levels: LV_ADV, materials: ['ballen', 'pionnen'], keepers: { min: 1, max: 4 }, zone: 'Halve veld', duration: 10, reps: 6, complexity: 3,
    coaching: ['Volg de lijn mee', 'Roep "stap" en "zak"', 'Diepe bal is voor jou'],
    mistakes: [F('Op de doellijn blijven', 'Blijf op 10 à 15 meter achter de lijn.'), F('Niet coachen', 'Jij ziet alles: stuur de lijn.')],
    variants: { easier: 'Zonder diepe bal, enkel de lijn sturen.', harder: 'Met een aanvaller die op de diepte loopt.' },
    diagram: D('halfveld', [K(50, 25), C(20, 45), C(40, 45), C(60, 45), C(80, 45), T(50, 85), B(50, 80)], [run(1, [50, 25], [50, 33]), pass(2, [50, 79], [55, 38]), run(3, [50, 33], [54, 36])])
  }),
  E({
    id: 'communicatie-hoekschop-indeling', name: 'Hoekschop: indeling en zones',
    summary: 'De keeper deelt zijn verdedigers in bij een hoekschop en bewaakt de vrije zones.',
    description: 'Bij een stilstaande hoekschop zet de keeper zijn spelers (of pionnen) op hun plaats: man aan de eerste paal, zone in het doelgebied, een man op de rand van de zestien. Daarna neemt de trainer de hoekschop en verdedigt de groep.',
    themes: ['communicatie', 'hogeballen'], ages: FROM13, levels: LV_ADV, intensity: 'laag', materials: ['ballen', 'pionnen'], keepers: { min: 1, max: 6 }, zone: 'Strafschopgebied', reps: 5, sets: 2, rest: 30, complexity: 2,
    coaching: ['Iedereen een taak', 'Eerste paal bezet', 'Jij beslist in het doelgebied'],
    mistakes: [F('Te veel spelers op de lijn', 'De lijn is jouw zone; zet spelers op de eerste paal en ervoor.'), F('Pas indelen als de bal vertrekt', 'Ruim op tijd, vóór de nemer klaarstaat.')],
    variants: { easier: 'Enkel indelen zonder hoekschop.', harder: 'Aanvallers wisselen van plaats net voor de hoekschop.' },
    diagram: D('zestien', [K(50, 9), C(42, 10), C(50, 18), C(58, 18), C(50, 40), T(97, 6), B(95, 7)], [pass(1, [94, 8], [72, 8], [54, 15]), run(2, [50, 10], [53, 14])])
  }),
  E({
    id: 'communicatie-spelvorm-blind', name: 'Blinde keeper: alleen op stem',
    summary: 'Speelse vertrouwensvorm: een keeper met de ogen dicht wordt door een andere keeper naar de bal gecoacht.',
    description: 'Een keeper staat met de ogen dicht (of een hand voor de ogen) in een zone. De andere keeper coacht hem met korte woorden naar een stilliggende bal: "links", "twee stappen", "stop", "pak". Leert kort en precies coachen. Voor alle leeftijden als afsluiter.',
    themes: ['communicatie'], ages: ALL, levels: LV_ALL, intensity: 'laag', materials: ['ballen', 'pionnen'], keepers: { min: 2, max: 6 }, zone: '10 × 10 m', duration: 6, reps: 4, rest: 20, blockTypes: ['afsluiting'], complexity: 1,
    coaching: ['Kort en precies', 'Eén woord per opdracht', 'Vertrouw op je partner'],
    mistakes: [F('Te veel woorden tegelijk', 'Eén opdracht per keer, dan wachten.'), F('Onduidelijke richting', 'Spreek af: links en rechts vanuit de blinde keeper.')],
    variants: { easier: 'Ogen half open en de bal dichtbij.', harder: 'De bal rolt traag en de keeper moet hem onderscheppen.' },
    diagram: D('vrij', [C(10, 10), C(90, 10), C(90, 90), C(10, 90), K(30, 70, 'K1'), K(20, 30, 'K2'), B(70, 30)], [run(1, [32, 68], [50, 50], [66, 34])])
  }),
  E({
    id: 'communicatie-vrije-trap-muur-wedstrijd', name: 'Vrije trappen met muur en rebound',
    summary: 'Vrije trap rond de zestien: muur zetten, schot verwerken en de rebound coachen.',
    description: 'De keeper zet de muur (spelers of pionnen), de trainer trapt de vrije trap. Na de redding volgt een aanvaller in op de rebound. De keeper coacht zijn spelers om de rebound weg te werken of pakt hem zelf.',
    themes: ['communicatie', 'wedstrijd'], ages: FROM13, levels: LV_ADV, materials: ['ballen', 'pionnen'], keepers: { min: 2, max: 6 }, zone: 'Strafschopgebied', reps: 5, sets: 2, rest: 60, divesPerRep: 1, complexity: 3,
    coaching: ['Muur snel zetten', 'Zicht op de bal', 'Rebound coachen'],
    mistakes: [F('Niet opletten na de redding', 'Na het schot is de fase niet voorbij: rebound!'), F('Muur zetten en zelf achter de muur staan', 'Sta naast de muur met zicht op de bal.')],
    variants: { easier: 'Zonder rebound-aanvaller.', harder: 'De nemer mag ook kort spelen naar een tweede schutter.' },
    diagram: D('zestien', [K(58, 10), C(38, 44), C(42, 45), C(46, 46), T(30, 70), B(33, 66), A(60, 45)], [pass(1, [34, 64], [44, 40], [52, 8]), run(2, [58, 11], [53, 10]), pass(3, [52, 12], [58, 30])])
  }),

  // ---------------- Wedstrijdvoorbereiding ----------------
  E({
    id: 'wedstrijd-opwarmroutine-kort', name: 'Korte wedstrijdopwarming (15 min)',
    summary: 'Compacte routine voor voor de match: balgewenning, voetenwerk, vangen, duiken en een paar hoge ballen.',
    description: 'Vaste volgorde: 3 minuten balgewenning in de hand, 2 minuten voetenwerk met vangbal, 3 minuten lage en halve duiken, 3 minuten hoge ballen, 4 minuten schoten van verschillende posities. De keeper weet altijd wat er komt: rust en vertrouwen.',
    themes: ['wedstrijd', 'vangen'], ages: FROM10, levels: LV_ALL, materials: ['ballen'], keepers: { min: 1, max: 2 }, duration: 15, sets: 5, reps: 1, rest: 15, divesPerRep: 4, blockTypes: ['opwarming'], warmup: ['balgewenning'], complexity: 2,
    coaching: ['Altijd dezelfde volgorde', 'Opbouwen in tempo', 'Eindigen met een goed gevoel'],
    mistakes: [F('Te zware opwarming', 'Het is opwarmen, geen training: kort en scherp.'), F('Eindigen met een tegendoelpunt', 'Laat de laatste bal altijd een succesvolle redding zijn.')],
    variants: { easier: '10 minuten met minder duiken.', harder: 'Voeg een paar voorzetten toe met een medespeler.' },
    diagram: D('zestien', [K(50, 10), T(50, 45), B(50, 41), C(30, 50), C(70, 50)], [pass(1, [50, 40], [50, 14]), pass(2, [48, 40], [42, 10]), pass(3, [52, 40], [58, 10])])
  }),
  E({
    id: 'wedstrijd-spelsituaties', name: 'Wedstrijdsituaties na elkaar',
    summary: 'Drie typische wedstrijdacties na elkaar: schot, voorzet en 1-tegen-1, met korte rust tussen de reeksen.',
    description: 'De trainer en een medespeler spelen telkens drie acties na elkaar: een afstandsschot, een voorzet vanaf de flank en een doorgebroken aanvaller. De keeper herstelt tussen elke actie. Simuleert de intensiteit van een wedstrijd.',
    themes: ['wedstrijd', 'eentegeneen'], ages: FROM16, levels: LV_ADV, intensity: 'hoog', keepers: { min: 2, max: 3 }, zone: 'Strafschopgebied', duration: 10, reps: 3, sets: 4, rest: 90, divesPerRep: 1, explosive: true, complexity: 3,
    coaching: ['Na elke actie herstellen', 'Positie voor elke situatie', 'Volle concentratie'],
    mistakes: [F('Te snel naar de volgende actie zonder positie', 'Eerst juist staan, dan pas reageren.'), F('Concentratie verliezen', 'Elke actie is de belangrijkste.')],
    variants: { easier: 'Twee acties en langere rust.', harder: 'Vier acties met een aanvaller op de rebounds.' },
    diagram: D('zestien', [K(50, 10), T(50, 60), S(90, 35, 'K2'), A(40, 75), B(50, 56), B(88, 32)], [pass(1, [50, 55], [45, 12]), pass(2, [87, 32], [65, 18], [53, 16]), drib(3, [40, 72], [45, 40])])
  }),
  E({
    id: 'wedstrijd-penaltyreeks', name: 'Strafschoppenreeks',
    summary: 'Wedstrijdecht: vijf strafschoppen na elkaar met de routine en de druk van een echte reeks.',
    description: 'Vijf schutters trappen om beurt een strafschop, zoals in een echte reeks. De keeper volgt zijn routine: water, handschoenen, positie op de lijn. De andere keepers moedigen aan of storen (lawaai). Tel de reddingen en bespreek de keuzes.',
    themes: ['wedstrijd'], ages: FROM13, levels: LV_ALL, keepers: { min: 2, max: 6 }, zone: 'Strafschopgebied', reps: 5, sets: 1, rest: 45, divesPerRep: 1, explosive: true, blockTypes: ['afsluiting', 'kern'], complexity: 3,
    coaching: ['Vaste routine', 'Lang wachten', 'Explosief vertrekken'],
    mistakes: [F('Routine overslaan onder druk', 'Juist onder druk houdt de routine je rustig.'), F('Te vroeg vertrekken', 'Wacht tot het standbeen van de schutter staat.')],
    variants: { easier: 'Strafschop vanop 8 meter.', harder: 'Schutters mogen kiezen voor een panenka of stop in de aanloop.' },
    diagram: D('zestien', [K(50, 6), S(45, 45, '1'), S(50, 45, '2'), S(55, 45, '3'), B(50, 37.1)], [pass(1, [50, 35], [56, 6]), run(2, [52, 7], [56, 7])])
  }),
  E({
    id: 'wedstrijd-mentale-routine', name: 'Na een fout: reset-routine',
    summary: 'De keeper oefent een korte routine om na een tegendoelpunt of fout meteen terug te focussen.',
    description: 'De trainer laat bewust een paar ballen binnengaan (onhoudbaar schot of een bewuste "fout"). Na elk doelpunt doet de keeper zijn reset: bal uit het net, diep ademhalen, handschoenen aantrekken, een kernwoord zeggen. Daarna meteen een nieuwe actie die goed moet gaan.',
    themes: ['wedstrijd', 'communicatie'], ages: FROM13, levels: LV_ALL, intensity: 'laag', reps: 6, sets: 2, rest: 30, divesPerRep: 0.5, blockTypes: ['kern', 'afsluiting'], complexity: 2,
    coaching: ['Eén ademhaling, één kernwoord', 'Volgende bal is de belangrijkste', 'Coach meteen weer'],
    mistakes: [F('Blijven hangen in de fout', 'Gebruik de routine om te resetten.'), F('Te lang treuzelen', 'Max. 10 seconden, dan sta je weer klaar.')],
    variants: { easier: 'Rustig tempo en veel tijd voor de routine.', harder: 'Meteen na het doelpunt volgt een schot.' },
    diagram: D('doel', [K(50, 12), T(50, 60), B(50, 55)], [pass(1, [50, 54], [60, 7]), run(2, [56, 9], [50, 12]), pass(3, [50, 54], [50, 17])])
  }),
  E({
    id: 'wedstrijd-tegenstander-scouten', name: 'Schutters lezen',
    summary: 'De keeper leert de schotvoorbereiding van een schutter te lezen: aanloop, standbeen en lichaamshouding.',
    description: 'Verschillende schutters schieten van op 16 meter. Voor elk schot zegt de keeper luidop waar hij de bal verwacht (op basis van aanloop, standbeen en heupen). Daarna verwerkt hij het schot. Na de reeks bespreken welke signalen klopten.',
    themes: ['wedstrijd', 'reflexen'], ages: FROM16, levels: LV_ADV, keepers: { min: 2, max: 6 }, zone: 'Strafschopgebied', reps: 8, divesPerRep: 0.5, complexity: 2,
    coaching: ['Kijk naar het standbeen', 'Lees de heupen', 'Pas dan reageren'],
    mistakes: [F('Naar de bal staren', 'Kijk eerst naar het lichaam van de schutter.'), F('Gokken op gevoel', 'Zeg luidop wat je ziet, zo train je het lezen.')],
    variants: { easier: 'Schutters schieten traag en voorspelbaar.', harder: 'Schutters maken bewust schijnbewegingen.' },
    diagram: D('zestien', [K(50, 10), S(40, 60, 'K2'), T(60, 60), B(42, 56)], [pass(1, [43, 55], [56, 8])])
  }),

  // ---------------- Extra opwarming en afsluiting ----------------
  E({
    id: 'opwarming-dynamische-mobiliteit', name: 'Dynamische mobiliteit voor keepers',
    summary: 'Heupen, schouders en polsen los maken met oefeningen die keepers nodig hebben voor het duiken.',
    description: 'Op de plaats of over 10 meter: heupcirkels, wereldse stretch (lunge met draai), armzwaai, polscirkels, zijwaartse lunges en inchworm. Elke oefening een tiental herhalingen. Basis voor elke keepertraining.',
    themes: ['voetenwerk'], ages: ALL, levels: LV_ALL, intensity: 'laag', materials: ['pionnen'], keepers: { min: 1, max: 6 }, zone: '10 × 10 m', duration: 6, sets: 6, reps: 1, rest: 10, blockTypes: ['opwarming'], warmup: ['mobiliteit'], complexity: 1,
    coaching: ['Rustig en gecontroleerd', 'Volledige bewegingsuitslag', 'Ademen'],
    mistakes: [F('Te snel en verend', 'Elke beweging rustig, tot het einde van de uitslag.'), F('Polsen en vingers vergeten', 'Keepers hebben sterke polsen nodig: draai ze los.')],
    variants: { easier: 'Vier oefeningen op de plaats.', harder: 'Combineer met een korte sprint na elke oefening.' },
    diagram: D('vrij', [C(20, 30), C(80, 30), C(20, 70), C(80, 70), K(20, 50)], [run(1, [22, 50], [78, 50]), run(2, [78, 56], [24, 56])])
  }),
  E({
    id: 'opwarming-tikkertje', name: 'Keeperstikkertje',
    summary: 'Speelse opwarming: tikkertje waarbij je veilig bent door te gaan liggen en een bal te vangen.',
    description: 'In een vak van pionnen speelt de groep tikkertje. Wie dreigt getikt te worden, roept "bal!" en krijgt van de trainer een bal toegeworpen. Met de bal in de handen ben je veilig. Wie getikt wordt, is de nieuwe tikker. Ideaal voor de jongsten.',
    themes: ['vangen', 'communicatie'], ages: UPTO15, levels: LV_LOW, intensity: 'laag', materials: ['ballen', 'pionnen'], keepers: { min: 3, max: 6 }, zone: '15 × 15 m', duration: 6, sets: 3, reps: 1, rest: 30, blockTypes: ['opwarming'], warmup: ['balgewenning'], complexity: 1,
    coaching: ['Roepen om de bal', 'Vangen in beweging', 'Kijk om je heen'],
    mistakes: [F('Niet roepen', 'Wie roept, krijgt de bal.'), F('Bal laten vallen', 'Vang met beide handen tegen de borst.')],
    variants: { easier: 'Groter vak en twee ballen in het spel.', harder: 'Kleiner vak en één bal.' },
    diagram: D('vrij', [C(15, 15), C(85, 15), C(85, 85), C(15, 85), K(40, 40, 'K1'), A(55, 60, 'K2'), K(70, 30, 'K3'), T(50, 95), B(50, 90)], [run(1, [55, 58], [45, 45]), pass(2, [50, 89], [41, 44])])
  }),
  E({
    id: 'afsluiting-latje-trap', name: 'Lattrappen',
    summary: 'Speelse afsluiter: vanaf de rand van de zestien proberen de lat te raken.',
    description: 'De keepers trappen om beurt vanaf de rand van de zestien en proberen de lat te raken. Een raak is een punt. Wie eerst aan drie punten zit, wint. De verliezer raapt de ballen op. Een goed moment voor een korte nabespreking.',
    themes: ['distributie'], ages: ALL, levels: LV_ALL, intensity: 'laag', keepers: { min: 1, max: 6 }, zone: 'Strafschopgebied', duration: 6, sets: 1, reps: 10, rest: 0, blockTypes: ['afsluiting'], complexity: 1,
    coaching: ['Rustig mikken', 'Wreef onder de bal', 'Plezier'],
    mistakes: [F('Te hard willen trappen', 'Mikken is belangrijker dan kracht.'), F('Achteroverleunen te veel', 'Een beetje, net genoeg om de bal te laten stijgen.')],
    variants: { easier: 'Dichter bij het doel of het doel raken.', harder: 'Enkel met de zwakke voet.' },
    diagram: D('zestien', [K(50, 55), B(50, 52), C(40, 54), C(60, 54)], [pass(1, [50, 50], [50, 20], [50, 4])])
  }),
  E({
    id: 'afsluiting-ademhaling-evaluatie', name: 'Afsluiter: ademhaling en evaluatie',
    summary: 'Rustige afsluiting met ademhaling, lichte stretch en een korte evaluatie per keeper.',
    description: 'De keepers zitten in een kring. Drie minuten rustige ademhaling en lichte stretch. Daarna vertelt elke keeper één ding dat goed ging en één ding om te verbeteren. De trainer vult aan en noteert per keeper.',
    themes: ['communicatie', 'wedstrijd'], ages: ALL, levels: LV_ALL, intensity: 'laag', materials: ['pionnen'], keepers: { min: 1, max: 6 }, zone: 'Kring', duration: 5, sets: 1, reps: 1, rest: 0, blockTypes: ['afsluiting'], warmup: ['mobiliteit'], complexity: 1,
    coaching: ['Eén ding goed, één ding beter', 'Rustig ademen', 'Luister naar elkaar'],
    mistakes: [F('Alleen het negatieve benoemen', 'Begin altijd met wat goed ging.'), F('Te lang praten', 'Kort: één zin per punt.')],
    variants: { easier: 'De trainer stelt de vragen.', harder: 'Keepers geven elkaar feedback.' },
    diagram: D('vrij', [C(50, 20), C(75, 50), C(50, 80), C(25, 50), K(50, 35, 'K1'), K(62, 50, 'K2'), K(50, 65, 'K3'), K(38, 50, 'K4'), T(50, 50)], [run(1, [52, 35], [60, 47])])
  }),
  E({
    id: 'afsluiting-doelpuntenwedstrijd', name: 'Keepersduel: wie houdt de nul?',
    summary: 'Twee keepers verdedigen elk een doel en schieten om beurt op elkaar van op 20 meter.',
    description: 'Twee doelen (of mini-goals voor de jongsten) staan op 20 meter van elkaar. De keepers werpen, trappen of schieten om beurt op het doel van de ander. Na tien beurten wint wie het minst tegendoelpunten kreeg. Een leuke, intense afsluiter.',
    themes: ['wedstrijd', 'distributie'], ages: ALL, levels: LV_ALL, materials: ['ballen', 'minigoals'], keepers: { min: 2, max: 6 }, zone: '20 × 10 m', duration: 8, sets: 1, reps: 10, rest: 0, divesPerRep: 0.5, blockTypes: ['afsluiting'], complexity: 2,
    coaching: ['Snel terug in positie', 'Precies schieten', 'Plezier'],
    mistakes: [F('Na het schieten niet terug in doel', 'Meteen terug, de ander reageert snel.'), F('Alles hard schieten', 'Een geplaatste bal is moeilijker dan een harde.')],
    variants: { easier: 'Enkel werpen en kortere afstand.', harder: 'Enkel volleys uit de hand of grotere afstand.' },
    diagram: D('vrij', [MG(50, 6), MG(50, 94, 180), K(50, 14, 'K1'), K(50, 86, 'K2'), B(50, 82)], [pass(1, [50, 81], [46, 18]), pass(2, [52, 18], [56, 82])])
  }),

  // ---------------- Aanvulling om alle thema's te verdiepen ----------------
  E({
    id: 'vangen-lage-bal-schuiven', name: 'Lage bal naast het lichaam: schuiven en oprapen',
    summary: 'Lage ballen net naast de keeper: bijzetpas, knielvorm en de bal oprapen zonder duik.',
    description: 'De trainer speelt laag op een meter naast de keeper. In plaats van te duiken zet de keeper een bijzetpas en raapt de bal op in de knielvorm, zodat hij achter de bal zit. Leert dat een duik niet altijd nodig is.',
    themes: ['vangen', 'voetenwerk'], ages: ALL, levels: LV_ALL, intensity: 'laag', reps: 8, rest: 30, complexity: 1,
    coaching: ['Eerst de voeten', 'Achter de bal komen', 'Geen gat tussen de benen'],
    mistakes: [F('Duiken voor een makkelijke bal', 'Verplaats en kom achter de bal.'), F('Bal naast het lichaam oprapen', 'Een extra pas, zodat de bal voor je komt.')],
    variants: { easier: 'Rollende bal op een halve meter.', harder: 'Bal op 1,5 meter en sneller.' },
    diagram: D('doel', [K(50, 12), T(50, 60), B(50, 55)], [pass(1, [49, 54], [44, 15]), run(2, [50, 12], [45, 13])])
  }),
  E({
    id: 'duik-schot-door-poort', name: 'Duik na een schot door een poortje',
    summary: 'Het schot gaat door een poortje van pionnen, zodat de keeper weet waar de bal komt en volle technieken kan oefenen.',
    description: 'Twee poortjes van pionnen staan op 8 meter, naar de linker- en rechterhoek. De trainer schiet door een van de poortjes. Omdat de richting beperkt is, kan de keeper volledig focussen op een perfecte duik met afzet, vangen en landing.',
    themes: ['duiken'], ages: FROM13, levels: LV_ALL, materials: ['ballen', 'pionnen'], divesPerRep: 1, reps: 6, rest: 60,
    coaching: ['Afzet naar voren', 'Vangen in de lucht', 'Landen op de zijkant'],
    mistakes: [F('Te vroeg vertrekken', 'Wacht tot de bal vertrekt, ook al weet je de kant.'), F('Landen op de elleboog', 'Armen bij de bal, zijkant landt eerst.')],
    variants: { easier: 'Werpen door de poortjes.', harder: 'De trainer kiest pas bij het schot het poortje.' },
    diagram: D('doel', [K(50, 12), C(38, 40), C(43, 40), C(57, 40), C(62, 40), T(50, 66), B(50, 61)], [pass(1, [49, 60], [40, 40], [40, 12]), run(2, [48, 12], [41, 12])])
  }),
  E({
    id: 'reflex-spelvorm-jong', name: 'Spelvorm: vang de vallende bal',
    summary: 'Speelse reactievorm: de trainer laat een bal vallen, de keeper moet hem vangen voor de tweede stuit.',
    description: 'De trainer houdt een bal op schouderhoogte, de keeper staat op 2 meter. Zonder waarschuwing laat de trainer de bal vallen; de keeper vangt hem voor hij een tweede keer stuit. Met twee ballen kiest de trainer welke valt. Leuk voor de jongsten.',
    themes: ['reflexen'], ages: ALL, levels: LV_LOW, intensity: 'laag', keepers: { min: 1, max: 6 }, zone: '4 × 4 m', duration: 6, reps: 8, rest: 20, blockTypes: ['opwarming', 'kern'], warmup: ['balgewenning'], complexity: 1,
    coaching: ['Klaar op de voorvoeten', 'Snel eerste stap', 'Handen naar de bal'],
    mistakes: [F('Op de hielen staan', 'Gewicht vooraan, dan ben je sneller.'), F('Te ver weg staan', 'Begin dichtbij en vergroot de afstand als het lukt.')],
    variants: { easier: 'Twee stuiten toegestaan.', harder: 'Twee ballen en de trainer laat er één vallen.' },
    diagram: D('vrij', [K(50, 60), T(50, 30), B(46, 34)], [pass(1, [46, 35], [46, 48]), run(2, [50, 58], [47, 50])])
  }),
  E({
    id: 'hoge-bal-onder-druk-duo', name: 'Hoge bal met lichaamscontact',
    summary: 'De keeper vangt hoge ballen terwijl een tweede keeper met een stootkussen licht duwt.',
    description: 'De trainer werpt hoge ballen in het doelgebied. Een tweede keeper geeft met een kussen of de schouder een licht duwtje op het moment van afzet. De keeper leert zijn knie hoog te houden en de bal toch te vangen. Enkel voor oudere keepers, gecontroleerd.',
    themes: ['hogeballen'], ages: FROM16, levels: LV_ADV, intensity: 'hoog', keepers: { min: 2, max: 3 }, reps: 6, rest: 60, explosive: true, complexity: 3,
    coaching: ['Knie omhoog', 'Lichaam stevig', 'Vangen op het hoogste punt'],
    mistakes: [F('Wegdraaien van het contact', 'Blijf naar de bal gericht, het contact hoort erbij.'), F('Bal laten vallen bij contact', 'Bal meteen tegen de borst klemmen na het vangen.')],
    variants: { easier: 'Zonder contact, enkel aanwezigheid.', harder: 'Contact tijdens de sprong en ballen met effect.' },
    diagram: D('doel', [K(50, 12), A(56, 20, 'K2'), T(50, 62), B(50, 57)], [pass(1, [50, 56], [50, 35], [51, 22]), run(2, [50, 13], [51, 20])])
  }),
  E({
    id: 'opbouw-druk-zetten-keeper', name: 'Keeper onder druk: weg van de aanvaller',
    summary: 'Een aanvaller zet druk op de keeper bij elke terugspeelbal; de keeper moet hem uitspelen of veilig wegtrappen.',
    description: 'De trainer speelt terug naar de keeper, een aanvaller sprint vanop 12 meter op de keeper af. De keeper beslist: een korte pass naar een vrije medespeler, een aanname weg van de aanvaller, of een veilige lange bal. Nooit risico in de eigen zestien.',
    themes: ['opbouw'], ages: FROM13, levels: LV_ADV, intensity: 'hoog', materials: ['ballen', 'pionnen'], keepers: { min: 2, max: 4 }, zone: 'Strafschopgebied', reps: 6, rest: 60, complexity: 3,
    coaching: ['Vooraf scannen', 'Eerste aanname weg van de druk', 'Twijfel? Lang en veilig'],
    mistakes: [F('Een aanvaller proberen te omspelen in de zestien', 'Kies de veilige optie.'), F('Te laat beslissen', 'Weet wat je gaat doen voor de bal aankomt.')],
    variants: { easier: 'Aanvaller start verder weg.', harder: 'Aanvaller start op 8 meter en één contact.' },
    diagram: D('zestien', [C(65, 40), K(50, 10), T(50, 55), A(65, 35), S(15, 40, 'K2'), B(50, 51)], [pass(1, [50, 50], [50, 14]), pass(2, [47, 12], [17, 37])])
  }),
  E({
    id: 'eentegeneen-kort-op-de-lijn', name: 'Aanvaller op 6 meter: blijven staan',
    summary: 'Een aanvaller krijgt de bal in het doelgebied; de keeper blijft staan en maakt zich groot in plaats van te springen.',
    description: 'De trainer speelt de bal naar een aanvaller die op 6 meter staat. De keeper sluit in twee passen af, blijft groot staan en reageert op het schot met een stervorm of knielblok. De aanvaller heeft maar twee contacten.',
    themes: ['eentegeneen', 'reflexen'], ages: FROM13, levels: LV_ADV, intensity: 'hoog', keepers: { min: 2, max: 3 }, reps: 5, rest: 75, divesPerRep: 0.5, explosive: true, complexity: 3,
    coaching: ['Twee passen afsluiten', 'Blijf staan', 'Groot maken'],
    mistakes: [F('Duiken voor het schot', 'Blijf staan tot de bal vertrekt.'), F('Te klein blijven', 'Armen breed, borst vooruit.')],
    variants: { easier: 'Aanvaller staat op 9 meter en schiet meteen.', harder: 'Aanvaller mag de bal eerst aannemen en draaien.' },
    diagram: D('doel', [K(50, 12), A(50, 34, 'K2'), T(80, 45), B(78, 42)], [pass(1, [77, 42], [53, 35]), run(2, [50, 13], [50, 22]), pass(3, [50, 32], [43, 12])])
  }),
  E({
    id: 'distributie-uitworp-zones', name: 'Werpen naar drie zones',
    summary: 'De trainer roept een zone en de keeper werpt zo snel mogelijk naar de juiste medespeler.',
    description: 'Drie medespelers staan in drie zones (links, midden, rechts). De keeper vangt een bal van de trainer; tijdens het vangen roept de trainer een zone. De keeper werpt naar die zone met de juiste worp (rollen, zijwaarts of bovenhands).',
    themes: ['distributie', 'communicatie'], ages: FROM10, levels: LV_ALL, materials: ['ballen', 'pionnen'], keepers: { min: 2, max: 4 }, zone: 'Halve veld', reps: 8, rest: 30, complexity: 2,
    coaching: ['Juiste worp per afstand', 'Snel na de vangbal', 'Precies'],
    mistakes: [F('Altijd dezelfde worp', 'Kort = rollen, ver = bovenhands.'), F('Te lang wachten', 'Na het vangen is de bal binnen 3 seconden weg.')],
    variants: { easier: 'Zone aangekondigd voor het vangen.', harder: 'Zone pas na het vangen en een verdediger in één zone.' },
    diagram: D('halfveld', [C(8, 40), C(22, 40), C(43, 55), C(57, 55), C(78, 40), C(92, 40), K(50, 8), T(50, 30), B(50, 27), S(15, 45, '1'), S(50, 60, '2'), S(85, 45, '3')], [pass(1, [50, 26], [50, 11]), pass(2, [52, 10], [83, 43])])
  }),
  E({
    id: 'voetenwerk-reactie-sprint', name: 'Reactiesprint en terug in doel',
    summary: 'Na een korte sprint naar een pion op signaal snel terug in doel om een schot te verwerken.',
    description: 'De keeper staat in doel. Op het signaal sprint hij naar een pion op de rand van het doelgebied, tikt hem aan, loopt achterwaarts-zijwaarts terug naar zijn positie en verwerkt het schot. Combineert snelheid, oriëntatie en techniek.',
    themes: ['voetenwerk', 'reflexen'], ages: FROM13, levels: LV_ADV, intensity: 'hoog', materials: ['ballen', 'pionnen'], reps: 5, rest: 75, divesPerRep: 0.5, explosive: true,
    coaching: ['Explosieve start', 'Terug zonder je om te draaien', 'Klaar voor het schot'],
    mistakes: [F('Met de rug naar het veld teruglopen', 'Achterwaarts-zijwaarts, je ziet de bal altijd.'), F('Niet klaar bij het schot', 'Sprongstop in de goal voor het schot.')],
    variants: { easier: 'Pion dichterbij en geen schot.', harder: 'Twee pionnen en het schot volgt meteen.' },
    diagram: D('doel', [K(50, 12), C(50, 32), T(50, 66), B(50, 61)], [run(1, [50, 13], [50, 29]), run(2, [50, 29], [50, 14]), pass(3, [50, 60], [57, 14])])
  }),
  E({
    id: 'communicatie-coach-de-coach', name: 'De keeper als coach van een kleine partij',
    summary: 'In een kleine partij krijgt de keeper de opdracht om zijn ploeg actief te coachen; punten voor goede coaching.',
    description: 'Partij 3-tegen-3 plus keepers. De trainer geeft een extra punt telkens de keeper een coachend commando geeft dat de ploeg helpt (dekken, druk, opbouw). Leert de keeper actief te zijn in het spel, ook als de bal ver weg is.',
    themes: ['communicatie', 'wedstrijd'], ages: FROM10, levels: LV_ALL, materials: ['ballen', 'pionnen'], keepers: { min: 2, max: 6 }, zone: '30 × 20 m', duration: 12, sets: 3, reps: 1, rest: 60, blockTypes: ['kern', 'afsluiting'], complexity: 3,
    coaching: ['Coach ook als de bal ver is', 'Naam plus opdracht', 'Positief en kort'],
    mistakes: [F('Enkel coachen bij gevaar', 'Coach elke fase, ook bij balbezit.'), F('Negatief roepen', 'Opdrachten, geen kritiek.')],
    variants: { easier: 'Trainer helpt met voorbeelden van commando\'s.', harder: 'Enkel punten voor commando\'s vóór de actie.' },
    diagram: D('vrij', [C(4, 4), C(96, 4), C(96, 96), C(4, 96), MG(50, 5), MG(50, 95, 180), K(50, 12, 'K1'), K(50, 88, 'K2'), S(35, 35), S(65, 40), A(40, 60), A(60, 65), B(36, 38)], [drib(1, [37, 38], [45, 50]), pass(2, [46, 52], [58, 63])])
  }),
  E({
    id: 'wedstrijd-penalty-routine-jong', name: 'Strafschoppen voor de jeugd',
    summary: 'Strafschoppen als spel voor jonge keepers: op de lijn blijven, groot maken en naar de bal duiken.',
    description: 'Vanop 6 tot 8 meter trappen de andere keepers of de trainer om beurt strafschoppen. De jonge keeper leert op de lijn te staan, zich groot te maken en zijn keuze pas te maken bij de trap. Elke redding is een punt.',
    themes: ['wedstrijd', 'duiken'], ages: UPTO12, levels: LV_LOW, intensity: 'laag', keepers: { min: 1, max: 6 }, reps: 5, sets: 2, rest: 30, divesPerRep: 0.5, blockTypes: ['afsluiting'], complexity: 1,
    coaching: ['Op de lijn', 'Groot maken', 'Wachten op de trap'],
    mistakes: [F('Van de lijn lopen', 'Eén voet op de lijn tot de bal getrapt is.'), F('Te vroeg gaan liggen', 'Wacht tot de bal vertrekt.')],
    variants: { easier: 'Rollende strafschoppen.', harder: 'Afstand 9 meter en harder.' },
    diagram: D('doel', [K(50, 8), T(50, 45), B(50, 40)], [pass(1, [50, 39], [43, 7]), run(2, [49, 8], [43, 8])])
  })
];
