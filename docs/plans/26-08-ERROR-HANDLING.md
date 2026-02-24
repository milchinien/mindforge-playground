# Plan 26-08: Error Handling & Monitoring

> **Priorität:** Hoch (Kurzfristig, 1-4 Wochen)
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- Globaler ErrorBoundary vorhanden (gut)
- Try-Catch in 130+ Stellen (gut)
- Toast-Benachrichtigungen für User-Feedback
- Firebase-Error-Mapping bei Login
- ABER: Stille Fehler (Home.jsx gibt [] zurück ohne Warnung)
- ABER: Kein Error-Logging-Service
- ABER: `window.location.reload()` statt State-Updates
- ABER: Kein Retry-Mechanismus

---

## Vorschlag 8.1: Error-Monitoring
- [ ] **A) Sentry integrieren (Empfohlen)** — Error-Tracking, Performance-Monitoring, Session-Replay, kostenloser Tier für kleine Apps
- [ ] **B) LogRocket** — Session-Replay + Error-Tracking, gut für UX-Debugging
- [ ] **C) Eigenes Error-Logging** — Console.error + Firebase Analytics für Fehler-Events, kein externes Paket
- [ ] **D) Erst bei Produktion** — Error-Monitoring erst einrichten wenn die App live geht

## Vorschlag 8.2: Error-Recovery-Strategie
- [ ] **A) Retry + Fallback-UI (Empfohlen)** — Automatische Retries für Netzwerk-Fehler, Fallback-UI für fehlgeschlagene Datenladen
- [ ] **B) Offline-First** — Service Worker + Cache für Offline-Fähigkeit, graceful degradation
- [ ] **C) Optimistic Updates** — UI sofort aktualisieren, bei Fehler zurückrollen (bessere UX)
- [ ] **D) Nur Fehlermeldungen verbessern** — Spezifischere, hilfreichere Fehlermeldungen für User, keine technischen Änderungen

## Vorschlag 8.3: window.location.reload() ersetzen
- [ ] **A) React-State-Updates (Empfohlen)** — Alle reload()-Aufrufe durch State-Invalidierung ersetzen (z.B. nach Game-Deletion)
- [ ] **B) Router.refresh()** — React Router Navigation nutzen statt Hard-Reload
- [ ] **C) Custom Event-System** — EventBus für Refresh-Signale zwischen Komponenten
- [ ] **D) Status Quo** — Reload funktioniert, hat nur UX-Nachteil (kurzes Flackern)
