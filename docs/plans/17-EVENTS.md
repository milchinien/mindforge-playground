# 17 - Events & Challenges

## Was wird hier gemacht?

In diesem Schritt baust du die Events-Seite unter `/events`. Events sind zeitlich begrenzte Challenges bei denen User MindCoins und andere Belohnungen verdienen koennen. Die Seite zeigt aktive, kommende und vergangene Events mit Countdown-Timern, Fortschrittsbalken und LIVE-Badges.

---

## Voraussetzungen

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein
- Datei `03-AUTHENTICATION.md` muss abgeschlossen sein
- **WICHTIG:** Datei `20-MINDCOINS-PREMIUM.md` sollte vorher abgeschlossen sein (Events vergeben MindCoins als Belohnung)
- Firebase Firestore ist eingerichtet

---

## Uebersicht der Seite

```
┌──────────────────────────────────────────────────────────────────┐
│  EVENTS (/events)                                                 │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  🔴 LIVE  Mathe-Marathon                                    │ │
│  │                                                              │ │
│  │  Loesung so viele Mathe-Aufgaben wie moeglich!               │ │
│  │                                                              │ │
│  │  Endet in: 02:14:33:07                                       │ │
│  │                                                              │ │
│  │  Fortschritt: ████████████░░░░░░░░░░ 60% (30/50 Aufgaben)  │ │
│  │                                                              │ │
│  │  Belohnung: 💰 200 MindCoins                                │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ── Kommende Events ──────────────────────────────────────────── │
│                                                                    │
│  ┌────────────────────────────────────┐                          │
│  │  ⏳ Physik-Challenge               │                          │
│  │  Startet in: 05:12:00:00           │                          │
│  │  Belohnung: 💰 300 MindCoins       │                          │
│  └────────────────────────────────────┘                          │
│                                                                    │
│  ── Vergangene Events ────────────────────────────────────────── │
│                                                                    │
│  ┌────────────────────────────────────┐                          │
│  │  ✅ Neujahrs-Quiz                  │                          │
│  │  Beendet am 15.01.2025             │                          │
│  │  Dein Ergebnis: 45/50 Aufgaben     │                          │
│  │  Belohnung erhalten: 💰 150 MC     │                          │
│  └────────────────────────────────────┘                          │
└──────────────────────────────────────────────────────────────────┘
```

---

## Event-Datenstruktur

### Firestore Collection: `events`

```javascript
// Dokument-ID: automatisch generiert oder sprechende ID (z.B. "mathe-marathon-2025")
{
  id: 'mathe-marathon-2025',
  title: 'Mathe-Marathon',
  description: 'Loese so viele Mathe-Aufgaben wie moeglich in einer Woche! Jedes geloeste Spiel zaehlt.',
  startDate: Timestamp,          // Wann startet das Event?
  endDate: Timestamp,            // Wann endet das Event?
  status: 'active',              // 'upcoming' | 'active' | 'ended'
  reward: {
    type: 'mindcoins',           // 'mindcoins' | 'avatar_item' | 'title'
    amount: 200,                  // MindCoins-Menge (oder Item-ID bei avatar_item)
    description: '200 MindCoins', // Anzeige-Text
  },
  requirements: {
    type: 'play_games',           // 'play_games' | 'complete_games' | 'score_points' | 'play_category'
    target: 50,                   // Ziel-Wert
    category: 'mathe',            // Optional: Kategorie-Filter
    description: '50 Mathe-Spiele abschliessen',
  },
  imageUrl: null,                 // Optional: Event-Banner
  participants: 1247,             // Anzahl Teilnehmer (Counter)
}
```

### User-Event-Fortschritt (in `users/{uid}`)

```javascript
// Dokument: users/{uid}
{
  // ...andere User-Felder...
  eventProgress: {
    'mathe-marathon-2025': {
      current: 30,           // Aktueller Fortschritt
      target: 50,            // Ziel-Wert (Kopie aus Event)
      completed: false,      // Ziel erreicht?
      rewardClaimed: false,  // Belohnung abgeholt?
      joinedAt: Timestamp,   // Wann beigetreten?
    }
  }
}
```

---

## Mock-Daten

