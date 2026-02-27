# MindForge - Implementierungs-Tracker

## Abgeschlossene Plaene (01-25)

Alle 25 urspruenglichen Plaene wurden erfolgreich implementiert. Die einzelnen Plan-Dateien wurden entfernt.

| Plan | Feature |
|------|---------|
| 01-PROJECT-SETUP | Projekt-Setup (Vite, React, Tailwind, Firebase) |
| 02-LAYOUT-NAVIGATION | Navbar, Sidebar, Layout |
| 03-AUTHENTICATION | Login, Registrierung, Auth Context |
| 04-MINDBROWSER | Spiele durchsuchen |
| 05-HOME-PAGE | Personalisierte Startseite |
| 06-GAME-DETAIL | Spiel-Detailseite |
| 07-GAME-PLAYER | Spiel abspielen (Fullscreen) |
| 08-PROFILE-PAGE | Profil-Seite |
| 09-SEARCH | Suchfunktion |
| 10-LIKE-DISLIKE | Bewertungssystem |
| 11-CREATE-UPLOAD | Spiele erstellen & hochladen |
| 12-AVATAR-CUSTOMIZATION | Avatar-Editor (Roblox-Style) |
| 13-SETTINGS | Einstellungen (Theme, Sprache, Account) |
| 14-INVENTORY | Inventar-System |
| 15-FOLLOW-SYSTEM | Creators folgen |
| 16-NOTIFICATIONS | Benachrichtigungen |
| 17-EVENTS | Events & Challenges |
| 18-ACHIEVEMENTS | 60+ Achievements & Titel |
| 19-MARKETPLACE | Asset-Marketplace mit Bewertungen |
| 20-MINDCOINS-PREMIUM | MindCoins & Premium-System |
| 21-TEACHER-DASHBOARD | Lehrer-Dashboard |
| 22-FRIENDS-SYSTEM | Freunde-System |
| 23-COMMON-COMPONENTS | Button, Modal, Toast, Spinner etc. |
| 24-FORGE-KI-UPGRADE | Forge KI-Persoenlichkeit + Preview Cards |
| 25-AVATAR-SHOP-IMPROVEMENTS | Rating-System, Presets, Transaktionen, Rabattcodes |

---

## Aktuell: Plan 27 — Echte Datenpersistenz

**Ziel:** Alle Features mit echten, persistenten Speichermechanismen. Keine Mock-Daten mehr fuer User-State. User startet bei 0 und baut sich alles selbst auf.

**Referenz:** [27-DATA-PERSISTENCE.md](27-DATA-PERSISTENCE.md)

### Steps

| Step | Datei | Inhalt | Status |
|------|-------|--------|--------|
| 0 | [27-00-UEBERSICHT.md](27-00-UEBERSICHT.md) | Gesamtuebersicht, Abhaengigkeiten, Regeln | — |
| 1 | [27-01-VORBEREITUNG.md](27-01-VORBEREITUNG.md) | Profil-Reset, localStorage Cleanup | ✅ Fertig |
| 2 | [27-02-NOTIFICATION-ACTIVITY-STORES.md](27-02-NOTIFICATION-ACTIVITY-STORES.md) | notificationStore + activityStore | ✅ Fertig |
| 3 | [27-03-INVENTORY-STORE.md](27-03-INVENTORY-STORE.md) | inventoryStore mit Kategorie-System | ✅ Fertig |
| 4 | [27-04-GAME-INTERACTION-STORE.md](27-04-GAME-INTERACTION-STORE.md) | gameInteractionStore + GameDetail/GameCard/Home | ✅ Fertig |
| 5 | [27-05-SOCIAL-STORE.md](27-05-SOCIAL-STORE.md) | socialStore + Friends/Profile | ✅ Fertig |
| 6 | [27-06-ACHIEVEMENT-STORE.md](27-06-ACHIEVEMENT-STORE.md) | achievementStore + Achievements-Page | ✅ Fertig |
| 7 | [27-07-QUEST-SEASON-ERWEITERUNG.md](27-07-QUEST-SEASON-ERWEITERUNG.md) | questStore + seasonStore erweitern | ✅ Fertig |
| 8 | [27-08-SHOP-LEADERBOARD-SETTINGS.md](27-08-SHOP-LEADERBOARD-SETTINGS.md) | Shop/Leaderboard/Settings Integration | ✅ Fertig |
| 9 | [27-09-NOTIFICATION-DROPDOWN-ACTIVITY-UI.md](27-09-NOTIFICATION-DROPDOWN-ACTIVITY-UI.md) | NotificationDropdown + Inventory + Activity Feed | ✅ Fertig |
| 10 | [27-10-TESTING-FEINSCHLIFF.md](27-10-TESTING-FEINSCHLIFF.md) | Playwright-Tests, Edge-Cases, Smoke-Test | ✅ Fertig |

### 6 Neue Stores

| Store | localStorage-Key | Step |
|-------|-----------------|------|
| `notificationStore.js` | `mindforge-notifications` | 2 |
| `activityStore.js` | `mindforge-activity` | 2 |
| `inventoryStore.js` | `mindforge-inventory` | 3 |
| `gameInteractionStore.js` | `mindforge-game-interactions` | 4 |
| `socialStore.js` | `mindforge-social` | 5 |
| `achievementStore.js` | `mindforge-achievements` | 6 |

### Abhaengigkeitsbaum

```
Step 1 (Reset)
Step 2 (Notification + Activity)        ← keine Abhaengigkeiten
Step 3 (Inventory)                      ← keine Abhaengigkeiten
Step 4 (Game Interactions)              ← keine Abhaengigkeiten
Step 5 (Social)                         ← braucht Step 2
Step 6 (Achievements)                   ← braucht Step 2 + 3
Step 7 (Quest/Season Erweiterung)       ← braucht Step 2 + 3
Step 8 (Shop/Leaderboard/Settings)      ← braucht Step 3 + 4 + 5 + 6
Step 9 (UI-Integration)                 ← braucht alles
Step 10 (Tests)                         ← braucht alles
```
