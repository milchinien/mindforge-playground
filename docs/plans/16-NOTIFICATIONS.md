# 16 - Benachrichtigungssystem (Notifications)

## Was wird hier gemacht?

In diesem Schritt baust du ein vollstaendiges Benachrichtigungssystem. Eine Glocke in der Navbar zeigt die Anzahl ungelesener Benachrichtigungen. Beim Klick oeffnet sich ein Dropdown mit den letzten Nachrichten. Benachrichtigungen werden in Firestore gespeichert und ueber `onSnapshot` in Echtzeit aktualisiert.

---

## Voraussetzungen

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein (Navbar existiert)
- Datei `03-AUTHENTICATION.md` muss abgeschlossen sein
- Empfohlen: `15-FOLLOW-SYSTEM.md`, `17-EVENTS.md`, `18-ACHIEVEMENTS.md` abgeschlossen (Notification-Quellen)
- Firebase Firestore ist eingerichtet

---

## Uebersicht

```
┌──────────────────────────────────────────────────────────────────┐
│  NAVBAR                                                           │
│  [Logo] [Mindbrowser] [...]            [Username] [🔔 3] [Coins]│
│                                                    │              │
│                                         ┌──────────▼───────────┐ │
│                                         │  Benachrichtigungen   │ │
│                                         │  ────────────────────│ │
│                                         │  [Alle als gelesen]  │ │
│                                         │                      │ │
│                                         │  🏆 Neues Achievement│ │
│                                         │  Du hast "Erste      │ │
│                                         │  Schritte" erreicht! │ │
│                                         │  vor 5 Minuten    ●  │ │
│                                         │  ──────────────────  │ │
│                                         │  👤 Neuer Follower   │ │
│                                         │  MaxGamer folgt dir  │ │
│                                         │  jetzt!              │ │
│                                         │  vor 2 Stunden       │ │
│                                         │  ──────────────────  │ │
│                                         │  📅 Event gestartet  │ │
│                                         │  "Mathe-Marathon"    │ │
│                                         │  ist jetzt live!     │ │
│                                         │  vor 1 Tag           │ │
│                                         │  ──────────────────  │ │
│                                         │  ⚙️ System-Update    │ │
│                                         │  MindForge v1.2 ist  │ │
│                                         │  verfuegbar!         │ │
│                                         │  vor 3 Tagen         │ │
│                                         │                      │ │
│                                         │  (max-height: scroll)│ │
│                                         └──────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## Firestore-Schema

### Collection: `notifications`

```javascript
// Dokument-ID: automatisch generiert
{
  userId: 'uid-des-empfaengers',       // Fuer welchen User ist die Notification
  type: 'achievement',                  // Typ (siehe unten)
  message: 'Du hast "Erste Schritte" freigeschaltet!', // Anzeigetext
  read: false,                          // Gelesen?
  createdAt: Timestamp,                 // Erstellungszeitpunkt
  link: '/achievements',                // Optionaler Link (wohin beim Klick)
  metadata: {                           // Zusaetzliche Daten (optional)
    achievementId: 'first-steps',
    fromUserId: null,
    fromUsername: null,
  }
}
```

### Notification-Typen

| Typ | Emoji-Icon | Beschreibung | Link |
|-----|------------|-------------|------|
| `system` | ⚙️ | System-Benachrichtigungen (Updates, Wartung) | variabel |
| `follow` | 👤 | Jemand folgt dir | `/profile/{username}` |
| `friend_request` | 🤝 | Freundschaftsanfrage erhalten | `/friends` |
| `achievement` | 🏆 | Neues Achievement freigeschaltet | `/achievements` |
| `new_game` | 🎮 | Creator dem du folgst hat neues Spiel veroeffentlicht | `/game/{gameId}` |

```javascript
const NOTIFICATION_ICONS = {
  system: '⚙️',
  follow: '👤',
  friend_request: '🤝',
  achievement: '🏆',
  new_game: '🎮',
}
```

---

## Mock-Daten fuer Benachrichtigungen

```javascript
const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    userId: 'current-user-id',
    type: 'achievement',
    message: 'Du hast "Erste Schritte" freigeschaltet! Spiele dein erstes Lernspiel.',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),  // vor 5 Minuten
    link: '/achievements',
  },
  {
    id: 'notif-2',
    userId: 'current-user-id',
    type: 'follow',
    message: 'MaxGamer folgt dir jetzt!',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),  // vor 2 Stunden
    link: '/profile/maxgamer',
  },
  {
    id: 'notif-3',
    userId: 'current-user-id',
    type: 'new_game',
    message: 'ProCreator hat ein neues Spiel veroeffentlicht: "Physik-Simulator 3D"',
    read: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),  // vor 6 Stunden
    link: '/game/physik-sim-3d',
  },
  {
    id: 'notif-4',
    userId: 'current-user-id',
    type: 'system',
    message: 'MindForge v1.2 ist da! Neue Features: Events, Achievements und mehr.',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),  // vor 1 Tag
    link: null,
  },
  {
    id: 'notif-5',
    userId: 'current-user-id',
    type: 'friend_request',
    message: 'LernHeld42 moechte dein Freund sein!',
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),  // vor 3 Tagen
    link: '/friends',
  },
  {
    id: 'notif-6',
    userId: 'current-user-id',
    type: 'achievement',
    message: 'Du hast "Spieler" erreicht! 10 Spiele gespielt.',
    read: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),  // vor 5 Tagen
    link: '/achievements',
  },
  {
    id: 'notif-7',
    userId: 'current-user-id',
    type: 'follow',
    message: 'MatheMeister99 folgt dir jetzt!',
    read: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),  // vor 7 Tagen
    link: '/profile/mathemeister99',
  },
]
```

---

## Datei 1: `src/utils/formatters.js`

Hilfsfunktionen fuer Datumsformatierung.

### timeAgo() Funktion

```javascript
/**
 * Formatiert einen Zeitstempel als relative Zeitangabe
 * @param {Date|Timestamp} date - Das Datum
 * @returns {string} Relative Zeitangabe (z.B. "vor 5 Minuten")
 */
