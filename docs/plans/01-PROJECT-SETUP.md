# 01 - Projekt-Setup

## Was wird hier gemacht?

In diesem Schritt wird das komplette Projekt von Grund auf eingerichtet. Am Ende hast du:
- Ein laufendes React-Projekt mit Vite
- Tailwind CSS fuer Styling
- Firebase-Anbindung (Auth, Datenbank, Storage)
- Eine funktionierende Startseite die "Hello MindForge" anzeigt

---

## Voraussetzungen

Du brauchst auf deinem Computer:
- **Node.js** (Version 18 oder hoeher) - Download: https://nodejs.org
- **npm** (kommt mit Node.js mit)
- **Git** (Version Control) - Download: https://git-scm.com
- **Ein Code-Editor** (z.B. VS Code)
- **Ein Google-Konto** (fuer Firebase)

---

## Schritt 1: React-Projekt mit Vite erstellen

Oeffne ein Terminal im Ordner `mindforge-playground/` und fuehre aus:

```bash
npm create vite@latest . -- --template react
```

**Was passiert hier?**
- `npm create vite@latest` = Erstellt ein neues Vite-Projekt
- `.` = Im aktuellen Ordner (nicht in einem Unterordner)
- `--template react` = Benutze die React-Vorlage

Falls der Ordner nicht leer ist, bestaetige mit "y".

Danach installiere die Abhaengigkeiten:

```bash
npm install
```

Teste ob es funktioniert:

```bash
npm run dev
```

Oeffne im Browser: `http://localhost:5173` - Du solltest die Vite+React Willkommensseite sehen.

---

## Schritt 2: Abhaengigkeiten installieren

Installiere alle benoetigten Pakete:

```bash
npm install react-router-dom firebase three @react-three/fiber @react-three/drei
```

**Was ist was?**
- `react-router-dom` = Navigation zwischen Seiten (z.B. /home, /profile)
- `firebase` = Firebase SDK (Datenbank, Auth, Storage)
- `three` = Three.js 3D-Bibliothek
- `@react-three/fiber` = React-Wrapper fuer Three.js
- `@react-three/drei` = Hilfs-Komponenten fuer Three.js

---

## Schritt 3: Tailwind CSS einrichten

Installiere Tailwind CSS:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

**Was ist `-D`?** Das installiert als "Dev Dependency" - wird nur fuer die Entwicklung gebraucht, nicht im fertigen Produkt.

### vite.config.js anpassen

Ersetze den Inhalt von `vite.config.js` mit:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### CSS-Datei erstellen

Erstelle die Datei `src/styles/globals.css` mit folgendem Inhalt:

```css
@import "tailwindcss";

/* MindForge Custom Theme */
@theme {
  --color-primary: #1e3a8a;
  --color-primary-light: #2563eb;
  --color-primary-dark: #1e3a5f;
  --color-accent: #f97316;
  --color-accent-light: #fb923c;
  --color-accent-dark: #ea580c;
  --color-bg-primary: #111827;
  --color-bg-secondary: #1f2937;
  --color-bg-card: #374151;
  --color-bg-hover: #4b5563;
  --color-text-primary: #ffffff;
  --color-text-secondary: #9ca3af;
  --color-text-muted: #6b7280;
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
}

/* Basis-Styling */
body {
  @apply bg-bg-primary text-text-primary font-sans;
  margin: 0;
  padding: 0;
}

/* Scrollbar Styling (fuer Dark Mode) */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--color-bg-hover);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}
```

### globals.css in main.jsx einbinden

Ersetze den Inhalt von `src/main.jsx`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Loesche** die alte Datei `src/index.css` falls vorhanden.
**Loesche** die Datei `src/App.css` falls vorhanden.

---

## Schritt 4: Google Fonts einbinden

Oeffne die Datei `index.html` im Projekt-Root und fuege im `<head>` Bereich hinzu:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Aendere auch den `<title>` Tag:

```html
<title>MindForge - Wo Lernen zum Spiel wird</title>
```

Fuege in `src/styles/globals.css` nach dem `@import` hinzu:

```css
@theme {
  /* ...existierende Farben... */
  --font-sans: 'Inter', sans-serif;
}
```

---

## Schritt 5: Firebase einrichten

### 5a: Firebase-Projekt erstellen

1. Gehe zu https://console.firebase.google.com
2. Klicke "Projekt hinzufuegen"
3. Name: `mindforge-playground`
4. Google Analytics: Kann deaktiviert werden (nicht noetig fuer MVP)
5. Klicke "Projekt erstellen"

### 5b: Web-App hinzufuegen

1. Im Firebase-Dashboard: Klicke auf das Web-Symbol `</>`
2. App-Nickname: `mindforge-web`
3. Firebase Hosting: NICHT aktivieren (machen wir spaeter)
4. Klicke "App registrieren"
5. Kopiere die Konfigurationsdaten (apiKey, authDomain, etc.)

