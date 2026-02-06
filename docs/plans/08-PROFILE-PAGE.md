# 08 - Profil-Seite

## Was wird hier gemacht?

In diesem Schritt baust du die **Profil-Seite** unter `/profile/:username`. Jeder User hat ein oeffentliches Profil das folgendes zeigt:
- **ProfileHeader** mit Avatar, Username, Bio, Statistiken und Follow/Edit Button
- **ProfileTabs** mit drei Tabs: Erstellte Spiele, Favoriten, Achievements
- **Erstellte Spiele Tab** - Grid von GameCards die der User erstellt hat
- **Favoriten Tab** - Spiele die der User geliked hat
- **Achievements Tab** - Achievement-Fortschritt (Platzhalter fuer Plan 18)
- **Edit-Profil Modal** zum Aendern von Bio und Social Links
- **404-Handling** fuer nicht-existierende User

Am Ende kann jeder User Profile ansehen, sein eigenes Profil bearbeiten und die verschiedenen Tabs durchblaettern.

---

## Voraussetzung

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein
- Datei `03-AUTHENTICATION.md` muss abgeschlossen sein (useAuth, User-Daten)
- Datei `04-MINDBROWSER.md` muss abgeschlossen sein (GameCard Komponente)

---

## Uebersicht der Seite

```
┌──────────────────────────────────────────────────────────────────┐
│  NAVBAR                                                           │
├────────────┬─────────────────────────────────────────────────────┤
│  SIDEBAR   │                                                      │
│            │  ┌─────────────────────────────────────────────┐    │
│            │  │          PROFILE HEADER                       │    │
│            │  │                                               │    │
│            │  │  ┌─────┐  spieler42                          │    │
│            │  │  │     │  "Ich liebe Mathe-Spiele!"          │    │
│            │  │  │ AVA │                                      │    │
│            │  │  │ TAR │  Follower: 42  Following: 15        │    │
│            │  │  │     │  Spiele: 3     Plays: 5.2K          │    │
│            │  │  └─────┘                                      │    │
│            │  │                  [Folgen] oder [Profil bearbeiten]│
│            │  └─────────────────────────────────────────────┘    │
│            │                                                      │
│            │  ┌──────────────┬──────────┬──────────────┐         │
│            │  │ Erstellte    │ Favoriten│ Achievements │         │
│            │  │ Spiele (3)   │    (12)  │              │         │
│            │  └──────────────┴──────────┴──────────────┘         │
│            │                                                      │
│            │  ┌──────┐ ┌──────┐ ┌──────┐                        │
│            │  │Game 1│ │Game 2│ │Game 3│  ← Tab-Inhalt          │
│            │  └──────┘ └──────┘ └──────┘                        │
│            │                                                      │
└────────────┴─────────────────────────────────────────────────────┘
```

---

## Mock-Profil-Daten

Fuer den MVP verwenden wir Mock-Daten fuer andere Profile. Das eigene Profil kommt aus dem AuthContext.

```javascript
// In der Profile.jsx oder in einem eigenen mockUsers.js

const mockUsers = [
  {
    uid: "user-001",
    username: "MindForgeTeam",
    email: "team@mindforge.com",
    createdAt: "2024-01-01",
    avatar: {
      skinColor: "#f5d0a9",
      hairColor: "#4a3728",
      hairStyle: "short",
      eyes: "normal"
    },
    bio: "Das offizielle MindForge Team. Wir erstellen Lernspiele fuer alle!",
    isPremium: true,
    premiumTier: "pro",
    isTeacher: false,
    totalPlays: 5200,
    gamesCreated: 3,
    followers: 342,
    following: 15,
    mindCoins: 1000,
    theme: "dark",
    activeTitle: "Gruender",
    hasSeenWelcome: true,
    socialLinks: {
      website: "https://mindforge.com",
      twitter: "",
      youtube: ""
    }
  },
  {
    uid: "user-002",
    username: "ScienceGamer",
    email: "science@example.com",
    createdAt: "2024-03-15",
    avatar: {
      skinColor: "#d4a574",
      hairColor: "#1a1a1a",
      hairStyle: "long",
      eyes: "happy"
    },
    bio: "Physik und Chemie sind meine Leidenschaft! Hier teile ich meine Simulationen.",
    isPremium: true,
    premiumTier: "basic",
    isTeacher: true,
    totalPlays: 3100,
    gamesCreated: 5,
    followers: 189,
    following: 42,
    mindCoins: 500,
    theme: "dark",
    activeTitle: "Wissenschaftler",
    hasSeenWelcome: true,
    socialLinks: {
      website: "",
      twitter: "@sciencegamer",
      youtube: ""
    }
  }
]

// Hilfsfunktion
function getUserByUsername(username) {
  return mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase())
}
```

