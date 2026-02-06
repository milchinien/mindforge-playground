# 07 - Game Player (Fullscreen Spiel abspielen)

## Was wird hier gemacht?

In diesem Schritt baust du den **Game Player** - eine Fullscreen-Seite unter `/play/:id` die ein Spiel in einem iframe laedt und abspielt. Die Seite hat:
- **Kein Layout** (kein Navbar, kein Sidebar) - komplett Fullscreen
- **iframe** zum Laden des Spiels
- **Ladebildschirm** waehrend das Spiel laedt
- **Pause-Menue** das mit ESC geoeffnet wird (Continue, Restart, Zurueck)
- **Zwei Demo-Spiele** in `public/demo-games/`
- **Play-Counter** Inkrement (Mock fuer MVP)

Am Ende kann ein User Spiele in einem Fullscreen-Player spielen, mit ESC pausieren und zwischen den Optionen waehlen.

---

## Voraussetzung

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein
- Datei `04-MINDBROWSER.md` muss abgeschlossen sein (`mockGames.js` existiert)
- Datei `06-GAME-DETAIL.md` muss abgeschlossen sein (Navigation von dort)

---

## Uebersicht der Seite

### Spiel wird geladen:

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                    │
│                                                                    │
│                                                                    │
│                    ┌────────────────────┐                         │
│                    │  🎮                 │                         │
│                    │  Spiel wird geladen │                         │
│                    │  ████████░░ 80%     │                         │
│                    └────────────────────┘                         │
│                                                                    │
│                                                                    │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

### Spiel laeuft (iframe Fullscreen):

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                    │
│                   IFRAME MIT SPIEL-INHALT                          │
│                   (100% Breite, 100% Hoehe)                       │
│                                                                    │
│                                                                    │
│                                                                    │
│                                                                    │
│                                                                    │
│                                                                    │
│                                                                    │
│                           ESC = Pause                              │
└──────────────────────────────────────────────────────────────────┘
```

### Pause-Menue (ESC gedrueckt):

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                    │
│                  ┌────────────────────────┐                       │
│                  │                        │                       │
│                  │   ⏸ Pausiert           │                       │
│                  │                        │                       │
│                  │   [  Weiter spielen  ] │                       │
│                  │   [  Neu starten     ] │                       │
│                  │   [  Zurueck         ] │                       │
│                  │                        │                       │
│                  │  Spiel: Mathe-Meister  │                       │
│                  │                        │                       │
│                  └────────────────────────┘                       │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## Datei 1: `src/pages/GamePlayer.jsx`

Die Hauptseite fuer den Game Player. Wird OHNE Layout gerendert (Fullscreen).

### State:

```javascript
const [isLoading, setIsLoading] = useState(true)    // Ladebildschirm anzeigen?
const [isPaused, setIsPaused] = useState(false)       // Pause-Menue anzeigen?
const [game, setGame] = useState(null)                // Spieldaten
```

### Implementierungsdetails:

**Spiel laden:**
```javascript
const { id } = useParams()
const navigate = useNavigate()

useEffect(() => {
  const gameData = getGameById(id)
  if (!gameData) {
    navigate('/browse')  // Spiel nicht gefunden → zurueck
    return
  }
  setGame(gameData)
}, [id])
```

**iframe:**
```jsx
<iframe
  src={game.gameUrl}
  className="w-full h-full border-0"
  title={game.title}
  sandbox="allow-scripts allow-same-origin"
  onLoad={() => setIsLoading(false)}
