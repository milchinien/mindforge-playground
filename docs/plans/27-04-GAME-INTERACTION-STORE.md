# Step 4: Game Interaction Store + Page-Integration

## Ziel

Likes, Dislikes, Views und Plays werden echt gezählt und gespeichert.
Game-Statistiken kommen aus dem Store statt aus den statischen mockGames-Feldern.
Drei Pages werden umgestellt: GameDetail, GameCard, Home.

---

## 4.1 Neuer Store: `src/stores/gameInteractionStore.js`

**localStorage-Key:** `'mindforge-game-interactions'`

### State

```js
{
  // Was der aktuelle User getan hat (pro Game)
  likes: {},              // { [gameId]: true/false }
  dislikes: {},           // { [gameId]: true/false }
  plays: {},              // { [gameId]: number }
  ratings: {},            // { [gameId]: number (1-5) }

  // Session-only (NICHT persisted)
  viewedThisSession: {},  // { [gameId]: true }

  // Globale Stats (für alle User aggregiert, Startwerte aus mockGames)
  globalStats: {}
  // { [gameId]: { likes: number, dislikes: number, views: number, plays: number, avgRating: number, ratingCount: number } }
}
```

### Initialisierung der globalStats

```js
// Import am Anfang der Datei:
import { mockGames } from '../data/mockGames'

// Funktion die initial-Stats erzeugt:
function buildInitialGlobalStats() {
  const stats = {}
  for (const game of mockGames) {
    stats[game.id] = {
      likes: game.likes || 0,
      dislikes: game.dislikes || 0,
      views: game.views || 0,
      plays: game.plays || 0,
      avgRating: 0,
      ratingCount: 0,
    }
  }
  return stats
}

// Default-Wert für globalStats:
globalStats: buildInitialGlobalStats()

// WICHTIG: Wenn der Store aus localStorage geladen wird (persist), wird globalStats überschrieben.
// Neue Spiele die nach dem ersten Laden zu mockGames hinzugefügt werden, brauchen einen Fallback:
// → getGameStats() gibt Default-Werte zurück wenn ein gameId nicht in globalStats existiert.
```

### Actions — Exakte Signaturen

```js
toggleLike(gameId)
  // 1. Aktuellen Like-Status prüfen: const wasLiked = get().likes[gameId] === true
  // 2. Aktuellen Dislike-Status prüfen: const wasDisliked = get().dislikes[gameId] === true
  // 3. Wenn wasLiked (UN-Like):
  //    likes[gameId] = false
  //    globalStats[gameId].likes = Math.max(0, globalStats[gameId].likes - 1)
  // 4. Wenn !wasLiked (Like):
  //    likes[gameId] = true
  //    globalStats[gameId].likes++
  //    Wenn wasDisliked (gleichzeitig Dislike entfernen):
  //      dislikes[gameId] = false
  //      globalStats[gameId].dislikes = Math.max(0, globalStats[gameId].dislikes - 1)
  //
  // ACHTUNG: globalStats[gameId] muss existieren. Fallback erstellen wenn nicht:
  //   if (!globalStats[gameId]) globalStats[gameId] = { likes: 0, dislikes: 0, views: 0, plays: 0, avgRating: 0, ratingCount: 0 }

toggleDislike(gameId)
  // Spiegelbild von toggleLike:
  // 1. wasDisliked = get().dislikes[gameId] === true
  // 2. wasLiked = get().likes[gameId] === true
  // 3. Wenn wasDisliked: dislikes = false, globalStats.dislikes--
  // 4. Wenn !wasDisliked: dislikes = true, globalStats.dislikes++
  //    Wenn wasLiked: likes = false, globalStats.likes--

recordView(gameId)
  // 1. Wenn get().viewedThisSession[gameId] === true → return (schon gezählt diese Session)
  // 2. viewedThisSession[gameId] = true
  // 3. Fallback für globalStats[gameId] erstellen wenn nicht vorhanden
  // 4. globalStats[gameId].views++

recordPlay(gameId)
  // 1. plays[gameId] = (get().plays[gameId] || 0) + 1
  // 2. Fallback für globalStats[gameId]
  // 3. globalStats[gameId].plays++

setRating(gameId, rating)
  // 1. const oldRating = get().ratings[gameId] || 0
  // 2. const stats = get().globalStats[gameId] (mit Fallback)
  // 3. Wenn oldRating === 0 (erste Bewertung):
  //    stats.ratingCount++
  //    stats.avgRating = ((stats.avgRating * (stats.ratingCount - 1)) + rating) / stats.ratingCount
  // 4. Wenn oldRating > 0 (Bewertung ändern):
  //    stats.avgRating = ((stats.avgRating * stats.ratingCount) - oldRating + rating) / stats.ratingCount
  // 5. ratings[gameId] = rating

getGameStats(gameId)
  // return get().globalStats[gameId] || { likes: 0, dislikes: 0, views: 0, plays: 0, avgRating: 0, ratingCount: 0 }

hasLiked(gameId)
  // return get().likes[gameId] === true

hasDisliked(gameId)
  // return get().dislikes[gameId] === true

getUserRating(gameId)
  // return get().ratings[gameId] || 0

getTotalUserPlays()
  // return Object.values(get().plays).reduce((sum, p) => sum + p, 0)

deleteGameStats(gameId)
  // Entfernt gameId aus: likes, dislikes, plays, ratings, globalStats
  // (viewedThisSession muss nicht bereinigt werden, ist eh Session-only)
```

