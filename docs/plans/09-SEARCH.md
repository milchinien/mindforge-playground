# 09 - Suche

## Was wird hier gemacht?

In diesem Schritt baust du die **Such-Seite** unter `/search`. User koennen Spiele suchen ueber:
- **Freitext-Suche** via URL-Parameter `?q=SUCHBEGRIFF`
- **Tag-Suche** via URL-Parameter `?tag=TAG`
- **Sortierung** nach Relevanz, Beliebtheit, Neueste, Meistgespielt
- **Verbindung zur Navbar** (Suchfeld navigiert zu /search?q=X)
- **Eigene Ergebnis-Darstellung** (horizontaler/detaillierterer Stil als GameCard)
- **"Keine Ergebnisse" Empty State**

Am Ende koennen User ueber die Navbar oder direkt auf der Such-Seite nach Spielen suchen und die Ergebnisse filtern und sortieren.

---

## Voraussetzung

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein (Navbar mit Suchfeld)
- Datei `04-MINDBROWSER.md` muss abgeschlossen sein (`mockGames.js`, `TagList`)

---

## Uebersicht der Seite

```
┌──────────────────────────────────────────────────────────────────┐
│  NAVBAR  [...Suchfeld: "mathe"...]                                │
├────────────┬─────────────────────────────────────────────────────┤
│  SIDEBAR   │                                                      │
│            │  Suchergebnisse fuer "mathe"                         │
│            │  12 Ergebnisse gefunden                              │
│            │                                                      │
│            │  Filter: [Spiele ▼]  Sortierung: [Beliebt ▼]        │
│            │                                                      │
│            │  ┌────────────────────────────────────────────┐     │
│            │  │ [IMG] Mathe-Meister                         │     │
│            │  │       von MindForge Team                    │     │
│            │  │       Teste dein mathematisches Wissen...   │     │
│            │  │       #mathematik #quiz    ♥ 245  ▶ 1.8K   │     │
│            │  └────────────────────────────────────────────┘     │
│            │                                                      │
│            │  ┌────────────────────────────────────────────┐     │
│            │  │ [IMG] Mathe-Champions                       │     │
│            │  │       von LernProfi                         │     │
│            │  │       Werde zum Mathe-Champion mit...       │     │
│            │  │       #mathematik #wettbewerb  ♥ 89  ▶ 520 │     │
│            │  └────────────────────────────────────────────┘     │
│            │                                                      │
│            │  ┌────────────────────────────────────────────┐     │
│            │  │ [IMG] Bruchrechnung leicht gemacht          │     │
│            │  │       ...                                    │     │
│            │  └────────────────────────────────────────────┘     │
│            │                                                      │
└────────────┴─────────────────────────────────────────────────────┘
```

### Keine Ergebnisse:

```
┌────────────────────────────────────────────────────┐
│                                                      │
│  Suchergebnisse fuer "xyz123abc"                    │
│  0 Ergebnisse gefunden                               │
│                                                      │
│          🔍                                          │
│                                                      │
│    Keine Ergebnisse gefunden.                        │
│    Versuche einen anderen Suchbegriff                │
│    oder stoebre im Mindbrowser.                      │
│                                                      │
│    [Zum Mindbrowser]                                 │
│                                                      │
└────────────────────────────────────────────────────┘
```

---

## Suchalgorithmus

Der Suchalgorithmus durchsucht die Mock-Daten nach Uebereinstimmungen in Titel, Tags und Creator-Name.

### Implementierung:

```javascript
/**
 * Durchsucht die Spiele nach einem Suchbegriff
 * Durchsucht: title, tags[], creator
 *
 * @param {string} query - Der Suchbegriff
 * @param {Array} games - Die Spieleliste (mockGames)
 * @returns {Array} - Gefundene Spiele, sortiert nach Relevanz
 */
function searchGames(query, games) {
  if (!query || query.trim() === '') return []

  const searchTerm = query.toLowerCase().trim()

  return games
    .map(game => {
      let score = 0

      // Titel-Match (hoechste Prioritaet)
      if (game.title.toLowerCase().includes(searchTerm)) {
        score += 10
        // Exakter Titel-Start: noch hoeher
        if (game.title.toLowerCase().startsWith(searchTerm)) {
          score += 5
        }
      }

      // Tag-Match (mittlere Prioritaet)
      if (game.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
        score += 5
      }

      // Creator-Match (niedrigere Prioritaet)
      if (game.creator.toLowerCase().includes(searchTerm)) {
        score += 3
      }

      return { ...game, relevanceScore: score }
    })
    .filter(game => game.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
}

/**
 * Findet Spiele mit einem bestimmten Tag
 *
 * @param {string} tag - Der Tag
 * @param {Array} games - Die Spieleliste
 * @returns {Array} - Gefundene Spiele
 */
function searchByTag(tag, games) {
  if (!tag) return []
  return games.filter(game =>
    game.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}
```

---

## Sortieroptionen

```javascript
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevanz' },       // Standard bei Textsuche
  { value: 'popular', label: 'Beliebt' },           // Nach Likes sortiert
  { value: 'new', label: 'Neueste' },               // Nach Erstelldatum sortiert
  { value: 'mostPlayed', label: 'Meistgespielt' }   // Nach Plays sortiert
]

function sortGames(games, sortBy) {
  switch (sortBy) {
    case 'popular':
      return [...games].sort((a, b) => b.likes - a.likes)
    case 'new':
      return [...games].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'mostPlayed':
      return [...games].sort((a, b) => b.plays - a.plays)
    case 'relevance':
    default:
      return games  // Bereits nach Relevanz sortiert
  }
}
```

---

## Filteroptionen (MVP)

Fuer den MVP gibt es nur den Filter "Spiele". Spaetere Filter (Creators, Assets) werden als "Coming Soon" angezeigt:

```javascript
const FILTER_OPTIONS = [
  { value: 'games', label: 'Spiele', enabled: true },
  { value: 'creators', label: 'Creators', enabled: false },   // Coming Soon
  { value: 'assets', label: 'Assets', enabled: false }         // Coming Soon
]
```

Deaktivierte Filter sind ausgegraut und nicht klickbar.

---

## Datei 1: Search Result Item

Die Suchergebnisse verwenden ein eigenes Layout das detaillierter ist als die GameCard (horizontal statt vertikal).

### Aufbau eines Suchergebnisses:

```
┌──────────────────────────────────────────────────────────┐
│  ┌──────────┐                                             │
│  │          │  Mathe-Meister                    [PREMIUM] │
│  │ THUMB-   │  von MindForge Team                         │
│  │ NAIL     │                                              │
│  │          │  Teste dein mathematisches Wissen mit        │
│  │          │  spannenden Aufgaben von Addition bis...     │
│  └──────────┘                                              │
│               #mathematik #quiz #grundschule               │
│               ♥ 245  ✕ 12  ▶ 1.8K  👁 3.5K               │
└──────────────────────────────────────────────────────────┘
```

### Props:

```javascript
{
  game: { ... }    // Object - Die Spieldaten
}
```

### Implementierungsdetails:

- **Horizontales Layout:** Thumbnail links (feste Breite ca. 200px), Infos rechts
- **Thumbnail:** Kleiner als in der GameCard, 16:9 Format, abgerundet
- **Titel:** Klickbar, navigiert zu `/game/${game.id}`, fett, `text-lg`
- **Creator:** "von {creator}" als Link zu `/profile/USERNAME`
- **Beschreibung:** Maximal 2 Zeilen, abgeschnitten (`line-clamp-2`)
- **Tags:** `TagList` Komponente, alle Tags
- **Stats:** Alle Stats in einer Zeile (Likes, Dislikes, Plays, Views)
- **Premium-Badge:** Wenn `premium: true`, rechts oben
- **Hover-Effekt:** Leichter Hintergrund-Wechsel
- **Klick:** Gesamte Karte klickbar (Link zu GameDetail)

### Styling:

```
Hintergrund: bg-bg-secondary hover:bg-bg-card
Abgerundet: rounded-xl
Padding: p-4
Flex: flex gap-4
Thumbnail: w-48 h-28 flex-shrink-0 rounded-lg
Transition: transition-colors duration-200
```

---

## Datei 2: `src/pages/Search.jsx`

Die Hauptseite fuer die Suche.

### Implementierungsdetails:

**URL-Parameter lesen:**
```javascript
import { useSearchParams } from 'react-router-dom'

const [searchParams, setSearchParams] = useSearchParams()
const query = searchParams.get('q') || ''
const tag = searchParams.get('tag') || ''
const sortParam = searchParams.get('sort') || 'relevance'
```

**State:**
```javascript
const [sortBy, setSortBy] = useState(sortParam)
const [results, setResults] = useState([])
```

**Suche ausfuehren:**
```javascript
useEffect(() => {
  let searchResults = []

  if (query) {
    searchResults = searchGames(query, mockGames)
  } else if (tag) {
    searchResults = searchByTag(tag, mockGames)
  }

  // Sortierung anwenden
  searchResults = sortGames(searchResults, sortBy)

  setResults(searchResults)
}, [query, tag, sortBy])
```

**Suchfeld auf der Seite (zusaetzlich zum Navbar-Suchfeld):**
```jsx
<div className="mb-6">
  <input
    type="text"
    value={localQuery}
    onChange={(e) => setLocalQuery(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        setSearchParams({ q: localQuery })
      }
    }}
    placeholder="Spiele suchen..."
    className="w-full bg-bg-card border border-gray-600 rounded-lg px-4 py-3 text-lg"
  />
</div>
```

**Sortierung aendern:**
```javascript
function handleSortChange(newSort) {
  setSortBy(newSort)
  // URL aktualisieren
  const params = new URLSearchParams(searchParams)
  params.set('sort', newSort)
  setSearchParams(params)
}
```

### Gesamtstruktur:

```jsx
function Search() {
  // ... State, URL-Params, Suche ...

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        {query && <h1 className="text-2xl font-bold">Suchergebnisse fuer "{query}"</h1>}
        {tag && <h1 className="text-2xl font-bold">Spiele mit Tag #{tag}</h1>}
        <p className="text-text-secondary">{results.length} Ergebnisse gefunden</p>
      </div>

      {/* Suchfeld */}
      <SearchInput />

      {/* Filter & Sortierung */}
      <div className="flex gap-4 mb-6">
        <FilterDropdown />
        <SortDropdown value={sortBy} onChange={handleSortChange} />
      </div>

      {/* Ergebnisse */}
      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map(game => (
            <SearchResultItem key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <EmptySearchState query={query} tag={tag} />
      )}
    </div>
  )
}
```

---

## Verbindung zur Navbar

Das Suchfeld in der Navbar muss mit der Such-Seite verbunden werden:

### In Navbar.jsx:

```javascript
const [searchQuery, setSearchQuery] = useState('')
const navigate = useNavigate()

function handleSearch(e) {
  if (e.key === 'Enter' && searchQuery.trim()) {
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    setSearchQuery('')  // Suchfeld leeren
  }
}
```

```jsx
<input
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyDown={handleSearch}
  placeholder="Spiele suchen..."
  className="bg-bg-card border border-gray-600 rounded-lg px-3 py-2 text-sm w-48 lg:w-64"
/>
```

**Beide Suchfelder** (Navbar + Search-Seite) navigieren zu `/search?q=QUERY`. Das Navbar-Suchfeld leert sich nach dem Abschicken.

---

## Empty State

