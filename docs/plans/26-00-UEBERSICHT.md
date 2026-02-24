# Plan 26: Umfassende Verbesserungsvorschläge für MindForge — Übersicht

> **Erstellt:** 23. Februar 2026
> **Status:** Vorschläge zur Auswahl
> **Methode:** Vollständige Code-Analyse aller 73 Komponenten, 18 Pages, 7 Hooks, 5 Utils, 11 Data-Files
> **Hinweis:** Kein Code-Vorschlag — nur Entscheidungsvorlagen. Jeder Abschnitt enthält Multiple-Choice-Optionen.

---

## Einzelpläne

| Datei | Bereich | Priorität |
|-------|---------|-----------|
| [26-01](26-01-SICHERHEIT.md) | Sicherheit & Datenschutz | ~~Kritisch~~ Implementiert |
| [26-02](26-02-PERFORMANCE.md) | Performance & Optimierung | ~~Hoch~~ Implementiert |
| [26-03](26-03-BARRIEREFREIHEIT.md) | Barrierefreiheit (Accessibility) | Kritisch |
| [26-04](26-04-TYPESCRIPT.md) | TypeScript-Migration | Mittel |
| [26-05](26-05-SEO.md) | SEO & Meta-Tags | Mittel |
| [26-06](26-06-I18N.md) | Internationalisierung (i18n) | Nice-to-have |
| [26-07](26-07-STATE-MANAGEMENT.md) | State Management | ~~Mittel~~ Implementiert |
| [26-08](26-08-ERROR-HANDLING.md) | Error Handling & Monitoring | ~~Hoch~~ Implementiert |
| [26-09](26-09-CODE-QUALITAET.md) | Code-Qualität & Duplikate | ~~Hoch~~ Implementiert |
| [26-10](26-10-TESTING.md) | Testing & QA | ~~Hoch~~ Implementiert |
| [26-11](26-11-UX-NAVIGATION.md) | UX & Navigation | Hoch |
| [26-12](26-12-ONBOARDING.md) | Onboarding & Erste Schritte | Mittel |
| [26-13](26-13-GAMIFICATION.md) | Gamification-Erweiterungen | Nice-to-have |
| [26-14](26-14-SOCIAL-FEATURES.md) | Social Features | Nice-to-have |
| [26-15](26-15-CONTENT-CREATION.md) | Content-Creation & Editor | Mittel |
| [26-16](26-16-MONETARISIERUNG.md) | Monetarisierung & Premium | Nice-to-have |
| [26-17](26-17-AVATAR-SYSTEM.md) | Avatar-System | Nice-to-have |
| [26-18](26-18-MOBILE.md) | Mobile Experience | Nice-to-have |
| [26-19](26-19-BACKEND.md) | Backend & Infrastruktur | Mittel |
| [26-20](26-20-DESIGN.md) | Design & Branding | Nice-to-have |
| [26-A](26-A-CODE-AUDIT.md) | Anhang: Code-Audit Ergebnisse | Referenz |
| [26-B](26-B-FEATURE-VORSCHLAEGE.md) | Anhang: Neue Feature-Vorschläge | Referenz |

---

## Prioritätsmatrix

### Kritisch (Sofort)
| # | Bereich | Top-Empfehlung |
|---|---------|---------------|
| 1.1 | Security | Dev-Credentials in .env.local |
| 1.2 | Security | DOMPurify für XSS-Schutz |
| 3.1 | Accessibility | WCAG AA Baseline |

### Hoch (Kurzfristig, 1-4 Wochen)
| # | Bereich | Top-Empfehlung |
|---|---------|---------------|
| 2.1 | Performance | Kritische Komponenten memoizen |
| 8.1 | Monitoring | Sentry integrieren |
| 9.1 | Code-Qualität | Shared Components extrahieren |
| 10.1 | Testing | Vitest für Unit-Tests |
| 11.3 | UX | Skeleton-Screens statt Spinner |

### Mittel (Mittelfristig, 1-3 Monate)
| # | Bereich | Top-Empfehlung |
|---|---------|---------------|
| 4.1 | TypeScript | Schrittweise Migration |
| 5.1 | SEO | react-helmet-async |
| 7.1 | State | Zustand für globalen State |
| 12.1 | Onboarding | Geführte Tour nach Anmeldung |
| 15.1 | Editor | 3 neue Game-Templates |
| 19.1 | Backend | Firebase vollständig nutzen |

### Nice-to-have (Langfristig)
| # | Bereich | Top-Empfehlung |
|---|---------|---------------|
| 6.1 | i18n | react-i18next (DE + EN) |
| 13.1 | Gamification | Season-System |
| 14.1 | Social | Einfaches Chat-System |
| 16.1 | Payment | Stripe Integration |
| 17.1 | Avatar | Animationen |
| 18.1 | Mobile | PWA |
| 20.1 | Design | Design System dokumentieren |

---

## Abhängigkeiten & Empfohlene Reihenfolge

### Dependency-Graph

Einige Pläne haben starke Abhängigkeiten untereinander. Die folgende Reihenfolge berücksichtigt diese:

```
Phase 1 (Fundament):
  26-19 Backend (Security Rules!)  ──→  Voraussetzung für alles mit Echtdaten
  26-03 Barrierefreiheit            ──→  Vor Design-Änderungen (Farben/Kontraste)
  26-08 Error-Handling              ──→  Vor Testing (erst Errors richtig werfen)

Phase 2 (Qualität):
  26-09 Code-Qualität               ──→  Vor TypeScript (erst aufräumen, dann typisieren)
  26-10 Testing                     ──→  Hängt ab von 26-08 (Error-Handling)
  26-11 UX & Navigation             ──→  Unabhängig, parallel möglich

Phase 3 (Erweiterungen):
  26-04 TypeScript                  ──→  Hängt ab von 26-09 (Code-Qualität)
  26-05 SEO                         ──→  Unabhängig
  26-07 State Management            ──→  Unabhängig, aber vor komplexen Features
  26-12 Onboarding                  ──→  Nach 26-11 UX sinnvoll

Phase 4 (Features):
  26-15 Content-Creation            ──→  Nach 26-07 State + 26-04 TypeScript
  26-13 Gamification                ──→  Nach 26-07 State
  26-20 Design                      ──→  Nach 26-03 Barrierefreiheit

Phase 5 (Langfristig):
  26-16 Monetarisierung             ──→  BENÖTIGT 26-19 Backend (Security Rules + Cloud Functions)
  26-14 Social Features             ──→  Nach 26-19 Backend (Moderation benötigt Server-Logik)
  26-17 Avatar-System               ──→  Nach 26-09 Code-Qualität (AvatarRenderer-Split)
  26-18 Mobile                      ──→  Nach 26-11 UX + 26-03 Barrierefreiheit
  26-06 i18n                        ──→  Idealerweise als letztes (betrifft alle Texte)
```

### Kritische Abhängigkeiten (Blocker)

| Plan | Blockiert durch | Grund |
|------|----------------|-------|
| 26-16 Monetarisierung | 26-19 Backend | Ohne Security Rules + Cloud Functions keine sichere Payment-Logik |
| 26-10 Testing | 26-08 Error-Handling | Erst Errors korrekt werfen, dann testen |
| 26-04 TypeScript | 26-09 Code-Qualität | Erst Duplikate entfernen, dann weniger Dateien migrieren |
| 26-20 Design | 26-03 Barrierefreiheit | Farben/Kontraste erst WCAG-konform, dann Design-System |
| 26-14 Social (Chat) | 26-19 Backend | Chat-Moderation benötigt Server-Side-Logik |
