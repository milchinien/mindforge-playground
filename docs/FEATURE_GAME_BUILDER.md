# Feature: "Erstelle dein eigenes Spiel" - Game Builder

## Uebersicht

Ein vollstaendiger In-App Game Builder mit **zwei Erstellungs-Modi**:

1. **Template-Modus** (Einsteiger): Gefuehrter Editor fuer vordefinierte Spieltypen (Quiz, Flashcards, etc.) - kein Coding noetig
2. **Freier Modus** (Fortgeschrittene): Monaco Code-Editor + Claude KI-Chat fuer volle kreative Freiheit - Creator schreibt/generiert eigenen Spiel-Code (HTML/CSS/JS)

Die Architektur ist von Beginn an erweiterbar. Creator haben maximale Freiheit bei der Spielgestaltung, solange der Inhalt lernbezogen und angemessen ist.

---

## 1. Dev-Account ("Dev")

### Eigenschaften
- **Username**: `Dev`
- **Rolle**: Super-Admin / Creator / Premium / Teacher
- **Berechtigungen**: ALLE Features nutzbar (Game Builder, Teacher Dashboard, Shop, etc.)
- **Premium-Tier**: `dev` (neuer Tier, steht ueber allen anderen)
- **MindCoins**: 99.999 (zum Testen)
- **Seltenheit**: Nur fuer echte Entwickler (Claude, Projektinhaber, andere Devs)

### Login
- Regulaerer Firebase-Login wie alle anderen Accounts
- Email: `dev@mindforge.dev`
- Der Dev-Account wird als echter Firebase-User angelegt

### Login-Persistenz ("Angemeldet bleiben")
- **Checkbox "Angemeldet bleiben"** auf der Login-Seite (fuer ALLE User, nicht nur Dev)
- **Angekreuzt**: Session gilt 30 Tage. Timer wird bei jedem erneuten Login zurueckgesetzt.
- **Nicht angekreuzt**: Session gilt 24 Stunden. Timer wird bei erneutem Login zurueckgesetzt.
- Implementierung ueber localStorage mit Timestamp + Dauer

---

## 2. Erstellungs-Modi

### Modus-Auswahl
Beim Erstellen eines neuen Spiels waehlt der Creator zuerst den Modus:

```
+------------------------------------------+
|     Wie moechtest du dein Spiel           |
|          erstellen?                       |
|                                           |
|  [Template-Modus]    [Freier Modus]       |
|  Waehle eine Vorlage  Schreibe eigenen    |
|  und fuelle Inhalte   Code oder nutze     |
|  ein. Kein Coding     KI um dein Spiel    |
|  noetig.              zu generieren.      |
|                                           |
|  Perfekt fuer:        Perfekt fuer:       |
|  Einsteiger,          Entwickler,         |
|  Lehrer               erfahrene Creator   |
+------------------------------------------+
```

---

## 3. Template-Modus (Gefuehrter Editor)

### Single-Page Editor mit Tabs

#### Tab 1: Grundeinstellungen
- **Spieltyp auswaehlen**: Quiz (Phase 1), spaeter: Flashcards, Matching, Lueckentext, Sortieren, Wahr/Falsch
- **Titel** (3-100 Zeichen, Pflichtfeld)
- **Beschreibung** (10-2000 Zeichen, Pflichtfeld)
- **Fach/Kategorie** (aus vorhandenen Subjects: Mathematik, Physik, Chemie, Biologie, Deutsch, Englisch, Geschichte, Geographie, Informatik, Kunst, Musik)
- **Tags** (1-10 Tags, Vorschlaege + freie Eingabe)

#### Tab 2: Inhalte erstellen (Fragen-Editor)
- **Fragen-Liste** (links, sortierbar per Drag & Drop)
- **Fragen-Detail** (rechts, aktive Frage bearbeiten)
- Pro Frage:
  - Fragetext (Pflichtfeld)
  - Optionales Fragebild (Upload)
  - 2-6 Antwortmoeglichkeiten
  - Markierung der korrekten Antwort(en) - Creator entscheidet ob eine oder mehrere Antworten korrekt sind (Radio-Buttons fuer Single-Choice, Checkboxen fuer Multi-Choice)
  - Optionale Erklaerung (wird nach Beantwortung angezeigt)
