# Plan 26-03: Barrierefreiheit (Accessibility)

> **Priorität:** Kritisch (Sofort)
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- Nur 22 aria-Attribute im gesamten Projekt
- Keine aria-labels auf Icon-Buttons (Navbar, Sidebar)
- Modals ohne `role="dialog"` und Focus-Trap
- Kein Skip-to-Content Link
- Farb-Kontrast nicht verifiziert
- Keyboard-Navigation unvollständig
- Geschätzt: ~40% WCAG AA konform

---

## Vorschlag 3.1: Accessibility-Strategie
- [ ] **A) WCAG AA Baseline (Empfohlen)** — Aria-Labels, Focus-Management, Skip-Links, Keyboard-Navigation — Fokus auf die wichtigsten 20 Komponenten
- [ ] **B) WCAG AAA komplett** — Volle AAA-Konformität inkl. Farb-Kontrast 7:1, Untertitel, erweiterte Keyboard-Navigation
- [ ] **C) Nur Screen-Reader-Support** — aria-labels und role-Attribute hinzufügen, restliche a11y später
- [ ] **D) Automatisiertes Testing zuerst** — axe-core oder Lighthouse Audit laufen lassen, nur gemeldete Issues fixen

## Vorschlag 3.2: Focus-Management
- [ ] **A) Focus-Trap für Modals (Empfohlen)** — `focus-trap-react` Paket einsetzen für alle Modals und Dialogs
- [ ] **B) Custom Focus-Trap** — Eigene Lösung mit useRef und keydown-Listeners bauen
- [ ] **C) Radix UI Primitives** — Modal, Dialog, Dropdown durch Radix-Komponenten ersetzen (haben a11y eingebaut)
- [ ] **D) Headless UI** — Tailwind Headless UI für Dialog, Menu, Listbox — hat a11y built-in

## Vorschlag 3.3: Farb-Kontrast
- [ ] **A) Design-Token-Review (Empfohlen)** — Alle CSS-Variablen in globals.css prüfen und anpassen auf mindestens 4.5:1 Kontrast
- [ ] **B) High-Contrast-Modus** — Zusätzlichen High-Contrast Theme hinzufügen als Option in Settings
- [ ] **C) Automatische Kontrast-Anpassung** — CSS `color-contrast()` Funktion verwenden (experimentell)
- [ ] **D) A + B** — Token-Review durchführen UND optionalen High-Contrast-Modus anbieten
