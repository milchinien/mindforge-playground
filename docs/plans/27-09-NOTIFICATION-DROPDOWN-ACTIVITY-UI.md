# Step 9: Notification Dropdown, Inventory Page & Activity Feed UI

## Ziel

Die letzten UI-Komponenten auf die neuen Stores umstellen:
- NotificationDropdown zeigt echte Benachrichtigungen
- Inventory-Page nutzt inventoryStore mit Kategorie-Tabs
- Profile bekommt einen Activity-Feed-Bereich (nur eigenes Profil)

---

## 9.1 Integration: `src/components/layout/NotificationDropdown.jsx`

### Aktueller Zustand

```
- import { MOCK_NOTIFICATIONS, NOTIFICATION_ICONS } from '../../data/mockNotifications'
- const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)  // LEER
- markAsRead / markAllAsRead: lokaler State
- Unread-Badge: aus lokalem State berechnet
```

### Änderungen

```
1. Imports:
   ENTFERNEN: import { MOCK_NOTIFICATIONS, NOTIFICATION_ICONS } from '../../data/mockNotifications'
   HINZUFÜGEN: import { useNotificationStore } from '../../stores/notificationStore'

2. State:
   ENTFERNEN: const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
   HINZUFÜGEN:
     const notifications = useNotificationStore(s => s.notifications)
     const unreadCount = useNotificationStore(s => s.getUnreadCount())
     const { markAsRead, markAllAsRead, deleteNotification } = useNotificationStore()

3. Unread-Badge im Bell-Icon:
   STATT: notifications.filter(n => !n.read).length
   NEU:   unreadCount    (direkt aus Store-Getter)

4. markAsRead:
   STATT: setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
   NEU:   markAsRead(id)

5. markAllAsRead:
   STATT: setNotifications(prev => prev.map(n => ({ ...n, read: true })))
   NEU:   markAllAsRead()

6. NOTIFICATION_ICONS:
   Beibehalten als lokale Konstante (nicht aus mockNotifications):
   const NOTIFICATION_ICONS = {
     system: '⚙️',
     follow: '👤',
     friend_request: '🤝',
     achievement: '🏆',
     new_game: '🎮',
     quest: '📜',
     season: '⭐',
   }

7. Notification-Rendering:
   Jede Notification hat: { id, type, title, message, link, read, createdAt }
   - Icon: NOTIFICATION_ICONS[notification.type]
   - Titel: notification.title
   - Message: notification.message
   - Zeit: timeAgo(notification.createdAt)
   - Klick: navigate(notification.link) wenn link vorhanden
   - Unread-Styling: !notification.read → fetter Text / blauer Punkt

8. Leere State:
   Wenn notifications.length === 0 → "Keine Benachrichtigungen" anzeigen
   (Aktuell zeigt es MOCK_NOTIFICATIONS die eh leer sind)
```

---

## 9.2 Integration: `src/pages/Inventory.jsx`

### Aktueller Zustand

```
- import { useAuth } from '../contexts/AuthContext'
- const DEFAULT_ITEMS = [3 hardcoded Items]
- allItems = [...DEFAULT_ITEMS, ...(user?.purchasedItems || [])]
- Deduplizierung nach ID
- Tabs: "Items" (allItems), "Spiele" (count 0), "Assets" (count 0)
- Keine Equip-Funktion
```

### Änderungen

```
1. Imports:
   HINZUFÜGEN: import { useInventoryStore } from '../stores/inventoryStore'
   BEIBEHALTEN: import { useAuth } from '../contexts/AuthContext'  (für Login-Check)

2. Items:
   ENTFERNEN: const DEFAULT_ITEMS = [...]
   ENTFERNEN: allItems Merge-Logik
   HINZUFÜGEN:
     const items = useInventoryStore(s => s.items)
     const { equipItem, unequipItem, getItemsByType } = useInventoryStore()

3. Kategorie-Tabs (NEUES Tab-System):
   const CATEGORIES = [
     { key: 'all', label: 'Alle' },
     { key: 'title', label: 'Titel' },
     { key: 'badge', label: 'Badges' },
     { key: 'avatar', label: 'Avatar' },       // filtert: 'avatar-item', 'hat', 'accessory'
     { key: 'frame', label: 'Rahmen' },
     { key: 'background', label: 'Hintergründe' },
     { key: 'effect', label: 'Effekte' },
   ]

   const [activeCategory, setActiveCategory] = useState('all')

   const filteredItems = activeCategory === 'all'
     ? items
     : activeCategory === 'avatar'
       ? items.filter(i => ['avatar-item', 'hat', 'accessory'].includes(i.type))
       : items.filter(i => i.type === activeCategory)

4. Item-Card Rendering:
   Für jedes Item anzeigen:
   - Name
   - Typ (Badge für Rarity: common/rare/epic/legendary mit Farben)
   - Quelle (source: 'Errungenschaft', 'Quest', 'Season', 'Shop', 'Standard')
   - Datum (acquiredAt formatiert)
   - Equip-Button:
     if (item.equipped):
       <button onClick={() => unequipItem(item.id)}>Ablegen</button>
     else:
       <button onClick={() => equipItem(item.id)}>Anlegen</button>
   - Equipped-Indikator: grüner Punkt oder "Aktiv" Badge

5. Source-Label Mapping:
   const SOURCE_LABELS = {
     default: 'Standard',
     achievement: 'Errungenschaft',
     quest: 'Quest-Belohnung',
     season: 'Season-Belohnung',
     shop: 'Shop',
     event: 'Event',
   }

6. Rarity-Styling (aus bestehendem RARITY_CONFIG oder inline):
   common: text-gray-400, border-gray-600
   rare: text-blue-400, border-blue-600
   epic: text-purple-400, border-purple-600
   legendary: text-yellow-400, border-yellow-600

7. Leerer Zustand:
   Wenn filteredItems.length === 0:
   → "Keine Items in dieser Kategorie" + Hinweis wie man Items bekommt

8. Bisherige Tabs ("Spiele", "Assets") können entfernt oder beibehalten werden:
   EMPFEHLUNG: Nur den Items-Tab behalten mit Kategorie-Filtern.
   "Spiele" und "Assets" waren eh immer leer.
```