### 5c: Firebase-Dienste aktivieren

**Authentication aktivieren:**
1. Im Firebase-Dashboard links: "Authentication" klicken
2. "Erste Schritte" klicken
3. Tab "Anmeldemethode": "E-Mail-Adresse/Passwort" aktivieren
4. Speichern

**Firestore aktivieren:**
1. Links: "Firestore Database" klicken
2. "Datenbank erstellen" klicken
3. Standort: `europe-west3` (Frankfurt) waehlen
4. "Im Testmodus starten" waehlen (fuer die Entwicklung)
5. Fertig klicken

**Storage aktivieren:**
1. Links: "Storage" klicken
2. "Erste Schritte" klicken
3. "Im Testmodus starten" waehlen
4. Standort: `europe-west3` (oder automatisch)
5. Fertig klicken

### 5d: Firebase-Konfigurationsdatei erstellen

Erstelle die Datei `src/firebase/config.js`:

```javascript
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// WICHTIG: Ersetze diese Werte mit deinen eigenen Firebase-Daten!
// Du findest sie in der Firebase Console unter:
// Projekteinstellungen > Allgemein > Deine Apps > Firebase SDK-Konfiguration
const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJEKT.firebaseapp.com",
  projectId: "DEIN_PROJEKT_ID",
  storageBucket: "DEIN_PROJEKT.firebasestorage.app",
  messagingSenderId: "DEINE_SENDER_ID",
  appId: "DEINE_APP_ID"
}

// Firebase initialisieren
const app = initializeApp(firebaseConfig)

// Firebase-Dienste exportieren (werden in der ganzen App verwendet)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
```

**WICHTIG:** Ersetze die Platzhalter (`DEIN_API_KEY` etc.) mit den echten Werten aus deiner Firebase Console!

---

## Schritt 6: .gitignore erstellen

Erstelle/aktualisiere die Datei `.gitignore` im Projekt-Root:

```
# Dependencies
node_modules/

# Build
dist/

# Environment
.env
.env.local
.env.*.local

# Editor
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

---

## Schritt 7: Ordnerstruktur erstellen

Erstelle folgende leere Ordner (mit einer leeren .gitkeep Datei damit Git sie trackt):

```
src/
  components/
    layout/
    game/
    profile/
    common/
  pages/
    auth/
  hooks/
  firebase/       (existiert bereits mit config.js)
  data/
  styles/         (existiert bereits mit globals.css)
```

---

## Schritt 8: App.jsx mit React Router einrichten

Ersetze den Inhalt von `src/App.jsx`:

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg-primary text-text-primary">
        {/* Platzhalter - wird in 02-LAYOUT-NAVIGATION.md ersetzt */}
        <Routes>
          <Route path="/" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-5xl font-bold text-accent mb-4">
                  MindForge
                </h1>
                <p className="text-xl text-text-secondary">
                  Wo Lernen zum Spiel wird
                </p>
                <p className="text-sm text-text-muted mt-8">
                  Setup erfolgreich! Weiter mit 02-LAYOUT-NAVIGATION.md
                </p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
```

---

## Schritt 9: Testen

Starte den Entwicklungsserver:

```bash
npm run dev
```

Oeffne `http://localhost:5173` im Browser. Du solltest sehen:
- Dunkler Hintergrund
- "MindForge" in Orange (gross)
- "Wo Lernen zum Spiel wird" darunter
- "Setup erfolgreich!" als Hinweis

**Wenn etwas nicht funktioniert:**
- Pruefe die Browser-Konsole (F12) auf Fehler
- Stelle sicher, dass alle npm-Pakete installiert sind
- Pruefe ob `globals.css` korrekt importiert wird in `main.jsx`

---

## Checkliste

Bevor du mit der naechsten Datei (02-LAYOUT-NAVIGATION.md) weitermachst, pruefe:

- [ ] `npm run dev` startet ohne Fehler
- [ ] Seite zeigt "MindForge" in Orange auf dunklem Hintergrund
- [ ] Firebase-Konfiguration ist eingetragen (mit echten Werten)
- [ ] Tailwind CSS funktioniert (Text ist gestylt)
- [ ] Ordnerstruktur ist angelegt

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `vite.config.js` | Vite + Tailwind Konfiguration |
| `src/main.jsx` | App-Einstiegspunkt |
| `src/App.jsx` | Haupt-Komponente mit Router |
| `src/styles/globals.css` | Tailwind + Custom Theme + Basis-Styling |
| `src/firebase/config.js` | Firebase-Verbindung |
| `.gitignore` | Git-Ignorier-Regeln |
| `index.html` | HTML mit Google Fonts |
