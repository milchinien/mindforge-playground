# 02 - Layout, Navbar & Sidebar

## Was wird hier gemacht?

In diesem Schritt baust du das Grundgeruest jeder Seite:
- **Navbar** (obere Menüleiste) mit Logo, Navigation und User-Info
- **Sidebar** (linke Seitenleiste) mit persoenlichen Links
- **Layout-Wrapper** der Navbar + Sidebar + Seiteninhalt zusammenfuegt

Am Ende hat jede Seite automatisch Navbar oben und Sidebar links.

---

## Voraussetzung

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- `npm run dev` laeuft ohne Fehler

---

## Uebersicht der Komponenten

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR (ganz oben, volle Breite)                            │
│  [Logo] [Mindbrowser] [Marketplace] [Create] [Search]       │
│                              [Username] [Glocke] [Coins] [⚙]│
├────────────┬─────────────────────────────────────────────────┤
│  SIDEBAR   │  MAIN CONTENT AREA                              │
│            │                                                  │
│  Home      │  (Hier kommt der Seiteninhalt)                  │
│  Profil    │                                                  │
│  Friends   │                                                  │
│  Avatar    │                                                  │
│  Inventory │                                                  │
│  Groups    │                                                  │
│            │                                                  │
│ [Premium]  │                                                  │
│            │                                                  │
│  Events    │                                                  │
└────────────┴─────────────────────────────────────────────────┘
```

---

## Datei 1: `src/components/layout/Navbar.jsx`

Die Navbar ist die obere Menüleiste die auf JEDER Seite sichtbar ist.

**Linke Seite:**
- MindForge Logo (klickbar, fuehrt zu Home "/")
- "Mindbrowser" Link (fuehrt zu "/browse")
- "Marketplace" Link (fuehrt zu "/marketplace")
- "Create" Link (fuehrt zu "/create") - nur sichtbar wenn User Premium ist
- Suchfeld (Eingabefeld + Lupe-Icon)

**Rechte Seite (nur wenn eingeloggt):**
- Username (klickbar, fuehrt zu "/profile/USERNAME")
- Benachrichtigungsglocke (klickbar, spaeter mit Badge fuer Anzahl)
- MindCoins-Anzeige (z.B. "500 MC")
- Einstellungs-Zahnrad (klickbar, fuehrt zu "/settings")

**Wenn NICHT eingeloggt:**
- "Login" Button
- "Registrieren" Button

**Styling:**
- Hintergrund: `bg-bg-secondary` (#1f2937)
- Hoehe: ca. 64px (h-16)
- Feste Position oben (sticky top-0)
- Z-Index hoch (z-50), damit sie ueber allem liegt
- Border unten: `border-b border-gray-700`

**Suchfeld:**
- Abgerundetes Eingabefeld mit Lupe-Icon links
- Hintergrund: `bg-bg-card` (#374151)
- Placeholder: "Spiele suchen..."
- Bei Enter: Weiterleitung zu `/search?q=SUCHBEGRIFF`

**Responsive:**
- Auf kleinen Bildschirmen (< 768px): Hamburger-Menue statt volle Navigation
- Suchfeld wird zum Icon das sich aufklappt

---

## Datei 2: `src/components/layout/Sidebar.jsx`

Die Sidebar ist die linke Seitenleiste mit persoenlichen Links.

**Links (von oben nach unten):**
1. User-Bereich: Avatar-Bild + Username
2. Trennlinie
3. Home (Icon: Haus) - Link zu "/"
4. Profil (Icon: Person) - Link zu "/profile/USERNAME"
5. Friends (Icon: Personen) - Link zu "/friends"
6. Avatar (Icon: Palette) - Link zu "/avatar"
7. Inventory (Icon: Rucksack) - Link zu "/inventory"
8. Groups (Icon: Gruppe) - Link zu "/groups" (ausgegraut, "Coming Soon")
9. Trennlinie
10. "Get Premium" Button (nur wenn User KEIN Premium hat)
    - Auffaellig gestylt in Akzent-Orange
    - Link zu "/premium"
11. Trennlinie
12. Events (Icon: Kalender) - Link zu "/events"

**Styling:**
- Breite: 240px (w-60)
- Hintergrund: `bg-bg-secondary` (#1f2937)
- Feste Position links (fixed, von Navbar-Hoehe bis unten)
- Border rechts: `border-r border-gray-700`
- Jeder Link: Padding, Hover-Effekt (`hover:bg-bg-card`), Transition
- Aktiver Link: Hervorgehoben mit `bg-bg-card` und Akzent-Farbe links

**Einklappbar (Collapse):**
- Button oben zum Ein-/Ausklappen
- Eingeklappt: Nur Icons sichtbar (Breite: 64px)
- Ausgeklappt: Icons + Text
- Zustand wird im localStorage gespeichert

**Responsive:**
- Auf kleinen Bildschirmen (< 1024px): Sidebar ist standardmaessig eingeklappt
- Auf ganz kleinen Bildschirmen (< 768px): Sidebar ist ein Overlay (ueberlagert den Content)

---

## Datei 3: `src/components/layout/Layout.jsx`

Der Layout-Wrapper kombiniert Navbar + Sidebar + Content.

**Aufbau:**

```jsx
<div>
  <Navbar />
  <div className="flex">
    <Sidebar />
    <main className="flex-1 ml-60 mt-16 p-6">
      {/* Seiteninhalt (children) */}
      {children}
    </main>
  </div>
