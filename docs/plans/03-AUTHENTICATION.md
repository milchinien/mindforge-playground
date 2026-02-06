# 03 - Authentication (Login & Registrierung)

## Was wird hier gemacht?

In diesem Schritt baust du das komplette Authentifizierungssystem fuer MindForge:
- **Login-Seite** (E-Mail + Passwort)
- **Registrierungs-Seite** (Username + E-Mail + Passwort + Bestaetigung)
- **AuthContext/Provider** mit `useAuth` Hook (globaler Auth-State)
- **ProtectedRoute** Komponente (schuetzt Seiten vor nicht-eingeloggten Usern)
- **Firestore User-Dokument** (wird bei Registrierung erstellt)
- **Welcome-Toast** beim ersten Login

Am Ende koennen sich User registrieren, einloggen, ausloggen und geschuetzte Seiten werden korrekt abgesichert.

---

## Voraussetzung

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein
- Firebase Auth ist aktiviert (E-Mail/Passwort Methode)
- Firebase Firestore ist aktiviert

---

## Uebersicht der Komponenten

```
┌─────────────────────────────────────────────────────────────────┐
│                    AuthContext / AuthProvider                     │
│  Stellt bereit: user, loading, login(), register(), logout()     │
│  Wrapped die GESAMTE App in App.jsx                              │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                    │
│  Login.jsx   │  Register.jsx                                     │
│  /login      │  /register                                        │
│              │                                                    │
│  [E-Mail]    │  [Username]                                       │
│  [Passwort]  │  [E-Mail]                                         │
│  [Login Btn] │  [Passwort]                                       │
│              │  [Passwort best.]                                  │
│  Link zu     │  [Register Btn]                                   │
│  Register    │                                                    │
│              │  Link zu Login                                     │
├──────────────┴──────────────────────────────────────────────────┤
│                                                                    │
│  ProtectedRoute - Wrapper fuer geschuetzte Seiten                 │
│  Props: requirePremium, requireTeacher                            │
│  Nicht eingeloggt → redirect zu /login                            │
│  Kein Premium → redirect zu /premium                              │
│  Kein Teacher → redirect zu /                                     │
│                                                                    │
└─────────────────────────────────────────────────────────────────┘
```

**WICHTIG:** Login und Register Seiten werden OHNE Layout gerendert (kein Navbar, kein Sidebar). Sie sind eigenstaendige Seiten.

---

## Firestore User-Dokument Schema

Bei der Registrierung wird ein User-Dokument in Firestore erstellt. Collection: `users`, Dokument-ID = Firebase Auth UID.

```javascript
// Collection: users
// Document ID: uid (Firebase Auth UID)
{
  uid: "abc123",                    // String - Firebase Auth UID
  username: "spieler42",            // String - Einzigartiger Benutzername
  email: "user@example.com",       // String - E-Mail-Adresse
  createdAt: Timestamp,             // Timestamp - Registrierungsdatum

  // Avatar (Standard-Werte bei Registrierung)
  avatar: {
    skinColor: "#f5d0a9",           // String - Hautfarbe (Standard)
    hairColor: "#4a3728",           // String - Haarfarbe (Standard)
    hairStyle: "short",             // String - Frisur (Standard)
    eyes: "normal"                  // String - Augenform (Standard)
  },

  bio: "",                          // String - Profilbeschreibung (leer bei Start)

  // Premium & Rollen
  isPremium: false,                 // Boolean - Hat Premium-Abo?
  premiumTier: null,                // String|null - "basic", "pro", "teacher" oder null
  isTeacher: false,                 // Boolean - Ist Lehrer?

  // Statistiken
  totalPlays: 0,                    // Number - Gesamtanzahl gespielter Spiele
  gamesCreated: 0,                  // Number - Anzahl erstellter Spiele
  followers: 0,                     // Number - Anzahl Follower
  following: 0,                     // Number - Anzahl gefolgter User

  // Waehrung
  mindCoins: 0,                     // Number - MindCoins-Guthaben

  // Einstellungen
  theme: "dark",                    // String - "dark" oder "light"
  activeTitle: null,                // String|null - Aktiver Titel (z.B. "Mathe-Meister")
  hasSeenWelcome: false             // Boolean - Hat den Welcome-Toast gesehen?
}
```

