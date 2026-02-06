# 15 - Follow-System

## Was wird hier gemacht?

In diesem Schritt implementierst du ein unidirektionales Follow-System. User koennen anderen Usern (insbesondere Creatorn) folgen, ohne dass eine Bestaetigung noetig ist. Ein FollowButton wird auf Profil-Seiten angezeigt und aktualisiert die Follower/Following-Zaehler in Echtzeit.

---

## Voraussetzungen

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein
- Datei `03-AUTHENTICATION.md` muss abgeschlossen sein
- Datei `08-PROFILE-PAGE.md` muss abgeschlossen sein (ProfileHeader existiert)
- Firebase Firestore ist eingerichtet

---

## Uebersicht

```
┌──────────────────────────────────────────────────────────────────┐
│  PROFIL VON "CreatorMax" (/profile/creatormax)                    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                                                              │ │
│  │  [Avatar]  CreatorMax                                        │ │
│  │            @creatormax                                       │ │
│  │            12 Follower  |  5 Folge ich                       │ │
│  │                                                              │ │
│  │            ┌──────────────────┐                              │ │
│  │            │   Folgen         │  <-- Standard-Zustand        │ │
│  │            └──────────────────┘                              │ │
│  │                                                              │ │
│  │            ┌──────────────────┐                              │ │
│  │            │  Folgst du ✓     │  <-- Nach dem Folgen         │ │
│  │            └──────────────────┘                              │ │
│  │                                                              │ │
│  │            ┌──────────────────┐                              │ │
│  │            │  Entfolgen       │  <-- Hover-Zustand           │ │
│  │            └──────────────────┘                              │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## Firestore-Schema

### Collection: `follows`

Jedes Dokument repraesentiert eine Follow-Beziehung:

```javascript
// Dokument-ID: automatisch generiert
{
  followerId: 'uid-von-dem-der-folgt',     // Wer folgt?
  followingId: 'uid-von-dem-dem-gefolgt-wird', // Wem wird gefolgt?
  followedAt: Timestamp,                    // Wann wurde gefolgt?
}
```

**Compound-Index benoetigt:**
- `followerId` (ASC) + `followingId` (ASC) - fuer die Pruefung ob User bereits folgt
- `followingId` (ASC) + `followedAt` (DESC) - fuer die Liste der Follower
- `followerId` (ASC) + `followedAt` (DESC) - fuer die Liste "Folge ich"

### User-Dokument Erweiterung: `users/{uid}`

```javascript
// Dokument: users/{uid}
{
  // ...andere User-Felder...
  followers: 0,    // Anzahl der Follower (Counter)
  following: 0,    // Anzahl der Leute denen gefolgt wird (Counter)
}
```

**Warum Counter auf dem User-Dokument?**
- Vermeidet teure `count()`-Abfragen bei jedem Profil-Aufruf
- Wird bei Follow/Unfollow via `increment(1)` / `increment(-1)` aktualisiert

---

## Datei 1: `src/components/profile/FollowButton.jsx`

Die FollowButton-Komponente fuer den ProfileHeader.

**Props:**
- `targetUserId` (string) - UID des Users dem gefolgt werden soll
- `onFollowChange` (function) - Callback wenn sich der Follow-Status aendert

**State:**
- `isFollowing` (boolean) - Folgt der aktuelle User bereits?
- `isLoading` (boolean) - Laeuft gerade eine Follow/Unfollow-Operation?
- `isHovering` (boolean) - Hover-Zustand fuer "Entfolgen"-Text

**Verhalten:**

```
Zustand 1: Nicht folgend
  - Text: "Folgen"
  - Style: bg-accent text-white
  - Klick: Follow-Operation starten

Zustand 2: Folgend (nicht hover)
  - Text: "Folgst du ✓"
  - Style: bg-bg-hover text-text-primary border
  - Klick: Unfollow-Operation starten

Zustand 3: Folgend (hover)
  - Text: "Entfolgen"
  - Style: bg-error/20 text-error border-error/30
  - Klick: Unfollow-Operation starten

Zustand 4: Loading
  - Text: "..."
  - Style: opacity-50, cursor-not-allowed
