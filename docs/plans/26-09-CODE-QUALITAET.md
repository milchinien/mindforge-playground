# Plan 26-09: Code-Qualität & Duplikate

> **Priorität:** Hoch (Kurzfristig, 1-4 Wochen)
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- Gute Datei-Organisation (73 Komponenten in logischen Ordnern)
- 3x duplizierte Bestätigungs-Dialoge (confirm())
- 6x ähnliche Card-Styling-Patterns
- 5x duplizierte Form-Error-Rendering
- 7x wiederholte responsive Grid-Layouts
- AvatarRenderer.jsx hat 80KB (sehr groß)

---

## Vorschlag 9.1: Duplikate reduzieren
- [ ] **A) Shared Components extrahieren (Empfohlen)** — ConfirmDialog, CardBase, FormError, ResponsiveGrid als wiederverwendbare Komponenten
- [ ] **B) Nur ConfirmDialog** — Browser-confirm() durch Custom-Modal ersetzen (größter UX-Impact)
- [ ] **C) Utility-Klassen in Tailwind** — @apply-Direktiven für häufige Patterns (card, grid, error)
- [ ] **D) Compound Components** — Card.Root, Card.Image, Card.Content Pattern für maximale Flexibilität

## Vorschlag 9.2: AvatarRenderer aufteilen
- [ ] **A) Feature-basiert aufteilen (Empfohlen)** — AvatarBody, AvatarFace, AvatarHair, AvatarClothing, AvatarAccessories als separate Dateien
- [ ] **B) SVG-Teile auslagern** — SVG-Definitionen in eigene Dateien, AvatarRenderer als Composer
- [ ] **C) Canvas statt SVG** — Avatar-Rendering auf Canvas umstellen (performanter bei vielen Avataren)
- [ ] **D) Lassen wie es ist** — 80KB ist groß, aber funktioniert und wird lazy-loaded

## Vorschlag 9.3: Code-Style & Linting
- [ ] **A) ESLint erweitern + Prettier (Empfohlen)** — Strikte Regeln, Auto-Format, Konsistenz erzwingen
- [ ] **B) Biome** — All-in-one Linter+Formatter, schneller als ESLint+Prettier
- [ ] **C) Nur ESLint-Regeln verschärfen** — Bestehende Config erweitern um import-Sortierung, unused-vars, consistent-return
- [ ] **D) Husky + lint-staged** — Pre-Commit-Hooks für automatisches Linting vor jedem Commit
