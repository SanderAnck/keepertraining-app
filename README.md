# KeeperCoach

Keepertrainingen voorbereiden thuis en geven op het veld. KeeperCoach is een webapp (PWA) die je
vanuit Safari op je iPhone op het beginscherm zet ("Zet op beginscherm"). Na het eerste bezoek werkt
hij volledig offline. Er is geen tracking. Alle gegevens staan op je toestel (IndexedDB); met de optionele
cloud-sync gaan trainingen, oefeningen en keepers ook naar je eigen Supabase-project, zodat al je toestellen
dezelfde gegevens hebben.

**Live:** https://sanderanck.github.io/keepertraining-app/

Huidige versie: zie `js/version.js` (nu 0.7.3; fase 1 was `0.1.x`).

## Nieuw in 0.7.3

- Bij "Oefeningen" gaf het open- of dichtklappen van "Enkel met dit materiaal" ineens een lege lijst. Oorzaak: elke
  klik buiten de themaknoppen zette per ongeluk een onzichtbare themafilter (het licht/donker-thema van de app). De
  themaknoppen hebben nu een eigen kenmerk (`data-th`), dus klikken op het materiaalblok laat de lijst ongemoeid.
- Nieuwe filterknop "Eigen" naast ★ Favorieten: toont enkel je eigen oefeningen en de aangepaste versies van
  standaardoefeningen.

## Nieuw in 0.7.2

- In het overzicht "Trainingen" heeft elke kaart (vandaag, gepland, eerder en sjablonen) een prullenbakknop
  rechtsboven. Na bevestiging wordt de training meteen verwijderd, zonder ze eerst te openen. Het verwijderen gaat
  via dezelfde weg als in het trainingsscherm, dus het wordt ook naar de cloud gesynchroniseerd.

## Nieuw in 0.7.1

- Blijft de opslag hangen bij het openen (iOS, tijdens de omzetting naar databaseversie 2 terwijl een ander venster
  KeeperCoach nog openhoudt), dan toont de app na 8 s een uitleg en een knop "Opnieuw proberen" in plaats van
  eindeloos "KeeperCoach laden…". Updates blijven dan ook binnenkomen.

## Nieuw in 0.7.0: cloud-sync met Supabase

- **Instellingen → Cloud-sync**: inloggen met e-mail en wachtwoord (het account maak je zelf aan in Supabase; er
  worden geen mails verstuurd, en de iPhone kan het wachtwoord onthouden). Trainingen, oefeningen en keepers worden gesynchroniseerd tussen al je toestellen. Instellingen en de
  veldmodus blijven per toestel.
- **Local-first**: de app werkt altijd met IndexedDB. Elke wijziging komt in de wachtrij `outbox` en gaat naar de
  server zodra er verbinding is: bij openen, 2 s na een wijziging, bij terugkeren naar de app, bij verbinding en
  elke 5 minuten. Offline werkt alles zoals voorheen.
- **Laatste wijziging wint** (`updatedAt`), zowel in de app als op de server (trigger in `supabase/schema.sql`).
  Verwijderen wordt als markering bewaard, zodat het ook op andere toestellen verdwijnt.
- **Geen bibliotheek**: gewone `fetch` naar de REST-API van Supabase (`js/cloud.js`), pure logica in
  `js/logic/sync.js` (getest in `tests/sync.test.js`). Project-URL en publieke sleutel staan in `js/cloud-config.js`;
  leeg betekent dat sync uit staat.
- **Instellen**: zie [`supabase/README.md`](supabase/README.md). De tabel en de beveiliging per rij (RLS) staan in
  [`supabase/schema.sql`](supabase/schema.sql).
- Database naar versie 2: nieuwe stores `outbox` en `syncMeta` (niet in de back-up). Een teruggezette back-up gaat
  ook naar de cloud.

## Nieuw in 0.6.0: diagrameditor

