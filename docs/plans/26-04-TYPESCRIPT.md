# Plan 26-04: TypeScript-Migration

> **Priorität:** Mittel (Mittelfristig, 1-3 Monate)
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- Gesamtes Projekt in JavaScript (JSX)
- Keine Type-Definitionen oder JSDoc-Annotationen
- Prop-Typen nicht validiert
- Keine Interface-Definitionen für Firebase-Daten
- IDE-Autovervollständigung eingeschränkt

---

## Vorschlag 4.1: TypeScript-Strategie
- [ ] **A) Schrittweise Migration (Empfohlen)** — Phase 1: tsconfig + JSDoc-Hints → Phase 2: Utils/Hooks → Phase 3: Komponenten → Phase 4: Strict Mode
- [ ] **B) JSDoc-Only** — Kein echtes TypeScript, nur JSDoc-Annotationen für Typ-Sicherheit (weniger Aufwand)
- [ ] **C) Big-Bang Migration** — Alles auf einmal umstellen, .jsx → .tsx, alle Typen definieren
- [ ] **D) TypeScript nur für Neues** — Bestehenden Code lassen, nur neue Dateien in TypeScript schreiben
- [ ] **E) Kein TypeScript** — JavaScript beibehalten, stattdessen Runtime-Validation (zod/yup) für kritische Daten

## Vorschlag 4.2: Typ-Definitionen Priorität
- [ ] **A) Firebase-Datenmodelle zuerst (Empfohlen)** — User, Game, Achievement, Event, Asset — als zentrale types/index.ts
- [ ] **B) Props zuerst** — Alle Komponenten-Props typisieren für bessere IDE-Unterstützung
- [ ] **C) API-Responses zuerst** — Firestore-Rückgabewerte typisieren
- [ ] **D) Alles gleichzeitig** — Alle Typen in einem großen types/-Ordner definieren
