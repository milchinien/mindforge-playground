# Step 1: Vorbereitung & Profil-Reset

## Ziel

Einmaliger Reset aller User-Daten auf 0, damit der User frisch startet.
Alle alten localStorage-Einträge der neuen Stores werden gelöscht.
Danach wird ein Version-Flag gesetzt, damit der Reset nie wieder passiert.

## Was passiert

### 1.1 Reset-Mechanismus in `src/App.jsx`

Einen `useEffect` hinzufügen, der beim App-Start prüft ob der Reset schon durchgeführt wurde.

```
Konstante:
  const RESET_VERSION = 'v27-data-persistence'

Logik (useEffect, Abhängigkeit: [user]):
  1. Wenn kein user eingeloggt → nichts tun
  2. Wenn localStorage.getItem('mindforge-reset-version') === RESET_VERSION → nichts tun (schon resettet)
  3. Sonst:
     a) updateUser() aufrufen mit:
        {
          followers: 0,
          following: 0,
          totalPlays: 0,
          gamesCreated: 0,
          mindCoins: 0,
          activeTitle: null,
          unlockedAchievements: [],
          purchasedItems: [],
          transactions: [],
          shopTitles: [],
          purchasedOffers: [],
          usedCodes: [],
          xp: 0
        }
     b) Folgende localStorage-Keys entfernen:
        - 'mindforge-game-interactions'
        - 'mindforge-achievements'
        - 'mindforge-inventory'
        - 'mindforge-social'
        - 'mindforge-notifications'
        - 'mindforge-activity'
        - 'mindforge-quests'
        - 'mindforge-season'
     c) localStorage.setItem('mindforge-reset-version', RESET_VERSION)
     d) window.location.reload()
```

### 1.2 Wohin genau in App.jsx

```
Position: NACH dem bestehenden Router-Setup, als separater useEffect INNERHALB einer Wrapper-Komponente.

Da App.jsx den <AuthProvider> rendert und useAuth() nur innerhalb dieses Providers funktioniert,
muss der Reset-Effect in einer Kind-Komponente sein die Zugriff auf useAuth() hat.

Lösung: Eine kleine <AppInitializer>-Komponente erstellen, INNERHALB von App.jsx:

  function AppInitializer() {
    const { user, updateUser } = useAuth()

    useEffect(() => {
      // Reset-Logik hier
    }, [user])

    return null  // Rendert nichts
  }

Diese Komponente wird innerhalb des <AuthProvider> platziert:

  <AuthProvider>
    <AppInitializer />
    <ToastProvider>
      <Router>
        ...
      </Router>
    </ToastProvider>
  </AuthProvider>
```

### 1.3 Wichtige Edge-Cases

- **User nicht eingeloggt:** Reset wird übersprungen, passiert beim nächsten Login
- **User registriert sich neu nach dem Reset:** Die register()-Funktion in AuthContext setzt bereits alle Felder auf 0, also kein Problem
- **Seite neu laden nach Reset:** Durch `window.location.reload()` werden alle Zustand-Stores frisch initialisiert
- **Reset nur einmal:** Durch das Version-Flag `'mindforge-reset-version'` wird der Reset nur einmal ausgeführt

## Dateien

| Datei | Aktion |
|-------|--------|
| `src/App.jsx` | `AppInitializer`-Komponente + `useEffect` mit Reset-Logik hinzufügen |

## Prüfung nach Implementierung

1. Dev-Server starten
2. Einloggen
3. Prüfen: User hat 0 Followers, 0 Following, 0 MindCoins, keinen aktiven Titel
4. Seite neu laden → Reset passiert NICHT erneut (Version-Flag gesetzt)
5. localStorage prüfen: `mindforge-reset-version` === `'v27-data-persistence'`
6. Alle alten Store-Keys sind aus localStorage entfernt
