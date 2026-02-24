# Plan 26-07: State Management

> **Priorität:** ~~Mittel~~ Implementiert
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- ~~AuthContext + ToastContext (React Context)~~ → Zustand Stores (toastStore, themeStore, uiStore) + AuthContext beibehalten
- ~~localStorage für Theme, Session, Drafts, History~~ → Validierte storage.js Utility mit Namespace-Prefixen
- ~~Kein zentraler Store~~ → Zustand installiert und aktiv
- ~~Props-Drilling in einigen Komponenten~~ → Zustand Stores für globalen State
- ~~Keine Validierung der localStorage-Daten~~ → Schema-Validierung in src/utils/storage.js
- Race-Conditions bei mehreren Tabs möglich (Tab-Sync nicht implementiert)

---

## Vorschlag 7.1: State-Management-Upgrade
- [x] **A) Zustand für globalen State (Empfohlen)** — Implementiert: toastStore, themeStore, uiStore
- [ ] **B) Context optimieren**
- [ ] **C) Redux Toolkit**
- [ ] **D) Jotai/Recoil**
- [ ] **E) Status Quo**

## Vorschlag 7.2: localStorage-Absicherung
- [x] **A) Validierung + Versionierung (Empfohlen)** — Implementiert: src/utils/storage.js mit Schema-Validierung, Versionierung, Namespace-Prefixen
- [ ] **B) IndexedDB statt localStorage**
- [ ] **C) State-Sync zwischen Tabs**
- [ ] **D) A + B + C**
