// Seniorenuitbreiding deel B: hoge ballen, 1-tegen-1 en reflexen (vooral senioren, gevorderd niveau).
import { E, F, D, K, T, S, A, B, C, H, LAD, HD, MG, RB, run, pass, drib, ALL, FROM13, FROM16, SEN, LV_ALL, LV_ADV, LV_MID, GEV } from './senior-helpers.mjs';

export default [
  // ---------------- Hoge ballen en kruisballen ----------------
  E({
    id: 'sr-hoog-voorzet-tweede-paal', name: 'Voorzet naar de tweede paal onderscheppen',
    summary: 'Hoge voorzetten richting tweede paal worden onderschept met een korte aanloop en een afzet op één been.',
    description: 'De trainer geeft vanaf de rechterflank hoge voorzetten naar de tweede paal. De keeper start aan de eerste paal, leest het traject, verplaatst met een kruispas en vangt de bal op het hoogste punt. Na vijf voorzetten wisselt de flank.',
    themes: ['hogeballen'], zone: 'Strafschopgebied', reps: 5, rest: 60,
    coaching: ['Traject lezen voor je vertrekt', 'Afzet op het binnenbeen', 'Vangen op het hoogste punt'],
    mistakes: [F('Te vroeg vertrekken', 'Wacht tot de bal zijn hoogste punt bereikt.'), F('Vangen achter het hoofd', 'Kom naar de bal zodat je hem voor je ogen pakt.')],
    variants: { easier: 'Geworpen voorzetten vanaf 15 meter.', harder: 'Een aanvaller loopt in naar de tweede paal.' },
    diagram: D('zestien', [K(46, 8), T(90, 28), B(88, 26)], [pass(1, [87, 26], [70, 6], [57, 12]), run(2, [46, 8], [56, 12])])
  }),
  E({
    id: 'sr-hoog-hoekschop-druk', name: 'Hoekschop met druk op de keeper',
    summary: 'Hoekschoppen met een aanvaller die de keeper hindert, zodat hij leert vangen of stompen met contact.',
    description: 'De trainer neemt hoekschoppen. Eén aanvaller staat vlak voor de keeper en mag licht duwen. Twee andere aanvallers lopen in. De keeper roept duidelijk "keeper" en kiest tussen vangen en stompen. Na elke actie start het spel snel opnieuw.',
    themes: ['hogeballen', 'communicatie'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, intensity: 'hoog', reps: 6, rest: 60,
    coaching: ['Luid "keeper" roepen', 'Knie omhoog bij contact', 'Twijfel = stompen'],
    mistakes: [F('Stil blijven bij contact', 'Neem je ruimte met een duidelijke aanloop.'), F('Halve stomp', 'Stomp hoog en ver, weg van het doel.')],
    variants: { easier: 'Zonder lichamelijk contact.', harder: 'Drie aanvallers en twee verdedigers op het doelgebied.' },
    diagram: D('zestien', [K(48, 8), A(50, 11, 'A'), A(58, 22, 'A'), A(40, 24, 'A'), T(98, 4), B(96, 5)], [pass(1, [95, 6], [72, 2], [52, 10]), run(2, [48, 8], [51, 10])])
  }),
  E({
    id: 'sr-hoog-stomp-twee-vuisten', name: 'Tweehandig stompen bij frontale ballen',
    summary: 'Frontale hoge ballen worden met twee vuisten hoog en ver teruggestompt.',
    description: 'De trainer werpt of chipt vanop 12 meter hoge ballen recht op de keeper. Een medespeler hindert licht. De keeper komt een stap uit, maakt twee vuisten met de duimen naast elkaar en stompt de bal hoog en ver terug naar de zone voor het strafschopgebied.',
    themes: ['hogeballen'], levels: LV_ALL, ages: FROM13, reps: 8, rest: 45,
    coaching: ['Vuisten samen, duimen naast elkaar', 'Door de bal stompen', 'Hoog en ver terug'],
    mistakes: [F('Ellebogen open', 'Ellebogen naar elkaar, vuisten vormen één vlak.'), F('Kort stompen', 'Strek de armen door de bal.')],
    variants: { easier: 'Bal aan een touw of een zachte worp.', harder: 'Stompen naar een pion op 20 meter.' },
    diagram: D('zestien', [K(50, 10), S(52, 14, 'S'), T(50, 32), B(50, 29)], [pass(1, [50, 28], [50, 14], [50, 12]), pass(2, [50, 12], [50, 30], [44, 40])])
  }),
  E({
    id: 'sr-hoog-stomp-eenhand-verder', name: 'Eenhandig verder stompen',
    summary: 'Ballen die voor het doel voorbijgaan, worden met één vuist in de looprichting verder gestompt.',
    description: 'De trainer geeft voorzetten die vlak voor het doel van links naar rechts gaan. De keeper loopt mee en stompt de bal met de verste vuist verder in de looprichting, richting de zijlijn. Wisselen van kant na elke reeks.',
    themes: ['hogeballen'], zone: 'Strafschopgebied', reps: 6, rest: 60,
    coaching: ['Verste vuist gebruiken', 'In de looprichting stompen', 'Bal naar de zijlijn'],
    mistakes: [F('Terugstompen naar het midden', 'Speel mee met de bal naar de zijkant.'), F('Te laat vertrekken', 'Start zodra je ziet dat de bal voorbij gaat.')],
    variants: { easier: 'Geworpen ballen.', harder: 'Met een aanvaller die op dezelfde bal komt.' },
    diagram: D('zestien', [K(44, 8), T(12, 26), B(14, 25)], [pass(1, [15, 25], [40, 6], [56, 12]), run(2, [44, 8], [55, 12]), pass(3, [56, 12], [80, 20], [92, 26])])
  }),
  E({
    id: 'sr-hoog-diepe-voorzet-loopweg', name: 'Diepe voorzet uit de loop',
    summary: 'Voorzetten vanaf de achterlijn komen terug naar de penaltystip en de keeper beslist om uit te komen of te blijven.',
    description: 'Een medespeler dribbelt naar de achterlijn en trekt de bal terug of geeft een hoge voorzet naar de penaltystip. Twee aanvallers lopen in. De keeper beslist: uitkomen en vangen, of blijven en zich klaarzetten voor het afwerkingsschot.',
    themes: ['hogeballen', 'communicatie'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, intensity: 'hoog', reps: 6, rest: 75,
    coaching: ['Beslissing vroeg roepen', 'Uitkomen = volledig doorgaan', 'Blijven = klaar voor het schot'],
    mistakes: [F('Halverwege stoppen', 'Een keuze maken en die afwerken.'), F('Te diep bij een teruggetrokken bal', 'Stap naar voren om de hoek te verkleinen.')],
    variants: { easier: 'Zonder aanvallers.', harder: 'De medespeler kiest tussen voorzet en zelf schieten.' },
    diagram: D('zestien', [K(46, 8), S(80, 10, 'S'), A(56, 30, 'A'), A(44, 32, 'A'), B(78, 11)], [drib(1, [80, 14], [84, 6]), pass(2, [82, 6], [62, 20], [52, 26]), run(3, [46, 8], [50, 18])])
  }),
  E({
    id: 'sr-hoog-uitkomen-onderscheppen-pass', name: 'Uitkomen en meteen uitspelen',
    summary: 'De keeper vangt een voorzet en zet meteen een snelle aanval op met een worp of een uittrap.',
    description: 'Na een voorzet vanaf links vangt de keeper de bal. Twee medespelers lopen meteen weg naar de flanken. De keeper kiest binnen drie seconden een worp naar de vrije speler of een volley naar een verre zone. Daarna begint de volgende voorzet.',
    themes: ['hogeballen', 'distributie'], zone: 'Halve veld', keepers: { min: 1, max: 2 }, reps: 6, rest: 60,
    coaching: ['Eerst vast vangen', 'Kijk meteen op', 'Binnen drie seconden spelen'],
    mistakes: [F('Te lang wachten', 'De snelle tegenaanval is weg na enkele seconden.'), F('Onnauwkeurige worp', 'Werp in de loop van de speler, niet naar zijn voeten.')],
    variants: { easier: 'Eén vaste ontvanger.', harder: 'Een verdediger dekt een van de twee spelers.' },
    diagram: D('halfveld', [K(50, 6), T(12, 20), S(20, 40, 'S'), S(80, 40, 'S'), B(14, 19)], [pass(1, [15, 19], [40, 4], [50, 9]), run(2, [20, 40], [14, 54]), pass(3, [50, 9], [78, 30], [86, 50])])
  }),
  E({
    id: 'sr-hoog-wind-varianten', name: 'Hoge ballen met effect',
    summary: 'Voorzetten met in- en uitdraaiend effect leren de keeper het traject laat bijsturen.',
    description: 'De trainer geeft afwisselend inswingende en uitswingende voorzetten vanaf de flank. De keeper benoemt na elke bal het effect en vangt de bal op het hoogste punt. Bij een inswinger blijft hij dichter bij zijn doel, bij een uitswinger komt hij verder uit.',
    themes: ['hogeballen'], zone: 'Strafschopgebied', levels: GEV, reps: 8, rest: 45,
    coaching: ['Effect vroeg herkennen', 'Inswinger: dicht bij het doel', 'Uitswinger: verder uitkomen'],
    mistakes: [F('Vaste aanloop', 'Pas de aanloop aan het effect aan.'), F('Bal tegen de lat laten afdraaien', 'Bij een inswinger aan de tweede paal vaker stompen of tikken.')],
    variants: { easier: 'Enkel ballen zonder effect.', harder: 'De trainer wisselt de voet zonder aankondiging.' },
    diagram: D('zestien', [K(48, 8), T(92, 22), B(90, 21)], [pass(1, [89, 21], [66, 4], [52, 10]), run(2, [48, 8], [51, 10])])
  }),
  E({
    id: 'sr-hoog-uitkomen-tweede-bal', name: 'Stompen en de tweede bal verdedigen',
    summary: 'Na een stomp verdedigt de keeper meteen zijn doel tegen het afstandsschot op de tweede bal.',
    description: 'Trainer 1 geeft een hoge voorzet, de keeper stompt de bal weg. Trainer 2 staat aan de rand van het strafschopgebied met een tweede bal en schiet meteen na de stomp. De keeper landt, keert terug naar zijn positie en redt het schot.',
    themes: ['hogeballen', 'reflexen'], trainers: 2, zone: 'Strafschopgebied', intensity: 'hoog', divesPerRep: 0.5, explosive: true, reps: 5, rest: 90,
    coaching: ['Stomp hoog en breed', 'Snel terug naar de positie', 'Basishouding vóór het schot'],
    mistakes: [F('Kijken naar de gestompte bal', 'Na de stomp kijk je meteen naar de volgende dreiging.'), F('Te ver uit bij het schot', 'Zak terug naar je goede diepte.')],
    variants: { easier: 'Het schot volgt na twee seconden.', harder: 'Schot of chip, de trainer beslist.' },
    diagram: D('zestien', [K(48, 8), T(10, 24, 'T1'), T(50, 40, 'T2'), B(12, 23), B(50, 37)], [pass(1, [13, 23], [40, 4], [50, 11]), pass(2, [50, 11], [62, 24]), pass(3, [50, 36], [46, 12])])
  }),
  E({
    id: 'sr-hoog-vangen-tussen-spelers', name: 'Vangen in een druk doelgebied',
    summary: 'Hoge ballen in een doelgebied met vier spelers, zodat de keeper zijn baan door de drukte leert vinden.',
    description: 'Vier spelers staan verspreid in het doelgebied, zonder actief te springen. De trainer werpt of chipt hoge ballen naar verschillende plekken. De keeper zoekt een vrije baan, roept en vangt. Daarna gaan twee spelers actief mee springen.',
    themes: ['hogeballen', 'communicatie'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, levels: LV_ALL, ages: FROM13, reps: 8, rest: 45,
    coaching: ['Baan zoeken door de drukte', 'Roepen voor je vertrekt', 'Knie omhoog'],
    mistakes: [F('Wachten tot de bal komt', 'Vertrek op tijd zodat je eerst bij de bal bent.'), F('Niet roepen', 'Luid en vroeg roepen.')],
    variants: { easier: 'Twee passieve spelers.', harder: 'Vier actieve spelers en een voorzet vanaf de flank.' },
    diagram: D('zestien', [K(50, 8), S(42, 12), S(58, 12), A(46, 16), A(56, 18), T(50, 34), B(50, 31)], [pass(1, [50, 30], [50, 18], [54, 12]), run(2, [50, 8], [53, 11])])
  }),
  E({
    id: 'sr-hoog-terugtrekken-lat', name: 'Lob over de keeper: terug en tikken',
    summary: 'Een lob vanop 20 meter wordt met een kruispas terug over de lat getikt.',
    description: 'De keeper staat op 5 meter van zijn doellijn. De trainer lobt de bal vanop 20 meter. De keeper draait de heup, loopt met kruispassen terug en tikt de bal met de verste hand over de lat. Landen gebeurt gecontroleerd, eventueel met een rol achterover.',
    themes: ['hogeballen', 'voetenwerk'], zone: 'Strafschopgebied', intensity: 'hoog', explosive: true, reps: 5, rest: 90,
    coaching: ['Heup draaien, kruispas', 'Afzet op één been', 'Verste hand tikt'],
    mistakes: [F('Achteruit lopen zonder draai', 'Draai zijwaarts voor een snellere en veiligere terugloop.'), F('Tegen de lat tikken', 'Duw de bal mee omhoog en naar achteren.')],
    variants: { easier: 'Start op 3 meter van de lijn.', harder: 'Na een eerste bal naar voren volgt de lob.' },
    diagram: D('zestien', [K(50, 14), T(50, 44), B(50, 40)], [pass(1, [50, 39], [50, 12], [50, 4]), run(2, [50, 14], [50, 6])])
  }),
  E({
    id: 'sr-hoog-hoekschop-zone', name: 'Hoekschop met zonetoewijzing',
    summary: 'De keeper organiseert de zones bij een hoekschop en verdedigt de ruimte tussen doellijn en penaltystip.',
    description: 'Vier verdedigers staan zonaal, twee aan de palen. De trainer neemt hoekschoppen, vier aanvallers lopen in. De keeper wijst vooraf de zones toe, roept tijdens de bal "keeper" of "weg" en pakt alles wat in het doelgebied valt.',
    themes: ['hogeballen', 'communicatie', 'wedstrijd'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, trainers: 1, intensity: 'gemiddeld', complexity: 3, reps: 6, rest: 60,
    coaching: ['Zones vooraf afspreken', 'Doelgebied is van de keeper', 'Kort en luid coachen'],
    mistakes: [F('Verdedigers op de lijn laten staan', 'Stuur ze naar hun zone, de keeper dekt de lijn.'), F('Te laat roepen', 'Roep zodra je beslist hebt.')],
    variants: { easier: 'Twee aanvallers.', harder: 'Korte hoekschoppen mogen ook.' },
    diagram: D('zestien', [K(48, 8), S(43, 5, 'V'), S(57, 5, 'V'), S(46, 14, 'V'), S(56, 16, 'V'), A(50, 24, 'A'), A(60, 22, 'A'), T(98, 4), B(96, 5)], [pass(1, [95, 6], [70, 4], [54, 14]), run(2, [48, 8], [53, 13])])
  }),
  E({
    id: 'sr-hoog-vrije-trap-zijkant', name: 'Vrije trap vanaf de zijkant',
    summary: 'Een vrije trap vanaf de flank wordt in de ruimte tussen verdediging en keeper getrapt.',
    description: 'De trainer neemt vrije trappen vanaf 25 meter op de flank. Een verdedigingslijn staat op 13 meter, aanvallers lopen in. De keeper beslist op basis van het traject: uitkomen voor de verdedigingslijn, of blijven voor een kopbal. De verdedigers spelen actief mee.',
    themes: ['hogeballen', 'wedstrijd'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, complexity: 3, reps: 6, rest: 60,
    coaching: ['Positie aan de verre kant', 'Traject vroeg lezen', 'Duidelijke keuze maken'],
    mistakes: [F('Te dicht bij de korte paal', 'Neem iets meer ruimte naar de verre kant.'), F('Op de lijn blijven bij een bal in de ruimte', 'Kom uit als de bal tussen lijn en verdediging valt.')],
    variants: { easier: 'Zonder aanvallers.', harder: 'De trainer mag ook rechtstreeks op doel trappen.' },
    diagram: D('zestien', [K(48, 8), S(30, 26, 'V'), S(42, 26, 'V'), S(54, 26, 'V'), A(36, 30, 'A'), A(50, 30, 'A'), T(88, 44), B(86, 42)], [pass(1, [85, 42], [62, 16], [54, 14]), run(2, [48, 8], [52, 13])])
  }),
  E({
    id: 'sr-hoog-afsluit-spel-hoofd', name: 'Kopbalspel tegen de keeper',
    summary: 'Afsluitend spel waarin spelers proberen te scoren met een kopbal uit een voorzet en de keeper alles verdedigt.',
    description: 'Twee teams van twee spelers. De trainer geeft voorzetten, enkel kopbaldoelpunten tellen. De keeper telt een punt voor elke gevangen voorzet en elk gestopt kopschot. Na tien voorzetten wisselen de keepers.',
    themes: ['hogeballen', 'wedstrijd'], zone: 'Strafschopgebied', levels: LV_ALL, ages: FROM13, keepers: { min: 1, max: 3 }, blockTypes: ['afsluiting'], duration: 12, sets: 1, reps: 10, rest: 0,
    coaching: ['Plezier en volle inzet', 'Alles wat je pakt, pak je vast', 'Blijf praten'],
    mistakes: [F('Te passief', 'Durven uitkomen, ook in een spel.'), F('Niet coachen', 'Praat met de spelers, ook al zijn het tegenstanders.')],
    variants: { easier: 'Voorzetten geworpen.', harder: 'Ook volleys tellen.' },
    diagram: D('zestien', [K(50, 8), A(44, 22, 'A'), A(56, 24, 'A'), T(90, 26), B(88, 25)], [pass(1, [87, 25], [66, 8], [54, 14]), run(2, [50, 8], [53, 12])])
  }),
  E({
    id: 'sr-hoog-landing-veilig', name: 'Veilig landen na een hoge bal',
    summary: 'Techniekoefening voor de landing: na het vangen op het hoogste punt landt de keeper op één been en beschermt hij de bal.',
    description: 'De trainer werpt hoge ballen op 6 meter. De keeper zet af, vangt, trekt de bal naar de borst en landt eerst op het afzetbeen, dan op het andere been. Bij een duw van een medespeler rolt hij gecontroleerd over de schouder af.',
    themes: ['hogeballen', 'duiken'], levels: LV_ALL, ages: FROM13, intensity: 'laag', divesPerRep: 0.3, reps: 8, rest: 45,
    coaching: ['Bal naar de borst', 'Landen op het afzetbeen', 'Afrollen bij contact'],
    mistakes: [F('Landen met gestrekte benen', 'Knieën buigen om de schok op te vangen.'), F('Bal los bij de landing', 'Klem de bal tegen de borst voor je landt.')],
    variants: { easier: 'Zonder sprong.', harder: 'Met een duw met een stootkussen.' },
    diagram: D('doel', [K(50, 14), S(55, 16, 'S'), T(50, 38), B(50, 35)], [pass(1, [50, 34], [50, 20], [50, 16]), run(2, [50, 14], [50, 17])])
  }),
  E({
    id: 'sr-hoog-voorzet-laag-scherp', name: 'Scherpe lage voorzet',
    summary: 'Lage, harde voorzetten tussen keeper en verdedigers worden onderschept of afgeweerd.',
    description: 'De trainer speelt vanaf de flank harde lage voorzetten tussen doellijn en penaltystip. Een aanvaller loopt in aan de eerste paal. De keeper staat een stap uit zijn doel, leest de pass en onderschept met een duik of zet zich klaar voor de afwerking.',
    themes: ['hogeballen', 'duiken'], zone: 'Strafschopgebied', intensity: 'hoog', divesPerRep: 0.5, explosive: true, reps: 6, rest: 75,
    coaching: ['Een stap uit het doel', 'Onderscheppen als het kan', 'Anders klaar voor het schot'],
    mistakes: [F('Op de lijn blijven', 'Een stap uit maakt onderscheppen mogelijk.'), F('Bal naar het midden afweren', 'Weer af naar de zijkant.')],
    variants: { easier: 'Zonder aanvaller.', harder: 'Twee aanvallers op eerste en tweede paal.' },
    diagram: D('zestien', [K(48, 9), A(42, 18, 'A'), T(86, 20), B(84, 20)], [pass(1, [83, 20], [44, 14]), run(2, [48, 9], [46, 13])])
  }),
  E({
    id: 'sr-hoog-zone-vak-oefening', name: 'Vangen in drie zones',
    summary: 'De trainer gooit hoge ballen naar drie zones voor het doel en de keeper moet elke zone in de juiste aanloop bereiken.',
    description: 'Drie zones zijn met pionnen aangeduid: eerste paal, midden en tweede paal, op 5 tot 7 meter van de lijn. De trainer werpt hoge ballen naar een zone die hij vooraf niet zegt. De keeper vertrekt vanuit het midden, kiest de juiste aanloop en vangt.',
    themes: ['hogeballen', 'voetenwerk'], materials: ['ballen', 'pionnen'], zone: 'Strafschopgebied', levels: LV_ALL, ages: FROM13, reps: 9, rest: 45,
    coaching: ['Vertrekken vanuit het midden', 'Aanloop aanpassen per zone', 'Vangen op het hoogste punt'],
    mistakes: [F('Altijd dezelfde aanloop', 'Bijzetpas, kruispas of korte sprint afhankelijk van de zone.'), F('Te laat afzetten', 'Afzetten net voor de bal zijn hoogste punt bereikt.')],
    variants: { easier: 'De trainer zegt de zone vooraf.', harder: 'Een aanvaller zet druk in een van de zones.' },
    diagram: D('zestien', [K(50, 8), C(42, 14, '1'), C(50, 16, '2'), C(58, 14, '3'), T(50, 40), B(50, 37)], [pass(1, [50, 36], [56, 20], [58, 15]), run(2, [50, 8], [57, 13])])
  }),

  // ---------------- 1-tegen-1 en uitkomen ----------------
  E({
    id: 'sr-1t1-blok-spreid', name: 'Spreidblok bij een korte afstand',
    summary: 'Bij een aanvaller op 5 meter maakt de keeper een spreidblok om zoveel mogelijk doel af te dekken.',
    description: 'De aanvaller start op 12 meter en dribbelt naar het doel. De keeper komt uit en stopt op 4 à 5 meter van de bal. Als de aanvaller schiet, maakt hij een spreidblok: één knie naar de grond, het andere been zijwaarts gestrekt en de armen breed.',
    themes: ['eentegeneen'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, intensity: 'hoog', divesPerRep: 0.5, explosive: true, reps: 6, rest: 75,
    coaching: ['Op tijd stoppen', 'Groot blijven tot het schot', 'Armen en been breed'],
    mistakes: [F('Te vroeg naar de grond', 'Blijf staan tot de aanvaller schiet.'), F('Gat tussen arm en been', 'Hand naast de knie, geen opening.')],
    variants: { easier: 'De aanvaller dribbelt traag en schiet altijd.', harder: 'De aanvaller mag ook omspelen.' },
    diagram: D('zestien', [K(50, 9), A(50, 32, 'A'), B(50, 29)], [drib(1, [50, 29], [50, 20]), run(2, [50, 9], [50, 15])])
  }),
  E({
    id: 'sr-1t1-sterke-kant-sturen', name: 'De aanvaller naar de zijkant sturen',
    summary: 'De keeper positioneert zich zo dat de aanvaller naar de zijkant wordt gestuurd, weg van het midden.',
    description: 'De aanvaller start schuin op 18 meter en dribbelt richting doel. De keeper komt uit en zet zijn lichaam iets naar de binnenkant, zodat de aanvaller naar de buitenkant moet. Een doelpunt via de buitenkant telt één punt, via de binnenkant drie.',
    themes: ['eentegeneen', 'voetenwerk'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, intensity: 'hoog', divesPerRep: 0.5, explosive: true, reps: 6, rest: 75,
    coaching: ['Binnenkant afschermen', 'Gebogen knieën, klaar om te gaan', 'Geduld, niet te vroeg gaan'],
    mistakes: [F('Recht voor de aanvaller staan', 'Een halve meter naar binnen dwingt hem naar buiten.'), F('Te vroeg gaan liggen', 'Laat de aanvaller de eerste beslissing nemen.')],
    variants: { easier: 'De aanvaller moet langs de buitenkant.', harder: 'Een verdediger zet druk van achteren.' },
    diagram: D('zestien', [K(50, 9), A(72, 34, 'A'), B(70, 31)], [drib(1, [70, 31], [62, 20]), run(2, [50, 9], [52, 15])])
  }),
  E({
    id: 'sr-1t1-steekbal-uitkomen', name: 'Steekbal en vrije doorbraak',
    summary: 'Na een steekbal komt een aanvaller vrij voor de keeper, die het moment van uitkomen en blokken kiest.',
    description: 'Een middenvelder speelt van op 35 meter een steekbal achter een verdediger. De aanvaller loopt door, de verdediger achtervolgt. De keeper beslist: onderscheppen, uitkomen tot vlak voor de aanvaller of afwachten en blokken. Het spel stopt na een doelpunt, redding of balverlies.',
    themes: ['eentegeneen'], zone: 'Halve veld', keepers: { min: 1, max: 2 }, intensity: 'hoog', divesPerRep: 0.5, explosive: true, complexity: 3, reps: 6, rest: 90,
    coaching: ['Lees de steekbal vroeg', 'Verkort de afstand bij balcontact', 'Stop bij de schotkans'],
    mistakes: [F('Uitkomen wanneer de aanvaller de bal dicht bij heeft', 'Kom uit als de bal van zijn voet is.'), F('Op de lijn blijven', 'Elke meter naar voren maakt het doel kleiner.')],
    variants: { easier: 'Zonder verdediger.', harder: 'Twee aanvallers tegen één verdediger.' },
    diagram: D('halfveld', [K(50, 6), S(50, 58, 'M'), A(42, 36, 'A'), S(52, 34, 'V'), B(50, 54)], [pass(1, [50, 53], [44, 24]), run(2, [42, 36], [44, 24]), run(3, [50, 6], [48, 16])])
  }),
  E({
    id: 'sr-1t1-omspelen-voorkomen', name: 'Omspelen voorkomen',
    summary: 'De aanvaller wil de keeper omspelen en de keeper leert de bal te pakken of de aanvaller te vertragen.',
    description: 'De aanvaller start op 10 meter en mag niet schieten, enkel omspelen. De keeper wacht op het moment dat de bal van de voet is en duikt dan naar de bal of blijft groot staan om de aanvaller naar de zijkant te dwingen. Een doelpunt is pas geldig als de bal over de lijn wordt gedribbeld.',
    themes: ['eentegeneen', 'duiken'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, intensity: 'hoog', divesPerRep: 0.5, explosive: true, reps: 6, rest: 75,
    coaching: ['Bal volgen, niet de voeten', 'Duik als de bal los is', 'Groot blijven, niet gokken'],
    mistakes: [F('Reageren op de schijnbeweging', 'Kijk naar de bal, niet naar het lichaam.'), F('Te ver weg blijven', 'Een korte afstand geeft de aanvaller minder ruimte.')],
    variants: { easier: 'De aanvaller dribbelt aan halve snelheid.', harder: 'De aanvaller mag ook schieten.' },
    diagram: D('zestien', [K(50, 9), A(50, 28, 'A'), B(50, 25)], [drib(1, [50, 25], [58, 16], [56, 8]), run(2, [50, 9], [54, 14])])
  }),
  E({
    id: 'sr-1t1-twee-tegen-keeper', name: 'Twee aanvallers tegen de keeper',
    summary: 'Twee aanvallers combineren voor het doel en de keeper moet zowel de balbezitter als de pass verdedigen.',
    description: 'Twee aanvallers starten op 25 meter met één bal. Ze combineren en proberen te scoren. De keeper positioneert zich tussen bal en doel, maar blijft bewust van de pass. Bij een pass schuift hij mee met kleine passen en blokt of redt.',
    themes: ['eentegeneen', 'voetenwerk'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, intensity: 'hoog', divesPerRep: 0.5, explosive: true, complexity: 3, reps: 6, rest: 90,
    coaching: ['Balbezitter eerst', 'Meeschuiven bij een pass', 'Niet te vroeg kiezen'],
    mistakes: [F('Naar de vrije speler kijken', 'De balbezitter is het eerste gevaar.'), F('Te ver uit bij een pass', 'Een stap terug geeft tijd om bij te sturen.')],
    variants: { easier: 'De aanvallers mogen maar één pass geven.', harder: 'Een verdediger loopt mee terug.' },
    diagram: D('zestien', [K(50, 9), A(40, 40, 'A1'), A(62, 40, 'A2'), B(40, 37)], [drib(1, [40, 37], [44, 26]), pass(2, [44, 25], [58, 22]), run(3, [48, 12], [54, 12])])
  }),
  E({
    id: 'sr-1t1-uitkomen-borsthoogte', name: 'Uitkomen op een bal op borsthoogte',
    summary: 'Een bal die opspringt voor de aanvaller wordt met een uitkomende sprong en een veilige vangst onderschept.',
    description: 'De trainer speelt de bal zo dat hij stuitert tussen keeper en aanvaller. De aanvaller loopt naar de bal. De keeper komt uit en vangt de bal op borsthoogte vóór de aanvaller, met de knie omhoog als bescherming.',
    themes: ['eentegeneen', 'vangen'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, intensity: 'hoog', reps: 6, rest: 75,
    coaching: ['Vroeg vertrekken', 'Knie omhoog bij contact', 'Bal vast tegen de borst'],
    mistakes: [F('Wachten tot de bal laag is', 'Pak hem op de hoogste plek die je kan halen.'), F('Botsen zonder bescherming', 'Knie en schouder vangen het contact op.')],
    variants: { easier: 'Zonder aanvaller.', harder: 'De aanvaller start dichter bij de bal.' },
    diagram: D('zestien', [K(50, 9), A(56, 34, 'A'), T(50, 50), B(50, 46)], [pass(1, [50, 45], [50, 22]), run(2, [50, 9], [50, 20]), run(3, [56, 34], [52, 24])])
  }),
  E({
    id: 'sr-1t1-hoek-aanval', name: 'Doorbraak vanuit de hoek',
    summary: 'Een aanvaller komt vanuit de zijkant van het strafschopgebied en de keeper sluit de korte paal en bewaakt de pass.',
    description: 'De aanvaller dribbelt vanaf de achterlijn schuin naar het doel. Een tweede aanvaller loopt in aan de tweede paal. De keeper sluit eerst de korte paal, komt dan uit als de hoek kleiner wordt en blijft alert op de pass naar de tweede paal.',
    themes: ['eentegeneen'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, intensity: 'hoog', divesPerRep: 0.5, explosive: true, reps: 6, rest: 75,
    coaching: ['Korte paal eerst', 'Uitkomen als de hoek kleiner wordt', 'Pass naar de tweede paal'],
    mistakes: [F('Korte paal open', 'Sta tegen de paal tot de aanvaller dichterbij is.'), F('Te ver uit', 'Blijf binnen bereik van de pass.')],
    variants: { easier: 'Zonder tweede aanvaller.', harder: 'Een verdediger loopt mee met de tweede aanvaller.' },
    diagram: D('zestien', [K(44, 7), A(18, 12, 'A1'), A(62, 22, 'A2'), B(20, 13)], [drib(1, [20, 13], [34, 10]), run(2, [44, 7], [40, 9]), pass(3, [34, 10], [58, 10])])
  }),
  E({
    id: 'sr-1t1-tempo-wisselen', name: 'Afwachten en versnellen',
    summary: 'De keeper leert het tempo te wisselen: rustig naar voren bij een gecontroleerde aanvaller, versnellen bij een slechte aanname.',
    description: 'Een trainer speelt de bal naar een aanvaller op 22 meter. Neemt de aanvaller goed aan, dan komt de keeper rustig enkele meters uit. Is de aanname slecht, dan sprint de keeper uit en pakt hij de bal of trapt hij hem weg. Daarna volgt een 1-tegen-1.',
    themes: ['eentegeneen', 'voetenwerk'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, intensity: 'hoog', explosive: true, reps: 6, rest: 75,
    coaching: ['Aanname lezen', 'Versnellen bij een slechte aanname', 'Stoppen voor het schot'],
    mistakes: [F('Altijd even snel uitkomen', 'De aanname bepaalt jouw tempo.'), F('Doorlopen tijdens het schot', 'Stop en sta groot.')],
    variants: { easier: 'De trainer zegt of de aanname goed of slecht is.', harder: 'De aanvaller kan de aanname bewust lang maken.' },
    diagram: D('zestien', [K(50, 9), A(50, 44, 'A'), T(30, 60), B(32, 58)], [pass(1, [33, 57], [49, 45]), run(2, [50, 9], [50, 22])])
  }),
  E({
    id: 'sr-1t1-blok-duik-voet', name: 'Voetblok met de onderarm',
    summary: 'Bij een schot van dichtbij gebruikt de keeper zijn onderarm en het been als één muur.',
    description: 'De aanvaller staat op 6 meter en schiet na een korte aanname. De keeper staat op 3 meter van de bal en maakt een blok op de zijkant, onderarm en been naast elkaar. De bal mag niet tussen arm en been door.',
    themes: ['eentegeneen', 'duiken'], zone: 'Strafschopgebied', levels: GEV, keepers: { min: 1, max: 2 }, intensity: 'hoog', divesPerRep: 1, explosive: true, reps: 6, rest: 75,
    coaching: ['Onderarm naast het been', 'Ogen open naar de bal', 'Blokken, niet duiken'],
    mistakes: [F('Hoofd wegdraaien', 'Kijk door, het blok werkt enkel met de ogen op de bal.'), F('Te ver van de bal', 'Hoe dichterbij, hoe kleiner de hoek.')],
    variants: { easier: 'De aanvaller schiet traag en laag.', harder: 'De aanvaller kan schieten of omspelen.' },
    diagram: D('zestien', [K(50, 12), A(50, 22, 'A'), B(50, 20)], [pass(1, [50, 19], [46, 13]), run(2, [50, 12], [48, 15])])
  }),
  E({
    id: 'sr-1t1-wedstrijd-duel', name: 'Duelwedstrijd: aanvaller tegen keeper',
    summary: 'Competitieve vorm waarin aanvallers in rondes van vijf duels proberen te scoren tegen de keeper.',
    description: 'Elke aanvaller krijgt vijf duels vanaf 25 meter, met maximaal zes seconden om af te werken. De keeper verdient een punt per redding of balverovering. Na elke ronde wisselen aanvaller en keeper. De winnaar is de keeper met de meeste punten.',
    themes: ['eentegeneen', 'wedstrijd'], zone: 'Strafschopgebied', keepers: { min: 1, max: 3 }, intensity: 'hoog', divesPerRep: 0.5, explosive: true, blockTypes: ['afsluiting', 'kern'], reps: 5, sets: 2, rest: 60, duration: 12,
    coaching: ['Elk duel is een wedstrijdmoment', 'Blijf bij je principes', 'Coach jezelf hardop'],
    mistakes: [F('Gokken in de wedstrijdvorm', 'Dezelfde techniek als in de oefening.'), F('Opgeven na een doelpunt', 'Reset en focus op het volgende duel.')],
    variants: { easier: 'Acht seconden en tragere aanvallers.', harder: 'Vier seconden en een verdediger die terugloopt.' },
    diagram: D('zestien', [K(50, 9), A(50, 46, 'A'), B(50, 43)], [drib(1, [50, 43], [52, 24]), run(2, [50, 9], [51, 16])])
  }),
  E({
    id: 'sr-1t1-uittrappen-buiten-zestien', name: 'Buiten de zestien opruimen',
    summary: 'Ballen achter de verdediging worden buiten het strafschopgebied met de voet of het hoofd weggewerkt.',
    description: 'De trainer speelt diepe ballen achter een denkbeeldige verdedigingslijn op 30 meter. Een aanvaller loopt mee. De keeper komt uit tot buiten het strafschopgebied en trapt de bal in één tijd naar de zijlijn of kopt hem weg.',
    themes: ['eentegeneen', 'opbouw'], zone: 'Halve veld', keepers: { min: 1, max: 2 }, intensity: 'hoog', explosive: true, reps: 6, rest: 75,
    coaching: ['Vroeg beslissen', 'Naar de zijlijn wegwerken', 'Lichaam achter de bal'],
    mistakes: [F('Bal in het midden wegtrappen', 'Speel hem naar de zijlijn, weg van het gevaar.'), F('Te laat vertrekken', 'Beslis bij de pass, niet wanneer de bal er al is.')],
    variants: { easier: 'Zonder aanvaller en trage ballen.', harder: 'Tegenstander start met een voorsprong.' },
    diagram: D('halfveld', [K(50, 8), T(50, 62), A(58, 40, 'A'), B(50, 58), C(36, 30), C(64, 30)], [pass(1, [50, 57], [50, 30]), run(2, [50, 8], [50, 28]), pass(3, [50, 28], [86, 20])])
  }),
  E({
    id: 'sr-1t1-dubbel-blok', name: 'Blok en tweede blok',
    summary: 'Na een eerste blok kaatst de bal terug naar een tweede aanvaller en de keeper herstelt voor een tweede blok.',
    description: 'Aanvaller 1 werkt af na een korte dribbel, de keeper blokt. Aanvaller 2 staat 8 meter verder en neemt de rebound. De keeper komt meteen recht en zet zich opnieuw in blokhouding. Na elke reeks wisselen de aanvallers.',
    themes: ['eentegeneen', 'reflexen'], zone: 'Strafschopgebied', levels: GEV, keepers: { min: 1, max: 2 }, intensity: 'hoog', divesPerRep: 1.5, explosive: true, reps: 4, rest: 90,
    coaching: ['Eerste blok groot', 'Snel recht via de knie', 'Opnieuw dichtbij'],
    mistakes: [F('Blijven liggen na het eerste blok', 'Elke redding eindigt met opstaan.'), F('Te ver weg voor het tweede schot', 'Stap naar de nieuwe bal toe.')],
    variants: { easier: 'Aanvaller 2 wacht twee seconden.', harder: 'Aanvaller 2 kan ook passen naar een derde speler.' },
    diagram: D('zestien', [K(50, 10), A(50, 24, 'A1'), A(66, 22, 'A2'), B(50, 22)], [pass(1, [50, 21], [50, 13]), run(2, [50, 10], [56, 14]), pass(3, [66, 21], [54, 12])])
  }),
  E({
    id: 'sr-1t1-sprint-bal-rollen', name: 'Sprint naar een rollende bal',
    summary: 'De keeper en een aanvaller sprinten naar een bal die de trainer naar het strafschopgebied rolt.',
    description: 'De trainer rolt de bal vanaf de zijkant richting de rand van het doelgebied. De aanvaller start op 15 meter, de keeper op de doellijn. De keeper beslist of hij de bal kan pakken of zich moet klaarzetten voor het 1-tegen-1.',
    themes: ['eentegeneen', 'voetenwerk'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, intensity: 'hoog', explosive: true, divesPerRep: 0.5, reps: 6, rest: 75,
    coaching: ['Inschatten wie eerst is', 'Voluit gaan of positioneren', 'Duik laag voor de bal'],
    mistakes: [F('Twijfelen', 'Kies meteen en voer uit.'), F('Hoog in de duel gaan', 'Laag en zijwaarts duiken, hoofd achter de handen.')],
    variants: { easier: 'De aanvaller start op 20 meter.', harder: 'De aanvaller start op 12 meter.' },
    diagram: D('zestien', [K(50, 6), A(50, 36, 'A'), T(84, 20), B(82, 20)], [pass(1, [81, 20], [56, 18]), run(2, [50, 6], [55, 16]), run(3, [50, 36], [55, 22])])
  }),
  E({
    id: 'sr-1t1-uitkomen-schijnbeweging', name: 'Rustig blijven bij een schijnschot',
    summary: 'De aanvaller maakt een schijnschot en de keeper leert te wachten tot het echte schot komt.',
    description: 'De aanvaller dribbelt van op 15 meter naar het doel en maakt minstens één schijnschot. De keeper blijft op zijn voeten en gaat pas naar de grond als de bal echt vertrekt. Een keeper die op een schijnschot reageert, geeft de aanvaller een vrij doel.',
    themes: ['eentegeneen', 'reflexen'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, levels: LV_ALL, ages: FROM13, intensity: 'gemiddeld', divesPerRep: 0.5, reps: 6, rest: 60,
    coaching: ['Bal volgen, niet het been', 'Voeten blijven aan de grond', 'Pas gaan bij het echte schot'],
    mistakes: [F('Reageren op de beenzwaai', 'Wacht tot de voet de bal raakt.'), F('Gewicht op de hielen', 'Blijf licht op de voorvoeten.')],
    variants: { easier: 'De aanvaller zegt "schijn" bij een schijnschot.', harder: 'Twee schijnbewegingen toegelaten.' },
    diagram: D('zestien', [K(50, 9), A(50, 34, 'A'), B(50, 31)], [drib(1, [50, 31], [50, 22]), run(2, [50, 9], [50, 14])])
  }),

  // ---------------- Reflexen en reactiesnelheid ----------------
  E({
    id: 'sr-reflex-schot-door-poortjes', name: 'Schot door verborgen poortjes',
    summary: 'De trainer schiet door een van drie poortjes en de keeper ziet pas laat welke route de bal neemt.',
    description: 'Drie poortjes van pionnen staan op 6 meter, elk 2 meter breed. De trainer staat op 12 meter en schiet door een poortje naar keuze. De keeper staat in basishouding en reageert op de bal die pas zichtbaar wordt na het poortje.',
    themes: ['reflexen'], materials: ['ballen', 'pionnen'], intensity: 'hoog', divesPerRep: 0.5, explosive: true, reps: 8, rest: 60,
    coaching: ['Basishouding, gewicht vooraan', 'Laat reageren, niet gokken', 'Handen voor het lichaam'],
    mistakes: [F('Te vroeg bewegen', 'Pas bewegen als de bal door het poortje gaat.'), F('Op de hielen', 'Gewicht op de voorvoeten.')],
    variants: { easier: 'Eén poortje recht voor de keeper.', harder: 'Poortjes dichter bij de keeper.' },
    diagram: D('doel', [K(50, 12), C(36, 26), C(42, 26), C(47, 26), C(53, 26), C(58, 26), C(64, 26), T(50, 48), B(50, 44)], [pass(1, [50, 43], [61, 26], [56, 13])])
  }),
  E({
    id: 'sr-reflex-afgeweken-bal', name: 'Afgeweken schot via een verdediger',
    summary: 'Een schot wordt door een medespeler of een dummy van richting veranderd en de keeper reageert op de nieuwe lijn.',
    description: 'Een medespeler staat op 7 meter met de rug naar het doel en houdt een been gestrekt. De trainer schiet op hem vanop 14 meter, zodat de bal soms van richting verandert. De keeper reageert op de nieuwe richting, duikt of vangt.',
    themes: ['reflexen', 'duiken'], intensity: 'hoog', divesPerRep: 0.5, explosive: true, reps: 6, rest: 75,
    coaching: ['Blijf laag en reactief', 'Volg de bal na het contact', 'Handen naar de bal'],
    mistakes: [F('Duiken op het eerste traject', 'Wacht tot je ziet of de bal afwijkt.'), F('Rechtop staan', 'Een lage houding geeft snellere reactie.')],
    variants: { easier: 'Een pion als obstakel.', harder: 'Twee medespelers als obstakel.' },
    diagram: D('doel', [K(50, 12), S(50, 30, 'S'), T(50, 52), B(50, 48)], [pass(1, [50, 47], [50, 32]), pass(2, [50, 30], [58, 13])])
  }),
  E({
    id: 'sr-reflex-tennisbal-muur', name: 'Tennisballen tegen de muur',
    summary: 'De trainer gooit tennisballen tegen een muur of rebounder achter de keeper, die zich omdraait en vangt.',
    description: 'De keeper staat met zijn gezicht naar een muur op 3 meter. De trainer staat achter de keeper en gooit tennisballen tegen de muur. De keeper vangt de terugkaatsende bal met één of twee handen. Varieer hoogte en snelheid.',
    themes: ['reflexen', 'vangen'], materials: ['ballen', 'rebounder'], levels: LV_ALL, ages: FROM13, zone: '10 × 10 m', intensity: 'gemiddeld', reps: 12, rest: 45,
    coaching: ['Handen voor het lichaam', 'Zachte handen', 'Ogen op de muur'],
    mistakes: [F('Handen te laag', 'Hou de handen op borsthoogte.'), F('Te ver van de muur', 'Op 3 meter is de reactietijd uitdagend maar haalbaar.')],
    variants: { easier: 'Voetballen en 5 meter afstand.', harder: 'Twee tennisballen tegelijk.' },
    diagram: D('vrij', [K(50, 40), RB(50, 24), T(50, 56), B(48, 52)], [pass(1, [48, 51], [50, 26]), pass(2, [50, 26], [52, 37])])
  }),
  E({
    id: 'sr-reflex-twee-schutters-signaal', name: 'Twee schutters, één schot',
    summary: 'Twee trainers staan klaar om te schieten en enkel degene die de keeper aanwijst, schiet meteen.',
    description: 'Twee trainers staan op 14 meter, op 10 meter van elkaar. Een derde persoon achter het doel steekt een arm op, links of rechts. De bijhorende trainer schiet meteen. De keeper ziet het signaal niet en moet zich in een fractie van een seconde oriënteren.',
    themes: ['reflexen', 'voetenwerk'], trainers: 2, zone: 'Strafschopgebied', intensity: 'hoog', divesPerRep: 0.5, explosive: true, reps: 8, rest: 60,
    coaching: ['Klaar staan tussen beide schutters', 'Kort bijstellen', 'Explosief reageren'],
    mistakes: [F('Gokken op één schutter', 'Neem een middenpositie en reageer.'), F('Te grote correctie', 'Een kleine stap volstaat vaak.')],
    variants: { easier: 'De schutters schieten op het lichaam.', harder: 'De schutters schieten in de verre hoek.' },
    diagram: D('zestien', [K(50, 9), T(40, 34, 'T1'), T(60, 34, 'T2'), B(40, 31), B(60, 31)], [run(1, [50, 9], [46, 10]), pass(2, [40, 30], [44, 10])])
  }),
  E({
    id: 'sr-reflex-schot-na-draai-trainer', name: 'Schot na een draai van de trainer',
    summary: 'De trainer krijgt de bal met de rug naar het doel, draait en schiet snel, zodat de keeper weinig tijd heeft.',
    description: 'Een medespeler speelt de bal in naar de trainer die op 12 meter met de rug naar het doel staat. De trainer draait en schiet zo snel mogelijk. De keeper volgt de draai en staat stil in basishouding op het moment van het schot.',
    themes: ['reflexen'], zone: 'Strafschopgebied', levels: GEV, intensity: 'hoog', divesPerRep: 0.5, explosive: true, reps: 6, rest: 60,
    coaching: ['Bijstellen tijdens de draai', 'Stilstaan bij het schot', 'Explosief reageren'],
    mistakes: [F('Te laat in basishouding', 'Volg de draai met kleine pasjes.'), F('Vroeg kiezen', 'De draai bepaalt de hoek, niet je gevoel.')],
    variants: { easier: 'De trainer draait altijd naar dezelfde kant.', harder: 'Een verdediger zet druk op de trainer.' },
    diagram: D('zestien', [K(50, 9), T(50, 30), S(50, 52, 'S'), B(50, 48)], [pass(1, [50, 47], [50, 32]), run(2, [50, 9], [52, 10]), pass(3, [50, 29], [56, 12])])
  }),
  E({
    id: 'sr-reflex-scrimmage', name: 'Doelmondscrimmage',
    summary: 'Chaos voor het doel: drie aanvallers en twee verdedigers spelen met losse ballen en de keeper verdedigt alles.',
    description: 'In het doelgebied spelen drie aanvallers en twee verdedigers. De trainer gooit ballen in het doelgebied, laag of hoog. Elke losse bal is een kans. De keeper moet blokken, vangen of wegtikken. Een reeks duurt 40 seconden.',
    themes: ['reflexen', 'communicatie'], zone: 'Strafschopgebied', keepers: { min: 1, max: 2 }, intensity: 'hoog', divesPerRep: 0.5, explosive: true, complexity: 3, reps: 1, sets: 4, rest: 90, duration: 10,
    coaching: ['Op de voeten blijven', 'Elke bal is gevaarlijk', 'Kort en luid coachen'],
    mistakes: [F('Liggen blijven', 'Snel recht na elke actie.'), F('Stil zijn', 'Stuur je verdedigers naar de vrije man.')],
    variants: { easier: 'Twee aanvallers.', harder: 'Vier aanvallers en geen verdedigers.' },
    diagram: D('zestien', [K(50, 8), A(44, 12, 'A'), A(56, 12, 'A'), A(50, 18, 'A'), S(46, 16, 'V'), S(54, 16, 'V'), T(50, 32), B(50, 29)], [pass(1, [50, 28], [48, 16]), run(2, [50, 8], [48, 11])])
  }),
  E({
    id: 'sr-reflex-lichtsignaal', name: 'Reactie op handsignaal',
    summary: 'De trainer geeft met de hand een richting aan en schiet meteen daarna, zodat de keeper eerst moet reageren en dan redden.',
    description: 'De trainer staat op 10 meter met de bal voor zich. Hij wijst een kant aan, de keeper doet een zijwaartse stap in die richting. Meteen daarna schiet de trainer naar dezelfde of de andere kant. De keeper reageert en redt.',
    themes: ['reflexen', 'voetenwerk'], levels: LV_ALL, ages: FROM13, intensity: 'hoog', divesPerRep: 0.5, explosive: true, reps: 8, rest: 60,
    coaching: ['Korte stap, geen grote sprong', 'Klaar voor beide kanten', 'Handen voor het lichaam'],
    mistakes: [F('Te grote stap', 'Een kleine stap houdt je in balans.'), F('Stilvallen na de stap', 'Blijf licht op de voorvoeten.')],
    variants: { easier: 'Het schot gaat altijd naar de aangewezen kant.', harder: 'De trainer wijst twee keer na elkaar.' },
    diagram: D('doel', [K(50, 12), T(50, 40), B(50, 36)], [run(1, [50, 12], [55, 12]), pass(2, [50, 35], [44, 13])])
  }),
  E({
    id: 'sr-reflex-dichtbij-volley', name: 'Volleys van dichtbij',
    summary: 'Volleys van op 7 meter vragen een korte, snelle handbeweging zonder grote duik.',
    description: 'De trainer werpt de bal op en volleyt vanop 7 meter op het lichaam of net ernaast. De keeper staat in een lage basishouding en reageert met korte handbewegingen, vangt of duwt de bal weg. Rust is volledig tussen reeksen.',
    themes: ['reflexen'], intensity: 'hoog', explosive: true, divesPerRep: 0.3, reps: 8, rest: 75,
    coaching: ['Lage basishouding', 'Korte handbewegingen', 'Bal naast het doel duwen'],
    mistakes: [F('Grote duik bij een bal dichtbij', 'Een korte hand is sneller.'), F('Ogen dicht', 'Blijf naar de bal kijken.')],
    variants: { easier: 'Werpen in plaats van volleyen.', harder: 'Afstand 5 meter.' },
    diagram: D('doel', [K(50, 12), T(50, 34), B(50, 31)], [pass(1, [50, 30], [55, 13])])
  }),
  E({
    id: 'sr-reflex-schot-tussen-pionnen-ligt', name: 'Opstaan uit buiklig en redden',
    summary: 'De keeper ligt op de buik, staat op een signaal op en redt meteen een schot.',
    description: 'De keeper ligt op de buik op de doellijn. Op het fluitsignaal springt hij recht en zet zich in basishouding. De trainer schiet zodra de keeper staat, naar een van beide hoeken. Volledige rust tussen herhalingen.',
    themes: ['reflexen', 'duiken'], intensity: 'hoog', divesPerRep: 1, explosive: true, reps: 5, rest: 90,
    coaching: ['Explosief opstaan', 'Eerst basishouding', 'Volle duik naar de hoek'],
    mistakes: [F('Half opstaan en duiken', 'Volledig klaar staan voor je reageert.'), F('Te weinig rust', 'Explosiviteit vraagt herstel.')],
    variants: { easier: 'Start in kniezit.', harder: 'Start in rugligging.' },
    diagram: D('doel', [K(50, 10), T(50, 42), B(50, 38)], [run(1, [50, 10], [50, 12]), pass(2, [50, 37], [61, 10])])
  }),
  E({
    id: 'sr-reflex-dubbele-bal-hand', name: 'Twee ballen, één greep',
    summary: 'De trainer houdt twee ballen vast en laat er één vallen, die de keeper vóór de tweede stuit moet pakken.',
    description: 'De trainer staat op 2 meter met in elke hand een bal op schouderhoogte. Hij laat één bal vallen. De keeper reageert en pakt de bal voor die een tweede keer de grond raakt. Met tennisballen wordt het moeilijker.',
    themes: ['reflexen', 'vangen'], levels: LV_ALL, ages: FROM13, intensity: 'gemiddeld', keepers: { min: 1, max: 4 }, blockTypes: ['opwarming', 'kern'], warmup: ['balgewenning'], complexity: 1, zone: '4 × 4 m per duo', duration: 6, reps: 10, rest: 30,
    coaching: ['Kort en snel reageren', 'Op de voorvoeten', 'Handen klaar voor beide kanten'],
    mistakes: [F('Gokken op één hand', 'Kijk naar beide handen tegelijk.'), F('Op de hielen', 'Gewicht naar voren.')],
    variants: { easier: 'Eén bal en de keeper weet welke.', harder: 'Tennisballen en grotere afstand.' },
    diagram: D('vrij', [K(50, 44), T(50, 30), B(44, 28), B(56, 28)], [pass(1, [44, 29], [44, 38]), run(2, [50, 44], [45, 39])])
  }),
  E({
    id: 'sr-reflex-afsluit-schotcarrousel', name: 'Schotcarrousel als afsluiter',
    summary: 'Spelers schieten om de beurt van verschillende plaatsen en de keepers wisselen elke vijf ballen.',
    description: 'Vijf spelers staan rond het strafschopgebied met elk een bal. Ze schieten om de beurt na een fluitsignaal. De keeper heeft weinig tijd om te herpositioneren. Na vijf ballen wisselen de keepers. Wie de meeste ballen stopt, wint.',
    themes: ['reflexen', 'wedstrijd'], zone: 'Strafschopgebied', keepers: { min: 1, max: 3 }, intensity: 'hoog', divesPerRep: 0.5, explosive: true, blockTypes: ['afsluiting'], reps: 5, sets: 3, rest: 60, duration: 12,
    coaching: ['Snel herpositioneren', 'Elke bal is een nieuwe kans', 'Plezier en scherpte'],
    mistakes: [F('Blijven kijken naar de vorige bal', 'Draai meteen naar de volgende schutter.'), F('Positie vergeten', 'Elke schutter heeft een eigen bissectrice.')],
    variants: { easier: 'Drie schutters en meer tijd.', harder: 'Twee schutters tegelijk.' },
    diagram: D('zestien', [K(50, 9), S(22, 30), S(36, 38), S(50, 40), S(64, 38), S(78, 30), B(36, 35)], [pass(1, [37, 35], [48, 12]), run(2, [50, 9], [47, 10])])
  }),
  E({
    id: 'sr-reflex-dekking-blind', name: 'Blind schot achter een scherm',
    summary: 'Een scherm van twee spelers ontneemt de keeper het zicht tot de bal erdoor of erlangs komt.',
    description: 'Twee spelers staan naast elkaar op 8 meter, een halve meter uit elkaar. De trainer schiet vanop 16 meter door of langs de spelers. De keeper verplaatst zich om zicht te krijgen en reageert pas als hij de bal ziet.',
    themes: ['reflexen'], zone: 'Strafschopgebied', intensity: 'hoog', divesPerRep: 0.5, explosive: true, reps: 6, rest: 75,
    coaching: ['Zicht zoeken', 'Laag en reactief', 'Rebound opzij'],
    mistakes: [F('Achter het scherm blijven staan', 'Zoek een halve stap opzij.'), F('Te vroeg gaan', 'Wacht op de bal.')],
    variants: { easier: 'Eén speler als scherm.', harder: 'De spelers bewegen tijdens het schot.' },
    diagram: D('zestien', [K(50, 9), S(48, 20), S(52, 20), T(50, 40), B(50, 37)], [pass(1, [50, 36], [50, 22], [54, 11])])
  }),
  E({
    id: 'sr-reflex-rebounder-duik', name: 'Rebounder en duik',
    summary: 'De trainer schiet op een schuine rebounder voor het doel en de keeper reageert op de onvoorspelbare terugkaats.',
    description: 'Een rebounder staat schuin op 5 meter voor het doel. De trainer schiet vanaf de zijkant op de rebounder. De bal kaatst in wisselende richtingen naar het doel. De keeper reageert met een korte duik of vangt de bal.',
    themes: ['reflexen', 'duiken'], materials: ['ballen', 'rebounder'], intensity: 'hoog', divesPerRep: 1, explosive: true, reps: 6, rest: 75,
    coaching: ['Lage basishouding', 'Reageer op de terugkaats', 'Bal opzij bij twijfel'],
    mistakes: [F('Naar de trainer kijken', 'Kijk naar de rebounder.'), F('Te diep in het doel', 'Een meter voor de lijn geeft betere hoeken.')],
    variants: { easier: 'Rebounder recht, zachte worpen.', harder: 'Twee rebounders naast elkaar.' },
    diagram: D('doel', [K(50, 12), RB(50, 24, 20), T(26, 30), B(28, 29)], [pass(1, [29, 29], [48, 24]), pass(2, [50, 23], [56, 13])])
  }),
  E({
    id: 'sr-reflex-mini-goal-wedstrijd', name: 'Keepersduel op mini-goals',
    summary: 'Twee keepers schieten op elkaars mini-goal van op korte afstand en verdedigen met snelle reflexen.',
    description: 'Twee mini-goals staan op 10 meter van elkaar. De keepers werpen of trappen om de beurt op het doel van de ander. Na een redding mag de keeper meteen terugspelen. Spel tot vijf doelpunten.',
    themes: ['reflexen', 'distributie'], materials: ['ballen', 'minigoals'], levels: LV_ALL, ages: FROM13, keepers: { min: 2, max: 4 }, intensity: 'gemiddeld', divesPerRep: 0.3, blockTypes: ['afsluiting', 'opwarming'], warmup: ['balgewenning'], complexity: 1, zone: '10 × 5 m', duration: 8, sets: 1, reps: 1, rest: 0,
    coaching: ['Snel weer klaar', 'Plaats gaat voor kracht', 'Lage reflexen met de handen'],
    mistakes: [F('Te hard schieten', 'Een geplaatste bal is moeilijker te stoppen.'), F('Stilstaan na een worp', 'Meteen terug in basishouding.')],
    variants: { easier: 'Enkel rollen.', harder: 'Afstand 7 meter en volleys.' },
    diagram: D('vrij', [K(50, 20, 'K1'), K(50, 54, 'K2'), MG(50, 14), MG(50, 60, 180), B(50, 24)], [pass(1, [50, 25], [46, 52])])
  }),
  E({
    id: 'sr-reflex-hoge-reactie-lat', name: 'Reactie op een bal onder de lat',
    summary: 'Ballen die net onder de lat binnenkomen worden met een korte sprong en een open hand over de lat geduwd.',
    description: 'De trainer staat op 8 meter en volleyt de bal naar de ruimte net onder de lat, links of rechts van de keeper. De keeper reageert met een korte sprong en duwt de bal met een open hand over de lat. Tussen reeksen volgt volledige rust.',
    themes: ['reflexen', 'hogeballen'], levels: GEV, intensity: 'hoog', explosive: true, reps: 6, rest: 75,
    coaching: ['Korte sprong', 'Open hand, vingers naar boven', 'Duw de bal over de lat'],
    mistakes: [F('Stompen', 'Een open hand geeft meer controle.'), F('Te laat de armen omhoog', 'Armen al half omhoog in de basishouding.')],
    variants: { easier: 'Werpen in plaats van volleyen.', harder: 'Afstand 6 meter.' },
    diagram: D('doel', [K(50, 12), T(50, 36), B(50, 33)], [pass(1, [50, 32], [54, 5])])
  }),
  E({
    id: 'sr-reflex-zijwaarts-tennis', name: 'Zijwaartse tennisballen',
    summary: 'De trainer gooit tennisballen links en rechts van de keeper, die ze met één hand vangt en meteen teruggooit.',
    description: 'De keeper staat in basishouding op 4 meter van de trainer. De trainer gooit tennisballen afwisselend links en rechts op heuphoogte. De keeper vangt met de dichtste hand en gooit meteen terug. Een reeks duurt 30 seconden.',
    themes: ['reflexen'], levels: LV_ALL, ages: FROM13, intensity: 'gemiddeld', keepers: { min: 1, max: 4 }, blockTypes: ['opwarming', 'kern'], warmup: ['balgewenning'], complexity: 1, zone: '4 × 4 m per duo', duration: 6, sets: 3, reps: 12, rest: 30,
    coaching: ['Basishouding behouden', 'Dichtste hand vangt', 'Snel teruggooien'],
    mistakes: [F('Kruisen met de hand', 'De dichtste hand is altijd sneller.'), F('Rechtop gaan staan', 'Blijf laag.')],
    variants: { easier: 'Voetballen en grotere afstand.', harder: 'Twee tennisballen na elkaar.' },
    diagram: D('vrij', [K(50, 44), T(50, 26), B(48, 30)], [pass(1, [48, 31], [44, 42]), pass(2, [44, 42], [49, 29])])
  })
];