```javascript
// src/data/mockEvents.js

export const MOCK_EVENTS = [
  {
    id: 'mathe-marathon-2025',
    title: 'Mathe-Marathon',
    description: 'Loese so viele Mathe-Aufgaben wie moeglich in einer Woche! Jedes abgeschlossene Mathe-Spiel zaehlt als ein Punkt. Schaffst du alle 50?',
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),  // vor 5 Tagen gestartet
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),    // in 2 Tagen
    status: 'active',
    reward: {
      type: 'mindcoins',
      amount: 200,
      description: '200 MindCoins',
    },
    requirements: {
      type: 'complete_games',
      target: 50,
      category: 'mathe',
      description: '50 Mathe-Spiele abschliessen',
    },
    participants: 1247,
    userProgress: {       // Mock fuer aktuellen User
      current: 30,
      target: 50,
      completed: false,
      rewardClaimed: false,
    },
  },
  {
    id: 'physik-challenge-2025',
    title: 'Physik-Challenge',
    description: 'Teste dein Wissen in Physik! Spiele 20 verschiedene Physik-Simulationen und sammle Punkte. Die besten Spieler erhalten Bonus-MindCoins.',
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),  // in 5 Tagen
    endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),   // in 12 Tagen
    status: 'upcoming',
    reward: {
      type: 'mindcoins',
      amount: 300,
      description: '300 MindCoins',
    },
    requirements: {
      type: 'play_games',
      target: 20,
      category: 'physik',
      description: '20 Physik-Spiele spielen',
    },
    participants: 0,
    userProgress: null,
  },
  {
    id: 'neujahrs-quiz-2025',
    title: 'Neujahrs-Quiz Extravaganza',
    description: 'Das grosse Neujahrs-Quiz! Beantworte Fragen aus allen Fachgebieten und starte das neue Jahr mit einem Wissens-Boost.',
    startDate: new Date('2025-01-01T00:00:00'),
    endDate: new Date('2025-01-15T23:59:59'),
    status: 'ended',
    reward: {
      type: 'mindcoins',
      amount: 150,
      description: '150 MindCoins',
    },
    requirements: {
      type: 'complete_games',
      target: 50,
      category: null,
      description: '50 beliebige Spiele abschliessen',
    },
    participants: 3891,
    userProgress: {
      current: 45,
      target: 50,
      completed: false,
      rewardClaimed: false,
    },
  },
]
```

---

## Datei 1: `src/hooks/useCountdown.js`

Custom Hook fuer den Countdown-Timer.

```javascript
import { useState, useEffect } from 'react'

/**
 * Countdown-Hook der jede Sekunde aktualisiert
 * @param {Date} targetDate - Zieldatum
 * @returns {{ days, hours, minutes, seconds, isExpired, formatted }}
 */
export function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000) // Jede Sekunde aktualisieren

    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}

function calculateTimeLeft(targetDate) {
  const now = new Date()
  const target = new Date(targetDate)
  const diff = target - now

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      formatted: '00:00:00:00',
    }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  const pad = (n) => String(n).padStart(2, '0')
  const formatted = `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`

  return { days, hours, minutes, seconds, isExpired: false, formatted }
}
```

---

## Datei 2: `src/components/events/EventCard.jsx`

Die EventCard-Komponente fuer die Anzeige einzelner Events.

**Props:**
- `event` (object) - Das Event-Objekt
- `variant` (string) - 'active' | 'upcoming' | 'ended'

### Aktives Event (variant="active")

```jsx
function ActiveEventCard({ event }) {
  const countdown = useCountdown(event.endDate)
  const progressPercent = event.userProgress
    ? Math.round((event.userProgress.current / event.userProgress.target) * 100)
    : 0

  return (
    <div className="bg-bg-card rounded-xl p-6 border border-accent/30 relative overflow-hidden">
      {/* LIVE Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center gap-1.5 bg-error/20 text-error px-3 py-1
                         rounded-full text-xs font-bold uppercase tracking-wider">
          <span className="w-2 h-2 bg-error rounded-full animate-pulse" />
          LIVE
        </span>
        <span className="text-text-muted text-sm">{event.participants} Teilnehmer</span>
      </div>

      {/* Titel & Beschreibung */}
      <h2 className="text-2xl font-bold text-text-primary mb-2">{event.title}</h2>
      <p className="text-text-secondary mb-4">{event.description}</p>

      {/* Countdown */}
      <div className="mb-4">
        <p className="text-sm text-text-muted mb-1">Endet in:</p>
        <p className="text-3xl font-mono font-bold text-accent">{countdown.formatted}</p>
        <p className="text-xs text-text-muted mt-1">
          {countdown.days} Tage, {countdown.hours} Stunden, {countdown.minutes} Minuten
        </p>
      </div>

      {/* Fortschritt */}
      {event.userProgress && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-secondary">Fortschritt</span>
            <span className="text-text-primary font-medium">
              {event.userProgress.current}/{event.userProgress.target}
              ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-bg-hover rounded-full h-3">
            <div
              className="bg-accent h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Belohnung */}
      <div className="flex items-center gap-2 bg-bg-hover/50 rounded-lg px-4 py-3">
        <span className="text-xl">💰</span>
        <div>
          <p className="text-sm text-text-muted">Belohnung</p>
          <p className="text-text-primary font-semibold">{event.reward.description}</p>
        </div>
      </div>
    </div>
  )
}
```