/>
```

- `sandbox="allow-scripts allow-same-origin"` - Sicherheitseinschraenkungen:
  - `allow-scripts` - JavaScript im Spiel erlaubt
  - `allow-same-origin` - Zugriff auf localStorage des Spiels erlaubt
  - Kein `allow-popups`, `allow-forms` etc. (Sicherheit)
- `onLoad` - Wenn der iframe fertig geladen hat, wird der Ladebildschirm versteckt

**ESC-Taste:**
```javascript
useEffect(() => {
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setIsPaused(prev => !prev)  // Toggle Pause
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

**Ladebildschirm:**
```jsx
{isLoading && (
  <div className="absolute inset-0 bg-bg-primary flex items-center justify-center z-20">
    <div className="text-center">
      <div className="text-4xl mb-4">🎮</div>
      <h2 className="text-xl font-bold mb-2">Spiel wird geladen...</h2>
      <div className="w-48 h-2 bg-bg-card rounded-full overflow-hidden">
        <div className="h-full bg-accent animate-pulse rounded-full" style={{width: '80%'}} />
      </div>
    </div>
  </div>
)}
```

**Pause-Menue:**
```jsx
{isPaused && (
  <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
    <div className="bg-bg-secondary rounded-2xl p-8 w-80 text-center">
      <h2 className="text-2xl font-bold mb-6">⏸ Pausiert</h2>

      <div className="space-y-3">
        <button
          onClick={() => setIsPaused(false)}
          className="w-full py-3 bg-accent hover:bg-accent-dark rounded-lg font-semibold"
        >
          Weiter spielen
        </button>

        <button
          onClick={handleRestart}
          className="w-full py-3 bg-bg-card hover:bg-bg-hover rounded-lg font-semibold"
        >
          Neu starten
        </button>

        <button
          onClick={() => navigate(`/game/${id}`)}
          className="w-full py-3 bg-bg-card hover:bg-bg-hover rounded-lg font-semibold"
        >
          Zurueck zur Uebersicht
        </button>
      </div>

      <p className="text-text-muted text-sm mt-4">{game?.title}</p>
    </div>
  </div>
)}
```

**Neu starten:**
```javascript
function handleRestart() {
  setIsLoading(true)
  setIsPaused(false)
  // iframe neu laden durch Key-Change oder src-Reset
  const iframe = document.querySelector('iframe')
  if (iframe) {
    iframe.src = iframe.src  // Erzwingt Neuladen
  }
}
```

**Play Counter (Mock):**
```javascript
useEffect(() => {
  if (game) {
    // Mock: Play-Counter erhoehen
    console.log(`Play fuer Spiel ${game.id} gezaehlt`)

    // Recently Played aktualisieren (aus Plan 05)
    addToRecentlyPlayed(game.id)

    // Spaeter: Firestore-Update + playHistory Dokument erstellen
  }
}, [game])
```

### Gesamtstruktur:

```jsx
function GamePlayer() {
  // ... State, Effects ...

  return (
    <div className="fixed inset-0 bg-bg-primary">
      {/* iframe (immer da, auch wenn Loading/Paused) */}
      {game && (
        <iframe
          src={game.gameUrl}
          className="w-full h-full border-0"
          title={game.title}
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setIsLoading(false)}
        />
      )}

      {/* Loading Overlay */}
      {isLoading && <LoadingScreen />}

      {/* Pause Overlay */}
      {isPaused && <PauseMenu />}

      {/* ESC Hinweis (kurz einblenden) */}
      {!isLoading && !isPaused && <EscHint />}
    </div>
  )
}
```

**ESC-Hinweis:** Ein kleiner Text "ESC = Pause" der fuer 3 Sekunden unten eingeblendet wird und dann ausfadet:

```jsx
function EscHint() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-lg text-sm text-text-secondary transition-opacity duration-500">
      ESC = Pause
    </div>
  )
}
```

---

## Datei 2: Demo-Spiel `public/demo-games/mathe-quiz/`

Ein einfaches HTML5 Mathe-Quiz mit 10 Fragen.

### Dateien:

```
public/demo-games/mathe-quiz/
├── index.html
├── game.js
└── style.css
```

### index.html:

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mathe-Meister</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="game-container">
    <div id="start-screen">
      <h1>Mathe-Meister</h1>
      <p>Beantworte 10 Mathe-Fragen so schnell wie moeglich!</p>
      <button id="start-btn">Start</button>
    </div>
    <div id="question-screen" style="display:none">
      <div id="header">
        <span id="question-counter">Frage 1/10</span>
        <span id="timer">⏱ 0:00</span>
        <span id="score-display">Score: 0</span>
      </div>
      <div id="question"></div>
      <div id="answers"></div>
    </div>
    <div id="result-screen" style="display:none">
      <h1>Ergebnis</h1>
      <p id="final-score"></p>
      <p id="final-time"></p>
      <button id="restart-btn">Nochmal spielen</button>
    </div>
  </div>
  <script src="game.js"></script>
</body>
</html>
```

### game.js Logik:

- **10 zufaellige Mathe-Aufgaben** generieren (Addition, Subtraktion, Multiplikation)
- **4 Antwortmoeglichkeiten** pro Frage (eine richtig, drei falsch)
- **Timer** der nach oben zaehlt (zeigt wie lange man braucht)
- **Score** der bei jeder richtigen Antwort um 10 steigt
- **Ergebnis-Screen** am Ende mit Score und Zeit
- **Visuelle Rueckmeldung:** Richtig = gruen blinken, Falsch = rot blinken

### style.css:

- Dunkles Design passend zu MindForge
- Hintergrund: #111827
- Text: weiss
- Buttons: Orange (#f97316) Hover-Effekte
- Antwort-Buttons: Grid, 2x2 Layout
- Responsive fuer verschiedene iframe-Groessen

---

## Datei 3: Demo-Spiel `public/demo-games/physik-sim/`

Eine interaktive Canvas-Physiksimulation mit huepfenden Baellen.

### Dateien:

```
public/demo-games/physik-sim/
├── index.html
├── simulation.js
└── style.css
```

### index.html:

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Physik-Simulator</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="game-container">
    <div id="controls">
      <label>Schwerkraft: <input type="range" id="gravity" min="0" max="20" value="10"></label>
      <label>Reibung: <input type="range" id="friction" min="0" max="100" value="20"></label>
      <button id="add-ball">Ball hinzufuegen</button>
      <button id="clear-all">Alle entfernen</button>
      <span id="ball-count">Baelle: 0</span>
    </div>
    <canvas id="canvas"></canvas>
  </div>
  <script src="simulation.js"></script>
</body>
</html>
```

### simulation.js Logik:

- **Canvas** das die gesamte Spielflaeche ausfuellt
- **Baelle** mit physikalischen Eigenschaften (Position, Geschwindigkeit, Radius, Farbe)
- **Schwerkraft** die an Baelle wirkt (einstellbar per Slider)
- **Reibung/Daempfung** (einstellbar per Slider)
- **Kollision** mit Waenden (Baelle prallen von den Raendern ab)
- **Klick auf Canvas:** Neuen Ball an Mausposition erstellen
- **"Ball hinzufuegen" Button:** Fuegt einen zufaelligen Ball hinzu
- **"Alle entfernen" Button:** Entfernt alle Baelle
- **Ball-Zaehler:** Zeigt Anzahl aktiver Baelle
- **Animation-Loop:** `requestAnimationFrame` fuer fluessige 60fps
- **Zufaellige Farben** fuer jeden Ball

### style.css:

- Dunkles Design
- Canvas fuellt den verfuegbaren Platz
- Controls oben als Overlay-Leiste
- Slider und Buttons im MindForge-Stil

---

## Game URL Mapping

Die `gameUrl` in den Mock-Daten zeigt auf die Demo-Spiele:

```javascript
// In mockGames.js sind die ersten zwei Spiele mit echten Demo-URLs:
{
  id: "game-001",
  gameUrl: "/demo-games/mathe-quiz/index.html",
  // ...
},
{
  id: "game-002",
  gameUrl: "/demo-games/physik-sim/index.html",
  // ...
}

// Alle anderen Spiele haben entweder:
// - gameUrl: "/demo-games/mathe-quiz/index.html"  (fallback auf ein Demo-Spiel)
// - gameUrl: null  (dann Fehlermeldung im Player anzeigen)
```

Fuer Spiele ohne `gameUrl`: Zeige eine freundliche Meldung im Player:

```
┌─────────────────────────────────┐
│                                   │
│  Dieses Spiel ist noch nicht     │
│  verfuegbar.                      │
│                                   │
│  [Zurueck zur Uebersicht]       │
│                                   │
└─────────────────────────────────┘
```

---

## App.jsx Aktualisierung

Die Route fuer den Game Player muss AUSSERHALB des Layouts sein (wie Login/Register):

```jsx
// In App.jsx
<Routes>
  {/* Seiten OHNE Layout */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/play/:id" element={<GamePlayer />} />  {/* NEU */}

  {/* Seiten MIT Layout */}
  <Route path="/" element={<Layout><Home /></Layout>} />
  {/* ... */}
</Routes>
```

---

## Testen

1. **Navigiere zu `/play/game-001`** - Mathe-Quiz sollte laden
2. **Ladebildschirm** - Wird angezeigt waehrend iframe laedt, verschwindet danach
3. **ESC-Hinweis** - "ESC = Pause" erscheint kurz und fadet aus
4. **Mathe-Quiz spielen** - 10 Fragen beantworten, Score und Timer funktionieren
5. **ESC druecken** - Pause-Menue erscheint mit drei Optionen
6. **"Weiter spielen"** - Schliesst Pause-Menue, Spiel laeuft weiter
7. **"Neu starten"** - Laedt das Spiel neu (Ladebildschirm erscheint wieder)
8. **"Zurueck zur Uebersicht"** - Navigiert zu `/game/game-001`
9. **Navigiere zu `/play/game-002`** - Physik-Simulator sollte laden
10. **Physik-Simulator** - Baelle hinzufuegen, Schwerkraft/Reibung anpassen
11. **Fullscreen** - Kein Navbar, kein Sidebar, iframe fuellt den gesamten Bildschirm
12. **Nicht-existierendes Spiel** - `/play/nonexistent` → Redirect zu `/browse`

---

## Checkliste

- [ ] `src/pages/GamePlayer.jsx` erstellt - Fullscreen, ohne Layout
- [ ] iframe laedt Spiele korrekt mit sandbox-Attribut
- [ ] Ladebildschirm wird angezeigt und verschwindet nach Laden
- [ ] ESC-Taste oeffnet/schliesst Pause-Menue
- [ ] Pause-Menue: "Weiter spielen" schliesst das Menue
- [ ] Pause-Menue: "Neu starten" laedt das Spiel neu
- [ ] Pause-Menue: "Zurueck zur Uebersicht" navigiert zu /game/:id
- [ ] ESC-Hinweis erscheint kurz nach Laden und fadet aus
- [ ] `public/demo-games/mathe-quiz/` erstellt und funktioniert
- [ ] Mathe-Quiz: 10 Fragen, Score, Timer, Ergebnis-Screen
- [ ] `public/demo-games/physik-sim/` erstellt und funktioniert
- [ ] Physik-Sim: Canvas, Baelle, Schwerkraft, Reibung, Kollision
- [ ] Play-Counter wird (mock) inkrementiert
- [ ] addToRecentlyPlayed() wird aufgerufen
- [ ] Nicht-existierende Spiele → Redirect
- [ ] Route `/play/:id` in App.jsx ohne Layout
- [ ] Spiele ohne gameUrl zeigen Fehlermeldung

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/pages/GamePlayer.jsx` | Fullscreen Game Player mit iframe, Pause-Menue |
| `public/demo-games/mathe-quiz/index.html` | HTML-Einstiegspunkt fuer Mathe-Quiz |
| `public/demo-games/mathe-quiz/game.js` | Spiellogik: 10 Fragen, Score, Timer |
| `public/demo-games/mathe-quiz/style.css` | Styling fuer Mathe-Quiz |
| `public/demo-games/physik-sim/index.html` | HTML-Einstiegspunkt fuer Physik-Simulator |
| `public/demo-games/physik-sim/simulation.js` | Canvas-Simulation: Baelle, Physik |
| `public/demo-games/physik-sim/style.css` | Styling fuer Physik-Simulator |
