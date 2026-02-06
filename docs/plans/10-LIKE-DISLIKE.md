# 10 - Like/Dislike System

## Was wird hier gemacht?

In diesem Schritt baust du das **Like/Dislike System** fuer Spiele. User koennen Spiele bewerten mit einem Like oder Dislike:
- **LikeDislike Komponente** auf der GameDetail-Seite
- **Nur eingeloggte User** koennen bewerten
- **Ein Rating pro User pro Spiel** (Like ODER Dislike, nicht beides)
- **Toggle-Verhalten** (nochmal klicken = zuruecknehmen, anderen klicken = wechseln)
- **Firestore `ratings` Collection** fuer persistente Speicherung
- **Zaehler-Aktualisierung** auf dem Game-Dokument
- **Login-Aufforderung** fuer nicht eingeloggte User

Am Ende koennen eingeloggte User Spiele mit Like oder Dislike bewerten, und die Zaehler aktualisieren sich in Echtzeit.

---

## Voraussetzung

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `03-AUTHENTICATION.md` muss abgeschlossen sein (useAuth)
- Datei `06-GAME-DETAIL.md` muss abgeschlossen sein (GameDetail-Seite)
- Firebase Firestore ist aktiviert

---

## Uebersicht der Komponente

### Drei Zustaende:

```
Zustand 1: Nicht bewertet (oder nicht eingeloggt)
┌────────────────────────────────┐
│  [♡ 245 Like]  [✕ 12 Dislike]  │    ← Beide Buttons neutral
└────────────────────────────────┘

Zustand 2: Geliked
┌────────────────────────────────┐
│  [♥ 246 Like]  [✕ 12 Dislike]  │    ← Like-Button aktiv (ausgefuellt, Farbe)
└────────────────────────────────┘

Zustand 3: Disliked
┌────────────────────────────────┐
│  [♡ 245 Like]  [✕ 13 Dislike]  │    ← Dislike-Button aktiv (ausgefuellt, Farbe)
└────────────────────────────────┘

Zustand 4: Loading
┌────────────────────────────────┐
│  [⟳ ... Like]  [⟳ ... Dislike] │    ← Spinner waehrend Firebase-Operation
└────────────────────────────────┘
```

---

## Toggle-Verhalten (Zustandsmaschine)

```
Aktueller Zustand → Aktion → Neuer Zustand
─────────────────────────────────────────────

Nicht bewertet  → Klick Like    → Geliked    (likes +1)
Nicht bewertet  → Klick Dislike → Disliked   (dislikes +1)

Geliked         → Klick Like    → Nicht bewertet (likes -1, Rating geloescht)
Geliked         → Klick Dislike → Disliked   (likes -1, dislikes +1, Rating gewechselt)

Disliked        → Klick Like    → Geliked    (dislikes -1, likes +1, Rating gewechselt)
Disliked        → Klick Dislike → Nicht bewertet (dislikes -1, Rating geloescht)
```

### Ablauf-Diagramm:

```
         ┌───────────┐
         │  NEUTRAL   │
         │ (kein Rat.)│
         └─────┬─────┘
          Like/ \Dislike
          ┌─┘   └──┐
    ┌─────▼───┐  ┌──▼────────┐
    │  LIKED   │  │  DISLIKED  │
    │(♥ aktiv) │  │ (✕ aktiv)  │
    └──┬──┬───┘  └───┬──┬────┘
       │  │           │  │
  Like │  │Dislike    │  │Dislike
 (undo)│  │(switch) Like│  │(undo)
       │  │      (switch) │
       │  └──────►┌───┘  │
       │          │       │
       └──────────▼───────┘
              NEUTRAL
```

---

## Firestore Schema

### Collection: `ratings`

```javascript
// Collection: ratings
// Document ID: auto-generated
{
  userId: "user-abc123",         // String - Firebase Auth UID des Bewertenden
  gameId: "game-001",            // String - ID des bewerteten Spiels
  type: "like",                  // String - "like" oder "dislike"
  createdAt: Timestamp,          // Timestamp - Wann bewertet
  updatedAt: Timestamp           // Timestamp - Letzte Aenderung
}
```

**Composite Index:** Erstelle einen Index fuer `userId + gameId` damit die Abfrage effizient ist:
- Collection: `ratings`
- Fields: `userId` (Ascending), `gameId` (Ascending)

### Game-Dokument Zaehler:

Die Like/Dislike-Zaehler werden direkt im Game-Dokument gespeichert (denormalisiert fuer schnellen Zugriff):

```javascript
// In games/{gameId}
{
  // ... andere Felder ...
  likes: 245,      // Number - wird bei Like/Dislike aktualisiert
  dislikes: 12     // Number - wird bei Like/Dislike aktualisiert
}
```

---

## Datei 1: `src/components/game/LikeDislike.jsx`

