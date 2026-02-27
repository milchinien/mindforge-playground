# Plan 27: Echte Datenpersistenz & Feature-Funktionalität

> Dieser Plan ist in 10 Steps aufgeteilt. Diese Datei ist die Referenz.
> Die detaillierten Implementierungs-Anleitungen sind in den Step-Dateien.

## Step-Dateien

| Step | Datei | Inhalt |
|------|-------|--------|
| 0 | [27-00-UEBERSICHT.md](27-00-UEBERSICHT.md) | Gesamtübersicht, Abhängigkeitsbaum, Regeln |
| 1 | [27-01-VORBEREITUNG.md](27-01-VORBEREITUNG.md) | Profil-Reset, localStorage Cleanup |
| 2 | [27-02-NOTIFICATION-ACTIVITY-STORES.md](27-02-NOTIFICATION-ACTIVITY-STORES.md) | notificationStore + activityStore |
| 3 | [27-03-INVENTORY-STORE.md](27-03-INVENTORY-STORE.md) | inventoryStore mit Kategorie-System |
| 4 | [27-04-GAME-INTERACTION-STORE.md](27-04-GAME-INTERACTION-STORE.md) | gameInteractionStore + GameDetail/GameCard/Home |
| 5 | [27-05-SOCIAL-STORE.md](27-05-SOCIAL-STORE.md) | socialStore + Friends/Profile |
| 6 | [27-06-ACHIEVEMENT-STORE.md](27-06-ACHIEVEMENT-STORE.md) | achievementStore + Achievements-Page |
| 7 | [27-07-QUEST-SEASON-ERWEITERUNG.md](27-07-QUEST-SEASON-ERWEITERUNG.md) | questStore + seasonStore erweitern |
| 8 | [27-08-SHOP-LEADERBOARD-SETTINGS.md](27-08-SHOP-LEADERBOARD-SETTINGS.md) | Shop/Leaderboard/Settings Integration |
| 9 | [27-09-NOTIFICATION-DROPDOWN-ACTIVITY-UI.md](27-09-NOTIFICATION-DROPDOWN-ACTIVITY-UI.md) | NotificationDropdown + Inventory Page + Activity Feed |
| 10 | [27-10-TESTING-FEINSCHLIFF.md](27-10-TESTING-FEINSCHLIFF.md) | Playwright-Tests, Edge-Cases, Smoke-Test |

## Neue Dateien (6 Stores)

| Store | localStorage-Key | Erstellt in |
|-------|-----------------|-------------|
| `src/stores/notificationStore.js` | `mindforge-notifications` | Step 2 |
| `src/stores/activityStore.js` | `mindforge-activity` | Step 2 |
| `src/stores/inventoryStore.js` | `mindforge-inventory` | Step 3 |
| `src/stores/gameInteractionStore.js` | `mindforge-game-interactions` | Step 4 |
| `src/stores/socialStore.js` | `mindforge-social` | Step 5 |
| `src/stores/achievementStore.js` | `mindforge-achievements` | Step 6 |

## Geänderte Dateien

| Datei | Geändert in Steps |
|-------|-------------------|
| `src/App.jsx` | 1, 5, 6 |
| `src/stores/questStore.js` | 7 |
| `src/stores/seasonStore.js` | 7 |
| `src/pages/GameDetail.jsx` | 4, 6 |
| `src/pages/Profile.jsx` | 5, 9 |
| `src/pages/Friends.jsx` | 5 |
| `src/pages/Inventory.jsx` | 9 |
| `src/pages/Achievements.jsx` | 6 |
| `src/pages/Shop.jsx` | 8 |
| `src/pages/Leaderboards.jsx` | 8 |
| `src/pages/Settings.jsx` | 8 |
| `src/pages/Home.jsx` | 4, 5 |
| `src/components/layout/NotificationDropdown.jsx` | 9 |
| `src/components/profile/ProfileHeader.jsx` | 5, 6 |
| `src/components/game/GameCard.jsx` | 4 |
| `src/components/home/FriendsPreview.jsx` | 5 |

## Integrations-Flow

```
User-Aktion
    │
    ├─→ Primärer Store-Update (z.B. gameInteractionStore.recordPlay)
    │
    ├─→ achievementStore.incrementProgress (automatischer Check)
    │     └─→ Bei Unlock:
    │           ├─→ inventoryStore.addItem (Titel als Belohnung)
    │           ├─→ notificationStore.addNotification
    │           └─→ toastStore.showToast
    │
    └─→ activityStore.addActivity (Logging)
```
