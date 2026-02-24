# Plan 26-20: Design & Branding

> **Priorität:** Nice-to-have (Langfristig)
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- Dark Theme (Standard) + Light Theme
- Primärfarbe: Dunkelblau (#1e3a8a)
- Akzentfarbe: Orange (#f97316)
- Inter als Schriftart
- Lucide Icons
- Kein Design System / Style Guide
- README ist noch Vite-Template

---

## Vorschlag 20.1: Design System
- [ ] **A) Tailwind-basiertes Design System (Empfohlen)** — Dokumentierte Token (Farben, Spacing, Typography), Component-Library mit Beispielen
- [ ] **B) Storybook** — Interaktive Component-Dokumentation, visuelles Testing, Design-Preview
- [ ] **C) Figma Design System** — Design-Tokens in Figma pflegen, automatisch in Code übersetzen
- [ ] **D) Nur Tailwind-Config erweitern** — Mehr Custom-Tokens in tailwind.config, keine extra Tooling

## Vorschlag 20.2: Branding & Identity
- [ ] **A) Professionelles Logo + Brand Guide (Empfohlen)** — Logo-Design, Farbpalette dokumentieren, Typography-Rules, Icon-Style festlegen
- [ ] **B) Animiertes Logo** — Lottie/CSS-Animation für Logo, Loading-Screen mit Brand-Animation
- [ ] **C) Maskottchen** — MindForge-Maskottchen (z.B. Roboter/Fuchs) das durch die App führt
- [ ] **D) Custom Icon-Set** — Eigene Icons statt Lucide, konsistenter Brand-Look

## Vorschlag 20.3: Micro-Interactions & Polish
- [ ] **A) Framer Motion für UI-Animationen (Empfohlen)** — Page-Transitions, Card-Hover-Effekte, Modal-Animationen, List-Animationen
- [ ] **B) CSS-Only Animationen** — Tailwind animate-Klassen nutzen, kein extra Paket
- [ ] **C) Lottie-Animationen** — Vorgebaute Animationen für Achievements, Level-Up, Streak etc.
- [ ] **D) Confetti & Celebrations** — Konfetti bei Achievements, Partikel bei Level-Up, Shake bei Fehlern
