# MindForge - Master Implementierungsplan

> **STATUS: ALLE 25 PLAENE IMPLEMENTIERT** - Einzelne Plan-Dateien wurden entfernt. Siehe README.md fuer die Uebersicht.

## Was ist dieses Dokument?

Dieser Master-Plan gibt einen Gesamtueberblick ueber ALLE Implementierungsschritte fuer MindForge. Alle Schritte wurden erfolgreich implementiert.

---

## Projekt-Ueberblick

**MindForge** ist eine Lernspiel-Plattform die im Browser laeuft. User koennen:
- Lernspiele spielen (kostenlos)
- Lernspiele erstellen und hochladen (Premium, 9,99 Euro/Monat)

**Tech-Stack:**
- Frontend: React 18+ mit Vite als Build-Tool
- Styling: Tailwind CSS
- Backend: Firebase (Auth, Firestore, Storage)
- 3D: Three.js (fuer 3D-Spiele)
- Routing: React Router

---

## Prioritaetenliste (1 = hoechste Prioritaet)

### PHASE 1 - Fundament (MUSS ZUERST)
| Prio | Datei | Feature | Warum wichtig? |
|------|-------|---------|----------------|
| 1 | `01-PROJECT-SETUP.md` | Projekt-Setup | Ohne Setup laeuft nichts |
| 2 | `02-LAYOUT-NAVIGATION.md` | Navbar + Sidebar + Layout | Grundgeruest jeder Seite |
| 2b | `23-COMMON-COMPONENTS.md` | Button, Modal, Toast, Spinner | Basis-Bausteine fuer alles andere |
| 3 | `03-AUTHENTICATION.md` | Login / Registrierung | User muessen sich anmelden koennen |

### PHASE 2 - Kern-Features (Hauptfunktionen)
| Prio | Datei | Feature | Warum wichtig? |
|------|-------|---------|----------------|
| 4 | `04-MINDBROWSER.md` | Mindbrowser (Spiele durchsuchen) | Kern der Plattform - alle Spiele sehen |
| 5 | `05-HOME-PAGE.md` | Home-Seite (personalisiert) | Startseite nach Login |
| 6 | `06-GAME-DETAIL.md` | Spiel-Detailseite | Info ueber ein Spiel sehen |
| 7 | `07-GAME-PLAYER.md` | Spiel abspielen (Fullscreen) | Spiele tatsaechlich spielen koennen |

### PHASE 3 - User-Features
| Prio | Datei | Feature | Warum wichtig? |
|------|-------|---------|----------------|
| 8 | `08-PROFILE-PAGE.md` | Profil-Seite | Eigenes Profil und andere Profile sehen |
| 9 | `09-SEARCH.md` | Suche | Spiele finden |
| 10 | `10-LIKE-DISLIKE.md` | Like/Dislike System | Spiele bewerten |

### PHASE 4 - Creator-Tools
| Prio | Datei | Feature | Warum wichtig? |
|------|-------|---------|----------------|
| 11 | `11-CREATE-UPLOAD.md` | Spiele erstellen & hochladen | Premium-Kernfunktion |

### PHASE 5 - Personalisierung
| Prio | Datei | Feature | Warum wichtig? |
|------|-------|---------|----------------|
| 12 | `12-AVATAR-CUSTOMIZATION.md` | Avatar anpassen | User-Individualisierung |
| 13 | `13-SETTINGS.md` | Einstellungen | Theme, Sprache, Account |
| 14 | `14-INVENTORY.md` | Inventar | Gekaufte Items sehen |

### PHASE 6 - Monetarisierung & Social Basics
| Prio | Datei | Feature | Warum wichtig? |
|------|-------|---------|----------------|
| 15 | `20-MINDCOINS-PREMIUM.md` | MindCoins & Premium | Waehrungssystem (Grundlage fuer Events & Marketplace) |
| 16 | `15-FOLLOW-SYSTEM.md` | Creators folgen | Updates bei neuen Spielen |

### PHASE 7 - Erweiterte Features
| Prio | Datei | Feature | Warum wichtig? |
|------|-------|---------|----------------|
| 17 | `17-EVENTS.md` | Events & Challenges | MindCoins verdienen (braucht MindCoins-System) |
| 18 | `18-ACHIEVEMENTS.md` | Achievements & Titel | Gamification / Motivation |
| 19 | `19-MARKETPLACE.md` | Asset-Marketplace | Creator-Assets kaufen/verkaufen |
| 20 | `16-NOTIFICATIONS.md` | Benachrichtigungen | User informieren (braucht Follow, Events, Achievements) |

### PHASE 8 - Spaetere Features (niedrigste Prio)
| Prio | Datei | Feature | Warum wichtig? |
|------|-------|---------|----------------|
| 21 | `21-TEACHER-DASHBOARD.md` | Lehrer-Dashboard | Spezial-Feature fuer Lehrer |
| 22 | `22-FRIENDS-SYSTEM.md` | Freunde-System | Soziales Netzwerk |

---

## WICHTIGE HINWEISE zur Reihenfolge

