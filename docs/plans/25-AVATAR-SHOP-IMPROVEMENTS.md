# Plan 25: Avatar-System & Shop - Verbesserungsvorschlaege

> Erstellt nach der Implementierung des Avatar System Upgrades + MindCoins Kaufsystems.
> Diese Vorschlaege bauen auf dem aktuellen Stand auf und koennen einzeln oder zusammen umgesetzt werden.

---

## 1. Avatar-Vorschau im Profil und Navbar aktualisieren

### Problem
Die Navbar und das Profil nutzen `AvatarRenderer`, uebergeben aber nur die alten Props (`skinColor`, `hairColor`, `hairStyle`, `eyes`). Die neuen Features (Augenbrauen, Mund, Accessoires, Hintergrund) werden dort noch nicht angezeigt.

### Loesung
- Alle Stellen finden die `AvatarRenderer` nutzen (Navbar, Profil, Sidebar, Kommentare etc.)
- Die neuen Props `eyebrows`, `mouth`, `accessory`, `bgStyle` aus `user.avatar` durchreichen
- Kleine Avatare (< 40px) sollten Accessoires evtl. weglassen (zu klein zum Erkennen)

### Aufwand: Klein (1-2h)
### Dateien: Navbar.jsx, Sidebar.jsx, Profile.jsx, ggf. Kommentar-Komponenten

---

## 2. Avatar-Items aus dem Inventar tatsaechlich anwenden

### Problem
Gekaufte Avatar-Items im Inventar haben einen "Anlegen"-Button, aber dieser aendert noch nichts am Avatar. Es fehlt die Verbindung zwischen Inventar-Items und dem AvatarRenderer.

### Loesung
- `user.equippedItems` Array im User-Objekt einfuehren
- Inventar "Anlegen" Button toggled Items in `equippedItems` via `updateUser`
- AvatarRenderer prueft `equippedItems` und wendet Effekte an:
  - `frame`: SVG-Rahmen um den Avatar (golden, diamant etc.)
  - `hair_color`: Spezielle Haarfarben (Neon, Regenbogen)
  - `background`: Premium-Hintergruende (animiert, Galaxy)
  - `effect`: Aura-Effekte (Feuer, Regenbogen-Schimmer)
  - `accessory`: Premium-Accessoires (Kronen, Helme)
- Max 1 Item pro Typ gleichzeitig equipped

### Aufwand: Mittel (3-5h)
### Dateien: AvatarRenderer.jsx, Inventory.jsx, AuthContext.jsx

---

## 3. Animierte Avatar-Vorschau

### Problem
Der Avatar ist komplett statisch. Fuer ein Gaming-Erlebnis waeren subtile Animationen wuenschenswert.

### Loesung
- CSS-Animationen fuer SVG-Elemente:
  - Augen: Gelegentliches Blinzeln (alle 3-5 Sekunden)
  - Haare: Leichtes Wippen bei Hover
  - Accessoires: Glitzer-Effekt bei goldenen/diamant Items
  - Hintergrund: Langsames Rotieren bei Gradient-Hintergruenden
- `animated` Prop am AvatarRenderer (default `false`)
- Nur auf der Avatar-Seite und Profil-Seite aktivieren (Performance)

### Aufwand: Mittel (2-3h)
### Dateien: AvatarRenderer.jsx, Avatar.jsx

---

## 4. Shop: Mehrere Rabattcodes + Code-Historie

### Problem
Aktuell gibt es nur einen hardcodierten Rabattcode ("MindForge" = 100%). In Zukunft braucht es ein flexibleres System.

### Loesung
- Rabattcode-System erweitern:
  - Verschiedene Rabattstufen (10%, 25%, 50%, 100%)
  - Zeitlich begrenzte Codes (z.B. Event-Codes)
  - Einmal-Codes vs. Mehrfach-Codes
  - `user.usedCodes[]` Array um Doppelnutzung zu verhindern
- Beispiel-Codes fuer den MVP:
  - `WELCOME10` - 10% Rabatt (Erstnutzer)
  - `EVENT2025` - 50% Rabatt (Event)
  - `MindForge` - 100% (Dev/Test)
- Validierungs-Logik in eine eigene Funktion/Hook auslagern

### Aufwand: Klein (1-2h)
### Dateien: Shop.jsx, ggf. neuer Hook useDiscountCodes.js

---

## 5. Marketplace: Bewertungssystem

### Problem
Assets zeigen Bewertungen an, aber User koennen keine eigenen Bewertungen abgeben.

### Loesung
- Nach dem Kauf eines Assets: Bewertungs-Option freischalten
- Stern-Rating (1-5) + optionaler Kommentar
- Bewertungen werden in `user.ratings[]` und am Asset gespeichert
- Durchschnittsbewertung wird live aktualisiert
- Schutz: Nur gekaufte Items koennen bewertet werden, max 1 Bewertung pro Item

### Aufwand: Mittel (3-4h)
### Dateien: Marketplace.jsx, AssetCard.jsx, mockAssets.js, AuthContext.jsx

---

## 6. MindCoins-Transaktionshistorie

### Problem
Es gibt keine Uebersicht darueber, wofuer MindCoins ausgegeben oder wo sie verdient wurden.

### Loesung
- `user.transactions[]` Array mit Eintraegen:
  ```
  { type: 'purchase' | 'earn' | 'spend', amount: number, description: string, date: ISO-String }
  ```
