# Step 10: Testing & Feinschliff

## Ziel

Alle Features durchgehend testen, Edge-Cases abfangen und sicherstellen dass nichts crasht.
Playwright-Tests für die wichtigsten Flows. Manueller Smoke-Test aller Pages.

---

## 10.1 Playwright-Tests

### Test-Datei: `tests/plan27-data-persistence.spec.js`

```
Testfälle:

1. Profil-Reset
   - Einloggen
   - Prüfen: Followers === 0, Following === 0, MindCoins === 0
   - localStorage enthält 'mindforge-reset-version'

2. Game-Interaktionen
   - GameDetail öffnen → Seite lädt ohne Fehler
   - Like-Button klicken → Like-Counter ändert sich
   - Nochmal klicken → Unlike
   - Seite neu laden → Like-Status ist gespeichert

3. Achievement-System
   - Ein Spiel spielen (Play klicken)
   - Prüfen: Toast "Achievement: Erste Schritte" erscheint
   - Achievements-Page: "Erste Schritte" ist freigeschaltet

4. Inventory
   - Inventory-Page öffnen → 3 Starter-Items sichtbar
   - Kategorie-Tabs klicken → Filter funktioniert
   - Item "Anlegen" → Markierung erscheint

5. Social / Friends
   - Friends-Page öffnen → Leere Liste
   - Mock-User-Profil besuchen → Follow-Button klicken
   - Eigenes Profil: Follower-Count erhöht

6. Notifications
   - Bell-Icon sichtbar
   - Nach Achievement-Unlock: Unread-Badge erscheint
   - Dropdown öffnen → Notification sichtbar
   - "Alle gelesen" → Badge verschwindet

7. Quests
   - Quests-Page öffnen → Quests sichtbar
   - Quest-Belohnung claimen → Notification erscheint

8. Settings
   - Settings öffnen → Notification-Toggles sichtbar
   - Toggle umschalten → Seite neu laden → Einstellung gespeichert

9. Leaderboards
   - Leaderboard öffnen → Aktueller User in der Liste
   - User hat echte XP-Daten (nicht hardcoded 8450)
```

### Test-Konfiguration

```
- Headless Modus (kein Browser-Fenster)
- Dev-Server muss laufen auf localhost:5173 oder 5174
- Vor jedem Test: localStorage leeren für sauberen Zustand
- Login mit DevAccount (devauth)
```

---

## 10.2 Edge-Cases die abgefangen werden müssen

### Store-Initialisierung

```
Problem: Wenn ein Store von einem anderen Store über getState() liest, kann es sein
         dass der andere Store noch nicht initialisiert ist.

Lösung:  Alle getState()-Aufrufe mit Fallback:
         const store = useNotificationStore.getState()
         if (store && store.addNotification) {
           store.addNotification(...)
         }

ODER: Da Zustand Stores synchron erstellt werden, sind sie beim Import sofort verfügbar.
      Trotzdem defensiv programmieren mit optionalem Chaining:
      useNotificationStore.getState()?.addNotification?.(...)
```

### localStorage voll

```
Problem: localStorage hat ein Limit (~5-10MB je nach Browser)

Lösung:  Die 50-Item-Limits in notificationStore und activityStore verhindern unbegrenztes Wachstum.
         globalStats in gameInteractionStore wächst nur mit der Anzahl der Spiele (begrenzt).
         Kein zusätzlicher Schutz nötig für MVP.
```

### Zustand-Persist Versionierung

```
Problem: Wenn sich die State-Struktur ändert (z.B. neue Felder), kann der alte persisted State
         inkompatibel sein.

Lösung:  Zustand-Persist hat eine 'version' Option und 'migrate' Funktion.
         Für MVP nicht nötig — der Reset in Step 1 löscht alle alten Daten.
         Für zukünftige Updates: version-Nummer hochzählen und migrate-Funktion schreiben.
```

### Gleichzeitiges Like + Dislike