1. **Phase 1 ist PFLICHT** - Ohne Setup, Layout und Auth laeuft nichts anderes
2. **23-COMMON-COMPONENTS.md direkt nach 02 machen** - Button, Modal, Toast etc. werden ueberall gebraucht
3. **20-MINDCOINS-PREMIUM VOR 17-EVENTS machen** - Events vergeben MindCoins, daher muss das System vorher stehen
4. **16-NOTIFICATIONS NACH Follow/Events/Achievements machen** - Benachrichtigungen brauchen diese Features als "Sender"
5. **Du kannst Features ueberspringen** - Wenn z.B. Teacher-Dashboard nicht noetig ist, ueberspring es

---

## Wie arbeitest du mit diesen Dateien?

1. Oeffne die Datei mit der naechsten Prioritaet die du noch nicht abgeschlossen hast
2. Lies die komplette Datei durch
3. Gib die Datei an Claude Code mit dem Befehl: "Implementiere das hier: [Dateiinhalt]"
4. Teste das Ergebnis
5. Gehe zur naechsten Datei

**Wichtig:**
- Jede Datei ist komplett eigenstaendig - du brauchst KEIN Vorwissen
- Jede Datei erklaert ALLES was du wissen musst
- Die Reihenfolge in der Prioritaetenliste ist optimiert fuer Abhaengigkeiten
- Phase 1 (01, 02, 23, 03) ist PFLICHT bevor du irgendetwas anderes machst

---

## Projektstruktur (Endergebnis)

So sieht das Projekt am Ende aus:

```
mindforge-playground/
├── src/
│   ├── components/           # Wiederverwendbare UI-Bausteine
│   │   ├── layout/           # Navbar, Sidebar, Layout, NotificationDropdown
│   │   ├── game/             # GameCard, GameRow, FeaturedCarousel, LikeDislike, TagList
│   │   ├── profile/          # AvatarRenderer, ProfileHeader, ProfileTabs, FollowButton
│   │   ├── home/             # FriendsPreview
│   │   ├── create/           # UploadModal
│   │   ├── events/           # EventCard
│   │   ├── achievements/     # TitleSelectModal
│   │   ├── marketplace/      # AssetCard
│   │   ├── friends/          # FriendCard, FriendRequestCard, AddFriendModal
│   │   └── common/           # Button, Modal, Toast, LoadingSpinner, ProgressBar, EmptyState
│   ├── pages/                # Einzelne Seiten
│   │   ├── Home.jsx
│   │   ├── Mindbrowser.jsx
│   │   ├── GameDetail.jsx
│   │   ├── GamePlayer.jsx
│   │   ├── Profile.jsx
│   │   ├── Create.jsx
│   │   ├── Search.jsx
│   │   ├── Settings.jsx
│   │   ├── Avatar.jsx
│   │   ├── Inventory.jsx
│   │   ├── Events.jsx
│   │   ├── Achievements.jsx
│   │   ├── Marketplace.jsx
│   │   ├── Friends.jsx
│   │   ├── Premium.jsx
│   │   ├── Shop.jsx
│   │   ├── TeacherDashboard.jsx
│   │   └── auth/
│   │       ├── Login.jsx
│   │       └── Register.jsx
│   ├── contexts/             # React Contexts
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── hooks/                # Custom React Hooks
│   │   ├── useAuth.js
│   │   ├── useGames.js
│   │   └── useTheme.js
│   ├── firebase/             # Firebase Konfiguration
│   │   └── config.js
│   ├── data/                 # Mock-Daten und Konstanten
│   │   ├── mockGames.js
│   │   ├── mockEvents.js
│   │   ├── mockAssets.js
│   │   └── achievementDefinitions.js
│   ├── utils/                # Hilfsfunktionen
│   │   └── formatters.js     # formatNumber, timeAgo
│   ├── styles/               # Globale CSS-Dateien
│   │   └── globals.css
│   ├── App.jsx               # Haupt-Komponente mit Routing
│   └── main.jsx              # Einstiegspunkt
├── public/
│   └── demo-games/           # Demo-Spiele (HTML5)
│       ├── mathe-quiz/
│       │   ├── index.html
│       │   ├── game.js
│       │   └── style.css
│       └── physik-sim/
│           ├── index.html
│           ├── simulation.js
│           └── style.css
├── docs/                     # Dokumentation
│   ├── plans/                # Diese Plan-Dateien
│   └── MINDFORGE_PROJECT_DESCRIPTION.md
├── index.html                # HTML-Einstiegspunkt
├── vite.config.js            # Vite Build-Konfiguration
├── package.json              # Abhaengigkeiten
└── .gitignore                # Git-Ignorier-Regeln
```

---

## Alle Routen im Ueberblick

