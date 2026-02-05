# 🎓 MindForge - Vollständige Projektbeschreibung

## 📌 Was ist MindForge?

**MindForge** ist eine Webseite (die im Browser läuft, ohne Installation), auf der Menschen Lernspiele spielen und erstellen können. Die Plattform verbindet zwei Welten:
1. **Gaming** - Spielerische Unterhaltung mit grafischen Benutzeroberflächen, Punktesystemen und interaktiven Elementen
2. **Education** - Bildungsinhalte aus allen Bereichen (Mathematik, Sprachen, Naturwissenschaften, Geschichte, etc.)

**Wie funktioniert es?**
- Benutzer können sich kostenlos registrieren und Tausende von Lernspielen durchsuchen und spielen
- Spiele werden von anderen Benutzern erstellt und hochgeladen (nur mit Premium-Mitgliedschaft möglich)
- Die Plattform läuft komplett im Webbrowser - keine Software-Installation nötig
- Alle Spiele sind HTML5-basiert (moderne Webtechnologie) und laufen direkt im Browser

**Kernwerte (Grundprinzipien) der Plattform:**
- 🎮 **Gaming-meets-Education** - Lernen soll Spaß machen wie ein Videospiel
- 🌍 **Community-getrieben** - Die Inhalte werden von der Nutzergemeinschaft erstellt, nicht nur von einer Firma
- 🔧 **Creator-freundlich** - Wer Spiele erstellen möchte, bekommt einfache Werkzeuge
- 💡 **Zugänglich & inklusiv** - Jeder kann mitmachen, unabhängig von Alter, Vorbildung oder technischem Wissen

---

## 🎯 Vision & Mission (Langfristige Ziele)

### Vision (Das große Zukunftsbild)
Eine Welt erschaffen, in der Lernen nicht mehr als langweilig oder schwierig empfunden wird, sondern:
- **Spielerisch** ist - wie ein Computerspiel, das man gerne spielt
- **Sozial** ist - man lernt gemeinsam mit Freunden und tauscht sich aus
- **Für jeden zugänglich** ist - unabhängig von Geld, Wohnort oder Bildungsstand

### Mission (Was wir konkret tun, um die Vision zu erreichen)
MindForge macht es einfach, Lernspiele zu erstellen (bisher war das nur für professionelle Programmierer möglich). Dadurch entsteht eine weltweite Gemeinschaft aus:
- **Pädagogen** - Lehrer und Erzieher, die ihr Fachwissen in Spiele einbringen
- **Entwicklern** - Menschen mit technischen Fähigkeiten, die Spiele programmieren
- **Lernenden** - Alle Menschen, die etwas Neues lernen möchten

Die Plattform "demokratisiert" die Spielentwicklung, das heißt: Sie macht sie für normale Menschen zugänglich, nicht nur für große Firmen.

---

## 👥 Zielgruppen (Für wen ist MindForge gedacht?)

### 1. **Spieler/Lernende** (Die Hauptnutzer - können alle Spiele kostenlos spielen)

MindForge richtet sich an Menschen jeden Alters, die durch Spielen lernen möchten:
- **Kinder (6-12 Jahre)** - Grundschulfächer spielerisch üben
- **Jugendliche (13-18 Jahre)** - Schulfächer für Prüfungen trainieren
- **Studierende** - Universitätsfächer interaktiv lernen
- **Erwachsene (Lebenslang Lernende)** - Neue Fähigkeiten oder Hobbys erlernen

**Wichtig:** Die Spiele haben unterschiedliche Schwierigkeitsgrade, sodass jeder auf seinem Niveau starten kann. Man braucht **keine Vorkenntnisse** und die Plattform ist **komplett kostenlos nutzbar** (man muss nur Spiele spielen, nicht erstellen).

### 2. **Premium Creator** (Spielentwickler - können eigene Spiele hochladen)

Das sind Menschen, die **eigene Lernspiele erstellen und hochladen** möchten. Sie zahlen eine monatliche Gebühr (9,99€), um diese Funktion freizuschalten:
- **Lehrer & Pädagogen** - Möchten maßgeschneiderte Spiele für ihre Schüler erstellen
- **Hobby-Entwickler** - Programmieren in ihrer Freizeit und möchten ihre Spiele teilen
- **Professionelle Game Studios** - Kleine Firmen, die Lernspiele entwickeln

**WICHTIG:** Nur wer ein "Premium-Abo" (kostenpflichtiges Abonnement) hat, darf Spiele hochladen. Normale Nutzer können nur spielen, nicht erstellen.

### 3. **Lehrer/Institutionen** (Pädagogen mit erweiterten Funktionen)

Lehrer, die ein spezielles "Teacher Premium"-Abo (14,99€/Monat) haben, bekommen zusätzliche Werkzeuge:
- **Lehrer-Dashboard** - Eine spezielle Übersichtsseite nur für Lehrer
- **Klassen erstellen** - Digitale Klassenräume mit ihren Schülern anlegen
- **Spiele zuweisen** - Bestimmte Lernspiele als "Hausaufgabe" festlegen
- **Fortschritte verfolgen** - Sehen, welche Schüler die Aufgaben gemacht haben und wie gut sie waren

Dies ist besonders nützlich für Schulen, die MindForge im Unterricht einsetzen möchten.

---

## 🏗️ Technische Architektur (Wie ist MindForge aufgebaut?)

**Was bedeutet "Architektur"?** - Die technische Architektur beschreibt, welche Technologien (Programmiersprachen, Werkzeuge, Dienste) verwendet werden, um die Webseite zu bauen.

### Frontend Stack (Die Benutzeroberfläche - was der Nutzer sieht)

Das "Frontend" ist alles, was im Browser des Nutzers läuft - die sichtbare Webseite mit Buttons, Bildern und Animationen.

**Verwendete Technologien:**

- **React 18+** - Eine moderne JavaScript-Bibliothek, um interaktive Webseiten zu bauen (entwickelt von Meta/Facebook)
  - *Warum?* Macht es einfach, komplexe Benutzeroberflächen zu erstellen, die schnell reagieren

- **Three.js** - Eine JavaScript-Bibliothek für 3D-Grafiken im Browser (basiert auf WebGL-Technologie)
  - *Warum?* Ermöglicht es, 3D-Spiele direkt im Browser laufen zu lassen, ohne separate Programme

- **Tailwind CSS** - Ein modernes CSS-Framework zum Gestalten der Webseite (Farben, Layout, Abstände)
  - *Was ist CSS?* Die "Styling-Sprache" für Webseiten - macht Dinge hübsch und ordnet sie an
  - *Warum Tailwind?* Schneller und konsistenter als normales CSS zu schreiben

- **React Router** - Ein Werkzeug für die Navigation zwischen Seiten (z.B. von Home zu Profil)
  - *Warum?* Ermöglicht URLs wie `/profile/michel1` ohne die Seite neu zu laden

- **Vite** - Ein Build-Tool (baut die vielen Code-Dateien zu einer fertigen Webseite zusammen)
  - *Warum?* Viel schneller als ältere Tools wie "Create React App"

### Backend Stack (Der Server - was im Hintergrund läuft)

Das "Backend" ist der Teil, der Daten speichert, Nutzer verwaltet und Dateien hostet. Läuft auf Servern (anderen Computern im Internet).

**Verwendete Technologie:**

- **Firebase** - Ein "Backend-as-a-Service" von Google (man muss keinen eigenen Server programmieren)
  - **Authentication** - Kümmert sich um Anmeldung/Registrierung mit Benutzername + Passwort
  - **Firestore** - Eine NoSQL-Datenbank (speichert Nutzerdaten, Spiele-Infos, Kommentare, etc.)
    - *Was ist NoSQL?* Eine flexible Datenbank, die Daten in "Dokumenten" statt Tabellen speichert
  - **Storage** - Speichert große Dateien (hochgeladene Spiele, Bilder, Videos)
  - **Hosting** - Stellt die Webseite online bereit (wird später für die finale Version verwendet)

**Warum Firebase?** Es ist einfach zu nutzen, skaliert automatisch (funktioniert mit 10 oder 10 Millionen Nutzern) und spart Zeit, weil man nicht alles selbst programmieren muss.

### Game Technologies (Wie laufen die Spiele?)

Die Spiele selbst nutzen verschiedene Web-Technologien, die alle im Browser funktionieren:

- **HTML5 Canvas** - Eine Zeichen-Technologie für 2D-Spiele (wie ein digitales Whiteboard im Browser)
  - *Beispiel:* Ein Mathe-Quiz mit einfachen Grafiken

- **WebGL/Three.js** - Technologie für 3D-Spiele mit echter 3D-Grafik
  - *Beispiel:* Eine Physik-Simulation mit fallenden Bällen in 3D

- **Web Audio API** - Spielt Sounds und Musik im Browser ab
  - *Beispiel:* Hintergrundmusik oder Sound-Effekte bei richtigen Antworten

- **WebSockets** - Technologie für Echtzeitkommunikation (optional, für Zukunft geplant)
  - *Wofür?* Multiplayer-Spiele, wo mehrere Spieler gleichzeitig spielen

---

## 🎨 Design System (Wie sieht MindForge aus?)

Ein "Design System" ist ein Set von Regeln und Bausteinen für das visuelle Aussehen der Webseite. Es sorgt dafür, dass alles einheitlich und professionell aussieht.

### Farbschema (Welche Farben werden verwendet?)

**Primäre Farben (Hauptfarben, die überall vorkommen):**
- **Dunkelblau**: `#1e3a8a` - Ein dunkles, professionelles Blau
  - *Wo?* In der Navigationsleiste oben und in Überschriften
  - *Warum?* Wirkt vertrauenswürdig und erinnert an Bildung

- **Orange**: `#f97316` - Ein leuchtendes, warmes Orange
  - *Wo?* Für wichtige Buttons ("Jetzt Spielen"), Highlights und Akzente
  - *Warum?* Zieht Aufmerksamkeit und wirkt energiegeladen (Gaming-Feeling)

**Sekundäre Farben (Unterstützende Farben):**
- **Grau-Töne**: Verschiedene Abstufungen für Hintergründe und Text
  - Dunkelgrau `#1f2937` - Haupthintergrund im Dark Mode
  - Mittelgrau `#374151` - Karten und Container
  - Hellgrau `#9ca3af` - Unwichtigerer Text

- **Weiß**: `#ffffff` - Für Haupttext im Dark Mode

- **Erfolg-Grün**: `#10b981` - Zeigt erfolgreiche Aktionen an (z.B. "Spiel hochgeladen!")

- **Fehler-Rot**: `#ef4444` - Zeigt Fehler an (z.B. "Falsches Passwort")