---

## Datei 1: `src/contexts/AuthContext.jsx`

Der AuthContext stellt den Auth-State und Auth-Funktionen fuer die gesamte App bereit.

### Was der AuthContext bereitstellt:

```javascript
{
  user: null | { uid, email, username, ... },  // Aktueller User (null wenn nicht eingeloggt)
  loading: true | false,                        // Wird gerade geladen? (Auth-State wird geprueft)
  login: async (email, password) => {},          // Einloggen
  register: async (username, email, password) => {}, // Registrieren
  logout: async () => {},                        // Ausloggen
  updateUserData: async (data) => {}             // User-Daten in Firestore aktualisieren
}
```

### Implementierungsdetails:

**State:**
- `user` - Der aktuelle User (null wenn nicht eingeloggt). Enthaelt sowohl Firebase Auth Daten als auch Firestore User-Daten.
- `loading` - Wird auf `true` gesetzt waehrend der initiale Auth-State geprueft wird (beim App-Start).

**Firebase Auth Funktionen die verwendet werden:**
- `signInWithEmailAndPassword(auth, email, password)` - Login
- `createUserWithEmailAndPassword(auth, email, password)` - Registrierung
- `signOut(auth)` - Logout
- `onAuthStateChanged(auth, callback)` - Listener fuer Auth-State-Aenderungen

**Ablauf bei App-Start (onAuthStateChanged):**
1. Firebase prueft ob ein User eingeloggt ist
2. Wenn ja: Lade User-Daten aus Firestore (`users/{uid}`)
3. Setze `user` State mit kombinierten Daten (Auth + Firestore)
4. Setze `loading` auf `false`
5. Wenn nein: Setze `user` auf `null`, `loading` auf `false`

**Ablauf bei Registrierung:**
1. Pruefe ob Username bereits vergeben ist (Firestore Query)
2. `createUserWithEmailAndPassword(auth, email, password)`
3. Erstelle Firestore User-Dokument mit Standard-Werten (siehe Schema oben)
4. `onAuthStateChanged` Listener greift automatisch und setzt den User-State

**Ablauf bei Login:**
1. `signInWithEmailAndPassword(auth, email, password)`
2. `onAuthStateChanged` Listener greift automatisch
3. Lade User-Daten aus Firestore
4. Pruefe `hasSeenWelcome` Flag - wenn `false`, zeige Welcome-Toast und setze auf `true`

**Ablauf bei Logout:**
1. `signOut(auth)`
2. `onAuthStateChanged` Listener setzt `user` auf `null`

### Username-Validierung:

Die Username-Validierung erfolgt sowohl clientseitig als auch serverseitig (Firestore Query):

```javascript
// Clientseitige Validierung
function validateUsername(username) {
  if (username.length < 3) return "Username muss mindestens 3 Zeichen lang sein"
  if (username.length > 20) return "Username darf maximal 20 Zeichen lang sein"
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Nur Buchstaben, Zahlen und Unterstriche erlaubt"
  return null // Kein Fehler
}

// Firestore-Pruefung auf Einzigartigkeit
async function isUsernameTaken(username) {
  const q = query(collection(db, 'users'), where('username', '==', username.toLowerCase()))
  const snapshot = await getDocs(q)
  return !snapshot.empty // true = vergeben, false = verfuegbar
}
```

**Regeln:**
- 3-20 Zeichen
- Nur Buchstaben (a-z, A-Z), Zahlen (0-9) und Unterstriche (_)
- Muss einzigartig sein (case-insensitive, in Firestore als lowercase gespeichert)
- Wird bei der Registrierung geprueft BEVOR der Firebase Auth User erstellt wird

### Fehler-Nachrichten (Deutsch):

Firebase Auth gibt englische Fehlermeldungen zurueck. Diese muessen ins Deutsche uebersetzt werden:

```javascript
function getAuthErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Diese E-Mail-Adresse wird bereits verwendet.'
    case 'auth/invalid-email':
      return 'Bitte gib eine gueltige E-Mail-Adresse ein.'
    case 'auth/weak-password':
      return 'Das Passwort muss mindestens 6 Zeichen lang sein.'
    case 'auth/user-not-found':
      return 'Kein Konto mit dieser E-Mail-Adresse gefunden.'
    case 'auth/wrong-password':
      return 'Falsches Passwort. Bitte versuche es erneut.'
    case 'auth/too-many-requests':
      return 'Zu viele Versuche. Bitte warte einen Moment.'
    case 'auth/invalid-credential':
      return 'E-Mail oder Passwort ist falsch.'
    default:
      return 'Ein unbekannter Fehler ist aufgetreten. Bitte versuche es erneut.'
  }
}
```

---

## Datei 2: `src/hooks/useAuth.js`

Ein einfacher Custom Hook der den AuthContext bereitstellt:

```javascript
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth muss innerhalb eines AuthProviders verwendet werden')
  }
  return context
}
```

**Verwendung in anderen Komponenten:**

```javascript
import { useAuth } from '../hooks/useAuth'

function MyComponent() {
  const { user, loading, login, logout } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!user) return <p>Bitte einloggen</p>

  return <p>Hallo {user.username}!</p>
}
```

---

## Datei 3: `src/pages/auth/Login.jsx`

Die Login-Seite wird OHNE Layout gerendert (kein Navbar, kein Sidebar).

### Aufbau:

```
┌─────────────────────────────────────────────────┐
│                                                   │
│              MindForge Logo (gross)               │
│                                                   │
│         ┌───────────────────────────┐            │
│         │                           │            │
│         │    Willkommen zurueck!    │            │
│         │                           │            │
│         │    [E-Mail-Adresse    ]   │            │
│         │    [Passwort          ]   │            │
│         │                           │            │
│         │    [    Einloggen     ]   │            │
│         │                           │            │
│         │    Noch kein Konto?       │            │
│         │    Jetzt registrieren     │            │
│         │                           │            │
│         └───────────────────────────┘            │
│                                                   │
└─────────────────────────────────────────────────┘
```

### Implementierungsdetails:

**State:**
- `email` - String (Eingabefeld)
- `password` - String (Eingabefeld)
- `error` - String (Fehlermeldung, null wenn kein Fehler)
- `isSubmitting` - Boolean (verhindert Doppelklick)

**Verhalten:**
1. User gibt E-Mail und Passwort ein
2. Klick auf "Einloggen" ruft `login(email, password)` aus dem AuthContext auf
3. Bei Erfolg: Redirect zu "/" (Home) via `useNavigate()`
4. Bei Fehler: Zeige deutsche Fehlermeldung
5. Wenn User bereits eingeloggt ist: Redirect zu "/" (useEffect + navigate)

**Styling:**
- Zentriert auf der Seite (flexbox, items-center, justify-center, min-h-screen)
- Dunkler Hintergrund (`bg-bg-primary`)
- Formular in einer Karte (`bg-bg-secondary`, `rounded-xl`, Padding)
- MindForge Logo oben (Text oder Bild)
- Inputs: `bg-bg-card`, `border border-gray-600`, `rounded-lg`, Padding
- Button: `bg-accent`, `hover:bg-accent-dark`, volle Breite, `rounded-lg`
- Fehler: Rote Box mit Fehlermeldung (`bg-red-900/30`, `border border-error`, `text-error`)
- Link zu Register: `text-accent`, `hover:underline`

**Validierung:**
- E-Mail darf nicht leer sein
- Passwort darf nicht leer sein
- Mindestens 6 Zeichen fuer Passwort
- Bei leeren Feldern: "Bitte fuelle alle Felder aus."

**Kein Layout:**
- Login.jsx importiert NICHT das Layout
- In App.jsx wird die Route fuer /login AUSSERHALB des Layout-Wrappers platziert

