# 06 - Spiel-Detailseite

## Was wird hier gemacht?

In diesem Schritt baust du die **Spiel-Detailseite** unter `/game/:id`. Diese Seite zeigt alle Informationen zu einem einzelnen Spiel:
- Grosses Thumbnail und optionale Screenshots
- Titel, Creator, Beschreibung, Tags
- Statistiken (Views, Plays, Likes/Dislikes, Erstelldatum)
- "Jetzt spielen" Button
- Zurueck-Button
- Creator-Link zum Profil
- 404-Handling fuer nicht-existierende Spiele

Am Ende kann ein User eine detaillierte Uebersicht eines Spiels sehen und von dort aus das Spiel starten.

---

## Voraussetzung

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein
- Datei `04-MINDBROWSER.md` muss abgeschlossen sein (`mockGames.js` + `TagList`)
- `src/data/mockGames.js` existiert mit Mock-Daten

---

## Uebersicht der Seite

```
┌──────────────────────────────────────────────────────────────────┐
│  NAVBAR                                                           │
├────────────┬─────────────────────────────────────────────────────┤
│  SIDEBAR   │                                                      │
│            │  [← Zurueck]                                         │
│            │                                                      │
│            │  ┌─────────────────────┬─────────────────────────┐  │
│            │  │                     │  Mathe-Meister           │  │
│            │  │  GROSSES THUMBNAIL  │  von MindForge Team →    │  │
│            │  │  (16:9 Format)      │                          │  │
│            │  │                     │  Teste dein mathe-       │  │
│            │  │                     │  matisches Wissen mit    │  │
│            │  │                     │  spannenden Aufgaben...  │  │
│            │  │                     │                          │  │
│            │  └─────────────────────┤  #mathematik #quiz       │  │
│            │                        │  #grundschule            │  │
│            │  Screenshots:          │                          │  │
│            │  [img1] [img2] [img3]  │  ───────────────────     │  │
│            │                        │                          │  │
│            │                        │  👁 3.500  ▶ 1.832      │  │
│            │                        │  ♥ 245    ✕ 12          │  │
│            │                        │  📅 15.12.2024          │  │
│            │                        │                          │  │
│            │                        │  [   JETZT SPIELEN   ]  │  │
│            │                        │                          │  │
│            │                        │  [♥ Like] [✕ Dislike]   │  │
│            │                        │                          │  │
│            │                        └─────────────────────────┘  │
│            │                                                      │
└────────────┴─────────────────────────────────────────────────────┘
```

---

## Datei 1: `src/utils/formatters.js`

Hilfsfunktionen zum Formatieren von Zahlen und Daten. Werden ueberall in der App wiederverwendet.

### formatNumber:

Formatiert grosse Zahlen lesbar:

```javascript
// src/utils/formatters.js

/**
 * Formatiert eine Zahl fuer die Anzeige
 * 999 → "999"
 * 1000 → "1K"
 * 1500 → "1.5K"
 * 1832 → "1.8K"
 * 10000 → "10K"
 * 1000000 → "1M"
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return "0"

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

/**
 * Formatiert ein Datum fuer die Anzeige
 * "2024-12-15" → "15.12.2024" (deutsches Format)
 */
export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Relative Zeitangabe
 * "vor 5 Minuten", "vor 2 Stunden", "vor 3 Tagen"
 */
export function timeAgo(dateString) {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return 'gerade eben'
  if (seconds < 3600) return `vor ${Math.floor(seconds / 60)} Minuten`
  if (seconds < 86400) return `vor ${Math.floor(seconds / 3600)} Stunden`
  if (seconds < 2592000) return `vor ${Math.floor(seconds / 86400)} Tagen`
  if (seconds < 31536000) return `vor ${Math.floor(seconds / 2592000)} Monaten`
  return `vor ${Math.floor(seconds / 31536000)} Jahren`
}
```

---

## Datei 2: `src/pages/GameDetail.jsx`

Die Hauptseite fuer die Spieldetails.

### Implementierungsdetails:

**URL-Parameter:**
- Die Spiel-ID kommt aus der URL: `/game/:id`
- Verwendet `useParams()` von React Router

**Spiel laden:**
```javascript
const { id } = useParams()
const game = getGameById(id)

// Wenn Spiel nicht gefunden → 404
if (!game) {
  return <NotFoundState />
}
```

**Zwei-Spalten-Layout:**

```jsx
<div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
  {/* Linke Spalte: Bilder (3/5 Breite) */}
  <div className="lg:col-span-3">
    {/* Grosses Thumbnail */}
    {/* Screenshots Gallery */}
  </div>

  {/* Rechte Spalte: Infos (2/5 Breite) */}
  <div className="lg:col-span-2">
    {/* Titel, Creator, Beschreibung, Tags, Stats, Buttons */}
  </div>
</div>
```

### Linke Spalte - Bilder:

**Grosses Thumbnail:**
- Volle Breite der linken Spalte
- Seitenverhaeltnis 16:9 (`aspect-video`)
- Abgerundet: `rounded-xl`
- Object-fit: `object-cover`
- Wenn kein Bild: Farbiger Placeholder (wie in GameCard)

**Screenshots Gallery (optional):**
- Unter dem Thumbnail
- Horizontal scrollbare Reihe kleiner Bilder
- Klick auf Screenshot: Grosses Thumbnail wird ersetzt (oder Modal)
- Wenn keine Screenshots: Sektion wird nicht angezeigt

```
[Grosses Bild hier - Thumbnail oder ausgewaehlter Screenshot]

[thumb1] [thumb2] [thumb3] [thumb4] [thumb5]  ← kleine klickbare Vorschauen
```

### Rechte Spalte - Informationen:

**Titel:**
- Gross und fett (`text-3xl font-bold`)
- Premium-Badge daneben (wenn `premium: true`)

**Creator-Link:**
- "von {creator}" als klickbarer Link
- Navigiert zu `/profile/{creatorId}` oder `/profile/{creator}`
- Akzent-Farbe, Hover-Unterstreichung

**Beschreibung:**
- Voller Text der Spielbeschreibung
- `text-text-secondary`
- Kann mehrzeilig sein

**Tags:**
- Verwende die `TagList` Komponente aus Plan 04
- Alle Tags anzeigen (kein Limit hier)

**Statistiken:**

```
┌─────────────────────────────────┐
│  👁 3.500 Views                  │
│  ▶  1.832 Plays                 │
│  ♥  245 Likes   ✕ 12 Dislikes  │
│  📅 Erstellt am 15.12.2024     │
└─────────────────────────────────┘
```

- Jede Statistik auf einer eigenen Zeile oder in einem Grid
- Zahlen mit `formatNumber()` formatiert
- Datum mit `formatDate()` formatiert
- Icons: Unicode oder lucide-react (Eye, Play, Heart, ThumbsDown, Calendar)

**"Jetzt spielen" Button:**
- Gross und auffaellig
- Akzent-Farbe (`bg-accent hover:bg-accent-dark`)
- Volle Breite der rechten Spalte
- Navigiert zu `/play/${game.id}`
- Wenn `premium: true` und User kein Premium: "Premium erforderlich" anzeigen

**Like/Dislike Buttons (Platzhalter):**
- Zwei Buttons nebeneinander: Like (Herz) und Dislike (Daumen runter)
- Fuer den MVP nur visuell, die volle Funktionalitaet kommt in Plan 10
- Zeigen die aktuellen Zahlen aus den Mock-Daten

### Zurueck-Button:

```jsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

<button onClick={() => navigate(-1)} className="...">
  ← Zurueck
</button>
```

- Oben links auf der Seite
- Navigiert zur vorherigen Seite (`navigate(-1)`)
- Falls keine History: Navigiert zu `/browse`

### View Counter (Mock):

Beim Laden der Seite soll der View-Counter inkrementiert werden. Fuer den MVP nur als console.log oder lokaler State:

```javascript
useEffect(() => {
  // Mock: View-Counter erhoehen
  console.log(`View fuer Spiel ${id} gezaehlt`)
  // Spaeter: Firestore-Update
}, [id])
```

### 404 Handling:

Wenn das Spiel nicht gefunden wird (`getGameById()` gibt `undefined` zurueck):

```jsx
function NotFoundState() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-text-muted mb-4">404</h1>
      <p className="text-xl text-text-secondary mb-6">
        Dieses Spiel wurde nicht gefunden.
      </p>
      <Link to="/browse" className="text-accent hover:underline">
        Zurueck zum Mindbrowser
      </Link>
    </div>
  )
}
```

---

## Responsive Design

Auf kleinen Bildschirmen (< 1024px) wird das Zwei-Spalten-Layout zu einer einzelnen Spalte:

```
[Grosses Thumbnail]
[Screenshots]
[Titel]
[Creator]
[Beschreibung]
[Tags]
[Stats]
[Jetzt spielen Button]
[Like/Dislike]
```

Das Grid wechselt von `grid-cols-5` zu `grid-cols-1`:
```jsx
<div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
```

---

## Testen

1. **Navigiere zu `/game/game-001`** - Detail-Seite fuer das erste Spiel
2. **Zwei-Spalten-Layout** - Links Bilder, rechts Informationen
3. **Grosses Thumbnail** - Zeigt das Spiel-Bild (oder Placeholder)
4. **Titel + Creator** - Titel gross, Creator als klickbarer Link
5. **Beschreibung** - Voller Text sichtbar
6. **Tags** - Klickbar, fuehren zu `/search?tag=TAG`
7. **Statistiken** - Views, Plays, Likes, Dislikes, Erstelldatum formatiert
8. **"Jetzt spielen" Button** - Fuehrt zu `/play/game-001`
9. **Zurueck-Button** - Navigiert zur vorherigen Seite
10. **Creator-Link** - Fuehrt zu `/profile/USERNAME`
11. **404** - Navigiere zu `/game/non-existent` → 404-Seite
12. **Responsive** - Auf kleinen Bildschirmen: Einspaltiges Layout

---

## Checkliste

- [ ] `src/utils/formatters.js` erstellt mit formatNumber, formatDate, timeAgo
- [ ] `src/pages/GameDetail.jsx` erstellt mit Zwei-Spalten-Layout
- [ ] Grosses Thumbnail wird angezeigt (oder Placeholder)
- [ ] Screenshots Gallery (optional, wenn Screenshots vorhanden)
- [ ] Titel, Creator-Link, Beschreibung, Tags korrekt angezeigt
- [ ] Statistiken formatiert (formatNumber, formatDate)
- [ ] "Jetzt spielen" Button navigiert zu /play/:id
- [ ] Zurueck-Button navigiert zur vorherigen Seite
- [ ] Creator-Link navigiert zu /profile/USERNAME
- [ ] 404-Handling fuer nicht-existierende Spiele
- [ ] Like/Dislike Buttons als Platzhalter vorhanden
- [ ] View-Counter wird (mock) inkrementiert
- [ ] Responsive: Einspaltiges Layout auf kleinen Bildschirmen
- [ ] Route `/game/:id` in App.jsx zeigt GameDetail
- [ ] TagList Komponente aus Plan 04 wird wiederverwendet

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/utils/formatters.js` | formatNumber, formatDate, timeAgo Hilfsfunktionen |
| `src/pages/GameDetail.jsx` | Spiel-Detailseite mit Zwei-Spalten-Layout |
