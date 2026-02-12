# 24 - Forge KI-Upgrade: Gaming-Persoenlichkeit & Interaktive Vorschau-Karten

## Was wird hier gemacht?

Der KI-Assistent im Code-Editor (Free Mode unter `/create`) soll von einem "normalen Chatbot" zu einer **einzigartigen Gaming-KI namens "Forge"** umgebaut werden. Forge ist ein Roboter-Schmied-Charakter, der Code "schmiedet" statt generiert.

Zusaetzlich werden **Interaktive Vorschau-Karten (Preview Cards)** eingefuehrt: Statt rohem Code werden visuelle Karten mit Icon, Titel, Schwierigkeitsgrad, Beschreibung und einem "Einfuegen"-Button angezeigt.

Am Ende soll die KI sich deutlich von Standard-Chatbots abheben und ein **gaming-artiges Erlebnis** bieten.

---

## Voraussetzung

- Code-Editor Free Mode muss funktionieren (`/create` > "Freier Modus")
- Das AI-Panel ist bereits als Bottom-Panel implementiert (wie VS Code Terminal)
- Layout ist bereits Fullscreen-Overlay mit z-[60]
- Fuzzy-Matching und Multiple-Choice Suggestion Chips existieren bereits
- 13 RESPONSE_PATTERNS mit Code-Templates (Quiz, Timer, Animation, etc.) existieren

---

## Aktueller Stand der relevanten Dateien

### 1. `src/hooks/useAIChat.js` (~1053 Zeilen)
- **RESPONSE_PATTERNS**: 13 Patterns mit `id`, `label`, `icon`, `triggers[]`, `response` (Code-Templates als Markdown)
- **SMART_RESPONSES**: 3 Eintraege (Begruessung, Danke, Fehler-Hilfe)
- **fuzzyScore()**: Berechnet Uebereinstimmung zwischen User-Text und Triggers
- **findBestResponse()**: Findet beste Antwort oder zeigt Suggestion Chips
- **sendMessage()**: Sendet Nachricht, unterstuetzt auch `categoryId` fuer direkte Pattern-Auswahl
- **Initiale Nachricht**: Generischer "MindForge KI-Assistent v1.0" Text
- **Message-Format**: `{ role, content, suggestions?, hidden? }`

### 2. `src/components/codeEditor/AIChatPanel.jsx` (~220 Zeilen)
- **CodeBlock**: Zeigt Code mit "Kopieren" und "Code uebernehmen" Buttons
- **MessageContent**: Parsed Markdown (Bold, Inline-Code, Code-Blocks)
- **SuggestionChips**: Klickbare Kategorie-Buttons bei unklarer Eingabe
- **AIChatPanel**: Hauptkomponente mit Tab-Bar ("KI-ASSISTENT"), Messages-Bereich, Terminal-Input
- **Avatar**: Sparkles-Icon in accent/20 Box
- **Loading**: 3 bouncing Dots
- **Input Prompt**: `>` Symbol
- **data-testids**: `ai-input`, `ai-send-btn`, `ai-suggestions`, `suggestion-{id}`, `ai-panel`

### 3. `src/components/codeEditor/CodeEditorLayout.jsx` (~219 Zeilen)
- **handleApplyCode()**: Nimmt Code-String, erkennt anhand Inhalt ob HTML/CSS/JS
- **Layout**: Toolbar > Editor+Preview side-by-side > Resize Handle > AI Panel (bottom)
- **data-testids**: `editor-fullscreen`, `resize-handle`, `ai-panel`

### 4. `tests/ai-panel.spec.js` (~259 Zeilen, 17 Tests)
- 3 Testgruppen: Editor Fullscreen Layout (5), AI Fuzzy Matching (8), No Visual Bugs (4)
- Alle 17 Tests bestehen aktuell

---

## Aenderungen im Detail

### Phase 1: useAIChat.js - Forge Persoenlichkeit + Metadaten

#### 1.1 Neue Felder fuer RESPONSE_PATTERNS

Jedes der 13 Patterns bekommt 3 neue Felder:

```javascript
{
  id: 'quiz',
  label: 'Quiz / Fragen',
  icon: '❓',
  // NEU:
  difficulty: 2,           // 1 = Einsteiger, 2 = Mittel, 3 = Fortgeschritten
  description: 'Interaktives Quiz mit Multiple-Choice, Punkten und Auswertung',
  forgeIntro: '⚔️ Ein Quiz! Forge liebt Wissens-Challenges! Hier ist ein kampferprobtes Quiz-System:',
  // Bestehend:
  triggers: [...],
  response: `...bestehender Code bleibt identisch...`,
}
```

