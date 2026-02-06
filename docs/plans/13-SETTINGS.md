# 13 - Einstellungen (Settings)

## Was wird hier gemacht?

In diesem Schritt baust du die Einstellungs-Seite unter `/settings`. Hier kann der User seinen Account verwalten: Dark/Light Mode umschalten, Sprache waehlen (Platzhalter), Benachrichtigungen konfigurieren, Passwort aendern und seinen Account loeschen. Einstellungen werden sowohl in localStorage (fuer UI-Praeferenzen) als auch in Firestore (fuer serverseitige Praeferenzen) gespeichert.

---

## Voraussetzungen

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein
- Datei `03-AUTHENTICATION.md` muss abgeschlossen sein
- User muss eingeloggt sein um die Seite zu sehen

---

## Uebersicht der Seite

```
┌──────────────────────────────────────────────────────────────────┐
│  EINSTELLUNGEN (/settings)                                        │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Erscheinungsbild                                            │ │
│  │  ┌──────────────────────────┐                                │ │
│  │  │ [Dunkel]    [Hell]       │  Theme-Toggle                 │ │
│  │  └──────────────────────────┘                                │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Sprache                                                     │ │
│  │  [Deutsch v]  (Weitere Sprachen kommen bald)                 │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Benachrichtigungen                                          │ │
│  │  [x] Achievements           [x] Follows                     │ │
│  │  [x] Events                 [x] System                      │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Sicherheit                                                  │ │
│  │  [ Passwort aendern ]                                        │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Daten & Datenschutz                                         │ │
│  │  [ Daten exportieren (JSON) ]    [ Account loeschen ]        │ │
│  └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## Datei 1: `src/hooks/useTheme.js`

Custom Hook fuer Dark/Light Mode Verwaltung.

**Funktionalitaet:**
- Liest gespeichertes Theme aus localStorage (`mindforge-theme`)
- Falls nichts gespeichert: Prueft System-Praeferenz via `window.matchMedia('(prefers-color-scheme: dark)')`
- Standard-Fallback: `dark` (MindForge ist primaer dark)
- Setzt/entfernt CSS-Klasse `light` auf dem `<html>` Element
- Speichert Aenderungen in localStorage

```javascript
import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // 1. Gespeichertes Theme aus localStorage
    const saved = localStorage.getItem('mindforge-theme')
    if (saved) return saved

    // 2. System-Praeferenz
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light'
    }

    // 3. Standard: dark
    return 'dark'
  })

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'light') {
      root.classList.add('light')
    } else {
      root.classList.remove('light')
    }

    localStorage.setItem('mindforge-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const isDark = theme === 'dark'

  return { theme, setTheme, toggleTheme, isDark }
}
```

---

## Light Mode Farb-Variablen

Ergaenze in `src/styles/globals.css` die Light-Mode-Variablen:

```css
/* Light Mode Override */
.light {
  --color-bg-primary: #f3f4f6;
  --color-bg-secondary: #ffffff;
  --color-bg-card: #e5e7eb;
  --color-bg-hover: #d1d5db;
  --color-text-primary: #111827;
  --color-text-secondary: #4b5563;
  --color-text-muted: #9ca3af;
}

/* Scrollbar fuer Light Mode */
.light ::-webkit-scrollbar-track {
  background: #e5e7eb;
}

.light ::-webkit-scrollbar-thumb {
  background: #9ca3af;
}

.light ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
```

**Wichtig:** Die Farb-Variablen aus dem `@theme`-Block werden durch die `.light`-Klasse ueberschrieben. Alle Komponenten die `bg-bg-primary`, `text-text-primary` etc. verwenden, passen sich automatisch an.

---

## Datei 2: `src/pages/Settings.jsx`

Die Einstellungs-Seite mit allen Sektionen.

**State:**

```jsx
const { theme, toggleTheme, isDark } = useTheme()
const { currentUser } = useAuth()

const [notifications, setNotifications] = useState({
  achievements: true,
  follows: true,
  events: true,
  system: true,
})

const [language, setLanguage] = useState('de')

