# Plan 26-09: Code-Qualität & Duplikate

> **Priorität:** ~~Hoch~~ Implementiert
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- Gute Datei-Organisation (73+ Komponenten in logischen Ordnern)
- ~~3x duplizierte Bestätigungs-Dialoge (confirm())~~ → ConfirmDialog Komponente
- ~~5x duplizierte Form-Error-Rendering~~ → FormError Komponente
- ~~AvatarRenderer.jsx hat 80KB~~ → Aufgeteilt in 9 Sub-Komponenten
- ~~Kein Prettier/strikte Linting~~ → ESLint + Prettier konfiguriert

---

## Vorschlag 9.1: Duplikate reduzieren
- [x] **A) Shared Components extrahieren (Empfohlen)** — Implementiert: ConfirmDialog, FormError
- [ ] **B) Nur ConfirmDialog**
- [ ] **C) Utility-Klassen in Tailwind**
- [ ] **D) Compound Components**

## Vorschlag 9.2: AvatarRenderer aufteilen
- [x] **A) Feature-basiert aufteilen (Empfohlen)** — Implementiert: 9 Sub-Komponenten in src/components/profile/avatar/
- [ ] **B) SVG-Teile auslagern**
- [ ] **C) Canvas statt SVG**
- [ ] **D) Lassen wie es ist**

## Vorschlag 9.3: Code-Style & Linting
- [x] **A) ESLint erweitern + Prettier (Empfohlen)** — Implementiert: .prettierrc + eslint.config.js mit Prettier-Integration
- [ ] **B) Biome**
- [ ] **C) Nur ESLint-Regeln verschärfen**
- [ ] **D) Husky + lint-staged**