#### Schwierigkeitsgrade pro Pattern:

| ID | Label | Difficulty | Forge-Intro |
|---|---|---|---|
| quiz | Quiz / Fragen | 2 | "⚔️ Ein Quiz! Forge liebt Wissens-Challenges!" |
| timer | Timer / Countdown | 1 | "⏱️ Tick-tock! Forge hat den perfekten Timer geschmiedet!" |
| animation | Animationen | 1 | "✨ Zeit fuer Magie! Forge's Animations-Werkstatt oeffnet!" |
| dragdrop | Drag & Drop | 2 | "🔀 Drag & Drop? Forge's Lieblings-Mechanik!" |
| score | Punkte-System | 2 | "🏆 Punkte-System incoming! Jeder Held braucht einen Score!" |
| memory | Memory-Spiel | 2 | "🃏 Memory! Ein Klassiker aus Forge's Sammlung!" |
| design | Design / Theme | 1 | "🎨 Forge poliert die Ruestung... aeh, das Design!" |
| input | Eingabe / Formular | 1 | "📝 Formulare sind wie Questgeber - sie sammeln die wichtigen Infos!" |
| random | Wuerfel / Zufall | 1 | "🎲 Forge liebt den Zufall! Moege das Glueck mit dir sein!" |
| progress | Level / Fortschritt | 2 | "📊 Level-System! Der Weg zum Meister beginnt bei Level 1!" |
| sound | Sound-Effekte | 2 | "🔊 Sound-Effekte! Jedes gute Spiel braucht seinen Soundtrack!" |
| leaderboard | Bestenliste | 2 | "🥇 Eine Bestenliste! Hier werden Legenden geschrieben!" |
| help | Hilfe | - | Spezialbehandlung, zeigt Forge's Arsenal |

#### 1.2 Forge's SMART_RESPONSES (Rewrites)

```javascript
// Begruessung (vorher: "Hallo! Ich bin bereit...")
{
  triggers: ['hallo', 'hey', 'moin', 'guten tag', 'servus'],
  exactTriggers: ['hi'],
  response: `Hey, Abenteurer! 👋 Ich bin **Forge** 🤖⚒️ - dein KI-Schmied!

Sag mir was du brauchst und ich schmiede dir den perfekten Code. Tippe \`hilfe\` fuer mein volles Arsenal!`
}

// Danke (vorher: "Gerne! Wenn du weitere...")
{
  triggers: ['danke', 'super', 'toll', 'perfekt', 'cool', 'nice', 'gut'],
  response: `Kein Ding, Abenteurer! 🤖 Forge ist immer bereit fuer die naechste Quest. Sag Bescheid wenn du was anpassen willst!`
}

// Fehler-Hilfe (vorher: "Debugging-Tipps:")
{
  triggers: ['fehler', 'error', 'bug', 'funktioniert nicht', 'geht nicht', 'kaputt', 'problem'],
  response: `🐛 Oh oh, ein Bug-Monster! Lass Forge dir helfen:

1. **Konsole oeffnen** (F12 > Console) - dort verstecken sich die Hinweise
2. **Haeufige Fallen:**
   - Element nicht gefunden → \`id\` in HTML und JS pruefen
   - Syntax-Fehler → Klammern \`{}\`, \`()\` checken
   - CSS wirkt nicht → Selektoren und Tippfehler pruefen

Beschreib den Fehler genauer und Forge findet die Loesung! 🔧`
}
```

#### 1.3 Initiale Nachricht (Forge Intro)

```javascript
// Vorher: "MindForge KI-Assistent v1.0..."
// Nachher:
{
  role: 'assistant',
  content: `🤖⚒️ **FORGE** online!

Yo, Abenteurer! Ich bin dein KI-Schmied - ich schmiede dir Game-Components aus Code.

Sag mir was du brauchst oder tippe \`hilfe\` fuer mein volles Arsenal!`
}
```

#### 1.4 findBestResponse - Neues Return-Format

```javascript
// Vorher:
return { content: pattern.response }