- **Min 3, Max 50 Fragen**
- Buttons: "Frage hinzufuegen", "Frage duplizieren", "Frage loeschen"
- Fragen-Reihenfolge einstellbar (fest oder zufaellig)

#### Tab 3: Design & Darstellung
- **Thumbnail hochladen** (Pflichtfeld, PNG/JPG/WebP, max 5 MB)
- **Screenshots** (optional, max 5)
- **Spiel-Theme**: Standard-MindForge-Theme ist vorausgewaehlt
- **Custom Design** (optional):
  - Hintergrundfarbe / Hintergrundbild
  - Primaerfarbe (Buttons, Akzente)
  - Textfarbe
  - Schriftart-Auswahl (3-5 Optionen)
- **Live-Preview** des Designs im Mini-Fenster

#### Tab 4: Einstellungen
- **Preis**: Kostenlos oder MindCoins (1-9999)
- **Zeitlimit pro Frage**: Aus / 10s / 15s / 30s / 60s
- **Zufaellige Reihenfolge**: Ja / Nein
- **Punkte-System**: An / Aus
- **Sichtbarkeit**: Oeffentlich / Nicht gelistet (nur per Link)

#### Tab 5: Vorschau & Veroeffentlichen
- **Vollstaendige Spiel-Vorschau** (spielbar, wie der Spieler es sieht)
- **Checkliste** (automatische Validierung):
  - [ ] Titel ausgefuellt
  - [ ] Beschreibung ausgefuellt
  - [ ] Mindestens 3 Fragen
  - [ ] Alle Fragen haben mindestens eine korrekte Antwort
  - [ ] Thumbnail hochgeladen
  - [ ] Mindestens 1 Tag
  - [ ] Keine leeren Felder
- **Status-Anzeige**: Entwurf / Bereit zur Veroeffentlichung / Veroeffentlicht
- **Button "Als Entwurf speichern"**
- **Button "Veroeffentlichen"** (nur aktiv wenn Checkliste bestanden)

---

## 4. Freier Modus (Code-Editor + KI)

### Layout: Split-View (nur Desktop, min. 768px)

```
+----------------------------------------------------+
|  [index.html] [style.css] [script.js]   | KI-Chat  |
|                                          |          |
|  Monaco Code-Editor                      | [Claude] |
|  (Syntax Highlighting,                   |          |
|   Auto-Complete,                         | "Erstelle|
|   Fehleranzeige,                         |  ein     |
|   Multi-File Tabs)                       |  Memory- |
|                                          |  Spiel   |
|                                          |  mit     |
|                                          |  Tieren" |
|                                          |          |
|  +--------------------------------------+|  [Send]  |
|  |      Live Preview (iframe)           ||          |
|  |      Zeigt das Spiel in Echtzeit     ||          |
|  +--------------------------------------+|          |
+----------------------------------------------------+
```

### Monaco Code-Editor
- **Eingebettet**: Monaco Editor (gleiche Engine wie VS Code, kostenlos, Open Source)
- **3 Datei-Tabs**: `index.html`, `style.css`, `script.js`
- **Features**: Syntax Highlighting, Auto-Complete, Fehleranzeige, Zeilennummern, Suchen/Ersetzen, Code-Folding
- **Live-Preview**: iframe unter/neben dem Editor zeigt das Spiel in Echtzeit (aktualisiert bei Aenderungen)
- **Mobile**: Hinweis "Bitte nutze einen Desktop-Browser fuer den Code-Editor". Template-Modus funktioniert auf Mobile.

