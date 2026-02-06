# 18 - Achievement-System

## Was wird hier gemacht?

In diesem Schritt baust du ein umfangreiches Achievement-System mit 60+ Achievements in 4 Kategorien. Die Achievements-Seite unter `/achievements` zeigt den Fortschritt des Users mit Kategorie-Tabs, Fortschrittsbalken und freischaltbaren Titeln. **WICHTIG: Achievements geben KEINE MindCoins! Nur kosmetische Belohnungen (Titel, Badges) - das ist eine bewusste Design-Entscheidung gegen "Farming".**

---

## Voraussetzungen

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein
- Datei `03-AUTHENTICATION.md` muss abgeschlossen sein
- User muss eingeloggt sein

---

## Uebersicht der Seite

```
┌──────────────────────────────────────────────────────────────────┐
│  ACHIEVEMENTS (/achievements)                                     │
│                                                                    │
│  Dein aktiver Titel: [ "Veteran" v ]  (Klick oeffnet Modal)     │
│                                                                    │
│  ┌──────────┬──────────┬──────────┬──────────┐                   │
│  │ Spieler  │ Sozial   │ Faecher  │ Creator  │   KATEGORIE-TABS │
│  └──────────┴──────────┴──────────┴──────────┘                   │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  ✅ Erste Schritte          Belohnung: "Anfaenger"        │  │
│  │  Spiele dein erstes Lernspiel                              │  │
│  │  ████████████████████████████████████████ 1/1 (100%)      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  🔓 Spieler                 Belohnung: "Spieler"           │  │
│  │  Spiele 10 verschiedene Lernspiele                         │  │
│  │  ████████████████░░░░░░░░░░░░░░░░░░░░░░ 7/10 (70%)       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  🔒 Veteran                 Belohnung: "Veteran"           │  │
│  │  Spiele 100 verschiedene Lernspiele                        │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 7/100 (7%)     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ... weitere Achievements ...                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## Achievement-Definitionen

### Datei: `src/data/achievementDefinitions.js`

Alle 60+ Achievements werden hier zentral definiert.

### Kategorie 1: Spieler (Player) - 15 Achievements

```javascript
const PLAYER_ACHIEVEMENTS = [
  // Spiele spielen
  {
    id: 'first-steps',
    name: 'Erste Schritte',
    description: 'Spiele dein erstes Lernspiel',
    category: 'player',
    requirement: { type: 'games_played', value: 1 },
    reward: { type: 'title', value: 'Anfaenger' },
    icon: '👶',
  },
  {
    id: 'player',
    name: 'Spieler',
    description: 'Spiele 10 verschiedene Lernspiele',
    category: 'player',
    requirement: { type: 'games_played', value: 10 },
    reward: { type: 'title', value: 'Spieler' },
    icon: '🎮',
  },
  {
    id: 'gamer',
    name: 'Gamer',
    description: 'Spiele 25 verschiedene Lernspiele',
    category: 'player',
    requirement: { type: 'games_played', value: 25 },
    reward: { type: 'title', value: 'Gamer' },
    icon: '🕹️',
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'Spiele 100 verschiedene Lernspiele',
    category: 'player',
    requirement: { type: 'games_played', value: 100 },
    reward: { type: 'title', value: 'Veteran' },
    icon: '🏅',
  },
  {
    id: 'legend',
    name: 'Legende',
    description: 'Spiele 500 verschiedene Lernspiele',
    category: 'player',
    requirement: { type: 'games_played', value: 500 },
    reward: { type: 'title', value: 'Legende' },
    icon: '🌟',
  },
  // Spiele abschliessen
  {
    id: 'finisher',
    name: 'Abschliesser',
    description: 'Schliesse 5 Spiele erfolgreich ab',
    category: 'player',
    requirement: { type: 'games_completed', value: 5 },
    reward: { type: 'title', value: 'Abschliesser' },
    icon: '✅',
  },
  {
    id: 'completionist',
    name: 'Perfektionist',
    description: 'Schliesse 50 Spiele erfolgreich ab',
    category: 'player',
    requirement: { type: 'games_completed', value: 50 },
    reward: { type: 'title', value: 'Perfektionist' },
    icon: '💯',
  },
  // Streaks
  {
    id: 'daily-3',
    name: 'Drei-Tage-Serie',
    description: 'Spiele 3 Tage hintereinander',
    category: 'player',
    requirement: { type: 'daily_streak', value: 3 },
    reward: { type: 'title', value: 'Fleissig' },
    icon: '🔥',
  },
  {
    id: 'daily-7',
    name: 'Wochen-Krieger',
    description: 'Spiele 7 Tage hintereinander',
    category: 'player',
    requirement: { type: 'daily_streak', value: 7 },
    reward: { type: 'title', value: 'Wochen-Krieger' },
    icon: '⚔️',
  },
  {
    id: 'daily-30',
    name: 'Monats-Champion',
    description: 'Spiele 30 Tage hintereinander',
    category: 'player',
    requirement: { type: 'daily_streak', value: 30 },
    reward: { type: 'title', value: 'Champion' },
    icon: '🏆',
  },
  // Likes vergeben
  {
    id: 'first-like',
    name: 'Erster Daumen',
    description: 'Bewerte dein erstes Spiel',
    category: 'player',
    requirement: { type: 'likes_given', value: 1 },
    reward: { type: 'title', value: 'Kritiker' },
    icon: '👍',
  },
  {
    id: 'reviewer',
    name: 'Rezensent',
    description: 'Bewerte 25 Spiele',
    category: 'player',
    requirement: { type: 'likes_given', value: 25 },
    reward: { type: 'title', value: 'Rezensent' },
    icon: '📝',
  },
  // Zeit
  {
    id: 'time-1h',
    name: 'Stunden-Spieler',
    description: 'Verbringe insgesamt 1 Stunde mit Lernspielen',
    category: 'player',
    requirement: { type: 'total_playtime_minutes', value: 60 },
    reward: { type: 'title', value: 'Zeitspieler' },
    icon: '⏱️',
  },
  {
    id: 'time-10h',
    name: 'Zehn-Stunden-Meister',
    description: 'Verbringe insgesamt 10 Stunden mit Lernspielen',
    category: 'player',
    requirement: { type: 'total_playtime_minutes', value: 600 },
    reward: { type: 'title', value: 'Marathon-Spieler' },
    icon: '⌛',
  },
  {
    id: 'time-100h',
    name: 'Hundert-Stunden-Legende',
    description: 'Verbringe insgesamt 100 Stunden mit Lernspielen',
    category: 'player',
    requirement: { type: 'total_playtime_minutes', value: 6000 },
    reward: { type: 'title', value: 'Unaufhaltsam' },
    icon: '🕰️',
  },
]
```

### Kategorie 2: Sozial (Social) - 15 Achievements

```javascript
const SOCIAL_ACHIEVEMENTS = [
  // Follows
  {
    id: 'connected',
    name: 'Vernetzt',
    description: 'Folge 5 Creatorn',
    category: 'social',
    requirement: { type: 'following_count', value: 5 },
    reward: { type: 'title', value: 'Vernetzt' },
    icon: '🔗',
  },
  {
    id: 'super-fan',
    name: 'Super-Fan',
    description: 'Folge 25 Creatorn',
    category: 'social',
    requirement: { type: 'following_count', value: 25 },
    reward: { type: 'title', value: 'Super-Fan' },
    icon: '⭐',
  },
  // Follower haben
  {
    id: 'noticed',
    name: 'Bemerkt',
    description: 'Erhalte deinen ersten Follower',
    category: 'social',
    requirement: { type: 'followers_count', value: 1 },
    reward: { type: 'title', value: 'Bemerkt' },
    icon: '👁️',
  },
  {
    id: 'popular',
    name: 'Beliebt',
    description: 'Erhalte 10 Follower',
    category: 'social',
    requirement: { type: 'followers_count', value: 10 },
    reward: { type: 'title', value: 'Beliebt' },
    icon: '🌟',
  },
  {
    id: 'influencer',
    name: 'Influencer',
    description: 'Erhalte 50 Follower',
    category: 'social',
    requirement: { type: 'followers_count', value: 50 },
    reward: { type: 'title', value: 'Influencer' },
    icon: '📢',
  },
  {
    id: 'celebrity',
    name: 'Beruehmtheit',
    description: 'Erhalte 200 Follower',
    category: 'social',
    requirement: { type: 'followers_count', value: 200 },
    reward: { type: 'title', value: 'Beruehmtheit' },
    icon: '🎬',
  },
  {
    id: 'superstar',
    name: 'Superstar',
    description: 'Erhalte 1000 Follower',
    category: 'social',
    requirement: { type: 'followers_count', value: 1000 },
    reward: { type: 'title', value: 'Superstar' },
    icon: '💫',
  },
  // Freunde
  {
    id: 'first-friend',
    name: 'Erster Freund',
    description: 'Fuege deinen ersten Freund hinzu',
    category: 'social',
    requirement: { type: 'friends_count', value: 1 },
    reward: { type: 'title', value: 'Freundlich' },
    icon: '🤝',
  },
  {
    id: 'social-butterfly',
    name: 'Sozialer Schmetterling',
    description: 'Habe 10 Freunde',
    category: 'social',
    requirement: { type: 'friends_count', value: 10 },
    reward: { type: 'title', value: 'Gesellig' },
    icon: '🦋',
  },
  {
    id: 'party-animal',
    name: 'Party-Tier',
    description: 'Habe 50 Freunde',
    category: 'social',
    requirement: { type: 'friends_count', value: 50 },
    reward: { type: 'title', value: 'Party-Tier' },
    icon: '🎉',
  },
  {
    id: 'network-king',
    name: 'Netzwerk-Koenig',
    description: 'Habe 100 Freunde',
    category: 'social',
    requirement: { type: 'friends_count', value: 100 },
    reward: { type: 'title', value: 'Netzwerk-Koenig' },
    icon: '👑',
  },
  // Profil
  {
    id: 'avatar-creator',
    name: 'Stylisch',
    description: 'Passe deinen Avatar zum ersten Mal an',
    category: 'social',
    requirement: { type: 'avatar_customized', value: 1 },
    reward: { type: 'title', value: 'Stylisch' },
    icon: '🎭',
  },
  {
    id: 'profile-complete',
    name: 'Vollstaendig',
    description: 'Fuelle alle Profilfelder aus',
    category: 'social',
    requirement: { type: 'profile_complete', value: 1 },
    reward: { type: 'title', value: 'Identitaet' },
    icon: '📋',
  },
  // Events
  {
    id: 'event-first',
    name: 'Event-Teilnehmer',
    description: 'Nimm an deinem ersten Event teil',
    category: 'social',
    requirement: { type: 'events_participated', value: 1 },
    reward: { type: 'title', value: 'Teilnehmer' },
    icon: '📅',
  },
  {
    id: 'event-master',
    name: 'Event-Meister',
    description: 'Schliesse 10 Events erfolgreich ab',
    category: 'social',
    requirement: { type: 'events_completed', value: 10 },
    reward: { type: 'title', value: 'Event-Meister' },
    icon: '🏅',
  },
]
```

### Kategorie 3: Faecher (Subject) - 20 Achievements

```javascript
const SUBJECT_ACHIEVEMENTS = [
  // Mathe
  {
    id: 'mathe-beginner',
    name: 'Zahlen-Freund',
    description: 'Schliesse 5 Mathe-Spiele ab',
    category: 'subject',
    requirement: { type: 'category_games_completed', value: 5, category: 'mathe' },
    reward: { type: 'title', value: 'Zahlen-Freund' },
    icon: '🔢',
  },
  {
    id: 'mathe-pro',
    name: 'Mathe-Profi',
    description: 'Schliesse 25 Mathe-Spiele ab',
    category: 'subject',
    requirement: { type: 'category_games_completed', value: 25, category: 'mathe' },
    reward: { type: 'title', value: 'Mathe-Profi' },
    icon: '📐',
  },
  {
    id: 'mathe-genius',
    name: 'Mathe-Genie',
    description: 'Schliesse 10 Mathe-Spiele mit voller Punktzahl ab',
    category: 'subject',
    requirement: { type: 'category_perfect_scores', value: 10, category: 'mathe' },
    reward: { type: 'title', value: 'Mathe-Genie' },
    icon: '🧮',
  },
  // Physik
  {
    id: 'physik-beginner',
    name: 'Physik-Entdecker',
    description: 'Schliesse 5 Physik-Spiele ab',
    category: 'subject',
    requirement: { type: 'category_games_completed', value: 5, category: 'physik' },
    reward: { type: 'title', value: 'Physik-Entdecker' },
    icon: '⚛️',
  },
  {
    id: 'physik-pro',
    name: 'Physik-Profi',
    description: 'Schliesse 25 Physik-Spiele ab',
    category: 'subject',
    requirement: { type: 'category_games_completed', value: 25, category: 'physik' },
    reward: { type: 'title', value: 'Physik-Profi' },
    icon: '🔬',
  },
  {
    id: 'physik-genius',
    name: 'Einstein',
    description: 'Schliesse 10 Physik-Spiele mit voller Punktzahl ab',
    category: 'subject',
    requirement: { type: 'category_perfect_scores', value: 10, category: 'physik' },
    reward: { type: 'title', value: 'Einstein' },
    icon: '💡',
  },
  // Chemie
  {
    id: 'chemie-beginner',
    name: 'Labor-Assistent',
    description: 'Schliesse 5 Chemie-Spiele ab',
    category: 'subject',
    requirement: { type: 'category_games_completed', value: 5, category: 'chemie' },
    reward: { type: 'title', value: 'Labor-Assistent' },
    icon: '🧪',
  },
  {
    id: 'chemie-pro',
    name: 'Chemie-Profi',
    description: 'Schliesse 25 Chemie-Spiele ab',
    category: 'subject',
    requirement: { type: 'category_games_completed', value: 25, category: 'chemie' },
    reward: { type: 'title', value: 'Chemie-Profi' },
    icon: '⚗️',
  },
  // Biologie
  {
    id: 'bio-beginner',
    name: 'Natur-Freund',
    description: 'Schliesse 5 Biologie-Spiele ab',
    category: 'subject',
    requirement: { type: 'category_games_completed', value: 5, category: 'biologie' },
    reward: { type: 'title', value: 'Natur-Freund' },
    icon: '🌿',
  },
  {
    id: 'bio-pro',
    name: 'Biologie-Profi',
    description: 'Schliesse 25 Biologie-Spiele ab',
    category: 'subject',
    requirement: { type: 'category_games_completed', value: 25, category: 'biologie' },
    reward: { type: 'title', value: 'Biologie-Profi' },
    icon: '🧬',
  },
  // Geschichte
  {
    id: 'geschichte-beginner',
    name: 'Zeitreisender',
    description: 'Schliesse 5 Geschichts-Spiele ab',
    category: 'subject',
    requirement: { type: 'category_games_completed', value: 5, category: 'geschichte' },
    reward: { type: 'title', value: 'Zeitreisender' },
    icon: '📜',
  },
  {
    id: 'geschichte-pro',
    name: 'Historiker',
    description: 'Schliesse 25 Geschichts-Spiele ab',
    category: 'subject',
    requirement: { type: 'category_games_completed', value: 25, category: 'geschichte' },
    reward: { type: 'title', value: 'Historiker' },
    icon: '🏛️',
  },
  // Sprachen
  {
    id: 'sprachen-beginner',
    name: 'Sprachschueler',
    description: 'Schliesse 5 Sprach-Spiele ab',
    category: 'subject',
    requirement: { type: 'category_games_completed', value: 5, category: 'sprachen' },
    reward: { type: 'title', value: 'Sprachschueler' },
    icon: '🗣️',
  },
  {
    id: 'sprachen-pro',
    name: 'Polyglott',
    description: 'Schliesse 25 Sprach-Spiele ab',
    category: 'subject',
    requirement: { type: 'category_games_completed', value: 25, category: 'sprachen' },
    reward: { type: 'title', value: 'Polyglott' },
    icon: '🌍',
  },
  // Informatik
  {
    id: 'informatik-beginner',
    name: 'Code-Novize',
    description: 'Schliesse 5 Informatik-Spiele ab',
    category: 'subject',
    requirement: { type: 'category_games_completed', value: 5, category: 'informatik' },
    reward: { type: 'title', value: 'Code-Novize' },
    icon: '💻',
  },
  {
    id: 'informatik-pro',
    name: 'Hacker',
    description: 'Schliesse 25 Informatik-Spiele ab',
    category: 'subject',
    requirement: { type: 'category_games_completed', value: 25, category: 'informatik' },
    reward: { type: 'title', value: 'Hacker' },
    icon: '🖥️',
  },
  // Allgemeinwissen
  {
    id: 'allround-beginner',
    name: 'Wissbegierig',
    description: 'Schliesse Spiele aus 3 verschiedenen Fachgebieten ab',
    category: 'subject',
    requirement: { type: 'unique_categories_played', value: 3 },
    reward: { type: 'title', value: 'Wissbegierig' },
    icon: '📚',
  },
  {
    id: 'allround-pro',
    name: 'Allround-Talent',
    description: 'Schliesse Spiele aus 6 verschiedenen Fachgebieten ab',
    category: 'subject',
    requirement: { type: 'unique_categories_played', value: 6 },
    reward: { type: 'title', value: 'Allround-Talent' },
    icon: '🎓',
  },
  {
    id: 'allround-master',
    name: 'Universalgelehrter',
    description: 'Schliesse Spiele aus ALLEN Fachgebieten ab',
    category: 'subject',
    requirement: { type: 'unique_categories_played', value: 10 },
    reward: { type: 'title', value: 'Universalgelehrter' },
    icon: '🦉',
  },
  // Musik
  {
    id: 'musik-beginner',
    name: 'Melodie-Freund',
    description: 'Schliesse 5 Musik-Spiele ab',
    category: 'subject',
    requirement: { type: 'category_games_completed', value: 5, category: 'musik' },
    reward: { type: 'title', value: 'Melodie-Freund' },
    icon: '🎵',
  },
]
```

### Kategorie 4: Creator - 15 Achievements

```javascript
const CREATOR_ACHIEVEMENTS = [
  // Spiele erstellen
  {
    id: 'schoepfer',
    name: 'Schoepfer',
    description: 'Erstelle und veroeffentliche dein erstes Spiel',
    category: 'creator',
    requirement: { type: 'games_created', value: 1 },
    reward: { type: 'title', value: 'Schoepfer' },
    icon: '🔨',
  },
  {
    id: 'builder',
    name: 'Baumeister',
    description: 'Erstelle 5 Spiele',
    category: 'creator',
    requirement: { type: 'games_created', value: 5 },
    reward: { type: 'title', value: 'Baumeister' },
    icon: '🏗️',
  },
  {
    id: 'meisterschmied',
    name: 'Meisterschmied',
    description: 'Erstelle 10 Spiele',
    category: 'creator',
    requirement: { type: 'games_created', value: 10 },
    reward: { type: 'title', value: 'Meisterschmied' },
    icon: '⚒️',
  },
  {
    id: 'game-factory',
    name: 'Spiele-Fabrik',
    description: 'Erstelle 25 Spiele',
    category: 'creator',
    requirement: { type: 'games_created', value: 25 },
    reward: { type: 'title', value: 'Spiele-Fabrik' },
    icon: '🏭',
  },
  {
    id: 'game-empire',
    name: 'Spiele-Imperium',
    description: 'Erstelle 50 Spiele',
    category: 'creator',
    requirement: { type: 'games_created', value: 50 },
    reward: { type: 'title', value: 'Imperator' },
    icon: '👑',
  },
  // Likes auf eigene Spiele
  {
    id: 'first-like-received',
    name: 'Erster Fan',
    description: 'Erhalte den ersten Like auf eines deiner Spiele',
    category: 'creator',
    requirement: { type: 'total_likes_received', value: 1 },
    reward: { type: 'title', value: 'Geschaetzt' },
    icon: '❤️',
  },
  {
    id: 'crowd-pleaser',
    name: 'Publikumsliebling',
    description: 'Erhalte 100 Likes auf deine Spiele',
    category: 'creator',
    requirement: { type: 'total_likes_received', value: 100 },
    reward: { type: 'title', value: 'Publikumsliebling' },
    icon: '🥰',
  },
  {
    id: 'beloved-creator',
    name: 'Geliebter Creator',
    description: 'Erhalte 1000 Likes auf deine Spiele',
    category: 'creator',
    requirement: { type: 'total_likes_received', value: 1000 },
    reward: { type: 'title', value: 'Geliebter Creator' },
    icon: '💝',
  },
  // Spieler auf eigenen Spielen
  {
    id: 'first-player',
    name: 'Spielestart',
    description: 'Jemand spielt zum ersten Mal eines deiner Spiele',
    category: 'creator',
    requirement: { type: 'total_plays_received', value: 1 },
    reward: { type: 'title', value: 'Spielestarter' },
    icon: '🎯',
  },
  {
    id: 'popular-creator',
    name: 'Beliebter Creator',
    description: 'Deine Spiele wurden 500 Mal gespielt',
    category: 'creator',
    requirement: { type: 'total_plays_received', value: 500 },
    reward: { type: 'title', value: 'Beliebter Creator' },
    icon: '📊',
  },
  {
    id: 'viral-creator',
    name: 'Viral',
    description: 'Deine Spiele wurden 5000 Mal gespielt',
    category: 'creator',
    requirement: { type: 'total_plays_received', value: 5000 },
    reward: { type: 'title', value: 'Viral' },
    icon: '🚀',
  },
  // Qualitaet
  {
    id: 'quality-creator',
    name: 'Qualitaets-Creator',
    description: 'Habe ein Spiel mit 90%+ positiven Bewertungen (mind. 50 Bewertungen)',
    category: 'creator',
    requirement: { type: 'game_approval_rate', value: 90, minRatings: 50 },
    reward: { type: 'title', value: 'Qualitaets-Creator' },
    icon: '💎',
  },
  // Assets
  {
    id: 'marketplace-seller',
    name: 'Haendler',
    description: 'Verkaufe dein erstes Asset im Marketplace',
    category: 'creator',
    requirement: { type: 'assets_sold', value: 1 },
    reward: { type: 'title', value: 'Haendler' },
    icon: '🛒',
  },
  {
    id: 'marketplace-pro',
    name: 'Top-Verkaeufer',
    description: 'Verkaufe 25 Assets im Marketplace',
    category: 'creator',
    requirement: { type: 'assets_sold', value: 25 },
    reward: { type: 'title', value: 'Top-Verkaeufer' },
    icon: '💰',
  },
  // Premium
  {
    id: 'premium-member',
    name: 'Premium-Mitglied',
    description: 'Werde Premium-Mitglied',
    category: 'creator',
    requirement: { type: 'is_premium', value: 1 },
    reward: { type: 'title', value: 'Premium' },
    icon: '💎',
  },
]
```

### Zusammenfuehrung

```javascript
export const ALL_ACHIEVEMENTS = [
  ...PLAYER_ACHIEVEMENTS,
  ...SOCIAL_ACHIEVEMENTS,
  ...SUBJECT_ACHIEVEMENTS,
  ...CREATOR_ACHIEVEMENTS,
]