// Nachher:
return {
  content: pattern.forgeIntro,       // Forge's Persoenlichkeits-Text
  codeResponse: pattern.response,    // Der Code (Markdown mit Code-Blocks)
  card: {                            // Metadaten fuer PreviewCard
    id: pattern.id,
    icon: pattern.icon,
    label: pattern.label,
    difficulty: pattern.difficulty,
    description: pattern.description,
  }
}
```

Fuer Smart-Responses und Suggestions bleibt es bei `{ content, suggestions }` OHNE card.

#### 1.5 sendMessage - Card-Daten an Messages weitergeben

```javascript
// Bei Pattern-Antworten (direkt oder gefunden):
setMessages(prev => [...prev, {
  role: 'assistant',
  content: result.content,           // Forge-Intro Text
  codeResponse: result.codeResponse, // Code-Templates
  card: result.card,                 // Card-Metadaten
  suggestions: result.suggestions,
}])
```

#### 1.6 FORGE_TIPS Array (Optional, nice-to-have)

```javascript
const FORGE_TIPS = [
  '💡 Forge-Tipp: Kombiniere Quiz + Timer fuer extra Spannung!',
  '💡 Forge-Tipp: Sound-Effekte machen dein Spiel 10x besser!',
  '💡 Forge-Tipp: Teste dein Spiel in der Live-Vorschau rechts!',
  '💡 Forge-Tipp: Ein gutes Punkte-System motiviert Spieler!',
  '💡 Forge-Tipp: Animationen lassen alles professioneller wirken!',
]
```

Nach jeder 3. Anfrage wird ein zufaelliger Tipp an die Antwort angehaengt.

#### 1.7 Suggestions-Text mit Forge-Stimme

```javascript
// Mehrere Matches (vorher: "Ich habe mehrere passende Optionen gefunden...")
content: 'Hmm, da gibt es mehrere Moeglichkeiten in Forge\'s Werkstatt! Was soll es sein?'

// Kein Match (vorher: "Was moechtest du erstellen?...")
content: 'Das kenn ich noch nicht, Abenteurer! Aber schau mal in Forge\'s Werkstatt - vielleicht ist was Passendes dabei:'
```

---

### Phase 2: AIChatPanel.jsx - Visual Overhaul

#### 2.1 Neue Imports

```javascript
import { Send, Copy, Check, ChevronDown, ChevronUp, Code2, Zap, Eye, EyeOff } from 'lucide-react'
```

Bot und Sparkles werden durch Forge's eigene Darstellung ersetzt (Emoji-basiert).

#### 2.2 parseCodeBlocks Helper

```javascript
function parseCodeBlocks(text) {
  const blocks = []
  const regex = /```(\w*)\n?([\s\S]*?)```/g
  let match
  while ((match = regex.exec(text)) !== null) {
    blocks.push({ language: match[1] || 'code', code: match[2].trim() })
  }
  return blocks
}
```

Extrahiert alle Code-Blocks aus einer Response (html, css, javascript).

#### 2.3 PreviewCard Komponente (NEU - Kernfeature)

Wird angezeigt STATT roher Code-Blocks wenn eine Message `card` Metadaten hat.

**Struktur:**
```
┌──────────────────────────────────────────┐
│ ❓  Quiz / Fragen          [Mittel]     │  ← Header: Icon + Titel + Difficulty Badge
│     Interaktives Quiz mit MC, Punkten... │  ← Beschreibung
├──────────────────────────────────────────┤
│ </> 3 Code-Dateien  [html] [css] [js]   │  ← Code-Info Leiste
├──────────────────────────────────────────┤
│  [⚡ Einfuegen]  [👁 Code]  [📋]        │  ← Action Buttons
├──────────────────────────────────────────┤
│ (Optional: Ausgeklappter Code)           │  ← Expandable Code Section
│   html ─────────────────────             │
│   css ──────────────────────             │
│   javascript ───────────────             │
└──────────────────────────────────────────┘
```

**Difficulty Badge Farben:**
- Einsteiger (1): Gruen (`text-green-400 bg-green-400/10 border-green-400/30`)
- Mittel (2): Gelb (`text-yellow-400 bg-yellow-400/10 border-yellow-400/30`)
- Fortgeschritten (3): Rot (`text-red-400 bg-red-400/10 border-red-400/30`)

**Card Styling:**
- Background: Gradient von `#1a1a2e` zu `#16213e`
- Border: `border-[#333]`
- Rounded: `rounded-xl`
- Shadow: `shadow-lg`

