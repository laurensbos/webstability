# Complete Flow - Webstability Platform

## 📋 Overzicht

Dit document beschrijft de complete flow van A tot Z voor zowel de **klant** als de **developer**.

---

## 🛒 KLANT FLOW

### Stap 1: Project Aanmaken
**Pagina:** `/start`

1. Klant kiest dienst (website, webshop, drone, logo)
2. Klant kiest pakket (starter, professional, business)
3. Klant vult basisgegevens in:
   - Bedrijfsnaam
   - E-mailadres
   - Telefoonnummer
   - Wachtwoord (voor project toegang)
4. Klant klikt "Start project"

**Wat gebeurt er achter de schermen:**
- Project wordt aangemaakt in Redis (`/api/projects` POST)
- Project ID wordt gegenereerd (bijv. `WS-ABC123`)
- Google Drive map wordt automatisch aangemaakt
- Welkomstmail wordt verstuurd met:
  - Project ID
  - Wachtwoord
  - Link naar onboarding
  - Link naar Google Drive (voor bestanden uploaden)
- Developer krijgt notificatie email
- Email verificatie wordt verzonden

---

### Stap 2: Bedankt Pagina
**Pagina:** `/bedankt?project=WS-ABC123&dienst=website`

- Bevestiging dat project is aangemaakt
- Uitleg volgende stappen
- Link naar onboarding

---

### Stap 3: Onboarding Invullen
**Pagina:** `/intake/WS-ABC123`