### Persist-Config

```js
persist(
  (set, get) => ({ ... }),
  {
    name: 'mindforge-game-interactions',
    partialize: (state) => ({
      likes: state.likes,
      dislikes: state.dislikes,
      plays: state.plays,
      ratings: state.ratings,
      globalStats: state.globalStats,
      // NICHT: viewedThisSession (soll bei jedem App-Start leer sein)
    }),
  }
)
```

---

## 4.2 Integration: `src/pages/GameDetail.jsx`

### Aktueller Zustand (was sich ändert)

```
AKTUELL:
  - useEffect mit Kommentar "// TODO: Increment view counter via API" → macht nichts
  - Like/Dislike über <LikeDislike> Komponente mit Props initialLikes/initialDislikes → lokaler State
  - Stats (views, plays, likes) werden aus game.views, game.plays, game.likes gelesen (statisch)

NEU:
  1. Import hinzufügen:
     import { useGameInteractionStore } from '../stores/gameInteractionStore'

  2. Im Komponenten-Body:
     const { recordView, getGameStats, hasLiked, hasDisliked, toggleLike, toggleDislike } = useGameInteractionStore()
     const stats = getGameStats(game.id)

  3. useEffect für View-Tracking:
     useEffect(() => {
       if (game?.id) recordView(game.id)
     }, [game?.id])

  4. Stats-Anzeige:
     game.views → stats.views
     game.plays → stats.plays
     game.likes → stats.likes
     game.dislikes → stats.dislikes

  5. Like/Dislike-Buttons:
     Statt <LikeDislike initialLikes={game.likes}> mit lokalem State:
     → toggleLike(game.id) / toggleDislike(game.id) direkt aufrufen
     → hasLiked(game.id) / hasDisliked(game.id) für aktiven Zustand
     → stats.likes / stats.dislikes für Zähler
```

### Hinweis zu LikeDislike-Komponente

```
Prüfen ob src/components/game/LikeDislike.jsx existiert.
  - Wenn ja: entweder umbauen auf Store oder Props-Interface beibehalten und in GameDetail den Store durchreichen
  - Wenn nein (inline in GameDetail): direkt die Buttons umstellen

EMPFEHLUNG: LikeDislike-Komponente beibehalten aber neue Props geben:
  <LikeDislike
    liked={hasLiked(game.id)}
    disliked={hasDisliked(game.id)}
    likes={stats.likes}
    dislikes={stats.dislikes}
    onLike={() => toggleLike(game.id)}
    onDislike={() => toggleDislike(game.id)}
  />
```

