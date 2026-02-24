# Plan 26-02: Performance & Optimierung

> **Priorität:** Hoch (Kurzfristig, 1-4 Wochen)
> **Status:** Implementiert
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- Lazy Loading für alle 18 Pages (gut)
- Manuelle Vite-Chunks (React, Router, Firebase, Monaco, dnd-kit)
- ~~`useAIChat.js` ist 1.100+ Zeilen~~ → Patterns in `aiResponsePatterns.js` extrahiert (Hook jetzt ~150 Zeilen)
- ~~GameCard, FriendCard, AssetCard ohne React.memo~~ → Alle mit `React.memo()` gewrappt
- Keine Virtualisierung für lange Listen (noch offen)
- ~~Keine Bundle-Analyse~~ → `rollup-plugin-visualizer` integriert

---

## Vorschlag 2.1: Komponenten-Memoization
- [x] **A) Kritische List-Items wrappen (Empfohlen)** — GameCard, FriendCard, AssetCard mit React.memo() wrappen
- [ ] **B) Alles memoizen** — Alle Komponenten die in Listen gerendert werden mit React.memo()
- [ ] **C) useMemo für teure Berechnungen** — Nur pageTitle, Sortierungen und Filter memoizen, keine Komponenten
- [ ] **D) Profiling zuerst** — React DevTools Profiler einsetzen, nur nachweislich langsame Stellen optimieren

## Vorschlag 2.2: useAIChat.js aufteilen
- [x] **A) Response-Patterns extrahieren (Empfohlen)** — 14 Pattern-Objekte + 3 Smart-Responses in separate `aiResponsePatterns.js` ausgelagert
- [ ] **B) Komplettes Refactoring** — Hook in mehrere kleinere Hooks aufteilen (useAIMessages, useAIPatterns, useAIState)
- [ ] **C) Lazy Loading** — AI-Chat-Komponente erst laden wenn User sie öffnet (Dynamic Import)
- [ ] **D) A + C kombiniert** — Patterns auslagern UND lazy laden

## Vorschlag 2.3: Listen-Virtualisierung
- [ ] **A) react-window für lange Listen (Empfohlen)** — Mindbrowser und Search-Results mit Virtualisierung
- [ ] **B) @tanstack/virtual** — Modernere Alternative zu react-window mit besserer API
- [ ] **C) Infinite Scroll** — Statt Virtualisierung einfach Pagination / "Mehr laden"-Button
- [x] **D) Nicht nötig** — Aktuelle Datenmenge ist klein genug, erst bei echten Daten optimieren

> **Hinweis:** Marketplace nutzt ein responsives CSS-Grid (2-6 Spalten), was mit react-window komplex ist. Bei echten Datenmengen (100+ Items) sollte dies revisited werden.

## Vorschlag 2.4: Bundle-Size-Optimierung
- [x] **A) Bundle-Analyse + Tree-Shaking (Empfohlen)** — `rollup-plugin-visualizer` eingebaut, Lucide-Icons nutzen bereits Einzelimports
- [ ] **B) Dynamic Imports erweitern** — Monaco Editor, Firebase Auth und AI-Chat nur bei Bedarf laden
- [ ] **C) Preloading** — Kritische Chunks vorladen (`<link rel="preload">`) für schnellere Navigation
- [ ] **D) Alles oben** — Analyse + Dynamic Imports + Preloading als Gesamtpaket