Die Hauptkomponente fuer das Like/Dislike System.

### Props:

```javascript
{
  gameId: "game-001",     // String - ID des Spiels
  initialLikes: 245,      // Number - Aktuelle Like-Anzahl
  initialDislikes: 12     // Number - Aktuelle Dislike-Anzahl
}
```

### State:

```javascript
const [likes, setLikes] = useState(initialLikes)
const [dislikes, setDislikes] = useState(initialDislikes)
const [userRating, setUserRating] = useState(null)    // null | "like" | "dislike"
const [isLoading, setIsLoading] = useState(false)
const [showLoginPrompt, setShowLoginPrompt] = useState(false)
```

### Implementierungsdetails:

**Rating des Users laden (beim Mount):**
```javascript
useEffect(() => {
  async function loadUserRating() {
    if (!user) return

    // Firestore Query: Hat dieser User dieses Spiel bewertet?
    const q = query(
      collection(db, 'ratings'),
      where('userId', '==', user.uid),
      where('gameId', '==', gameId)
    )
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      const ratingDoc = snapshot.docs[0]
      setUserRating(ratingDoc.data().type)
    }
  }

  loadUserRating()
}, [user, gameId])
```

**Like-Klick Handler:**
```javascript
async function handleLike() {
  if (!user) {
    setShowLoginPrompt(true)
    return
  }

  setIsLoading(true)

  try {
    if (userRating === 'like') {
      // Bereits geliked → Like entfernen
      await removeRating()
      setLikes(prev => prev - 1)
      setUserRating(null)
    } else if (userRating === 'dislike') {
      // Disliked → Wechsel zu Like
      await updateRating('like')
      setLikes(prev => prev + 1)
      setDislikes(prev => prev - 1)
      setUserRating('like')
    } else {
      // Noch nicht bewertet → Like setzen
      await createRating('like')
      setLikes(prev => prev + 1)
      setUserRating('like')
    }
  } catch (error) {
    console.error('Fehler beim Bewerten:', error)
  } finally {
    setIsLoading(false)
  }
}
```

**Dislike-Klick Handler:** Analog zu `handleLike`, mit umgekehrter Logik.

**Firestore Operationen:**

```javascript
async function createRating(type) {
  // Rating-Dokument erstellen
  await addDoc(collection(db, 'ratings'), {
    userId: user.uid,
    gameId: gameId,
    type: type,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })

  // Game-Zaehler aktualisieren
  const gameRef = doc(db, 'games', gameId)
  if (type === 'like') {
    await updateDoc(gameRef, { likes: increment(1) })
  } else {
    await updateDoc(gameRef, { dislikes: increment(1) })
  }
}

async function updateRating(newType) {
  // Bestehendes Rating finden
  const q = query(
    collection(db, 'ratings'),
    where('userId', '==', user.uid),
    where('gameId', '==', gameId)
  )
  const snapshot = await getDocs(q)
  const ratingDoc = snapshot.docs[0]

  // Rating-Typ aendern
  await updateDoc(ratingDoc.ref, {
    type: newType,
    updatedAt: serverTimestamp()
  })

  // Game-Zaehler aktualisieren
  const gameRef = doc(db, 'games', gameId)
  if (newType === 'like') {
    await updateDoc(gameRef, {
      likes: increment(1),
      dislikes: increment(-1)
    })
  } else {
    await updateDoc(gameRef, {
      likes: increment(-1),
      dislikes: increment(1)
    })
  }
}

async function removeRating() {
  // Bestehendes Rating finden und loeschen
  const q = query(
    collection(db, 'ratings'),
    where('userId', '==', user.uid),
    where('gameId', '==', gameId)
  )
  const snapshot = await getDocs(q)
  const ratingDoc = snapshot.docs[0]
  const ratingType = ratingDoc.data().type

  await deleteDoc(ratingDoc.ref)

  // Game-Zaehler aktualisieren
  const gameRef = doc(db, 'games', gameId)
  if (ratingType === 'like') {
    await updateDoc(gameRef, { likes: increment(-1) })
  } else {
    await updateDoc(gameRef, { dislikes: increment(-1) })
  }
}
```

**HINWEIS fuer MVP:** Da die Mock-Daten nicht in Firestore sind, kann fuer den MVP die Firestore-Logik durch lokalen State ersetzt werden. Die Firestore-Operationen werden erst relevant wenn echte Daten in Firestore vorliegen. Die Komponente sollte beides unterstuetzen (Mock-Modus + Firestore-Modus).

### JSX:

