# Plan 26-16: Monetarisierung & Premium

> **Priorität:** Nice-to-have (Langfristig)
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- 3 Tiers: Free, Creator (9,99€), Teacher (14,99€)
- MindCoins: 6 Kaufstufen (4,99€ – 99,99€)
- Discount-Codes implementiert
- Kein echtes Payment-Gateway (Mock)
- MindCoins nur durch Kauf/Events, NICHT durch Gameplay
- Avatar-Items als Hauptausgabe für MindCoins

---

> **WARNUNG: Rechtliche Voraussetzungen**
> Echte Zahlungsabwicklung erfordert neben der technischen Integration auch rechtliche Grundlagen:
>
> **Rechtliches (zwingend vor Go-Live):**
> - Impressum mit Handelsregister-Eintrag (bei Gewerbebetrieb)
> - AGB mit Widerrufsbelehrung (Fernabsatzgesetz)
> - Datenschutzerklärung (DSGVO) mit Payment-Provider-Klauseln
> - Jugendschutz: Zahlungen durch Minderjährige nur mit elterlicher Zustimmung
> - USt-IdNr. und steuerliche Behandlung klären (Kleinunternehmerregelung vs. Regelbesteuerung)
>
> **Bei Creator Revenue-Share (70%) zusätzlich:**
> - Steuerliche Behandlung für Creator (Honorar? Gewerbeschein nötig?)
> - AGB für Creator mit Haftungsregelung
> - Auszahlungsmodalitäten (Schwellwert, Frequenz, Steuerbescheinigung)
>
> **Voraussetzung:** 26-19 Backend (Cloud Functions für sichere Payment-Logik, Security Rules für MindCoin-Transaktionen)

---

## Vorschlag 16.1: Payment-Integration
- [ ] **A) Stripe (Empfohlen)** — Marktführer, einfache Integration, Subscriptions + Einmalzahlungen, EU-DSGVO-konform
- [ ] **B) PayPal + Stripe** — Zwei Payment-Provider für maximale Abdeckung
- [ ] **C) Firebase Extensions (Stripe)** — Firebase-native Stripe-Integration, weniger Custom-Code
- [ ] **D) Paddle** — All-in-one Payment + Tax, kümmert sich um MwSt für EU-Länder

## Vorschlag 16.2: Neue Revenue-Streams
- [ ] **A) Creator-Revenue-Share (Empfohlen)** — Creator verdienen 70% der MindCoins wenn ihre Paid-Games gespielt werden
- [ ] **B) Werbe-Integration** — Optionale Werbung für Free-User, Premium = werbefrei
- [ ] **C) Geschenk-MindCoins** — User können MindCoins an andere verschenken (Geschenkkarten)
- [ ] **D) Bildungs-Lizenzen** — Schulen/Unis können Bulk-Lizenzen für Teacher-Premium kaufen

## Vorschlag 16.3: Premium-Features erweitern
- [ ] **A) Premium-exklusive Themes (Empfohlen)** — Spezielle UI-Themes, animierte Profil-Rahmen, exklusive Hintergründe
- [ ] **B) Erweiterte Statistiken** — Premium-User sehen detaillierte Lernanalysen, Stärken/Schwächen-Profil
- [ ] **C) Priority in Leaderboards** — Premium-User-Badges in Leaderboards, Premium-Filter
- [ ] **D) Alle drei** — Themes + Stats + Leaderboard-Features als Premium-Bundle
