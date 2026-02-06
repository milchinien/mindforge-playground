# 05 - Home-Seite (personalisiert)

## Was wird hier gemacht?

In diesem Schritt baust du die **personalisierte Home-Seite** unter `/`. Sie ist die erste Seite die ein eingeloggter User sieht und unterscheidet sich vom Mindbrowser dadurch, dass sie personalisierte Inhalte zeigt:
- **FriendsPreview** - Kleine Vorschau der Freunde mit Online-Status
- **Recently Played** - Zuletzt gespielte Spiele (aus localStorage)
- **Recommended Games** - Empfohlene Spiele (zufaellig fuer MVP)
- **Featured Games** - Hervorgehobene Spiele (wiederverwendet vom Mindbrowser)
- **Call-to-Action** fuer nicht eingeloggte User

Am Ende hat die Home-Seite einen persoenlichen Charakter mit Freunde-Anzeige, zuletzt gespielten Spielen und Empfehlungen.

---

## Voraussetzung

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein
- Datei `04-MINDBROWSER.md` muss abgeschlossen sein (GameCard, GameRow, FeaturedCarousel werden wiederverwendet)
- `src/data/mockGames.js` existiert mit Mock-Daten

---

## Uebersicht der Seite

### Eingeloggt:

```
┌──────────────────────────────────────────────────────────────────┐
│  NAVBAR                                                           │
├────────────┬─────────────────────────────────────────────────────┤
│  SIDEBAR   │                                                      │
│            │  Willkommen zurueck, [Username]!                     │
│            │                                                      │
│            │  ┌─────────────────────────────────────────────┐    │
│            │  │  FREUNDE-VORSCHAU                            │    │
│            │  │  [●Max] [●Lisa] [○Tom] [●Sara] [○Jan]       │    │
│            │  │  3 online              [Alle anzeigen]       │    │
│            │  └─────────────────────────────────────────────┘    │
│            │                                                      │
│            │  Zuletzt gespielt                                    │
│            │  ┌──────┐ ┌──────┐ ┌──────┐ ──────►                │
│            │  │Card 1│ │Card 2│ │Card 3│                         │
│            │  └──────┘ └──────┘ └──────┘                         │
│            │                                                      │
│            │  Empfohlen fuer dich                                 │
│            │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ──────►       │
│            │  │Card  │ │Card  │ │Card  │ │Card  │               │
│            │  └──────┘ └──────┘ └──────┘ └──────┘               │
│            │                                                      │
│            │  ┌──────────────────────────────────────────────┐   │
│            │  │        FEATURED CAROUSEL                      │   │
│            │  │   [  Grosses Spiel-Bild + Titel  ]           │   │
│            │  └──────────────────────────────────────────────┘   │
│            │                                                      │
└────────────┴─────────────────────────────────────────────────────┘
```

### Nicht eingeloggt:

```
┌──────────────────────────────────────────────────────────────────┐
│  NAVBAR  (mit Login/Register Buttons)                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                              │  │
│  │     Willkommen bei MindForge!                                │  │
│  │     Entdecke tausende Lernspiele oder erstelle deine         │  │
│  │     eigenen!                                                  │  │
│  │                                                              │  │
│  │     [Kostenlos registrieren]    [Spiele entdecken]           │  │
│  │                                                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │        FEATURED CAROUSEL                                   │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                    │
│  Beliebte Spiele                                                   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ──────►                     │
│  │Card  │ │Card  │ │Card  │ │Card  │                              │
│  └──────┘ └──────┘ └──────┘ └──────┘                              │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## Datei 1: `src/data/mockFriends.js`

Mock-Daten fuer die Freunde-Vorschau. Wird spaeter durch echte Firestore-Daten ersetzt.

```javascript
// src/data/mockFriends.js

export const mockFriends = [
  {
    id: "friend-001",
    username: "MaxGamer",
    avatar: {
      skinColor: "#f5d0a9",
      hairColor: "#4a3728",
      hairStyle: "short",
      eyes: "normal"
    },
    isOnline: true,
    lastSeen: "2025-01-15T14:30:00Z"
  },
  {
    id: "friend-002",
    username: "LisaLernt",
    avatar: {
      skinColor: "#d4a574",
      hairColor: "#1a1a1a",
      hairStyle: "long",
      eyes: "happy"
    },
    isOnline: true,
    lastSeen: "2025-01-15T14:25:00Z"
  },
  {
    id: "friend-003",
    username: "TomTueftler",
    avatar: {
      skinColor: "#f5d0a9",
      hairColor: "#c4821e",
      hairStyle: "curly",
      eyes: "normal"
    },
    isOnline: false,
    lastSeen: "2025-01-15T10:00:00Z"
  },
  {
    id: "friend-004",
    username: "SaraScience",
    avatar: {
      skinColor: "#8d5524",
      hairColor: "#1a1a1a",
      hairStyle: "ponytail",
      eyes: "cool"
    },
    isOnline: true,
    lastSeen: "2025-01-15T14:28:00Z"
  },
  {
    id: "friend-005",
    username: "JanJoker",
    avatar: {
      skinColor: "#f5d0a9",
      hairColor: "#b8860b",
      hairStyle: "mohawk",
      eyes: "wink"
    },
    isOnline: false,
    lastSeen: "2025-01-14T22:15:00Z"
  }
]