export const ACHIEVEMENT_CATEGORIES = [
  { id: 'player',  name: 'Spieler', icon: '🎮', count: PLAYER_ACHIEVEMENTS.length },
  { id: 'social',  name: 'Sozial',  icon: '👥', count: SOCIAL_ACHIEVEMENTS.length },
  { id: 'subject', name: 'Faecher', icon: '📚', count: SUBJECT_ACHIEVEMENTS.length },
  { id: 'creator', name: 'Creator', icon: '🔨', count: CREATOR_ACHIEVEMENTS.length },
]

export {
  PLAYER_ACHIEVEMENTS,
  SOCIAL_ACHIEVEMENTS,
  SUBJECT_ACHIEVEMENTS,
  CREATOR_ACHIEVEMENTS,
}
```

---

## Mock User-Progress Daten

```javascript
// Mock-Daten fuer den aktuellen User
export const MOCK_USER_PROGRESS = {
  games_played: 7,
  games_completed: 4,
  daily_streak: 2,
  likes_given: 3,
  total_playtime_minutes: 45,
  following_count: 3,
  followers_count: 1,
  friends_count: 2,
  avatar_customized: 1,
  profile_complete: 0,
  events_participated: 1,
  events_completed: 0,
  games_created: 0,
  total_likes_received: 0,
  total_plays_received: 0,
  assets_sold: 0,
  is_premium: 0,
  category_games_completed: {
    mathe: 3,
    physik: 1,
    chemie: 0,
    biologie: 0,
    geschichte: 0,
    sprachen: 0,
    informatik: 0,
    musik: 0,
  },
  category_perfect_scores: {
    mathe: 1,
    physik: 0,
  },
  unique_categories_played: 2,
}
```

---

## Firestore-Schema fuer Achievement-Fortschritt

```javascript
// Dokument: users/{uid}
{
  // ...andere User-Felder...
  achievementProgress: {
    games_played: 7,
    games_completed: 4,
    daily_streak: 2,
    // ... alle Progress-Felder wie in MOCK_USER_PROGRESS
  },
  unlockedAchievements: ['first-steps', 'first-like', 'avatar-creator'],
  activeTitle: 'Anfaenger',  // Der aktuell angezeigte Titel
}
```

---

## Datei 1: `src/pages/Achievements.jsx`

Die Achievements-Seite mit Kategorie-Tabs.

**State:**

```jsx
const [activeCategory, setActiveCategory] = useState('player')
const [userProgress, setUserProgress] = useState(MOCK_USER_PROGRESS)
const [unlockedAchievements, setUnlockedAchievements] = useState(['first-steps', 'first-like', 'avatar-creator'])
const [activeTitle, setActiveTitle] = useState('Anfaenger')
const [showTitleModal, setShowTitleModal] = useState(false)
```

### Achievement-Status berechnen

```javascript
function getAchievementStatus(achievement, userProgress, unlockedAchievements) {
  // Bereits freigeschaltet?
  if (unlockedAchievements.includes(achievement.id)) {
    return { status: 'unlocked', current: achievement.requirement.value, percent: 100 }
  }

  // Fortschritt berechnen
  const req = achievement.requirement
  let current = 0

  switch (req.type) {
    case 'games_played':
      current = userProgress.games_played || 0
      break
    case 'games_completed':
      current = userProgress.games_completed || 0
      break
    case 'daily_streak':
      current = userProgress.daily_streak || 0
      break
    case 'following_count':
      current = userProgress.following_count || 0
      break
    case 'followers_count':
      current = userProgress.followers_count || 0
      break
    case 'friends_count':
      current = userProgress.friends_count || 0
      break
    case 'category_games_completed':
      current = userProgress.category_games_completed?.[req.category] || 0
      break
    case 'category_perfect_scores':
      current = userProgress.category_perfect_scores?.[req.category] || 0
      break
    case 'unique_categories_played':
      current = userProgress.unique_categories_played || 0
      break
    case 'games_created':
      current = userProgress.games_created || 0
      break
    case 'total_likes_received':
      current = userProgress.total_likes_received || 0
      break
    case 'total_plays_received':
      current = userProgress.total_plays_received || 0
      break
    // ... weitere Typen
    default:
      current = 0
  }

  const percent = Math.min(100, Math.round((current / req.value) * 100))

  return {
    status: percent >= 100 ? 'completable' : 'locked',
    current: Math.min(current, req.value),
    percent,
  }
}
```

---

## AchievementCard Sub-Komponente

```jsx
function AchievementCard({ achievement, status, current, percent }) {
  const isUnlocked = status === 'unlocked'
  const isCompletable = status === 'completable'

  return (
    <div className={`bg-bg-card rounded-xl p-5 border transition-all
      ${isUnlocked
        ? 'border-success/30 bg-success/5'
        : isCompletable
          ? 'border-accent/30 bg-accent/5'
          : 'border-gray-700 opacity-75'
      }`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`text-3xl flex-shrink-0
          ${!isUnlocked && !isCompletable ? 'grayscale opacity-50' : ''}`}>
          {isUnlocked ? '✅' : achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-text-primary">{achievement.name}</h3>
            <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded-full flex-shrink-0">
              Titel: "{achievement.reward.value}"
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">{achievement.description}</p>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>{current}/{achievement.requirement.value}</span>
              <span>{percent}%</span>
            </div>
            <div className="w-full bg-bg-hover rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500
                  ${isUnlocked ? 'bg-success' : isCompletable ? 'bg-accent' : 'bg-primary'}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## Datei 2: `src/components/achievements/TitleSelectModal.jsx`

Modal zum Auswaehlen des aktiven Titels.

```jsx
export default function TitleSelectModal({ isOpen, onClose, unlockedAchievements, activeTitle, onSelect }) {
  if (!isOpen) return null

  // Nur freigeschaltete Achievements mit Titel-Belohnung zeigen
  const availableTitles = ALL_ACHIEVEMENTS
    .filter(a => unlockedAchievements.includes(a.id) && a.reward.type === 'title')
    .map(a => ({
      achievementId: a.id,
      achievementName: a.name,
      title: a.reward.value,
      icon: a.icon,
    }))

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
         onClick={onClose}>
      <div className="bg-bg-secondary rounded-xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto"
           onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Titel auswaehlen</h2>
        <p className="text-text-muted text-sm mb-6">
          Waehle einen Titel der unter deinem Namen angezeigt wird.
        </p>

        {/* Kein Titel Option */}
        <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-hover cursor-pointer mb-2">
          <input
            type="radio"
            name="title"
            checked={!activeTitle}
            onChange={() => onSelect(null)}
            className="accent-accent"
          />
          <span className="text-text-secondary">Kein Titel</span>
        </label>

        {/* Verfuegbare Titel */}
        {availableTitles.map(({ achievementId, achievementName, title, icon }) => (
          <label
            key={achievementId}
            className={`flex items-center gap-3 p-3 rounded-lg hover:bg-bg-hover cursor-pointer mb-2
              ${activeTitle === title ? 'bg-accent/10 border border-accent/30' : ''}`}
          >
            <input
              type="radio"
              name="title"
              checked={activeTitle === title}
              onChange={() => onSelect(title)}
              className="accent-accent"
            />
            <span className="text-lg">{icon}</span>
            <div>
              <p className="text-text-primary font-medium">"{title}"</p>
              <p className="text-xs text-text-muted">aus: {achievementName}</p>
            </div>
          </label>
        ))}

        {availableTitles.length === 0 && (
          <p className="text-text-muted text-center py-8">
            Du hast noch keine Titel freigeschaltet. Schliesse Achievements ab um Titel zu erhalten!
          </p>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 bg-bg-hover hover:bg-gray-500 text-text-primary py-2 rounded-lg
                     font-medium transition-colors"
        >
          Schliessen
        </button>
      </div>
    </div>
  )
}
```

---

## Testen

1. **Seite aufrufen** - Navigiere zu `/achievements`, Seite laedt ohne Fehler
2. **Kategorie-Tabs** - 4 Tabs (Spieler, Sozial, Faecher, Creator) wechseln korrekt
3. **Achievement-Anzahl** - Jeder Tab zeigt die Anzahl der Achievements
4. **Freigeschaltete Achievements** - Haben gruenen Rahmen und Haekchen
5. **Gesperrte Achievements** - Sind ausgegraut/gedimmt
6. **Fortschrittsbalken** - Zeigen korrekten Prozentsatz basierend auf User-Progress
7. **Titel-Belohnung** - Jedes Achievement zeigt den Titel als Badge
8. **Titel-Modal oeffnen** - Klick auf "Titel auswaehlen" oeffnet Modal
9. **Titel waehlen** - Radio-Buttons funktionieren, Auswahl wird uebernommen
10. **Kein Titel** - Option "Kein Titel" ist verfuegbar
11. **60+ Achievements** - Mindestens 60 Achievements sind definiert
12. **Keine MindCoins** - KEIN Achievement gibt MindCoins als Belohnung

---

## Checkliste

- [ ] Achievement-Definitionen in `src/data/achievementDefinitions.js` mit 60+ Eintraegen
- [ ] 4 Kategorien: Player (15), Social (15), Subject (20), Creator (15)
- [ ] Jedes Achievement hat: id, name, description, category, requirement, reward, icon
- [ ] Achievements-Seite unter `/achievements` mit Kategorie-Tabs
- [ ] AchievementCard zeigt Name, Beschreibung, Icon, Fortschrittsbalken, Titel-Belohnung
- [ ] Freigeschaltete Achievements visuell hervorgehoben (gruen)
- [ ] Gesperrte Achievements ausgegraut
- [ ] Fortschrittsbalken berechnet sich korrekt aus User-Progress
- [ ] TitleSelectModal mit Radio-Buttons zur Titel-Auswahl
- [ ] "Kein Titel" Option im Modal
- [ ] Aktiver Titel wird oben auf der Seite angezeigt
- [ ] Mock User-Progress Daten fuer die Vorschau
- [ ] **KEINE MindCoins als Achievement-Belohnung** (nur Titel)
- [ ] Requirement-Typen: games_played, games_completed, daily_streak, following_count, followers_count, friends_count, category_games_completed, games_created, etc.
- [ ] Seite ist nur fuer eingeloggte User zugaenglich

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/data/achievementDefinitions.js` | 60+ Achievement-Definitionen in 4 Kategorien |
| `src/pages/Achievements.jsx` | Achievements-Seite mit Tabs, Cards und Progress |
| `src/components/achievements/TitleSelectModal.jsx` | Modal zur Auswahl des aktiven Titels |