---

## Datei 1: `src/components/profile/ProfileHeader.jsx`

Der Header zeigt die wichtigsten Profil-Informationen.

### Props:

```javascript
{
  user: { ... },           // Object - User-Daten (aus Firestore oder Mock)
  isOwnProfile: false,     // Boolean - Ist das das eigene Profil?
  onEditClick: () => {},   // Function - Callback fuer Edit-Button
  onFollowClick: () => {}, // Function - Callback fuer Follow-Button
  isFollowing: false       // Boolean - Folgt der aktuelle User diesem Profil?
}
```

### Aufbau:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ┌──────────┐   spieler42                                        │
│  │          │   "Wissenschaftler"  ← activeTitle (Badge)         │
│  │  AVATAR  │                                                     │
│  │  (gross) │   "Physik und Chemie sind meine Leidenschaft!"    │
│  │          │                                                     │
│  └──────────┘   ┌──────────┬──────────┬──────────┬──────────┐   │
│                  │ 189      │ 42       │ 5        │ 3.1K     │   │
│                  │ Follower │ Following│ Spiele   │ Plays    │   │
│                  └──────────┴──────────┴──────────┴──────────┘   │
│                                                                   │
│                  Mitglied seit Maerz 2024                         │
│                                                                   │
│                  [Folgen] oder [Profil bearbeiten]                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Implementierungsdetails:

**Avatar:**
- Grosser Kreis (w-24 h-24 oder w-32 h-32)
- Hintergrundfarbe = skinColor aus Avatar-Daten
- Fuer MVP: Einfacher Kreis mit Initialen oder Hautfarbe
- Spaeter (Plan 12): Echter Avatar-Renderer

**Username:**
- Gross und fett (`text-2xl font-bold`)
- Active Title darunter als kleines Badge (wenn vorhanden)

**Bio:**
- `text-text-secondary`, maximal 3 Zeilen

**Statistiken:**
- 4 Werte in einer Reihe (Grid oder Flex)
- Zahl oben (fett), Label unten (grau, klein)
- `formatNumber()` fuer grosse Zahlen
- Klick auf "Follower" → spaeter Follower-Liste
- Klick auf "Following" → spaeter Following-Liste

**Buttons:**
- **Eigenes Profil:** "Profil bearbeiten" Button (oeffnet Edit-Modal)
- **Fremdes Profil:** "Folgen" / "Folgst du" Toggle-Button
  - Nicht folgend: `bg-accent` "Folgen"
  - Folgend: `bg-bg-card border border-accent` "Folgst du" → Hover: "Entfolgen"
- **Nicht eingeloggt:** Kein Button oder "Einloggen um zu folgen"

**Mitglied seit:**
- Kleiner grauer Text, formatiert als "Mitglied seit {Monat Jahr}"

### Styling:

```
Hintergrund: bg-bg-secondary
Abgerundet: rounded-2xl
Padding: p-6
Flex-Layout: Avatar links, Infos rechts
Responsive: Auf Mobile untereinander (flex-col)
```

---

## Datei 2: `src/components/profile/ProfileTabs.jsx`

Tab-Navigation fuer die Profil-Inhalte.

### Props:

```javascript
{
  activeTab: "games",          // String - Aktiver Tab
  onTabChange: (tab) => {},    // Function - Tab wechseln
  gamesCount: 3,               // Number - Anzahl erstellte Spiele
  favoritesCount: 12,          // Number - Anzahl Favoriten
}
```

### Tabs:

| Tab-ID | Label | Icon |
|--------|-------|------|
| `games` | Erstellte Spiele (X) | Controller/Gamepad |
| `favorites` | Favoriten (X) | Herz |
| `achievements` | Achievements | Pokal/Stern |

### Implementierungsdetails:

