# Plan 26-10: Testing & QA

> **Priorität:** ~~Hoch~~ Implementiert
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- Playwright E2E-Tests (34+ Tests in 17 Dateien)
- ~~Kein Unit-Testing-Framework~~ → Vitest konfiguriert (28 Unit-Tests bestehen)
- ~~Keine Component-Tests~~ → @testing-library/react installiert
- ~~Keine API/Integration-Tests~~ → MSW (Mock Service Worker) für Firebase-Mocking
- ~~Kein CI/CD~~ → GitHub Actions Workflow für Lint + Test + Build
- Screenshots bei Fehlern (Playwright)

---

## Vorschlag 10.1: Test-Strategie erweitern
- [x] **C) Vitest + Testing Library** — Implementiert: vitest.config.js + @testing-library/react + @testing-library/jest-dom
- [ ] **A) Vitest für Unit-Tests**
- [ ] **B) Testing Library für Component-Tests**
- [ ] **D) Nur Playwright erweitern**

## Vorschlag 10.2: Test-Coverage-Ziel
- [x] **A) 60% Coverage für kritische Pfade (Empfohlen)** — Ziel gesetzt, initiale Tests für Utils geschrieben (formatters, premiumChecks, storage, errorLogger)
- [ ] **B) 80% Gesamt-Coverage**
- [ ] **C) Keine Coverage-Metrik**
- [ ] **D) 100% für Utils/Hooks**

## Vorschlag 10.X: Firebase-Mocking-Strategie
- [x] **A) MSW (Mock Service Worker) (Empfohlen)** — Implementiert: src/test/mocks/handlers.js + server.js
- [ ] **B) firebase/testing**
- [ ] **C) Manuelle Mocks**
- [ ] **D) Firebase Emulator Suite**

## Vorschlag 10.3: CI/CD-Pipeline
- [x] **A) GitHub Actions (Empfohlen)** — Implementiert: .github/workflows/ci.yml (Lint + Test + Build + E2E auf PRs)
- [ ] **B) GitHub Actions + Preview-Deployments**
- [ ] **C) Nur lokales Testing**
- [ ] **D) A + B + Lighthouse CI**
