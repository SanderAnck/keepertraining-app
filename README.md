# KeeperCoach

Keepertrainingen voorbereiden thuis en geven op het veld. KeeperCoach is een webapp (PWA) die je
vanuit Safari op je iPhone op het beginscherm zet ("Zet op beginscherm"). Na het eerste bezoek werkt
hij volledig offline. Er is geen account, geen backend en geen tracking: alle gegevens blijven op je
toestel (IndexedDB).

**Live:** https://sanderanck.github.io/keepertraining-app/

Huidige versie: zie `js/version.js` (fase 1 = `0.1.x`).

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
- **Oefeningenbibliotheek**: 35 startoefeningen over alle tien thema's, elk met uitleg,
  coachingspunten, fouten met correctie, varianten en een veldtekening. Zoeken, filteren (thema,
  leeftijd, niveau, intensiteit, materiaal) en favorieten. Eigen oefeningen toevoegen, bewerken en
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
| `js/ui.js` | Gedeelde UI-helpers (veilige HTML, toast, sheets, geluid, flits) |
| `js/field.js` | Veldmodus en timer |
| `js/logic/` | Pure logica zonder DOM: `constants`, `load` (belastingsregels, varianten), `timer`, `session`, `library`, `backupFormat` |
| `js/diagram/render.js` | Rendering van de veldtekeningen en legende (SVG) |
| `data/exercises.json` | Seedbibliotheek met 35 startoefeningen |
| `icons/` | `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`, `favicon-64.png` |
| `tests/` | Tests voor `js/logic/`, de diagrammen, de seeddata en de precache-lijst |
| `tools/build-exercises.mjs` | Bron van `data/exercises.json` (geen onderdeel van de app) |
| `package.json` | Enkel `"type": "module"` zodat node de ES-modules herkent; geen dependencies |

## Datamodel (IndexedDB `keepercoach`, `DB_VERSION` 1)

- `sessions`: `id`, `title`, `date`, `parameters` (themes, mainTheme, intensity, age, level, keepers,
  trainers, time, materials, surface), `blocks[]` (`type`, `items[]` met `exerciseId`, `variant`,
  `variantManual`, `duration` in min, `sets`, `reps`, `rest` in s, `note`), `status`, `isTemplate`,
  `notes` (good, better, perKeeper).
- `exercises`: eigen oefeningen en aanpassingen van seedoefeningen (zelfde id = aanpassing wint).
- `keepers`: leeg tot fase 3.
- `settings`: één record met sleutel `'me'` (geluid, thema, standaardparameters, favorieten, laatste back-up).
- `fieldState`: één record `'active'` met training, oefening-index en timerstatus (tijdstempels).
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

1. verhoog `self.KEEPER_VERSION` in `js/version.js`;
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

- **Fase 2**: automatische trainingsgenerator, diagrameditor, animatiemodus, afdruk-/PDF-export.
- **Fase 3**: keepersbeheer, aanwezigheid, evaluaties, delen en importeren van trainingen en oefeningen.

## Open vragen

- Welke ondergrond gebruik je het meest, en wil je bij indoor duikoefeningen standaard verbergen?
- Zijn de richtwaarden voor duiken per leeftijd goed, of hanteert je club andere grenzen?