```

**Komplett-Code:**

```jsx
import { useState, useEffect } from 'react'
import { doc, collection, query, where, getDocs, addDoc, deleteDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../hooks/useAuth'

export default function FollowButton({ targetUserId, onFollowChange }) {
  const { currentUser } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // true beim initialen Check
  const [isHovering, setIsHovering] = useState(false)

  // Eigenes Profil: Button nicht anzeigen
  if (!currentUser || currentUser.uid === targetUserId) {
    return null
  }

  // Check ob User bereits folgt
  useEffect(() => {
    const checkFollowStatus = async () => {
      setIsLoading(true)
      try {
        const q = query(
          collection(db, 'follows'),
          where('followerId', '==', currentUser.uid),
          where('followingId', '==', targetUserId)
        )
        const snapshot = await getDocs(q)
        setIsFollowing(!snapshot.empty)
      } catch (error) {
        console.error('Fehler beim Follow-Status check:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkFollowStatus()
  }, [currentUser.uid, targetUserId])

  // Follow-Funktion
  const handleFollow = async () => {
    setIsLoading(true)
    try {
      // Follow-Dokument erstellen
      await addDoc(collection(db, 'follows'), {
        followerId: currentUser.uid,
        followingId: targetUserId,
        followedAt: serverTimestamp(),
      })

      // Counter aktualisieren
      await updateDoc(doc(db, 'users', currentUser.uid), {
        following: increment(1),
      })
      await updateDoc(doc(db, 'users', targetUserId), {
        followers: increment(1),
      })

      setIsFollowing(true)
      onFollowChange?.(true)
    } catch (error) {
      console.error('Fehler beim Folgen:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Unfollow-Funktion
  const handleUnfollow = async () => {
    setIsLoading(true)
    try {
      // Follow-Dokument finden und loeschen
      const q = query(
        collection(db, 'follows'),
        where('followerId', '==', currentUser.uid),
        where('followingId', '==', targetUserId)
      )
      const snapshot = await getDocs(q)
      for (const docSnap of snapshot.docs) {
        await deleteDoc(doc(db, 'follows', docSnap.id))
      }

      // Counter aktualisieren
      await updateDoc(doc(db, 'users', currentUser.uid), {
        following: increment(-1),
      })
      await updateDoc(doc(db, 'users', targetUserId), {
        followers: increment(-1),
      })

      setIsFollowing(false)
      onFollowChange?.(false)
    } catch (error) {
      console.error('Fehler beim Entfolgen:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Button-Klick Handler
  const handleClick = () => {
    if (isLoading) return
    if (isFollowing) {
      handleUnfollow()
    } else {
      handleFollow()
    }
  }

  // Button-Styling basierend auf Zustand
  const getButtonStyle = () => {
    if (isLoading) {
      return 'bg-bg-hover text-text-muted opacity-50 cursor-not-allowed'
    }
    if (isFollowing && isHovering) {
      return 'bg-error/20 text-error border border-error/30'
    }
    if (isFollowing) {
      return 'bg-bg-hover text-text-primary border border-gray-600'
    }
    return 'bg-accent hover:bg-accent-dark text-white'
  }

  // Button-Text basierend auf Zustand
  const getButtonText = () => {
    if (isLoading) return '...'
    if (isFollowing && isHovering) return 'Entfolgen'
    if (isFollowing) return 'Folgst du \u2713'
    return 'Folgen'
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      disabled={isLoading}
      className={`px-6 py-2 rounded-lg font-medium text-sm transition-all min-w-[120px]
                  ${getButtonStyle()}`}
    >
      {getButtonText()}
    </button>
  )
}
```

---

## Integration in ProfileHeader

Der FollowButton wird im ProfileHeader neben dem Usernamen/Bio platziert:

```jsx
// In ProfileHeader.jsx
import FollowButton from './FollowButton'

// Im JSX, neben den Profil-Infos:
<div className="flex items-center gap-4">
  <div>
    <h1 className="text-2xl font-bold">{user.displayName}</h1>
    <p className="text-text-muted">@{user.username}</p>
  </div>
  <FollowButton
    targetUserId={user.uid}
    onFollowChange={(isNowFollowing) => {
      // Counter im UI aktualisieren
      setFollowerCount(prev => isNowFollowing ? prev + 1 : prev - 1)
    }}
  />
</div>

{/* Follower/Following Zaehler */}
<div className="flex gap-4 mt-2 text-sm">
  <span>
    <strong className="text-text-primary">{followerCount}</strong>
    <span className="text-text-muted ml-1">Follower</span>
  </span>
  <span>
    <strong className="text-text-primary">{followingCount}</strong>
    <span className="text-text-muted ml-1">Folge ich</span>
  </span>
</div>
```

---

## Sichtbarkeits-Regeln

| Situation | Button sichtbar? | Warum? |
|-----------|-----------------|--------|
| Eigenes Profil | Nein | Man kann sich nicht selbst folgen |
| Anderes Profil (eingeloggt) | Ja | Follow/Unfollow moeglich |
| Anderes Profil (nicht eingeloggt) | Nein | Muss eingeloggt sein |

---

## Firestore-Regeln (Ergaenzung)

```
// follows Collection
match /follows/{followId} {
  allow read: if true;
  allow create: if request.auth != null
    && request.resource.data.followerId == request.auth.uid;
  allow delete: if request.auth != null
    && resource.data.followerId == request.auth.uid;
}
```

---

## Datenfluss

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Profil-Seite│────>│  FollowButton    │────>│  Firestore   │
│  laedt User  │     │  checkt Status   │     │  Query:      │
│  mit uid     │     │  (follows where  │     │  follows     │
│              │     │   followerId &&  │     │              │
│              │     │   followingId)   │     │              │
└──────────────┘     └──────────────────┘     └──────────────┘
                            │
                            │ (Klick auf Button)
                            v
                     ┌──────────────────┐     ┌──────────────┐
                     │  Follow:         │────>│  1. addDoc   │
                     │  Dokument        │     │  2. increment│
                     │  erstellen       │     │     user     │
                     │                  │     │     counters │
                     │  Unfollow:       │     └──────────────┘
                     │  Dokument        │
                     │  loeschen        │
                     └──────────────────┘
```

---

## Testen

1. **Eigenes Profil** - FollowButton ist NICHT sichtbar
2. **Anderes Profil** - FollowButton zeigt "Folgen"
3. **Folgen** - Klick auf "Folgen", Button wechselt zu "Folgst du", Follower-Zaehler steigt um 1
4. **Hover nach Folgen** - Maus ueber Button zeigt "Entfolgen" in Rot
5. **Entfolgen** - Klick auf "Entfolgen", Button wechselt zurueck zu "Folgen", Zaehler sinkt
6. **Loading State** - Waehrend der Firebase-Operation ist der Button disabled
7. **Persistenz** - Seite neu laden, Follow-Status bleibt erhalten
8. **Firestore pruefen** - In Firebase Console: `follows`-Dokument existiert mit korrekten Feldern
9. **Counter pruefen** - User-Dokumente haben korrekte `followers`/`following` Werte
10. **Nicht eingeloggt** - Button wird nicht angezeigt

---

## Checkliste

- [ ] FollowButton-Komponente existiert in `src/components/profile/`
- [ ] Button zeigt "Folgen" wenn User nicht folgt
- [ ] Klick auf "Folgen" erstellt Dokument in `follows` Collection
- [ ] Button wechselt zu "Folgst du" nach dem Folgen
- [ ] Hover ueber "Folgst du" zeigt "Entfolgen" in Rot
- [ ] Klick auf "Entfolgen" loescht das Follow-Dokument
- [ ] `followers` Counter auf dem Ziel-User wird inkrementiert/dekrementiert
- [ ] `following` Counter auf dem aktuellen User wird inkrementiert/dekrementiert
- [ ] Button ist NICHT sichtbar auf dem eigenen Profil
- [ ] Button ist NICHT sichtbar wenn User nicht eingeloggt ist
- [ ] Loading-State waehrend Firebase-Operationen
- [ ] Follow-Status wird beim Laden der Seite korrekt aus Firestore gelesen
- [ ] FollowButton ist im ProfileHeader integriert
- [ ] Follower/Following Zaehler werden im UI angezeigt

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/components/profile/FollowButton.jsx` | Follow/Unfollow Button mit 3 visuellen Zustaenden |
| `src/components/profile/ProfileHeader.jsx` | Aktualisiert mit FollowButton-Integration |