---

## 4.3 Integration: `src/components/game/GameCard.jsx`

```
AKTUELL:
  - Zeigt game.likes, game.plays, game.views aus dem game-Prop

NEU:
  1. Import: useGameInteractionStore
  2. const stats = useGameInteractionStore(s => s.getGameStats(game.id))
     ODER: const getGameStats = useGameInteractionStore(s => s.getGameStats)
           const stats = getGameStats(game.id)
  3. Ersetzen:
     game.likes → stats.likes
     game.plays → stats.plays
     game.views → stats.views

ACHTUNG: GameCard wird in Listen gerendert (viele Instanzen).
  → Performance: useGameInteractionStore mit Selektor nutzen, nicht den ganzen Store abonnieren
  → Empfehlung: const stats = useGameInteractionStore(s => s.globalStats[game.id]) || { likes: 0, ... }
```

---

## 4.4 Integration: `src/pages/Home.jsx`

```
AKTUELL:
  - getTrendingGames() aus mockGames → sortiert nach game.plays
  - getPopularGames() aus mockGames → sortiert nach game.likes
  - getFeaturedGames() aus mockGames → filtert nach game.featured

NEU:
  1. Import: useGameInteractionStore
  2. Featured bleibt unverändert (featured ist ein Metadatum, kein User-Stat)
  3. Trending sortieren nach globalStats[game.id].plays statt game.plays:
     const getGameStats = useGameInteractionStore(s => s.getGameStats)
     const trending = [...mockGames].sort((a, b) => getGameStats(b.id).plays - getGameStats(a.id).plays).slice(0, 8)
  4. Popular sortieren nach globalStats[game.id].likes:
     const popular = [...mockGames].sort((a, b) => getGameStats(b.id).likes - getGameStats(a.id).likes).slice(0, 8)
```

---

## 4.5 Play-Tracking: Wo wird recordPlay aufgerufen?

```
Prüfen welche Komponente das Spiel startet. Mögliche Stellen:
  - src/pages/GamePlayer.jsx
  - src/pages/GameDetail.jsx → "Spielen"-Button navigiert zu /play/:id
  - src/components/gameRenderer/GameRenderer.jsx

EMPFEHLUNG: recordPlay() in der Komponente aufrufen die das Spiel tatsächlich rendert/startet.
  → In GamePlayer.jsx / GameRenderer.jsx als useEffect:
     useEffect(() => {
       if (game?.id) recordPlay(game.id)
     }, [game?.id])

  → NICHT im GameDetail wenn der User nur auf "Spielen" klickt (das wäre zu früh wenn
     die Navigation fehlschlägt)
```

---

## Dateien

| Datei | Aktion |
|-------|--------|
| `src/stores/gameInteractionStore.js` | **NEU erstellen** |
| `src/pages/GameDetail.jsx` | **ÄNDERN** — Store-Import, recordView, Stats aus Store |
| `src/components/game/GameCard.jsx` | **ÄNDERN** — Stats aus Store statt game-Prop |
| `src/pages/Home.jsx` | **ÄNDERN** — Sorting nach globalStats |
| `src/pages/GamePlayer.jsx` oder `GameRenderer.jsx` | **ÄNDERN** — recordPlay hinzufügen |
| `src/components/game/LikeDislike.jsx` (falls vorhanden) | **ÄNDERN** — Props-Interface anpassen |

## Prüfung nach Implementierung

1. GameDetail öffnen → View-Counter steigt um 1
2. Seite neu laden → View-Counter steigt NICHT erneut (Session-Deduplizierung)
3. Spiel liken → Like-Counter steigt, Like-Button ist aktiv markiert
4. Gleiches Spiel disliken → Like wird entfernt, Dislike ist aktiv
5. Spiel spielen → Play-Counter steigt
6. Home-Page: Trending und Popular sind nach echten Stats sortiert
7. Browser schließen und neu öffnen → Alle Stats sind noch da (localStorage)
8. Likes/Dislikes bleiben über Sessions hinweg gespeichert
