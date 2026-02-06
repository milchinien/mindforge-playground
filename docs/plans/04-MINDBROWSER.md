# 04 - Mindbrowser (Spiele durchsuchen)

## Was wird hier gemacht?

In diesem Schritt baust du den **Mindbrowser** - die zentrale Seite auf der User alle verfuegbaren Spiele durchsuchen koennen. Der Mindbrowser ist erreichbar unter `/browse` und zeigt:
- **FeaturedCarousel** mit hervorgehobenen Spielen (automatisch rotierend)
- **GameCard** Komponente (wiederverwendbar fuer alle Spielanzeigen)
- **GameRow** Komponente (horizontal scrollbare Reihe von GameCards)
- **TagList** Komponente (klickbare Tags)
- Verschiedene Kategorien: Featured, Trending, Popular, New, By Subject
- **Mock-Daten** mit 15+ Spielen

Am Ende kann ein User durch alle Spiele browsen, sieht ein Featured-Karussell und verschiedene Kategorien.

---

## Voraussetzung

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein
- `npm run dev` laeuft ohne Fehler

---

## Uebersicht der Seite

```
┌──────────────────────────────────────────────────────────────────┐
│  NAVBAR                                                           │
├────────────┬─────────────────────────────────────────────────────┤
│  SIDEBAR   │                                                      │
│            │  ┌──────────────────────────────────────────────┐   │
│            │  │        FEATURED CAROUSEL                      │   │
│            │  │   [<<] [  Grosses Spiel-Bild + Titel  ] [>>] │   │
│            │  │         ● ○ ○ ○ ○  (Dot Indicators)          │   │
│            │  └──────────────────────────────────────────────┘   │
│            │                                                      │
│            │  Trending                                            │
│            │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ──────►       │
│            │  │Card 1│ │Card 2│ │Card 3│ │Card 4│               │
│            │  └──────┘ └──────┘ └──────┘ └──────┘               │
│            │                                                      │
│            │  Popular                                             │
│            │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ──────►       │
│            │  │Card 5│ │Card 6│ │Card 7│ │Card 8│               │
│            │  └──────┘ └──────┘ └──────┘ └──────┘               │
│            │                                                      │
│            │  New                                                 │
│            │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ──────►       │
│            │  │Card 9│ │Card10│ │Card11│ │Card12│               │
│            │  └──────┘ └──────┘ └──────┘ └──────┘               │
│            │                                                      │
│            │  Mathematik                                          │
│            │  ┌──────┐ ┌──────┐ ┌──────┐ ──────►                │
│            │  │Card  │ │Card  │ │Card  │                         │
│            │  └──────┘ └──────┘ └──────┘                         │
│            │                                                      │
└────────────┴─────────────────────────────────────────────────────┘
```

---

## Datei 1: `src/data/mockGames.js`

Die Mock-Daten simulieren die Spiele-Datenbank. Diese Datei wird von mehreren Seiten importiert (Mindbrowser, Home, GameDetail, Search).

### Spiel-Schema (ein einzelnes Spiel):

```javascript
{
  id: "game-001",                    // String - Eindeutige ID
  title: "Mathe-Meister",           // String - Spieltitel
  description: "Teste dein mathematisches Wissen mit spannenden Aufgaben...",  // String - Beschreibung
  creator: "MindForge Team",        // String - Ersteller-Anzeigename
  creatorId: "user-001",            // String - Ersteller User-ID
  thumbnail: "/demo-games/mathe-quiz/thumbnail.jpg",  // String - Thumbnail URL
  screenshots: [],                   // Array<String> - Screenshot URLs (optional)
  tags: ["mathematik", "quiz", "grundschule"],  // Array<String> - Tags
  likes: 245,                        // Number - Anzahl Likes
  dislikes: 12,                      // Number - Anzahl Dislikes
  plays: 1832,                       // Number - Wie oft gespielt
  views: 3500,                       // Number - Wie oft angesehen
  featured: true,                    // Boolean - Im Featured-Karussell?
  premium: false,                    // Boolean - Kostet MindCoins?
  price: 0,                          // Number - Preis in MindCoins (0 = kostenlos)
  createdAt: "2024-12-15",          // String - Erstelldatum (ISO)
  category: "quiz",                  // String - Kategorie
  subject: "mathematik",            // String - Schulfach
  gameUrl: "/demo-games/mathe-quiz/index.html"  // String - URL zum Spiel (fuer iframe)
}
```