**Buttons:**
- "Einfuegen" (Primary): `bg-accent/20 text-accent border-accent/30` → nach Klick: `bg-green-500/20 text-green-400` mit "Eingefuegt!" + Achievement-Meldung
- "Code" (Toggle): `bg-[#2a2a2a] text-gray-400` - togglet Code-Ansicht
- "Kopieren" (Icon-only): Kopiert allen Code

**Einfuegen-Logik:**
```javascript
const handleInsertAll = () => {
  const codeObj = {}
  codeBlocks.forEach(block => {
    if (block.language === 'html') codeObj.html = block.code
    else if (block.language === 'css') codeObj.css = block.code
    else if (block.language === 'javascript' || block.language === 'js') codeObj.js = block.code
  })
  onApplyCode(codeObj)  // Sendet Objekt statt String!
}
```

**Achievement-Meldung nach Einfuegen:**
```html
<div className="bg-green-500/10 border-t border-green-500/20 text-center">
  <span className="text-green-400 text-xs">🎮 Component erfolgreich geschmiedet und eingefuegt!</span>
</div>
```

#### 2.4 Forge Avatar (ersetzt Bot/Sparkles Icons)

```jsx
// Vorher:
<div className="flex-shrink-0 w-6 h-6 rounded bg-accent/20 flex items-center justify-center">
  <Sparkles size={12} className="text-accent" />
</div>

// Nachher:
<div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-accent/30 to-orange-600/20 flex items-center justify-center border border-accent/20">
  <span className="text-sm">🤖</span>
</div>
```

#### 2.5 Tab Bar - "FORGE" statt "KI-ASSISTENT"

```jsx
// Vorher:
<Bot size={12} className="text-accent" />
KI-ASSISTENT

// Nachher:
<span className="text-base">🤖</span>
FORGE
```

Auch im minimierten Zustand.

#### 2.6 Loading Animation - "Forge schmiedet..."

```jsx
// Vorher: 3 bouncing dots
// Nachher:
<div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-accent/30 to-orange-600/20 flex items-center justify-center border border-accent/20">
  <span className="text-sm animate-bounce">⚒️</span>
</div>
<div className="bg-[#252526] rounded-lg px-4 py-3">
  <div className="flex items-center gap-2">
    <span className="text-xs text-gray-400 font-mono">Forge schmiedet</span>
    <div className="flex gap-1">
      <!-- 3 bouncing accent dots -->
    </div>
  </div>
</div>
```

#### 2.7 Terminal Input Prompt

```jsx
// Vorher: >
// Nachher:
<span className="text-accent font-mono text-sm font-bold select-none">⚒️</span>
```

#### 2.8 Message Rendering Logik

```jsx
{msg.card ? (
  // Card-Message: Forge-Intro + PreviewCard
  <>
    <div className="text-sm text-gray-300 mb-1">{msg.content}</div>
    <PreviewCard card={msg.card} codeResponse={msg.codeResponse} onApplyCode={onApplyCode} />
  </>
) : (
  // Normale Message: Text mit Markdown-Parsing
  <MessageContent content={msg.content} onApplyCode={msg.role === 'assistant' ? onApplyCode : undefined} />
)}
```

#### 2.9 CodeBlock Komponente (bleibt fuer Smart-Responses)

Die bestehende CodeBlock-Komponente bleibt erhalten fuer Smart-Responses die direkt Code enthalten (z.B. Debugging-Tipps). Sie wird nur bei nicht-Card Messages verwendet.

---

### Phase 3: CodeEditorLayout.jsx - handleApplyCode erweitern

```javascript
const handleApplyCode = (codeBlock) => {
  // NEU: Object-Format von PreviewCard { html, css, js }
  if (typeof codeBlock === 'object' && codeBlock !== null) {
    setCode(prev => ({
      ...prev,
      ...(codeBlock.html !== undefined ? { html: codeBlock.html } : {}),
      ...(codeBlock.css !== undefined ? { css: codeBlock.css } : {}),
      ...(codeBlock.js !== undefined ? { js: codeBlock.js } : {}),
    }))
    return
  }

  // Bestehend: String-Format, Erkennung nach Inhalt
  if (codeBlock.includes('<') && codeBlock.includes('>')) {
    setCode(prev => ({ ...prev, html: codeBlock }))
    setActiveFile('html')
  } else if (codeBlock.includes('{') && codeBlock.includes(':') && !codeBlock.includes('function') && !codeBlock.includes('=>')) {
    setCode(prev => ({ ...prev, css: codeBlock }))
    setActiveFile('css')
  } else {
    setCode(prev => ({ ...prev, js: codeBlock }))
    setActiveFile('js')
  }
}
```