- **Tekening aanpassen** op elke oefening (of "Tekening bewerken" in het bewerkscherm) opent de editor.
- **Plaatsen**: kies een element (keeper, trainer, medespeler, aanvaller, bal, pion, hoepel, ladder, horde, mini-goal,
  rebounder) en tik op het veld; versleep elementen met de vinger. Pijlen die bij een element starten, schuiven mee.
  Een geselecteerd element kun je een label geven (max. 5 tekens), 45° draaien (ladder, horde, mini-goal,
  rebounder), dupliceren of verwijderen.
- **Pijl**: kies loopbeweging keeper, baltraject of dribbel en trek de pijl met je vinger; het spoor wordt strak
  getrokken (bochten blijven). Kies de stap (nieuwe stap of dezelfde als een vorige). Een geselecteerde pijl kan van
  soort of stap veranderen.
- **Wissen**: tik op een element of pijl. **↶ / ↷** maakt ongedaan en opnieuw. Veldtype kies je in de editor.
- Bewaard als data (JSON, coördinaten 0–100), nooit als afbeelding. Een aanpassing aan een meegeleverde oefening
  wordt apart bewaard en blijft behouden bij updates.
- Logica in `js/logic/diagramEdit.js` (getest in `tests/diagramEdit.test.js`), scherm in `js/diagram/editor.js`.

## Nieuw in 0.5.0

- Bibliotheek uitgebreid naar **250 oefeningen**. De 135 nieuwe oefeningen zijn vooral voor senioren en U16–U19 op
  gevorderd niveau (242 van de 250 passen nu bij senioren/gevorderd), met 22 tot 27 per hoofdthema, plus extra
  opwarmingen (o.a. een volledige wedstrijdopwarming) en afsluitingen.
- Bron: `tools/senior-a.mjs` (vangen, duiken, voetenwerk), `tools/senior-b.mjs` (hoge ballen, 1-tegen-1,
  reflexen) en `tools/senior-c.mjs` (distributie, opbouw, communicatie, wedstrijd), met hulpfuncties in
  `tools/senior-helpers.mjs`. Eigen oefeningen en aanpassingen blijven behouden.

## Nieuw in 0.4.0: keeperskaart

- **Keepers** (`#/keepers`): keepers toevoegen met naam, leeftijdsgroep, niveau en notitie; archiveren of verwijderen.
- **Beoordelen**: per thema een score van 1 (werkpunt) tot 5 (sterk). Vanuit een training (Notities achteraf →
  Keepers beoordelen) staan de thema's van die training bovenaan en wordt de beoordeling aan de training gekoppeld.
- **Keeperskaart** (`#/keeper/<id>`): spinnenweb met de recentste scores tegenover de vorige beoordeling, scores met
  vooruitgang (▲/▼), groeicurve van het gemiddelde of per thema (tik op een punt voor de score), werkpunten (de
  twee laagste scores, bij gelijke stand het dalende thema eerst) met passende oefeningen, en de knop
  "Plan training rond werkpunten" die meteen een volledige training voorstelt.
- Gegevens staan in de bestaande store `keepers` (beoordelingen in het keeperrecord, geen migratie nodig) en
  zitten in de back-up. Logica in `js/logic/keepers.js`, getest in `tests/keepers.test.js`; grafieken in `js/views/charts.js`.

## Nieuw in 0.3.2

- "Oefening bekijken" vanuit een training opent de oefening weer (het venster bleef erover hangen).
  De terugknop brengt je dan terug naar de training.

## Nieuw in 0.3.1

- Updates worden betrouwbaar gevonden: de app vraagt bij openen, bij terugkeren en elke 30 minuten de
  versie rechtstreeks aan de server (zonder cache) en laadt bij een nieuwe versie de service worker
  opnieuw. "Zoek naar update" in Instellingen doet hetzelfde en zegt wat er gebeurt.

## Nieuw in 0.3.0

