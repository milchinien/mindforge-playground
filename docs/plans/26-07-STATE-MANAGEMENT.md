# Plan 26-07: State Management

> **Priorität:** Mittel (Mittelfristig, 1-3 Monate)
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- AuthContext + ToastContext (React Context)
- localStorage für Theme, Session, Drafts, History
- Kein zentraler Store (kein Redux/Zustand)
- Props-Drilling in einigen Komponenten
- Keine Validierung der localStorage-Daten
- Race-Conditions bei mehreren Tabs möglich

---

## Vorschlag 7.1: State-Management-Upgrade
- [ ] **A) Zustand für globalen State (Empfohlen)** — Leichtgewichtig, kein Boilerplate, perfekt für mittlere Apps, einfach mit DevTools
- [ ] **B) Context optimieren** — Bestehende Contexts aufteilen (UserContext, SettingsContext, GameContext), useMemo für Values
- [ ] **C) Redux Toolkit** — Voller Redux mit RTK, gut für komplexe State-Logik, aber mehr Boilerplate
- [ ] **D) Jotai/Recoil** — Atomare State-Verwaltung, feingranulare Re-Renders, moderne API
- [ ] **E) Status Quo** — Aktuelle Lösung reicht für MVP, erst bei Skalierungsproblemen wechseln

## Vorschlag 7.2: localStorage-Absicherung
- [ ] **A) Validierung + Versionierung (Empfohlen)** — Schema-Validierung beim Laden, Versionsfeld für Migrations, Namespace-Prefixe
- [ ] **B) IndexedDB statt localStorage** — Mehr Speicher, strukturierte Daten, Transaction-Support (idb Paket ist schon installiert!)
- [ ] **C) State-Sync zwischen Tabs** — BroadcastChannel API für Tab-übergreifende Synchronisation
- [ ] **D) A + B + C** — Komplettpaket: Validierung + IndexedDB + Tab-Sync