### Mock-Daten (mindestens 15 Spiele):

Erstelle eine Datei mit mindestens 15 Spielen in verschiedenen Kategorien:

```javascript
// src/data/mockGames.js

export const mockGames = [
  // === FEATURED GAMES (featured: true) ===
  {
    id: "game-001",
    title: "Mathe-Meister",
    description: "Teste dein mathematisches Wissen mit spannenden Aufgaben von Addition bis Multiplikation. Perfekt fuer Grundschueler!",
    creator: "MindForge Team",
    creatorId: "user-001",
    thumbnail: "/demo-games/mathe-quiz/thumbnail.jpg",
    screenshots: [],
    tags: ["mathematik", "quiz", "grundschule"],
    likes: 245,
    dislikes: 12,
    plays: 1832,
    views: 3500,
    featured: true,
    premium: false,
    price: 0,
    createdAt: "2024-12-15",
    category: "quiz",
    subject: "mathematik",
    gameUrl: "/demo-games/mathe-quiz/index.html"
  },
  {
    id: "game-002",
    title: "Physik-Simulator",
    description: "Experimentiere mit Schwerkraft, Reibung und Geschwindigkeit in dieser interaktiven Physiksimulation.",
    creator: "ScienceGamer",
    creatorId: "user-002",
    thumbnail: "/demo-games/physik-sim/thumbnail.jpg",
    screenshots: [],
    tags: ["physik", "simulation", "interaktiv"],
    likes: 189,
    dislikes: 8,
    plays: 1245,
    views: 2800,
    featured: true,
    premium: false,
    price: 0,
    createdAt: "2024-11-20",
    category: "simulation",
    subject: "physik",
    gameUrl: "/demo-games/physik-sim/index.html"
  },
  // ... mindestens 13 weitere Spiele ...
  // Verschiedene Subjects: mathematik, physik, chemie, biologie, deutsch, englisch,
  //   geschichte, geographie, informatik, kunst, musik
  // Verschiedene Categories: quiz, simulation, puzzle, adventure, strategy
  // Einige mit premium: true und price > 0
  // Einige mit featured: true (3-5 total)
]

// Hilfsfunktionen zum Filtern
export function getFeaturedGames() {
  return mockGames.filter(game => game.featured)
}

export function getTrendingGames() {
  return [...mockGames].sort((a, b) => b.plays - a.plays).slice(0, 8)
}

export function getPopularGames() {
  return [...mockGames].sort((a, b) => b.likes - a.likes).slice(0, 8)
}

export function getNewGames() {
  return [...mockGames].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8)
}

export function getGamesBySubject(subject) {
  return mockGames.filter(game => game.subject === subject)
}

export function getGameById(id) {
  return mockGames.find(game => game.id === id)
}

export function getAllSubjects() {
  return [...new Set(mockGames.map(game => game.subject))]
}
```

**Wichtig:** Erstelle tatsaechlich 15+ verschiedene Spiele mit unterschiedlichen Subjects, Categories, Tags und Werten. Die Thumbnails koennen auf Placeholder-Bilder zeigen oder einen farbigen Hintergrund mit Titel-Text verwenden.

---

## Datei 2: `src/components/game/GameCard.jsx`

Die GameCard ist DIE zentrale Komponente fuer die Spiele-Anzeige. Sie wird ueberall wiederverwendet (Mindbrowser, Home, Search, Profile).

### Aufbau einer GameCard:

```
┌────────────────────────┐
│  ┌──────────────────┐  │
│  │                  │  │
│  │   THUMBNAIL      │  │
│  │                  │  │
│  │          [PREMIUM│  │  ← Premium-Badge (nur bei premium: true)
│  └──────────────────┘  │
│                         │
│  Mathe-Meister          │  ← Titel (fett, weiss)
│  von MindForge Team     │  ← Creator (grau, kleiner)
│                         │
│  #mathematik #quiz      │  ← Tags (klein, klickbar)
│                         │
│  ♥ 245    ▶ 1.8K       │  ← Likes + Plays
└────────────────────────┘
```

### Props:

```javascript
{
  game: {                  // Object - Die Spieldaten
    id, title, creator, thumbnail, tags, likes, plays, premium, price
  }
}
```

### Implementierungsdetails:

- **Klick:** Gesamte Karte ist klickbar → navigiert zu `/game/${game.id}`
- **Thumbnail:** Bild mit `object-cover`, abgerundete obere Ecken. Wenn kein Bild: Farbiger Placeholder mit Titel-Initialen
- **Premium-Badge:** Kleines Label oben rechts auf dem Thumbnail ("Premium" oder Preis in MC)
- **Titel:** Maximal 2 Zeilen, dann abgeschnitten (`line-clamp-2`)
- **Creator:** "von {creator}" in grau
- **Tags:** Maximal 3 Tags angezeigt, klickbar (navigieren zu `/search?tag=TAG`)
- **Stats:** Likes-Herz + Zahl, Play-Dreieck + Zahl (formatiert: 1832 → "1.8K")
- **Hover-Effekt:** Leichtes Hochschieben (`transform: translateY(-4px)`) + Schatten

### Styling:

```
Breite: ca. 220px (fest oder responsive)
Hintergrund: bg-bg-card (#374151)
Abgerundet: rounded-xl
Schatten: shadow-lg
Hover: -translate-y-1 shadow-xl
Transition: transition-all duration-200
```

---

## Datei 3: `src/components/game/GameRow.jsx`

Eine horizontal scrollbare Reihe von GameCards. Wird fuer jede Kategorie verwendet.

### Aufbau:

```
  Kategorie-Titel          [Alle anzeigen >]
  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ──────► (scrollbar)
  │Card 1│ │Card 2│ │Card 3│ │Card 4│ │Card 5│
  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

### Props:

```javascript
{
  title: "Trending",           // String - Kategorie-Titel
  games: [...],                // Array - Liste der Spiele
  showAllLink: "/search?sort=trending"  // String (optional) - Link zu "Alle anzeigen"
}
```

### Implementierungsdetails:

- **Titel:** Links, fett, gross (`text-xl font-bold`)
- **"Alle anzeigen" Link:** Rechts vom Titel, klein, Akzent-Farbe
- **Scroll-Container:** `overflow-x-auto` mit versteckter Scrollbar
- **Versteckte Scrollbar CSS:**
  ```css
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  ```
- **Gap:** `gap-4` zwischen den Cards
- **Flex:** `flex` Container, Cards behalten ihre feste Breite (`flex-shrink-0`)

---

## Datei 4: `src/components/game/FeaturedCarousel.jsx`

Das Karussell zeigt 3-5 hervorgehobene Spiele die automatisch rotieren.

### Aufbau:

```
┌──────────────────────────────────────────────────┐
│                                                    │
│  [◄]   Grosses Thumbnail / Banner-Bild     [►]   │
│                                                    │
│         Mathe-Meister                              │
│         Teste dein mathematisches Wissen...        │
│                                                    │
│         [Jetzt spielen]                            │
│                                                    │
│              ● ○ ○ ○ ○                             │
│                                                    │
└──────────────────────────────────────────────────┘
```

### Props:

```javascript
{
  games: [...]    // Array - Featured Games (3-5 Stueck)
}
```

### Implementierungsdetails:

- **Auto-Rotation:** Alle 5 Sekunden zum naechsten Spiel (via `setInterval` in `useEffect`)
- **Dot-Indicators:** Punkte unten zeigen welches Spiel gerade sichtbar ist (ausgefuellter Punkt = aktiv)
- **Pfeil-Buttons:** Links und rechts zum manuellen Navigieren
- **Pause bei Hover:** Auto-Rotation pausiert wenn die Maus ueber dem Karussell ist
- **"Jetzt spielen" Button:** Fuehrt zu `/game/${game.id}` (Detail-Seite, nicht direkt spielen)
- **Titel + Beschreibung:** Ueberlagert das Bild (mit dunklem Gradient als Hintergrund)
- **Responsive:** Hoehe passt sich an (ca. 300-400px auf Desktop, kleiner auf Mobile)
- **Transition:** Sanfter Uebergang zwischen Slides (CSS transition oder opacity-Wechsel)

### Styling:

```
Breite: 100% des Content-Bereichs
Hoehe: ca. 400px (Desktop), 250px (Mobile)
Abgerundet: rounded-2xl
Overflow: hidden
Position: relative (fuer Overlay-Elemente)
```

---

## Datei 5: `src/components/game/TagList.jsx`

Eine Liste von klickbaren Tags.

### Props:

```javascript
{
  tags: ["mathematik", "quiz", "grundschule"],  // Array<String>
  maxTags: 3,                                     // Number (optional) - Max angezeigte Tags
  size: "sm"                                      // String - "sm" oder "md"
}
```

### Implementierungsdetails:

- Jeder Tag ist ein klickbarer Chip/Badge
- Klick navigiert zu `/search?tag=TAG`
- Wenn mehr Tags als `maxTags`: "+X mehr" anzeigen
- Tags werden mit "#" Prefix angezeigt (z.B. "#mathematik")

### Styling:

```
Hintergrund: bg-primary/20 (halbtransparentes Blau)
Text: text-primary-light
Hover: bg-primary/30
Abgerundet: rounded-full
Padding: px-2 py-1 (sm) oder px-3 py-1.5 (md)
Schriftgroesse: text-xs (sm) oder text-sm (md)
```

---

## Datei 6: `src/pages/Mindbrowser.jsx`

Die Hauptseite die alle Komponenten zusammenfuegt.

### Aufbau:

```jsx
function Mindbrowser() {
  const featured = getFeaturedGames()
  const trending = getTrendingGames()
  const popular = getPopularGames()
  const newGames = getNewGames()
  const subjects = getAllSubjects()

  return (
    <div>
      {/* Featured Carousel */}
      <FeaturedCarousel games={featured} />

      {/* Trending */}
      <GameRow title="Trending" games={trending} showAllLink="/search?sort=trending" />

      {/* Popular */}
      <GameRow title="Beliebt" games={popular} showAllLink="/search?sort=popular" />

      {/* New */}
      <GameRow title="Neu" games={newGames} showAllLink="/search?sort=new" />

      {/* By Subject */}
      {subjects.map(subject => (
        <GameRow
          key={subject}
          title={subjectDisplayName(subject)}  // "mathematik" → "Mathematik"
          games={getGamesBySubject(subject)}
          showAllLink={`/search?tag=${subject}`}
        />
      ))}
    </div>
  )
}
```

### Subject-Anzeigenamen:

```javascript
const subjectNames = {
  mathematik: "Mathematik",
  physik: "Physik",
  chemie: "Chemie",
  biologie: "Biologie",
  deutsch: "Deutsch",
  englisch: "Englisch",
  geschichte: "Geschichte",
  geographie: "Geographie",
  informatik: "Informatik",
  kunst: "Kunst",
  musik: "Musik"
}
```

---

## Thumbnail-Platzhalter

Da wir fuer den MVP keine echten Bilder haben, erstelle Placeholder-Thumbnails:

### Option A: CSS-basierte Placeholder (empfohlen fuer MVP)

In der GameCard: Wenn kein Thumbnail vorhanden oder das Bild nicht laedt, zeige einen farbigen Hintergrund mit dem ersten Buchstaben des Titels:

```jsx
function ThumbnailPlaceholder({ title, subject }) {
  const colors = {
    mathematik: "from-blue-600 to-blue-800",
    physik: "from-purple-600 to-purple-800",
    chemie: "from-green-600 to-green-800",
    biologie: "from-emerald-600 to-emerald-800",
    deutsch: "from-red-600 to-red-800",
    englisch: "from-yellow-600 to-yellow-800",
    geschichte: "from-amber-600 to-amber-800",
    informatik: "from-cyan-600 to-cyan-800",
    default: "from-gray-600 to-gray-800"
  }

  const gradient = colors[subject] || colors.default

  return (
    <div className={`w-full h-40 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
      <span className="text-4xl font-bold text-white/50">{title.charAt(0)}</span>
    </div>
  )
}
```

### Option B: Statische Placeholder-Bilder

Erstelle einfache Bilder (z.B. mit einem Online-Tool) und lege sie in `public/thumbnails/`.

---

## Testen

1. **Navigiere zu `/browse`** - Die Mindbrowser-Seite sollte laden
2. **Featured Carousel** - Zeigt hervorgehobene Spiele, rotiert automatisch alle 5 Sekunden
3. **Dot-Indicators** - Punkte zeigen das aktive Spiel, Klick wechselt das Spiel
4. **GameRows** - Horizontal scrollbare Reihen fuer jede Kategorie
5. **GameCards** - Zeigen Thumbnail, Titel, Creator, Tags, Stats
6. **Klick auf GameCard** - Navigiert zu `/game/GAME_ID` (Platzhalter-Seite)
7. **Klick auf Tag** - Navigiert zu `/search?tag=TAG` (Platzhalter-Seite)
8. **Scroll** - Horizontal scrollen in GameRows funktioniert (ohne sichtbare Scrollbar)
9. **Responsive** - Auf kleinen Bildschirmen: Cards werden kleiner, Carousel passt sich an
10. **Premium-Badge** - Spiele mit `premium: true` zeigen das Premium-Badge

---

## Checkliste

- [ ] `src/data/mockGames.js` erstellt mit 15+ Spielen und Hilfsfunktionen
- [ ] `src/components/game/GameCard.jsx` erstellt und zeigt Spiel-Infos
- [ ] `src/components/game/GameRow.jsx` erstellt - horizontal scrollbar
- [ ] `src/components/game/FeaturedCarousel.jsx` erstellt - rotiert alle 5 Sekunden
- [ ] `src/components/game/TagList.jsx` erstellt - Tags sind klickbar
- [ ] `src/pages/Mindbrowser.jsx` erstellt und zeigt alle Kategorien
- [ ] Thumbnail-Placeholder funktioniert (wenn kein Bild vorhanden)
- [ ] Versteckte Scrollbar in GameRows
- [ ] Klick auf GameCard navigiert zu /game/:id
- [ ] Klick auf Tag navigiert zu /search?tag=TAG
- [ ] Premium-Badge wird bei Premium-Spielen angezeigt
- [ ] Carousel hat Dot-Indicators und Pfeil-Buttons
- [ ] Responsive Design funktioniert
- [ ] App.jsx Route `/browse` zeigt Mindbrowser

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/data/mockGames.js` | Mock-Daten fuer 15+ Spiele + Hilfsfunktionen |
| `src/components/game/GameCard.jsx` | Spielkarte (Thumbnail, Titel, Creator, Tags, Stats) |
| `src/components/game/GameRow.jsx` | Horizontal scrollbare Reihe von GameCards |
| `src/components/game/FeaturedCarousel.jsx` | Auto-rotierendes Karussell fuer Featured Games |
| `src/components/game/TagList.jsx` | Liste klickbarer Tags |
| `src/pages/Mindbrowser.jsx` | Hauptseite mit allen Kategorien und Karussell |
| `src/styles/globals.css` | Ergaenzt um hide-scrollbar Utility-Klasse |