### Claude KI-Chat Panel
- **Position**: Rechts neben dem Editor (ein-/ausklappbar)
- **Funktion**: Creator beschreibt was er will, Claude generiert Code
- **Interaktion**:
  1. Creator schreibt Prompt (z.B. "Erstelle ein Memory-Spiel mit 12 Karten zum Thema Tiere")
  2. Claude generiert HTML/CSS/JS Code
  3. Code wird im Chat mit Syntax-Highlighting angezeigt
  4. Creator klickt "Code uebernehmen" -> Code wird in den Editor eingefuegt
  5. Creator kann weiter chatten: "Fuege einen Timer hinzu" / "Aendere die Farben" / "Mach es schwieriger"
- **Kontext**: Claude kennt den aktuellen Code im Editor und kann darauf aufbauen
- **System-Prompt**: Claude wird instruiert nur Lernspiel-bezogenen Code zu generieren

### KI-Kosten & Limits
- **In Premium enthalten**: 50 KI-Anfragen pro Monat inklusive
- **Extra-Anfragen**: Kosten MindCoins (z.B. 5 MindCoins pro Prompt)
- **Anzeige**: "Du hast noch X von 50 KI-Anfragen diesen Monat"
- **Dev-Account**: Unbegrenzte KI-Anfragen

### Metadaten fuer Freien Modus
Auch im Freien Modus muss der Creator folgendes angeben:
- **Titel** (Pflichtfeld)
- **Beschreibung** (Pflichtfeld)
- **Fach/Kategorie** (Pflichtfeld)
- **Tags** (min. 1)
- **Thumbnail** (Pflichtfeld, Upload)
- **Preis** (Kostenlos oder MindCoins)
- **Sichtbarkeit** (Oeffentlich / Nicht gelistet)

Diese werden in einem ausklappbaren Panel oder separatem Tab neben dem Code-Editor eingegeben.

---

## 5. Automatischer Review-Prozess

### Template-Modus Review
Vor Veroeffentlichung prueft das System automatisch:
1. **Vollstaendigkeit**: Alle Pflichtfelder ausgefuellt
2. **Mindestinhalt**: >= 3 Fragen, jede mit mindestens einer korrekten Antwort
3. **Medien**: Thumbnail vorhanden
4. **Qualitaet**: Keine leeren Antwortoptionen, keine identischen Fragen
5. **Inhalt**: Wortfilter fuer unangemessene Inhalte

Bei Bestehen: Spiel wird sofort veroeffentlicht.
Bei Fehlern: Creator erhaelt detaillierte Fehlermeldungen mit Links zu den betroffenen Stellen.

### Freier Modus Review
Vor Veroeffentlichung analysiert eine KI (Claude API) den Code:
1. **Sicherheit**: Keine externen API-Calls, keine verdaechtigen Scripts, keine Redirects
2. **Inhalt**: Kein unangemessener Text/Bilder im Code, lernbezogener Inhalt
3. **Funktionalitaet**: Code laeuft fehlerfrei (kein Crash beim Laden)
4. **Metadaten**: Alle Pflichtfelder (Titel, Beschreibung, Thumbnail, Tags) ausgefuellt

Bei Bestehen: Spiel wird veroeffentlicht.
Bei Bedenken: Creator erhaelt Hinweise und muss anpassen.

---

## 6. Creator Dashboard ("Meine Spiele")

### Uebersicht
- **Entwuerfe**: Liste nicht veroeffentlichter Spiele mit "Weiter bearbeiten" Button
- **Veroeffentlichte Spiele**: Liste mit Quick-Actions:
  - Bearbeiten (oeffnet den Editor mit den Spieldaten)
  - Depublizieren (nimmt Spiel offline, bleibt in "Meine Spiele")
  - Loeschen (nach Bestaetigungsdialog)
  - Versions-History anzeigen
- **Statistiken pro Spiel**:
  - Aufrufe (Views)
  - Gespielt (Plays)
  - Likes / Dislikes mit Ratio
  - Einnahmen (MindCoins, falls kostenpflichtig)
  - Durchschnittliche Spielzeit
  - Abschlussrate (% der Spieler die das Spiel abschliessen)

### Gesamt-Statistiken
- Gesamte Plays ueber alle Spiele
- Gesamte Einnahmen
- Beliebtestes Spiel
- Neueste Bewertungen/Kommentare