- Bibliotheek uitgebreid naar **115 oefeningen**, met 10 tot 13 per hoofdthema en per thema 11 tot
  23 oefeningen waarin het voorkomt. Meer spelvormen voor U6–U12, meer opwarmings- en afsluitvormen,
  en elite-oefeningen voor U16 en ouder. Elke oefening heeft een volledige fiche en een veldtekening.
- Bron: `tools/build-exercises.mjs` (eerste 36) en `tools/exercises-extra.mjs` (uitbreiding).
  Eigen oefeningen en aanpassingen blijven behouden bij deze update.

## Nieuw in 0.2.0

- **Stel training voor**: op basis van de parameters stelt de app een volledige training samen
  (opwarming met mobiliteit, balgewenning en lichte valvorm; 1–3 kernblokken van eenvoudig naar
  complex rond het hoofddoel en de extra thema's; afsluiting). Regels: enkel passende oefeningen,
  duiklimiet per leeftijd, totale duur binnen ±5 min van de beschikbare tijd, geen twee explosieve
  oefeningen na elkaar. Bij een nieuwe training opent het parameterscherm meteen met deze knop.
- Elk voorstel blijft volledig aanpasbaar. Per oefening: **↻ Andere oefening** (alternatief in
  hetzelfde blok en thema, in de opwarming met dezelfde rol) en **Vastzetten**. "Nieuw voorstel"
  behoudt vastgezette oefeningen. Oefeningen die je zelf toevoegt of aanpast worden automatisch
  vastgezet. Na een voorstel kun je het ongedaan maken via de melding.
- Logica in `js/logic/generator.js`, getest in `tests/generator.test.js` (180 combinaties van parameters).
- Extra seedoefening voor de opwarming: "Valvormen in duo vanuit stand".

## Wat zit erin (fase 1)

- **Trainingen**: overzicht met de training van vandaag bovenaan en een grote knop "Start training"
  (1 tik naar de veldmodus). Blokken opwarming, kern (1–3 blokken) en afsluiting. Oefeningen
  toevoegen, doseren (duur, series, herhalingen, rust), omhoog/omlaag schuiven, dupliceren, als
  sjabloon bewaren, markeren als gegeven en notities achteraf (goed, beter, per keeper).
- **Parameters per training**: hoofddoel en extra thema's, intensiteit (met werk-rust, acties per serie
  en RPE), leeftijdsgroep, niveau, aantal keepers en trainers, beschikbare tijd, materiaal en
  ondergrond. Bij elke wijziging worden ongeschikte oefeningen rood gemarkeerd (leeftijd, te
  intensief, materiaal, keepers, trainers), krijgt elke oefening een voorgestelde variant
  (makkelijker/basis/moeilijker) en worden duur, belasting en aantal duiken herberekend.
- **Oefeningenbibliotheek**: startoefeningen (nu 250) over alle tien thema's, elk met uitleg,
  coachingspunten, fouten met correctie, varianten en een veldtekening. Zoeken, filteren (thema,
  leeftijd, niveau, intensiteit, materiaal), favorieten en eigen oefeningen. Eigen oefeningen toevoegen, bewerken en
  dupliceren; aanpassingen aan meegeleverde oefeningen worden apart bewaard.
- **Veldtekeningen (SVG)**: doel, strafschopgebied, halve veld of vrije zone met keeper, trainer,
  medespeler, aanvaller, bal, pion, hoepel, ladder, horde, mini-goal en rebounder. Doorlopende pijl =
  loopbeweging keeper, gestippeld = baltraject, golvend = dribbel, genummerde stappen. Legende bij elke
  oefening.
- **Veldmodus** (`#/veld/<id>`): één oefening per scherm, swipen of grote knoppen, blok en positie
  bovenaan, verstreken versus geplande tijd, grote tekening (tik = volledig scherm), max. 3
  coachingspunten, series × herhalingen en rust, grote timer (tik = start/pauze) met geluid en flits,
  zonlichtmodus, snelle notitie, scherm aan (Wake Lock). Na sluiten of herladen kom je terug bij
  dezelfde oefening en timerstand.
