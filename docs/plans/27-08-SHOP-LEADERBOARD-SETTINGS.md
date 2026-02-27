# Step 8: Shop, Leaderboard & Settings Integration

## Ziel

- Shop-Käufe legen Items ins Inventar ab
- Leaderboards zeigen echte User-Daten statt komplett hardcodeter Mock-Listen
- Settings speichern Notification-Einstellungen persistent

---

## 8.1 Integration: `src/pages/Shop.jsx`

### Aktueller Zustand

```
Shop.jsx hat bereits eine funktionierende Kauf-Logik:
  - updateUser({ mindCoins: user.mindCoins - price, transactions: [...], purchasedItems: [...] })
  - Verschiedene Kauf-Typen: MindCoin-Pakete, Seasonal Offers, Monthly Exclusives, Rabattcodes
```

### Änderungen

```
1. Import hinzufügen:
   import { useInventoryStore } from '../stores/inventoryStore'
   import { useActivityStore } from '../stores/activityStore'

2. Bei JEDEM Kauf-Handler (es gibt mehrere — handlePurchasePackage, handlePurchaseOffer, etc.):

   NACH dem bestehenden updateUser()-Aufruf hinzufügen:

   // Item ins Inventar
   useInventoryStore.getState().addItem({
     id: `shop-${item.id || item.name}-${Date.now()}`,
     type: item.type || 'badge',    // Typ je nach Kauf-Kontext ableiten
     name: item.name,
     description: item.description || `Gekauft im Shop`,
     rarity: item.rarity || 'common',
     source: 'shop',
   })

   // Activity Log
   useActivityStore.getState().addActivity({
     type: 'item_purchased',
     description: `"${item.name}" im Shop gekauft`,
     metadata: { itemId: item.id, price: item.price },
   })

3. ACHTUNG bei MindCoin-Paket-Käufen:
   - MindCoin-Pakete sind KEINE Inventar-Items (man kauft Währung, kein Item)
   - Nur physische/kosmetische Items ins Inventar legen
   - MindCoin-Kauf: nur updateUser({ mindCoins: ... }) + Activity Log

4. Kauf-Typ-Erkennung:
   - MINDCOIN_PACKAGES: kein inventoryStore.addItem (sind Währungskäufe)
   - SEASONAL_OFFERS: inventoryStore.addItem mit type je nach offer-Daten
   - MONTHLY_EXCLUSIVE_ITEMS: inventoryStore.addItem — Items haben .type Feld
   - Rabattcodes: je nach Code-Belohnung
```

### Bestehende updateUser()-Aufrufe

```
Die bestehenden updateUser()-Aufrufe BEIBEHALTEN.
user.purchasedItems wird weiterhin als Backup/Legacy gepflegt.
user.transactions wird weiterhin für die Transaktions-Historie genutzt.
Der inventoryStore ist die NEUE Wahrheitsquelle für "was besitze ich".
```

---

## 8.2 Integration: `src/pages/Leaderboards.jsx`

### Aktueller Zustand

```
- MOCK_PLAYERS: 10 hardcoded Spieler mit festen XP/Level/Stats
- WEEKLY_PLAYERS: 10 weitere hardcoded Spieler
- MONTHLY_PLAYERS: 10 weitere hardcoded Spieler
- CURRENT_USER_STATS: hardcoded { xp: 8450, level: 12, gamesPlayed: 87, streak: 4 }
- Aktueller User wird in die Liste eingefügt und nach XP sortiert
```

### Änderungen

