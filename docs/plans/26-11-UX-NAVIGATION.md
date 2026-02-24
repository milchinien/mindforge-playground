# Plan 26-11: UX & Navigation

> **Priorität:** Hoch (Kurzfristig, 1-4 Wochen)
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- Navbar + Sidebar-Layout (gut)
- Suchleiste im Header (versteckt auf Mobile)
- Breadcrumbs nur als Back-Buttons
- 20+ Seiten, teils tiefe Navigation
- Kein Command-Palette / Schnellzugriff
- Settings relativ einfach

---

## Vorschlag 11.1: Navigation verbessern
- [ ] **A) Breadcrumbs + verbesserte Sidebar (Empfohlen)** — Echte Breadcrumb-Navigation, Sidebar mit Favoriten-Links, "Zuletzt besucht"
- [ ] **B) Command Palette (Ctrl+K)** — Spotlight-ähnliche Suche für schnellen Zugriff auf alles (Seiten, Games, User)
- [ ] **C) Tab-basierte Navigation** — Untere Tab-Bar auf Mobile (wie native Apps), Sidebar auf Desktop
- [ ] **D) Mega-Menu** — Dropdown-Menü in der Navbar mit allen Kategorien und Quick-Links

## Vorschlag 11.2: Suche verbessern
- [ ] **A) Globale Suche mit Kategorien (Empfohlen)** — Suche zeigt Ergebnisse in Tabs: Games, User, Achievements, Events
- [ ] **B) Autocomplete/Typeahead** — Suchvorschläge während des Tippens (letzte Suchen, populäre Games)
- [ ] **C) Filter-Sidebar** — Erweiterte Filter auf der Search-Page (Schwierigkeit, Spielzeit, Bewertung)
- [ ] **D) Alle kombiniert** — Globale Suche + Autocomplete + Filter als Gesamtpaket

## Vorschlag 11.3: Loading & Transitions
- [ ] **A) Skeleton-Screens (Empfohlen)** — Statt Spinner: Content-Platzhalter die die finale Layout-Struktur andeuten
- [ ] **B) Page-Transitions** — Smooth Animationen zwischen Seitenwechseln (Framer Motion)
- [ ] **C) Progressive Loading** — Inhalte schrittweise laden (Above-the-fold zuerst)
- [ ] **D) NProgress-Bar** — Globaler Fortschrittsbalken oben im Browser (wie YouTube)