### Kommendes Event (variant="upcoming")

```jsx
function UpcomingEventCard({ event }) {
  const countdown = useCountdown(event.startDate)

  return (
    <div className="bg-bg-card rounded-xl p-5 border border-gray-700 hover:border-gray-600
                    transition-colors">
      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-warning/20 text-warning px-3 py-1 rounded-full text-xs font-bold">
          BALD
        </span>
      </div>

      <h3 className="text-lg font-bold text-text-primary mb-1">{event.title}</h3>
      <p className="text-text-secondary text-sm mb-3 line-clamp-2">{event.description}</p>

      {/* Countdown bis Start */}
      <p className="text-sm text-text-muted mb-1">Startet in:</p>
      <p className="text-xl font-mono font-bold text-warning">{countdown.formatted}</p>

      {/* Belohnung */}
      <div className="flex items-center gap-2 mt-3 text-sm">
        <span>💰</span>
        <span className="text-text-secondary">{event.reward.description}</span>
      </div>
    </div>
  )
}
```

### Vergangenes Event (variant="ended")

```jsx
function EndedEventCard({ event }) {
  const endDateFormatted = new Date(event.endDate).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return (
    <div className="bg-bg-card rounded-xl p-5 border border-gray-700 opacity-75">
      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-gray-600/30 text-text-muted px-3 py-1 rounded-full text-xs font-bold">
          BEENDET
        </span>
      </div>

      <h3 className="text-lg font-bold text-text-primary mb-1">{event.title}</h3>
      <p className="text-text-muted text-sm mb-3">Beendet am {endDateFormatted}</p>

      {/* User-Ergebnis */}
      {event.userProgress && (
        <div className="mb-3">
          <p className="text-sm text-text-secondary">
            Dein Ergebnis: {event.userProgress.current}/{event.userProgress.target} Aufgaben
          </p>
          <div className="w-full bg-bg-hover rounded-full h-2 mt-1">
            <div
              className="bg-text-muted h-2 rounded-full"
              style={{ width: `${Math.round((event.userProgress.current / event.userProgress.target) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Belohnung */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <span>💰</span>
        <span>{event.reward.description}</span>
        {event.userProgress?.rewardClaimed && (
          <span className="text-success ml-2">✓ Erhalten</span>
        )}
      </div>
    </div>
  )
}
```

---

## Datei 3: `src/pages/Events.jsx`

Die Events-Seite die alle Events kategorisiert anzeigt.

```jsx
import { useState, useEffect } from 'react'
import { MOCK_EVENTS } from '../data/mockEvents'