- **Instellingen**: geluid (fluitje/piep, volume, test), thema, zonlichtmodus standaard, automatisch
  doorlopen van de timer, standaardparameters, back-up en herstel, versie en "zoek naar update".
- **Back-up**: alles als één JSON-bestand via het deelmenu (Bewaar in Bestanden/iCloud) of als download.
  Herstellen vervangt alle gegevens. De app herinnert je eraan als je laatste back-up meer dan 14
  dagen oud is.

## Structuur

| Pad | Inhoud |
| --- | --- |
| `index.html` | App-shell met topbalk en tabbalk, iOS-meta-tags |
| `manifest.webmanifest` | Naam, `lang: nl`, `display: standalone`, iconen, `start_url: ./#/trainingen` |
| `sw.js` | Service worker: precachet de volledige app-shell, cachenaam bevat de versie |
| `css/app.css` | Design system (kleuren, typografie, kaarten, knoppen), licht en donker, veldmodus |
| `js/version.js` | Versienummer (enige bron) |
| `js/app.js` | Hash-router, tabbalk, registratie van de service worker, update-toast |
| `js/views/*.js` | Schermen: `trainingen`, `training`, `params` (formulier), `oefeningen`, `oefening`, `keepers`, `instellingen`, `common` |
| `js/state.js` | Gedeelde toestand: instellingen, bibliotheek (seed + eigen), trainingen |
| `js/db.js` | Promise-wrapper rond IndexedDB, migraties, export/import |
| `js/backup.js` | Back-up en herstel als JSON-bestand, herinnering |
| `js/cloud.js` | Cloud-sync met Supabase: inloggen met e-mail en wachtwoord, wachtrij versturen, wijzigingen ophalen |
| `js/cloud-config.js` | Project-URL en publieke sleutel van Supabase (leeg = sync uit) |
| `supabase/` | `schema.sql` (tabel, trigger, RLS) en `README.md` (stappenplan om sync in te stellen) |
| `js/ui.js` | Gedeelde UI-helpers (veilige HTML, toast, sheets, geluid, flits) |
| `js/field.js` | Veldmodus en timer |
| `js/logic/` | Pure logica zonder DOM: `constants`, `load` (belastingsregels, varianten), `generator` (trainingsvoorstel), `timer`, `session`, `library`, `backupFormat`, `sync` |
| `js/diagram/render.js` | Rendering van de veldtekeningen en legende (SVG) |
| `data/exercises.json` | Seedbibliotheek met 250 oefeningen |
| `icons/` | `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`, `favicon-64.png` |
| `tests/` | Tests voor `js/logic/`, de diagrammen, de seeddata en de precache-lijst |
| `tools/build-exercises.mjs`, `tools/exercises-extra.mjs`, `tools/senior-*.mjs` | Bron van `data/exercises.json` (geen onderdeel van de app) |
| `package.json` | Enkel `"type": "module"` zodat node de ES-modules herkent; geen dependencies |

## Datamodel (IndexedDB `keepercoach`, `DB_VERSION` 2)

- `sessions`: `id`, `title`, `date`, `parameters` (themes, mainTheme, intensity, age, level, keepers,
  trainers, time, materials, surface), `blocks[]` (`type`, `items[]` met `exerciseId`, `variant`,
  `variantManual`, `duration` in min, `sets`, `reps`, `rest` in s, `note`), `status`, `isTemplate`,
  `notes` (good, better, perKeeper).