---

### Phase 4: Tests aktualisieren (ai-panel.spec.js)

#### Tests die sich aendern muessen:

1. **"KI-ASSISTENT" → "FORGE"**
   - Zeile 103: `text=KI-ASSISTENT` → `text=FORGE`
   - Zeile 118/137: data-testids bleiben gleich

2. **"Kopieren" und "Code uebernehmen" Tests**
   - Zeile 195-196: Diese Buttons existieren jetzt im expandierten Code-Bereich der PreviewCard
   - Test muss zuerst "Code" Button klicken um Code-Section zu oeffnen
   - Alternativ: auf "Einfuegen" Button testen stattdessen

3. **Achievement-Message testen**
   - Neuer Test: Nach "Einfuegen"-Klick sollte Achievement-Text sichtbar sein

4. **Forge-Persoenlichkeit testen**
   - Neuer Test: Initiale Nachricht enthaelt "Forge"
   - Neuer Test: Pattern-Antwort enthaelt forgeIntro Text

#### Empfohlene Test-Aenderungen:

```javascript
// Test: FORGE Tab sichtbar
await expect(page.locator('text=FORGE').first()).toBeVisible()

// Test: PreviewCard sichtbar nach Pattern-Match
test('pattern match shows preview card with insert button', async ({ page }) => {
  await goToFreeMode(page)
  const aiInput = page.locator('[data-testid="ai-input"]')
  await aiInput.fill('erstelle ein quiz mit fragen')
  await page.locator('[data-testid="ai-send-btn"]').click()
  await page.waitForTimeout(2000)
  // PreviewCard sollte sichtbar sein
  await expect(page.locator('text=Einfuegen').first()).toBeVisible({ timeout: 5000 })
})

// Test: Einfuegen Button funktioniert
test('clicking insert button shows achievement message', async ({ page }) => {
  // ... send quiz request, wait for card, click Einfuegen
  await expect(page.locator('text=geschmiedet').first()).toBeVisible()
})
```

---

## Zusammenfassung der Datei-Aenderungen

| Datei | Art | Aenderungen |
|---|---|---|
| `src/hooks/useAIChat.js` | Modifizieren | 3 neue Felder pro Pattern, Smart-Responses umschreiben, findBestResponse/sendMessage Format, Initiale Nachricht |
| `src/components/codeEditor/AIChatPanel.jsx` | Modifizieren | PreviewCard Komponente, Forge Avatar, Tab-Bar "FORGE", Loading-Animation, Message-Rendering-Logik, parseCodeBlocks |
| `src/components/codeEditor/CodeEditorLayout.jsx` | Modifizieren | handleApplyCode akzeptiert Object-Format |
| `tests/ai-panel.spec.js` | Modifizieren | "KI-ASSISTENT"→"FORGE", Code-Button Tests anpassen, neue PreviewCard Tests |

---

## Reihenfolge der Implementierung

1. **useAIChat.js** zuerst (Daten-Schicht, alle neuen Felder und Logik)
2. **AIChatPanel.jsx** danach (UI-Schicht, nutzt neue Daten)
3. **CodeEditorLayout.jsx** (kleine Aenderung an handleApplyCode)
4. **Tests aktualisieren** (an neue UI anpassen)
5. **Playwright Tests ausfuehren** (headless, alle Tests muessen bestehen)

---

## Wichtige Hinweise

- **Response-Texte (Code-Templates) bleiben IDENTISCH** - nur Metadaten werden hinzugefuegt
- **data-testids bleiben IDENTISCH** wo moeglich - nur "KI-ASSISTENT" wird zu "FORGE"
- **SuggestionChips bleiben** - sie funktionieren weiterhin fuer unklare Eingaben
- **Bestehende Funktionalitaet darf NICHT brechen** - Fuzzy-Matching, Multiple-Choice, etc.
- **Playwright IMMER headless** testen (kein Browser-Fenster)
- **Dev-Server** laeuft auf `localhost:5173` oder `localhost:5174`