---

## 9.3 Integration: `src/pages/Profile.jsx` — Activity Feed

### Aktueller Zustand

```
- ProfileTabs hat 3 Tabs: Spiele, Favoriten, Achievements
- Kein Activity Feed
```

### Änderungen

```
1. Import:
   import { useActivityStore } from '../stores/activityStore'

2. Activity-Daten holen (NUR auf eigenem Profil):
   const activities = useActivityStore(s => s.getRecentActivities(20))

3. Neuer Bereich UNTER den bestehenden Tabs (nicht als Tab, sondern als eigene Sektion):

   NUR anzeigen wenn isOwnProfile === true:

   <section>
     <h3>Letzte Aktivitäten</h3>
     {activities.length === 0 ? (
       <p>Noch keine Aktivitäten. Spiele ein Spiel oder schließe eine Quest ab!</p>
     ) : (
       <ul>
         {activities.map(activity => (
           <li key={activity.id}>
             <span>{ACTIVITY_ICONS[activity.type]}</span>
             <span>{activity.description}</span>
             <span>{timeAgo(activity.createdAt)}</span>
           </li>
         ))}
       </ul>
     )}
   </section>

4. Activity-Icons:
   const ACTIVITY_ICONS = {
     game_played: '🎮',
     game_liked: '👍',
     achievement_unlocked: '🏆',
     quest_completed: '📜',
     item_purchased: '🛒',
     friend_added: '🤝',
     followed_user: '👤',
     profile_edited: '✏️',
     game_created: '🔨',
   }

5. Styling:
   - Vertikale Timeline-Optik (Linie links, Punkte pro Eintrag)
   - Oder einfache Liste mit Icon + Text + Zeitangabe
   - Maximal 20 Einträge anzeigen
```

### Zusätzlich: Activity bei Profil-Bearbeitung loggen

```
In Profile.jsx bei handleSaveProfile (wo Bio/Social-Links gespeichert werden):

  NACH dem bestehenden updateUser()-Aufruf:

  useActivityStore.getState().addActivity({
    type: 'profile_edited',
    description: 'Profil bearbeitet',
    metadata: null,
  })

  // Außerdem Achievement-Check für profile_complete:
  if (bio && bio.trim().length > 0) {
    useAchievementStore.getState().setSyncedProgress('profile_complete', 1)
  }
```

---

## 9.4 Zusammenfassung: Welche Imports wo entfernt werden

```
Dateien die mockFriends nicht mehr importieren:
  - src/pages/Friends.jsx (Step 5 erledigt)
  - src/pages/Home.jsx (Step 5 erledigt)
  - src/components/home/FriendsPreview.jsx (Step 5 erledigt)

Dateien die mockNotifications nicht mehr importieren:
  - src/components/layout/NotificationDropdown.jsx (dieser Step)

Dateien die MOCK_USER_PROGRESS nicht mehr importieren:
  - src/pages/Achievements.jsx (Step 6 erledigt)
  - src/components/profile/ProfileHeader.jsx (Step 6 erledigt)
```

---

## Dateien

| Datei | Aktion |
|-------|--------|
| `src/components/layout/NotificationDropdown.jsx` | **ÄNDERN** — notificationStore statt MOCK_NOTIFICATIONS |
| `src/pages/Inventory.jsx` | **ÄNDERN** — inventoryStore mit Kategorie-Tabs, Equip-System |
| `src/pages/Profile.jsx` | **ÄNDERN** — Activity Feed Sektion + Activity-Logging bei Profil-Edit |

## Prüfung nach Implementierung

### NotificationDropdown
1. Bell-Icon zeigt Unread-Count (oder 0 wenn keine)
2. Dropdown öffnen → Liste der Benachrichtigungen
3. Achievement freischalten (Spiel spielen) → Neue Notification erscheint
4. "Alle gelesen" → Alle markiert, Badge verschwindet
5. Notification klicken → Navigation zum Link

### Inventory
1. Inventory öffnen → 3 Starter-Items sichtbar
2. Kategorie-Tabs funktionieren (filtern korrekt)
3. Item anlegen → "Aktiv" Markierung erscheint
4. Titel anlegen → Nur ein Titel gleichzeitig aktiv
5. Badges → Mehrere gleichzeitig möglich
6. Wenn zuvor ein Achievement freigeschaltet wurde → Titel im Inventar sichtbar

### Activity Feed
1. Eigenes Profil öffnen → Activity-Bereich sichtbar
2. Anderes Profil öffnen → Activity-Bereich NICHT sichtbar
3. Nach Spielen/Liken/Quest → Neue Einträge im Feed
4. Profil bearbeiten → Activity erscheint
