# Plan 26-14: Social Features

> **Priorität:** Nice-to-have (Langfristig)
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- Freundschafts-System (Add, Accept, Decline)
- Follower-System (einseitig)
- Social Feed mit 18+ Activity-Typen
- Profilseiten mit Bio und Social Links
- Keine Direktnachrichten
- Keine Gruppen/Clans
- Keine Community-Foren

---

> **WARNUNG: Jugendschutz & Moderation**
> Eine Lernplattform mit potenziell minderjährigen Nutzern hat besondere Anforderungen an Chat- und Kommunikations-Features:
>
> **Rechtliche Voraussetzungen (DE):**
> - Jugendmedienschutz-Staatsvertrag (JMStV) beachten
> - Content-Moderation / Meldefunktion für unangemessene Inhalte
> - Möglichkeit für Eltern, Chat-Funktionen zu deaktivieren
> - Keine unmoderierten 1:1-Chats zwischen Minderjährigen und Erwachsenen
>
> **Technische Voraussetzungen:**
> - Server-seitige Inhaltsfilterung (benötigt 26-19 Backend / Cloud Functions)
> - Report/Block-System für User
> - Chat-Logging für Moderationszwecke (DSGVO-konform!)
> - Rate-Limiting gegen Spam
>
> **Empfehlung:** Option C (Quick-Messages mit vordefinierten Texten) ist die sicherste Variante und umgeht die meisten Moderationsprobleme.

---

## Vorschlag 14.1: Direktnachrichten
- [ ] **A) Einfaches Chat-System (Empfohlen)** — 1:1 Nachrichten zwischen Freunden, Text-only, Emoji-Support
- [ ] **B) Vollständiges Chat-System** — 1:1 + Gruppen-Chat, Bilder, Reaktionen, Lesebestätigungen
- [ ] **C) Nur Quick-Messages** — Vordefinierte Nachrichten/Reaktionen (z.B. "GG!", "Gut gespielt!", "Danke!")
- [ ] **D) Kein Chat** — Social Feed und Kommentare reichen als Kommunikation

## Vorschlag 14.2: Gruppen/Clans
- [ ] **A) Lerngruppen (Empfohlen)** — Gruppen für bestimmte Fächer, gemeinsame Leaderboards, Gruppen-Challenges
- [ ] **B) Clans mit Clan-Wars** — Competitive Clans die gegeneinander in Quiz-Battles antreten
- [ ] **C) Klassen-Gruppen** — Nur für Teacher-Premium: Schulklassen als Gruppen verwalten
- [ ] **D) Keine Gruppen** — Social Features sind ausreichend, Gruppen erhöhen Komplexität

## Vorschlag 14.3: Content-Sharing
- [ ] **A) Share-Buttons (Empfohlen)** — Games, Achievements, Profil teilen via Link, WhatsApp, Twitter/X, Copy-Link
- [ ] **B) Game-Empfehlungen** — Spiele direkt an Freunde empfehlen mit persönlicher Nachricht
- [ ] **C) Social Media Integration** — Automatische Posts bei Achievements, Highscores (opt-in)
- [ ] **D) Alle drei** — Share-Buttons + Empfehlungen + Social Media als Gesamtpaket