```jsx
<div className="flex items-center gap-3">
  {/* Like Button */}
  <button
    onClick={handleLike}
    disabled={isLoading}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      userRating === 'like'
        ? 'bg-green-600/20 text-green-400 border border-green-600'
        : 'bg-bg-card hover:bg-bg-hover text-text-secondary'
    }`}
  >
    {isLoading ? <Spinner /> : (userRating === 'like' ? '♥' : '♡')}
    <span>{formatNumber(likes)}</span>
  </button>

  {/* Dislike Button */}
  <button
    onClick={handleDislike}
    disabled={isLoading}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      userRating === 'dislike'
        ? 'bg-red-600/20 text-red-400 border border-red-600'
        : 'bg-bg-card hover:bg-bg-hover text-text-secondary'
    }`}
  >
    {isLoading ? <Spinner /> : '✕'}
    <span>{formatNumber(dislikes)}</span>
  </button>

  {/* Login-Hinweis */}
  {showLoginPrompt && (
    <p className="text-sm text-text-muted">
      <Link to="/login" className="text-accent hover:underline">Einloggen</Link> um zu bewerten
    </p>
  )}
</div>
```

---

## Integration in GameDetail

Die LikeDislike Komponente wird in der GameDetail-Seite (Plan 06) eingefuegt:

```jsx
// In GameDetail.jsx - Rechte Spalte, unter dem "Jetzt spielen" Button

<LikeDislike
  gameId={game.id}
  initialLikes={game.likes}
  initialDislikes={game.dislikes}
/>
```

Ersetze die bisherigen Platzhalter-Buttons aus Plan 06 durch die echte LikeDislike Komponente.

---

## Login-Aufforderung

Wenn ein nicht-eingeloggter User auf Like oder Dislike klickt:

### Option A: Inline-Text (einfacher)
```
[♡ Like]  [✕ Dislike]  Einloggen um zu bewerten
```

### Option B: Toast/Notification (besser)
```
┌──────────────────────────────────────┐
│  Du musst eingeloggt sein um         │
│  Spiele zu bewerten.                 │
│              [Einloggen] [Schliessen]│
└──────────────────────────────────────┘
```

Fuer den MVP reicht Option A (Inline-Text). Der Text verschwindet nach 3 Sekunden oder wenn der User woanders klickt.

---

## Testen

1. **Nicht eingeloggt:**
   - Gehe zu `/game/game-001`
   - Klicke Like → Login-Aufforderung erscheint
   - Klicke Dislike → Login-Aufforderung erscheint
   - Zaehler aendern sich NICHT

2. **Eingeloggt - Like:**
   - Logge dich ein
   - Gehe zu `/game/game-001`
   - Klicke Like → Zaehler steigt um 1, Button wird aktiv (gruen)
   - Klicke Like nochmal → Zaehler sinkt um 1, Button wird neutral

3. **Eingeloggt - Dislike:**
   - Klicke Dislike → Zaehler steigt um 1, Button wird aktiv (rot)
   - Klicke Dislike nochmal → Zaehler sinkt um 1, Button wird neutral

4. **Wechsel:**
   - Like aktiv → Klicke Dislike → Like-Zaehler -1, Dislike-Zaehler +1
   - Dislike aktiv → Klicke Like → Dislike-Zaehler -1, Like-Zaehler +1

5. **Persistenz (wenn Firestore aktiv):**
   - Like ein Spiel
   - Lade die Seite neu → Like ist immer noch aktiv
   - Like-Zaehler stimmt immer noch

6. **Loading State:**
   - Waehrend einer Firebase-Operation: Buttons sind disabled
   - Spinner wird angezeigt

7. **Verschiedene Spiele:**
   - Like Spiel A, Dislike Spiel B
   - Ratings sind unabhaengig voneinander

---

## Checkliste

- [ ] `src/components/game/LikeDislike.jsx` erstellt
- [ ] Drei Zustaende korrekt dargestellt (neutral, liked, disliked)
- [ ] Toggle-Verhalten funktioniert (Like entfernen, Dislike entfernen, Wechsel)
- [ ] Zaehler aktualisieren sich korrekt bei jeder Aktion
- [ ] Nur eingeloggte User koennen bewerten
- [ ] Login-Aufforderung fuer nicht-eingeloggte User
- [ ] Loading State waehrend Firebase-Operationen
- [ ] Buttons sind disabled waehrend Loading
- [ ] Firestore `ratings` Collection Schema ist definiert
- [ ] Rating wird beim Laden der Seite aus Firestore/Mock geladen
- [ ] Integration in GameDetail.jsx (ersetzt Platzhalter)
- [ ] formatNumber() fuer die Zaehler-Anzeige
- [ ] Visuelle Unterscheidung: Liked (gruen), Disliked (rot), Neutral (grau)
- [ ] Kein Doppel-Rating moeglich (nur Like ODER Dislike)

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/components/game/LikeDislike.jsx` | Like/Dislike Komponente mit Toggle-Verhalten |
| `src/pages/GameDetail.jsx` | Aktualisiert: LikeDislike Komponente integriert |