### Versions-History
- Creator sieht eine Liste aller Versionen seines Spiels
- Pro Version: Versionsnummer, Datum, Aenderungsnotiz
- Spieler spielen IMMER die neueste Version
- Creator kann zu einer aelteren Version zurueckrollen
- Beim Bearbeiten eines veroeffentlichten Spiels wird eine neue Version erstellt

---

## 7. Spiel-Rendering (GamePlayer)

### Zwei Render-Pfade

#### Template-Spiele (Quiz etc.)
- Spieldaten werden als **JSON** gespeichert
- Ein **GameRenderer** (React-Komponente) rendert das Spiel basierend auf den JSON-Daten
- Plugin-basiert: Jeder Spieltyp hat seinen eigenen Renderer
- **Kein iframe** - direktes React-Rendering

#### Freier-Modus-Spiele (Custom Code)
- Spiel-Code (HTML/CSS/JS) wird in einem **Sandbox-iframe** ausgefuehrt
- `sandbox="allow-scripts"` - kein Zugriff auf Parent-Window, kein Same-Origin
- Der bestehende GamePlayer wird erweitert um zwischen React-Renderer (Template) und iframe (Custom Code / ZIP-Upload) zu unterscheiden

### Quiz-Renderer Features (Template-Modus)
- Frage-Anzeige mit optionalem Bild
- Antwort-Buttons (2-6 Optionen, Single-Choice oder Multi-Choice)
- Sofortiges Feedback (richtig/falsch) mit optionaler Erklaerung
- Fortschrittsbalken (Frage X von Y)
- Timer (wenn aktiviert)
- Punkte-Zaehler (wenn aktiviert)
- Ergebnis-Screen am Ende (Score, richtige/falsche Antworten, Zeit)
- "Nochmal spielen" und "Zurueck" Buttons

---

## 8. Datenspeicherung

### Bilder (Thumbnails, Frage-Bilder, Screenshots)
- **IndexedDB** fuer alle Bilder (50-100+ MB Speicher moeglich)
- Bilder werden als Blob in IndexedDB gespeichert
- Referenz-IDs in den Spieldaten verlinken auf IndexedDB-Eintraege
- Grund: localStorage hat nur 5-10 MB Limit, Base64-Bilder sind ~33% groesser als Originale

### Entwuerfe (Spieldaten ohne Bilder)
- **localStorage** fuer schnelles Speichern der JSON-Spieldaten
- Key-Schema: `mindforge_draft_{draftId}`
- Auto-Save alle 30 Sekunden
- Manuelle Speicher-Buttons
- Freier Modus: Code-Dateien (HTML/CSS/JS) werden als Strings in localStorage gespeichert

### Veroeffentlichte Spiele
- Werden in den Runtime-State (Mock-Daten-Array) hinzugefuegt
- Erhalten eine generierte `game-xxx` ID
- Sind sofort in Browse, Search und auf dem Profil sichtbar
- Persistieren in localStorage als `mindforge_published_games`
- Beim App-Start werden sie in die mockGames-Liste gemerged

### Spiel-Daten Struktur

#### Template-Spiel (Quiz) - JSON
```json
{
  "id": "game-xxx",
  "mode": "template",
  "type": "quiz",
  "version": 1,
  "title": "Mein Quiz",
  "description": "...",
  "creatorId": "user-dev",
  "creator": "Dev",
  "thumbnailRef": "img-xxx",
  "screenshots": [],
  "tags": ["mathematik", "quiz"],
  "subject": "mathematik",
  "category": "quiz",
  "price": 0,
  "premium": false,
  "settings": {
    "timeLimit": 30,
    "randomOrder": true,
    "showPoints": true,
    "visibility": "public"
  },
  "theme": {
    "preset": "default",
    "custom": null
  },
  "questions": [
    {
      "id": "q1",
      "text": "Was ist 2+2?",
      "imageRef": null,
      "multiSelect": false,
      "options": [
        { "id": "a", "text": "3", "isCorrect": false },
        { "id": "b", "text": "4", "isCorrect": true },
        { "id": "c", "text": "5", "isCorrect": false }
      ],
      "explanation": "2+2 ergibt 4."
    }
  ],
  "stats": {
    "plays": 0,
    "views": 0,
    "likes": 0,
    "dislikes": 0
  },
  "status": "published",
  "createdAt": "2026-02-09",
  "updatedAt": "2026-02-09",
  "versions": [
    { "version": 1, "date": "2026-02-09", "note": "Erstveroeffentlichung" }
  ]
}
```