| Route | Seite | Zugang | Plan-Datei |
|-------|-------|--------|------------|
| `/` | Home | Alle | 05-HOME-PAGE.md |
| `/browse` | Mindbrowser | Alle | 04-MINDBROWSER.md |
| `/game/:id` | Spiel-Detail | Alle | 06-GAME-DETAIL.md |
| `/play/:id` | Game Player | Alle | 07-GAME-PLAYER.md |
| `/search` | Suche | Alle | 09-SEARCH.md |
| `/marketplace` | Marketplace | Alle | 19-MARKETPLACE.md |
| `/events` | Events | Alle | 17-EVENTS.md |
| `/login` | Login | Nur nicht-eingeloggt | 03-AUTHENTICATION.md |
| `/register` | Registrierung | Nur nicht-eingeloggt | 03-AUTHENTICATION.md |
| `/profile/:username` | Profil | Eingeloggt | 08-PROFILE-PAGE.md |
| `/settings` | Einstellungen | Eingeloggt | 13-SETTINGS.md |
| `/friends` | Freunde | Eingeloggt | 22-FRIENDS-SYSTEM.md |
| `/avatar` | Avatar Editor | Eingeloggt | 12-AVATAR-CUSTOMIZATION.md |
| `/inventory` | Inventar | Eingeloggt | 14-INVENTORY.md |
| `/achievements` | Achievements | Eingeloggt | 18-ACHIEVEMENTS.md |
| `/premium` | Premium-Werbung | Alle | 20-MINDCOINS-PREMIUM.md |
| `/shop` | MindCoins-Shop | Eingeloggt | 20-MINDCOINS-PREMIUM.md |
| `/create` | Spiele erstellen | Premium | 11-CREATE-UPLOAD.md |
| `/teacher` | Lehrer-Dashboard | Teacher Premium | 21-TEACHER-DASHBOARD.md |

**Seiten OHNE Layout (kein Navbar/Sidebar):**
- `/login`
- `/register`
- `/play/:id`

---

## Design-Grundregeln

Diese Regeln gelten fuer ALLE Dateien:

1. **Dark Mode ist Standard** - Hintergrund dunkel, Text hell
2. **Farben:**
   - Primaer-Blau: `#1e3a8a`
   - Akzent-Orange: `#f97316`
   - Hintergrund: `#111827` (Body), `#1f2937` (Sidebar/Navbar)
   - Karten: `#374151`
   - Hover: `#4b5563`
   - Text: `#ffffff` (Haupt), `#9ca3af` (Sekundaer), `#6b7280` (Gedimmt)
   - Erfolg: `#10b981`
   - Fehler: `#ef4444`
   - Warnung: `#f59e0b`
3. **Schrift:** Inter (Google Fonts)
4. **Responsive Breakpoints:**
   - Mobile: < 640px
   - Tablet: 640px - 1024px
   - Desktop: > 1024px
5. **Animationen:** Subtil, nicht ablenkend (Hover-Effekte, sanfte Uebergaenge)

---

## Firebase-Sammlungen (Datenbank-Uebersicht)

| Collection | Beschreibung | Erstellt in Datei |
|------------|-------------|-------------------|
| `users` | Nutzer-Daten (Profil, Settings, Avatar) | 03-AUTHENTICATION.md |
| `games` | Spiele-Daten (Titel, Creator, Stats) | 04-MINDBROWSER.md / 11-CREATE-UPLOAD.md |
| `ratings` | Likes/Dislikes pro User pro Spiel | 10-LIKE-DISLIKE.md |
| `playHistory` | Spielverlauf (wer hat wann was gespielt) | 07-GAME-PLAYER.md |
| `follows` | Follow-Beziehungen (User -> Creator) | 15-FOLLOW-SYSTEM.md |
| `friendships` | Freundschaften (bidirektional) | 22-FRIENDS-SYSTEM.md |
| `notifications` | Benachrichtigungen pro User | 16-NOTIFICATIONS.md |
| `marketplace` | Assets zum Kaufen/Verkaufen | 19-MARKETPLACE.md |
| `teachers` | Lehrer-Daten, Klassen, Zuweisungen | 21-TEACHER-DASHBOARD.md |
| `events` | Events/Challenges mit Zeitrahmen | 17-EVENTS.md |

**Hinweis:** Achievement-Fortschritt wird in `users/{uid}` gespeichert (als Nested-Feld), nicht als separate Collection.

---

## Features die NICHT im MVP enthalten sind

Diese Features sind in der Projektbeschreibung erwaehnt aber bewusst fuer spaeter geplant:

- **Groups/Communities** - Geplant fuer V1.5+ (Sidebar zeigt "Coming Soon")
- **Direktnachrichten/Chat** - Geplant fuer V1.5+ (Friends-Seite zeigt deaktivierten Button)
- **Multiplayer/WebSockets** - Geplant fuer V1.5+
- **Echtes Bezahlsystem** (Stripe/PayPal) - MVP zeigt nur UI, kein Payment
- **AI-Game-Generator** - Geplant fuer V1.0+
- **Mobile Native Apps** - Geplant fuer V2.0
- **Internationalisierung (i18n)** - Geplant fuer V2.0
- **Content Moderation/AI-Scans** - Geplant fuer V1.0+
- **Admin-Dashboard** - Nicht im MVP