---

## Datei 4: `src/pages/auth/Register.jsx`

Die Registrierungs-Seite wird ebenfalls OHNE Layout gerendert.

### Aufbau:

```
┌─────────────────────────────────────────────────┐
│                                                   │
│              MindForge Logo (gross)               │
│                                                   │
│         ┌───────────────────────────┐            │
│         │                           │            │
│         │    Konto erstellen        │            │
│         │                           │            │
│         │    [Username          ]   │            │
│         │    [E-Mail-Adresse   ]   │            │
│         │    [Passwort         ]   │            │
│         │    [Passwort best.   ]   │            │
│         │                           │            │
│         │    [  Registrieren    ]   │            │
│         │                           │            │
│         │    Bereits ein Konto?     │            │
│         │    Jetzt einloggen        │            │
│         │                           │            │
│         └───────────────────────────┘            │
│                                                   │
└─────────────────────────────────────────────────┘
```

### Implementierungsdetails:

**State:**
- `username` - String (Eingabefeld)
- `email` - String (Eingabefeld)
- `password` - String (Eingabefeld)
- `confirmPassword` - String (Eingabefeld)
- `error` - String (Fehlermeldung)
- `isSubmitting` - Boolean
- `usernameError` - String (spezifischer Fehler fuer Username-Feld)

**Verhalten:**
1. User fuellt alle Felder aus
2. Clientseitige Validierung (siehe unten)
3. Pruefe ob Username vergeben ist (Firestore Query)
4. `register(username, email, password)` aus AuthContext
5. Bei Erfolg: Redirect zu "/" (Home)
6. Bei Fehler: Zeige deutsche Fehlermeldung

**Validierung (in dieser Reihenfolge):**
1. Alle Felder muessen ausgefuellt sein → "Bitte fuelle alle Felder aus."
2. Username: 3-20 Zeichen → "Username muss zwischen 3 und 20 Zeichen lang sein."
3. Username: Nur Buchstaben, Zahlen, Unterstriche → "Username darf nur Buchstaben, Zahlen und Unterstriche enthalten."
4. Username: Bereits vergeben → "Dieser Username ist bereits vergeben."
5. E-Mail: Gueltiges Format → "Bitte gib eine gueltige E-Mail-Adresse ein."
6. Passwort: Mindestens 6 Zeichen → "Das Passwort muss mindestens 6 Zeichen lang sein."
7. Passwoerter stimmen ueberein → "Die Passwoerter stimmen nicht ueberein."

**Kein E-Mail-Verification fuer MVP** - User ist sofort nach Registrierung eingeloggt.

**Styling:** Gleich wie Login-Seite (gleicher Karten-Style, gleiche Farben).

---

## Datei 5: `src/components/common/ProtectedRoute.jsx`

Eine Wrapper-Komponente die Routen vor unauthorisiertem Zugriff schuetzt.

### Props:

```javascript
{
  children: ReactNode,          // Die geschuetzte Seite
  requirePremium: false,        // Boolean - Erfordert Premium? (Standard: false)
  requireTeacher: false         // Boolean - Erfordert Teacher-Rolle? (Standard: false)
}
```

### Logik:

```
User eingeloggt?
├── NEIN → Redirect zu /login
├── JA
│   ├── requirePremium === true?
│   │   ├── User ist Premium? → Zeige Seite
│   │   └── User ist NICHT Premium? → Redirect zu /premium
│   ├── requireTeacher === true?
│   │   ├── User ist Teacher? → Zeige Seite
│   │   └── User ist NICHT Teacher? → Redirect zu /
│   └── Keine besonderen Anforderungen → Zeige Seite
```

### Implementierung:

```javascript
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children, requirePremium = false, requireTeacher = false }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner /> // Oder ein einfacher Spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requirePremium && !user.isPremium) {
    return <Navigate to="/premium" replace />
  }

  if (requireTeacher && !user.isTeacher) {
    return <Navigate to="/" replace />
  }

  return children
}
```

### Verwendung in App.jsx:

```jsx
<Route path="/settings" element={
  <ProtectedRoute>
    <Settings />
  </ProtectedRoute>
} />

<Route path="/create" element={
  <ProtectedRoute requirePremium>
    <Create />
  </ProtectedRoute>
} />

<Route path="/teacher" element={
  <ProtectedRoute requireTeacher>
    <TeacherDashboard />
  </ProtectedRoute>
} />
```

---

## App.jsx aktualisieren

Die App.jsx muss aktualisiert werden um den AuthProvider und die Routen-Struktur korrekt einzurichten:

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Platzhalter fuer noch nicht implementierte Seiten
function PlaceholderPage({ title }) {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-text-secondary">Wird bald implementiert.</p>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Seiten OHNE Layout (kein Navbar/Sidebar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Seiten MIT Layout (Navbar + Sidebar) */}
          <Route path="/" element={<Layout><PlaceholderPage title="Home" /></Layout>} />
          <Route path="/browse" element={<Layout><PlaceholderPage title="Mindbrowser" /></Layout>} />

          {/* Geschuetzte Seiten */}
          <Route path="/settings" element={
            <Layout>
              <ProtectedRoute>
                <PlaceholderPage title="Einstellungen" />
              </ProtectedRoute>
            </Layout>
          } />

          <Route path="/create" element={
            <Layout>
              <ProtectedRoute requirePremium>
                <PlaceholderPage title="Create" />
              </ProtectedRoute>
            </Layout>
          } />

          {/* ... weitere Routen ... */}
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
```

**Wichtig:**
- `AuthProvider` wrapped die gesamte App (innerhalb von `Router`, damit `useNavigate` verfuegbar ist)
- Login und Register sind AUSSERHALB des Layout-Wrappers
- Der `ProtectedRoute` ist INNERHALB des `Layout`

---

## Welcome-Toast / Welcome-Modal

Beim ersten Login (wenn `hasSeenWelcome === false`) wird ein Welcome-Toast oder Welcome-Modal angezeigt.

### Variante: Welcome-Toast (einfacher)

```
┌──────────────────────────────────────┐
│  Willkommen bei MindForge! 🎮        │
│  Entdecke Lernspiele und werde       │
│  Teil der Community.                  │
│                                 [OK]  │
└──────────────────────────────────────┘
```

### Implementierung:

Im AuthContext, nach dem Login / onAuthStateChanged:

```javascript
// Nach erfolgreichem Login oder bei App-Start (wenn User eingeloggt ist)
if (firestoreUserData && !firestoreUserData.hasSeenWelcome) {
  // Toast anzeigen (ueber ToastContext oder einfaches State)
  showWelcomeToast()

  // Flag in Firestore setzen
  await updateDoc(doc(db, 'users', uid), { hasSeenWelcome: true })
}
```

Der Toast verschwindet nach 5 Sekunden automatisch oder kann mit "OK" geschlossen werden.

**Fuer den MVP reicht ein einfacher Toast.** Ein aufwaendigeres Welcome-Modal (mit Tutorial, Avatar-Auswahl etc.) kann spaeter in einem eigenen Plan hinzugefuegt werden.

---

## Navbar und Sidebar Anpassungen

Nach Implementierung der Authentication muessen Navbar und Sidebar angepasst werden:

### Navbar:
- **Eingeloggt:** Username anzeigen, Logout-Button (oder im Dropdown), MindCoins
- **Nicht eingeloggt:** "Login" und "Registrieren" Buttons anzeigen

### Sidebar:
- **Eingeloggt:** Alle Links anzeigen, Avatar + Username im oberen Bereich
- **Nicht eingeloggt:** Sidebar wird NICHT angezeigt (oder nur mit eingeschraenkten Links)

```jsx
// In Navbar.jsx
const { user, logout } = useAuth()

// Dann in JSX:
{user ? (
  <>
    <span>{user.username}</span>
    <span>{user.mindCoins} MC</span>
    <button onClick={logout}>Logout</button>
  </>
) : (
  <>
    <Link to="/login">Login</Link>
    <Link to="/register">Registrieren</Link>
  </>
)}
```

---

## Testen

Nach der Implementierung solltest du folgende Tests durchfuehren:

### Registrierung testen:
1. Gehe zu `/register`
2. Gib einen Username, E-Mail und Passwort ein
3. Klicke "Registrieren"
4. Du solltest zur Home-Seite weitergeleitet werden
5. Pruefe in der Firebase Console ob der User erstellt wurde (Auth + Firestore)

### Login testen:
1. Logge dich aus
2. Gehe zu `/login`
3. Gib E-Mail und Passwort ein
4. Klicke "Einloggen"
5. Du solltest zur Home-Seite weitergeleitet werden
6. Navbar zeigt deinen Username

### Fehler testen:
1. Versuche dich mit falscher E-Mail einzuloggen → Deutsche Fehlermeldung
2. Versuche dich mit falschem Passwort einzuloggen → Deutsche Fehlermeldung
3. Versuche einen bereits vergebenen Username zu registrieren → Fehlermeldung
4. Versuche ein zu kurzes Passwort (< 6 Zeichen) → Fehlermeldung
5. Versuche unterschiedliche Passwoerter bei der Registrierung → Fehlermeldung

### ProtectedRoute testen:
1. Logge dich aus
2. Versuche `/settings` zu oeffnen → Redirect zu `/login`
3. Logge dich ein (als normaler User)
4. Versuche `/create` zu oeffnen → Redirect zu `/premium` (da nicht Premium)
5. Versuche `/settings` zu oeffnen → Funktioniert

### Welcome-Toast testen:
1. Registriere einen neuen User
2. Beim ersten Laden der Home-Seite: Welcome-Toast sollte erscheinen
3. Lade die Seite neu → Welcome-Toast erscheint NICHT mehr (hasSeenWelcome = true)

---

## Checkliste

- [ ] `src/contexts/AuthContext.jsx` erstellt und exportiert AuthProvider + AuthContext
- [ ] `src/hooks/useAuth.js` erstellt und funktioniert
- [ ] `src/pages/auth/Login.jsx` erstellt - Seite zeigt Formular OHNE Layout
- [ ] `src/pages/auth/Register.jsx` erstellt - Seite zeigt Formular OHNE Layout
- [ ] `src/components/common/ProtectedRoute.jsx` erstellt
- [ ] Registrierung erstellt User in Firebase Auth UND Firestore
- [ ] Login funktioniert mit E-Mail + Passwort
- [ ] Logout funktioniert (User wird auf null gesetzt)
- [ ] Username-Validierung: 3-20 Zeichen, alphanumerisch + Unterstrich, einzigartig
- [ ] Fehlermeldungen werden auf Deutsch angezeigt
- [ ] ProtectedRoute leitet nicht-eingeloggte User zu /login weiter
- [ ] ProtectedRoute leitet nicht-Premium User zu /premium weiter
- [ ] Navbar zeigt Login/Register Buttons wenn nicht eingeloggt
- [ ] Navbar zeigt Username wenn eingeloggt
- [ ] Welcome-Toast wird beim ersten Login angezeigt
- [ ] hasSeenWelcome wird nach dem ersten Toast auf true gesetzt
- [ ] App.jsx ist aktualisiert mit AuthProvider und korrekten Routen
- [ ] Passwort-Minimum: 6 Zeichen
- [ ] Keine E-Mail-Verification noetig (MVP)

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/contexts/AuthContext.jsx` | Auth-State und Funktionen fuer die gesamte App |
| `src/hooks/useAuth.js` | Custom Hook fuer einfachen Zugriff auf AuthContext |
| `src/pages/auth/Login.jsx` | Login-Seite (ohne Layout) |
| `src/pages/auth/Register.jsx` | Registrierungs-Seite (ohne Layout) |
| `src/components/common/ProtectedRoute.jsx` | Schuetzt Routen vor unauthorisiertem Zugriff |
| `src/App.jsx` | Aktualisiert mit AuthProvider und Routen-Struktur |