```
1. Imports hinzufügen:
   import { useAchievementStore } from '../stores/achievementStore'
   import { useSeasonStore } from '../stores/seasonStore'

2. CURRENT_USER_STATS ersetzen:
   STATT der hardcoded Konstante:

   // Im Komponenten-Body:
   const progress = useAchievementStore(s => s.progress)
   const seasonXP = useSeasonStore(s => s.seasonXP)

   const currentUserStats = {
     xp: seasonXP,
     level: Math.floor(seasonXP / 1000) + 1,
     gamesPlayed: progress.games_played,
     streak: progress.daily_streak,
   }

3. MOCK_PLAYERS, WEEKLY_PLAYERS, MONTHLY_PLAYERS:
   BEIBEHALTEN als Vergleichs-Spieler.
   Diese repräsentieren "andere Spieler auf der Plattform".

   Aktueller User wird mit echten Daten eingefügt:
   const userEntry = {
     id: user?.uid,
     name: user?.username || 'Du',
     avatar: user?.avatar,
     xp: currentUserStats.xp,
     level: currentUserStats.level,
     gamesPlayed: currentUserStats.gamesPlayed,
     streak: currentUserStats.streak,
     isCurrentUser: true,
   }

   // In die Liste einfügen (falls nicht schon drin) und sortieren:
   const allPlayers = [...MOCK_PLAYERS.filter(p => p.id !== user?.uid), userEntry]
     .sort((a, b) => b.xp - a.xp)
     .map((p, i) => ({ ...p, rank: i + 1 }))

4. Game-spezifisches Leaderboard:
   Bleiben auf Mock-Daten (kein Multi-User-Tracking)

5. CURRENT_USER_STATS Konstante ENTFERNEN
```

---

## 8.3 Integration: `src/pages/Settings.jsx`

### Aktueller Zustand

```
- Notification-Toggles sind lokaler useState:
  const [notifications, setNotifications] = useState({
    achievements: true, follows: true, events: true, system: true
  })
- Änderungen werden NICHT gespeichert (gehen beim Seitenwechsel verloren)
```

### Änderungen

```
1. Import hinzufügen:
   import { useNotificationStore } from '../stores/notificationStore'

2. Notification-State aus Store lesen:
   STATT: const [notifications, setNotifications] = useState({ ... })
   NEU:   const notifSettings = useNotificationStore(s => s.settings)
          const updateNotifSettings = useNotificationStore(s => s.updateSettings)

3. Toggle-Handler:
   STATT: setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
   NEU:   updateNotifSettings(key, !notifSettings[key])

4. Toggle-UI:
   - checked={notifSettings.achievements}
   - checked={notifSettings.follows}
   - checked={notifSettings.events}
   - checked={notifSettings.system}

   Neue Kategorien hinzufügen (falls noch nicht in der UI):
   - checked={notifSettings.quests}    Label: "Quest-Benachrichtigungen"
   - checked={notifSettings.season}    Label: "Season-Benachrichtigungen"

5. useState für notifications ENTFERNEN
```

---

## Dateien

| Datei | Aktion |
|-------|--------|
| `src/pages/Shop.jsx` | **ÄNDERN** — inventoryStore.addItem + activityStore bei Kauf |
| `src/pages/Leaderboards.jsx` | **ÄNDERN** — Echte User-Stats aus achievementStore + seasonStore |
| `src/pages/Settings.jsx` | **ÄNDERN** — Notification-Settings aus notificationStore |

## Prüfung nach Implementierung

### Shop
1. Item im Shop kaufen → Item erscheint im Inventar (prüfen in Step 9)
2. MindCoins kaufen → Kein Inventar-Item, nur MindCoin-Guthaben erhöht
3. Activity Feed zeigt Kauf an (prüfen in Step 9)
4. Bestehende Kauf-Logik funktioniert noch (Transaktionen, Rabattcodes)

### Leaderboards
1. Leaderboard öffnen → Aktueller User hat echte Stats (XP aus Season, Games aus Progress)
2. Mock-Spieler sind noch als Vergleich da
3. Sortierung nach XP funktioniert
4. User-Rang wird korrekt berechnet

### Settings
1. Settings öffnen → Notification-Toggles zeigen aktuelle Einstellungen
2. Toggle umschalten → Einstellung wird gespeichert
3. Seite verlassen und zurückkommen → Einstellung ist noch da
4. Notification deaktivieren → Entsprechende Benachrichtigungen erscheinen nicht mehr
