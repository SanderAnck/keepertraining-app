# Cloud-sync instellen met Supabase

KeeperCoach kan trainingen, oefeningen en keepers bewaren in je eigen Supabase-project, zodat ze op al je
toestellen hetzelfde zijn. De app blijft offline werken: alles staat ook lokaal, en wijzigingen gaan naar de cloud
zodra er verbinding is. Instellingen en de veldmodus blijven per toestel.

Dit doe je één keer. Reken op ongeveer 15 minuten.

## 1. Project aanmaken

1. Ga naar [supabase.com](https://supabase.com) en maak een gratis account (inloggen met GitHub kan).
2. Klik op **New project**.
   - **Name**: `keepercoach`
   - **Database password**: klik op *Generate a password* en bewaar het in je wachtwoordbeheer.
     De app heeft het niet nodig.
   - **Region**: **Central EU (Frankfurt)**, zodat de gegevens in de EU blijven.
   - Plan: **Free**.
3. Wacht tot het project klaar is (1 à 2 minuten).

## 2. Tabel en beveiliging aanmaken

1. Open links **SQL Editor** en klik op **New query**.
2. Plak de volledige inhoud van [`schema.sql`](schema.sql) en klik op **Run**.
3. Je ziet "Success. No rows returned". Het script mag je later gerust opnieuw uitvoeren.

## 3. Inlogcode in de e-mail zetten

De app logt in met een code uit de e-mail. Een inloglink werkt niet goed, want op de iPhone opent die in Safari
en niet in de beginscherm-app.

1. Open **Authentication** en dan **Emails** (of *Email Templates*).
2. Pas de sjabloon **Magic Link** aan. Vervang de inhoud door:

   ```html
   <h2>Je KeeperCoach-code</h2>
   <p>Vul deze code in de app in: <strong>{{ .Token }}</strong></p>
   ```

3. Doe hetzelfde bij **Confirm signup**. Die mail krijg je de allereerste keer.
4. Klik telkens op **Save**.

## 4. URL en sleutel doorgeven

1. Open **Project Settings** en dan **API Keys** (of klik bovenaan op **Connect**).
2. Kopieer:
   - de **Project URL**, bijvoorbeeld `https://abcdefgh.supabase.co`
   - de **publishable key** (begint met `sb_publishable_`) of, bij oudere projecten, de **anon public** key.
3. Geef die twee aan Claude, of vul ze zelf in [`js/cloud-config.js`](../js/cloud-config.js) in.

Deze sleutel is bedoeld om publiek te staan: de beveiliging per rij zorgt dat alleen jij je gegevens ziet.
Geef **nooit** de `service_role`- of `secret`-sleutel door, die geeft volledige toegang.

## 5. Inloggen in de app

1. **Maak eerst een back-up** (Instellingen → Back-up maken), voor de zekerheid.
2. Begin op het toestel met de meeste gegevens. Open **Instellingen → Cloud-sync**, vul je e-mailadres in en tik op
   **Stuur inlogcode**. Vul de code uit de mail in en tik op **Inloggen**. Je huidige gegevens gaan naar de cloud.
3. Log daarna in op je andere toestellen. Hun gegevens worden samengevoegd met die in de cloud.

## 6. Afsluiten

Als al je toestellen ingelogd zijn: open **Authentication → Sign In / Providers** (of *Settings*) en zet
**Allow new users to sign up** uit. Dan kan niemand anders een account maken in jouw project.

## Goed om te weten

- **Gratis plan**: 500 MB database, ruim genoeg voor duizenden trainingen. Een gratis project wordt **gepauzeerd na
  7 dagen zonder gebruik**. Supabase stuurt dan een mail, en met **Restore** in het dashboard staat het weer aan.
  De app werkt intussen gewoon lokaal verder en synchroniseert daarna weer.
- **E-mails**: de ingebouwde mailserver van Supabase verstuurt maar een paar mails per uur. Voor inloggen is dat genoeg.
- **Conflicten**: wijzig je hetzelfde record op twee toestellen, dan wint de laatste wijziging.
- **Verwijderen** op één toestel verwijdert ook op de andere.
- **Uitloggen** laat de gegevens op het toestel staan.
