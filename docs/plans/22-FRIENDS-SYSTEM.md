# 22 - Freunde-System (Friends)

## Was wird hier gemacht?

In diesem Schritt baust du ein bidirektionales Freunde-System. Im Gegensatz zum Follow-System (Plan 15) erfordert eine Freundschaft gegenseitige Bestaetigung: User A sendet eine Anfrage, User B akzeptiert oder lehnt ab. Die Freunde-Seite unter `/friends` zeigt alle Freunde, Online/Offline-Status und eingehende Anfragen.

---

## Voraussetzungen

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein
- Datei `03-AUTHENTICATION.md` muss abgeschlossen sein
- User muss eingeloggt sein

---

## Unterschied Follow vs. Friends

```
FOLLOW-SYSTEM (Plan 15):          FRIENDS-SYSTEM (Plan 22):
┌──────────────────────────┐      ┌──────────────────────────┐
│  Unidirektional          │      │  Bidirektional           │
│  A folgt B               │      │  A und B sind Freunde    │
│  B muss nichts tun       │      │  B muss akzeptieren      │
│  Kein Limit              │      │  Max. 200 Freunde        │
│  Fuer: Creators folgen   │      │  Fuer: Soziale Kontakte  │
│  Oeffentlich             │      │  Gegenseitig             │
└──────────────────────────┘      └──────────────────────────┘
```

---

## Uebersicht der Seite

```
┌──────────────────────────────────────────────────────────────────┐
│  FREUNDE (/friends)                                               │
│                                                                    │
│  [ + Freund hinzufuegen ]                                        │
│                                                                    │
│  ┌──────────┬──────────┬──────────┬───────────────┐              │
│  │ Alle (8) │Online (3)│Offline(5)│ Anfragen (2)  │  TABS       │
│  └──────────┴──────────┴──────────┴───────────────┘              │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  [Avatar] MaxGamer              ● Online                   │  │
│  │           Spielt: Mathe-Quiz Pro                           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  [Avatar] AnnaCreator           ● Online                   │  │
│  │           Erstellt gerade ein Spiel                        │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  [Avatar] ProLearner99          ○ Offline                  │  │
│  │           Zuletzt online vor 3 Stunden                     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  --- Anfragen-Tab ---                                            │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  [Avatar] LernHeld42                                       │  │
│  │           moechte dein Freund sein                          │  │
│  │           [ Annehmen ]  [ Ablehnen ]                       │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Firestore-Schema

### Collection: `friendships`

```javascript
// Dokument-ID: automatisch generiert
{
  user1Id: 'uid-a',           // Immer der User mit der "kleineren" UID (fuer konsistente Sortierung)
  user2Id: 'uid-b',           // Immer der User mit der "groesseren" UID
  status: 'pending',          // 'pending' | 'accepted' | 'declined'
  requestedBy: 'uid-a',      // Wer hat die Anfrage gesendet?
  createdAt: Timestamp,       // Wann wurde die Anfrage gesendet?
  acceptedAt: null,           // Wann wurde akzeptiert? (null wenn pending)
}
```

**Warum user1Id/user2Id statt senderId/receiverId?**
- Ermoeglicht einfachere Abfragen: Suche nach allen Freundschaften eines Users mit einer einzigen Query
- `requestedBy` zeigt wer die Anfrage gesendet hat

**Compound-Indizes benoetigt:**
- `user1Id` (ASC) + `status` (ASC) - Alle akzeptierten Freunde von User 1
- `user2Id` (ASC) + `status` (ASC) - Alle akzeptierten Freunde von User 2

### Limit: 200 Freunde pro User

```javascript
// Vor dem Senden einer Anfrage pruefen:
const friendCount = await countAcceptedFriendships(currentUser.uid)
if (friendCount >= 200) {
  // Toast: "Du hast die maximale Anzahl von 200 Freunden erreicht"
  return
}
```

---

## Mock-Daten

```javascript
const MOCK_FRIENDS = [
  {
    id: 'friend-1',
    friendshipId: 'fs-1',
    uid: 'user-101',
    username: 'MaxGamer',
    displayName: 'Max Gamer',
    avatar: null,
    isOnline: true,
    activity: 'Spielt: Mathe-Quiz Pro',
    lastOnline: null,
  },
  {
    id: 'friend-2',
    friendshipId: 'fs-2',
    uid: 'user-102',
    username: 'AnnaCreator',
    displayName: 'Anna Creator',
    avatar: null,
    isOnline: true,
    activity: 'Erstellt gerade ein Spiel',
    lastOnline: null,
  },
  {
    id: 'friend-3',
    friendshipId: 'fs-3',
    uid: 'user-103',
    username: 'PhysikFan',
    displayName: 'Physik Fan',
    avatar: null,
    isOnline: true,
    activity: 'Im Mindbrowser',
    lastOnline: null,
  },
  {
    id: 'friend-4',
    friendshipId: 'fs-4',
    uid: 'user-104',
    username: 'ProLearner99',
    displayName: 'Pro Learner',
    avatar: null,
    isOnline: false,
    activity: null,
    lastOnline: new Date(Date.now() - 3 * 60 * 60 * 1000),  // vor 3 Stunden
  },
  {
    id: 'friend-5',
    friendshipId: 'fs-5',
    uid: 'user-105',
    username: 'QuizKoenig',
    displayName: 'Quiz Koenig',
    avatar: null,
    isOnline: false,
    activity: null,
    lastOnline: new Date(Date.now() - 24 * 60 * 60 * 1000),  // vor 1 Tag
  },
  {
    id: 'friend-6',
    friendshipId: 'fs-6',
    uid: 'user-106',
    username: 'CodeNinja',
    displayName: 'Code Ninja',
    avatar: null,
    isOnline: false,
    activity: null,
    lastOnline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),  // vor 5 Tagen
  },
  {
    id: 'friend-7',
    friendshipId: 'fs-7',
    uid: 'user-107',
    username: 'LernMaschine',
    displayName: 'Lern Maschine',
    avatar: null,
    isOnline: false,
    activity: null,
    lastOnline: new Date(Date.now() - 12 * 60 * 60 * 1000),  // vor 12 Stunden
  },
  {
    id: 'friend-8',
    friendshipId: 'fs-8',
    uid: 'user-108',
    username: 'MatheMeister',
    displayName: 'Mathe Meister',
    avatar: null,
    isOnline: false,
    activity: null,
    lastOnline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),  // vor 2 Tagen
  },
]