```jsx
function EmptySearchState({ query, tag }) {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🔍</div>
      <h2 className="text-xl font-bold mb-2">Keine Ergebnisse gefunden</h2>
      <p className="text-text-secondary mb-6">
        {query
          ? `Fuer "${query}" wurden keine Spiele gefunden.`
          : `Keine Spiele mit dem Tag #${tag} gefunden.`}
      </p>
      <p className="text-text-muted mb-6">
        Versuche einen anderen Suchbegriff oder stoebre im Mindbrowser.
      </p>
      <Link to="/browse" className="bg-accent hover:bg-accent-dark px-6 py-3 rounded-lg font-semibold inline-block">
        Zum Mindbrowser
      </Link>
    </div>
  )
}
```

---

## Debounce (optional, empfohlen)

Wenn ein Echtzeit-Suchfeld implementiert wird (Ergebnisse beim Tippen), ist Debounce empfohlen um die Anzahl der Suchvorgaenge zu reduzieren:

```javascript
// Einfacher Debounce Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Verwendung:
const debouncedQuery = useDebounce(localQuery, 300)

useEffect(() => {
  if (debouncedQuery) {
    const results = searchGames(debouncedQuery, mockGames)
    setResults(results)
  }
}, [debouncedQuery])
```

**Fuer den MVP nicht zwingend erforderlich** - die Suche wird bei Enter ausgefuehrt. Debounce ist eine optionale Verbesserung.

---

## Testen

1. **Navbar-Suche:**
   - Tippe "mathe" ins Navbar-Suchfeld und druecke Enter
   - Weiterleitung zu `/search?q=mathe`
   - Ergebnisse werden angezeigt

2. **Tag-Suche:**
   - Klicke auf einen Tag (z.B. "#mathematik") auf einer GameCard
   - Weiterleitung zu `/search?tag=mathematik`
   - Alle Spiele mit diesem Tag werden angezeigt

3. **Suchergebnisse:**
   - Ergebnisse zeigen Thumbnail, Titel, Creator, Beschreibung, Tags, Stats
   - Klick auf Ergebnis navigiert zu `/game/:id`
   - Creator-Link navigiert zu `/profile/USERNAME`

4. **Sortierung:**
   - Wechsel zwischen Relevanz, Beliebt, Neueste, Meistgespielt
   - Ergebnisse werden neu sortiert

5. **Keine Ergebnisse:**
   - Suche nach "xyz123abc" → Empty State mit Link zum Mindbrowser

6. **Such-Seiten-Suchfeld:**
   - Suchfeld auf der Search-Seite funktioniert (Enter → neue Suche)

7. **URL-Parameter:**
   - Direkter Aufruf von `/search?q=physik` zeigt Ergebnisse
   - `/search?tag=simulation&sort=popular` funktioniert

---

## Checkliste

- [ ] Suchalgorithmus implementiert (durchsucht title, tags, creator)
- [ ] Such-Ergebnis-Komponente erstellt (horizontales Layout)
- [ ] `src/pages/Search.jsx` erstellt mit Suchfeld, Filter, Sortierung, Ergebnissen
- [ ] URL-Parameter `?q=QUERY` und `?tag=TAG` werden korrekt gelesen
- [ ] Sortierung funktioniert (Relevanz, Beliebt, Neueste, Meistgespielt)
- [ ] Filter-Dropdown zeigt "Spiele" (aktiv) und "Creators"/"Assets" (Coming Soon)
- [ ] Navbar-Suchfeld navigiert zu `/search?q=QUERY`
- [ ] Klick auf Suchergebnis navigiert zu `/game/:id`
- [ ] Klick auf Tag navigiert zu `/search?tag=TAG`
- [ ] Empty State bei keinen Ergebnissen
- [ ] Empty State hat Link zum Mindbrowser
- [ ] Suchergebnisse zeigen alle relevanten Infos (Thumbnail, Titel, Creator, Beschreibung, Tags, Stats)
- [ ] Relevanz-Score: Titel-Match > Tag-Match > Creator-Match
- [ ] Suchfeld auf der Search-Seite selbst funktioniert
- [ ] Responsive Design funktioniert
- [ ] Route `/search` in App.jsx

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/pages/Search.jsx` | Such-Seite mit Suchfeld, Filter, Sortierung, Ergebnissen |
| `src/components/layout/Navbar.jsx` | Aktualisiert: Suchfeld navigiert zu /search?q=X |