export function timeAgo(date) {
  // Falls Firestore Timestamp, in Date konvertieren
  const dateObj = date?.toDate ? date.toDate() : new Date(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now - dateObj) / 1000)

  if (diffInSeconds < 60) {
    return 'gerade eben'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `vor ${diffInMinutes} ${diffInMinutes === 1 ? 'Minute' : 'Minuten'}`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `vor ${diffInHours} ${diffInHours === 1 ? 'Stunde' : 'Stunden'}`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `vor ${diffInDays} ${diffInDays === 1 ? 'Tag' : 'Tagen'}`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `vor ${diffInWeeks} ${diffInWeeks === 1 ? 'Woche' : 'Wochen'}`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `vor ${diffInMonths} ${diffInMonths === 1 ? 'Monat' : 'Monaten'}`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `vor ${diffInYears} ${diffInYears === 1 ? 'Jahr' : 'Jahren'}`
}
```

### formatNumber() Funktion (Bonus)

```javascript
/**
 * Formatiert eine Zahl mit Abkuerzungen (z.B. 1.2K, 3.5M)
 * @param {number} num - Die Zahl
 * @returns {string} Formatierte Zahl
 */
export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace('.0', '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace('.0', '') + 'K'
  }
  return num.toString()
}
```

---

## Datei 2: `src/components/layout/NotificationDropdown.jsx`

Das Notification-Dropdown in der Navbar.

**Props:**
- Keine (liest Daten selbst ueber Auth-Context und Firestore)

**State:**

```jsx
const [isOpen, setIsOpen] = useState(false)
const [notifications, setNotifications] = useState([])
const [unreadCount, setUnreadCount] = useState(0)
const { currentUser } = useAuth()
```

### Echtzeit-Listener mit onSnapshot

```jsx
useEffect(() => {
  if (!currentUser) return

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', currentUser.uid),
    orderBy('createdAt', 'desc'),
    limit(20)
  )

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const notifs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
    setNotifications(notifs)
    setUnreadCount(notifs.filter(n => !n.read).length)
  })

  return () => unsubscribe()
}, [currentUser])
```

### Einzelne Notification als gelesen markieren

```jsx
const markAsRead = async (notificationId) => {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true,
    })
  } catch (error) {
    console.error('Fehler beim Markieren:', error)
  }
}
```

### Alle als gelesen markieren

```jsx
const markAllAsRead = async () => {
  try {
    const unreadNotifs = notifications.filter(n => !n.read)
    const promises = unreadNotifs.map(n =>
      updateDoc(doc(db, 'notifications', n.id), { read: true })
    )
    await Promise.all(promises)
  } catch (error) {
    console.error('Fehler beim Markieren aller:', error)
  }
}
```

### Klick auf Notification

```jsx
const handleNotificationClick = (notification) => {
  if (!notification.read) {
    markAsRead(notification.id)
  }
  if (notification.link) {
    navigate(notification.link)
  }
  setIsOpen(false)
}
```

### Dropdown schliessen bei Klick ausserhalb

```jsx
const dropdownRef = useRef(null)

useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [])
```

### Komplettes JSX

```jsx
return (
  <div className="relative" ref={dropdownRef}>
    {/* Glocken-Button */}
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="relative p-2 text-text-secondary hover:text-text-primary transition-colors"
    >
      <span className="text-xl">🔔</span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-error text-white text-xs
                         w-5 h-5 flex items-center justify-center rounded-full font-bold">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>

    {/* Dropdown */}
    {isOpen && (
      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-bg-secondary
                      border border-gray-700 rounded-xl shadow-2xl z-50
                      max-h-[500px] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h3 className="font-semibold text-text-primary">Benachrichtigungen</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-accent hover:text-accent-light transition-colors"
            >
              Alle als gelesen markieren
            </button>
          )}
        </div>

        {/* Notification-Liste */}
        <div className="overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-text-muted">
              <span className="text-3xl block mb-2">🔔</span>
              Keine Benachrichtigungen
            </div>
          ) : (
            notifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onClick={() => handleNotificationClick(notif)}
              />
            ))
          )}
        </div>
      </div>
    )}
  </div>
)
```

---

## NotificationItem Sub-Komponente

```jsx
function NotificationItem({ notification, onClick }) {
  const icon = NOTIFICATION_ICONS[notification.type] || '📌'

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 hover:bg-bg-hover transition-colors
                  flex gap-3 border-b border-gray-700/50 last:border-b-0
                  ${!notification.read ? 'bg-accent/5' : ''}`}
    >
      {/* Icon */}
      <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-relaxed
          ${!notification.read ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
          {notification.message}
        </p>
        <p className="text-xs text-text-muted mt-1">
          {timeAgo(notification.createdAt)}
        </p>
      </div>

      {/* Unread Dot */}
      {!notification.read && (
        <span className="w-2.5 h-2.5 bg-accent rounded-full flex-shrink-0 mt-2" />
      )}
    </button>
  )
}
```

---

## Integration in Navbar

```jsx
// In Navbar.jsx, rechte Seite:
import NotificationDropdown from './NotificationDropdown'

// Im JSX:
<div className="flex items-center gap-3">
  <span className="text-text-primary font-medium">{username}</span>
  <NotificationDropdown />
  <span className="text-text-secondary">💰 {mindCoins} MC</span>
  <Link to="/settings">⚙️</Link>
</div>
```

---

## Firestore-Abfragen im Ueberblick

| Abfrage | Zweck | Index benoetigt? |
|---------|-------|-----------------|
| `where('userId', '==', uid), orderBy('createdAt', 'desc'), limit(20)` | Letzte 20 Notifications laden | Ja (userId ASC, createdAt DESC) |
| `where('userId', '==', uid), where('read', '==', false)` | Ungelesene zaehlen | Ja (userId ASC, read ASC) |
| `updateDoc(notificationId, { read: true })` | Als gelesen markieren | Nein |

---

## Firestore-Regeln (Ergaenzung)

```
match /notifications/{notifId} {
  // User kann nur eigene Notifications lesen
  allow read: if request.auth != null
    && resource.data.userId == request.auth.uid;

  // User kann eigene Notifications als gelesen markieren
  allow update: if request.auth != null
    && resource.data.userId == request.auth.uid
    && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['read']);

  // Erstellen nur durch Backend/Cloud Functions (oder fuer MVP: authentifizierte User)
  allow create: if request.auth != null;
}
```

---

## Testen

1. **Glocke sichtbar** - Glocken-Icon in der Navbar ist sichtbar (nur wenn eingeloggt)
2. **Badge-Count** - Rotes Badge zeigt Anzahl ungelesener Notifications
3. **Dropdown oeffnen** - Klick auf Glocke oeffnet Dropdown
4. **Notification-Liste** - Mock-Daten werden mit korrektem Icon, Text und Zeitangabe angezeigt
5. **Ungelesene hervorgehoben** - Ungelesene haben blauen Punkt und helleren Hintergrund
6. **Als gelesen markieren** - Klick auf Notification markiert sie als gelesen (blauer Punkt verschwindet)
7. **Alle als gelesen** - "Alle als gelesen markieren" Button funktioniert, Badge verschwindet
8. **Klick ausserhalb** - Klick ausserhalb des Dropdowns schliesst es
9. **Link-Navigation** - Klick auf Notification mit Link navigiert zur richtigen Seite
10. **timeAgo** - Zeitangaben sind korrekt (Minuten, Stunden, Tage)
11. **Leerer Zustand** - Wenn keine Notifications: "Keine Benachrichtigungen" Meldung
12. **Scroll** - Bei vielen Notifications ist die Liste scrollbar (max-height)
13. **Responsive** - Dropdown passt sich auf kleinen Bildschirmen an

---

## Checkliste

- [ ] NotificationDropdown-Komponente in `src/components/layout/`
- [ ] Glocken-Button mit unread-Badge in der Navbar
- [ ] Badge zeigt korrekte Anzahl (max "9+")
- [ ] Dropdown oeffnet/schliesst bei Klick auf Glocke
- [ ] Dropdown schliesst bei Klick ausserhalb
- [ ] Notification-Typen: system, follow, friend_request, achievement, new_game
- [ ] Jeder Typ hat ein passendes Emoji-Icon
- [ ] Ungelesene Notifications sind visuell hervorgehoben (Punkt + Hintergrund)
- [ ] "Alle als gelesen markieren" Button funktioniert
- [ ] Einzelne Notification als gelesen markieren bei Klick
- [ ] timeAgo()-Funktion in `src/utils/formatters.js`
- [ ] Korrekte Zeitformatierung (gerade eben, Minuten, Stunden, Tage, Wochen)
- [ ] onSnapshot fuer Echtzeit-Updates
- [ ] Firestore-Abfrage mit limit(20) und orderBy
- [ ] Mock-Daten mit mindestens 5 verschiedenen Notifications
- [ ] Dropdown hat max-height mit Scroll
- [ ] Leerer Zustand wird angezeigt wenn keine Notifications vorhanden

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/components/layout/NotificationDropdown.jsx` | Dropdown mit Glocke, Badge und Notification-Liste |
| `src/utils/formatters.js` | timeAgo() und formatNumber() Hilfsfunktionen |
| `src/data/mockNotifications.js` | Mock-Daten fuer Notifications (optional, kann auch direkt im Component) |
| `src/components/layout/Navbar.jsx` | Aktualisiert mit NotificationDropdown-Integration |