- `exercises`: eigen oefeningen en aanpassingen van seedoefeningen (zelfde id = aanpassing wint).
- `keepers`: `id`, `name`, `age`, `level`, `note`, `archived`, `ratings[]` (`id`, `date`, `sessionId`, `scores` {thema: 1–5}, `note`).
- `settings`: één record met sleutel `'me'` (geluid, thema, standaardparameters, favorieten, laatste back-up).
- `fieldState`: één record `'active'` met training, oefening-index en timerstatus (tijdstempels).
- `outbox` (sinds v2): wachtrij voor cloud-sync, sleutel `'<store>:<id>'` met `kind`, `id`, `updatedAt`, `deleted`.
- `syncMeta` (sinds v2): login (`auth`), laatst opgehaald volgnummer (`cursor`), `lastSync`, `lastError`.
- Diagram: `{ field, elements: [{ t, x, y, r?, label? }], lines: [{ t: 'loop'|'bal'|'dribbel', p: [[x,y],…], s }] }`
  met coördinaten 0–100.

Vaste lijsten staan op één plaats in `js/logic/constants.js`. Bij elke wijziging aan de stores:
`DB_VERSION` verhogen en een migratie toevoegen in `js/db.js`.

## Lokaal testen

```sh
python3 -m http.server 8000
```

Open dan http://localhost:8000. Tests (Node 20 of nieuwer, zonder dependencies):

```sh
node --test tests/
```

Seedoefeningen aanpassen: bewerk `tools/build-exercises.mjs` en voer `node tools/build-exercises.mjs` uit.

## Publiceren

GitHub Pages draait vanaf de `main`-branch, map `/` (root); `.nojekyll` staat in de root. Elke push
naar `main` staat meteen live. Bij elke wijziging:

1. verhoog `self.KEEPER_VERSION` in `js/version.js` én het versiecommentaar bovenaan `sw.js` (zodat de
   browser een gewijzigde service worker ziet; de test controleert dit);
2. voeg nieuwe bestanden toe aan de precache-lijst in `sw.js` (de test `tests/precache.test.js` controleert dit);
3. `node --test tests/` moet slagen.

Geïnstalleerde apps tonen dan "Nieuwe versie beschikbaar, tik om te vernieuwen".

## Beslissingen en aannames

- **Repo-naam**: `keepertraining-app` in plaats van `keeperapp-sander` uit de opdracht.
- **Duur per oefening** is de totale tijd inclusief rust tussen series; de werktijd per serie wordt
  daaruit berekend. De timer loopt standaard automatisch door werk → rust → werk (uit te zetten).
- **Belasting** = minuten × RPE (session-RPE). RPE komt van de intensiteit van de oefening, ±1 voor de variant.
- **Leeftijdsregels**: U6–U9 max. gemiddelde intensiteit en richtwaarde 12 duiken per sessie; U10–U12
  30; U13–U15 45; U16–U19 70; senioren 90. De makkelijkere variant telt half zoveel duiken.
- **Variantvoorstel**: niveau onder het basisniveau van de oefening of de jongste geschikte
  leeftijdsgroep geeft "makkelijker", hoger niveau of oudere groep "moeilijker". Een manueel gekozen
  variant blijft staan als je parameters wijzigt.
- **Herschikken** gebeurt met omhoog/omlaag-knoppen (ook over blokken heen); slepen volgt eventueel later.
- **Back-up** kan niet automatisch gebeuren in een webapp; daarom een herinnering na 14 dagen.
- **iOS**: geen trilfunctie, dus geluid (Web Audio, ontgrendeld bij de eerste tik) plus een flits
  over het hele scherm. Zet het belsignaal van je iPhone aan. Wake Lock werkt in recente iOS-versies;
  anders verschijnt een melding om automatische vergrendeling uit te zetten.

## Volgende fases

- **Fase 2**: animatiemodus en afdruk-/PDF-export (generator en diagrameditor zijn er al).
- **Fase 3**: aanwezigheid, delen en importeren van trainingen en oefeningen (keepersbeheer en evaluaties zitten er sinds 0.4.0 in).

## Open vragen

- Welke ondergrond gebruik je het meest, en wil je bij indoor duikoefeningen standaard verbergen?
- Zijn de richtwaarden voor duiken per leeftijd goed, of hanteert je club andere grenzen?
