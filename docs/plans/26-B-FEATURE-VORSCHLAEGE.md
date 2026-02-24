# Plan 26-B: Neue Feature-Vorschläge aus dem Audit

> **Typ:** Anhang / Referenz
> **Datum:** 23. Februar 2026
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## B.1: Echtzeit-Validierung bei Formularen
Aktuell validieren Login, Register und Settings erst bei Submit. Inline-Validierung waehrend des Tippens wuerde die UX deutlich verbessern.

## B.2: Undo-Funktion im Avatar-Editor
Der Avatar-Editor speichert Aenderungen per Debounce automatisch. Ein Undo/Redo-Stack wuerde versehentliche Aenderungen rueckgaengig machen koennen.

## B.3: Spiel-Vorschau vor dem Spielen
GameDetail zeigt Beschreibung und Bewertungen, aber keine Preview des Spiels. Ein Screenshot-Carousel oder kurze Gameplay-Vorschau wuerde helfen.

## B.4: Offline-Erkennung
Keine Erkennung ob der User offline ist. Ein Banner "Du bist offline" wuerde verhindern, dass User Aktionen starten die fehlschlagen.

## B.5: Session-Timeout-Warnung
Die Session laeuft nach 24h (bzw. 30 Tagen bei "Remember Me") ab. Eine Warnung 5 Minuten vor Ablauf wuerde Datenverlust verhindern.

## B.6: Konfigurierbarer Quiz-Timer
Der Quiz-Timer zeigt Sekunden an, aber es gibt keine visuelle Warnung ausser rote Farbe bei 5s. Ein Fortschrittsbalken oder Puls-Animation wuerde die Dringlichkeit besser kommunizieren.

## B.7: Accessibility im Quiz-Player
Der Quiz-Player nutzt Farben als einziges Signal fuer richtig/falsch. Icons (Haekchen/Kreuz) wuerden farbenblinden Usern helfen - bereits als Lucide-Icons verfuegbar.

## B.8: Dark/Light Theme Preview in Settings
Beim Theme-Wechsel in den Settings gibt es keine Vorschau. Ein kleines Preview-Widget das beide Themes nebeneinander zeigt wuerde die Entscheidung erleichtern.