export default function Events() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    // Spaeter: Firestore-Abfrage
    setEvents(MOCK_EVENTS)
  }, [])

  const activeEvents = events.filter(e => e.status === 'active')
  const upcomingEvents = events.filter(e => e.status === 'upcoming')
  const endedEvents = events.filter(e => e.status === 'ended')

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Events & Challenges</h1>

      {/* Aktive Events */}
      {activeEvents.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-error rounded-full animate-pulse" />
            Aktive Events
          </h2>
          <div className="space-y-4">
            {activeEvents.map(event => (
              <ActiveEventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Kommende Events */}
      {upcomingEvents.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Kommende Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map(event => (
              <UpcomingEventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Vergangene Events */}
      {endedEvents.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-text-muted mb-4">
            Vergangene Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {endedEvents.map(event => (
              <EndedEventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Leerer Zustand */}
      {events.length === 0 && (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">📅</span>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Keine Events verfuegbar
          </h3>
          <p className="text-text-muted">
            Momentan gibt es keine Events. Schau bald wieder vorbei!
          </p>
        </div>
      )}
    </div>
  )
}
```

---

## LIVE Badge - CSS Animation

Die pulsierende rote Animation fuer aktive Events:

```css
/* In globals.css oder direkt als Tailwind-Klasse */
/* animate-pulse ist bereits in Tailwind enthalten */

/* Fuer einen staerkeren Puls-Effekt (optional): */
@keyframes live-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.animate-live-pulse {
  animation: live-pulse 1.5s ease-in-out infinite;
}
```

---

## Datenfluss

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Events-Seite│────>│  Mock-Daten  │────>│  Events nach │
│  laedt       │     │  oder        │     │  Status      │
│              │     │  Firestore   │     │  gruppieren  │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                            ┌───────────────────┼───────────────────┐
                            v                   v                   v
                     ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
                     │  Active      │    │  Upcoming    │    │  Ended       │
                     │  EventCards  │    │  EventCards  │    │  EventCards  │
                     │  (LIVE +     │    │  (Countdown  │    │  (Ergebnis)  │
                     │   Countdown  │    │   bis Start) │    │              │
                     │   + Progress)│    │              │    │              │
                     └──────────────┘    └──────────────┘    └──────────────┘
                            │
                            │ (jede Sekunde)
                            v
                     ┌──────────────┐
                     │  useCountdown│
                     │  Hook        │
                     │  aktualisiert│
                     └──────────────┘
```

---

## Testen

1. **Seite aufrufen** - Navigiere zu `/events`, Seite laedt ohne Fehler
2. **Aktive Events** - Mindestens 1 aktives Event mit LIVE-Badge sichtbar
3. **LIVE-Badge pulsiert** - Rotes LIVE-Badge hat pulsierende Animation
4. **Countdown laeuft** - Countdown aktualisiert sich jede Sekunde
5. **Fortschrittsbalken** - Zeigt korrekten Prozentsatz (30/50 = 60%)
6. **Belohnung angezeigt** - MindCoins-Belohnung ist sichtbar
7. **Kommende Events** - Events mit Status "upcoming" in eigener Sektion
8. **Vergangene Events** - Events mit Status "ended" in eigener Sektion, ausgegraut
9. **Responsive** - Layout passt sich an (1 Spalte Mobile, 2 Spalten Desktop fuer upcoming/ended)
10. **Leerer Zustand** - Wenn keine Events: passende Meldung angezeigt

---

## Checkliste

- [ ] Events-Seite unter `/events` ist erreichbar
- [ ] Events werden nach Status gruppiert: Aktiv, Kommend, Vergangen
- [ ] ActiveEventCard zeigt LIVE-Badge mit pulsierender Animation
- [ ] Countdown-Timer aktualisiert sich jede Sekunde
- [ ] useCountdown Hook gibt Tage, Stunden, Minuten, Sekunden zurueck
- [ ] Fortschrittsbalken zeigt User-Fortschritt mit Prozentangabe
- [ ] Belohnung (MindCoins) wird auf jeder EventCard angezeigt
- [ ] UpcomingEventCard zeigt Countdown bis zum Start
- [ ] EndedEventCard zeigt Enddatum und User-Ergebnis
- [ ] Status-Badges: LIVE (rot pulsierend), BALD (gelb), BEENDET (grau)
- [ ] Teilnehmer-Anzahl wird bei aktiven Events angezeigt
- [ ] Mock-Daten: 3 Events (1 aktiv, 1 kommend, 1 vergangen)
- [ ] Event-Datenstruktur ist vollstaendig definiert (id, title, dates, reward, requirements)
- [ ] Responsive Grid-Layout
- [ ] Leerer Zustand wenn keine Events vorhanden

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/pages/Events.jsx` | Events-Seite mit kategorisierten Event-Listen |
| `src/components/events/EventCard.jsx` | Event-Karten fuer aktive, kommende und vergangene Events |
| `src/hooks/useCountdown.js` | Countdown-Timer Hook (aktualisiert jede Sekunde) |
| `src/data/mockEvents.js` | Mock-Daten fuer 3 Events |
