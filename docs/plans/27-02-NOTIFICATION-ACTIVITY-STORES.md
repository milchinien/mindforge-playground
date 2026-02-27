# Step 2: Notification Store & Activity Store

## Ziel

Zwei neue Basis-Stores erstellen, die von keinem anderen Store abhängen.
Sie werden später von allen anderen Stores aufgerufen.

---

## 2.1 Neuer Store: `src/stores/notificationStore.js`

**localStorage-Key:** `'mindforge-notifications'`

### State

```js
{
  notifications: [],
  // Array von:
  // {
  //   id: string,                    // `notif-${Date.now()}-${Math.random().toString(36).slice(2,7)}`
  //   type: string,                  // 'achievement' | 'follow' | 'friend_request' | 'quest' | 'season' | 'system' | 'new_game'
  //   title: string,                 // z.B. "Achievement freigeschaltet!"
  //   message: string,               // z.B. "Du hast 'Erste Schritte' erhalten"
  //   link: string | null,           // z.B. "/achievements"
  //   read: boolean,                 // false bei Erstellung
  //   createdAt: string              // new Date().toISOString()
  // }

  settings: {
    achievements: true,
    follows: true,
    events: true,
    system: true,
    quests: true,
    season: true
  }
}
```

### Actions — Exakte Signaturen

```js
addNotification({ type, title, message, link = null })
  // 1. Type-zu-Setting Mapping:
  //    'follow' → 'follows'
  //    'friend_request' → 'follows'
  //    'achievement' → 'achievements'
  //    'quest' → 'quests'
  //    'season' → 'season'
  //    'system' → 'system'
  //    'new_game' → 'events'
  //    'event' → 'events'
  //    (Fallback: wenn kein Mapping existiert → 'system')
  // 2. Wenn settings[mappedCategory] === false → return (stumm)
  // 3. Neue Notification erstellen:
  //    { id: `notif-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, type, title, message, link, read: false, createdAt: new Date().toISOString() }
  // 4. Vorne in notifications-Array einfügen (neueste zuerst)
  // 5. Wenn notifications.length > 50 → letzte entfernen (älteste raus)

markAsRead(notificationId)
  // notifications.map(n => n.id === notificationId ? { ...n, read: true } : n)

markAllAsRead()
  // notifications.map(n => ({ ...n, read: true }))

deleteNotification(notificationId)
  // notifications.filter(n => n.id !== notificationId)

clearAll()
  // notifications = []

updateSettings(category, enabled)
  // settings[category] = enabled
  // category ist einer von: 'achievements', 'follows', 'events', 'system', 'quests', 'season'

getUnreadCount()
  // return notifications.filter(n => !n.read).length
```

### Persist-Config

```js
persist(
  (set, get) => ({ ... }),
  {
    name: 'mindforge-notifications',
    partialize: (state) => ({
      notifications: state.notifications,
      settings: state.settings,
    }),
  }
)
```

---

## 2.2 Neuer Store: `src/stores/activityStore.js`

**localStorage-Key:** `'mindforge-activity'`

### State

```js
{
  activities: []
  // Array von:
  // {
  //   id: string,                    // `act-${Date.now()}-${Math.random().toString(36).slice(2,7)}`
  //   type: string,                  // 'game_played' | 'game_liked' | 'achievement_unlocked' | 'quest_completed' | 'item_purchased' | 'reward_claimed' | 'friend_added' | 'followed_user' | 'profile_edited' | 'game_created'
  //   description: string,           // z.B. "Mathe-Meister gespielt"
  //   metadata: object | null,       // z.B. { gameId: "game-001", gameName: "Mathe-Meister" }
  //   createdAt: string              // new Date().toISOString()
  // }
}
```

### Actions — Exakte Signaturen

```js
addActivity({ type, description, metadata = null })
  // 1. Neue Activity erstellen:
  //    { id: `act-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, type, description, metadata, createdAt: new Date().toISOString() }
  // 2. Vorne in activities-Array einfügen
  // 3. Wenn activities.length > 50 → letzte entfernen

getRecentActivities(limit = 20)
  // return activities.slice(0, limit)

clearActivities()
  // activities = []
```

### Persist-Config

```js
persist(
  (set, get) => ({ ... }),
  {
    name: 'mindforge-activity',
    partialize: (state) => ({
      activities: state.activities,
    }),
  }
)
```

---

## Dateien

| Datei | Aktion |
|-------|--------|
| `src/stores/notificationStore.js` | **NEU erstellen** |
| `src/stores/activityStore.js` | **NEU erstellen** |

## Prüfung nach Implementierung

1. Dev-Server starten — keine Fehler in der Konsole
2. In der Browser-Konsole testen:

```js
// Notification Store testen
const ns = JSON.parse(localStorage.getItem('mindforge-notifications'))
// → Sollte { state: { notifications: [], settings: { ... } }, version: 0 } sein

// Activity Store testen
const as = JSON.parse(localStorage.getItem('mindforge-activity'))
// → Sollte { state: { activities: [] }, version: 0 } sein
```

3. Die Stores werden noch von keiner Page genutzt — das kommt in späteren Steps
4. Keine bestehende Funktionalität darf brechen