#### Freier-Modus-Spiel - JSON
```json
{
  "id": "game-xxx",
  "mode": "freeform",
  "type": "custom",
  "version": 2,
  "title": "Tier-Memory",
  "description": "Ein Memory-Spiel mit 12 Tierkarten...",
  "creatorId": "user-dev",
  "creator": "Dev",
  "thumbnailRef": "img-xxx",
  "screenshots": [],
  "tags": ["biologie", "memory", "tiere"],
  "subject": "biologie",
  "category": "memory",
  "price": 0,
  "premium": false,
  "settings": {
    "visibility": "public"
  },
  "code": {
    "html": "<!DOCTYPE html>...",
    "css": "body { ... }",
    "js": "const cards = [...];"
  },
  "stats": {
    "plays": 0,
    "views": 0,
    "likes": 0,
    "dislikes": 0
  },
  "status": "published",
  "createdAt": "2026-02-09",
  "updatedAt": "2026-02-10",
  "versions": [
    { "version": 1, "date": "2026-02-09", "note": "Erstveroeffentlichung" },
    { "version": 2, "date": "2026-02-10", "note": "Timer hinzugefuegt" }
  ]
}
```

---

## 9. Erweiterbare Architektur

### Spieltyp-System (Template-Modus)
Der Template-Editor ist als Plugin-System konzipiert:
- Jeder Spieltyp hat: Editor-Komponente + Renderer-Komponente + Validierung + Schema
- Neue Spieltypen koennen hinzugefuegt werden ohne bestehenden Code zu aendern

### Geplante Spieltypen (nach Quiz)
1. **Flashcards** - Karteikarten mit Vorder-/Rueckseite
2. **Matching** - Zuordnung (Begriff zu Definition, Bild zu Text)
3. **Lueckentext** - Text mit Luecken zum Ausfuellen
4. **Sortieren** - Elemente in richtige Reihenfolge bringen
5. **Wahr/Falsch** - Aussagen als wahr oder falsch markieren

### Freier Modus
- Unbegrenzte Spieltypen moeglich (Creator schreibt eigenen Code)
- Kein Plugin-System noetig - Creator hat volle Kontrolle

---

## 10. Abgrenzung / Nicht enthalten in diesem Feature

- **Lernprofile** (verschiedene Profile pro Account) -> Separates Feature
- **Adaptiver Schwierigkeitsgrad** (basierend auf Spieler-Performance) -> Separates Feature
- **CSV-Import fuer Fragen** -> Spaeteres Feature
- **Echtzeit-Multiplayer** -> Nicht geplant
- **ZIP-Upload** -> Bleibt bestehen als dritte Option fuer Creator die fertige Projekte hochladen wollen
- **Mobile Code-Editor** -> Nicht unterstuetzt, Hinweis "Desktop verwenden"

---

## 11. Betroffene Dateien & Neue Dateien

### Zu aendern
- `src/contexts/AuthContext.jsx` - Dev-Account + "Angemeldet bleiben" Logik
- `src/pages/auth/Login.jsx` - "Angemeldet bleiben" Checkbox
- `src/pages/Create.jsx` - Komplett umbauen: Modus-Auswahl + Editor-Router
- `src/pages/GamePlayer.jsx` - React-Renderer + iframe-Renderer Switch
- `src/data/mockGames.js` - Published Games Merge-Logik + Freier-Modus-Spiele
- `src/data/mockUsers.js` - Dev-User hinzufuegen
- `src/utils/premiumChecks.js` - Dev-Tier hinzufuegen
- `src/components/common/ProtectedRoute.jsx` - Dev-Berechtigung
- `package.json` - Neue Dependencies (Monaco Editor, ggf. Drag & Drop Library)

