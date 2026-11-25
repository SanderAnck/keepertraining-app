// Seniorenuitbreiding deel C: distributie, opbouw, communicatie en wedstrijdvoorbereiding (vooral senioren, gevorderd niveau).
import { E, F, D, K, T, S, A, B, C, H, LAD, HD, MG, RB, run, pass, drib, ALL, FROM13, FROM16, SEN, LV_ALL, LV_ADV, LV_MID, GEV } from './senior-helpers.mjs';

export default [
  // ---------------- Distributie ----------------
  E({
    id: 'sr-dist-werp-flank', name: 'Snelle overarmworp naar de flank',
    summary: 'Na een gevangen bal werpt de keeper meteen overarm naar een flankspeler die de diepte in loopt.',
    description: 'De trainer schiet een bal die de keeper vangt. Meteen daarna start een flankspeler een loopactie vanaf 25 meter. De keeper werpt overarm in de loop van de speler, zo dat hij de bal in één keer kan meenemen. Wissel elke reeks van flank.',
    themes: ['distributie'], zone: 'Halve veld', reps: 6, rest: 45,
    coaching: ['Werpen in de loop van de speler', 'Stap naar voren in de worp', 'Arm volledig door'],
    mistakes: [F('Bal stuitert hoog op', 'Werp vlak, de bal moet laag doorrollen.'), F('Achter de speler werpen', 'Mik twee meter voor de speler.')],
    variants: { easier: 'Stilstaande ontvanger op 20 meter.', harder: 'Een verdediger loopt mee met de flankspeler.' },
    diagram: D('halfveld', [K(50, 8), T(50, 34), S(84, 30, 'S'), B(50, 31)], [pass(1, [50, 30], [50, 10]), run(2, [84, 30], [88, 48]), pass(3, [52, 10], [86, 44])])
  }),
  E({
    id: 'sr-dist-dropkick-zone', name: 'Dropkick naar een doelzone',
    summary: 'De keeper speelt met een lage dropkick naar een zone op 40 meter, met een vlak traject.',
    description: 'Een zone van 10 bij 10 meter ligt op 40 meter van het doel. De keeper laat de bal vallen en raakt hem net na de stuit met de wreef, zodat het traject laag en snel is. Een medespeler in de zone neemt aan. Elke bal in de zone is een punt.',
    themes: ['distributie'], materials: ['ballen', 'pionnen'], zone: 'Halve veld', levels: LV_ALL, ages: FROM13, intensity: 'laag', reps: 8, rest: 30,
    coaching: ['Bal laten vallen, niet gooien', 'Raken net na de stuit', 'Wreef door de bal'],
    mistakes: [F('Bal te hoog', 'Bovenlichaam boven de bal houden.'), F('Bal opgooien', 'Laat hem vallen uit een gestrekte arm.')],
    variants: { easier: 'Zone op 25 meter.', harder: 'Zone van 6 bij 6 meter.' },
    diagram: D('halfveld', [K(50, 8), C(40, 54), C(60, 54), C(40, 64), C(60, 64), S(50, 59, 'S'), B(50, 10)], [pass(1, [50, 10], [50, 40], [50, 58])])
  }),
  E({
    id: 'sr-dist-doeltrap-lang', name: 'Lange doeltrap op de spits',
    summary: 'Doeltrappen naar een spits die de bal moet controleren of doorkoppen, met nadruk op hoogte en richting.',
    description: 'De keeper neemt doeltrappen vanaf de rand van het doelgebied. Een spits en een verdediger staan op 50 meter. De keeper mikt op de borst of het hoofd van de spits, met een traject dat niet te hoog is. Na elke trap evalueert hij of de bal speelbaar was.',
    themes: ['distributie', 'opbouw'], zone: 'Halve veld', levels: GEV, intensity: 'laag', reps: 8, rest: 30,
    coaching: ['Aanloop schuin op de bal', 'Standbeen naast de bal', 'Doortrappen richting doel'],
    mistakes: [F('Bal te hoog en kort', 'Raak de bal iets hoger en leun minder achterover.'), F('Geen richting', 'Kies vooraf je doelwit.')],
    variants: { easier: 'Zonder verdediger.', harder: 'Twee spitsen, de keeper kiest de vrije.' },
    diagram: D('halfveld', [K(46, 10), A(52, 62, 'A'), S(54, 64, 'V'), B(48, 9)], [run(1, [42, 14], [47, 10]), pass(2, [48, 9], [52, 34], [52, 60])])
  }),
  E({
    id: 'sr-dist-onderhands-rol', name: 'Onderhands uitrollen onder druk',
    summary: 'De keeper rolt de bal onderhands naar een verdediger die wegdraait van een aanvaller.',
    description: 'De keeper vangt een bal en kijkt meteen naar twee verdedigers die zich breed zetten. Een aanvaller zet druk op een van beide. De keeper rolt de bal naar de vrije verdediger, op de voet die van de druk wegdraait.',
    themes: ['distributie', 'opbouw'], zone: 'Strafschopgebied', levels: LV_ALL, ages: FROM13, keepers: { min: 1, max: 2 }, intensity: 'laag', reps: 8, rest: 30,
    coaching: ['Kijk voor je speelt', 'Rollen naar de verre voet', 'Laag over de grond'],
    mistakes: [F('Naar de gedekte speler', 'Kies de verdediger zonder druk.'), F('Bal stuitert', 'Laat los vlak bij de grond.')],
    variants: { easier: 'Zonder aanvaller.', harder: 'Twee aanvallers zetten druk.' },
    diagram: D('zestien', [K(50, 10), S(22, 30, 'V'), S(78, 30, 'V'), A(30, 34, 'A'), B(50, 12)], [run(1, [30, 34], [24, 32]), pass(2, [52, 12], [76, 29])])
  }),
  E({
    id: 'sr-dist-zijwaarts-volley', name: 'Zijwaartse volley naar de middenlijn',
    summary: 'De keeper speelt met een zijwaartse volley een strak, laag traject naar een speler op de middenlijn.',
    description: 'De keeper houdt de bal opzij, laat hem vallen en raakt hem met de wreef in een zwaai van opzij, zodat de bal laag en snel naar de middenlijn gaat. Een medespeler beweegt tussen twee pionnen en neemt aan.',
    themes: ['distributie'], materials: ['ballen', 'pionnen'], zone: 'Halve veld', levels: GEV, reps: 8, rest: 30,
    coaching: ['Bal opzij laten vallen', 'Bovenlichaam draait mee', 'Laag en strak traject'],
    mistakes: [F('Bal gaat omhoog', 'Raak de bal in het midden, niet onderaan.'), F('Evenwicht kwijt', 'Standbeen stevig en gebogen.')],
    variants: { easier: 'Gewone volley.', harder: 'Na een snelle opvang van een schot.' },
    diagram: D('halfveld', [K(46, 10), C(70, 62), C(84, 62), S(77, 60, 'S'), B(48, 11)], [pass(1, [48, 11], [66, 36], [76, 58]), run(2, [77, 60], [80, 58])])
  }),
  E({
    id: 'sr-dist-snelle-omschakeling', name: 'Omschakelen met één worp',
    summary: 'Na het onderscheppen van een voorzet zet de keeper binnen drie seconden een aanval op met een worp of trap.',
    description: 'Een voorzet wordt gevangen. Drie medespelers lopen meteen in verschillende richtingen. De keeper kiest de beste optie: korte worp, lange worp of volley. Twee tegenstanders proberen de bal te onderscheppen. Een geslaagde omschakeling levert een punt op.',
    themes: ['distributie', 'wedstrijd'], zone: 'Halve veld', keepers: { min: 1, max: 2 }, complexity: 3, reps: 6, rest: 60,
    coaching: ['Vangen en meteen kijken', 'Vrije speler kiezen', 'Binnen drie seconden'],
    mistakes: [F('Altijd lang spelen', 'De korte, vrije speler is vaak beter.'), F('Te laat beslissen', 'Kijk al op tijdens de landing.')],
    variants: { easier: 'Zonder tegenstanders.', harder: 'Vier tegenstanders.' },
    diagram: D('halfveld', [K(50, 8), T(12, 18), S(20, 40, 'S'), S(80, 40, 'S'), S(50, 56, 'S'), A(60, 44, 'A'), B(14, 17)], [pass(1, [15, 17], [40, 4], [50, 9]), run(2, [80, 40], [86, 52]), pass(3, [50, 9], [82, 46])])
  }),
  E({
    id: 'sr-dist-schuiver-diep', name: 'Lage schuiver in de diepte',
    summary: 'De keeper speelt met de binnenkant van de voet een lage bal in de diepte naar een inlopende flankspeler.',
    description: 'De keeper krijgt een terugspeelbal. Een flankspeler loopt vanaf 30 meter de diepte in. De keeper speelt met de wreef of binnenkant een lage, harde bal in de ruimte voor de speler. De bal moet onder een denkbeeldige lijn van kniehoogte blijven.',
    themes: ['distributie', 'opbouw'], zone: 'Halve veld', levels: GEV, reps: 8, rest: 30,
    coaching: ['Eerst aannemen naar de open kant', 'Lage, strakke pass', 'Speel in de ruimte'],
    mistakes: [F('Bal in de voeten', 'Speel in de loopruimte van de speler.'), F('Te zachte pass', 'De bal moet tegenstanders voorbij.')],
    variants: { easier: 'Stilstaande ontvanger.', harder: 'Een verdediger dekt de diepe loopactie.' },
    diagram: D('halfveld', [K(50, 12), S(40, 26, 'V'), S(84, 34, 'S'), B(42, 24)], [pass(1, [42, 24], [50, 14]), run(2, [84, 34], [88, 56]), pass(3, [52, 14], [86, 50])])
  }),
  E({
    id: 'sr-dist-precisie-doelen', name: 'Precisietrappen op mini-goals',
    summary: 'Trappen op mini-goals op 30 en 40 meter trainen de nauwkeurigheid van de lange bal.',
    description: 'Twee mini-goals staan op 30 en 40 meter, schuin op de flanken. De keeper neemt om beurt een doeltrap, een volley en een dropkick. Elke bal die het mini-goal raakt of erin rolt, telt. Na tien ballen worden de punten opgeteld.',
    themes: ['distributie'], materials: ['ballen', 'minigoals'], zone: 'Halve veld', levels: LV_ALL, ages: FROM13, intensity: 'laag', blockTypes: ['kern', 'afsluiting'], reps: 10, rest: 20,
    coaching: ['Doelwit kiezen voor de trap', 'Rustige aanloop', 'Vlakke trajecten'],
    mistakes: [F('Altijd volle kracht', 'Dosering is belangrijker dan kracht.'), F('Te snel na elkaar', 'Neem tijd voor elke trap.')],
    variants: { easier: 'Mini-goals op 20 meter.', harder: 'Enkel met de zwakke voet.' },
    diagram: D('halfveld', [K(50, 10), MG(20, 44), MG(80, 58), B(50, 12)], [pass(1, [50, 12], [36, 26], [22, 42]), pass(2, [52, 12], [70, 34], [79, 56])])
  }),
  E({
    id: 'sr-dist-werpen-onder-druk', name: 'Werpen na een gevangen voorzet onder druk',
    summary: 'Na een voorzet hindert een aanvaller de worp, zodat de keeper leert om snel een vrije lijn te vinden.',
    description: 'De keeper vangt een voorzet. Een aanvaller blijft voor hem staan en probeert de worp te blokkeren, zonder de keeper aan te raken. De keeper beweegt binnen het strafschopgebied tot hij een vrije lijn heeft en werpt naar een medespeler.',
    themes: ['distributie', 'hogeballen'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, reps: 6, rest: 45,
    coaching: ['Bewegen naar een vrije lijn', 'Laag en snel werpen', 'Niet over het hoofd werpen'],
    mistakes: [F('Werpen recht op de aanvaller', 'Eerst een stap opzij.'), F('Te lang wachten', 'Vier seconden is genoeg.')],
    variants: { easier: 'Aanvaller staat passief.', harder: 'Twee aanvallers.' },
    diagram: D('zestien', [K(50, 10), A(52, 14, 'A'), T(88, 26), S(20, 34, 'S'), B(86, 25)], [pass(1, [85, 25], [60, 6], [50, 11]), run(2, [50, 10], [44, 12]), pass(3, [44, 12], [22, 32])])
  }),
  E({
    id: 'sr-dist-penaltystip-chip', name: 'Chip over de eerste lijn',
    summary: 'De keeper chipt de bal over een rij pionnen naar een middenvelder die tussen de linies staat.',
    description: 'Een rij pionnen op 15 meter stelt de eerste druklijn voor. Een middenvelder staat 10 meter daarachter. De keeper chipt de bal met de binnenkant van de voet over de pionnen, zodat de middenvelder kan aannemen. Het traject moet kort en zacht zijn.',
    themes: ['distributie', 'opbouw'], materials: ['ballen', 'pionnen'], zone: 'Halve veld', levels: GEV, reps: 8, rest: 30,
    coaching: ['Onder de bal, kort contact', 'Zacht traject', 'Ontvanger kan aannemen'],
    mistakes: [F('Te hard', 'Een korte beweging is genoeg.'), F('Bal raakt de pionnen', 'Iets meer onder de bal.')],
    variants: { easier: 'Zonder pionnen.', harder: 'Een verdediger staat bij de middenvelder.' },
    diagram: D('halfveld', [K(50, 10), C(40, 22), C(50, 22), C(60, 22), S(50, 34, 'M'), B(50, 12)], [pass(1, [50, 12], [50, 22], [50, 32])])
  }),
  E({
    id: 'sr-dist-wissel-voet', name: 'Lange bal met beide voeten',
    summary: 'De keeper speelt lange ballen afwisselend met links en rechts naar beide flanken.',
    description: 'De trainer speelt een bal in naar de keeper, afwisselend naar links en rechts. De keeper neemt aan met de verste voet en speelt met dezelfde voet een lange bal naar de flank aan die kant. Elke reeks wordt de afstand groter.',
    themes: ['distributie'], zone: 'Halve veld', levels: LV_ALL, ages: FROM13, intensity: 'laag', reps: 8, rest: 30,
    coaching: ['Aannemen met de verste voet', 'Zwakke voet ook gebruiken', 'Standbeen naast de bal'],
    mistakes: [F('Altijd met de sterke voet', 'Elke kant heeft zijn voet.'), F('Bal blijft onder het lichaam', 'Neem aan naar voren, weg van de voeten.')],
    variants: { easier: 'Kortere afstanden.', harder: 'Een aanvaller zet druk vanaf de zijkant.' },
    diagram: D('halfveld', [K(50, 12), T(50, 34), S(14, 44, 'S'), S(86, 44, 'S'), B(50, 31)], [pass(1, [50, 30], [46, 14]), pass(2, [46, 13], [24, 28], [16, 42])])
  }),
  E({
    id: 'sr-dist-throw-tot-midden', name: 'Lange worp tot de middenlijn',
    summary: 'Krachttraining voor de overarmworp: de keeper werpt de bal zo ver en vlak mogelijk richting middenlijn.',
    description: 'Vanaf de rand van het strafschopgebied werpt de keeper de bal overarm, met een aanloop van drie passen, richting middenlijn. Pionnen op 30, 35 en 40 meter tonen de afstand. De worp moet vlak blijven en kunnen doorrollen.',
    themes: ['distributie'], materials: ['ballen', 'pionnen'], zone: 'Halve veld', levels: GEV, intensity: 'gemiddeld', reps: 6, rest: 45,
    coaching: ['Aanloop van drie passen', 'Arm gestrekt achteruit', 'Vlak traject'],
    mistakes: [F('Bal te hoog', 'Laat de bal los op schouderhoogte voor je lichaam.'), F('Arm gebogen', 'Een gestrekte arm geeft meer hefboom.')],
    variants: { easier: 'Zonder aanloop.', harder: 'Naar een bewegende speler.' },
    diagram: D('halfveld', [K(50, 22), C(50, 46, '30'), C(50, 54, '35'), C(50, 62, '40'), B(50, 24)], [run(1, [50, 18], [50, 22]), pass(2, [50, 24], [50, 50], [50, 60])])
  }),
  E({
    id: 'sr-dist-afsluit-kegelspel', name: 'Pionnen omspelen',
    summary: 'Afsluitend spel: twee keepers proberen met worpen en trappen de pionnen van de ander om te spelen.',
    description: 'Elke keeper verdedigt drie pionnen op een lijn, op 25 meter van de ander. Om beurt proberen ze met een worp, trap of volley een pion van de ander te raken. De ander mag de bal tegenhouden. Wie eerst alle pionnen raakt, wint.',
    themes: ['distributie', 'reflexen'], materials: ['ballen', 'pionnen'], zone: '30 × 20 m', levels: LV_ALL, ages: FROM13, keepers: { min: 2, max: 4 }, intensity: 'laag', blockTypes: ['afsluiting'], complexity: 1, duration: 10, sets: 1, reps: 1, rest: 0,
    coaching: ['Nauwkeurig, niet hard', 'Snel klaar om te verdedigen', 'Plezier'],
    mistakes: [F('Altijd hard trappen', 'Precisie wint dit spel.'), F('Niet verdedigen', 'Elke bal die je tegenhoudt, telt mee.')],
    variants: { easier: 'Afstand 15 meter.', harder: 'Enkel met de zwakke voet.' },
    diagram: D('vrij', [K(50, 12, 'K1'), K(50, 60, 'K2'), C(42, 8), C(50, 8), C(58, 8), C(42, 64), C(50, 64), C(58, 64), B(50, 56)], [pass(1, [50, 56], [42, 10])])
  }),

  // ---------------- Opbouw van achteruit ----------------
  E({
    id: 'sr-opb-driehoek-druk', name: 'Opbouw in een driehoek onder druk',
    summary: 'Keeper en twee centrale verdedigers bouwen op tegen twee aanvallers die hoog druk zetten.',
    description: 'De keeper en twee verdedigers spelen in het strafschopgebied. Twee aanvallers zetten druk. Het doel is de bal naar een van twee mini-goals op de 30 meter te spelen. Bij balverlies mogen de aanvallers op het grote doel afwerken.',
    themes: ['opbouw'], materials: ['ballen', 'minigoals'], zone: 'Halve veld', keepers: { min: 1, max: 2 }, trainers: 1, complexity: 3, reps: 6, rest: 60,
    coaching: ['Open aanspeelbaar zijn', 'Aannemen naar de vrije kant', 'Rustig blijven onder druk'],
    mistakes: [F('Recht achter de verdediger', 'Sta schuin voor een open passlijn.'), F('Bal te lang', 'Twee contacten waar het kan.')],
    variants: { easier: 'Eén aanvaller.', harder: 'Drie aanvallers en enkel één contact voor de keeper.' },
    diagram: D('halfveld', [K(50, 8), S(30, 18, 'V'), S(70, 18, 'V'), A(40, 26, 'A'), A(62, 24, 'A'), MG(26, 44), MG(74, 44), B(32, 17)], [pass(1, [32, 17], [48, 10]), run(2, [62, 24], [56, 14]), pass(3, [52, 10], [68, 18])])
  }),
  E({
    id: 'sr-opb-keeper-als-zesde', name: 'Keeper als extra man in de rondo',
    summary: 'Een rondo met de keeper als vrije man achteraan leert hem aanspeelbaar zijn en snel doorspelen.',
    description: 'In een vak van 20 bij 20 meter spelen vier spelers en de keeper tegen twee verdedigers. De keeper staat aan de achterkant van het vak en mag enkel twee keer raken. Na tien passes scoort het balbezittende team een punt. Bij balverlies wisselen de verdedigers.',
    themes: ['opbouw', 'distributie'], materials: ['ballen', 'pionnen'], zone: '25 × 20 m', levels: LV_ALL, ages: FROM13, keepers: { min: 1, max: 2 }, reps: 1, sets: 4, rest: 60, duration: 12,
    coaching: ['Open lichaam naar het spel', 'Eerste aanname weg van druk', 'Snel doorspelen'],
    mistakes: [F('Gesloten lichaam', 'Sta schuin zodat je beide kanten ziet.'), F('Bal te lang houden', 'Maximum twee contacten.')],
    variants: { easier: 'Eén verdediger.', harder: 'Eén contact voor de keeper.' },
    diagram: D('vrij', [K(50, 60), S(20, 36, 'S'), S(80, 36, 'S'), S(36, 14, 'S'), S(64, 14, 'S'), A(44, 34, 'A'), A(56, 40, 'A'), C(10, 10), C(90, 10), C(10, 64), C(90, 64), B(78, 38)], [pass(1, [78, 38], [52, 58]), pass(2, [48, 58], [22, 38])])
  }),
  E({
    id: 'sr-opb-terugspeelbal-eerste-tijd', name: 'Terugspeelbal in één tijd naar de vrije kant',
    summary: 'De verdediger speelt onder druk terug en de keeper speelt in één tijd naar de vrije kant.',
    description: 'De trainer speelt in op een verdediger die wordt opgejaagd door een aanvaller. De verdediger speelt terug naar de keeper. De keeper speelt in één tijd naar de verdediger aan de andere kant. Wissel de kant na drie herhalingen.',
    themes: ['opbouw'], zone: 'Strafschopgebied', levels: GEV, keepers: { min: 1, max: 2 }, reps: 6, rest: 45,
    coaching: ['Vooraf kijken waar de vrije man is', 'Speel in één tijd', 'Strakke pass op de grond'],
    mistakes: [F('Eerst aannemen', 'In één tijd spelen houdt het tempo hoog.'), F('Pass terug naar de druk', 'Speel naar de kant zonder druk.')],
    variants: { easier: 'Twee contacten.', harder: 'Een tweede aanvaller sluit de lange pass af.' },
    diagram: D('zestien', [K(50, 9), S(24, 22, 'V'), S(76, 22, 'V'), A(30, 28, 'A'), T(24, 50), B(24, 47)], [pass(1, [24, 46], [24, 24]), pass(2, [26, 21], [48, 11]), pass(3, [52, 11], [74, 21])])
  }),
  E({
    id: 'sr-opb-lange-bal-of-kort', name: 'Kort of lang: de keuze',
    summary: 'De keeper kiest bij elke opbouw tussen kort spelen of een lange bal, afhankelijk van de druk.',
    description: 'Twee verdedigers en een middenvelder bouwen op met de keeper. Twee of drie aanvallers zetten druk. Een spits staat op 45 meter. Als de korte opties gedekt zijn, speelt de keeper lang. Is er een vrije verdediger, dan speelt hij kort. Na elke opbouw bespreek je de keuze.',
    themes: ['opbouw', 'distributie'], zone: 'Halve veld', keepers: { min: 1, max: 2 }, complexity: 3, reps: 6, rest: 60,
    coaching: ['Eerst kijken, dan kiezen', 'Kort als het veilig is', 'Lang als het moet'],
    mistakes: [F('Altijd kort', 'Een lange bal is soms de veiligste keuze.'), F('Paniekbal', 'Een lange bal moet nog altijd een doelwit hebben.')],
    variants: { easier: 'Twee aanvallers.', harder: 'Vier aanvallers, de spits wordt gedekt.' },
    diagram: D('halfveld', [K(50, 8), S(26, 20, 'V'), S(74, 20, 'V'), S(50, 32, 'M'), A(34, 24, 'A'), A(66, 24, 'A'), A(52, 60, 'S'), B(50, 10)], [pass(1, [50, 10], [52, 34], [52, 58])])
  }),
  E({
    id: 'sr-opb-lichaamsstand', name: 'Open lichaamshouding bij aanname',
    summary: 'Techniekoefening voor de aanname: de keeper ontvangt met een open lichaam en speelt naar de verre kant.',
    description: 'Twee medespelers staan op 20 meter, links en rechts. De trainer speelt een bal naar de keeper. De keeper neemt aan met de voet die het verst van de passer is, met het lichaam open, en speelt naar de medespeler aan de andere kant.',
    themes: ['opbouw'], zone: 'Strafschopgebied', levels: LV_ALL, ages: FROM13, intensity: 'laag', reps: 10, rest: 30,
    coaching: ['Verste voet neemt aan', 'Lichaam open naar het veld', 'Speel naar de andere kant'],
    mistakes: [F('Aanname naar het eigen doel', 'Neem aan naar voren of opzij.'), F('Dichtste voet gebruiken', 'De verste voet opent het lichaam.')],
    variants: { easier: 'Tragere passes.', harder: 'Een aanvaller loopt in op de keeper.' },
    diagram: D('zestien', [K(50, 10), S(18, 26, 'S'), S(82, 26, 'S'), B(20, 25)], [pass(1, [21, 25], [48, 11]), pass(2, [52, 12], [80, 25])])
  }),
  E({
    id: 'sr-opb-positie-tussen-palen', name: 'Positie zonder bal bij eigen balbezit',
    summary: 'De keeper leert waar hij moet staan wanneer zijn team de bal heeft op de eigen helft.',
    description: 'Vier verdedigers en twee middenvelders laten de bal rondgaan op de eigen helft. De keeper schuift mee met de bal: altijd aanspeelbaar, nooit in de lijn van een tegenstander. De trainer roept af en toe "terug" en de bal wordt naar de keeper gespeeld.',
    themes: ['opbouw', 'communicatie'], zone: 'Halve veld', levels: LV_ALL, ages: FROM13, keepers: { min: 1, max: 2 }, intensity: 'laag', complexity: 2, reps: 1, sets: 3, rest: 60, duration: 10,
    coaching: ['Altijd aanspeelbaar', 'Schuif mee met de bal', 'Coach de verdedigers'],
    mistakes: [F('Op de doellijn blijven', 'Sta op de rand van het strafschopgebied of verder.'), F('Achter een tegenstander staan', 'Zorg voor een vrije passlijn.')],
    variants: { easier: 'Zonder tegenstanders.', harder: 'Twee aanvallers zetten druk.' },
    diagram: D('halfveld', [K(50, 18), S(16, 30, 'V'), S(38, 28, 'V'), S(62, 28, 'V'), S(84, 30, 'V'), B(18, 29)], [pass(1, [18, 29], [36, 28]), run(2, [50, 18], [44, 20])])
  }),
  E({
    id: 'sr-opb-tegen-hoge-druk', name: 'Opbouw tegen hoge druk',
    summary: 'Vier verdedigers en de keeper bouwen op tegen drie aanvallers die vanaf de doeltrap druk zetten.',
    description: 'Het spel begint met een korte doeltrap. Drie aanvallers zetten meteen hoog druk. Vier verdedigers en de keeper proberen een van drie poortjes op 35 meter te bereiken. Bij balverlies werken de aanvallers af op het grote doel.',
    themes: ['opbouw'], materials: ['ballen', 'pionnen'], zone: 'Halve veld', keepers: { min: 1, max: 2 }, complexity: 3, intensity: 'hoog', reps: 6, rest: 90,
    coaching: ['Rust uitstralen', 'Speel naar de vrije man', 'Durf lang als alles dicht is'],
    mistakes: [F('Paniek na de doeltrap', 'Neem tijd, de eerste pass moet goed zijn.'), F('Te dicht bij de verdedigers', 'Afstand geeft tijd.')],
    variants: { easier: 'Twee aanvallers.', harder: 'Vier aanvallers en een middenvelder extra.' },
    diagram: D('halfveld', [K(50, 8), S(24, 16, 'V'), S(76, 16, 'V'), S(10, 32, 'V'), S(90, 32, 'V'), A(34, 20, 'A'), A(50, 24, 'A'), A(66, 20, 'A'), C(20, 50), C(28, 50), C(46, 54), C(54, 54), C(72, 50), C(80, 50), B(26, 15)], [pass(1, [26, 15], [48, 9]), pass(2, [52, 9], [88, 30])])
  }),
  E({
    id: 'sr-opb-weg-van-druk', name: 'Eerste aanname weg van de druk',
    summary: 'Een aanvaller loopt in op de keeper en de keeper neemt de bal mee naar de vrije kant.',
    description: 'De trainer speelt de bal in op de keeper, een aanvaller start tegelijk vanaf 15 meter. De keeper neemt aan, weg van de aanvaller, en speelt dan naar een medespeler of trapt lang. De aanvaller probeert de bal te veroveren.',
    themes: ['opbouw', 'voetenwerk'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, reps: 8, rest: 45,
    coaching: ['Kijken voor de bal komt', 'Aanname weg van de aanvaller', 'Snel afspelen'],
    mistakes: [F('Aanname naar de aanvaller', 'Neem mee naar de open kant.'), F('Te veel contacten', 'Aanname en pass, klaar.')],
    variants: { easier: 'De aanvaller start op 20 meter.', harder: 'Twee aanvallers.' },
    diagram: D('zestien', [K(50, 10), A(62, 28, 'A'), T(30, 40), S(18, 26, 'S'), B(32, 38)], [pass(1, [33, 37], [48, 12]), run(2, [62, 28], [56, 14]), pass(3, [46, 12], [20, 25])])
  }),
  E({
    id: 'sr-opb-zone-14', name: 'Inspelen in de zone tussen de linies',
    summary: 'De keeper speelt de bal tussen de eerste en tweede druklijn naar een middenvelder.',
    description: 'Twee aanvallers vormen de eerste druklijn, twee middenvelders van de tegenstander de tweede. Een eigen middenvelder beweegt in de ruimte ertussen. De keeper speelt hem aan met een strakke grondpass of een korte chip.',
    themes: ['opbouw', 'distributie'], zone: 'Halve veld', levels: GEV, keepers: { min: 1, max: 2 }, complexity: 3, reps: 8, rest: 45,
    coaching: ['Zie de ruimte tussen de linies', 'Strak inspelen', 'Op de juiste voet'],
    mistakes: [F('Pass door de eerste lijn onderschept', 'Wacht tot de lijn open is.'), F('Te zacht inspelen', 'Een strakke pass geeft tijd aan de ontvanger.')],
    variants: { easier: 'Zonder tweede lijn.', harder: 'De middenvelder wordt van dichtbij gedekt.' },
    diagram: D('halfveld', [K(50, 10), A(40, 22, 'A'), A(60, 22, 'A'), A(42, 42, 'A'), A(58, 42, 'A'), S(50, 32, 'M'), B(50, 12)], [pass(1, [50, 12], [50, 30])])
  }),
  E({
    id: 'sr-opb-wisselen-van-kant', name: 'Van kant wisselen via de keeper',
    summary: 'De bal gaat van de ene flank via de keeper naar de andere, met een strakke en snelle circulatie.',
    description: 'Vier verdedigers spelen de bal rond. Op het moment dat een flank dicht zit, speelt de centrale verdediger terug naar de keeper. De keeper wisselt met één pass van kant naar de andere centrale verdediger of de verre back.',
    themes: ['opbouw'], zone: 'Halve veld', levels: LV_ALL, ages: FROM13, keepers: { min: 1, max: 2 }, intensity: 'laag', reps: 8, rest: 30,
    coaching: ['Aanspeelbaar bij een dichte flank', 'Snel van kant', 'Pass op de voet'],
    mistakes: [F('Terugspelen naar dezelfde kant', 'De andere kant is vrij.'), F('Trage circulatie', 'Twee contacten en spelen.')],
    variants: { easier: 'Zonder tegenstanders.', harder: 'Twee aanvallers schuiven mee.' },
    diagram: D('halfveld', [K(50, 10), S(30, 22, 'V'), S(70, 22, 'V'), S(12, 34, 'V'), S(88, 34, 'V'), B(32, 21)], [pass(1, [32, 21], [48, 11]), pass(2, [52, 11], [86, 33])])
  }),
  E({
    id: 'sr-opb-spel-vijf-tegen-vier', name: 'Vijf tegen vier met de keeper',
    summary: 'Spelvorm waarin de keeper meespeelt als vijfde man en het team de middenlijn moet overspelen.',
    description: 'In een veld tot de middenlijn speelt het team van de keeper met vier spelers tegen vier tegenstanders. Een punt is een gecontroleerde pass over de middenlijn. De tegenstanders scoren op het grote doel na balverovering.',
    themes: ['opbouw', 'wedstrijd'], zone: 'Halve veld', keepers: { min: 1, max: 2 }, intensity: 'hoog', complexity: 3, blockTypes: ['kern', 'afsluiting'], reps: 1, sets: 4, rest: 90, duration: 15,
    coaching: ['Rust en overzicht', 'Speel de vrije man', 'Coach de positie van je spelers'],
    mistakes: [F('Te veel risico in de eigen zestien', 'Bij twijfel lang spelen.'), F('Te weinig praten', 'Jij ziet het hele veld.')],
    variants: { easier: 'Vijf tegen drie.', harder: 'Vijf tegen vijf.' },
    diagram: D('halfveld', [K(50, 8), S(24, 22, 'S'), S(76, 22, 'S'), S(36, 40, 'S'), S(64, 40, 'S'), A(36, 26, 'A'), A(64, 26, 'A'), A(50, 38, 'A'), A(50, 54, 'A'), B(26, 21)], [pass(1, [26, 21], [48, 9]), pass(2, [52, 9], [74, 21]), pass(3, [76, 23], [66, 38])])
  }),
  E({
    id: 'sr-opb-voetenwerk-bal', name: 'Voetbalvaardigheid voor keepers',
    summary: 'Techniek met de bal aan de voet: aannemen, meenemen en passen met links en rechts rond pionnen.',
    description: 'Vier pionnen staan in een vierkant van 10 meter. De keeper neemt een pass aan, neemt de bal mee rond een pion en speelt naar de volgende medespeler. Elke bal wordt afwisselend met links en rechts gespeeld.',
    themes: ['opbouw', 'voetenwerk'], materials: ['ballen', 'pionnen'], zone: '10 × 10 m', levels: LV_ALL, ages: FROM13, intensity: 'laag', blockTypes: ['opwarming', 'kern'], warmup: ['balgewenning'], complexity: 1, duration: 8, reps: 10, rest: 30,
    coaching: ['Aanname naar voren', 'Links en rechts', 'Kijk op voor je speelt'],
    mistakes: [F('Bal onder het lichaam', 'Neem de bal mee voor je uit.'), F('Enkel de sterke voet', 'Wissel bewust.')],
    variants: { easier: 'Zonder pionnen, enkel passen.', harder: 'Eén contact.' },
    diagram: D('vrij', [K(30, 22), S(70, 22, 'S'), S(70, 52, 'S'), C(30, 18), C(70, 18), C(30, 56), C(70, 56), B(32, 24)], [drib(1, [32, 24], [34, 30]), pass(2, [34, 30], [68, 24])])
  }),
  E({
    id: 'sr-opb-flankopbouw', name: 'Opbouw via de back',
    summary: 'De keeper speelt de back aan die breed staat, en volgt met een loopactie voor de terugspeelbal.',
    description: 'De back staat breed op de zijlijn, op 25 meter. Een aanvaller zet druk vanaf binnen. De keeper speelt de back aan, die meteen terugkaatst als de druk komt. De keeper schuift mee naar de rand van het strafschopgebied om aanspeelbaar te blijven.',
    themes: ['opbouw', 'voetenwerk'], zone: 'Halve veld', keepers: { min: 1, max: 2 }, reps: 6, rest: 45,
    coaching: ['Pass op de buitenste voet', 'Meeschuiven na de pass', 'Opnieuw aanspeelbaar'],
    mistakes: [F('Na de pass stilstaan', 'Beweeg om opnieuw aanspeelbaar te zijn.'), F('Pass op de binnenvoet', 'Speel weg van de druk.')],
    variants: { easier: 'Zonder aanvaller.', harder: 'De aanvaller kan de terugspeelbal ook afsluiten.' },
    diagram: D('halfveld', [K(50, 10), S(90, 34, 'B'), A(78, 30, 'A'), B(52, 11)], [pass(1, [52, 11], [88, 34]), run(2, [50, 10], [60, 18]), pass(3, [88, 34], [62, 19])])
  }),

  // ---------------- Communicatie en coaching ----------------
  E({
    id: 'sr-com-verdedigingslijn-sturen', name: 'De verdedigingslijn sturen',
    summary: 'De keeper stuurt een verdedigingslijn van vier met korte commando\'s terwijl de bal van kant wisselt.',
    description: 'Vier verdedigers staan op een lijn, vier aanvallers spelen de bal rond op 30 meter. De keeper roept "op", "terug", "schuif links" of "schuif rechts" en de lijn reageert. Na elke aanval die eindigt in een schot geeft de trainer feedback op de commando\'s.',
    themes: ['communicatie'], zone: 'Halve veld', keepers: { min: 1, max: 2 }, levels: LV_ALL, ages: FROM13, complexity: 3, reps: 6, rest: 60,
    coaching: ['Korte, vaste commando\'s', 'Naam + opdracht', 'Op tijd, niet achteraf'],
    mistakes: [F('Te lange zinnen', 'Eén woord en een naam.'), F('Te laat coachen', 'Coach voor de pass, niet na het doelpunt.')],
    variants: { easier: 'Twee verdedigers en twee aanvallers.', harder: 'De aanvallers mogen ook diep spelen.' },
    diagram: D('halfveld', [K(50, 8), S(20, 26, 'V'), S(40, 26, 'V'), S(60, 26, 'V'), S(80, 26, 'V'), A(24, 46, 'A'), A(44, 48, 'A'), A(60, 48, 'A'), A(78, 46, 'A'), B(26, 45)], [pass(1, [26, 45], [58, 48]), run(2, [20, 26], [30, 28])])
  }),
  E({
    id: 'sr-com-muur-opstellen', name: 'Een muur opstellen bij een vrije trap',
    summary: 'De keeper zet bij een vrije trap snel en duidelijk een muur op en positioneert zich zelf.',
    description: 'De trainer legt de bal op verschillende plaatsen rond het strafschopgebied. De keeper bepaalt het aantal spelers in de muur, stuurt de buitenste man naar de juiste lijn en zet zich zelf aan de andere kant. Daarna neemt de trainer de vrije trap.',
    themes: ['communicatie', 'wedstrijd'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, levels: LV_ALL, ages: FROM13, intensity: 'laag', reps: 6, rest: 45,
    coaching: ['Aantal spelers luid roepen', 'Buitenste man op de paal', 'Zelf de andere kant'],
    mistakes: [F('Achter de muur staan', 'Zorg dat je de bal kan zien.'), F('Te veel tijd', 'Snel opstellen, de scheidsrechter wacht niet.')],
    variants: { easier: 'Altijd centraal.', harder: 'De trainer neemt de vrije trap snel als de muur niet staat.' },
    diagram: D('zestien', [K(56, 6), S(40, 22, 'M'), S(43, 22, 'M'), S(46, 22, 'M'), T(36, 40), B(38, 38)], [run(1, [52, 6], [56, 6]), pass(2, [39, 37], [52, 20], [54, 8])])
  }),
  E({
    id: 'sr-com-hoekschop-indeling', name: 'Hoekschop: indeling en commando\'s',
    summary: 'De keeper verdeelt spelers bij een hoekschop en coacht tijdens de bal met vaste woorden.',
    description: 'Zes verdedigers en vijf aanvallers. De keeper wijst vooraf de mandekking en de zones toe. Tijdens de hoekschop gebruikt hij vaste commando\'s: "keeper", "weg", "man" of "tweede bal". Na elke hoekschop bespreekt hij kort wat beter kan.',
    themes: ['communicatie', 'hogeballen'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, complexity: 3, reps: 6, rest: 60,
    coaching: ['Vooraf indelen', 'Vaste commando\'s', 'Kort evalueren'],
    mistakes: [F('Indeling vergeten', 'Elke speler weet zijn taak voor de bal vertrekt.'), F('Roepen zonder beslissing', 'Roep wat je gaat doen.')],
    variants: { easier: 'Drie aanvallers.', harder: 'Korte en lange varianten door elkaar.' },
    diagram: D('zestien', [K(48, 8), S(42, 5, 'V'), S(56, 5, 'V'), S(44, 18, 'V'), S(56, 18, 'V'), A(46, 22, 'A'), A(58, 22, 'A'), T(98, 4), B(96, 5)], [pass(1, [95, 6], [72, 4], [52, 12]), run(2, [48, 8], [51, 11])])
  }),
  E({
    id: 'sr-com-diepte-coachen', name: 'Diepte coachen bij een steekbal',
    summary: 'De keeper waarschuwt de verdedigers bij een loopactie in de diepte en stuurt wie volgt.',
    description: 'Een middenvelder van de tegenstander heeft de bal op 40 meter, een aanvaller start een diepe loopactie. De keeper roept de naam van de verdediger die moet volgen en "diepte!". De andere verdedigers schuiven in. Het spel loopt door tot een afwerking of balverovering.',
    themes: ['communicatie', 'eentegeneen'], zone: 'Halve veld', keepers: { min: 1, max: 2 }, complexity: 3, reps: 6, rest: 60,
    coaching: ['Loopactie vroeg zien', 'Naam + "diepte"', 'Zelf klaar voor de steekbal'],
    mistakes: [F('Algemeen roepen', 'Noem één naam.'), F('Coachen en vergeten te positioneren', 'Coachen en zelf uitstappen gaan samen.')],
    variants: { easier: 'De aanvaller start altijd vanaf dezelfde kant.', harder: 'Twee aanvallers maken een loopactie.' },
    diagram: D('halfveld', [K(50, 8), S(36, 28, 'V'), S(64, 28, 'V'), A(56, 36, 'A'), S(50, 56, 'M'), B(50, 52)], [run(1, [56, 36], [58, 18]), pass(2, [50, 51], [58, 20]), run(3, [50, 8], [54, 16])])
  }),
  E({
    id: 'sr-com-lichaamstaal', name: 'Lichaamstaal na een tegendoelpunt',
    summary: 'Mentale oefening: na een tegendoelpunt reset de keeper met een vaste routine en coacht hij zijn team positief.',
    description: 'In een korte partijvorm krijgt de keeper enkele moeilijke doelpunten tegen. Na elk doelpunt voert hij een vaste routine uit: bal uit het net, diep ademhalen, positieve opdracht naar het team ("kop op, compact"). De trainer let op lichaamstaal en houding.',
    themes: ['communicatie', 'wedstrijd'], zone: 'Halve veld', levels: LV_ALL, ages: FROM13, keepers: { min: 1, max: 2 }, intensity: 'gemiddeld', complexity: 2, reps: 1, sets: 3, rest: 60, duration: 10,
    coaching: ['Vaste reset-routine', 'Rechte rug, hoofd omhoog', 'Positief coachen'],
    mistakes: [F('Ploegmaats verwijten', 'Stuur aan, beoordeel later.'), F('Hoofd laten hangen', 'Je houding beïnvloedt het hele team.')],
    variants: { easier: 'De routine eerst zonder spel oefenen.', harder: 'Met publiek dat negatieve opmerkingen maakt.' },
    diagram: D('halfveld', [K(50, 8), S(36, 24, 'V'), S(64, 24, 'V'), A(50, 30, 'A'), B(50, 28)], [pass(1, [50, 27], [54, 6]), run(2, [50, 8], [50, 12])])
  }),
  E({
    id: 'sr-com-roep-verplicht', name: 'Partijvorm met verplicht roepen',
    summary: 'Een kleine partij waarin elke actie van de keeper vooraf moet worden aangekondigd.',
    description: 'Vier tegen vier op een veld van 40 bij 30 meter met twee keepers. Elke keeper moet elke bal die hij pakt of laat gaan aankondigen met "keeper" of "weg". Een actie zonder roepen geeft een vrije trap voor de tegenstander.',
    themes: ['communicatie', 'wedstrijd'], zone: '30 × 20 m', levels: LV_ALL, ages: FROM13, keepers: { min: 2, max: 2 }, intensity: 'gemiddeld', blockTypes: ['afsluiting', 'kern'], complexity: 2, reps: 1, sets: 3, rest: 60, duration: 12,
    coaching: ['Elke actie aankondigen', 'Luid en vroeg', 'Coach ook zonder bal'],
    mistakes: [F('Stil spelen', 'Roepen is onderdeel van de techniek.'), F('Te laat roepen', 'Roep vóór je vertrekt.')],
    variants: { easier: 'Enkel bij hoge ballen.', harder: 'Ook coachen bij elke pass van de tegenstander.' },
    diagram: D('vrij', [K(50, 8, 'K1'), K(50, 64, 'K2'), S(36, 24), S(64, 24), A(40, 44), A(60, 44), B(38, 26)], [pass(1, [38, 26], [58, 42]), run(2, [50, 64], [52, 58])])
  }),
  E({
    id: 'sr-com-keeperstrio', name: 'Drie keepers coachen elkaar',
    summary: 'Twee keepers kijken toe en geven elk één concreet coachingspunt aan de keeper die aan de beurt is.',
    description: 'Eén keeper staat in doel en krijgt een reeks van zes schoten en voorzetten. De twee andere keepers kijken toe, elk met een eigen aandachtspunt (bijvoorbeeld positie en handtechniek). Na de reeks geven ze elk één tip. Daarna wisselen de rollen.',
    themes: ['communicatie', 'vangen'], zone: 'Strafschopgebied', levels: LV_ALL, ages: FROM13, keepers: { min: 3, max: 3 }, intensity: 'gemiddeld', reps: 6, sets: 3, rest: 30, duration: 15,
    coaching: ['Eén concreet punt per keeper', 'Eerst iets positiefs', 'Luisteren en toepassen'],
    mistakes: [F('Algemene feedback', 'Benoem een moment en een oplossing.'), F('Niet toepassen', 'De volgende reeks gaat over dat ene punt.')],
    variants: { easier: 'De trainer geeft de aandachtspunten.', harder: 'De kijkende keepers bepalen zelf de oefening.' },
    diagram: D('zestien', [K(50, 9), K(18, 14, 'K2'), K(82, 14, 'K3'), T(50, 36), B(50, 33)], [pass(1, [50, 32], [52, 12])])
  }),
  E({
    id: 'sr-com-buitenspel-val', name: 'De lijn hoog houden',
    summary: 'De keeper bepaalt mee wanneer de verdediging opschuift, zodat de aanvallers buitenspel staan.',
    description: 'Vier verdedigers staan tegenover drie aanvallers. Een middenvelder van de tegenstander speelt de bal terug of zijwaarts. Bij een terugspeelbal roept de keeper "op!" en schuift de lijn naar voren. De trainer beoordeelt of de aanvallers buitenspel stonden bij de volgende pass.',
    themes: ['communicatie', 'opbouw'], zone: 'Halve veld', levels: GEV, keepers: { min: 1, max: 2 }, complexity: 3, reps: 6, rest: 60,
    coaching: ['Terugspeelbal = "op!"', 'Iedereen tegelijk', 'Zelf ook mee naar voren'],
    mistakes: [F('Eén verdediger blijft achter', 'Benoem hem en stuur hem mee.'), F('Keeper blijft op de lijn', 'Sta hoog achter je verdediging.')],
    variants: { easier: 'Zonder aanvallers.', harder: 'Aanvallers die bewust laat lopen.' },
    diagram: D('halfveld', [K(50, 14), S(22, 30, 'V'), S(42, 30, 'V'), S(58, 30, 'V'), S(78, 30, 'V'), A(32, 34, 'A'), A(64, 34, 'A'), S(50, 54, 'M'), B(52, 56)], [pass(1, [52, 56], [52, 64]), run(2, [42, 30], [42, 38]), run(3, [50, 14], [50, 22])])
  }),
  E({
    id: 'sr-com-spelhervatting-snel', name: 'Snelle spelhervatting organiseren',
    summary: 'Na een gevangen bal organiseert de keeper in drie seconden de omschakeling met roep en gebaar.',
    description: 'Na elke gevangen bal roept de keeper meteen een richting ("links", "rechts", "lang") en wijst hij de speler aan die moet starten. Die speler maakt een loopactie, de keeper speelt hem aan. De trainer kijkt of de opdracht duidelijk en snel was.',
    themes: ['communicatie', 'distributie'], zone: 'Halve veld', levels: LV_ALL, ages: FROM13, keepers: { min: 1, max: 2 }, reps: 6, rest: 45,
    coaching: ['Richting roepen', 'Speler aanwijzen', 'Meteen spelen'],
    mistakes: [F('Eerst rondkijken, dan roepen', 'Kijk al tijdens de vangst.'), F('Onduidelijke gebaren', 'Een gestrekte arm naar de ruimte.')],
    variants: { easier: 'Twee vaste spelers.', harder: 'Tegenstanders proberen de loopactie te volgen.' },
    diagram: D('halfveld', [K(50, 8), T(50, 32), S(16, 30, 'S'), S(84, 30, 'S'), B(50, 29)], [pass(1, [50, 28], [50, 10]), run(2, [84, 30], [88, 48]), pass(3, [52, 10], [86, 44])])
  }),
  E({
    id: 'sr-com-verdedigers-positie', name: 'Verdedigers op hun plaats coachen bij een voorzet',
    summary: 'Bij een voorzet van de flank stuurt de keeper zijn verdedigers naar de eerste paal, de penaltystip en de tweede paal.',
    description: 'Een medespeler van de tegenstander dribbelt op de flank. Drie verdedigers staan nog te hoog. De keeper roept ze naar hun plaats: eerste paal, penaltystip, tweede paal. Daarna volgt de voorzet en spelen drie aanvallers mee.',
    themes: ['communicatie', 'hogeballen'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, complexity: 3, reps: 6, rest: 60,
    coaching: ['Zones benoemen', 'Naam per verdediger', 'Klaar voor de voorzet'],
    mistakes: [F('Alleen bezig met de bal', 'Kijk ook naar je verdedigers.'), F('Verdedigers op de lijn', 'Ze moeten voor jou staan, niet naast je.')],
    variants: { easier: 'Zonder aanvallers.', harder: 'Een lage en een hoge voorzet door elkaar.' },
    diagram: D('zestien', [K(46, 8), S(40, 20, 'V'), S(52, 22, 'V'), S(62, 24, 'V'), A(48, 30, 'A'), S(86, 26, 'S'), B(84, 25)], [run(1, [40, 20], [40, 12]), run(2, [62, 24], [58, 14]), pass(3, [83, 25], [56, 14])])
  }),
  E({
    id: 'sr-com-afsluit-praatronde', name: 'Afsluiten met een praatronde',
    summary: 'Rustige afsluiting: de keepers bespreken drie situaties uit de training en spreken een werkpunt af.',
    description: 'Na een korte cooling-down met lichte stretching zitten de keepers samen. Elke keeper noemt één ding dat goed ging, één situatie waarin hij twijfelde en één werkpunt voor de volgende training. De trainer noteert het werkpunt in de app.',
    themes: ['communicatie'], zone: '10 × 10 m', levels: LV_ALL, ages: FROM13, keepers: { min: 1, max: 6 }, intensity: 'laag', blockTypes: ['afsluiting'], complexity: 1, duration: 6, sets: 1, reps: 1, rest: 0, materials: [],
    coaching: ['Eerlijk en concreet', 'Eén werkpunt per keeper', 'Rustig uitstretchen'],
    mistakes: [F('Algemeen blijven', 'Benoem een concreet moment.'), F('Te veel werkpunten', 'Eén punt is genoeg.')],
    variants: { easier: 'De trainer stelt de vragen.', harder: 'Keepers geven elkaar feedback.' },
    diagram: D('vrij', [K(40, 30), K(60, 30), T(50, 44)], [run(1, [40, 30], [44, 36])])
  }),
  E({
    id: 'sr-com-zone-of-man', name: 'Zone of man: snel beslissen',
    summary: 'De keeper beslist bij elke spelhervatting of zijn team zonaal of op de man verdedigt en roept het luid.',
    description: 'De trainer wisselt snel tussen hoekschop, vrije trap en inworp. De keeper roept bij elke situatie "zone" of "man" en stuurt indien nodig één speler bij. Na de spelhervatting volgt een korte aanval van de tegenstander.',
    themes: ['communicatie', 'wedstrijd'], zone: 'Strafschopgebied', levels: GEV, keepers: { min: 1, max: 2 }, complexity: 3, reps: 6, rest: 60,
    coaching: ['Snel beslissen', 'Eén woord voor het team', 'Daarna specifieke opdrachten'],
    mistakes: [F('Twijfelen', 'Elke keuze is beter dan geen keuze.'), F('Spelers niet bijsturen', 'Benoem wie vrij staat.')],
    variants: { easier: 'Enkel hoekschoppen.', harder: 'Met een tijdslimiet van vijf seconden.' },
    diagram: D('zestien', [K(48, 8), S(44, 16, 'V'), S(56, 16, 'V'), A(46, 22, 'A'), A(58, 22, 'A'), T(98, 4), B(96, 5)], [pass(1, [95, 6], [70, 6], [52, 14]), run(2, [48, 8], [51, 12])])
  }),

  // ---------------- Wedstrijdvoorbereiding ----------------
  E({
    id: 'sr-wed-opwarming-matchday', name: 'Wedstrijdopwarming in twintig minuten',
    summary: 'Complete opwarming voor een wedstrijd: mobiliteit, balgewenning, duiken, hoge ballen en schoten in een vaste volgorde.',
    description: 'De keeper doorloopt een vaste reeks: 4 minuten mobiliteit, 4 minuten balgewenning in duo, 4 minuten lichte en daarna volle duiken, 4 minuten hoge ballen en 4 minuten schoten van buiten de zestien. Het tempo stijgt geleidelijk, zonder vermoeidheid op te bouwen.',
    themes: ['wedstrijd', 'vangen'], levels: LV_ALL, ages: FROM13, intensity: 'gemiddeld', divesPerRep: 0.5, blockTypes: ['opwarming'], warmup: ['mobiliteit', 'balgewenning', 'valvorm'], complexity: 1, duration: 20, sets: 1, reps: 10, rest: 15, zone: 'Strafschopgebied',
    coaching: ['Vaste volgorde, elke week', 'Tempo stap voor stap omhoog', 'Eindigen met een goed gevoel'],
    mistakes: [F('Te veel duiken', 'Kwaliteit en vertrouwen, geen conditie.'), F('Opwarming overslaan', 'Elke match dezelfde routine.')],
    variants: { easier: 'Vijftien minuten met minder schoten.', harder: 'Met wedstrijdspecifieke situaties van de tegenstander.' },
    diagram: D('zestien', [K(50, 9), T(50, 34), B(50, 31)], [run(1, [50, 9], [46, 10]), pass(2, [50, 30], [44, 11])])
  }),
  E({
    id: 'sr-wed-tegenstander-analyse', name: 'Tegenstander naspelen',
    summary: 'De trainer speelt de favoriete aanvalspatronen van de tegenstander na, zodat de keeper ze herkent.',
    description: 'Op basis van een analyse kiest de trainer drie patronen van de tegenstander, bijvoorbeeld voorzetten vanaf links, afstandsschoten van de nummer 10 en hoekschoppen naar de eerste paal. Elk patroon wordt vijf keer gespeeld. De keeper bespreekt vooraf zijn plan.',
    themes: ['wedstrijd'], zone: 'Strafschopgebied', levels: GEV, keepers: { min: 1, max: 2 }, complexity: 3, reps: 5, sets: 3, rest: 60, duration: 15,
    coaching: ['Plan vooraf bespreken', 'Patroon herkennen', 'Plan toepassen'],
    mistakes: [F('Algemeen trainen', 'Focus op de drie patronen.'), F('Plan niet uitvoeren', 'Herhaal tot het automatisch gaat.')],
    variants: { easier: 'Eén patroon.', harder: 'De trainer wisselt de patronen zonder aankondiging.' },
    diagram: D('zestien', [K(46, 8), S(14, 26, 'S'), A(52, 24, 'A'), B(16, 25)], [pass(1, [17, 25], [42, 8], [52, 14]), run(2, [46, 8], [50, 12])])
  }),
  E({
    id: 'sr-wed-laatste-minuten', name: 'Laatste minuten verdedigen',
    summary: 'Partijvorm waarin het team van de keeper een voorsprong moet verdedigen tegen een overtal.',
    description: 'Vijf tegen zes op een halve veld. Het team van de keeper staat 1-0 voor met nog drie minuten te spelen. De keeper beslist over tijdrekken binnen de regels, organiseert de verdediging en speelt veilig. De tegenstander scoort dubbel in de laatste minuut.',
    themes: ['wedstrijd', 'communicatie'], zone: 'Halve veld', keepers: { min: 1, max: 2 }, intensity: 'hoog', divesPerRep: 0.5, complexity: 3, blockTypes: ['afsluiting', 'kern'], reps: 1, sets: 3, rest: 90, duration: 12,
    coaching: ['Rust bewaren', 'Veilig en slim spelen', 'Team compact houden'],
    mistakes: [F('Paniekballen', 'Ook onder druk een doel kiezen.'), F('Te veel tijd rekken', 'Blijf binnen de regels, anders volgt geel.')],
    variants: { easier: 'Gelijk aantal spelers.', harder: 'Twee extra aanvallers.' },
    diagram: D('halfveld', [K(50, 8), S(30, 20, 'V'), S(50, 18, 'V'), S(70, 20, 'V'), A(40, 30, 'A'), A(60, 30, 'A'), A(50, 42, 'A'), B(50, 40)], [pass(1, [50, 39], [60, 30]), pass(2, [60, 29], [54, 10])])
  }),
  E({
    id: 'sr-wed-strafschop-psychologie', name: 'Strafschoppen met routine',
    summary: 'De keeper oefent zijn vaste routine voor strafschoppen: positie, lichaamstaal, oogcontact en timing.',
    description: 'Voor elke strafschop voert de keeper een vaste routine uit: bal pakken en aan de schutter geven, rustig naar de lijn wandelen, groot maken op de lijn en oogcontact. Hij beslist over wachten of een kant kiezen. Na vijf strafschoppen wisselt de keeper.',
    themes: ['wedstrijd', 'duiken'], zone: 'Strafschopgebied', levels: LV_ALL, ages: FROM13, intensity: 'gemiddeld', divesPerRep: 1, blockTypes: ['afsluiting', 'kern'], reps: 5, sets: 2, rest: 30, duration: 10,
    coaching: ['Vaste routine', 'Groot op de lijn', 'Wachten tot het standbeen staat'],
    mistakes: [F('Gehaast', 'Neem de tijd die de regels toelaten.'), F('Te vroeg van de lijn', 'Eén voet op of boven de lijn bij de trap.')],
    variants: { easier: 'Zonder routine, enkel techniek.', harder: 'Met publiek en een echte reeks.' },
    diagram: D('zestien', [K(50, 4), S(50, 28, 'S'), B(50, 24)], [run(1, [50, 8], [50, 4]), pass(2, [50, 23], [44, 5])])
  }),
  E({
    id: 'sr-wed-concentratie-lang', name: 'Concentratie na lange inactiviteit',
    summary: 'De keeper staat drie minuten zonder actie in doel en moet dan meteen een moeilijke bal verwerken.',
    description: 'Het team speelt een partijvorm aan de andere kant van het veld. De keeper blijft drie minuten zonder actie, maar coacht en volgt het spel. Plots start een snelle tegenaanval met een schot. De keeper moet meteen scherp zijn.',
    themes: ['wedstrijd', 'reflexen'], zone: 'Halve veld', levels: LV_ALL, ages: FROM13, keepers: { min: 1, max: 2 }, intensity: 'gemiddeld', divesPerRep: 0.5, reps: 1, sets: 4, rest: 30, duration: 15,
    coaching: ['Blijven bewegen', 'Volg het spel en coach', 'Elke bal is de eerste'],
    mistakes: [F('Stil blijven staan', 'Beweeg licht op de voeten.'), F('Ophouden met coachen', 'Praten houdt je in de wedstrijd.')],
    variants: { easier: 'Na twee minuten.', harder: 'Na vijf minuten en een 1-tegen-1.' },
    diagram: D('halfveld', [K(50, 8), A(50, 50, 'A'), S(40, 56, 'S'), S(60, 56, 'S'), B(50, 47)], [drib(1, [50, 47], [50, 28]), pass(2, [50, 27], [56, 8])])
  }),
  E({
    id: 'sr-wed-scenarios-kaart', name: 'Wedstrijdscenario\'s op kaartjes',
    summary: 'De trainer trekt een kaartje met een wedstrijdscenario en de groep speelt het meteen na.',
    description: 'Op kaartjes staan scenario\'s zoals "hoekschop in de laatste minuut", "steekbal na balverlies" of "vrije trap op 20 meter". De trainer trekt een kaartje, de spelers stellen zich op en spelen het scenario. De keeper organiseert en verdedigt.',
    themes: ['wedstrijd', 'communicatie'], zone: 'Halve veld', keepers: { min: 1, max: 2 }, complexity: 3, reps: 6, rest: 60, duration: 15,
    coaching: ['Snel inschatten', 'Duidelijk organiseren', 'Actie afwerken'],
    mistakes: [F('Te lang nadenken', 'In een wedstrijd heb je enkele seconden.'), F('Enkel jezelf organiseren', 'Ook de spelers rond je sturen.')],
    variants: { easier: 'Drie bekende scenario\'s.', harder: 'Elk kaartje heeft ook een tijdsdruk.' },
    diagram: D('halfveld', [K(50, 8), S(36, 22, 'V'), S(64, 22, 'V'), A(50, 34, 'A'), T(80, 36), B(78, 35)], [pass(1, [77, 35], [56, 14]), run(2, [50, 8], [53, 12])])
  }),
  E({
    id: 'sr-wed-reeks-afsluiter', name: 'Wedstrijdreeks van tien acties',
    summary: 'Afsluitende reeks van tien gevarieerde wedstrijdacties die de keeper zonder pauze moet verwerken.',
    description: 'De trainer bouwt een reeks van tien acties: schot, voorzet, terugspeelbal, 1-tegen-1, hoge bal, afstandsschot, lage voorzet, inworp, scrimmage en strafschop. De keeper verwerkt ze na elkaar met korte pauzes. Elke goed verwerkte actie is een punt.',
    themes: ['wedstrijd', 'vangen'], zone: 'Strafschopgebied', trainers: 2, keepers: { min: 1, max: 2 }, intensity: 'hoog', divesPerRep: 0.4, explosive: true, blockTypes: ['afsluiting'], reps: 10, sets: 2, rest: 120, duration: 12,
    coaching: ['Elke actie volle focus', 'Snel resetten', 'Puntentelling bijhouden'],
    mistakes: [F('Verslappen op het einde', 'De laatste actie telt even zwaar.'), F('Techniek vergeten onder vermoeidheid', 'Liever trager en correct.')],
    variants: { easier: 'Zes acties.', harder: 'Twaalf acties zonder pauze.' },
    diagram: D('zestien', [K(50, 9), T(30, 34, 'T1'), T(80, 24, 'T2'), B(30, 31), B(78, 23)], [pass(1, [30, 30], [46, 12]), run(2, [50, 9], [52, 10]), pass(3, [77, 23], [56, 12])])
  }),
  E({
    id: 'sr-wed-ruststand-bespreken', name: 'Rust- en wisselmomenten gebruiken',
    summary: 'Tijdens een korte rust bekijkt de keeper samen met de trainer twee situaties en past hij zijn plan aan.',
    description: 'Een partijvorm van twee keer acht minuten. Tijdens de rust toont de trainer twee situaties met de tablet of op het bord: een goede actie en een twijfel. De keeper beschrijft wat hij zag en past zijn plan aan voor de tweede helft.',
    themes: ['wedstrijd', 'communicatie'], zone: 'Halve veld', levels: LV_ALL, ages: FROM13, keepers: { min: 1, max: 2 }, intensity: 'gemiddeld', complexity: 2, reps: 1, sets: 2, rest: 120, duration: 20,
    coaching: ['Eerlijk beschrijven', 'Eén aanpassing kiezen', 'Toepassen in de tweede helft'],
    mistakes: [F('Te veel aanpassingen', 'Eén aanpassing tegelijk.'), F('Niet luisteren', 'Vraag door bij de trainer.')],
    variants: { easier: 'Eén situatie.', harder: 'De keeper kiest zelf de situaties.' },
    diagram: D('halfveld', [K(50, 8), S(36, 24, 'V'), S(64, 24, 'V'), A(48, 36, 'A'), A(58, 38, 'A'), B(50, 34)], [pass(1, [50, 33], [52, 10])])
  }),
  E({
    id: 'sr-wed-tempo-wisseling', name: 'Spelritme lezen',
    summary: 'De keeper herkent wanneer het spel versnelt en past zijn positie en coaching aan.',
    description: 'In een partijvorm wisselt de trainer het tempo: twee minuten rustige balcirculatie, dan een fluitsignaal waarna het team van de tegenstander maximaal vijf seconden heeft om te scoren. De keeper moet de versnelling vroeg zien en zijn verdediging laten inzakken.',
    themes: ['wedstrijd', 'voetenwerk'], zone: 'Halve veld', keepers: { min: 1, max: 2 }, intensity: 'hoog', complexity: 3, reps: 1, sets: 4, rest: 60, duration: 12,
    coaching: ['Signalen van versnelling', 'Positie aanpassen', 'Team laten inzakken'],
    mistakes: [F('Te hoog bij een versnelling', 'Zak terug naar de goede diepte.'), F('Te laat coachen', 'Coach bij het eerste signaal.')],
    variants: { easier: 'Tien seconden om te scoren.', harder: 'Drie seconden om te scoren.' },
    diagram: D('halfveld', [K(50, 14), S(36, 24, 'V'), S(64, 24, 'V'), A(44, 40, 'A'), A(60, 42, 'A'), B(46, 38)], [drib(1, [46, 38], [48, 26]), run(2, [50, 14], [50, 9])])
  }),
  E({
    id: 'sr-wed-standaardsituaties-mix', name: 'Mix van standaardsituaties',
    summary: 'Hoekschoppen, vrije trappen en lange inworpen volgen elkaar snel op, zoals in de slotfase van een wedstrijd.',
    description: 'De trainer wisselt willekeurig tussen hoekschop links, hoekschop rechts, vrije trap op de flank en een lange inworp. De keeper organiseert telkens binnen tien seconden en verdedigt de bal. Na tien situaties wisselen de keepers.',
    themes: ['wedstrijd', 'hogeballen'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, intensity: 'gemiddeld', complexity: 3, reps: 10, rest: 30, duration: 15,
    coaching: ['Binnen tien seconden georganiseerd', 'Elke situatie zijn plan', 'Duidelijk "keeper" of "weg"'],
    mistakes: [F('Telkens hetzelfde plan', 'Een inworp vraagt een andere opstelling dan een hoekschop.'), F('Te laat klaar', 'Eerst de opstelling, dan je eigen positie.')],
    variants: { easier: 'Enkel hoekschoppen.', harder: 'Met korte varianten en tweede ballen.' },
    diagram: D('zestien', [K(48, 8), S(44, 16, 'V'), S(56, 16, 'V'), A(50, 22, 'A'), A(60, 20, 'A'), T(98, 20), B(96, 20)], [pass(1, [95, 20], [70, 8], [52, 12]), run(2, [48, 8], [51, 11])])
  }),
  E({
    id: 'sr-wed-cooling-down', name: 'Cooling-down na de wedstrijd',
    summary: 'Rustige afsluiting na een zware training of wedstrijd met uitlopen, stretching en korte reflectie.',
    description: 'De keeper loopt vijf minuten rustig uit, met af en toe een zijwaartse pas. Daarna volgt vijf minuten stretching van heupen, liezen, schouders en polsen. Tot slot benoemt hij één actie waar hij trots op is en één werkpunt.',
    themes: ['wedstrijd', 'voetenwerk'], zone: '30 × 20 m', levels: LV_ALL, ages: FROM13, keepers: { min: 1, max: 6 }, intensity: 'laag', blockTypes: ['afsluiting'], complexity: 1, duration: 10, sets: 1, reps: 1, rest: 0, materials: ['pionnen'],
    coaching: ['Rustig tempo', 'Lang aanhouden bij stretching', 'Positief afsluiten'],
    mistakes: [F('Overslaan', 'Herstel begint meteen na de inspanning.'), F('Verend stretchen', 'Rustig aanhouden, niet veren.')],
    variants: { easier: 'Enkel uitlopen.', harder: 'Met foamroller.' },
    diagram: D('vrij', [K(20, 36), C(20, 20), C(80, 20), C(80, 52), C(20, 52)], [run(1, [20, 36], [20, 20], [80, 20], [80, 52], [20, 52])])
  }),
  E({
    id: 'sr-wed-mentale-visualisatie', name: 'Visualisatie voor de wedstrijd',
    summary: 'De keeper beeldt zich drie typische wedstrijdacties in en voert ze daarna aan halve snelheid uit.',
    description: 'De keeper sluit de ogen en beeldt zich in hoe hij een hoge voorzet vangt, een 1-tegen-1 wint en een lange bal opbouwt. Daarna voert hij elke actie aan halve snelheid uit met de trainer. Tot slot volgt elke actie één keer op volle snelheid.',
    themes: ['wedstrijd', 'hogeballen'], zone: 'Strafschopgebied', levels: LV_ALL, ages: FROM13, intensity: 'laag', blockTypes: ['opwarming', 'afsluiting'], warmup: ['balgewenning'], complexity: 1, duration: 8, sets: 1, reps: 3, rest: 30,
    coaching: ['Rustig ademen', 'Zie het in detail', 'Eerst traag, dan volle snelheid'],
    mistakes: [F('Te snel overgaan', 'Neem de tijd voor elk beeld.'), F('Negatieve beelden', 'Zie de actie slagen.')],
    variants: { easier: 'Eén actie.', harder: 'Met wedstrijdspecifieke situaties van de tegenstander.' },
    diagram: D('zestien', [K(50, 9), T(86, 26), B(84, 25)], [pass(1, [83, 25], [62, 6], [52, 12]), run(2, [50, 9], [52, 12])])
  })
];
