# Plan 26-18: Mobile Experience

> **Priorität:** Nice-to-have (Langfristig)
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- Responsive Design mit Tailwind (gut)
- Sidebar kollabiert auf Mobile
- Game-Grids passen sich an
- Code-Editor zeigt "Desktop required" auf Mobile
- Suchleiste auf Mobile versteckt
- Touch-Targets nicht systematisch geprüft

---

## Vorschlag 18.1: Mobile-Optimierung
- [ ] **A) PWA (Progressive Web App) (Empfohlen)** — Service Worker, Manifest, installierbar auf Homescreen, Offline-Grundfunktionen
- [ ] **B) Bottom Navigation Bar** — Mobile-typische untere Navigation statt Hamburger-Menü
- [ ] **C) Touch-Optimierung** — Alle Buttons mindestens 44x44px, Swipe-Gesten für Carousel und Tabs
- [ ] **D) Alle drei** — PWA + Bottom Nav + Touch-Optimierung als Mobile-Gesamtpaket

> **Hinweis: PWA-Einschränkungen auf iOS**
> - Push-Notifications erst ab iOS 16.4+ (ältere iPhones: keine Push-Benachrichtigungen)
> - Badge API nicht unterstützt (kein App-Icon-Badge auf iOS)
> - Storage-Limit: ~50MB für Offline-Daten (deutlich weniger als native Apps)
> - Keine Hintergrund-Synchronisation
> - PWA wird bei Speicherdruck vom System gelöscht (inkl. Cache/Daten)
> - Kein Zugriff auf Kontakte, Bluetooth, NFC
>
> Diese Einschränkungen betreffen primär iOS. Android PWAs haben deutlich mehr Funktionalität.

## Vorschlag 18.2: Mobile Game-Creation
- [ ] **A) Vereinfachter Mobile-Editor (Empfohlen)** — Quiz-Template-Modus auch auf Mobile verfügbar (kein Code-Editor, nur Fragen/Antworten)
- [ ] **B) Kein Mobile-Editor** — Game-Creation bleibt Desktop-only, klare Kommunikation auf Mobile
- [ ] **C) Mobile-App (React Native)** — Native App für iOS/Android für das beste Mobile-Erlebnis
- [ ] **D) Capacitor/Ionic Wrapper** — Bestehende Web-App in native Shell wrappen
