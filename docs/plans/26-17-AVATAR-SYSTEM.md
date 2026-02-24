# Plan 26-17: Avatar-System

> **Priorität:** Nice-to-have (Langfristig)
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- Roblox-Style Editor mit Körper, Gesicht, Haare, Kleidung, Accessoires, Hüte, Hintergründe
- 10 Presets (Warrior, Scholar, etc.)
- SVG-basiertes Rendering (AvatarRenderer.jsx = 80KB)
- 5 Körpertypen, 13 Frisuren, 12+ Hüte
- Items kaufbar mit MindCoins
- Rating-System für Items

---

## Vorschlag 17.1: Avatar-Erweiterungen
- [ ] **A) Animationen (Empfohlen)** — Idle-Animationen, Feier-Animation bei Achievements, Wink-Animation im Profil
- [ ] **B) Avatar-Outfits** — Komplette Outfit-Sets (Ritter-Set, Wissenschaftler-Set, Pirat-Set) als Bundle kaufbar
- [ ] **C) Saisonale Items** — Weihnachtsmütze, Osterhasen-Ohren, Halloween-Maske — nur zeitlich verfügbar
- [ ] **D) Avatar-Emotes** — Emoji-Reaktionen die der Avatar darstellt (für Social Feed und Chat)

## Vorschlag 17.2: Avatar-Rendering-Optimierung
- [ ] **A) Component-Split (Empfohlen)** — AvatarRenderer in 5-6 Sub-Komponenten aufteilen (Body, Face, Hair, Clothes, Accessories, Background)
- [ ] **B) Canvas-Rendering** — SVG durch Canvas ersetzen für bessere Performance bei vielen Avataren gleichzeitig
- [ ] **C) Pre-Rendered Thumbnails** — Avatare als PNG cachen, nur im Editor live rendern
- [ ] **D) WebGL/Three.js** — 3D-Avatare mit Three.js (ist bereits im Projekt installiert!)