### Neue Dateien - Game Builder
- `src/components/gameBuilder/` - Hauptordner
  - `ModeSelector.jsx` - Template vs. Freier Modus Auswahl
  - `GameBuilderPage.jsx` - Haupt-Router/Container fuer beide Modi
  - `tabs/BasicSettingsTab.jsx` - Grundeinstellungen (Template)
  - `tabs/QuestionEditorTab.jsx` - Fragen-Editor (Template)
  - `tabs/DesignTab.jsx` - Design & Darstellung (Template)
  - `tabs/SettingsTab.jsx` - Spiel-Einstellungen (Template)
  - `tabs/PreviewPublishTab.jsx` - Vorschau & Veroeffentlichen (beide Modi)

### Neue Dateien - Code-Editor (Freier Modus)
- `src/components/codeEditor/` - Hauptordner
  - `CodeEditorLayout.jsx` - Split-View Layout (Editor + Preview + Chat)
  - `MonacoWrapper.jsx` - Monaco Editor Integration mit Tabs
  - `LivePreview.jsx` - iframe-basierte Live-Vorschau
  - `AIChatPanel.jsx` - Claude KI-Chat Panel
  - `MetadataPanel.jsx` - Titel/Beschreibung/Tags etc.

### Neue Dateien - Game Renderer
- `src/components/gameRenderer/` - Hauptordner
  - `GameRenderer.jsx` - Universeller Renderer (Switch: Template vs. Custom)
  - `QuizRenderer.jsx` - Quiz-spezifischer Renderer
  - `CustomCodeRenderer.jsx` - iframe-Renderer fuer Freier-Modus-Spiele
  - `ResultScreen.jsx` - Ergebnis-Anzeige (Template-Spiele)

### Neue Dateien - Creator Dashboard
- `src/components/creatorDashboard/` - Hauptordner
  - `CreatorDashboard.jsx` - Uebersicht (Entwuerfe, Veroeffentlicht, Stats)
  - `GameStats.jsx` - Statistiken pro Spiel
  - `VersionHistory.jsx` - Versions-Verwaltung

### Neue Dateien - Hooks & Utils
- `src/hooks/useGameDrafts.js` - Hook fuer Entwurf-Management (localStorage)
- `src/hooks/usePublishedGames.js` - Hook fuer veroeffentlichte Spiele (localStorage + Runtime)
- `src/hooks/useImageStorage.js` - Hook fuer IndexedDB Bild-Speicherung
- `src/hooks/useAIChat.js` - Hook fuer Claude API Integration
- `src/utils/gameValidation.js` - Automatische Review-Checks (Template)
- `src/utils/codeReview.js` - KI-basierte Code-Analyse (Freier Modus)
- `src/utils/imageStorage.js` - IndexedDB Wrapper fuer Bilder
- `src/data/gameThemes.js` - Vordefinierte Spiel-Themes
- `src/data/codeTemplates.js` - Starter-Code-Vorlagen fuer den Freien Modus

---

## 12. Neue Dependencies

| Paket | Zweck | Groesse |
|-------|-------|---------|
| `@monaco-editor/react` | Code-Editor (VS Code Engine) | ~500KB |
| `idb` | IndexedDB Wrapper (einfachere API) | ~3KB |
| `@dnd-kit/core` + `@dnd-kit/sortable` | Drag & Drop fuer Fragen-Sortierung | ~30KB |

Optionale KI-Integration (Backend noetig):
| Paket | Zweck |
|-------|-------|
| `@anthropic-ai/sdk` | Claude API Client (Backend/Cloud Function) |

**Hinweis**: Die Claude API darf NICHT direkt aus dem Frontend aufgerufen werden (API-Key-Sicherheit). Ein Backend-Proxy (z.B. Firebase Cloud Function) ist erforderlich.