**Was ist eine Hexadezimal-Farbe (#1e3a8a)?** Das ist ein Code, mit dem Computer Farben darstellen. Jede Farbe hat einen eindeutigen Code.

### Themes (Farbthemen - hell oder dunkel?)

- **Dark Mode** (Dunkelmodus) - Der Standard
  - Dunkler Hintergrund, heller Text
  - Besser für die Augen bei längerer Nutzung
  - Beliebter bei Gamern

- **Light Mode** (Hellmodus) - Optional umschaltbar
  - Heller Hintergrund, dunkler Text
  - Klassisches Webseiten-Design
  - Besser bei hellem Umgebungslicht

Nutzer können in den Einstellungen zwischen beiden wechseln.

### Typografie (Schriftarten)

**Typografie** beschreibt, welche Schriftarten (Fonts) verwendet werden.

- **Inter Bold** - Für Überschriften (Haupttitel, wichtige Texte)
  - *Was ist Inter?* Eine moderne, gut lesbare Schriftart speziell für Bildschirme
  - *Was ist Bold?* Fettgedruckt/fett, für mehr Betonung

- **Inter Regular** - Für normalen Text (Beschreibungen, Fließtext)
  - *Regular* = normale Schriftstärke (nicht fett, nicht dünn)

- **Fira Code** - Für Programmcode (wenn irgendwo Code angezeigt wird)
  - Eine spezielle Schriftart, die Code besser lesbar macht

---

## 🖥️ UI/UX Struktur (Wie ist die Webseite aufgebaut?)

**Was ist UI/UX?**
- **UI (User Interface)** = Benutzeroberfläche - Wie die Webseite aussieht (Buttons, Farben, Layout)
- **UX (User Experience)** = Benutzererfahrung - Wie einfach und angenehm die Webseite zu nutzen ist

### Top Navigation Bar (Die obere Menüleiste)

An jeder Stelle der Webseite ist oben eine Leiste mit wichtigen Links und Informationen:

```
┌──────────────────────────────────────────────────────────────────┐
│ [🔥 MindForge] [Mindbrowser] [Marketplace] [Create] [🔍 Search]  │
│                                    [Michel1] [🔔] [💰 500] [⚙️]   │
└──────────────────────────────────────────────────────────────────┘
```

**Erklärung der einzelnen Komponenten (Bausteine):**

**Linke Seite:**
- **🔥 MindForge Logo** - Das Logo der Webseite
  - Klickt man drauf, kommt man zur Startseite (Home)

- **Mindbrowser** - Link zur großen Spiele-Bibliothek
  - Zeigt ALLE verfügbaren Spiele in vielen Kategorien
  - Unterschied zu Home: Home ist personalisiert, Mindbrowser zeigt alles

- **Marketplace** - Link zum Asset-Store (Marktplatz)
  - Hier können Creator 3D-Modelle, Sounds, Grafiken kaufen/verkaufen
  - *Was ist ein Asset?* Ein wiederverwendbarer Baustein für Spiele (z.B. ein 3D-Charakter)

- **Create** - Link zum Upload-Bereich (nur für Premium-Mitglieder sichtbar)
  - Hier können Premium-Nutzer eigene Spiele hochladen
  - Zeigt auch das Creator-Dashboard (Übersicht eigener Spiele)

- **🔍 Search** - Suchfeld zum Finden von Spielen
  - Sucht nach Spielnamen und Tags (Schlagwörtern wie "Mathe", "3D")

**Rechte Seite (persönliche Informationen):**
- **Michel1** - Der Benutzername des angemeldeten Nutzers
  - Klickt man drauf, öffnet sich ein Dropdown-Menü mit: Profil, Einstellungen, Abmelden

- **🔔** - Benachrichtigungsglocke
  - Zeigt System-Updates, neue Freundschaftsanfragen, Neuigkeiten

- **💰 500** - MindCoins-Guthaben
  - Zeigt die virtuelle Währung des Nutzers (erklärung kommt später)
  - Kann nur durch Echtgeld-Kauf oder Events verdient werden

- **⚙️** - Einstellungen
  - Theme ändern (Dark/Light Mode)
  - Sprache ändern
  - Sonstige Einstellungen

### Home vs. Mindbrowser - Was ist der Unterschied?

**Home-Seite** (`/` - die URL ist einfach die Hauptdomain):
- **Personalisiert** - Zeigt Inhalte, die für DICH interessant sind
- **Kompakt** - Weniger Kategorien, nur das Wichtigste
- **Features:**
  - Freundesliste (wer ist online?)
  - Zuletzt gespielte Spiele (deine Historie)
  - Für dich empfohlene Spiele (basierend auf dem, was du zuvor gespielt hast)

**Mindbrowser-Seite** (`/browse` - browse = durchsuchen):
- **Komplett** - Zeigt ALLE verfügbaren Spiele
- **Viele Kategorien** - Featured, Trending, Beliebt, Neu, Nach Tags, etc.
- **Zum Entdecken** - Man kann stundenlang neue Spiele finden

### Sidebar (Die linke Seitenleiste)

Auf der linken Seite jeder Seite (außer im Spiel-Vollbildmodus) ist eine Seitenleiste mit persönlichen Links:

```
┌─────────────────┐
│  👤 Michel1     │  ← Dein Name mit Avatar
├─────────────────┤
│  🏠 Home        │  ← Zur Startseite
│  👤 Profil      │  ← Dein öffentliches Profil
│  👥 Friends     │  ← Deine Freundesliste
│  🎭 Avatar      │  ← Avatar anpassen
│  🎒 Inventory   │  ← Dein Inventar (gekaufte Items)
│  👥 Groups      │  ← Gruppen (später)
├─────────────────┤
│ [Get Premium]   │  ← Premium-Abo kaufen (wenn nicht Premium)
├─────────────────┤
│  📅 Events      │  ← Aktuelle Events/Challenges
└─────────────────┘
```

**Erklärung der Links:**

- **Home** - Zurück zur personalisierten Startseite
- **Profil** - Dein öffentliches Profil, das andere Nutzer sehen können
- **Friends** - Liste deiner Freunde, Freundschaftsanfragen senden/annehmen
  - *Was ist das?* Ein bidirektionales Freundschaftssystem (wie Facebook, nicht wie Twitter)
- **Avatar** - Dein 2D-Profilbild anpassen (Hautfarbe, Haare, Augen)
- **Inventory** - Dein digitales Inventar (Sammlung):
  - Gekaufte Avatar-Items (Kleidung, Accessoires)
  - Gekaufte Premium-Spiele
  - Gekaufte Marketplace-Assets
- **Groups** - Gruppen/Communities (für Zukunft geplant)
- **Get Premium** - Button zum Premium-Abo kaufen (verschwindet, wenn man schon Premium hat)
- **Events** - Zeitlich begrenzte Challenges mit MindCoins-Belohnungen

**Besondere Features:**
- **Kollapsibel** (einklappbar) - Auf kleineren Bildschirmen (Tablets) kann man die Sidebar einklappen, um mehr Platz zu haben
- **Hover-Effekte** - Wenn man mit der Maus über einen Link fährt, verändert er sich (z.B. wird heller)
- **Premium-Button** - Auffällig platziert, damit Nutzer Premium entdecken (wichtig für Geschäftsmodell)

### Main Content Area (Home)

**Home-Seite** ist kompakter und personalisierter als Mindbrowser:

```
┌─────────────────────────────────────────────────────────────┐
│  HOME                                                       │
│                                                             │
│  👥 Freunde (später)                                        │
│  [Avatar+Name] [Avatar+Name] [Avatar+Name] [→ Alle]        │
│  🟢 Online: 3/12                                            │
│                                                             │
│  🔥 Featured                                                │
│  [──────────────────────────────────────────────────────]  │
│  [   Kuratierte Top-Spiele (3-5 Games)                  ]  │
│                                                             │
│  🕐 Zuletzt gespielt (Top 10)                               │
│  [Game] [Game] [Game] [Game] [Game] [Game] [Game] [→]      │
│                                                             │
│  💡 Für dich empfohlen                                      │
│  [Game] [Game] [Game] [Game] [Game] [Game] [Game] [→]      │
└─────────────────────────────────────────────────────────────┘
```

**Freundesliste-Anzeige (wie im Screenshot):**
```
┌──────────────────────────────────────────────────┐
│  👥 Freunde                        [Alle ansehen]│
├──────────────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐        │
│  │ 🧑   │  │ 👩   │  │ 🧔   │  │ 👦   │        │
│  │ Anna │  │ Max  │  │ Peter│  │ Lisa │        │
│  │🟢    │  │🟢    │  │⚫    │  │🟢    │        │
│  └──────┘  └──────┘  └──────┘  └──────┘        │
│                                                  │
│  [+ Freunde finden]                              │
└──────────────────────────────────────────────────┘
```

**Game Card Design:**
```
┌──────────────┐
│              │  ← Thumbnail (16:9)
│  [Colorful]  │
│   Graphic    │
│              │
├──────────────┤
│ Spieltitel   │
│ by Creator   │
│ 👍 245  👎 12│  ← Likes/Dislikes
└──────────────┘
```

---

## 📄 Seitenstruktur

### 1. Home (`/`)
- **Freundesliste** (oben, mit Avatar + Online-Status) - später
- Featured Games (3-5 kuratierte Top-Spiele)
- Zuletzt gespielt (Top 10, persönlich)
- Für dich empfohlen (basierend auf gespielten Spielen)

### 1b. Mindbrowser (`/browse`)

**Vollständige Spiele-Bibliothek zum Entdecken:**

```
┌─────────────────────────────────────────────────────────────┐
│  MINDBROWSER                                                │
│                                                             │
│  🔥 Featured                                                │
│  [Game] [Game] [Game] [Game] [Game] [→]                     │
│                                                             │
│  📈 Trending (Last 7 days)                                  │
│  [Game] [Game] [Game] [Game] [Game] [Game] [Game] [→]      │
│                                                             │
│  ⭐ Beliebt                                                 │
│  [Game] [Game] [Game] [Game] [Game] [Game] [Game] [→]      │
│                                                             │
│  🎲 Meist gespielt                                          │
│  [Game] [Game] [Game] [Game] [Game] [Game] [Game] [→]      │
│                                                             │
│  🆕 Neu veröffentlicht                                      │
│  [Game] [Game] [Game] [Game] [Game] [Game] [Game] [→]      │
│                                                             │
│  🏷️ Nach Tags browsen                                      │
│  [Mathe] [Physik] [Sprachen] [Geschichte] [3D] [Quiz]      │
└─────────────────────────────────────────────────────────────┘
```

### 2. Game Detail Page (`/game/:id`)

```
┌─────────────────────────────────────────────────────────────┐
│  [← Zurück]                                                 │
│                                                             │
│  ┌─────────────┐  Spieltitel                               │
│  │             │  von CreatorName                           │
│  │  Thumbnail  │                                            │
│  │             │  👍 1.2k  👎 45    [▶ Jetzt Spielen]       │
│  └─────────────┘                                            │
│                                                             │
│  📝 Beschreibung                                            │
│  Lorem ipsum dolor sit amet...                             │
│                                                             │
│  📸 Screenshots (Optional)                                  │
│  [Screenshot 1] [Screenshot 2] [Screenshot 3]              │
│                                                             │
│  🏷️ Tags                                                    │
│  [Mathe] [3D] [Quiz] [Singleplayer]                        │
│                                                             │
│  📊 Stats                                                   │
│  Views: 15.4k  |  Plays: 8.2k  |  Erstellt: 12.01.2026     │
└─────────────────────────────────────────────────────────────┘
```

### 3. Profile (`/profile/:username`)

```
┌─────────────────────────────────────────────────────────────┐
│  ┌───────┐  Michel1                    [Edit Profile]      │
│  │ Avatar│  "Mathe-Enthusiast"                             │
│  │  🧑    │  📍 Deutschland | 🔗 twitter.com/michel        │
│  └───────┘  💎 Premium Member                              │
│                                                             │
│  [Erstellte Spiele]  [Favoriten]  [Achievements]          │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  📦 Erstellte Spiele (12)                                   │
│  [Game] [Game] [Game] [Game] [Game] [Game]                 │
│                                                             │
│  ⭐ Lieblingsspiele (45)                                    │
│  [Game] [Game] [Game] [Game] [Game] [Game]                 │
└─────────────────────────────────────────────────────────────┘
```

### 4. Create Page (`/create`) **[Nur Premium]**

```
┌─────────────────────────────────────────────────────────────┐
│  CREATE                                                     │
│                                                             │
│  [+ Neues Spiel hochladen]                                  │
│                                                             │
│  📊 Meine Spiele (8)                                        │
│  ─────────────────────────────────────────────────────────  │
│  │                                                          │
│  │  ┌────┐  Mathe-Quiz Pro               [Edit] [Delete]   │
│  │  │img │  👁️ 1.2k  ▶️ 845  👍 234                         │
│  │  └────┘  Status: ✅ Veröffentlicht                       │
│  │                                                          │
│  │  ┌────┐  Physik-Sim                   [Edit] [Delete]   │
│  │  │img │  👁️ 450   ▶️ 201  👍 67                          │
│  │  └────┘  Status: 🔄 In Review                            │
│  │                                                          │
└─────────────────────────────────────────────────────────────┘
```

**Upload-Dialog (Modal):**
```
┌────────────────────────────────────┐
│  📤 Neues Spiel hochladen          │
├────────────────────────────────────┤
│  Spieltitel *                      │
│  [_____________________________]   │
│                                    │
│  Beschreibung *                    │
│  [_____________________________]   │
│  [_____________________________]   │
│                                    │
│  Spiel-Datei (ZIP) *               │
│  [Datei auswählen...]              │
│                                    │
│  Thumbnail (PNG/JPG) *             │
│  [Bild hochladen...]               │
│                                    │
│  Screenshots (Optional)            │
│  [+ Bilder hinzufügen]             │
│                                    │
│  Tags (flexibel)                   │
│  [Mathe] [X] [3D] [X] [+Tag]       │
│                                    │
│  Preis                             │
│  ⚪ Kostenlos  ⚪ Premium (💰 ___) │
│                                    │
│  [Abbrechen]  [📤 Hochladen]       │
└────────────────────────────────────┘
```

### 5. Marketplace (`/marketplace`)

```
┌─────────────────────────────────────────────────────────────┐
│  MARKETPLACE                                                │
│                                                             │
│  [Assets] [Templates] [Scripts] [Audio]                    │
│                                                             │
│  🔥 Top Assets                                              │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐          │
│  │ 3D Char│  │SciFi Env│  │Quiz TMpl│  │Math Lib│          │
│  │ 💰 150 │  │ 💰 200  │  │ FREE    │  │ FREE   │          │
│  └────────┘  └────────┘  └────────┘  └────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### 6. Avatar Customization (`/avatar`)

```
┌─────────────────────────────────────────────────────────────┐
│  AVATAR ANPASSEN                                            │
│                                                             │
│  ┌──────────────┐                                          │
│  │              │       Hautfarbe:                         │
│  │    🧑        │       [🟤] [🟠] [🟡] [⚪] [🟫]           │
│  │   Avatar     │                                          │
│  │   Preview    │       Haarfarbe:                         │
│  │              │       [⚫] [🟤] [🟡] [🔴] [🔵]           │
│  │              │                                          │
│  └──────────────┘       Frisur:                            │
│                         [Short] [Long] [Bald] [Curly]      │
│                                                             │
│                         Augen:                              │
│                         [Round] [Almond] [Sleepy]          │
│                                                             │
│                         [Zurücksetzen]  [💾 Speichern]     │
└─────────────────────────────────────────────────────────────┘
```

### 7. Inventory (`/inventory`)

```
┌─────────────────────────────────────────────────────────────┐
│  INVENTORY                                                  │
│                                                             │
│  [Avatar Items]  [Gekaufte Spiele]  [Assets]               │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  👕 Avatar Items (15)                                       │
│  [Hat] [Shirt] [Pants] [Shoes] [Accessory]                 │
│                                                             │
│  🎮 Gekaufte Spiele (3)                                     │
│  [Premium Game 1] [Premium Game 2] [Premium Game 3]        │
│                                                             │
│  🎨 Marketplace Assets (7)                                  │
│  [3D Model] [Texture Pack] [Sound FX] [Script]             │
└─────────────────────────────────────────────────────────────┘
```

### 8. Friends Page (`/friends`)

**Friends-System (wie auf der referenzierten Plattform):**

```
┌─────────────────────────────────────────────────────────────┐
│  FREUNDE                                   [+ Freund hinzufügen] │
│                                                             │
│  [Alle]  [Online (12)]  [Offline (23)]  [Anfragen (2)]     │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  🟢 Online (12)                                             │
│  ┌──────────────────────────────────────────────┐          │
│  │  ┌──────┐                                    │          │
│  │  │  🧑  │  Anna Schmidt         🟢 Online    │          │
│  │  └──────┘  Spielt: Mathe-Quiz Pro           │          │
│  │            [Beitreten]  [Profil]  [Nachricht] │        │
│  └──────────────────────────────────────────────┘          │
│                                                             │
│  ┌──────────────────────────────────────────────┐          │
│  │  ┌──────┐                                    │          │
│  │  │  👨  │  Max Müller           🟢 Online    │          │
│  │  └──────┘  Im Home-Screen                    │          │
│  │            [Profil]  [Nachricht]             │          │
│  └──────────────────────────────────────────────┘          │
│                                                             │
│  ⚫ Offline (23)                                            │
│  [Anna] [Peter] [Lisa] [Tom] [Sarah] [...Alle anzeigen]    │
│                                                             │
│  📬 Freundschaftsanfragen (2)                               │
│  ┌──────────────────────────────────────────────┐          │
│  │  ┌──────┐  Julia Weber                       │          │
│  │  │  👩  │  möchte dein Freund sein            │          │
│  │  └──────┘  [✓ Annehmen]  [✗ Ablehnen]        │          │
│  └──────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

**Friends-Features:**
- **Bidirektionale Freundschaften** (nicht Follow-System)
- **Freundschaftsanfragen** senden/akzeptieren/ablehnen
- **Online-Status** (🟢 Online, ⚫ Offline)
- **Activity-Anzeige** ("Spielt: Mathe-Quiz")
- **Beitreten-Button** wenn Freund im Spiel ist (später)
- **Direktnachrichten** (später)
- Wird im **Home-Tab** prominent angezeigt (Freundesliste oben)

### 8. Search Results (`/search?q=mathe`)

```
┌─────────────────────────────────────────────────────────────┐
│  Suchergebnisse für "mathe"                                 │
│                                                             │
│  Filter:                                                    │
│  [x] Spiele  [ ] Creator  [ ] Assets                        │
│                                                             │
│  Sortierung: [Relevanz ▼]                                   │
│                                                             │
│  📦 Spiele (127 Ergebnisse)                                 │
│  ┌────┐  Mathe-Quiz Pro                                    │
│  │img │  by MathMaster · 👍 1.2k · Tags: [Mathe] [Quiz]    │
│  └────┘                                                     │
│                                                             │
│  ┌────┐  Algebra Adventure                                 │
│  │img │  by EduGames · 👍 845 · Tags: [Mathe] [Story]      │
│  └────┘                                                     │
└─────────────────────────────────────────────────────────────┘
```

### 9. Lehrer-Dashboard (`/teacher`) **[Nur Lehrer-Accounts]**

```
┌─────────────────────────────────────────────────────────────┐
│  LEHRER-DASHBOARD                                           │
│                                                             │
│  [+ Neue Klasse erstellen]                                  │
│                                                             │
│  📚 Meine Klassen (3)                                       │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  📖 Klasse 7A - Mathematik                                  │
│     👥 28 Schüler                                           │
│     📝 Zugewiesene Spiele (5)                               │
│     • Algebra Quiz (78% abgeschlossen)                      │
│     • Geometrie-Puzzle (45% abgeschlossen)                  │
│     [Details anzeigen]                                      │
│                                                             │
│  📖 Klasse 8B - Physik                                      │
│     👥 25 Schüler                                           │
│     📝 Zugewiesene Spiele (3)                               │
│     [Details anzeigen]                                      │
└─────────────────────────────────────────────────────────────┘
```

### 10. Events (`/events`)

**Zeitlich begrenzte Challenges um MindCoins zu gewinnen:**

```
┌─────────────────────────────────────────────────────────────┐
│  EVENTS                                                     │
│                                                             │
│  🎯 Aktive Events                                           │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  🔥 Mathe-Marathon                         [LIVE]           │
│  ┌────────────────────────────────────────────────┐        │
│  │  Löse 100 Mathe-Aufgaben in 7 Tagen!          │        │
│  │                                                │        │
│  │  🏆 Belohnung: 500 MindCoins                   │        │
│  │  ⏰ Noch 3 Tage 12:45:23                       │        │
│  │                                                │        │
│  │  Fortschritt: ████████░░░░  45/100            │        │
│  │                                                │        │
│  │  [Weiterspielen]                               │        │
│  └────────────────────────────────────────────────┘        │
│                                                             │
│  🧪 Physik-Challenge                    [STARTET IN 2T]    │
│  ┌────────────────────────────────────────────────┐        │
│  │  Meistere 5 Physik-Simulationen                │        │
│  │  🏆 Belohnung: 250 MindCoins                   │        │
│  │  [Benachrichtigung aktivieren]                 │        │
│  └────────────────────────────────────────────────┘        │
│                                                             │
│  📜 Vergangene Events                                       │
│  • Winter-Quiz-Special (500 MindCoins) - Abgeschlossen     │
│  • Neujahrs-Challenge (1000 MindCoins) - Teilgenommen      │
└─────────────────────────────────────────────────────────────┘
```

**Event-Mechanik:**
- Von MindForge-Team organisiert
- Zeitlich begrenzt (7-14 Tage)
- Belohnungen: MindCoins (Echtgeld-Währung)
- Alle User können teilnehmen (Free + Premium)
- Tracking: Fortschritt wird automatisch gespeichert

---

## 🎮 Game Player

### In-Game Experience

Wenn ein Spieler auf "Jetzt Spielen" klickt:

1. **Fullscreen-Übergang**
   - Sanfte Animation
   - Navbar/Sidebar verschwinden
   - Game übernimmt vollständigen Viewport

2. **Game-Interface**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                      [GAME CONTENT]                         │
│                                                             │
│                    (HTML5 Canvas/WebGL)                     │
│                                                             │
│                                                             │
│                                                             │
│                  [ESC drücken für Menü]                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

3. **ESC-Menü (Overlay)**
```
┌────────────────────────────────────┐
│                                    │
│         PAUSE                      │
│                                    │
│    [▶ Fortsetzen]                  │
│    [🔄 Neustart]                   │
│    [⚙️ Einstellungen]              │
│    [🏠 Zurück zu MindForge]        │
│    [🚪 Spiel verlassen]            │
│                                    │
└────────────────────────────────────┘
```

### Game Lifecycle

```javascript
// Pseudo-Code
onGameStart() {
  enterFullscreen();
  loadGameAssets();
  trackPlaySession();
  showGame();
}

onEscPressed() {
  pauseGame();
  showEscMenu();
}

onReturnToMindForge() {
  saveProgress();
  exitFullscreen();
  navigateToHome();
  incrementPlayCount();
}
```

---

## 💾 Datenbank-Schema (Wie werden die Daten gespeichert?)

**Was ist ein Datenbank-Schema?**
Ein "Schema" ist ein Plan/Bauplan, der beschreibt, wie Daten in der Datenbank strukturiert sind. Wie ein Formular, das immer die gleichen Felder hat.

**Was ist Firestore?**
Firestore ist die NoSQL-Datenbank von Firebase. Im Gegensatz zu klassischen SQL-Datenbanken mit Tabellen, speichert Firestore Daten in "Collections" (Sammlungen) und "Documents" (Dokumenten).

*Analog:* Eine Collection ist wie ein Ordner, jedes Document ist wie eine Karteikarte in diesem Ordner.

### Collections (Die verschiedenen "Ordner" in der Datenbank)

#### 1. `users` - Alle Nutzerinformationen

Jeder Nutzer hat ein Document mit all seinen Informationen:

```javascript
{
  // Grundlegende Identifikation
  uid: "user123",                      // Eindeutige Nutzer-ID (von Firebase vergeben)
  username: "Michel1",                 // Benutzername (sichtbar für alle)
  email: "michel@example.com",         // E-Mail-Adresse (optional, nicht öffentlich)
  createdAt: timestamp,                // Wann wurde der Account erstellt?

  // Profil-Informationen
  avatar: {                            // Anpassbares Profilbild
    skinColor: "#ffcc99",              // Hautfarbe als Hexcode
    hairColor: "#000000",              // Haarfarbe
    hairStyle: "short",                // Frisur ("short", "long", "bald", "curly")
    eyes: "round"                      // Augenform ("round", "almond", "sleepy")
  },
  bio: "Mathe-Enthusiast",             // Kurze Selbstbeschreibung
  socialLinks: {                       // Links zu Social Media (optional)
    twitter: "twitter.com/michel",
    youtube: null                      // null = nicht angegeben
  },

  // Premium-Status
  isPremium: true,                     // Hat der Nutzer Premium? (true/false)
  premiumSince: timestamp,             // Seit wann hat er Premium?
  premiumTier: "creator",              // Welches Premium? "creator" oder "teacher"

  // Rollen & Berechtigungen
  isTeacher: false,                    // Ist es ein Lehrer-Account?
  isVerified: true,                    // Ist der Account verifiziert? (Badge)

  // Statistiken (öffentlich sichtbar)
  totalPlays: 1234,                    // Wie oft hat der Nutzer Spiele gespielt?
  gamesCreated: 8,                     // Wie viele Spiele hat er erstellt?
  followers: 45,                       // Wie viele Leute folgen ihm?
  following: 23,                       // Wie vielen Leuten folgt er?

  // Währung
  mindCoins: 500,                      // Aktueller MindCoins-Stand

  // Einstellungen (persönlich)
  theme: "dark",                       // Dark Mode oder Light Mode?
  language: "de"                       // Sprache (de = Deutsch)
}
```

**Erklärung wichtiger Begriffe:**
- **timestamp** = Ein Zeitstempel (Datum + Uhrzeit), gespeichert als Zahl
- **null** = "Nichts" / "nicht vorhanden"
- **true/false** = Boolean (Ja/Nein-Wert)

#### 2. `games` - Alle Spiele-Informationen

Jedes hochgeladene Spiel hat ein Document mit all seinen Daten:

```javascript
{
  gameId: "game123",                   // Eindeutige Spiel-ID

  // Grundinformationen
  title: "Mathe-Quiz Pro",             // Spieltitel (sichtbar für alle)
  description: "Ein spannendes Quiz...", // Beschreibung des Spiels
  creatorId: "user123",                // ID des Entwicklers (Referenz zu users)
  creatorName: "Michel1",              // Name des Entwicklers (zur schnelleren Anzeige)

  // Dateien (gespeichert in Firebase Storage)
  gameUrl: "gs://bucket/games/game123/index.html",  // Pfad zur Spiel-Datei
  thumbnail: "gs://bucket/thumbnails/game123.jpg",  // Vorschaubild
  screenshots: [                       // Optional: Zusätzliche Screenshots
    "gs://bucket/screenshots/game123_1.jpg",
    "gs://bucket/screenshots/game123_2.jpg"
  ],

  // Metadaten (beschreibende Informationen)
  tags: ["Mathe", "Quiz", "3D", "Singleplayer"],  // Schlagwörter für Suche
  isPremium: false,                    // Kostet das Spiel etwas?
  price: 0,                            // Preis in MindCoins (0 = kostenlos)

  // Statistiken (werden automatisch aktualisiert)
  views: 15400,                        // Wie oft wurde die Detailseite angesehen?
  plays: 8200,                         // Wie oft wurde das Spiel gestartet?
  likes: 1234,                         // Anzahl der Likes (Daumen hoch)
  dislikes: 45,                        // Anzahl der Dislikes (Daumen runter)

  // Zeitstempel
  createdAt: timestamp,                // Wann wurde das Spiel hochgeladen?
  updatedAt: timestamp,                // Wann wurde es zuletzt bearbeitet?

  // Status (Veröffentlichungs-Status)
  status: "published",                 // Mögliche Werte:
                                       // "draft" = Entwurf (noch nicht veröffentlicht)
                                       // "review" = In Überprüfung (wartet auf Freigabe)
                                       // "published" = Veröffentlicht (für alle sichtbar)
                                       // "banned" = Gesperrt (gegen Regeln verstoßen)

  // Multiplayer-Support
  supportsMultiplayer: false           // Kann man zu zweit/mehreren spielen?
}
```

**Wichtige Erklärungen:**

- **gs://bucket/...** = Das ist ein Pfad in Firebase Storage (Cloud-Speicher). "gs" steht für "Google Storage"
- **tags** = Flexible Schlagwörter, die der Creator selbst vergibt. Keine festen Kategorien!
- **views vs. plays** = View = Detail-Seite angeschaut, Play = Tatsächlich auf "Spielen" geklickt
- **status** = Verhindert, dass unfertige oder unangemessene Spiele öffentlich sind

#### 3. `playHistory`
```javascript
{
  userId: "user123",
  gameId: "game123",
  playedAt: timestamp,
  sessionDuration: 1200, // seconds
  completed: true,
  score: 850 // optional, game-specific
}
```

#### 4. `ratings`
```javascript
{
  ratingId: "rating123",
  userId: "user123",
  gameId: "game123",
  type: "like", // "like" | "dislike"
  createdAt: timestamp
}
```

#### 5. `teachers`
```javascript
{
  teacherId: "user123",
  schoolName: "Gymnasium Musterstadt",
  verified: true,
  classes: [
    {
      classId: "class123",
      name: "Klasse 7A - Mathematik",
      students: ["user456", "user789"],
      assignedGames: [
        {
          gameId: "game123",
          assignedAt: timestamp,
          dueDate: timestamp
        }
      ]
    }
  ]
}
```

#### 6. `marketplace`
```javascript
{
  assetId: "asset123",

  // Info
  title: "SciFi Character Pack",
  description: "10 low-poly characters",
  creatorId: "user123",

  // Type
  type: "3d-model", // "3d-model" | "texture" | "audio" | "script"

  // Files
  fileUrl: "gs://bucket/assets/asset123.zip",
  previewImage: "gs://bucket/previews/asset123.jpg",

  // Pricing
  isFree: false,
  price: 150, // MindCoins

  // Stats
  downloads: 234,
  rating: 4.7,

  createdAt: timestamp
}
```

#### 7. `notifications`
```javascript
{
  notificationId: "notif123",
  userId: "user123",

  type: "system", // "system" | "follow" | "friend"
  title: "Neue Features verfügbar!",
  message: "Dark Mode ist jetzt live",

  read: false,
  createdAt: timestamp
}
```

#### 8. `follows`
```javascript
{
  followerId: "user123",
  followingId: "user456",
  followedAt: timestamp
}
```

---

## 🔐 Authentifizierung & Autorisierung

### User Roles

| Role | Permissions |
|------|-------------|
| **Free User** | Browse, Play Games, Like/Dislike |
| **Premium Creator** | + Upload Games, Access Analytics, Sell on Marketplace |
| **Premium Teacher** | + Create Classes, Assign Games, View Student Progress |
| **Verified Creator** | + Featured Badge, Priority Review |
| **Admin/Moderator** | + Manage Users, Moderate Content, Feature Games |

### Authentication Flow

```
1. User besucht MindForge
2. Klick auf "Registrieren"
3. Eingabe: Username + Passwort
4. Firebase Auth erstellt Account
5. Firestore User-Dokument angelegt
6. Redirect zu Home (eingeloggt)
7. First-Time Welcome-Tooltip erscheint
```

**Einfache Auth (MVP):**
- ✅ Keine Email-Verifikation
- ✅ Nur Username + Passwort
- ❌ Kein Social Login (später)
- ❌ Keine 2FA (später)

**First-Time User Experience:**

Beim ersten Login erscheint ein einfacher Tooltip:

```
┌──────────────────────────────────────┐
│  🎉 Willkommen bei MindForge!        │
├──────────────────────────────────────┤
│  Entdecke Lernspiele oder erstelle  │
│  eigene mit Premium!                 │
│                                      │
│  💡 Tipp: Probiere Featured-Games    │
│     im Home-Screen aus!              │
│                                      │
│  [Los geht's!]                       │
└──────────────────────────────────────┘
```

Kein komplexes Onboarding - nur ein freundlicher Hinweis.

### Protected Routes

```javascript
// Nur für eingeloggte User
/profile/:username
/inventory
/avatar
/settings

// Nur für Premium
/create
/teacher (nur Premium Teacher)

// Öffentlich
/
/game/:id
/search
/marketplace
```

---

## 💰 Monetarisierung & Business Model (Wie verdient MindForge Geld?)

**Was ist Monetarisierung?** Die Art und Weise, wie eine Plattform Geld verdient, um sich zu finanzieren (Server, Entwickler bezahlen, etc.)

### Einnahmequellen (Wie kommt Geld rein?)

#### 1. Premium-Abonnements (Monatliche Mitgliedschaften)

MindForge bietet zwei kostenpflichtige Abonnements (Abos) an:

**Creator Premium** (9,99€ pro Monat)
- ✅ **Spiele hochladen & veröffentlichen** - Die Hauptfunktion: Eigene Spiele teilen
- ✅ **Unbegrenzte Uploads** - So viele Spiele hochladen wie man möchte
- ✅ **Basis-Analytics** - Statistiken sehen: Wie oft wurde mein Spiel gespielt? Wie viele Likes?
- ✅ **Verkauf von Premium-Spielen** - Eigene Spiele kostenpflichtig anbieten
- ✅ **Creator-Badge** - Sichtbares Abzeichen neben dem Namen (zeigt Premium-Status)

**Teacher Premium** (14,99€ pro Monat)
- ✅ **Alle Creator-Features** - Alles von oben
- ✅ **Lehrer-Dashboard** - Spezielle Übersichtsseite für Lehrkräfte
- ✅ **Klassen erstellen & verwalten** - Digitale Klassenräume mit Schülerlisten
- ✅ **Spiele zuweisen** - Hausaufgaben/Lernspiele als Aufgabe festlegen
- ✅ **Schüler-Fortschritte tracken** - Sehen, wer die Aufgaben gemacht hat
- ✅ **Erweiterte Analytics** - Detailliertere Statistiken pro Schüler

**WICHTIG für die Playground-Version (MVP = Minimum Viable Product = erste Test-Version):**

Da dies noch eine Test-Phase ist:
- ❌ **KEIN echtes Bezahlsystem** - Man kann noch nicht wirklich mit Kreditkarte zahlen
- ✅ **Premium-Status wird manuell vergeben** - Der Admin (Du) trägt in der Firebase-Datenbank ein, wer Premium hat
- ✅ **Nur 2 Test-Nutzer** - Du und eine andere Person bekommen Premium zum Testen
- ✅ **UI zeigt alles** - Die Benutzeroberfläche sieht so aus, als könnte man Premium kaufen, aber der Kauf-Button funktioniert noch nicht wirklich

#### 2. MindCoins (Die virtuelle Währung auf MindForge)

**Was sind MindCoins?**
MindCoins sind die virtuelle Währung (digitales Geld) auf MindForge, ähnlich wie V-Bucks in Fortnite oder Robux in Roblox. Man kann damit auf der Plattform Dinge kaufen.

**Wie bekommt man MindCoins?**

Es gibt NUR 2 Wege, MindCoins zu bekommen:

1. **Mit echtem Geld kaufen:**
   - 500 MindCoins = 4,99€
   - 1200 MindCoins = 9,99€ (man bekommt 200 extra - 20% Bonus)
   - 2500 MindCoins = 19,99€ (man bekommt 500 extra - 25% Bonus)

2. **Bei offiziellen Events gewinnen:**
   - Events sind zeitlich begrenzte Challenges, die das MindForge-Team organisiert
   - Beispiel: "Löse 100 Mathe-Aufgaben in 7 Tagen und gewinne 500 MindCoins"
   - Nur vom offiziellen Team, nicht von normalen Nutzern

**WICHTIG - Man kann MindCoins NICHT bekommen durch:**
- ❌ Einfach Spiele spielen
- ❌ Achievements/Erfolge freischalten
- ❌ Jeden Tag einloggen
- ❌ Freunde einladen

*Warum nicht?* Das ist eine bewusste Design-Entscheidung. MindCoins sind eine "Premium-Währung" mit echtem Wert. Man kann sie nicht einfach "farmen" (durch viel Spielen sammeln), sonst hätten sie keinen Wert mehr.

**Wofür kann man MindCoins ausgeben?**

- **Avatar-Items** - Coole Kleidung und Accessoires für dein Profilbild
- **Premium-Spiele** - Manche Spiele kosten MindCoins (Creator entscheiden das)
- **Marketplace-Assets** - 3D-Modelle, Sounds, Grafiken für Creator
- **Donations/Geschenke** - Creator unterstützen, denen man folgt

**Wichtig:** Dies ist eine "Echtgeld-Währung", das heißt, sie hat echten Wert, weil man sie mit echtem Geld kaufen muss.

#### 3. Marketplace Revenue Share

**Asset-Verkäufe:**
- Creator: 70%
- MindForge: 30%

**Premium-Spiele:**
- Creator: 70%
- MindForge: 30%

#### 4. Sponsorships & Partnerships (Zukunft)

- Schulen/Universitäten (Bulk-Lizenzen)
- Bildungsverlage (Content-Deals)
- Marken-Integration (z.B. "Mathe mit LEGO")

---

## 📊 Analytics & Tracking

### User Analytics (Privacy-First)

**Was wird getrackt:**
- ✅ Anonymisierte Play-Sessions
- ✅ Game Views/Plays/Likes
- ✅ Öffentliche Stats (Leaderboards)
- ✅ Opt-in für erweiterte Analytics

**Was wird NICHT getrackt:**
- ❌ Persönliche Daten ohne Zustimmung
- ❌ Cross-Site-Tracking
- ❌ Verkauf von Daten an Dritte

### Creator Analytics Dashboard

Premium Creator sehen:
```
┌─────────────────────────────────────┐
│  ANALYTICS - Mathe-Quiz Pro         │
├─────────────────────────────────────┤
│  Gesamt-Views:     15.4k            │
│  Gesamt-Plays:      8.2k            │
│  Play-Rate:        53.2%            │
│                                     │
│  Likes:            1.2k  👍         │
│  Dislikes:           45  👎         │
│  Like-Ratio:       96.4%            │
│                                     │
│  Ø Spielzeit:      12:34 min        │
│  Completion-Rate:  67.8%            │
│                                     │
│  Top Länder:                        │
│   🇩🇪 Deutschland    45%             │
│   🇦🇹 Österreich     22%             │
│   🇨🇭 Schweiz        18%             │
│                                     │
│  [📊 Detaillierte Stats]            │
└─────────────────────────────────────┘
```

---

## 🛠️ MVP Playground - Entwicklungsplan

### Phase 1: Foundation ✅ (Woche 1-2)

**Setup:**
- [ ] React + Vite initialisieren
- [ ] Tailwind CSS konfigurieren
- [ ] Firebase-Projekt erstellen
- [ ] Git Repository setup

**Core UI:**
- [ ] Navigation Bar Component
- [ ] Sidebar Component
- [ ] Layout System (Grid/Flex)
- [ ] Theme System (Dark/Light)

**Authentication:**
- [ ] Firebase Auth Integration
- [ ] Login-Formular
- [ ] Registrierung-Formular
- [ ] Protected Routes

### Phase 2: Game Integration ✅ (Woche 3-4)

**Home Screen:**
- [ ] Game Card Component
- [ ] Featured Section
- [ ] Trending Section
- [ ] Kategorie-Listen
- [ ] Horizontal Scroll

**Demo Games:**
- [ ] Mathe-Quiz entwickeln (HTML5) - Sehr einfach: 5 Fragen, Proof of Concept
- [ ] Physik-Simulation entwickeln (Three.js) - Ein fallender Ball, zeigt Konzept
- [ ] Platzhalter-Games (10+) - Mock-Daten (siehe unten)
- [ ] Dummy-Thumbnails - Stock-Bilder oder KI-generiert

**Platzhalter-Spiele Mock-Daten:**
```javascript
const placeholderGames = [
  { id: 'p1', title: 'Algebra Adventure', thumbnail: 'https://picsum.photos/300/169?random=1', creator: 'MathMaster', tags: ['Mathe', 'Puzzle'], likes: 234, dislikes: 12 },
  { id: 'p2', title: 'Chemie-Labor 3D', thumbnail: 'https://picsum.photos/300/169?random=2', creator: 'ScienceGuru', tags: ['Chemie', '3D'], likes: 189, dislikes: 8 },
  { id: 'p3', title: 'Vokabel-Trainer Pro', thumbnail: 'https://picsum.photos/300/169?random=3', creator: 'LangLearn', tags: ['Englisch', 'Quiz'], likes: 456, dislikes: 23 },
  { id: 'p4', title: 'Geschichte-Quiz Europa', thumbnail: 'https://picsum.photos/300/169?random=4', creator: 'HistoryNerd', tags: ['Geschichte'], likes: 312, dislikes: 15 },
  { id: 'p5', title: 'Programmieren lernen', thumbnail: 'https://picsum.photos/300/169?random=5', creator: 'CodeAcademy', tags: ['Informatik'], likes: 678, dislikes: 34 },
  { id: 'p6', title: 'Geografie-Weltreise', thumbnail: 'https://picsum.photos/300/169?random=6', creator: 'TravelEdu', tags: ['Geografie', 'Quiz'], likes: 245, dislikes: 11 },
  { id: 'p7', title: 'Physik-Rätsel', thumbnail: 'https://picsum.photos/300/169?random=7', creator: 'ScienceGuru', tags: ['Physik', 'Puzzle'], likes: 198, dislikes: 9 },
  { id: 'p8', title: 'Mathe-Duell', thumbnail: 'https://picsum.photos/300/169?random=8', creator: 'MathMaster', tags: ['Mathe', 'Multiplayer'], likes: 523, dislikes: 28 },
  { id: 'p9', title: 'Bio-Simulator', thumbnail: 'https://picsum.photos/300/169?random=9', creator: 'BioProf', tags: ['Biologie', '3D'], likes: 367, dislikes: 19 },
  { id: 'p10', title: 'Musik-Theorie', thumbnail: 'https://picsum.photos/300/169?random=10', creator: 'MusicTeach', tags: ['Musik'], likes: 289, dislikes: 14 }
];
```

**Game Player:**
- [ ] Fullscreen-Modus
- [ ] ESC-Menü
- [ ] Game-Loading-Screen
- [ ] Zurück-Navigation

### Phase 3: Creator Tools ✅ (Woche 5-6)

**Upload System:**
- [ ] Upload-Dialog (Modal)
- [ ] ZIP-File-Handler
- [ ] Thumbnail-Upload
- [ ] Metadata-Formular
- [ ] Firebase Storage Integration

**Creator Dashboard:**
- [ ] Meine Spiele Liste
- [ ] Basis-Stats anzeigen
- [ ] Edit/Delete Funktionen
- [ ] Status-Anzeige

### Phase 4: User Features ✅ (Woche 7-8)

**Profile:**
- [ ] Profil-Seite Layout
- [ ] Avatar-System (2D)
- [ ] Erstellte Spiele Portfolio
- [ ] Favoriten-Liste

**Avatar Customization:**
- [ ] Hautfarbe-Picker
- [ ] Haarfarbe-Picker
- [ ] Frisuren-Auswahl
- [ ] Preview-Rendering

**Inventory:**
- [ ] Avatar-Items anzeigen
- [ ] Gekaufte Spiele
- [ ] Assets-Liste

### Phase 5: Social & Polish ✅ (Woche 9-10)

**Social:**
- [ ] Follow-System (Backend)
- [ ] Like/Dislike Funktionalität
- [ ] Zuletzt gespielt (Top 10)

**Search:**
- [ ] Suchfeld funktional
- [ ] Tag-basierte Suche
- [ ] Namen-Suche
- [ ] Ergebnis-Seite

**Lehrer-Tools:**
- [ ] Lehrer-Dashboard
- [ ] Klassen erstellen
- [ ] Spiele zuweisen
- [ ] Fortschritts-Tracking

**Final Polish:**
- [ ] Responsive Tweaks
- [ ] Animationen/Transitions
- [ ] Error-Handling
- [ ] Loading States
- [ ] 404 Page

---

## 🚀 Technische Anforderungen

### Performance Goals

- **Initial Load**: < 3 Sekunden
- **Time to Interactive**: < 5 Sekunden
- **Game Start**: < 2 Sekunden
- **Search Response**: < 500ms

### Browser Support

**Desktop:**
- ✅ Chrome 100+
- ✅ Firefox 100+
- ✅ Edge 100+
- ✅ Safari 15+

**Mobile:** (Später)
- ⏳ iOS Safari 15+
- ⏳ Chrome Mobile
- ⏳ Samsung Internet

### System Requirements

**Mindestanforderungen:**
- CPU: Dual-Core 2.0 GHz
- RAM: 4 GB
- GPU: WebGL-kompatibel
- Internet: 5 Mbps+

**Empfohlen:**
- CPU: Quad-Core 3.0 GHz+
- RAM: 8 GB+
- GPU: Dedizierte Grafikkarte
- Internet: 25 Mbps+

---

## 🔒 Sicherheit & Datenschutz

### Security Measures

**Firebase Security Rules:**
```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users können nur eigenes Profil bearbeiten
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }

    // Games: Premium kann erstellen, alle lesen
    match /games/{gameId} {
      allow read: if true;
      allow create: if request.auth != null
                    && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isPremium == true;
      allow update, delete: if request.auth.uid == resource.data.creatorId;
    }

    // Ratings: nur eigene bearbeiten
    match /ratings/{ratingId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Games: nur Premium-Creator können hochladen
    match /games/{gameId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.isPremium == true;
    }

    // Avatare: nur eigener User
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

### DSGVO-Konformität

- ✅ Datenminimierung (nur notwendige Daten)
- ✅ Opt-in für Analytics
- ✅ Recht auf Vergessenwerden (Account-Löschung)
- ✅ Datenexport (User kann Daten downloaden)
- ✅ Cookie-Banner (EU)
- ✅ Transparente Datenschutzerklärung

### Content Moderation (Zukunft)

**Automatische Prüfung:**
- AI-basierte Content-Scans
- Virus/Malware-Checks für Uploads
- Profanity-Filter

**Community-Moderation:**
- Report-Button
- Moderatoren-Dashboard
- Bann-System

---

## 🌐 Internationalisierung (i18n)

### Sprachen (Zukunft)

**Launch:**
- 🇩🇪 Deutsch (Primary)
- 🇬🇧 Englisch

**Phase 2:**
- 🇪🇸 Spanisch
- 🇫🇷 Französisch
- 🇮🇹 Italienisch
- 🇵🇱 Polnisch

**Implementation:**
```javascript
// i18n-Struktur
{
  "de": {
    "nav": {
      "home": "Home",
      "marketplace": "Marketplace",
      "create": "Erstellen"
    },
    "game": {
      "play": "Jetzt Spielen",
      "likes": "Gefällt mir"
    }
  },
  "en": {
    "nav": {
      "home": "Home",
      "marketplace": "Marketplace",
      "create": "Create"
    },
    "game": {
      "play": "Play Now",
      "likes": "Likes"
    }
  }
}
```

---

## 📱 Mobile Strategy (Post-MVP)

### Responsive Web (Phase 1)
- Adaptive Layout für Tablets
- Touch-optimierte Buttons
- Mobile Navigation (Hamburger-Menü)

### Native Apps (Phase 2)
- React Native (Code-Sharing)
- App Store / Play Store
- Push-Notifications
- Offline-Modus

---

## 🎯 KPIs & Success Metrics

### User Metrics
- **DAU** (Daily Active Users)
- **MAU** (Monthly Active Users)
- **Retention Rate** (D1, D7, D30)
- **Session Duration**

### Creator Metrics
- **Uploaded Games/Month**
- **Premium Conversion Rate**
- **Creator Retention**
- **Avg. Games per Creator**

### Business Metrics
- **MRR** (Monthly Recurring Revenue)
- **ARPU** (Average Revenue per User)
- **CAC** (Customer Acquisition Cost)
- **LTV** (Lifetime Value)

### Engagement Metrics
- **Plays per User/Day**
- **Games per Session**
- **Like-Ratio**
- **Search-to-Play-Rate**

---

## 🛣️ Roadmap

### MVP (3 Monate) - **Playground Phase**
- ✅ Basis-Plattform
- ✅ 2 Demo-Spiele + Platzhalter
- ✅ Upload-System
- ✅ Premium-Accounts
- ✅ Lehrer-Dashboard
- ✅ Localhost

### V1.0 (6 Monate) - **Public Beta**
- 🔄 10+ kuratierte Spiele
- 🔄 AI-Game-Generator (Beta)
- 🔄 Marketplace Launch
- 🔄 Community-Features
- 🔄 Public Hosting (Vercel)
- 🔄 Marketing-Launch

### V1.5 (9 Monate) - **Growth**
- 🔄 Mobile-Optimierung
- 🔄 50+ Spiele
- 🔄 Erweiterte Analytics
- 🔄 Multiplayer-Support
- 🔄 Partnerschaften (Schulen)

### V2.0 (12 Monate) - **Scale**
- 🔄 Native Mobile Apps
- 🔄 Internationalisierung
- 🔄 Advanced AI-Editor
- 🔄 Zertifizierungsprogramme
- 🔄 Enterprise-Features

---

## 🤝 Community & Support

### Community-Kanäle (Zukunft)
- Discord-Server
- Reddit Community
- Twitter/X
- YouTube-Tutorials

### Support
- FAQ / Wissensdatenbank
- Ticket-System
- Email-Support (Premium)
- Live-Chat (Premium Teacher)

### Creator-Programm
- Creator-Spotlights
- Wettbewerbe & Challenges
- Revenue-Sharing
- Creator-Events

---

## 📝 Rechtliches

### Benötigte Dokumente

- [ ] **Impressum** (Deutschland)
- [ ] **Datenschutzerklärung** (DSGVO)
- [ ] **AGB** (Terms of Service)
- [ ] **Nutzungsbedingungen für Creator**
- [ ] **Cookie-Richtlinie**
- [ ] **Content-Policy** (Was ist erlaubt/verboten)

### Lizenzen

**Code:**
- MIT License (Open Source?) oder Proprietary

**User-Content:**
- Creator behält Copyright
- MindForge erhält Nutzungslizenz (Verbreitung)
- Klare Guidelines für Assets (keine Raubkopien)

---

## 🎨 Brand Identity

### Logo
- **Icon**: Schmiedehammer + Gehirn (Mind + Forge)
- **Font**: Bold, Modern, Tech-Style
- **Colors**: Dunkelblau (#1e3a8a) + Orange (#f97316)

### Slogan-Ideen
- "Wo Lernen zum Spiel wird"
- "Forge Your Mind"
- "Create. Play. Learn."
- "Die Zukunft des Lernens"

### Voice & Tone
- **Freundlich** aber professionell
- **Motivierend** & inspirierend
- **Inklusiv** (alle Altersgruppen)
- **Klar** & verständlich (keine Edu-Jargon)

---

## 💡 Besondere Features

### 1. Smart Search
- Tag-basierte Suche: "Mathe" → Alle Spiele mit Tag "Mathe"
- Namen-Suche: Spezifischer Titel
- Creator-Suche: Alle Spiele eines Entwicklers
- Fuzzy-Matching für Tippfehler

### 2. Auto-Update für Spiele
- Entwickler lädt neue Version hoch
- System ersetzt alte Version nahtlos
- Spieler merken nichts
- Keine Versionskonflikte

### 3. Follow-System (ohne Feed)
- User können Creators folgen
- Benachrichtigungen bei neuen Releases
- Kein komplexer Feed nötig (MVP)

### 4. Lehrer-Dashboard
- Klassen erstellen & verwalten
- Spiele zuweisen mit Deadline
- Fortschritts-Tracking (wer hat gespielt?)
- Basis-Analytics pro Schüler

### 5. Flexible Tagging
- Keine fixen Kategorien
- Creator vergeben eigene Tags
- Community-gesteuert
- Populäre Tags werden vorgeschlagen

### 6. Dual-Theme
- Dark Mode (Standard)
- Light Mode (umschaltbar)
- System-Präferenz respektieren

### 7. Premium-Only Creation
- NUR Premium-User dürfen Spiele erstellen
- Klares Geschäftsmodell
- Qualitätskontrolle
- Free User: Browse & Play

---

## 🔧 Technische Details

### Dateistruktur (Spiel-Upload)

**Spiel-ZIP-Struktur:**
```
mein-spiel.zip
├── index.html          (Entry Point, Pflicht)
├── assets/
│   ├── textures/
│   ├── models/
│   └── sounds/
├── js/
│   ├── game.js
│   └── libs/
└── css/
    └── style.css
```

**Anforderungen:**
- ✅ `index.html` muss vorhanden sein
- ✅ Alle Pfade relativ (kein `http://`)
- ✅ Maximale Größe: 50 MB (Free) / 200 MB (Premium)
- ✅ Erlaubte Formate: HTML, CSS, JS, PNG, JPG, MP3, OGG, GLB

**Verbotene Inhalte:**
- ❌ Server-Code (PHP, Python, etc.)
- ❌ Externe API-Calls (ohne Approval)
- ❌ Malware/Tracking-Scripts

### API-Struktur (Zukunft)

**REST Endpoints:**
```
GET    /api/games              → Liste aller Spiele
GET    /api/games/:id          → Details zu Spiel
POST   /api/games              → Neues Spiel erstellen (Premium)
PUT    /api/games/:id          → Spiel updaten (Creator only)
DELETE /api/games/:id          → Spiel löschen (Creator only)

GET    /api/users/:username    → User-Profil
PUT    /api/users/:id          → Profil bearbeiten (Self only)

POST   /api/ratings            → Like/Dislike
GET    /api/ratings/:gameId    → Ratings für Spiel

GET    /api/search?q=mathe     → Suche
```

### React Komponenten-Beispiele

**GameCard Component:**
```jsx
// components/GameCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function GameCard({ game }) {
  return (
    <Link to={`/game/${game.id}`} className="game-card">
      <div className="relative">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full aspect-video object-cover rounded-t-lg"
        />
      </div>

      <div className="p-3 bg-gray-800 rounded-b-lg">
        <h3 className="font-bold text-white truncate">{game.title}</h3>
        <p className="text-sm text-gray-400">by {game.creatorName}</p>

        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            👍 {game.likes}
          </span>
          <span className="flex items-center gap-1">
            👎 {game.dislikes}
          </span>
        </div>
      </div>
    </Link>
  );
}
```

**GamePlayer Component:**
```jsx
// components/GamePlayer.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function GamePlayer() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [showEscMenu, setShowEscMenu] = useState(false);

  useEffect(() => {
    // Fullscreen aktivieren
    document.documentElement.requestFullscreen();

    // ESC-Key Handler
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        setShowEscMenu(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleReturnToMindForge = () => {
    document.exitFullscreen();
    navigate('/');
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Game iframe */}
      <iframe
        src={`/games/${gameId}/index.html`}
        className="w-full h-full border-0"
        title="Game"
      />

      {/* ESC Menu Overlay */}
      {showEscMenu && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-gray-900 p-8 rounded-lg text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">PAUSE</h2>

            <button onClick={() => setShowEscMenu(false)}
                    className="w-full btn-primary">
              ▶ Fortsetzen
            </button>

            <button className="w-full btn-secondary">
              🔄 Neustart
            </button>

            <button onClick={handleReturnToMindForge}
                    className="w-full btn-secondary">
              🏠 Zurück zu MindForge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Firebase Auth Hook:**
```jsx
// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Hole zusätzliche User-Daten aus Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        setUser({
          uid: firebaseUser.uid,
          ...userDoc.data()
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}
```

**Protected Route:**
```jsx
// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, requirePremium = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requirePremium && !user.isPremium) {
    return <Navigate to="/premium" />;
  }

  return children;
}
```

---

## 🎓 Lernziele (für dieses Projekt)

Da dies ein **Learning Project** ist:

### Du lernst:
- ✅ **React** (State Management, Hooks, Components)
- ✅ **Firebase** (Auth, Firestore, Storage)
- ✅ **Three.js** (3D im Browser)
- ✅ **Tailwind CSS** (Utility-First-Styling)
- ✅ **Game Development** (HTML5 Canvas, WebGL)
- ✅ **UX/UI Design** (Layouts, Flows, Prototyping)
- ✅ **Backend-Logic** (Database-Schema, Security Rules)
- ✅ **Deployment** (Hosting, CI/CD)
- ✅ **Product Thinking** (Features, MVP, Roadmap)

### Best Practices:
- 📝 **Komponenten-basierte Architektur**
- 📝 **State Management** (Context API / Zustand)
- 📝 **Code-Organisation** (Folder Structure)
- 📝 **Error Handling** & Loading States
- 📝 **Responsive Design**
- 📝 **Performance-Optimierung**

---

## 📚 Ressourcen & Links

### Dokumentation
- [React Docs](https://react.dev/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Three.js Docs](https://threejs.org/docs/)
- [Tailwind Docs](https://tailwindcss.com/docs)

### Tutorials
- [React + Firebase Tutorial](https://www.youtube.com/watch?v=...)
- [Three.js Basics](https://threejs.org/manual/)
- [Game Development with HTML5](https://developer.mozilla.org/en-US/docs/Games)

### Assets (für Demo-Spiele)
- [Kenney.nl](https://kenney.nl/) - Gratis Game-Assets
- [OpenGameArt](https://opengameart.org/)
- [Freesound](https://freesound.org/) - Sound-Effekte

### Design-Inspiration
- [Dribbble - Educational Platforms](https://dribbble.com/)
- [Behance - Gaming UI](https://www.behance.net/)

---

## 📦 Empfohlene Projektstruktur

```
mindforge-playground/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/          # UI-Komponenten
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── game/
│   │   │   │   ├── GameCard.jsx
│   │   │   │   ├── GamePlayer.jsx
│   │   │   │   ├── GameGrid.jsx
│   │   │   │   └── FeaturedGames.jsx
│   │   │   ├── profile/
│   │   │   │   ├── AvatarCustomizer.jsx
│   │   │   │   ├── ProfileHeader.jsx
│   │   │   │   └── GamePortfolio.jsx
│   │   │   └── common/
│   │   │       ├── Button.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Tooltip.jsx
│   │   │       └── LoadingSpinner.jsx
│   │   ├── pages/               # Seiten
│   │   │   ├── Home.jsx
│   │   │   ├── Mindbrowser.jsx
│   │   │   ├── GameDetail.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Create.jsx
│   │   │   ├── Marketplace.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   └── Auth/
│   │   │       ├── Login.jsx
│   │   │       └── Register.jsx
│   │   ├── hooks/               # Custom Hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useGames.js
│   │   │   └── useTheme.js
│   │   ├── firebase/            # Firebase Config
│   │   │   ├── config.js
│   │   │   ├── auth.js
│   │   │   └── storage.js
│   │   ├── utils/               # Helper-Funktionen
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   └── constants.js
│   │   ├── styles/              # Globale Styles
│   │   │   ├── globals.css
│   │   │   └── themes.css
│   │   ├── App.jsx              # Root Component
│   │   └── main.jsx             # Entry Point
│   ├── public/
│   │   ├── demo-games/          # Demo-Spiele
│   │   │   ├── mathe-quiz/
│   │   │   │   ├── index.html
│   │   │   │   ├── game.js
│   │   │   │   └── style.css
│   │   │   └── physik-sim/
│   │   │       ├── index.html
│   │   │       ├── simulation.js
│   │   │       └── assets/
│   │   ├── placeholders/        # Platzhalter-Thumbnails
│   │   └── assets/              # Statische Assets
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── docs/                        # Dokumentation
│   ├── MINDFORGE_PROJECT_DESCRIPTION.md
│   ├── API.md
│   └── COMPONENTS.md
├── .gitignore
├── README.md
└── CHANGELOG.md
```

**Wichtige Dateien erklärt:**

- `App.jsx` - Router-Setup, Theme-Provider, Auth-Context
- `Layout.jsx` - Navbar + Sidebar Wrapper für alle Seiten
- `useAuth.js` - Custom Hook für Firebase Auth State
- `config.js` - Firebase-Konfiguration (API Keys)
- `validators.js` - ZIP-Validierung, Input-Validation
- `constants.js` - Game-Tags, Kategorien, etc.

---

## 📖 Glossar (Wichtige Begriffe von A bis Z erklärt)

Dieses Glossar erklärt alle wichtigen Begriffe, die in MindForge verwendet werden, in einfacher Sprache.

---

### A

**Analytics**
Statistiken und Analysen über Spiele. Creator sehen: Wie oft wurde mein Spiel gespielt? Von wo kommen die Spieler? Wie lange spielen sie?

**API (Application Programming Interface)**
Eine Schnittstelle, über die verschiedene Programme miteinander kommunizieren können. Wie ein Kellner, der Bestellungen zwischen Küche (Server) und Gast (Client) übermittelt.

**Asset**
Ein wiederverwendbarer Baustein für Spiele. Beispiele: 3D-Modelle, Soundeffekte, Texturen (Oberflächen), Musik. Creator können Assets im Marketplace kaufen und in ihren Spielen verwenden.

**Avatar**
Das personalisierte 2D-Profilbild eines Nutzers. Kann angepasst werden: Hautfarbe, Haarfarbe, Frisur, Augen. Wird in der Freundesliste und im Profil angezeigt.

---

### B

**Backend**
Der Teil der Software, der auf Servern läuft und den Nutzer nicht direkt sieht. Kümmert sich um: Datenbank, Authentifizierung, Datei-Speicherung. Bei MindForge: Firebase.

**Badge**
Ein sichtbares Abzeichen neben dem Nutzernamen. Beispiele:
- 💎 Premium Badge - Zeigt Premium-Mitgliedschaft
- ✓ Verified Badge - Bestätigter/verifizierter Creator (z.B. echter Lehrer)

---

### C

**Canvas (HTML5 Canvas)**
Eine Web-Technologie zum Zeichnen von 2D-Grafiken. Wie ein digitales Whiteboard im Browser. Wird für einfache 2D-Spiele verwendet.

**Collection (Firestore)**
Eine Sammlung von ähnlichen Dokumenten in der Datenbank. Wie ein Ordner. Beispiele: "users" (alle Nutzer), "games" (alle Spiele).

**Creator**
Ein Nutzer, der Spiele erstellt und hochlädt. Muss Premium-Mitglied sein.

**CTA (Call to Action)**
Ein auffälliger Button, der den Nutzer zu einer Aktion auffordert. Beispiel: "Jetzt Spielen", "Premium kaufen".

---

### D

**Dark Mode**
Ein dunkles Farbschema (schwarzer/grauer Hintergrund, heller Text). Standard bei MindForge. Schont die Augen und ist bei Gamern beliebt.

**Dashboard**
Eine Übersichtsseite. Beispiele:
- Creator Dashboard: Zeigt eigene Spiele mit Statistiken
- Teacher Dashboard: Zeigt Klassen und Schüler-Fortschritte

**Document (Firestore)**
Ein einzelner Datensatz in einer Collection. Wie eine Karteikarte in einem Ordner. Beispiel: Das Nutzer-Dokument von "Michel1".

**DSGVO (Datenschutz-Grundverordnung)**
Europäisches Gesetz zum Schutz persönlicher Daten. MindForge muss sich daran halten: Datenminimierung, Opt-in für Tracking, Recht auf Löschung.

---

### E

**Event**
Eine zeitlich begrenzte Challenge, die vom MindForge-Team organisiert wird. Beispiel: "Löse 100 Mathe-Aufgaben in 7 Tagen". Belohnung: MindCoins.

---

### F

**Featured**
Hervorgehobene/kuratierte Top-Spiele, die vom MindForge-Team ausgewählt wurden. Erscheinen prominent auf der Startseite.

**Firebase**
Ein "Backend-as-a-Service" von Google. Bietet fertige Lösungen für: Authentifizierung, Datenbank, Datei-Speicherung, Hosting. MindForge nutzt Firebase, um keine eigenen Server programmieren zu müssen.

**Firestore**
Die NoSQL-Datenbank von Firebase. Speichert Daten nicht in Tabellen (wie SQL), sondern in Collections und Documents.

**Follow-System**
Nutzer können Creators "folgen" (ähnlich wie Twitter/Instagram). Sie erhalten dann Benachrichtigungen bei neuen Spielen. Ist unidirektional (A folgt B, aber B folgt nicht automatisch A zurück).

**Frontend**
Der Teil der Software, den der Nutzer sieht und mit dem er interagiert. Die Benutzeroberfläche im Browser. Bei MindForge: React.

**Friends / Freunde**
Das bidirektionale Freundschaftssystem (wie Facebook). A und B müssen beide zustimmen. Freunde sehen sich in der Freundesliste mit Online-Status.

**Fullscreen / Vollbildmodus**
Wenn ein Spiel startet, übernimmt es den ganzen Bildschirm. Navbar und Sidebar verschwinden. ESC-Taste öffnet das Pause-Menü.

---

### G

**Game Card**
Die visuelle Darstellung eines Spiels in Listen: Vorschaubild (Thumbnail), Titel, Creator-Name, Tags, Likes/Dislikes.

---

### H

**Home**
Die personalisierte Startseite nach dem Login. Zeigt:
- Freundesliste (später)
- Zuletzt gespielte Spiele
- Empfehlungen basierend auf Spielverhalten

Unterscheidet sich von "Mindbrowser" (zeigt ALLE Spiele).

**Hosting**
Das Bereitstellen einer Webseite im Internet, sodass andere sie besuchen können. Firebase bietet Hosting-Dienste.

---

### I

**Inventory / Inventar**
Die Sammlung gekaufter Dinge eines Nutzers:
- Avatar-Items (Kleidung, Accessoires)
- Premium-Spiele (kostenpflichtig gekauft)
- Marketplace-Assets (für Creator)

---

### L

**Like / Dislike**
Bewertungssystem für Spiele. Nutzer können Daumen hoch (👍) oder runter (👎) geben. Beeinflusst Trending-Listen.

---

### M

**Marketplace**
Der "Asset-Store" von MindForge. Creator können hier kaufen/verkaufen:
- 3D-Modelle
- Texturen
- Soundeffekte
- Scripts (Code-Schnipsel)
- Musik

**Mindbrowser**
Die Hauptseite zum Durchsuchen ALLER verfügbaren Spiele. Viele Kategorien: Featured, Trending, Neu, Beliebt, Nach Tags. Unterscheidet sich von "Home" (personalisiert).

**MindCoins**
Die virtuelle Premium-Währung auf MindForge. Kann NUR erworben werden durch:
1. Echtgeld-Kauf (4,99€ für 500 Coins)
2. Offizielle Events gewinnen

NICHT verdienbar durch normales Spielen!

**MindForge**
Der Name der Plattform. "Mind" (Geist/Lernen) + "Forge" (Schmiede) = "Wo Wissen geschmiedet wird".

**Monetarisierung**
Die Art, wie eine Plattform Geld verdient. MindForge: Premium-Abos, MindCoins-Verkauf, Marketplace-Provision.

**MVP (Minimum Viable Product)**
Die erste, einfachste Version eines Produkts mit nur den Kern-Features. Wird getestet, bevor die volle Version gebaut wird.

**Multiplayer**
Spiele, die mehrere Spieler gleichzeitig spielen können (geplant für Zukunft mit WebSockets).

---

### N

**NoSQL-Datenbank**
Eine Datenbank ohne feste Tabellen-Struktur. Flexibler als SQL. Firestore ist eine NoSQL-DB - speichert Daten als "Dokumente".

---

### P

**Playground**
Die Test-/Entwicklungsversion von MindForge. Nur für 2 Personen, nicht öffentlich, läuft auf localhost.

**Premium**
Kostenpflichtige Mitgliedschaft. Zwei Arten:
- Creator Premium (9,99€/Monat) - Spiele hochladen
- Teacher Premium (14,99€/Monat) - + Lehrer-Dashboard

**Profile / Profil**
Die öffentliche Seite eines Nutzers. Zeigt: Avatar, Bio, erstellte Spiele, Statistiken, Social Links.

---

### R

**React**
Eine JavaScript-Bibliothek von Meta/Facebook zum Erstellen moderner, interaktiver Benutzeroberflächen. Das Frontend von MindForge ist mit React gebaut.

---

### S

**Screenshot**
Ein Bild/Screenshot eines Spiels. Creator können beim Upload mehrere Screenshots hochladen, die auf der Detail-Seite angezeigt werden.

**Sidebar**
Die linke Seitenleiste mit persönlichen Links: Home, Profil, Friends, Avatar, Inventory, Events.

**Storage (Firebase Storage)**
Cloud-Speicher für große Dateien (Spiele, Bilder, Videos). Teil von Firebase.

---

### T

**Tag**
Ein Schlagwort zur Kategorisierung von Spielen. Beispiele: "Mathe", "3D", "Quiz", "Multiplayer". Creator vergeben Tags selbst - es gibt keine festen Kategorien!

**Three.js**
Eine JavaScript-Bibliothek für 3D-Grafik im Browser (basiert auf WebGL). Ermöglicht 3D-Spiele ohne separate Installation.

**Thumbnail**
Das Vorschaubild eines Spiels (16:9 Format). Wird in Game Cards angezeigt. Pflichtfeld beim Upload.

**Trending**
Automatisch ermittelte beliebte Spiele der letzten 7 Tage, basierend auf Plays und Likes.

---

### U

**UI (User Interface)**
Die Benutzeroberfläche - alles, was der Nutzer sieht: Buttons, Farben, Layout.

**UX (User Experience)**
Die Benutzererfahrung - wie einfach, angenehm und intuitiv die Nutzung ist.

**Upload**
Das Hochladen von Dateien. Creator laden Spiele als ZIP-Dateien + Thumbnail hoch.

---

### V

**Verifiziert / Verified**
Ein bestätigter Account. Bekommt ein ✓ Badge. Beispiel: Lehrer mit Nachweis.

---

### W

**WebGL**
Eine Technologie für 3D-Grafik im Browser. Three.js basiert darauf.

**WebSockets**
Technologie für Echtzeitkommunikation zwischen Browser und Server. Geplant für Multiplayer-Spiele.

### Währung & Monetarisierung

**MindCoins**
Virtuelle Echtgeld-Währung. Kann nur durch Echtgeld-Kauf oder offizielle Events verdient werden. Verwendbar für Avatar-Items, Premium-Spiele, Assets.

**Premium Creator**
Bezahltes Abo (€9.99/Monat) das Spiele-Upload ermöglicht. NUR Premium-User dürfen Spiele erstellen.

**Premium Teacher**
Erweiterte Premium-Version (€14.99/Monat) mit Lehrer-Dashboard, Klassen-Verwaltung.

**Verifizierter Creator**
Creator mit bestätigter Identität (z.B. Lehrer-Zertifikat). Erhalten Badge und Priority-Review.

### User-Features

**Avatar**
2D-Profilbild das anpassbar ist (Hautfarbe, Haarfarbe, Frisur, Augen). Wird in Freundesliste und Profil angezeigt.

**Inventory**
Sammlung von gekauften Avatar-Items, Premium-Spielen und Marketplace-Assets.

**Follow-System**
User können Creators folgen (unidirektional, wie Twitter). Erhalten Benachrichtigungen bei neuen Spielen.

**Friends**
Bidirektionale Freundschaften (wie auf der referenzierten Plattform). Freundesliste erscheint im Home-Tab.

### Game-Begriffe

**Game Card**
Visuelle Darstellung eines Spiels: Thumbnail, Titel, Creator, Tags, Likes/Dislikes.

**Thumbnail**
Vorschaubild eines Spiels (16:9 Format). Pflichtfeld beim Upload.

**Tags**
Flexible, community-gesteuerte Labels für Spiele (z.B. "Mathe", "3D", "Quiz"). Keine fixen Kategorien.

**Platzhalter-Spiele**
Mock-Daten für den Playground - 10+ Dummy-Game-Cards mit Stock-Bildern zum Design-Testen.

**Game Player**
Fullscreen-Modus in dem Spiele laufen. Navbar/Sidebar verschwinden, ESC-Menü verfügbar.

### Creator-Tools

**Upload-Dialog**
Modal-Fenster zum Hochladen neuer Spiele (ZIP-Datei + Thumbnail + Metadata).

**Creator Dashboard**
Übersicht eigener Spiele mit Stats, Edit/Delete-Optionen.

**Analytics**
Statistiken für Creator: Views, Plays, Like-Ratio, Spielzeit, Demografie.

**Asset Marketplace**
Community-Shop für 3D-Modelle, Texturen, Sounds, Scripts. Creator können kostenlos oder kostenpflichtig verkaufen.

### Lehrer-Features

**Lehrer-Dashboard**
Spezielle Seite für Premium-Teacher: Klassen erstellen, Spiele zuweisen, Schüler-Fortschritte tracken.

**Klassen**
Gruppen von Schülern, denen Lehrer Spiele zuweisen können. Mit Deadline und Fortschritts-Tracking.

**Events**
Zeitlich begrenzte Challenges vom MindForge-Team. Belohnung: MindCoins. Alle User können teilnehmen.

### Technische Begriffe

**Firebase**
Backend-as-a-Service von Google. Bietet Auth, Database (Firestore), Storage, Hosting.

**Three.js**
JavaScript-Library für 3D-Grafik im Browser (WebGL). Wird für 3D-Spiele verwendet.

**Firestore**
NoSQL-Datenbank von Firebase. Collections: users, games, playHistory, ratings, etc.

**MVP (Minimum Viable Product)**
Erste funktionierende Version mit Kern-Features. Für MindForge: Home, Player, Upload, Login.

**Playground**
Test-Version für Entwicklung. Nicht öffentlich, nur für 2 Personen. Localhost-only.

---

## ✅ Nächste Schritte

1. **Review dieser Beschreibung**
   - Feedback geben
   - Anpassungen vornehmen

2. **Projekt initialisieren**
   - React + Vite Setup
   - Firebase-Projekt erstellen
   - Git Repository

3. **Design-System aufsetzen**
   - Farben definieren
   - Komponenten-Library starten
   - Tailwind konfigurieren

4. **Erste Features bauen**
   - Navigation
   - Home-Screen
   - Authentication

---

## 📞 Kontakt & Support

**Projekt-Owner:** Michel1
**Status:** Playground/MVP Phase
**Zugang:** Privat (nur Du + 1 andere Person)

---

**MindForge** - Wo Lernen zum Spiel wird. 🎓🎮

---

*Letzte Aktualisierung: 05.02.2026*
*Version: 1.0 (MVP Playground Beschreibung)*