- **Aktiver Tab:** Unterstreichung in Akzent-Farbe + fetter Text
- **Inaktiver Tab:** Grauer Text, Hover-Effekt
- **Count in Klammern:** "Erstellte Spiele (3)" - Zeigt Anzahl
- **Responsive:** Auf kleinen Bildschirmen: Tabs scrollen horizontal

### Styling:

```
Border unten: border-b border-gray-700
Aktiver Tab: border-b-2 border-accent text-accent font-semibold
Inaktiver Tab: text-text-muted hover:text-text-secondary
Padding: px-4 py-3
Gap: gap-0 (Tabs nebeneinander)
```

---

## Datei 3: `src/pages/Profile.jsx`

Die Hauptseite die alle Profil-Komponenten zusammenfuegt.

### Implementierungsdetails:

**URL-Parameter:**
```javascript
const { username } = useParams()
const { user: currentUser } = useAuth()
const [profileUser, setProfileUser] = useState(null)
const [activeTab, setActiveTab] = useState('games')
const [isEditModalOpen, setIsEditModalOpen] = useState(false)
const [isFollowing, setIsFollowing] = useState(false)
const [notFound, setNotFound] = useState(false)
```

**Profil laden:**
```javascript
useEffect(() => {
  // Pruefen ob es das eigene Profil ist
  if (currentUser && currentUser.username.toLowerCase() === username.toLowerCase()) {
    setProfileUser(currentUser)
    return
  }

  // Fremdes Profil aus Mock-Daten laden
  const user = getUserByUsername(username)
  if (user) {
    setProfileUser(user)
  } else {
    setNotFound(true)
  }
}, [username, currentUser])
```

**Eigenes Profil erkennen:**
```javascript
const isOwnProfile = currentUser && profileUser && currentUser.uid === profileUser.uid
```

**Tab-Inhalte:**

```jsx
{activeTab === 'games' && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {userGames.map(game => <GameCard key={game.id} game={game} />)}
    {userGames.length === 0 && (
      <p className="text-text-muted col-span-full text-center py-8">
        {isOwnProfile
          ? "Du hast noch keine Spiele erstellt."
          : "Dieser User hat noch keine Spiele erstellt."}
      </p>
    )}
  </div>
)}

{activeTab === 'favorites' && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {favoriteGames.map(game => <GameCard key={game.id} game={game} />)}
    {favoriteGames.length === 0 && (
      <p className="text-text-muted col-span-full text-center py-8">
        Noch keine Favoriten.
      </p>
    )}
  </div>
)}

{activeTab === 'achievements' && (
  <div className="text-center py-12">
    <p className="text-4xl mb-4">🏆</p>
    <p className="text-text-secondary">
      Achievements kommen bald!
    </p>
    <p className="text-text-muted text-sm mt-2">
      Wird in einem zukuenftigen Update implementiert.
    </p>
  </div>
)}
```

**Spiele des Users laden (Mock):**
```javascript
// Erstellte Spiele dieses Users
const userGames = mockGames.filter(g => g.creatorId === profileUser?.uid)

// Favoriten (Mock: zufaellige Auswahl fuer den MVP)
const favoriteGames = mockGames.slice(0, 4)  // Platzhalter
```

---

## Datei 4: Edit-Profil Modal

Ein Modal zum Bearbeiten des eigenen Profils. Nur sichtbar wenn `isOwnProfile === true`.

### Aufbau:

```
┌───────────────────────────────────────┐
│  Profil bearbeiten              [X]   │
│                                        │
│  Bio:                                  │
│  ┌────────────────────────────────┐   │
│  │ Physik und Chemie sind meine   │   │
│  │ Leidenschaft!                  │   │
│  └────────────────────────────────┘   │
│                                        │
│  Website:                              │
│  [https://mindforge.com          ]    │
│                                        │
│  Twitter:                              │
│  [@sciencegamer                  ]    │
│                                        │
│  YouTube:                              │
│  [                               ]    │
│                                        │
│  [Abbrechen]        [Speichern]       │
│                                        │
└───────────────────────────────────────┘
```

### Implementierungsdetails:

- **Bio:** Textarea (max 200 Zeichen), Zeichenzaehler anzeigen
- **Social Links:** Optional, Website/Twitter/YouTube
- **Speichern:** Aktualisiert Firestore User-Dokument (ueber `updateUserData` aus AuthContext)
- **Abbrechen:** Schliesst Modal, verwirft Aenderungen
- **Validation:** Bio max 200 Zeichen, URLs muessen valide sein (optional)
- Fuer MVP: Kann auch als separate Seite statt Modal implementiert werden