```
Problem: Race Condition wenn toggleLike und toggleDislike fast gleichzeitig aufgerufen werden.

Lösung:  Die toggle-Funktionen prüfen den jeweils anderen Status und räumen auf.
         Zustand-set() ist synchron, also keine echte Race Condition möglich.
```

### Leere Spiel-ID

```
Problem: recordView(undefined) oder toggleLike(null) könnte aufgerufen werden.

Lösung:  Am Anfang jeder Action prüfen:
         if (!gameId) return
```

---

## 10.3 Manueller Smoke-Test Checkliste

```
Jede Page einmal öffnen und prüfen dass sie ohne Fehler lädt:

[ ] Home (/)
[ ] Browse (/browse)
[ ] Search (/search)
[ ] GameDetail (/game/game-001)
[ ] GamePlayer (/play/game-001)
[ ] Profile - eigenes (/profile/[username])
[ ] Profile - fremdes (/profile/MindForgeTeam)
[ ] Achievements (/achievements)
[ ] Inventory (/inventory)
[ ] Friends (/friends)
[ ] Quests (/quests)
[ ] Seasons (/seasons)
[ ] Shop (/shop)
[ ] Leaderboards (/leaderboards)
[ ] Settings (/settings)
[ ] Chat (/chat)
[ ] Groups (/groups)
[ ] Premium (/premium)
[ ] Events (/events)
[ ] Marketplace (/marketplace)
[ ] Avatar (/avatar)
[ ] Create (/create) — braucht Premium
[ ] My Games (/my-games) — braucht Premium

Konsole prüfen auf:
[ ] Keine roten Fehler (Errors)
[ ] Keine "Cannot read property of undefined" Fehler
[ ] Keine "X is not a function" Fehler
[ ] Warnungen sind OK (React-Warnungen, Deprecation-Warnings)
```

---

## 10.4 Feinschliff-Aufgaben

### Wenn alles funktioniert, optional:

```
1. Toast-Nachrichten auf Deutsch prüfen
   - Alle showToast()-Aufrufe: Deutsche Texte?
   - Alle addNotification()-Aufrufe: Deutsche Texte?

2. Leere Zustände hübsch gestalten
   - Friends-Page leer → hilfreicher Text "Finde Freunde über die Suche oder besuche andere Profile"
   - Inventory leer → "Spiele Quests oder schließe Achievements ab um Items zu sammeln"
   - Activity Feed leer → "Spiele dein erstes Spiel um Aktivitäten zu sehen"
   - Notifications leer → "Keine Benachrichtigungen — bald wird es hier geschäftig!"

3. Performance
   - GameCard in Listen: Prüfen ob useGameInteractionStore performant ist (kein unnötiges Re-Rendering)
   - Große Notifications-Liste: Scrollbar-Verhalten im Dropdown

4. Konsistenz
   - Alle "Anlegen"/"Ablegen"-Buttons gleich gestylt
   - Alle Rarity-Farben konsistent (gleiche Palette überall)
   - Alle Zeitangaben im gleichen Format (timeAgo)
```

---

## Dateien

| Datei | Aktion |
|-------|--------|
| `tests/plan27-data-persistence.spec.js` | **NEU erstellen** |
| Diverse | **Feinschliff** wo nötig |

## Finale Prüfung

```
1. Komplett frisch starten:
   - localStorage komplett leeren
   - Dev-Server starten
   - Registrieren / Einloggen
   - Prüfen: User startet bei 0 in allem

2. Kompletten User-Flow durchspielen:
   - Ein Spiel spielen → Achievement unlocked, Notification, Activity
   - Quest claimen → Item im Inventar, Notification
   - Einem User folgen → Follower-Count, Achievement-Fortschritt
   - Im Shop kaufen → Item im Inventar
   - Profil bearbeiten → Activity geloggt
   - Leaderboard → Eigene echte Daten sichtbar
   - Settings → Notification-Toggle persistent
   - Inventory → Alle gesammelten Items sichtbar nach Kategorie

3. Seite komplett neu laden → Alles gespeichert

4. Browser schließen und wieder öffnen → Alles noch da
```