</div>
```

**Wichtige Details:**
- `ml-60` = Margin-Left fuer Sidebar-Breite (240px)
- `mt-16` = Margin-Top fuer Navbar-Hoehe (64px)
- Wenn Sidebar eingeklappt: `ml-16` statt `ml-60`
- Wenn kein User eingeloggt: Sidebar wird nicht angezeigt, `ml-0`

**Props:**
- `showSidebar` (boolean) - Sidebar anzeigen? Standard: true
- `children` (ReactNode) - Der Seiteninhalt

---

## Datei 4: Icons

Fuer die Icons verwende einfache SVG-Icons oder Unicode-Zeichen. Fuer den MVP reichen Unicode/Emoji-Icons:

| Funktion | Icon |
|----------|------|
| Home | 🏠 |
| Profil | 👤 |
| Friends | 👥 |
| Avatar | 🎭 |
| Inventory | 🎒 |
| Groups | 👥 |
| Events | 📅 |
| Search | 🔍 |
| Notifications | 🔔 |
| Settings | ⚙️ |
| MindCoins | 💰 |
| Premium | 💎 |

**Alternativ:** Installiere `lucide-react` fuer professionelle Icons:

```bash
npm install lucide-react
```

Dann kannst du Icons so verwenden:

```jsx
import { Home, User, Users, Palette, Backpack, Calendar, Search, Bell, Settings, Coins } from 'lucide-react'

// Beispiel:
<Home className="w-5 h-5" />
```

---

## App.jsx aktualisieren

Nach Erstellung der Layout-Komponenten muss `src/App.jsx` aktualisiert werden:

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'

// Platzhalter-Seiten (werden spaeter durch echte Seiten ersetzt)
function PlaceholderPage({ title }) {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold text-text-primary mb-4">{title}</h1>
      <p className="text-text-secondary">Diese Seite wird bald implementiert.</p>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<PlaceholderPage title="Home" />} />
          <Route path="/browse" element={<PlaceholderPage title="Mindbrowser" />} />
          <Route path="/marketplace" element={<PlaceholderPage title="Marketplace" />} />
          <Route path="/create" element={<PlaceholderPage title="Create" />} />
          <Route path="/search" element={<PlaceholderPage title="Suche" />} />
          <Route path="/profile/:username" element={<PlaceholderPage title="Profil" />} />
          <Route path="/settings" element={<PlaceholderPage title="Einstellungen" />} />
          <Route path="/friends" element={<PlaceholderPage title="Freunde" />} />
          <Route path="/avatar" element={<PlaceholderPage title="Avatar" />} />
          <Route path="/inventory" element={<PlaceholderPage title="Inventar" />} />
          <Route path="/events" element={<PlaceholderPage title="Events" />} />
          <Route path="/achievements" element={<PlaceholderPage title="Achievements" />} />
          <Route path="/game/:id" element={<PlaceholderPage title="Spiel" />} />
          <Route path="/login" element={<PlaceholderPage title="Login" />} />
          <Route path="/register" element={<PlaceholderPage title="Registrieren" />} />
          <Route path="*" element={<PlaceholderPage title="404 - Seite nicht gefunden" />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
```

---

## Testen

Nach der Implementierung solltest du:

1. **Navbar sehen** - Oben auf jeder Seite, mit Logo, Links und Suchfeld
2. **Sidebar sehen** - Links auf jeder Seite, mit allen Navigation-Links
3. **Navigation testen** - Klicke auf verschiedene Links, die URL aendert sich
4. **Sidebar einklappen** - Klicke den Collapse-Button
5. **Responsive testen** - Verkleinere das Browserfenster
6. **Hover-Effekte** - Fahre mit der Maus ueber Sidebar-Links

---

## Checkliste

- [ ] Navbar zeigt Logo, Navigationslinks und Suchfeld
- [ ] Sidebar zeigt alle persoenlichen Links
- [ ] Klick auf Links aendert die URL und zeigt Platzhalter-Seiten
- [ ] Sidebar laesst sich ein-/ausklappen
- [ ] Aktiver Link in der Sidebar ist hervorgehoben
- [ ] Logo-Klick fuehrt zu Home (/)
- [ ] Auf kleinen Bildschirmen funktioniert die Navigation

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/components/layout/Navbar.jsx` | Obere Menüleiste |
| `src/components/layout/Sidebar.jsx` | Linke Seitenleiste |
| `src/components/layout/Layout.jsx` | Wrapper fuer Navbar + Sidebar + Content |
| `src/App.jsx` | Aktualisiert mit Layout und allen Routen |
