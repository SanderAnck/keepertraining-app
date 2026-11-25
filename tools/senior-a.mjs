// Seniorenuitbreiding deel A: vangen, duiken en voetenwerk (vooral senioren, gevorderd niveau).
import { E, F, D, K, T, S, A, B, C, H, LAD, HD, MG, RB, run, pass, drib, ALL, FROM13, FROM16, SEN, LV_ALL, LV_ADV, LV_MID, GEV } from './senior-helpers.mjs';

export default [
  // ---------------- Vangen ----------------
  E({
    id: 'sr-vangen-volley-halve-hoogte', name: 'Volleys op heuphoogte vastpakken',
    summary: 'De trainer trapt halfhoge volleys op de keeper, die ze met de korf of de W-greep vastklemt.',
    description: 'De trainer staat op 14 meter en trapt volleys uit de hand op heuphoogte, afwisselend recht op de keeper en een halve meter naast hem. Bij ballen op het lichaam vangt de keeper met de korf, bij ballen naast het lichaam stapt hij in en pakt hij met de W-greep. Na elke bal volgt een korte terugloop naar de lijn.',
    themes: ['vangen'], levels: GEV, reps: 8,
    coaching: ['Korf of W-greep kiezen op tijd', 'Ellebogen dicht bij het lichaam', 'Instappen naar de bal'],
    mistakes: [F('Bal stuit uit de korf', 'Armen vormen een kom en het bovenlichaam valt over de bal.'), F('Wachten op de bal', 'Kleine stap naar voren op het moment van de trap.')],
    variants: { easier: 'Werpen in plaats van trappen, vanop 10 meter.', harder: 'Harder en met effect, vanop 18 meter.' },
    diagram: D('doel', [K(50, 12), T(50, 48), B(50, 44)], [pass(1, [50, 43], [52, 16]), run(2, [50, 12], [51, 15])])
  }),
  E({
    id: 'sr-vangen-schot-door-poort', name: 'Afstandsschoten door de pionnenpoort',
    summary: 'Schoten van op 18 meter komen door een poort van pionnen, zodat de keeper de lijn van de bal vroeg leest.',
    description: 'Op 9 meter van het doel staat een poort van 4 meter breed. De trainer schiet vanop 18 meter door de poort, laag, halfhoog of hoog. De keeper neemt een basishouding op de bissectrice en vangt de bal vast, of brengt hem gecontroleerd naast de paal als vangen niet lukt.',
    themes: ['vangen'], materials: ['ballen', 'pionnen'], zone: 'Strafschopgebied', intensity: 'gemiddeld',
    coaching: ['Basishouding vóór het schot', 'Bal vroeg lezen in de poort', 'Vangen of veilig wegwerken'],
    mistakes: [F('Hoofd draait weg', 'Ogen op de bal tot hij in de handen zit.'), F('Rebound recht voor het doel', 'Bal die je niet kunt vangen naar de zijkant duwen.')],
    variants: { easier: 'Poort op 6 meter en zachter schieten.', harder: 'Schoten na een balaanname van de trainer, niet voorspelbaar.' },
    diagram: D('zestien', [K(50, 9), C(45, 22), C(55, 22), T(50, 40), B(50, 37)], [pass(1, [50, 36], [50, 22], [51, 12])])
  }),
  E({
    id: 'sr-vangen-tweede-bal', name: 'Vangen en meteen de tweede bal',
    summary: 'Na een gevangen schot volgt meteen een tweede bal uit een andere hoek. De keeper legt de eerste bal weg en herpositioneert snel.',
    description: 'Twee trainers staan op 12 meter, een links en een rechts van de penaltystip. Trainer 1 schiet, de keeper vangt en legt de bal achter zich in het doel. Zodra hij weer in basishouding staat, schiet trainer 2 vanuit de andere hoek. Eén reeks is vier ballen.',
    themes: ['vangen', 'voetenwerk'], trainers: 2, intensity: 'hoog', explosive: false, reps: 4, rest: 75,
    coaching: ['Bal veilig wegleggen', 'Snel terug in basishouding', 'Positie op de nieuwe bissectrice'],
    mistakes: [F('Te laat klaar voor de tweede bal', 'Leg de bal weg terwijl je al naar de nieuwe hoek stapt.'), F('Rechtop staan bij het schot', 'Knieën licht gebogen, gewicht op de voorvoeten.')],
    variants: { easier: 'Met één trainer die van plaats wisselt.', harder: 'De tweede bal komt al wanneer de keeper nog in beweging is.' },
    diagram: D('zestien', [K(50, 9), T(36, 28, 'T1'), T(64, 28, 'T2'), B(38, 26), B(62, 26)], [pass(1, [38, 25], [49, 12]), run(2, [50, 9], [53, 10]), pass(3, [62, 25], [54, 12])])
  }),
  E({
    id: 'sr-vangen-nat-gras', name: 'Gladde ballen klemvast',
    summary: 'Natte ballen worden laag en halfhoog op de keeper geschoten om een vaste greep en goede lichaamsachtergrond te trainen.',
    description: 'Maak de ballen vooraf nat of speel op nat kunstgras. De trainer schiet vanop 12 meter laag en halfhoog op het lichaam. De keeper speelt met lichaam achter de bal, vangt met de handen en klemt meteen tegen de borst. Elke los gelaten bal telt als een punt voor de trainer.',
    themes: ['vangen'], levels: GEV, reps: 8, rest: 45,
    coaching: ['Lichaam achter de bal', 'Meteen klemmen tegen de borst', 'Vingers gespreid achter de bal'],
    mistakes: [F('Enkel met de handen vangen', 'Breng altijd een tweede barrière achter de handen.'), F('Bal laten stuiten voor het lichaam', 'Zak op tijd door de knieën bij lage ballen.')],
    variants: { easier: 'Droge ballen en werpen in plaats van schieten.', harder: 'Ballen laten stuiten voor de keeper, zoals bij een glad veld.' },
    diagram: D('doel', [K(50, 12), T(50, 52), B(50, 48)], [pass(1, [50, 47], [50, 16])])
  }),
  E({
    id: 'sr-vangen-schot-na-dribbel', name: 'Schot na een dribbel in het zestien',
    summary: 'Een aanvaller dribbelt het strafschopgebied in en schiet uit de loop. De keeper stelt zich bij en vangt of keert.',
    description: 'De speler start op 25 meter, dribbelt naar een van drie pionnen aan de rand van het strafschopgebied en schiet vanaf daar. De keeper volgt de bal met kleine pasjes, staat stil op het moment van het schot en vangt de bal. Na elke actie wisselt de speler van pion.',
    themes: ['vangen', 'voetenwerk'], materials: ['ballen', 'pionnen'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, intensity: 'gemiddeld',
    coaching: ['Bijstellen met de bal mee', 'Stilstaan bij het schot', 'Vangen in de schotlijn'],
    mistakes: [F('Bewegen tijdens het schot', 'Plant de voeten zodra de schutter zijn standbeen zet.'), F('Te diep in het doel', 'Sta een tot twee meter voor de lijn.')],
    variants: { easier: 'De speler schiet altijd vanaf dezelfde pion.', harder: 'De speler mag ook nog een schijnbeweging maken voor het schot.' },
    diagram: D('zestien', [K(50, 9), S(50, 60, 'S'), C(30, 37), C(50, 37), C(70, 37), B(50, 57)], [drib(1, [50, 58], [68, 40]), pass(2, [67, 37], [52, 12]), run(3, [50, 9], [54, 10])])
  }),
  E({
    id: 'sr-vangen-boven-hoofd-sprong', name: 'Hoge ballen boven het hoofd uit de sprong',
    summary: 'Ballen net boven de keeper worden uit een korte sprong met de W-greep op het hoogste punt gevangen.',
    description: 'De trainer gooit of chipt de bal vanop 8 meter net boven het hoofd van de keeper. De keeper zet af op één been, brengt de knie omhoog en vangt de bal met de W-greep voor het hoofd. Hij landt in balans en trekt de bal naar de borst.',
    themes: ['vangen', 'hogeballen'], levels: LV_ALL, ages: FROM13, reps: 8, rest: 45,
    coaching: ['Afzet op één been', 'Knie omhoog ter bescherming', 'Vangen voor het hoofd'],
    mistakes: [F('Vangen achter het hoofd', 'Ga naar de bal toe, zodat je hem voor je ogen pakt.'), F('Landen op beide gestrekte benen', 'Land zacht met gebogen knieën.')],
    variants: { easier: 'Zonder sprong, enkel op de tenen.', harder: 'Met een licht duwcontact door een medespeler.' },
    diagram: D('doel', [K(50, 14), T(50, 42), B(50, 39)], [pass(1, [50, 38], [50, 24], [50, 16]), run(2, [50, 14], [50, 17])])
  }),
  E({
    id: 'sr-vangen-wissel-afstanden', name: 'Schotreeks van drie afstanden',
    summary: 'Drie schoten na elkaar van 20, 14 en 8 meter dwingen de keeper om zijn positie en handtechniek aan te passen.',
    description: 'De trainer schiet eerst van 20 meter, loopt daarna naar 14 meter en schiet opnieuw en eindigt op 8 meter. De keeper kiest bij elk schot een andere diepte: dieper bij een ver schot, verder uit bij een kort schot. Elk schot moet vast gevangen worden.',
    themes: ['vangen', 'voetenwerk'], materials: ['ballen', 'pionnen'], zone: 'Strafschopgebied', reps: 3, sets: 4, rest: 60,
    coaching: ['Diepte aanpassen aan de afstand', 'Basishouding bij elk schot', 'Vangen, niet stompen'],
    mistakes: [F('Op dezelfde plaats blijven staan', 'Stap naar voren als de schutter dichterbij komt.'), F('Te vroeg in de grond', 'Wacht tot de bal vertrokken is.')],
    variants: { easier: 'Twee afstanden en een vast ritme.', harder: 'De trainer kiest de volgorde van de afstanden zelf.' },
    diagram: D('zestien', [K(50, 9), C(50, 45, '20'), C(50, 33, '14'), C(50, 21, '8'), T(46, 45), B(48, 43)], [pass(1, [48, 43], [50, 12]), run(2, [46, 44], [46, 32]), pass(3, [48, 31], [50, 13])])
  }),
  E({
    id: 'sr-vangen-rebounder-variatie', name: 'Rebounder met onvoorspelbare terugkaats',
    summary: 'De bal kaatst van de rebounder in wisselende hoogtes naar de keeper, die vangt en meteen opnieuw klaarstaat.',
    description: 'De rebounder staat schuin op 5 meter van de keeper. De trainer gooit de bal vanaf de zijkant op de rebounder, zodat de terugkaats onvoorspelbaar is. De keeper vangt elke bal en gooit hem terug naar de trainer. Reeksen van tien ballen.',
    themes: ['vangen', 'reflexen'], materials: ['ballen', 'rebounder'], zone: '10 × 10 m', levels: LV_ALL, ages: FROM13, reps: 10, rest: 45,
    coaching: ['Handen voor het lichaam', 'Laat ballen naar je toe komen', 'Klaar voor de volgende bal'],
    mistakes: [F('Handen te laag', 'Handen op borsthoogte, handpalmen naar de rebounder.'), F('Achteruit stappen', 'Gewicht naar voren, ook bij snelle ballen.')],
    variants: { easier: 'Rebounder recht en zachte worpen.', harder: 'Tennisballen of de keeper draait pas om op het signaal.' },
    diagram: D('vrij', [K(50, 50), RB(50, 30), T(28, 38), B(30, 36)], [pass(1, [30, 36], [48, 31]), pass(2, [50, 32], [50, 46])])
  }),
  E({
    id: 'sr-vangen-schot-op-standbeen', name: 'Ballen op het standbeen',
    summary: 'De trainer schiet naar de voeten en het standbeen van de keeper, die met een korte zakbeweging laag vangt.',
    description: 'Vanop 10 meter schiet de trainer laag naar de voeten of net naast het standbeen. De keeper zakt met de knie naar de grond aan de kant van de bal (scoop) of laat zich kort opzij vallen. De bal wordt altijd achter de handen en tegen het lichaam vastgehouden.',
    themes: ['vangen', 'duiken'], levels: GEV, divesPerRep: 0.3, reps: 6,
    coaching: ['Knie naar de grond aan de balkant', 'Geen gat tussen de benen', 'Handen voor de voeten'],
    mistakes: [F('Bal tussen de benen door', 'Knie en voet sluiten de opening.'), F('Te laat zakken', 'Begin de zakbeweging zodra je ziet dat de bal laag is.')],
    variants: { easier: 'Rollende ballen vanop 8 meter.', harder: 'Harde schoten met een stuit vlak voor de keeper.' },
    diagram: D('doel', [K(50, 12), T(50, 44), B(50, 40)], [pass(1, [50, 39], [47, 14])])
  }),
  E({
    id: 'sr-vangen-balgewenning-duo-tempo', name: 'Balgewenning in duo met tempo',
    summary: 'Twee keepers spelen elkaar de bal toe met korte trappen en worpen en verhogen geleidelijk het tempo.',
    description: 'Twee keepers staan op 8 meter van elkaar. Ze spelen de bal met de wreef op borsthoogte, daarna met een korte volley op heuphoogte en tot slot laag over de grond. Elke minuut gaat het tempo omhoog. Tussen de reeksen lopen ze een kort stukje rond.',
    themes: ['vangen'], levels: LV_ALL, ages: FROM13, intensity: 'laag', keepers: { min: 2, max: 4 }, blockTypes: ['opwarming'], warmup: ['balgewenning'], complexity: 1, duration: 8, reps: 10, rest: 30,
    coaching: ['Rustig beginnen, tempo opbouwen', 'Elke bal vast in de handen', 'Voeten blijven bewegen'],
    mistakes: [F('Meteen te hard spelen', 'De eerste minuut is om handen en ogen wakker te maken.'), F('Stilstaan tussen de ballen', 'Blijf licht op de voorvoeten huppelen.')],
    variants: { easier: 'Enkel worpen op borsthoogte.', harder: 'Met twee ballen tegelijk in het spel.' },
    diagram: D('vrij', [K(50, 22, 'K1'), K(50, 52, 'K2'), B(50, 26)], [pass(1, [50, 27], [50, 48]), pass(2, [50, 48], [50, 26])])
  }),
  E({
    id: 'sr-vangen-schot-na-voorzet', name: 'Voorzet gevolgd door een afstandsschot',
    summary: 'Na een gevangen voorzet volgt meteen een schot van buiten het strafschopgebied.',
    description: 'Trainer 1 geeft een hoge voorzet vanaf rechts, de keeper vangt die op het hoogste punt. Hij legt de bal weg en zet zich meteen op de goede positie voor het schot van trainer 2, die op 20 meter staat. Na vijf reeksen wisselt de voorzetkant.',
    themes: ['vangen', 'hogeballen'], trainers: 2, zone: 'Strafschopgebied', intensity: 'hoog', reps: 5, rest: 75,
    coaching: ['Vangen op het hoogste punt', 'Snel terug naar de schotpositie', 'Stilstaan bij het schot'],
    mistakes: [F('Te lang blijven liggen na de voorzet', 'Landen, bal wegleggen en meteen opkijken.'), F('Fout gepositioneerd voor het schot', 'Zoek de lijn tussen bal en midden van het doel.')],
    variants: { easier: 'De trainer wacht met schieten tot de keeper klaarstaat.', harder: 'Een aanvaller gaat de voorzet mee aanvallen.' },
    diagram: D('zestien', [K(50, 9), T(90, 30, 'T1'), T(50, 48, 'T2'), B(88, 28), B(50, 45)], [pass(1, [87, 28], [70, 10], [52, 12]), run(2, [50, 9], [52, 11]), pass(3, [50, 44], [49, 12])])
  }),
  E({
    id: 'sr-vangen-wedstrijd-tien', name: 'Tien ballen zonder fout',
    summary: 'Afsluitende uitdaging: de keeper moet tien gevarieerde schoten op rij vastpakken.',
    description: 'De trainer schiet tien ballen van verschillende afstand en hoogte. Elke bal die niet vast gevangen wordt, zet de teller terug op nul. Twee keepers wisselen om de beurt. Wie haalt als eerste tien op rij?',
    themes: ['vangen', 'wedstrijd'], levels: LV_ALL, ages: FROM13, keepers: { min: 1, max: 3 }, blockTypes: ['afsluiting', 'kern'], reps: 10, sets: 2, rest: 60, duration: 10,
    coaching: ['Concentratie bij elke bal', 'Zelfde routine elke keer', 'Klemmen, dan pas opstaan'],
    mistakes: [F('Gehaast na een fout', 'Ademhaling en routine terug, dan pas de volgende bal.'), F('Ballen te snel loslaten', 'Tel tot één voor je de bal teruggeeft.')],
    variants: { easier: 'Zes op rij in plaats van tien.', harder: 'Ook duikballen tellen mee.' },
    diagram: D('zestien', [K(50, 9), T(50, 36), B(50, 33)], [pass(1, [50, 32], [52, 12])])
  }),
  E({
    id: 'sr-vangen-hoek-bal-na-draai', name: 'Omdraaien en schot van achter de zestien',
    summary: 'De keeper staat met de rug naar de schutter, draait op het signaal en vangt het schot dat al vertrokken is.',
    description: 'De keeper staat op zijn doellijn met de rug naar het veld. De trainer roept en schiet vrijwel tegelijk vanop 16 meter. De keeper draait, vindt zijn basishouding en vangt. Bij oudere of sterkere keepers kan de trainer het signaal met de bal zelf geven.',
    themes: ['vangen', 'reflexen'], zone: 'Strafschopgebied', intensity: 'hoog', reps: 6, rest: 60,
    coaching: ['Snel draaien op de voorvoeten', 'Eerst ogen, dan handen', 'Houding vóór de bal'],
    mistakes: [F('Draaien op de hielen', 'Draai op de bal van de voet.'), F('Handen te laag na de draai', 'Breng de handen meteen voor het lichaam.')],
    variants: { easier: 'Het schot volgt een seconde na het signaal.', harder: 'Twee trainers en de keeper weet niet wie schiet.' },
    diagram: D('zestien', [K(50, 7), T(50, 34), B(50, 31)], [run(1, [50, 7], [50, 9]), pass(2, [50, 30], [50, 12])])
  }),

  // ---------------- Duiken ----------------
  E({
    id: 'sr-duik-laag-hoek', name: 'Lage duik naar de verre hoek',
    summary: 'Lage schoten naar de hoek worden met een zijwaartse duik en de bal tegen de grond vastgepakt.',
    description: 'De keeper start in basishouding op 1 meter voor de lijn. De trainer schiet vanop 12 meter laag naar de linker- of rechterhoek. De keeper zet af met het been aan de balkant, laat zich langs de zijkant vallen en klemt de bal met één hand erachter en één hand erop tegen de grond.',
    themes: ['duiken'], levels: GEV, intensity: 'hoog', divesPerRep: 1, explosive: true, reps: 6, rest: 75,
    coaching: ['Afzet met het been aan de balkant', 'Landen op de zijkant', 'Bal tegen de grond klemmen'],
    mistakes: [F('Landen op de buik', 'Rol over heup en schouder op de zijkant.'), F('Achteruit duiken', 'Duik schuin naar voren, naar de bal toe.')],
    variants: { easier: 'Knielend starten en rollende ballen.', harder: 'Schot na een balaanname van de trainer, timing onzeker.' },
    diagram: D('doel', [K(50, 12), T(50, 42), B(50, 38)], [pass(1, [50, 37], [40, 9]), run(2, [50, 12], [41, 11])])
  }),
  E({
    id: 'sr-duik-halfhoog-twee-handen', name: 'Halfhoge duik met twee handen',
    summary: 'Halfhoge schoten worden duikend met twee handen vastgepakt en tijdens de landing tegen het lichaam gebracht.',
    description: 'De trainer schiet vanop 11 meter halfhoog naast de keeper, op 1,5 tot 2 meter. De keeper duikt met een explosieve afzet, pakt de bal met beide handen vóór het lichaam en brengt hem bij de landing naar de borst. De volgende bal komt naar de andere kant.',
    themes: ['duiken', 'vangen'], intensity: 'hoog', divesPerRep: 1, explosive: true, reps: 6, rest: 75,
    coaching: ['Explosieve afzet', 'Handen vóór het lichaam', 'Bal meenemen in de landing'],
    mistakes: [F('Eén hand aan de bal', 'Breng de tweede hand mee, ook als hij later komt.'), F('Bal los bij de landing', 'Laat de grond niet als derde hand werken: klem eerst.')],
    variants: { easier: 'Op 1 meter naast de keeper en geworpen.', harder: 'Na een zijwaartse verplaatsing langs twee pionnen.' },
    diagram: D('doel', [K(50, 12), T(50, 46), B(50, 42)], [pass(1, [50, 41], [60, 12]), run(2, [50, 12], [59, 12])])
  }),
  E({
    id: 'sr-duik-bovenhoek-wegtikken', name: 'Bovenhoek wegtikken',
    summary: 'Ballen in de bovenhoek worden met de bovenste hand over of naast de lat getikt.',
    description: 'De trainer chipt of schiet vanop 14 meter naar de bovenhoek. De keeper zet een kruispas of bijzetpas, duikt omhoog en tikt de bal met de bovenste hand (de hand die het verst reikt) over of naast de lat. De landing gebeurt gecontroleerd op de zijkant.',
    themes: ['duiken', 'hogeballen'], intensity: 'hoog', divesPerRep: 1, explosive: true, reps: 5, rest: 90,
    coaching: ['Eerst een kruispas naar de hoek', 'Tikken met de bovenste hand', 'Bal over of naast het doel'],
    mistakes: [F('Tikken met de verkeerde hand', 'De bovenste hand reikt verder en draait de bal weg.'), F('Bal terug in het veld', 'Duw de bal mee in de richting van de paal.')],
    variants: { easier: 'Geworpen ballen en een mat aan de paal.', harder: 'Na een eerste lage bal naar de andere hoek.' },
    diagram: D('doel', [K(50, 12), T(50, 44), B(50, 40)], [run(1, [50, 12], [57, 10]), pass(2, [50, 39], [61, 5])])
  }),
  E({
    id: 'sr-duik-dubbele-redding', name: 'Dubbele redding met rebound',
    summary: 'Na een eerste duik komt de keeper snel recht om de rebound van een tweede speler te stoppen.',
    description: 'Trainer 1 schiet laag naar de hoek, de keeper duikt en duwt de bal opzij. Een medespeler pikt de rebound op en schiet meteen opnieuw. De keeper staat zo snel mogelijk op, neemt een nieuwe positie en redt het tweede schot.',
    themes: ['duiken', 'reflexen'], trainers: 1, keepers: { min: 1, max: 2 }, intensity: 'hoog', divesPerRep: 2, explosive: true, reps: 4, rest: 90,
    coaching: ['Bal opzij, niet terug', 'Recht via de knie', 'Nieuwe positie voor het schot'],
    mistakes: [F('Blijven liggen na de eerste redding', 'Land, duw je op met de bovenste arm en kom recht.'), F('Achteruit lopen na het rechtkomen', 'Stap naar de bal toe om de hoek te verkleinen.')],
    variants: { easier: 'De medespeler wacht een seconde met het tweede schot.', harder: 'Twee medespelers en de keeper weet niet wie de rebound neemt.' },
    diagram: D('doel', [K(50, 12), T(50, 46), S(66, 30, 'S'), B(50, 42)], [pass(1, [50, 41], [41, 10]), run(2, [42, 11], [47, 14]), pass(3, [66, 29], [54, 12])])
  }),
  E({
    id: 'sr-duik-crossstep-paal', name: 'Kruispas en duik naar de verre paal',
    summary: 'Een kruispas brengt de keeper sneller naar de verre paal voor een duik op een ver geplaatste bal.',
    description: 'De keeper staat aan de korte paal. De trainer speelt een bal schuin naar de verre paal. De keeper zet een kruispas, gevolgd door een afzet en een duik richting verre paal. De bal wordt gevangen of naast de paal geduwd.',
    themes: ['duiken', 'voetenwerk'], materials: ['ballen', 'pionnen'], intensity: 'hoog', divesPerRep: 1, explosive: true, reps: 5, rest: 90,
    coaching: ['Kruispas laag en snel', 'Afzet naar voren', 'Eerst de bal, dan de paal'],
    mistakes: [F('Kruispas te hoog', 'Blijf laag, de heup draait mee.'), F('Te veel passen', 'Eén kruispas, dan meteen afzetten.')],
    variants: { easier: 'Bijzetpas in plaats van kruispas en kortere afstand.', harder: 'De trainer kiest pas op het laatste moment de hoek.' },
    diagram: D('doel', [K(40, 11), C(40, 15), T(55, 44), B(55, 40)], [run(1, [40, 11], [50, 11]), pass(2, [55, 39], [61, 9])])
  }),
  E({
    id: 'sr-duik-uit-zit-recht', name: 'Opstaan en duiken',
    summary: 'De keeper zit op de grond, staat op het signaal op en duikt naar de bal die de trainer naar een hoek speelt.',
    description: 'De keeper zit met gekruiste benen in het midden van het doel. Op het fluitsignaal staat hij zo snel mogelijk op. Zodra hij in basishouding staat, schiet de trainer laag of halfhoog naast hem. De rust tussen de herhalingen is volledig.',
    themes: ['duiken', 'reflexen'], intensity: 'hoog', divesPerRep: 1, explosive: true, reps: 5, rest: 90,
    coaching: ['Explosief opstaan', 'Eerst basishouding, dan duik', 'Volledige rust tussen reeksen'],
    mistakes: [F('Duiken voor je staat', 'Eerst de voeten onder je lichaam, dan pas afzetten.'), F('Niet herstellen', 'Respecteer de rust, kwaliteit gaat voor.')],
    variants: { easier: 'Starten vanuit kniezit.', harder: 'Starten in buiklig.' },
    diagram: D('doel', [K(50, 13), T(50, 44), B(50, 40)], [run(1, [50, 13], [50, 12]), pass(2, [50, 39], [40, 12])])
  }),
  E({
    id: 'sr-duik-voor-de-voeten', name: 'Duiken voor de voeten van een aanvaller',
    summary: 'Een aanvaller neemt de bal te ver mee en de keeper duikt laag voor zijn voeten om de bal te pakken.',
    description: 'De aanvaller start op 18 meter en dribbelt naar het doel. Op een bepaald moment speelt hij de bal iets te ver voor zich uit. De keeper komt uit en pakt de bal met een lage zijwaartse duik voor de voeten van de aanvaller, met de handen en het hoofd achter de bal.',
    themes: ['duiken', 'eentegeneen'], zone: 'Strafschopgebied', intensity: 'hoog', divesPerRep: 1, explosive: true, reps: 5, rest: 90, keepers: { min: 1, max: 2 },
    coaching: ['Uitkomen als de bal ver ligt', 'Lage zijwaartse duik', 'Handen voor het hoofd'],
    mistakes: [F('Duiken met het hoofd naar voren', 'Lichaam dwars, handen voor het hoofd.'), F('Te laat uitkomen', 'Start zodra de aanvaller de bal te ver speelt.')],
    variants: { easier: 'De trainer rolt de bal als aanvaller en loopt niet door.', harder: 'De aanvaller mag kiezen tussen schieten of de bal te ver spelen.' },
    diagram: D('zestien', [K(50, 9), A(50, 40, 'A'), B(50, 30)], [drib(1, [50, 39], [50, 30]), run(2, [50, 9], [50, 24])])
  }),
  E({
    id: 'sr-duik-over-horde-hoog', name: 'Duik over een horde naar de hoek',
    summary: 'Een horde naast de keeper dwingt hem om explosief en hoog af te zetten richting de hoek.',
    description: 'Een lage horde staat 1 meter naast de keeper. De trainer gooit of schiet halfhoog over de horde naar de hoek. De keeper duikt over de horde, vangt de bal of tikt hem weg en landt gecontroleerd. Na drie herhalingen wisselt de kant.',
    themes: ['duiken'], materials: ['ballen', 'hordes'], levels: GEV, intensity: 'hoog', divesPerRep: 1, explosive: true, reps: 6, rest: 90,
    coaching: ['Afzet met het binnenbeen', 'Lichaam over de horde', 'Bal voor de ogen vangen'],
    mistakes: [F('Over de horde springen in plaats van duiken', 'Zet af naar de bal, niet omhoog.'), F('Op de horde landen', 'Duik verder dan de horde, naar de bal toe.')],
    variants: { easier: 'Een lage pion in plaats van een horde.', harder: 'Hogere horde en een schot in plaats van een worp.' },
    diagram: D('doel', [K(50, 12), HD(56, 12, 90), T(50, 42), B(50, 38)], [pass(1, [50, 37], [61, 9]), run(2, [50, 12], [60, 11])])
  }),
  E({
    id: 'sr-duik-reeks-drie-hoeken', name: 'Duikreeks: laag, halfhoog, hoog',
    summary: 'Drie duiken na elkaar op verschillende hoogte, telkens met herpositionering tussen de duiken.',
    description: 'De trainer schiet drie ballen achter elkaar: eerst laag naar links, dan halfhoog naar rechts, dan hoog naar links. Tussen elke bal komt de keeper recht en neemt hij een nieuwe basishouding in het midden. Na de reeks volgt een volledige rust.',
    themes: ['duiken'], intensity: 'hoog', divesPerRep: 3, explosive: true, reps: 3, sets: 3, rest: 120, duration: 12,
    coaching: ['Snel recht en terug naar het midden', 'Elke duik even scherp', 'Rust volledig nemen'],
    mistakes: [F('Laatste duik slordig', 'Beter minder herhalingen dan een slechte techniek.'), F('Basishouding overslaan', 'Pas duiken als je weer stilstaat.')],
    variants: { easier: 'Twee ballen in plaats van drie.', harder: 'De trainer kiest de volgorde zelf.' },
    diagram: D('doel', [K(50, 12), T(50, 44), B(48, 40), B(52, 40)], [pass(1, [48, 39], [40, 10]), run(2, [42, 11], [50, 12]), pass(3, [52, 39], [60, 9])])
  }),
  E({
    id: 'sr-duik-valvorm-duo-kniel', name: 'Valvormen vanuit kniestand in duo',
    summary: 'Lichte opwarming: de keeper laat zich vanuit kniestand opzij vallen naar een bal die de partner aangooit.',
    description: 'Twee keepers zitten op 4 meter van elkaar op de knieën. De ene gooit de bal zacht naast de ander, die zich opzij laat vallen, vangt en de bal teruggooit. Na vijf ballen per kant wisselen de rollen. Daarna volgt dezelfde oefening vanuit hurkzit.',
    themes: ['duiken'], levels: LV_ALL, ages: FROM13, intensity: 'laag', keepers: { min: 2, max: 4 }, divesPerRep: 0.5, blockTypes: ['opwarming'], warmup: ['valvorm'], complexity: 1, duration: 8, reps: 10, rest: 30,
    coaching: ['Vallen op de zijkant', 'Bal voor het lichaam vangen', 'Rustig opbouwen'],
    mistakes: [F('Op de elleboog landen', 'Arm langs de bal, schouder raakt de grond als eerste.'), F('Te snel te ver', 'Begin dicht bij het lichaam.')],
    variants: { easier: 'Enkel rollende ballen.', harder: 'Vanuit staande houding met kleine sprong.' },
    diagram: D('vrij', [K(40, 36, 'K1'), K(60, 36, 'K2'), B(58, 36)], [pass(1, [58, 35], [43, 30]), run(2, [40, 36], [41, 31])])
  }),
  E({
    id: 'sr-duik-valvorm-zijwaarts-stap', name: 'Zijwaartse valvorm na een stap',
    summary: 'Opwarming waarin de keeper na een bijzetpas laag opzij valt en de bal tegen de grond klemt.',
    description: 'De keeper staat tussen twee pionnen op 3 meter van elkaar. De trainer rolt de bal naast een pion. De keeper zet één bijzetpas en laat zich laag vallen, met de bal tegen de grond geklemd. Na het opstaan volgt de andere kant.',
    themes: ['duiken', 'voetenwerk'], levels: LV_ALL, ages: FROM13, intensity: 'laag', materials: ['ballen', 'pionnen'], divesPerRep: 0.5, blockTypes: ['opwarming'], warmup: ['valvorm'], complexity: 1, duration: 8, reps: 8, rest: 30,
    coaching: ['Eén bijzetpas', 'Laag vallen, niet springen', 'Bal tegen de grond'],
    mistakes: [F('Benen kruisen', 'Bijzetpas met de voeten parallel.'), F('Bal los bij de landing', 'Hand achter, hand erop.')],
    variants: { easier: 'Zonder pas, vanuit hurkzit.', harder: 'Twee passen en een halfhoge bal.' },
    diagram: D('doel', [K(50, 12), C(44, 13), C(56, 13), T(50, 40), B(50, 36)], [pass(1, [50, 35], [42, 14]), run(2, [50, 12], [44, 13])])
  }),
  E({
    id: 'sr-duik-schot-door-benen', name: 'Schot langs een verdediger',
    summary: 'Een verdediger staat in de schotlijn, waardoor de keeper de bal pas laat ziet en snel moet duiken.',
    description: 'Een medespeler staat als verdediger op 6 meter. De trainer schiet vanop 15 meter langs of door de benen van de verdediger naar de hoek. De keeper zoekt zicht op de bal, blijft in basishouding en duikt pas als hij de bal ziet.',
    themes: ['duiken', 'reflexen'], zone: 'Strafschopgebied', intensity: 'hoog', divesPerRep: 1, explosive: true, reps: 6, rest: 75,
    coaching: ['Zicht zoeken langs de verdediger', 'Laat duiken, maar wel explosief', 'Bal opzij verwerken'],
    mistakes: [F('Te vroeg gokken', 'Wacht tot je de bal echt ziet.'), F('Recht achter de verdediger staan', 'Een halve stap opzij geeft meer zicht.')],
    variants: { easier: 'Verdediger staat stil en breed.', harder: 'De verdediger beweegt en kan de bal afketsen.' },
    diagram: D('zestien', [K(50, 9), S(50, 20, 'V'), T(52, 38), B(52, 35)], [pass(1, [52, 34], [56, 22], [58, 10])])
  }),
  E({
    id: 'sr-duik-penalty-reeks', name: 'Strafschoppenreeks met analyse',
    summary: 'Een reeks strafschoppen waarbij de keeper vooraf een plan kiest en achteraf zijn keuzes evalueert.',
    description: 'Vijf schutters nemen elk een strafschop. De keeper bepaalt vooraf zijn plan per schutter: wachten, aanloop lezen of een kant kiezen. Na elke strafschop noteert hij kort wat werkte. Na de reeks wisselen de keepers. Leg extra nadruk op de regel dat één voet op de lijn moet blijven.',
    themes: ['duiken', 'wedstrijd'], zone: 'Strafschopgebied', intensity: 'gemiddeld', divesPerRep: 1, blockTypes: ['afsluiting', 'kern'], reps: 5, sets: 2, rest: 30, duration: 10,
    coaching: ['Eén voet op de lijn', 'Plan per schutter', 'Explosief en laat'],
    mistakes: [F('Te vroeg vertrekken', 'Wacht tot het standbeen staat.'), F('Geen plan', 'Kies voor elke strafschop een strategie.')],
    variants: { easier: 'De trainer neemt alle strafschoppen.', harder: 'Met publiek en een echte reeks tegen een ander team.' },
    diagram: D('zestien', [K(50, 4), S(50, 26, 'S'), B(50, 24)], [pass(1, [50, 23], [56, 5])])
  }),

  // ---------------- Voetenwerk ----------------
  E({
    id: 'sr-voet-boog-positionering', name: 'Positioneren op de boog',
    summary: 'De trainer verplaatst de bal langs de rand van het strafschopgebied en de keeper volgt op een denkbeeldige boog.',
    description: 'Vijf pionnen staan in een halve cirkel op 18 meter. De trainer dribbelt van pion naar pion en schiet af en toe. De keeper verplaatst zich met kleine bijzetpasjes op een boog voor zijn doel, steeds op de lijn tussen bal en midden van het doel.',
    themes: ['voetenwerk'], materials: ['ballen', 'pionnen'], zone: 'Strafschopgebied', levels: LV_ALL, ages: FROM13, reps: 6,
    coaching: ['Op de lijn bal–midden doel', 'Kleine bijzetpasjes', 'Stilstaan als de schutter schiet'],
    mistakes: [F('Recht naar achteren lopen', 'Beweeg over de boog, niet langs de doellijn.'), F('Grote passen', 'Kleine passen houden je in balans.')],
    variants: { easier: 'Zonder schot, enkel positioneren.', harder: 'De trainer schiet onaangekondigd vanaf elke pion.' },
    diagram: D('zestien', [K(50, 9), C(22, 32), C(34, 38), C(50, 40), C(66, 38), C(78, 32), T(34, 41), B(36, 39)], [drib(1, [36, 39], [64, 40]), run(2, [46, 10], [54, 10])])
  }),
  E({
    id: 'sr-voet-ladder-schot', name: 'Snelle voeten door de ladder en schot',
    summary: 'De keeper loopt een kort ladderpatroon en krijgt meteen daarna een schot op doel.',
    description: 'Een ladder ligt 3 meter voor het doel, evenwijdig met de doellijn. De keeper loopt zijwaarts met twee voeten per vak door de ladder. Aan het einde zet hij zich in basishouding en krijgt hij een schot vanop 12 meter. Varieer de laddervormen per reeks.',
    themes: ['voetenwerk', 'vangen'], materials: ['ballen', 'ladders'], levels: LV_ALL, ages: FROM13, reps: 6,
    coaching: ['Op de voorvoeten', 'Armen mee in het ritme', 'Basishouding vóór het schot'],
    mistakes: [F('Naar de voeten kijken bij het schot', 'Hoofd omhoog bij het laatste vak.'), F('Ladder raken', 'Liever iets trager en correct.')],
    variants: { easier: 'Eén voet per vak en een zachte worp.', harder: 'Inslag-uitslag patroon en een schot naar de hoek.' },
    diagram: D('doel', [K(35, 20), LAD(50, 20), T(50, 46), B(50, 42)], [run(1, [35, 20], [62, 20]), run(2, [62, 20], [56, 14]), pass(3, [50, 41], [56, 16])])
  }),
  E({
    id: 'sr-voet-kruispas-hordes', name: 'Hordes en kruispas naar de paal',
    summary: 'Na twee lage hordes volgt een kruispas en een opvang van een bal aan de paal.',
    description: 'Twee lage hordes staan voor het doel. De keeper springt er met twee voeten over, draait en zet een kruispas naar de korte paal, waar de trainer een halfhoge bal aanspeelt. Daarna loopt hij terug en start opnieuw vanaf de andere kant.',
    themes: ['voetenwerk'], materials: ['ballen', 'hordes'], intensity: 'hoog', explosive: true, reps: 6, rest: 75,
    coaching: ['Korte grondcontacten', 'Kruispas laag houden', 'Stilstaan voor het vangen'],
    mistakes: [F('Landen op de hielen', 'Land op de voorvoeten en veer meteen door.'), F('Vangen in beweging', 'Plant de voeten, dan pas vangen.')],
    variants: { easier: 'Eén horde en een bijzetpas.', harder: 'Na de kruispas volgt een duik.' },
    diagram: D('doel', [K(50, 24), HD(50, 20), HD(50, 16), T(28, 30), B(30, 28)], [run(1, [50, 24], [50, 14]), run(2, [50, 14], [40, 11]), pass(3, [31, 28], [40, 12])])
  }),
  E({
    id: 'sr-voet-diepte-kiezen', name: 'Diepte kiezen bij een opkomende aanvaller',
    summary: 'De keeper past zijn diepte aan terwijl een aanvaller op hem afkomt en uiteindelijk schiet of doordribbelt.',
    description: 'De aanvaller start op 30 meter en dribbelt richting doel. De keeper stapt mee naar voren zolang de aanvaller ver is en zakt terug wanneer de aanvaller dicht bij de rand van het zestien komt en kan schieten. Bij een schot staat hij stil in basishouding.',
    themes: ['voetenwerk', 'eentegeneen'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, reps: 6,
    coaching: ['Mee naar voren bij een verre bal', 'Terug bij een schotmogelijkheid', 'Stil bij het schot'],
    mistakes: [F('Te diep op de lijn', 'Sta verder uit zolang de bal ver is.'), F('Lopen tijdens het schot', 'Stop elke beweging op het moment van de trap.')],
    variants: { easier: 'De trainer dribbelt aan wandeltempo.', harder: 'Een tweede aanvaller loopt mee voor een pass.' },
    diagram: D('zestien', [K(50, 9), A(50, 62, 'A'), B(50, 58)], [drib(1, [50, 58], [50, 38]), run(2, [50, 9], [50, 15])])
  }),
  E({
    id: 'sr-voet-mobiliteit-heup', name: 'Mobiliteitscircuit voor heupen en enkels',
    summary: 'Rustige opwarming met heupopeners, enkelcirkels en lunges in een korte reeks pionnen.',
    description: 'Zes pionnen staan op 3 meter van elkaar. Bij elke pion voert de keeper een andere beweging uit: heup open en dicht, diepe lunge met draai, enkelcirkels, zijwaartse lunge, spiderman-stap en tot slot een rustige versnelling. Twee rondes.',
    themes: ['voetenwerk'], levels: LV_ALL, ages: FROM13, intensity: 'laag', materials: ['pionnen'], blockTypes: ['opwarming'], warmup: ['mobiliteit'], complexity: 1, duration: 8, sets: 2, reps: 6, rest: 30,
    coaching: ['Rustig en volledig bewegen', 'Rechte rug in de lunge', 'Ademhaling meenemen'],
    mistakes: [F('Te snel', 'Elke beweging bewust en gecontroleerd.'), F('Knie valt naar binnen', 'Knie boven de voet houden.')],
    variants: { easier: 'Kleinere bewegingsuitslag.', harder: 'Met een bal boven het hoofd.' },
    diagram: D('vrij', [K(15, 36), C(25, 36), C(37, 36), C(49, 36), C(61, 36), C(73, 36), C(85, 36)], [run(1, [15, 36], [85, 36])])
  }),
  E({
    id: 'sr-voet-mobiliteit-bal', name: 'Mobiliteit met de bal',
    summary: 'Opwarming waarin de keeper rompdraaien, heupcirkels en schouderbewegingen combineert met een bal in de handen.',
    description: 'Elke keeper heeft een bal. Hij voert achter elkaar uit: bal rond het middel, achtjes rond de benen, lunge met rompdraai en de bal boven het hoofd, zijwaartse lunge met de bal naar de voet, en armcirkels met de bal. Elke beweging 30 seconden.',
    themes: ['voetenwerk', 'vangen'], levels: LV_ALL, ages: FROM13, intensity: 'laag', keepers: { min: 1, max: 6 }, blockTypes: ['opwarming'], warmup: ['mobiliteit'], complexity: 1, duration: 6, sets: 1, reps: 5, rest: 15, zone: '10 × 10 m',
    coaching: ['Groot en rustig bewegen', 'Bal blijft in controle', 'Ademhaling rustig houden'],
    mistakes: [F('Bewegingen te klein', 'Zoek de volledige bewegingsuitslag op.'), F('Bal laten vallen', 'Trager bewegen tot de controle er is.')],
    variants: { easier: 'Zonder lunges.', harder: 'Met een lichte medicijnbal.' },
    diagram: D('vrij', [K(50, 36), B(50, 32)], [run(1, [50, 36], [56, 40], [44, 40], [50, 36])])
  }),
  E({
    id: 'sr-voet-terugloop-chip', name: 'Teruglopen naar een chip',
    summary: 'De keeper staat ver uit zijn doel en loopt met een kruispas terug om een chip over zich heen te tikken.',
    description: 'De keeper staat op 10 meter van zijn doel. De trainer chipt de bal vanop 25 meter over hem heen. De keeper draait zijn heup, loopt met kruispassen terug en tikt de bal met één hand over de lat of vangt hem als dat kan. Achteruit lopen zonder draai is niet toegelaten.',
    themes: ['voetenwerk', 'hogeballen'], zone: 'Strafschopgebied', intensity: 'hoog', explosive: true, reps: 5, rest: 90,
    coaching: ['Heup draaien, kruispas terug', 'Ogen op de bal', 'Tikken met de verste hand'],
    mistakes: [F('Achteruit lopen', 'Draai de heup en loop zijwaarts met kruispassen.'), F('Te vroeg springen', 'Spring pas als je onder de bal komt.')],
    variants: { easier: 'Start op 6 meter en een lagere chip.', harder: 'Een aanvaller zet druk vanaf de zijkant.' },
    diagram: D('zestien', [K(50, 22), T(50, 56), B(50, 52)], [pass(1, [50, 51], [50, 20], [50, 6]), run(2, [50, 22], [48, 8])])
  }),
  E({
    id: 'sr-voet-sprongstop-zijwaarts', name: 'Sprongstop na zijwaartse verplaatsing',
    summary: 'Na een snelle zijwaartse verplaatsing landt de keeper met een kleine sprongstop in basishouding voor een schot.',
    description: 'De keeper verplaatst met bijzetpassen tussen drie pionnen. Op het signaal van de trainer maakt hij een kleine sprongstop, staat stil en krijgt meteen een schot naar zijn lichaam of net ernaast. Het moment van het signaal varieert.',
    themes: ['voetenwerk', 'vangen'], materials: ['ballen', 'pionnen'], levels: LV_ALL, ages: FROM13, reps: 8, rest: 45,
    coaching: ['Bijzetpassen, voeten niet kruisen', 'Kleine sprongstop', 'Gewicht op de voorvoeten'],
    mistakes: [F('Doorlopen bij het schot', 'Sprongstop maakt je stabiel.'), F('Benen te breed', 'Voeten op schouderbreedte.')],
    variants: { easier: 'Signaal steeds op dezelfde pion.', harder: 'Na de sprongstop volgt een duik.' },
    diagram: D('doel', [K(50, 13), C(40, 15), C(50, 15), C(60, 15), T(50, 44), B(50, 40)], [run(1, [50, 13], [58, 13]), pass(2, [50, 39], [57, 15])])
  }),
  E({
    id: 'sr-voet-positionering-hoek', name: 'Positie bij een bal uit een scherpe hoek',
    summary: 'De bal wordt vanaf de zijkant van het strafschopgebied aangespeeld en de keeper sluit de korte paal af.',
    description: 'De trainer dribbelt vanaf de zijlijn van het zestien richting doel en schiet of geeft een lage voorzet. De keeper sluit de korte paal af, met zijn lichaam tegen de denkbeeldige lijn tussen bal en korte paal. Bij een lage voorzet onderschept hij de bal of zet hij zich naar de tweede paal.',
    themes: ['voetenwerk'], zone: 'Strafschopgebied', materials: ['ballen', 'pionnen'], levels: LV_ALL, ages: FROM13, reps: 6,
    coaching: ['Korte paal dicht', 'Lichaam open naar het veld', 'Klaar voor de voorzet'],
    mistakes: [F('Te ver van de paal', 'Sluit de korte hoek, de verre hoek is moeilijker.'), F('Rug naar het veld', 'Blijf schuin staan, zodat je ook de voorzet ziet.')],
    variants: { easier: 'Altijd een schot.', harder: 'Een aanvaller loopt in voor de lage voorzet.' },
    diagram: D('zestien', [K(46, 7), C(12, 30), T(14, 34), B(16, 32)], [drib(1, [16, 32], [28, 20]), run(2, [48, 8], [44, 6])])
  }),
  E({
    id: 'sr-voet-reactiestart-kleur', name: 'Startreactie op kleuren',
    summary: 'De trainer roept een kleur en de keeper sprint naar de pion met die kleur om daar een bal te vangen.',
    description: 'Vier pionnen van verschillende kleur liggen in een vierkant van 6 meter rond de keeper. De trainer roept een kleur en speelt de bal naar die pion. De keeper reageert, sprint met korte passen en vangt de bal bij de pion.',
    themes: ['voetenwerk', 'reflexen'], materials: ['ballen', 'pionnen'], levels: LV_ALL, ages: FROM13, zone: '10 × 10 m', intensity: 'hoog', explosive: true, reps: 8, rest: 45,
    coaching: ['Eerste pas snel en kort', 'Ogen op de bal', 'Stilstaan voor het vangen'],
    mistakes: [F('Lange eerste pas', 'Kleine snelle passen geven een vlottere start.'), F('Vangen in volle loop', 'Rem af en vang in balans.')],
    variants: { easier: 'De trainer wijst in plaats van te roepen.', harder: 'Rekenen: de som van twee getallen is de pion.' },
    diagram: D('vrij', [K(50, 36), C(38, 24, 'geel'), C(62, 24, 'rood'), C(38, 48, 'blauw'), C(62, 48, 'wit'), T(50, 62), B(50, 58)], [run(1, [50, 36], [60, 26]), pass(2, [50, 57], [61, 28])])
  }),
  E({
    id: 'sr-voet-uitstappen-steekbal', name: 'Uitstappen op een steekbal',
    summary: 'De trainer speelt een steekbal achter de verdediging en de keeper beslist of hij uitkomt of blijft.',
    description: 'Een pion markeert de rand van het strafschopgebied. De trainer speelt van op 35 meter steekballen met verschillende snelheid. Een aanvaller loopt mee. De keeper beslist: uitkomen en de bal pakken of wegtrappen, of blijven en zich positioneren voor het 1-tegen-1.',
    themes: ['voetenwerk', 'eentegeneen', 'opbouw'], zone: 'Halve veld', materials: ['ballen', 'pionnen'], keepers: { min: 1, max: 2 }, intensity: 'hoog', explosive: true, reps: 6, rest: 75,
    coaching: ['Beslissing vroeg nemen', 'Volledig uitkomen of blijven', 'Bal weg buiten het zestien'],
    mistakes: [F('Halverwege blijven staan', 'Kies duidelijk: uitkomen of positioneren.'), F('Hand buiten het strafschopgebied', 'Buiten het zestien speel je met de voet.')],
    variants: { easier: 'Zonder aanvaller.', harder: 'De aanvaller start dichter bij de bal.' },
    diagram: D('halfveld', [K(50, 6), C(23, 24), C(77, 24), T(50, 56), A(40, 40, 'A'), B(50, 52)], [pass(1, [50, 51], [50, 26]), run(2, [50, 6], [50, 22]), run(3, [40, 40], [48, 28])])
  }),
  E({
    id: 'sr-voet-afsluit-voetbaltennis', name: 'Keepersvoetbaltennis',
    summary: 'Afsluiting: twee keepers spelen voetbaltennis over een lage lijn van pionnen, met voet en hoofd.',
    description: 'Een lijn van pionnen deelt een vak van 8 bij 4 meter in twee. De keepers spelen de bal met voet, dij of hoofd over de lijn. De bal mag één keer stuiten. Wie de bal niet terugkrijgt, verliest het punt. Spel tot 11.',
    themes: ['voetenwerk', 'opbouw'], levels: LV_ALL, ages: FROM13, intensity: 'laag', materials: ['ballen', 'pionnen'], keepers: { min: 2, max: 4 }, blockTypes: ['afsluiting'], complexity: 1, duration: 10, sets: 1, reps: 1, rest: 0, zone: '8 × 4 m',
    coaching: ['Licht op de voeten', 'Bal zacht aannemen', 'Plezier en techniek'],
    mistakes: [F('Stilstaan', 'Blijf op de voorvoeten bewegen.'), F('Te hard spelen', 'Controle gaat voor kracht.')],
    variants: { easier: 'Twee keer stuiten toegelaten.', harder: 'Enkel met de zwakke voet.' },
    diagram: D('vrij', [K(50, 22, 'K1'), K(50, 50, 'K2'), C(36, 36), C(50, 36), C(64, 36), B(50, 26)], [pass(1, [50, 27], [50, 46])])
  }),
  E({
    id: 'sr-voet-dubbelpositie-tweede-paal', name: 'Van eerste naar tweede paal',
    summary: 'Na een lage voorzet die voorbij de eerste paal gaat, verplaatst de keeper zich snel naar de tweede paal.',
    description: 'Trainer 1 geeft lage voorzetten vanaf links. Gaat de bal voorbij de keeper, dan legt een medespeler hem terug aan de tweede paal en schiet trainer 2. De keeper verplaatst zich met bijzetpassen en een kruispas naar de nieuwe positie en redt.',
    themes: ['voetenwerk', 'reflexen'], trainers: 2, zone: 'Strafschopgebied', intensity: 'hoog', divesPerRep: 0.5, reps: 5, rest: 75,
    coaching: ['Eerste paal dicht', 'Kruispas naar de tweede paal', 'Front naar de schutter'],
    mistakes: [F('Rug naar de bal', 'Blijf open staan tijdens de verplaatsing.'), F('Te diep in het doel', 'Verplaats op 1 meter voor de lijn.')],
    variants: { easier: 'Zonder schot, enkel verplaatsen.', harder: 'De medespeler kiest tussen terugleggen of zelf schieten.' },
    diagram: D('zestien', [K(46, 8), T(14, 22, 'T1'), T(62, 22, 'T2'), B(16, 21)], [pass(1, [17, 21], [50, 12], [60, 14]), run(2, [46, 8], [56, 8]), pass(3, [62, 21], [55, 9])])
  })
];