const MOCK_FRIEND_REQUESTS = [
  {
    id: 'request-1',
    friendshipId: 'fs-pending-1',
    uid: 'user-201',
    username: 'LernHeld42',
    displayName: 'Lern Held',
    avatar: null,
    requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),  // vor 2 Stunden
  },
  {
    id: 'request-2',
    friendshipId: 'fs-pending-2',
    uid: 'user-202',
    username: 'BioExpertin',
    displayName: 'Bio Expertin',
    avatar: null,
    requestedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),  // vor 1 Tag
  },
]
```

---

## Datei 1: `src/pages/Friends.jsx`

Die Freunde-Seite mit Tabs.

**State:**

```jsx
const [activeTab, setActiveTab] = useState('all')
const [friends, setFriends] = useState(MOCK_FRIENDS)
const [requests, setRequests] = useState(MOCK_FRIEND_REQUESTS)
const [showAddFriendModal, setShowAddFriendModal] = useState(false)
```

**Tabs:**

```javascript
const onlineFriends = friends.filter(f => f.isOnline)
const offlineFriends = friends.filter(f => !f.isOnline)

const TABS = [
  { id: 'all',      label: 'Alle',      count: friends.length },
  { id: 'online',   label: 'Online',    count: onlineFriends.length },
  { id: 'offline',  label: 'Offline',   count: offlineFriends.length },
  { id: 'requests', label: 'Anfragen',  count: requests.length },
]
```

### Seiten-Layout

```jsx
return (
  <div className="max-w-3xl mx-auto p-6">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Freunde</h1>
      <button
        onClick={() => setShowAddFriendModal(true)}
        className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg
                   font-medium text-sm transition-colors"
      >
        + Freund hinzufuegen
      </button>
    </div>

    {/* Tab-Navigation */}
    <div className="flex border-b border-gray-700 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-3 text-sm font-medium transition-colors relative
            ${activeTab === tab.id ? 'text-accent' : 'text-text-muted hover:text-text-primary'}`}
        >
          {tab.label}
          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full
            ${tab.id === 'requests' && tab.count > 0
              ? 'bg-error/20 text-error'
              : 'bg-bg-hover'
            }`}>
            {tab.count}
          </span>
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
          )}
        </button>
      ))}
    </div>

    {/* Content basierend auf Tab */}
    {activeTab === 'all' && renderFriendList(friends)}
    {activeTab === 'online' && renderFriendList(onlineFriends)}
    {activeTab === 'offline' && renderFriendList(offlineFriends)}
    {activeTab === 'requests' && renderRequests(requests)}

    {/* Add Friend Modal */}
    {showAddFriendModal && (
      <AddFriendModal
        onClose={() => setShowAddFriendModal(false)}
        onSendRequest={handleSendRequest}
      />
    )}
  </div>
)
```

---

## Datei 2: `src/components/friends/FriendCard.jsx`

```jsx
export default function FriendCard({ friend }) {
  return (
    <div className="flex items-center gap-4 bg-bg-card rounded-xl p-4
                    hover:bg-bg-hover transition-colors">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 bg-bg-hover rounded-full flex items-center justify-center
                        text-lg font-bold text-text-primary">
          {friend.displayName?.charAt(0) || '?'}
        </div>
        {/* Online-Indikator */}
        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2
                          border-bg-card
          ${friend.isOnline ? 'bg-success' : 'bg-gray-500'}`}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            to={`/profile/${friend.username}`}
            className="font-semibold text-text-primary hover:text-accent transition-colors"
          >
            {friend.displayName}
          </Link>
          <span className={`text-xs ${friend.isOnline ? 'text-success' : 'text-text-muted'}`}>
            {friend.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <p className="text-sm text-text-muted truncate">
          {friend.isOnline && friend.activity
            ? friend.activity
            : friend.lastOnline
              ? `Zuletzt online ${timeAgo(friend.lastOnline)}`
              : 'Offline'
          }
        </p>
      </div>

      {/* Aktions-Menu (optional fuer MVP) */}
      <button className="text-text-muted hover:text-text-primary p-2">
        &#8226;&#8226;&#8226;
      </button>
    </div>
  )
}
```

---

## Datei 3: `src/components/friends/FriendRequestCard.jsx`

```jsx
export default function FriendRequestCard({ request, onAccept, onDecline }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAccept = async () => {
    setIsLoading(true)
    await onAccept(request.friendshipId)
    setIsLoading(false)
  }

  const handleDecline = async () => {
    setIsLoading(true)
    await onDecline(request.friendshipId)
    setIsLoading(false)
  }

  return (
    <div className="flex items-center gap-4 bg-bg-card rounded-xl p-4
                    border border-accent/20">
      {/* Avatar */}
      <div className="w-12 h-12 bg-bg-hover rounded-full flex items-center justify-center
                      text-lg font-bold text-text-primary flex-shrink-0">
        {request.displayName?.charAt(0) || '?'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/profile/${request.username}`}
          className="font-semibold text-text-primary hover:text-accent transition-colors"
        >
          {request.displayName}
        </Link>
        <p className="text-sm text-text-muted">
          moechte dein Freund sein - {timeAgo(request.requestedAt)}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={handleAccept}
          disabled={isLoading}
          className="bg-success hover:bg-green-600 text-white px-4 py-2 rounded-lg
                     text-sm font-medium transition-colors disabled:opacity-50"
        >
          Annehmen
        </button>
        <button
          onClick={handleDecline}
          disabled={isLoading}
          className="bg-bg-hover hover:bg-gray-500 text-text-primary px-4 py-2 rounded-lg
                     text-sm font-medium transition-colors disabled:opacity-50"
        >
          Ablehnen
        </button>
      </div>
    </div>
  )
}
```

---

## Datei 4: `src/components/friends/AddFriendModal.jsx`

```jsx
export default function AddFriendModal({ onClose, onSendRequest }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [sentRequests, setSentRequests] = useState([])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)

    // MVP: Mock-Suche
    // Spaeter: Firestore-Query auf users Collection
    const mockResults = [
      { uid: 'user-301', username: 'NeuerFreund', displayName: 'Neuer Freund', avatar: null },
      { uid: 'user-302', username: 'SpielProfi', displayName: 'Spiel Profi', avatar: null },
    ].filter(u =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setSearchResults(mockResults)
    setIsSearching(false)
  }

  const handleSendRequest = (userId) => {
    onSendRequest(userId)
    setSentRequests(prev => [...prev, userId])
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
         onClick={onClose}>
      <div className="bg-bg-secondary rounded-xl max-w-md w-full p-6"
           onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Freund hinzufuegen</h2>

        {/* Suchfeld */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Username suchen..."
            className="flex-1 bg-bg-hover text-text-primary border border-gray-600
                       rounded-lg px-4 py-2"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg
                       font-medium transition-colors disabled:opacity-50"
          >
            {isSearching ? '...' : 'Suchen'}
          </button>
        </div>

        {/* Suchergebnisse */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {searchResults.map((user) => (
            <div key={user.uid}
                 className="flex items-center gap-3 bg-bg-card rounded-lg p-3">
              <div className="w-10 h-10 bg-bg-hover rounded-full flex items-center justify-center
                              text-sm font-bold">
                {user.displayName?.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-primary">{user.displayName}</p>
                <p className="text-xs text-text-muted">@{user.username}</p>
              </div>
              <button
                onClick={() => handleSendRequest(user.uid)}
                disabled={sentRequests.includes(user.uid)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${sentRequests.includes(user.uid)
                    ? 'bg-bg-hover text-text-muted cursor-default'
                    : 'bg-accent hover:bg-accent-dark text-white'
                  }`}
              >
                {sentRequests.includes(user.uid) ? 'Gesendet' : 'Anfrage senden'}
              </button>
            </div>
          ))}

          {searchResults.length === 0 && searchQuery && !isSearching && (
            <p className="text-center text-text-muted py-8">
              Kein User mit diesem Namen gefunden.
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-bg-hover hover:bg-gray-500 text-text-primary py-2
                     rounded-lg font-medium transition-colors"
        >
          Schliessen
        </button>
      </div>
    </div>
  )
}
```

---

## Online-Status

**Wichtiger Hinweis fuer MVP:**

Firebase Realtime Database hat ein eingebautes "Presence"-System, aber das ist komplex einzurichten (erfordert Realtime Database zusaetzlich zu Firestore). Fuer den MVP verwenden wir Mock-Daten fuer den Online-Status.

```javascript
// Fuer den MVP: Online-Status ist gemockt (hardcoded in Mock-Daten)
// Spaeter: Firebase Presence System
//
// Firebase Presence wuerde so funktionieren:
// 1. User verbindet sich -> setze "online: true" in Realtime DB
// 2. User trennt sich -> onDisconnect() setzt "online: false"
// 3. Lese Online-Status aus Realtime DB
//
// Das ist fuer den MVP zu komplex, daher Mock-Daten.
```

---

## Freundschafts-Logik

### Anfrage senden

```javascript
async function sendFriendRequest(fromUserId, toUserId) {
  // IDs sortieren fuer konsistentes Schema
  const [user1Id, user2Id] = [fromUserId, toUserId].sort()

  // Pruefen ob bereits eine Freundschaft/Anfrage existiert
  const existingQuery = query(
    collection(db, 'friendships'),
    where('user1Id', '==', user1Id),
    where('user2Id', '==', user2Id)
  )
  const existing = await getDocs(existingQuery)

  if (!existing.empty) {
    // Bereits existiert - je nach Status handeln
    const friendship = existing.docs[0].data()
    if (friendship.status === 'accepted') {
      // Bereits Freunde
      return { error: 'Ihr seid bereits Freunde' }
    }
    if (friendship.status === 'pending') {
      return { error: 'Anfrage bereits gesendet' }
    }
  }

  // Freundes-Limit pruefen
  const friendCount = await countAcceptedFriendships(fromUserId)
  if (friendCount >= 200) {
    return { error: 'Maximale Freunde-Anzahl (200) erreicht' }
  }

  // Anfrage erstellen
  await addDoc(collection(db, 'friendships'), {
    user1Id,
    user2Id,
    status: 'pending',
    requestedBy: fromUserId,
    createdAt: serverTimestamp(),
    acceptedAt: null,
  })

  return { success: true }
}
```

### Anfrage akzeptieren

```javascript
async function acceptFriendRequest(friendshipId) {
  await updateDoc(doc(db, 'friendships', friendshipId), {
    status: 'accepted',
    acceptedAt: serverTimestamp(),
  })
}
```

### Anfrage ablehnen

```javascript
async function declineFriendRequest(friendshipId) {
  await updateDoc(doc(db, 'friendships', friendshipId), {
    status: 'declined',
  })
}
```

### Freundschaft beenden

```javascript
async function removeFriend(friendshipId) {
  await deleteDoc(doc(db, 'friendships', friendshipId))
}
```

---

## Datenfluss

```
┌──────────────────────────────┐
│  Freunde-Seite laedt         │
│                              │
│  1. Query: friendships       │
│     where user1Id == uid     │
│     OR user2Id == uid        │
│     AND status == 'accepted' │
│                              │
│  2. Query: friendships       │
│     where requestedBy != uid │
│     AND status == 'pending'  │
│     (eingehende Anfragen)    │
│                              │
│  3. User-Docs der Freunde    │
│     laden (fuer Avatar etc.) │
└──────────────────────────────┘
         │
         v
┌──────────────────────────────┐
│  Darstellung in Tabs:        │
│                              │
│  Alle    -> alle Freunde     │
│  Online  -> isOnline == true │
│  Offline -> isOnline == false│
│  Anfragen -> pending status  │
└──────────────────────────────┘
```

---

## Firestore-Regeln (Ergaenzung)

```
match /friendships/{friendshipId} {
  // Lesen: Nur beteiligte User
  allow read: if request.auth != null
    && (resource.data.user1Id == request.auth.uid
        || resource.data.user2Id == request.auth.uid);

  // Erstellen: Nur authentifizierte User, requestedBy muss eigene UID sein
  allow create: if request.auth != null
    && request.resource.data.requestedBy == request.auth.uid;

  // Aktualisieren: Nur der Empfaenger (nicht der Sender) kann Status aendern
  allow update: if request.auth != null
    && resource.data.requestedBy != request.auth.uid
    && (resource.data.user1Id == request.auth.uid
        || resource.data.user2Id == request.auth.uid);

  // Loeschen: Beide beteiligten User
  allow delete: if request.auth != null
    && (resource.data.user1Id == request.auth.uid
        || resource.data.user2Id == request.auth.uid);
}
```

---

## Testen

1. **Seite aufrufen** - Navigiere zu `/friends`, Seite laedt ohne Fehler
2. **Tabs wechseln** - Alle, Online, Offline, Anfragen Tabs funktionieren
3. **Tab-Counts** - Korrekte Zahlen neben jedem Tab
4. **Freunde-Liste** - Mock-Freunde werden mit Avatar, Name, Status angezeigt
5. **Online-Indikator** - Gruener Punkt fuer Online, grauer fuer Offline
6. **Activity-String** - Online-Freunde zeigen Aktivitaet ("Spielt: Mathe-Quiz Pro")
7. **Offline-Text** - Offline-Freunde zeigen "Zuletzt online vor X Stunden"
8. **Anfragen-Tab** - Zeigt eingehende Freundschaftsanfragen
9. **Anfrage annehmen** - Klick auf "Annehmen" entfernt Anfrage aus Liste
10. **Anfrage ablehnen** - Klick auf "Ablehnen" entfernt Anfrage aus Liste
11. **Freund hinzufuegen** - Modal oeffnet sich mit Suchfeld
12. **User-Suche** - Suche nach Username zeigt Ergebnisse
13. **Anfrage senden** - Button wechselt zu "Gesendet" nach Klick
14. **Profil-Link** - Klick auf Freundes-Name fuehrt zum Profil
15. **Responsive** - Layout passt sich an Mobile an

---

## Checkliste

- [ ] Freunde-Seite unter `/friends` ist erreichbar
- [ ] Tab-Navigation: Alle, Online, Offline, Anfragen mit Counts
- [ ] FriendCard zeigt: Avatar, Name, Online-Status, Activity/lastOnline
- [ ] Online-Indikator: gruener/grauer Punkt am Avatar
- [ ] Activity-String fuer Online-Freunde
- [ ] "Zuletzt online" mit timeAgo() fuer Offline-Freunde
- [ ] FriendRequestCard mit Annehmen/Ablehnen Buttons
- [ ] Anfragen-Tab zeigt roten Badge wenn Anfragen vorhanden
- [ ] AddFriendModal mit Username-Suche
- [ ] Suchfeld mit Enter-Taste und Such-Button
- [ ] "Anfrage senden" Button wechselt zu "Gesendet"
- [ ] Firestore-Schema: friendships Collection mit user1Id, user2Id, status, requestedBy
- [ ] Status-Typen: pending, accepted, declined
- [ ] Max 200 Freunde Limit definiert
- [ ] Online-Status: Mock-Daten fuer MVP (Firebase Presence spaeter)
- [ ] Mock-Daten: 8 Freunde (3 online, 5 offline) und 2 Anfragen
- [ ] Seite ist nur fuer eingeloggte User zugaenglich
- [ ] Profil-Link auf Freundes-Namen

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/pages/Friends.jsx` | Freunde-Seite mit Tabs, Listen und Modals |
| `src/components/friends/FriendCard.jsx` | Einzelne Freund-Karte mit Avatar und Status |
| `src/components/friends/FriendRequestCard.jsx` | Freundschaftsanfrage mit Annehmen/Ablehnen |
| `src/components/friends/AddFriendModal.jsx` | Modal zur Freund-Suche und Anfrage-Versand |