### Styling:

```
Overlay: bg-black/50
Modal: bg-bg-secondary rounded-2xl p-6 max-w-md mx-auto
Inputs: bg-bg-card border border-gray-600 rounded-lg p-3
Speichern-Button: bg-accent hover:bg-accent-dark
Abbrechen-Button: bg-bg-card hover:bg-bg-hover
```

---

## 404 Handling

Wenn der Username nicht gefunden wird:

```jsx
function ProfileNotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-text-muted mb-4">404</h1>
      <p className="text-xl text-text-secondary mb-2">
        Benutzer nicht gefunden
      </p>
      <p className="text-text-muted mb-6">
        Der Benutzer "{username}" existiert nicht.
      </p>
      <Link to="/" className="text-accent hover:underline">
        Zurueck zur Startseite
      </Link>
    </div>
  )
}
```

---

## Testen

1. **Eigenes Profil:**
   - Logge dich ein und navigiere zu `/profile/DEIN_USERNAME`
   - ProfileHeader zeigt deine Daten (Avatar, Username, Bio, Stats)
   - "Profil bearbeiten" Button ist sichtbar
   - Klick auf "Profil bearbeiten" oeffnet Modal
   - Bio aendern und speichern → Aenderung sichtbar

2. **Fremdes Profil:**
   - Navigiere zu `/profile/ScienceGamer` (Mock-User)
   - ProfileHeader zeigt die Mock-Daten
   - "Folgen" Button ist sichtbar (statt "Profil bearbeiten")
   - Klick auf "Folgen" togglet zu "Folgst du" (visuell, Mock)

3. **Tabs:**
   - "Erstellte Spiele" Tab zeigt GameCards des Users
   - "Favoriten" Tab zeigt gelikte Spiele (Mock)
   - "Achievements" Tab zeigt "Kommt bald" Platzhalter
   - Tab-Wechsel funktioniert, aktiver Tab ist hervorgehoben

4. **404:**
   - Navigiere zu `/profile/nichtexistent` → 404-Seite
   - Link "Zurueck zur Startseite" funktioniert

5. **Responsive:**
   - Auf Mobile: ProfileHeader wird vertikal (Avatar oben, Infos unten)
   - Tabs scrollen horizontal wenn noetig
   - GameCard-Grid passt sich an (1-4 Spalten)

---

## Checkliste

- [ ] `src/components/profile/ProfileHeader.jsx` erstellt mit Avatar, Stats, Buttons
- [ ] `src/components/profile/ProfileTabs.jsx` erstellt mit 3 Tabs
- [ ] `src/pages/Profile.jsx` erstellt und erkennt eigenes vs. fremdes Profil
- [ ] ProfileHeader zeigt Username, Bio, Statistiken korrekt
- [ ] "Profil bearbeiten" Button nur auf eigenem Profil sichtbar
- [ ] "Folgen" Button nur auf fremdem Profil sichtbar
- [ ] Follow-Button togglet visuell zwischen "Folgen" und "Folgst du"
- [ ] Tab "Erstellte Spiele" zeigt GameCards des Users
- [ ] Tab "Favoriten" zeigt gelikte Spiele
- [ ] Tab "Achievements" zeigt Platzhalter
- [ ] Edit-Modal: Bio und Social Links bearbeitbar
- [ ] Edit-Modal: Speichern aktualisiert die Anzeige
- [ ] 404-Handling fuer nicht-existierende User
- [ ] Active Title Badge wird angezeigt (wenn vorhanden)
- [ ] Statistiken sind formatiert (formatNumber)
- [ ] "Mitglied seit" Datum wird angezeigt
- [ ] Responsive Design funktioniert
- [ ] Route `/profile/:username` in App.jsx

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/components/profile/ProfileHeader.jsx` | Profil-Header mit Avatar, Stats, Buttons |
| `src/components/profile/ProfileTabs.jsx` | Tab-Navigation (Spiele, Favoriten, Achievements) |
| `src/pages/Profile.jsx` | Profil-Seite mit Header, Tabs und Tab-Inhalten |
