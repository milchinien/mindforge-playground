# Plan 26-10: Testing & QA

> **Priorität:** Hoch (Kurzfristig, 1-4 Wochen)
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- Playwright E2E-Tests (34+ Tests in 17 Dateien)
- Headless-Modus, 60s Timeout, 1 Worker
- Kein Unit-Testing-Framework
- Keine Component-Tests
- Keine API/Integration-Tests
- Screenshots bei Fehlern

---

## Vorschlag 10.1: Test-Strategie erweitern
- [ ] **A) Vitest für Unit-Tests (Empfohlen)** — Vite-nativ, schnell, Jest-kompatibel, für Hooks/Utils/Formatters
- [ ] **B) Testing Library für Component-Tests** — @testing-library/react für UI-Komponenten-Tests
- [ ] **C) Vitest + Testing Library** — Beides zusammen: Units für Logik, Component-Tests für UI
- [ ] **D) Nur Playwright erweitern** — Mehr E2E-Tests statt neue Test-Ebenen einzuführen

## Vorschlag 10.2: Test-Coverage-Ziel
- [ ] **A) 60% Coverage für kritische Pfade (Empfohlen)** — Auth, Payment, Game-Validation, Achievements — die wichtigsten Flows
- [ ] **B) 80% Gesamt-Coverage** — Hohe Abdeckung für maximale Sicherheit
- [ ] **C) Keine Coverage-Metrik** — Nur wichtige User-Journeys testen, nicht nach Prozent gehen
- [ ] **D) 100% für Utils/Hooks** — Nur reine Logik 100% testen, UI-Tests bleiben bei E2E

## Vorschlag 10.X: Firebase-Mocking-Strategie
> **Hinweis:** Unit- und Component-Tests benötigen eine Mocking-Strategie für Firebase, da Tests nicht gegen echte Firebase-Instanzen laufen sollten.

- [ ] **A) MSW (Mock Service Worker) (Empfohlen)** — Intercepts HTTP-Requests auf Network-Ebene, funktioniert mit Vitest + Testing Library, realitätsnahes Mocking
- [ ] **B) firebase/testing** — Offizielles Firebase Testing SDK mit Emulator Suite (lokaler Firestore + Auth Emulator)
- [ ] **C) Manuelle Mocks** — Jest/Vitest Module-Mocks für firebase/firestore, firebase/auth etc. (einfach, aber fragil)
- [ ] **D) Firebase Emulator Suite** — Lokale Firebase-Emulators für Auth, Firestore, Storage — am realistischsten, aber Overhead beim Setup

## Vorschlag 10.3: CI/CD-Pipeline
- [ ] **A) GitHub Actions (Empfohlen)** — Lint + Test + Build bei jedem Push, Playwright auf PR
- [ ] **B) GitHub Actions + Preview-Deployments** — Zusätzlich Preview-URLs für jeden PR (Vercel/Netlify)
- [ ] **C) Nur lokales Testing** — Kein CI/CD, Tests lokal vor dem Push ausführen
- [ ] **D) A + B + Lighthouse CI** — Volle Pipeline mit Performance-Budget-Tests