export function getOnlineFriends() {
  return mockFriends.filter(f => f.isOnline)
}

export function getOfflineFriends() {
  return mockFriends.filter(f => !f.isOnline)
}
```

---

## Datei 2: `src/components/home/FriendsPreview.jsx`

Zeigt eine kompakte Vorschau der Freunde mit Online/Offline-Status.

### Aufbau:

```
┌──────────────────────────────────────────────────┐
│  Freunde                          [Alle anzeigen] │
│                                                    │
│  [●] MaxGamer   [●] LisaLernt   [○] TomTueftler  │
│  [●] SaraScience   [○] JanJoker                   │
│                                                    │
│  3 Freunde online                                  │
└──────────────────────────────────────────────────┘
```

### Props:

```javascript
{
  friends: [...]    // Array - Liste der Freunde (Mock-Daten)
  maxDisplay: 5     // Number (optional) - Max angezeigte Freunde
}
```

### Implementierungsdetails:

- **Freunde-Anzeige:** Horizontale Liste mit Avatar (kleiner Kreis) + Username
- **Online-Indicator:** Gruener Punkt (●) = online, grauer Punkt (○) = offline
- **Online zuerst:** Online-Freunde werden zuerst angezeigt, dann Offline
- **Max Display:** Standardmaessig 5 Freunde. Wenn mehr: "+X weitere"
- **"Alle anzeigen" Link:** Navigiert zu `/friends`
- **Klick auf Freund:** Navigiert zu `/profile/USERNAME`
- **Online-Zaehler:** "X Freunde online" als kleiner Text unten

### Styling:

```
Hintergrund: bg-bg-secondary
Abgerundet: rounded-xl
Padding: p-4
Avatar-Kreise: w-10 h-10 rounded-full (mit Hautfarbe aus Avatar-Daten)
Online-Dot: w-3 h-3 rounded-full bg-success (absolute positioniert)
Offline-Dot: w-3 h-3 rounded-full bg-text-muted
```

---

## Datei 3: `src/pages/Home.jsx`

Die Hauptseite die alle Home-Komponenten zusammenfuegt.

### Implementierungsdetails:

**Wenn eingeloggt:**

```jsx
function Home() {
  const { user } = useAuth()

  // Recently Played aus localStorage laden
  const recentlyPlayed = getRecentlyPlayedGames()

  // Empfohlene Spiele (zufaellig fuer MVP)
  const recommended = getRandomGames(8)

  // Featured Games
  const featured = getFeaturedGames()

  if (!user) {
    return <HomeGuest />  // Nicht-eingeloggte Ansicht
  }

  return (
    <div className="space-y-8">
      {/* Begruessung */}
      <h1 className="text-2xl font-bold">
        Willkommen zurueck, <span className="text-accent">{user.username}</span>!
      </h1>

      {/* Freunde-Vorschau */}
      <FriendsPreview friends={mockFriends} />

      {/* Zuletzt gespielt (nur wenn es Eintraege gibt) */}
      {recentlyPlayed.length > 0 && (
        <GameRow title="Zuletzt gespielt" games={recentlyPlayed} />
      )}

      {/* Empfohlen */}
      <GameRow title="Empfohlen fuer dich" games={recommended} />

      {/* Featured */}
      <FeaturedCarousel games={featured} />
    </div>
  )
}
```

**Wenn NICHT eingeloggt (HomeGuest):**

```jsx
function HomeGuest() {
  const featured = getFeaturedGames()
  const popular = getPopularGames()

  return (
    <div className="space-y-8">
      {/* Hero-Banner / Call-to-Action */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Willkommen bei MindForge!</h1>
        <p className="text-xl text-text-secondary mb-6">
          Entdecke tausende Lernspiele oder erstelle deine eigenen!
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register" className="bg-accent hover:bg-accent-dark px-6 py-3 rounded-lg font-semibold">
            Kostenlos registrieren
          </Link>
          <Link to="/browse" className="bg-bg-card hover:bg-bg-hover px-6 py-3 rounded-lg font-semibold">
            Spiele entdecken
          </Link>
        </div>
      </div>

      {/* Featured Carousel */}
      <FeaturedCarousel games={featured} />

      {/* Beliebte Spiele */}
      <GameRow title="Beliebte Spiele" games={popular} />
    </div>
  )
}
```

---

## Recently Played (localStorage)

Die "Zuletzt gespielt" Funktion speichert Spiel-IDs im localStorage. Dies wird spaeter in Plan 07 (Game Player) befuellt, aber die Lese-Logik wird jetzt schon implementiert.

### Hilfsfunktionen:

```javascript
// In Home.jsx oder in einem eigenen utils-File

const RECENTLY_PLAYED_KEY = 'mindforge_recently_played'
const MAX_RECENT_GAMES = 10

// Zuletzt gespielte Spiele laden
function getRecentlyPlayedGames() {
  try {
    const stored = localStorage.getItem(RECENTLY_PLAYED_KEY)
    if (!stored) return []

    const gameIds = JSON.parse(stored)  // Array von Game-IDs

    // IDs zu Game-Objekten aufloesen (aus mockGames)
    return gameIds
      .map(id => getGameById(id))
      .filter(Boolean)  // null/undefined entfernen
  } catch {
    return []
  }
}

// Spiel zur Liste hinzufuegen (wird in Plan 07 aufgerufen)
export function addToRecentlyPlayed(gameId) {
  try {
    const stored = localStorage.getItem(RECENTLY_PLAYED_KEY)
    let gameIds = stored ? JSON.parse(stored) : []

    // Duplikate entfernen
    gameIds = gameIds.filter(id => id !== gameId)

    // Neues Spiel an den Anfang
    gameIds.unshift(gameId)

    // Maximum einhalten
    gameIds = gameIds.slice(0, MAX_RECENT_GAMES)

    localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(gameIds))
  } catch {
    // localStorage nicht verfuegbar - ignorieren
  }
}
```

---

## Recommended Games (Zufalls-Auswahl fuer MVP)

Fuer den MVP werden Empfehlungen einfach zufaellig ausgewaehlt. Spaeter kann ein echtes Empfehlungssystem implementiert werden.

```javascript
function getRandomGames(count) {
  const shuffled = [...mockGames].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
```

---

## Unterschiede zwischen Home und Mindbrowser

| Aspekt | Home (/) | Mindbrowser (/browse) |
|--------|----------|----------------------|
| **Zweck** | Personalisiert, Startpunkt | Alle Spiele durchsuchen |
| **Begruessung** | "Willkommen zurueck, User!" | Keine Begruessung |
| **Freunde** | FriendsPreview | Keine Freunde |
| **Zuletzt gespielt** | Ja (localStorage) | Nein |
| **Empfehlungen** | Ja (zufaellig) | Nein (stattdessen alle Kategorien) |
| **Featured Carousel** | Ja (wiederverwendet) | Ja (original) |
| **Kategorien** | Wenige (Empfohlen, Featured) | Alle (Trending, Popular, New, By Subject) |
| **Nicht eingeloggt** | CTA-Banner zum Registrieren | Alle Spiele sichtbar |

---

## Testen

1. **Eingeloggt:**
   - Gehe zu `/` - Begruessung mit Username wird angezeigt
   - FriendsPreview zeigt Mock-Freunde mit Online-Status
   - "Zuletzt gespielt" wird angezeigt (wenn localStorage Eintraege hat)
   - "Empfohlen fuer dich" zeigt zufaellige Spiele
   - Featured Carousel funktioniert (rotiert, Dots, Pfeile)

2. **Nicht eingeloggt:**
   - Gehe zu `/` - Hero-Banner mit CTA wird angezeigt
   - "Kostenlos registrieren" Button fuehrt zu `/register`
   - "Spiele entdecken" Button fuehrt zu `/browse`
   - Featured Carousel und beliebte Spiele werden angezeigt
   - Keine Freunde-Vorschau, keine persoenlichen Inhalte

3. **FriendsPreview:**
   - Online-Freunde werden zuerst angezeigt
   - Gruener Punkt bei Online, grauer bei Offline
   - "X Freunde online" Text stimmt
   - Klick auf Freund navigiert zu Profil
   - "Alle anzeigen" fuehrt zu `/friends`

4. **Responsive:**
   - Auf kleinen Bildschirmen: Layout passt sich an
   - CTA-Banner Buttons werden gestapelt (untereinander)

---

## Checkliste

- [ ] `src/data/mockFriends.js` erstellt mit 5 Mock-Freunden
- [ ] `src/components/home/FriendsPreview.jsx` erstellt und zeigt Freunde mit Status
- [ ] `src/pages/Home.jsx` erstellt mit eingeloggter und nicht-eingeloggter Ansicht
- [ ] Begruessung zeigt Username des eingeloggten Users
- [ ] FriendsPreview zeigt Online/Offline-Status korrekt
- [ ] "Zuletzt gespielt" Sektion wird angezeigt (wenn Daten vorhanden)
- [ ] "Empfohlen fuer dich" zeigt zufaellige Spiele
- [ ] Featured Carousel wird von Plan 04 wiederverwendet
- [ ] CTA-Banner fuer nicht-eingeloggte User mit Links
- [ ] localStorage Hilfsfunktionen fuer Recently Played sind implementiert
- [ ] Klick auf Freund navigiert zu `/profile/USERNAME`
- [ ] "Alle anzeigen" bei Freunden navigiert zu `/friends`
- [ ] Responsive Design funktioniert
- [ ] Route `/` in App.jsx zeigt Home-Seite

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/data/mockFriends.js` | Mock-Daten fuer Freunde mit Online-Status |
| `src/components/home/FriendsPreview.jsx` | Kompakte Freunde-Vorschau mit Online-Indicators |
| `src/pages/Home.jsx` | Personalisierte Home-Seite (eingeloggt vs. Gast) |
