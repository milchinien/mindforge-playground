# Plan 27: Echte Datenpersistenz — Übersicht

## Ziel

Alle interaktiven Features sollen mit echten, persistenten Speichermechanismen arbeiten.
Mock-Daten nur noch als Definitionen. Alle User-Aktionen werden in Zustand-Stores mit localStorage gespeichert.
Der User startet bei 0 und baut sich alles selbst auf.

## Design-Entscheidungen (vom User bestätigt)

| Thema | Entscheidung |
|-------|-------------|
| Profil-Reset | Einmaliger Reset auf 0 — komplett frisch |
| Benachrichtigungen | In Settings einstellbar pro Kategorie (an/aus) |
| Game-Stats | Einfache Zahlen (Aufrufe, Likes, Plays) |
| Soziale Aktionen | Alles öffentlich |
| Activity Feed | Nur für den User selbst sichtbar |
| Lösch-Logik | Spiel gelöscht = Stats weg, verdiente Achievements bleiben |
| Quests | Mix: Tägliche/Wöchentliche (rotierend) + permanente Story-Quests |
| Inventar | Nach Kategorien sortiert mit Tabs/Filter |

## Steps

| Step | Datei | Inhalt | Neue Dateien | Geänderte Dateien |
|------|-------|--------|--------------|-------------------|
| 1 | `27-01-VORBEREITUNG.md` | Profil-Reset, localStorage Cleanup, Version-Flag | — | `src/App.jsx` |
| 2 | `27-02-NOTIFICATION-ACTIVITY-STORES.md` | notificationStore + activityStore | `notificationStore.js`, `activityStore.js` | — |
| 3 | `27-03-INVENTORY-STORE.md` | inventoryStore mit Kategorie-System | `inventoryStore.js` | — |
| 4 | `27-04-GAME-INTERACTION-STORE.md` | gameInteractionStore + Page-Integration | `gameInteractionStore.js` | `GameDetail.jsx`, `GameCard.jsx`, `Home.jsx` |
| 5 | `27-05-SOCIAL-STORE.md` | socialStore + Friends/Profile-Integration | `socialStore.js` | `Friends.jsx`, `Profile.jsx`, `ProfileHeader.jsx`, `FriendsPreview.jsx` |
| 6 | `27-06-ACHIEVEMENT-STORE.md` | achievementStore + Achievements-Page | `achievementStore.js` | `Achievements.jsx`, `ProfileHeader.jsx`, `App.jsx` |
| 7 | `27-07-QUEST-SEASON-ERWEITERUNG.md` | questStore + seasonStore erweitern | — | `questStore.js`, `seasonStore.js` |
| 8 | `27-08-SHOP-LEADERBOARD-SETTINGS.md` | Shop/Leaderboard/Settings Integration | — | `Shop.jsx`, `Leaderboards.jsx`, `Settings.jsx` |
| 9 | `27-09-NOTIFICATION-DROPDOWN-ACTIVITY-UI.md` | NotificationDropdown + Activity Feed UI | — | `NotificationDropdown.jsx`, `Inventory.jsx`, `Profile.jsx` |
| 10 | `27-10-TESTING-FEINSCHLIFF.md` | Playwright-Tests, Edge-Cases, Smoke-Test | `tests/plan27-*.spec.js` | — |

## Abhängigkeitsbaum

```
Step 1 (Reset) ─────────────────────────────────────────────────┐
Step 2 (Notification + Activity) ───────────────────────────┐   │
Step 3 (Inventory) ─────────────────────────────────────┐   │   │
Step 4 (Game Interactions) ─────────────────────────┐   │   │   │
                                                    │   │   │   │
Step 5 (Social) ── braucht Step 2 ──────────────┐   │   │   │   │
Step 6 (Achievements) ── braucht Step 2+3 ──┐   │   │   │   │   │
                                            │   │   │   │   │   │
Step 7 (Quest/Season) ── braucht Step 2+3 ──┤   │   │   │   │   │
                                            │   │   │   │   │   │
Step 8 (Shop/LB/Settings) ── braucht 3+4+5+6   │   │   │   │   │
Step 9 (UI-Integration) ── braucht alles ───────┘   │   │   │   │
Step 10 (Tests) ── braucht alles ───────────────────┘   │   │   │
```

## Regeln für die Implementierung

1. **Jeden Step einzeln implementieren und testen** bevor der nächste beginnt
2. **Store-Imports nur über `getState()`** wenn ein Store einen anderen Store aufruft (verhindert zirkuläre Imports)
3. **Bestehende UI nicht brechen** — wenn ein Store noch nicht existiert, darf die Page nicht crashen
4. **`dev server` nach jedem Step starten** und manuell prüfen ob alles läuft
5. **Keine Mock-Daten löschen** — sie werden weiter als Definitionen genutzt, nur nicht mehr für User-State