1. Klant logt in met Project ID + wachtwoord
2. Klant vult onboarding wizard in:
   - Bedrijfsinformatie (branche, doelgroep)
   - Design voorkeuren (stijl, kleuren, voorbeeldsites)
   - Content (teksten, pagina's, logo)
   - Bestanden uploaden naar Google Drive
3. Klant klikt "Verstuur"

**Wat gebeurt er:**
- Onboarding data wordt opgeslagen (`/api/client-onboarding-submit`)
- Developer krijgt notificatie

---

### Stap 4: Wachten op Design
**Pagina:** `/project/WS-ABC123`

- Klant kan status bekijken (progress bar)
- Klant kan chatten met developer
- Klant ziet updates/berichten

---

### Stap 5: Design Review
**Wanneer:** Developer stuurt design preview link

1. Klant bekijkt design via staging URL
2. Klant geeft feedback via chat OF
3. Klant keurt design goed

**Bij goedkeuring:**
- Developer stuurt betalingslink
- Project status → "design_approved"

---

### Stap 6: Betaling
**Pagina:** Mollie checkout

1. Klant ontvangt betalingslink per email
2. Klant betaalt via iDEAL/creditcard
3. Na succesvolle betaling:
   - Project status → "development"
   - Klant krijgt bevestigingsmail
   - Developer krijgt notificatie

---

### Stap 7: Development & Review
**Pagina:** `/project/WS-ABC123`

1. Developer bouwt website
2. Klant kan voortgang volgen
3. Bij voltooiing: klant krijgt review verzoek
4. Klant keurt website goed

---

### Stap 8: Website Live! 🎉
**Pagina:** `/project/WS-ABC123`

- Project status → "live"
- Klant krijgt "Website Live" email met:
  - Live URL
  - Tips voor onderhoud
  - Contact informatie

---

## 👨‍💻 DEVELOPER FLOW

### Dashboard Toegang
**Pagina:** `/developer`
**Wachtwoord:** `N45eqtu2!jz8j0v`

---

### Overzicht Tab
- Alle lopende projecten
- Quick actions per project:
  - 📤 Uploads klaar → Bekijk materialen
  - 🎨 Start design → Maak ontwerp
  - ✅ Wacht op goedkeuring → Check feedback
  - 💳 Wacht op betaling → Stuur herinnering
  - 🚀 Klaar voor live → Zet live

---

### Projecten Tab
**Per project zie je:**
- Status badge (fase)
- Klantgegevens
- Pakket & prijs
- Betaalstatus
- Google Drive link
- Onboarding status

**Acties:**
1. **Fase wijzigen** - Klik op fase badge
2. **Berichten sturen** - Chat icoon
3. **Betalingslink sturen** - Credit card icoon
4. **Herinnering sturen** - Klok icoon
5. **Project bewerken** - Potlood icoon
6. **Email versturen** - Email icoon

---

### Berichten Tab
- Alle chats per project
- Ongelezen indicator
- Template berichten (snelle reacties)
- Berichten worden automatisch naar klant gemaild

---

### Betalingen Tab
- Overzicht alle betalingen
- Stuur nieuwe betalingslink:
  1. Selecteer project
  2. Vul bedrag in
  3. (Optioneel) Voeg korting toe
  4. Verstuur → Klant krijgt email met betaallink

---

### Email Log Tab
- Alle verstuurde emails
- Per email: type, ontvanger, datum, status
- Filter op type (welcome, payment, reminder, etc.)

---

## 🔄 STATUS FLOW

```
onboarding → design → design_approved → development → review → live
     ↓           ↓                            ↓
  [Klant vult   [Developer     [Na betaling  [Developer
   intake in]    maakt design]  begint bouw]  vraagt feedback]
```

**Betaalstatus:**
```
pending → awaiting_payment → paid
             ↓
          [Betalingslink
           verstuurd]
```

---

## 📧 AUTOMATISCHE EMAILS

| Trigger | Email aan | Type |
|---------|-----------|------|
| Project aangemaakt | Klant | welcome |
| Project aangemaakt | Developer | project_created |
| Onboarding ingediend | Developer | onboarding_complete |
| Design klaar | Klant | design_ready |
| Betalingslink verstuurd | Klant | payment_link |
| Betaling ontvangen | Klant | payment_confirmation |
| Fase wijziging | Klant | phase_change |
| Website live | Klant | website_live |
| Nieuw bericht | Klant/Developer | new_message |
| Deadline herinnering | Klant | reminder |

---

## 🔗 BELANGRIJKE URLs

### Klant
- Start project: `webstability.nl/start`
- Onboarding: `webstability.nl/intake/{projectId}`
- Project status: `webstability.nl/project/{projectId}`
- Wachtwoord vergeten: `webstability.nl/wachtwoord-vergeten`

### Developer
- Dashboard: `webstability.nl/developer`

### Emails
- Magic links bevatten 1-klik login tokens (geldig 7 dagen)

---

## ✅ CHECKLIST: Is alles werkend?

### Project Aanmaken
- [x] `/start` pagina laadt correct
- [x] Alle diensten tonen (website, webshop, drone, logo)
- [x] Pakket selectie werkt
- [x] Formulier validatie werkt
- [x] Project wordt opgeslagen in Redis
- [x] Welkomstmail wordt verstuurd
- [x] Developer notificatie wordt verstuurd
- [x] Google Drive map wordt aangemaakt

### Onboarding
- [x] `/intake/{projectId}` laadt project data
- [x] Wachtwoord verificatie werkt
- [x] Wizard stappen navigeren correct
- [x] Data wordt opgeslagen
- [x] Bestanden kunnen naar Drive

### Project Status
- [x] `/project/{projectId}` toont correcte status
- [x] Progress bar werkt
- [x] Chat functie werkt
- [x] Bestanden uploaden werkt (Drive integratie)

### Developer Dashboard
- [x] Login werkt
- [x] Projecten laden correct
- [x] Fase wijzigen werkt
- [x] Berichten versturen werkt
- [x] Betalingslinks versturen werkt
- [x] Email templates werken
- [x] Herinneringen versturen werkt

### Betalingen
- [x] Mollie integratie werkt
- [x] Betalingslink email verstuurd
- [x] Webhook update project status
- [x] Bevestigingsmail verstuurd

### Emails
- [x] SMTP configuratie werkt
- [x] Alle email templates bestaan
- [x] Emails worden gelogd
- [x] Magic links werken

---

## 🚀 Quick Start voor een Leek

### Als je een klant bent:
1. Ga naar `webstability.nl/start`
2. Kies wat je nodig hebt (website, webshop, etc.)
3. Kies je pakket en vul je gegevens in
4. Je krijgt direct een email met je inloggegevens
5. Vul de onboarding in (duurt ~5 minuten)
6. Wij maken je ontwerp binnen 5-7 dagen
7. Keur het ontwerp goed en betaal
8. Binnen 7 dagen is je website live!

### Als je de developer bent:
1. Ga naar `webstability.nl/developer`
2. Log in met het wachtwoord
3. Bekijk de "Quick Actions" voor wat er nu moet gebeuren
4. Per project:
   - Check uploads → Maak design
   - Stuur design naar klant via chat
   - Wacht op goedkeuring
   - Stuur betalingslink
   - Bouw website na betaling
   - Zet live als klant akkoord is

---

## 📞 Support

Bij problemen:
- Email: info@webstability.nl
- Telefoon: 06-44712573
- WhatsApp: 06-44712573

---

## 💬 COMMUNICATIE TIJDENS HET PROCES

### Kanalen voor klanten:
| Kanaal | Wanneer gebruiken | Responstijd |
|--------|-------------------|-------------|
| **In-app Chat** | Vragen over project, feedback | Binnen 24 uur |
| **WhatsApp** | Snelle vragen, urgente zaken | Binnen uren |
| **Email** | Formele communicatie | Binnen 24-48 uur |
| **Telefoon** | Uitgebreide discussies | Ma-Vr 9:00-18:00 |

### Automatische emails aan klant:
1. **Welkomstmail** - Direct na aanmelding (met wachtwoord + Drive link)
2. **Fase-updates** - Bij elke fase-wijziging
3. **Design klaar** - Wanneer design preview beschikbaar is
4. **Betalingslink** - Na design goedkeuring
5. **Betalingsbevestiging** - Na succesvolle betaling
6. **Website Live!** - Wanneer website online is
7. **Deadline herinneringen** - Als actie nodig is van klant

### Berichten systeem:
- Klant stuurt bericht → Developer krijgt email notificatie
- Developer stuurt bericht → Klant krijgt email met link naar portaal
- Alle berichten zichtbaar in projectportaal
- "Magic links" in emails voor 1-klik toegang (7 dagen geldig)

---

## 🏠 NA DE LIVEGANG

### Wat de klant kan doen:
Het project status portaal verandert in het **LivePortal** met:

1. **Overzicht Tab:**
   - Live website link
   - Uptime status
   - Laatste wijzigingen
   - Pakket informatie

2. **Wijzigingen Aanvragen:**
   - Beschrijf wat je wilt veranderen
   - Prioriteit kiezen (laag/normaal/urgent)
   - Verzoek wordt direct naar developer gestuurd
   - *Inbegrepen: 2 kleine wijzigingen per maand*

3. **Account Tab:**
   - Contactgegevens wijzigen
   - Wachtwoord resetten
   - Facturen bekijken

4. **Contact Tab:**
   - Direct chatten
   - WhatsApp link
   - Email adres
   - Telefoonnummer

### Maandelijkse betalingen:
- **Automatisch** via Mollie subscription
- Eerste betaling = eenmalig + maandelijks
- Daarna elke maand automatisch
- Klant kan opzeggen met 1 maand opzegtermijn (na 3 maanden)

### Wat de developer ziet:
- Live projecten in aparte kolom
- Wijzigingsverzoeken binnenkomen als berichten
- Subscription status per project
- Churn alerts (als klant lang niet ingelogd is)

### Wijzigingsverzoeken afhandelen:
1. Klant stuurt verzoek via LivePortal
2. Developer krijgt notificatie
3. Developer voert wijziging door
4. Developer stuurt bericht "Wijziging doorgevoerd"
5. Klant controleert en geeft akkoord

---

## 📊 VOOR EEN LEEK: IS DIT MAKKELIJK GENOEG?

### Voor de klant: ✅ JA
- **Duidelijke stappen** - Wizard-achtige flow
- **Geen technische kennis nodig** - Alles wordt uitgelegd
- **Meerdere contactmethoden** - WhatsApp voor snelle hulp
- **Visuele voortgang** - Progress bar met fases
- **1-klik toegang** - Magic links in emails
- **Na livegang** - Simpel wijzigingsformulier

### Voor de developer: ✅ JA
- **Welcome Tour** - Uitleg bij eerste login
- **Hulp & Proces knop** - Altijd beschikbaar
- **Pakket-specifieke checklists** - Weet precies wat te doen
- **"Volgende stap" indicator** - Per project zichtbaar
- **Email log** - Zie welke emails verstuurd zijn
- **Quick Actions** - Belangrijkste taken bovenaan

### Verbeterpunten voor de toekomst:
1. **Video tutorials** - Korte video's voor klanten
2. **Kennisbank** - FAQ's en handleidingen (al aanwezig op /kennisbank)
3. **Chat widget** - Live chat optie op website
4. **Mobile app** - Push notificaties voor updates