// Passwort-Dialog
const [showPasswordModal, setShowPasswordModal] = useState(false)
const [passwordForm, setPasswordForm] = useState({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const [passwordError, setPasswordError] = useState('')
const [passwordLoading, setPasswordLoading] = useState(false)

// Account-Loeschung
const [showDeleteModal, setShowDeleteModal] = useState(false)
const [deleteConfirmText, setDeleteConfirmText] = useState('')
const [deleteLoading, setDeleteLoading] = useState(false)
```

---

### Sektion 1: Erscheinungsbild (Theme Toggle)

```jsx
<section className="bg-bg-card rounded-xl p-6">
  <h2 className="text-xl font-semibold mb-4">Erscheinungsbild</h2>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-text-primary">Theme</p>
      <p className="text-sm text-text-muted">
        Waehle zwischen hellem und dunklem Design
      </p>
    </div>
    <div className="flex bg-bg-hover rounded-lg p-1">
      <button
        onClick={() => setTheme('dark')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
          ${isDark ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'}`}
      >
        Dunkel
      </button>
      <button
        onClick={() => setTheme('light')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
          ${!isDark ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'}`}
      >
        Hell
      </button>
    </div>
  </div>
</section>
```

---

### Sektion 2: Sprache (Platzhalter)

```jsx
<section className="bg-bg-card rounded-xl p-6">
  <h2 className="text-xl font-semibold mb-4">Sprache</h2>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-text-primary">Anzeigesprache</p>
      <p className="text-sm text-text-muted">
        Weitere Sprachen werden in zukuenftigen Updates hinzugefuegt
      </p>
    </div>
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="bg-bg-hover text-text-primary border border-gray-600 rounded-lg px-4 py-2"
    >
      <option value="de">Deutsch</option>
      <option value="en" disabled>English (bald)</option>
      <option value="fr" disabled>Francais (bald)</option>
      <option value="es" disabled>Espanol (bald)</option>
    </select>
  </div>
</section>
```

**Hinweis:** Fuer den MVP wird keine echte Internationalisierung (i18n) implementiert. Das Dropdown zeigt nur, dass die Funktion geplant ist. Die Optionen ausser "Deutsch" sind deaktiviert.

---

### Sektion 3: Benachrichtigungen

4 Toggles fuer verschiedene Benachrichtigungstypen:

```jsx
<section className="bg-bg-card rounded-xl p-6">
  <h2 className="text-xl font-semibold mb-4">Benachrichtigungen</h2>
  <div className="space-y-4">
    {[
      { key: 'achievements', label: 'Achievements', desc: 'Benachrichtigung bei neuen Achievements' },
      { key: 'follows', label: 'Follows', desc: 'Wenn dir jemand folgt' },
      { key: 'events', label: 'Events', desc: 'Neue Events und Challenges' },
      { key: 'system', label: 'System', desc: 'Wichtige Systemmeldungen' },
    ].map(({ key, label, desc }) => (
      <div key={key} className="flex items-center justify-between">
        <div>
          <p className="text-text-primary">{label}</p>
          <p className="text-sm text-text-muted">{desc}</p>
        </div>
        <ToggleSwitch
          checked={notifications[key]}
          onChange={(checked) =>
            setNotifications(prev => ({ ...prev, [key]: checked }))
          }
        />
      </div>
    ))}
  </div>
</section>
```

**ToggleSwitch Sub-Komponente:**

```jsx
function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${checked ? 'bg-accent' : 'bg-gray-600'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  )
}
```

---

### Sektion 4: Passwort aendern

**Wichtig:** Firebase erfordert eine Re-Authentifizierung bevor sensible Operationen wie Passwortaenderung durchgefuehrt werden koennen.

```jsx
const handlePasswordChange = async () => {
  setPasswordError('')

  // Validierung
  if (passwordForm.newPassword.length < 6) {
    setPasswordError('Passwort muss mindestens 6 Zeichen lang sein')
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    setPasswordError('Passwoerter stimmen nicht ueberein')
    return
  }

  setPasswordLoading(true)

  try {
    // Re-Authentifizierung
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      passwordForm.currentPassword
    )
    await reauthenticateWithCredential(currentUser, credential)

    // Passwort aendern
    await updatePassword(currentUser, passwordForm.newPassword)

    setShowPasswordModal(false)
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    // Toast: "Passwort erfolgreich geaendert!"
  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      setPasswordError('Aktuelles Passwort ist falsch')
    } else {
      setPasswordError('Fehler beim Aendern des Passworts: ' + error.message)
    }
  } finally {
    setPasswordLoading(false)
  }
}
```

**Firebase Imports die benoetigt werden:**

```javascript
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser
} from 'firebase/auth'
```

**Passwort-Modal UI:**

```jsx
{showPasswordModal && (
  <Modal onClose={() => setShowPasswordModal(false)} title="Passwort aendern">
    <div className="space-y-4">
      <input
        type="password"
        placeholder="Aktuelles Passwort"
        value={passwordForm.currentPassword}
        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
        className="w-full bg-bg-hover text-text-primary border border-gray-600 rounded-lg px-4 py-3"
      />
      <input
        type="password"
        placeholder="Neues Passwort (min. 6 Zeichen)"
        value={passwordForm.newPassword}
        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
        className="w-full bg-bg-hover text-text-primary border border-gray-600 rounded-lg px-4 py-3"
      />
      <input
        type="password"
        placeholder="Neues Passwort bestaetigen"
        value={passwordForm.confirmPassword}
        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
        className="w-full bg-bg-hover text-text-primary border border-gray-600 rounded-lg px-4 py-3"
      />
      {passwordError && (
        <p className="text-error text-sm">{passwordError}</p>
      )}
      <button
        onClick={handlePasswordChange}
        disabled={passwordLoading}
        className="w-full bg-accent hover:bg-accent-dark text-white py-3 rounded-lg font-semibold
                   disabled:opacity-50 transition-colors"
      >
        {passwordLoading ? 'Wird geaendert...' : 'Passwort aendern'}
      </button>
    </div>
  </Modal>
)}
```

---

### Sektion 5: Account loeschen

**Warnungs-Dialog mit Sicherheitsabfrage:**

Der User muss "LOESCHEN" eintippen um den Account zu loeschen.

```jsx
const handleDeleteAccount = async () => {
  if (deleteConfirmText !== 'LOESCHEN') return

  setDeleteLoading(true)

  try {
    // Optional: User-Daten aus Firestore loeschen
    await deleteDoc(doc(db, 'users', currentUser.uid))

    // Firebase Auth Account loeschen
    await deleteUser(currentUser)

    // Weiterleitung zu /login
    navigate('/login')
  } catch (error) {
    if (error.code === 'auth/requires-recent-login') {
      // User muss sich erneut anmelden
      // Toast: "Bitte melde dich erneut an und versuche es dann nochmal"
    }
  } finally {
    setDeleteLoading(false)
  }
}
```

**Loeschungs-Modal UI:**

```jsx
{showDeleteModal && (
  <Modal onClose={() => setShowDeleteModal(false)} title="Account loeschen">
    <div className="space-y-4">
      <div className="bg-error/10 border border-error/30 rounded-lg p-4">
        <p className="text-error font-semibold">Warnung: Diese Aktion kann nicht rueckgaengig gemacht werden!</p>
        <ul className="text-sm text-text-secondary mt-2 space-y-1 list-disc list-inside">
          <li>Alle deine Spiele werden geloescht</li>
          <li>Dein Profil wird entfernt</li>
          <li>Deine MindCoins gehen verloren</li>
          <li>Premium-Abonnement wird beendet</li>
        </ul>
      </div>
      <p className="text-text-secondary text-sm">
        Tippe <strong className="text-text-primary">LOESCHEN</strong> um zu bestaetigen:
      </p>
      <input
        type="text"
        value={deleteConfirmText}
        onChange={(e) => setDeleteConfirmText(e.target.value)}
        placeholder="LOESCHEN"
        className="w-full bg-bg-hover text-text-primary border border-gray-600 rounded-lg px-4 py-3"
      />
      <button
        onClick={handleDeleteAccount}
        disabled={deleteConfirmText !== 'LOESCHEN' || deleteLoading}
        className="w-full bg-error hover:bg-red-700 text-white py-3 rounded-lg font-semibold
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {deleteLoading ? 'Wird geloescht...' : 'Account endgueltig loeschen'}
      </button>
    </div>
  </Modal>
)}
```

---

### Sektion 6: Daten exportieren (DSGVO / GDPR)

Platzhalter fuer zukuenftigen Datenexport:

```jsx
<section className="bg-bg-card rounded-xl p-6">
  <h2 className="text-xl font-semibold mb-4">Daten & Datenschutz</h2>
  <div className="flex flex-col sm:flex-row gap-4">
    <button
      onClick={handleExportData}
      className="flex-1 bg-bg-hover hover:bg-gray-500 text-text-primary py-3 px-6
                 rounded-lg font-medium transition-colors"
    >
      Daten exportieren (JSON)
    </button>
    <button
      onClick={() => setShowDeleteModal(true)}
      className="flex-1 bg-error/10 hover:bg-error/20 text-error py-3 px-6
                 rounded-lg font-medium border border-error/30 transition-colors"
    >
      Account loeschen
    </button>
  </div>
</section>
```

**Export-Funktion (vereinfacht fuer MVP):**

```jsx
const handleExportData = async () => {
  try {
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
    const userData = userDoc.data()

    const exportData = {
      exportDate: new Date().toISOString(),
      profile: userData,
      email: currentUser.email,
    }

    // JSON-Datei herunterladen
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mindforge-export-${currentUser.uid}.json`
    a.click()
    URL.revokeObjectURL(url)

    // Toast: "Daten erfolgreich exportiert!"
  } catch (error) {
    // Toast: "Fehler beim Exportieren"
  }
}
```

---

## Speicher-Strategie

| Einstellung | Speicherort | Grund |
|-------------|-------------|-------|
| Theme (dark/light) | localStorage | Muss sofort geladen werden, ohne Server-Anfrage |
| Sprache | localStorage + Firestore | Lokal fuer schnelles Laden, Firestore fuer Sync |
| Benachrichtigungen | Firestore `users/{uid}.settings.notifications` | Muss serverseitig geprueft werden |
| Passwort | Firebase Auth | Direkt ueber Firebase Auth API |
| Account-Loeschung | Firebase Auth + Firestore | Beides muss geloescht werden |

### Firestore-Schema fuer Settings

```javascript
// Dokument: users/{uid}
{
  // ...andere User-Felder...
  settings: {
    language: 'de',
    notifications: {
      achievements: true,
      follows: true,
      events: true,
      system: true,
    }
  }
}
```

---

## Testen

1. **Theme Toggle** - Klicke zwischen "Dunkel" und "Hell", gesamte UI aendert sich
2. **Theme Persistenz** - Wechsle zu Light, lade Seite neu, Light bleibt aktiv
3. **System-Praeferenz** - Loesche localStorage, Browser-Praeferenz wird verwendet
4. **Sprache** - Dropdown zeigt nur Deutsch als aktive Option
5. **Benachrichtigungen** - Toggles schalten korrekt um
6. **Passwort aendern** - Dialog oeffnet sich, Validierung funktioniert
7. **Falsches Passwort** - Fehlermeldung erscheint bei falschem aktuellem Passwort
8. **Account loeschen** - Warnung wird angezeigt, erst "LOESCHEN" eintippen aktiviert Button
9. **Datenexport** - JSON-Datei wird heruntergeladen
10. **Responsive** - Seite sieht auf Mobile und Desktop gut aus

---

## Checkliste

- [ ] useTheme Hook liest aus localStorage und System-Praeferenz
- [ ] Theme-Toggle wechselt zwischen Dark und Light Mode
- [ ] Light Mode Farb-Variablen sind in globals.css definiert
- [ ] Theme-Wechsel wird in localStorage gespeichert
- [ ] Gesamte UI reagiert auf Theme-Wechsel
- [ ] Sprach-Auswahl zeigt Deutsch als aktiv, weitere deaktiviert
- [ ] 4 Notification-Toggles (Achievements, Follows, Events, System) funktionieren
- [ ] ToggleSwitch-Komponente ist korrekt gestylt und animiert
- [ ] Passwort-aendern-Dialog mit 3 Feldern oeffnet sich
- [ ] Re-Authentifizierung ueber Firebase funktioniert
- [ ] Passwort-Validierung (min. 6 Zeichen, Uebereinstimmung)
- [ ] Account-Loeschung zeigt Warn-Dialog mit Sicherheitsabfrage
- [ ] "LOESCHEN" muss eingetippt werden um Button zu aktivieren
- [ ] Datenexport als JSON funktioniert
- [ ] Einstellungen werden in Firestore und localStorage gespeichert
- [ ] Seite ist nur fuer eingeloggte User zugaenglich

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/hooks/useTheme.js` | Dark/Light Mode Hook mit localStorage + System-Praeferenz |
| `src/pages/Settings.jsx` | Einstellungs-Seite mit allen Sektionen |
| `src/styles/globals.css` | Ergaenzt um Light Mode Farb-Variablen |
