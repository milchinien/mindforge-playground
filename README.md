# 🎓 MindForge - Playground

> Eine browser-basierte Lernspiel-Plattform, die interaktives Lernen mit Gaming-Community-Features verbindet.

![Status](https://img.shields.io/badge/Status-MVP%20Playground-orange)
![Version](https://img.shields.io/badge/Version-0.1.0-blue)

---

## 📋 Inhaltsverzeichnis

- [Über das Projekt](#-über-das-projekt)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Erste Schritte](#-erste-schritte)
- [Projektstruktur](#-projektstruktur)
- [Entwicklungsplan](#-entwicklungsplan)
- [Dokumentation](#-dokumentation)
- [Lizenz](#-lizenz)

---

## 🎯 Über das Projekt

**MindForge** ist eine Webplattform, auf der Menschen Lernspiele spielen und erstellen können. Die Plattform verbindet Gaming-Elemente mit Bildungsinhalten aus allen Bereichen (Mathematik, Sprachen, Naturwissenschaften, etc.).

### Was macht MindForge besonders?

- 🎮 **Gamification** - Lernen wird zum Spiel
- 🌍 **Community-getrieben** - Inhalte werden von Nutzern erstellt
- 🔧 **Creator-freundlich** - Einfaches Upload-System für eigene Spiele
- 💡 **Für alle zugänglich** - Kostenlos spielen, Premium zum Erstellen

### Vision

Eine Welt erschaffen, in der Lernen spielerisch, sozial und für jeden zugänglich ist.

---

## ✨ Key Features

### Für Spieler (Free)
- ✅ Unbegrenzter Zugang zu allen kostenlosen Lernspielen
- ✅ Personalisierte Startseite mit Empfehlungen
- ✅ Freundschaftssystem mit Online-Status
- ✅ Anpassbarer 2D-Avatar
- ✅ Intelligente Suche nach Spielen (Tags + Namen)

### Für Creator (Premium - 9,99€/Monat)
- ✅ Spiele hochladen & veröffentlichen
- ✅ Unbegrenzte Uploads
- ✅ Analytics (Views, Plays, Likes)
- ✅ Premium-Spiele verkaufen
- ✅ Creator-Badge

### Für Lehrer (Teacher Premium - 14,99€/Monat)
- ✅ Alle Creator-Features
- ✅ Lehrer-Dashboard
- ✅ Klassen erstellen & verwalten
- ✅ Spiele als Hausaufgaben zuweisen
- ✅ Schüler-Fortschritte tracken

---

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI Framework
- **Three.js** - 3D/2D Game Engine (WebGL)
- **Tailwind CSS** - Utility-First Styling
- **React Router** - Navigation
- **Vite** - Build Tool

### Backend
- **Firebase** - Backend-as-a-Service
  - Authentication (Username + Passwort)
  - Firestore (NoSQL Database)
  - Storage (Spiel-Dateien, Assets)
  - Hosting (später für Production)

### Game Technologies
- **HTML5 Canvas** - 2D Games
- **WebGL/Three.js** - 3D Games
- **Web Audio API** - Sound
- **WebSockets** - Multiplayer (geplant)

---

## 🚀 Erste Schritte

### Voraussetzungen

- Node.js 18+ und npm installiert
- Git installiert
- Firebase-Account

### Installation

1. **Repository klonen**
   ```bash
   git clone https://github.com/yourusername/mindforge-playground.git
   cd mindforge-playground
   ```

2. **Dependencies installieren**
   ```bash
   cd client
   npm install
   ```

3. **Firebase konfigurieren**
   - Erstelle ein Firebase-Projekt auf [console.firebase.google.com](https://console.firebase.google.com)
   - Kopiere die Firebase-Config
   - Erstelle `client/src/firebase/config.js`:
   ```javascript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';
   import { getStorage } from 'firebase/storage';

   const firebaseConfig = {
     apiKey: "DEIN_API_KEY",
     authDomain: "DEIN_AUTH_DOMAIN",
     projectId: "DEIN_PROJECT_ID",
     storageBucket: "DEIN_STORAGE_BUCKET",
     messagingSenderId: "DEINE_SENDER_ID",
     appId: "DEINE_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   export const storage = getStorage(app);
   ```

4. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

5. **Browser öffnen**
   - Navigiere zu `http://localhost:5173`

---

## 📁 Projektstruktur

```
mindforge-playground/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/          # UI-Komponenten
│   │   │   ├── layout/          # Navbar, Sidebar, Layout
│   │   │   ├── game/            # GameCard, GamePlayer, etc.
│   │   │   ├── profile/         # Avatar, ProfileHeader, etc.
│   │   │   └── common/          # Button, Modal, LoadingSpinner
│   │   ├── pages/               # Seiten-Komponenten
│   │   │   ├── Home.jsx
│   │   │   ├── Mindbrowser.jsx
│   │   │   ├── GameDetail.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Create.jsx
│   │   │   └── ...
│   │   ├── hooks/               # Custom Hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useGames.js
│   │   │   └── useTheme.js
│   │   ├── firebase/            # Firebase Config
│   │   │   ├── config.js
│   │   │   ├── auth.js
│   │   │   └── storage.js
│   │   ├── utils/               # Helper-Funktionen
│   │   ├── styles/              # Globale Styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   ├── demo-games/          # Demo-Spiele
│   │   └── placeholders/        # Platzhalter-Bilder
│   └── package.json
├── docs/                        # Dokumentation
│   └── MINDFORGE_PROJECT_DESCRIPTION.md
├── README.md
└── .gitignore
```

---

## 📅 Entwicklungsplan

### Phase 1: Foundation (Woche 1-2)
- [ ] React + Vite Setup
- [ ] Tailwind CSS Konfiguration
- [ ] Firebase-Projekt Setup
- [ ] Navigation Bar + Sidebar
- [ ] Authentication (Login/Register)

### Phase 2: Game Integration (Woche 3-4)
- [ ] Home Screen mit Game Cards
- [ ] Game Player (Fullscreen + ESC-Menü)
- [ ] 2 Demo-Spiele (Mathe-Quiz, Physik-Sim)
- [ ] 10+ Platzhalter-Spiele (Mock-Daten)

### Phase 3: Creator Tools (Woche 5-6)
- [ ] Upload-System (ZIP + Thumbnail)
- [ ] Creator Dashboard
- [ ] Firebase Storage Integration
- [ ] Edit/Delete Funktionen

### Phase 4: User Features (Woche 7-8)
- [ ] Profil-Seite
- [ ] Avatar-Customization
- [ ] Inventory-System
- [ ] Freundschaftssystem (später)

### Phase 5: Social & Polish (Woche 9-10)
- [ ] Like/Dislike System
- [ ] Suchfunktion
- [ ] Lehrer-Dashboard
- [ ] Responsive Design
- [ ] Final Polish

---

## 🎨 Design System

### Farben

**Primär:**
- Dunkelblau: `#1e3a8a` - Navigation, Header
- Orange: `#f97316` - Akzente, CTAs, Highlights

**Sekundär:**
- Grau-Töne: `#1f2937`, `#374151`, `#9ca3af`
- Erfolg-Grün: `#10b981`
- Fehler-Rot: `#ef4444`

### Themes
- Dark Mode (Standard)
- Light Mode (optional)

### Typografie
- **Headings:** Inter Bold
- **Body:** Inter Regular
- **Code:** Fira Code

---

## 📖 Dokumentation

Die vollständige Projektbeschreibung findest du in:
- [`docs/MINDFORGE_PROJECT_DESCRIPTION.md`](./docs/MINDFORGE_PROJECT_DESCRIPTION.md)

Diese enthält:
- Detaillierte Feature-Beschreibungen
- UI/UX-Wireframes
- Datenbank-Schema
- API-Struktur
- Sicherheitskonzepte
- Komplettes Glossar

---

## 🔐 Wichtige Hinweise

### MVP Playground

Dies ist die **Playground-Version** (MVP = Minimum Viable Product):
- ❌ Kein echtes Payment-System
- ✅ Premium-Status wird manuell in Firebase vergeben
- ✅ Nur für 2 Test-Nutzer gedacht
- ✅ Läuft auf Localhost

### Sicherheit

- `.env`-Dateien NIEMALS committen!
- Firebase Security Rules konfigurieren
- Nur Premium-User dürfen Spiele hochladen

---

## 📊 Status

**Aktuelle Version:** 0.1.0 (Playground)
**Status:** In Entwicklung
**Zugang:** Privat (2 Test-Nutzer)
**Nächster Meilenstein:** Phase 1 abschließen

---

## 🤝 Mitwirken

Dies ist momentan ein privates Lernprojekt. Später könnte es Open Source werden.

---

## 📝 Lizenz

TBD (To Be Determined)

---

## 📞 Kontakt

**Projekt-Owner:** Michel1
**Zweck:** Learning Project - Playground

---

**MindForge** - Wo Lernen zum Spiel wird. 🎓🎮

---

*Letzte Aktualisierung: 05.02.2026*