- Neue Sektion auf der Shop-Seite oder eigene Unterseite: "Transaktionsverlauf"
- Tabellen-Ansicht mit:
  - Datum, Beschreibung, Betrag (+/- mit Farbe)
  - Filter nach Typ (Einkauf, Ausgabe, Gutschrift)
- Jede `updateUser`-Aktion die MindCoins aendert fuegt automatisch einen Eintrag hinzu

### Aufwand: Mittel (2-3h)
### Dateien: Shop.jsx (oder neue TransactionHistory.jsx), AuthContext.jsx, Marketplace.jsx

---

## 7. Avatar-Vergleich / "Vorher-Nachher"

### Problem
Beim Anpassen des Avatars sieht man nur die aktuelle Vorschau. Es fehlt ein Vergleich zum gespeicherten Avatar.

### Loesung
- Kleine "Gespeichert"-Miniatur neben der Live-Vorschau
- Oder: Toggle-Button "Vorher / Nachher"
- Zeigt den zuletzt gespeicherten Avatar neben der aktuellen Konfiguration
- Hilft beim Entscheiden ob eine Aenderung gut aussieht

### Aufwand: Klein (1h)
### Dateien: Avatar.jsx

---

## 8. Warenkorb-System fuer den Marketplace

### Problem
Aktuell kauft man Items einzeln per Klick. Bei mehreren Items waere ein Warenkorb besser.

### Loesung
- "In den Warenkorb" statt "Jetzt kaufen" als primaere Aktion
- Warenkorb-Icon in der Navbar mit Badge-Counter
- Warenkorb-Seite mit:
  - Alle Items auflisten
  - Einzeln entfernen
  - Gesamtpreis berechnen
  - "Alle kaufen" Button (Sammelkauf, MindCoins einmal abziehen)
- Warenkorb in `localStorage` persistieren

### Aufwand: Gross (4-6h)
### Dateien: Neue Warenkorb-Komponente, Marketplace.jsx, Navbar.jsx, AssetCard.jsx

---

## 9. Avatar-Presets / Schnellauswahl

### Problem
Neue User muessen jeden Aspekt einzeln konfigurieren. Vorgefertigte Presets wuerden den Einstieg erleichtern.

### Loesung
- 6-8 vorgefertigte Avatar-Presets (z.B. "Krieger", "Gelehrter", "Kuenstler", "Hacker")
- Angezeigt als Preset-Galerie oberhalb der Tabs
- Klick auf Preset uebernimmt alle Einstellungen
- Danach weiter individuell anpassbar
- Optional: Eigene Presets speichern ("Meine Looks")

### Aufwand: Klein-Mittel (2-3h)
### Dateien: Avatar.jsx, ggf. neue Preset-Daten

---

## 10. Saisonale/Event-Items im Shop

### Problem
Der Shop hat immer die gleichen drei Pakete. Fuer wiederkehrendes Engagement braucht es zeitlich begrenzte Angebote.

### Loesung
- "Aktuelle Angebote" Sektion oben im Shop
- Zeitlich begrenzte Pakete mit Countdown-Timer
- Saisonale Avatar-Items (Weihnachten, Halloween, Sommer etc.)
- Event-exklusive Items die nur waehrend Events kaufbar sind
- `availableUntil` Feld an Paketen/Items
- Timer-Komponente die herunter zaehlt

### Aufwand: Mittel (3-4h)
### Dateien: Shop.jsx, mockAssets.js, neue Timer-Komponente

---

## Priorisierte Reihenfolge

| Prio | Vorschlag | Aufwand | Impact |
|------|-----------|---------|--------|
| 1 | Avatar-Vorschau ueberall updaten (#1) | Klein | Hoch - Konsistenz |
| 2 | Inventar-Items tatsaechlich anwenden (#2) | Mittel | Hoch - Kernfeature |
| 3 | Avatar-Presets (#9) | Klein | Mittel - UX |
| 4 | Transaktionshistorie (#6) | Mittel | Mittel - Transparenz |
| 5 | Mehr Rabattcodes (#4) | Klein | Mittel - Flexibilitaet |
| 6 | Bewertungssystem (#5) | Mittel | Mittel - Community |
| 7 | Avatar-Vergleich (#7) | Klein | Klein - Nice-to-have |
| 8 | Animierte Avatare (#3) | Mittel | Mittel - Polish |
| 9 | Warenkorb (#8) | Gross | Mittel - Komfort |
| 10 | Saisonale Items (#10) | Mittel | Hoch - Engagement |

---

## Technische Schuld (Quick Fixes)

- **devFirestore Persistenz**: Jetzt in localStorage, aber bei Logout werden alte Firestore-Daten nicht bereinigt. Fuer Tests evtl. ein `clearDevFirestore()` Helper hinzufuegen.
- **Avatar-Daten-Schema**: `eyes` im User-Objekt vs. `eyeType` im Avatar-Config. Einheitliche Benennung waere besser.
- **Marketplace Kauf ohne Confirmation**: Aktuell wird sofort gekauft beim Klick. Ein "Bist du sicher?"-Dialog waere sinnvoll bei teuren Items.
- **Shop Balance-Update**: Nach dem Kauf im Modal aktualisiert sich die angezeigte Balance erst nach Modal-Schliessen. Sollte live aktualisieren.
