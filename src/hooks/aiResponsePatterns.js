/**
 * AI Response Patterns for the Forge KI chat assistant.
 * Extracted from useAIChat.js for better code organization and bundle splitting.
 */

export const FORGE_TIPS = [
  '\n\n💡 **Forge-Tipp:** Kombiniere Quiz + Timer fuer extra Spannung!',
  '\n\n💡 **Forge-Tipp:** Sound-Effekte machen dein Spiel 10x besser!',
  '\n\n💡 **Forge-Tipp:** Teste dein Spiel in der Live-Vorschau rechts!',
  '\n\n💡 **Forge-Tipp:** Ein gutes Punkte-System motiviert Spieler!',
  '\n\n💡 **Forge-Tipp:** Animationen lassen alles professioneller wirken!',
]

export const RESPONSE_PATTERNS = [
  {
    id: 'quiz',
    label: 'Quiz / Fragen',
    icon: '❓',
    difficulty: 2,
    description: 'Interaktives Quiz mit Multiple-Choice, Punkten und Auswertung',
    forgeIntro: '⚔️ Ein Quiz! Forge liebt Wissens-Challenges! Hier ist ein kampferprobtes Quiz-System:',
    triggers: ['quiz', 'fragen', 'question', 'abfrage', 'test', 'pruef', 'raetsel', 'antwort', 'richtig', 'falsch', 'wissen', 'lernen', 'pruefung', 'klausur', 'aufgabe'],
    response: `Hier ist ein komplettes Quiz-System fuer dein Spiel:

\`\`\`html
<div id="quiz-app">
  <div id="quiz-header">
    <h1>Quiz</h1>
    <div id="progress">Frage <span id="current">1</span> von <span id="total">5</span></div>
    <div id="score-display">Punkte: <span id="score">0</span></div>
  </div>
  <div id="question-box">
    <h2 id="question"></h2>
    <div id="options"></div>
  </div>
  <div id="result" style="display:none">
    <h2>Quiz beendet!</h2>
    <p id="final-score"></p>
    <button onclick="startQuiz()">Nochmal spielen</button>
  </div>
</div>
\`\`\`

\`\`\`css
#quiz-app { max-width: 600px; margin: 2rem auto; padding: 2rem; }
#quiz-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 0.5rem; }
#progress { color: #9ca3af; font-size: 0.9rem; }
#score-display { color: #f97316; font-weight: bold; }
#question-box { background: #1f2937; border-radius: 12px; padding: 2rem; }
#question { margin-bottom: 1.5rem; font-size: 1.2rem; }
#options { display: flex; flex-direction: column; gap: 0.75rem; }
#options button { background: #374151; border: 2px solid #4b5563; padding: 1rem; border-radius: 8px; color: white; cursor: pointer; text-align: left; font-size: 1rem; transition: all 0.2s; }
#options button:hover { border-color: #f97316; background: #1f2937; }
#options button.correct { border-color: #22c55e; background: #14532d; }
#options button.wrong { border-color: #ef4444; background: #7f1d1d; }
#result { text-align: center; padding: 3rem; }
#result h2 { color: #f97316; margin-bottom: 1rem; }
\`\`\`

\`\`\`javascript
const questions = [
  { q: "Was ist 2 + 2?", options: ["3", "4", "5", "6"], correct: 1 },
  { q: "Hauptstadt von Deutschland?", options: ["Muenchen", "Berlin", "Hamburg", "Koeln"], correct: 1 },
  { q: "Wie viele Planeten hat unser Sonnensystem?", options: ["7", "8", "9", "10"], correct: 1 },
  { q: "Welches Element hat das Symbol 'O'?", options: ["Gold", "Osmium", "Sauerstoff", "Oganesson"], correct: 2 },
  { q: "In welchem Jahr fiel die Berliner Mauer?", options: ["1987", "1989", "1990", "1991"], correct: 1 }
];

let currentQuestion = 0;
let score = 0;

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  document.getElementById("score").textContent = "0";
  document.getElementById("result").style.display = "none";
  document.getElementById("question-box").style.display = "block";
  document.getElementById("total").textContent = questions.length;
  showQuestion();
}

function showQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("current").textContent = currentQuestion + 1;
  document.getElementById("question").textContent = q.q;
  const optionsEl = document.getElementById("options");
  optionsEl.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(btn, i);
    optionsEl.appendChild(btn);
  });
}

function checkAnswer(btn, index) {
  const buttons = document.querySelectorAll("#options button");
  buttons.forEach(b => { b.disabled = true; b.style.pointerEvents = "none"; });

  if (index === questions[currentQuestion].correct) {
    btn.className = "correct";
    score++;
    document.getElementById("score").textContent = score;
  } else {
    btn.className = "wrong";
    buttons[questions[currentQuestion].correct].className = "correct";
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      document.getElementById("question-box").style.display = "none";
      document.getElementById("result").style.display = "block";
      document.getElementById("final-score").textContent =
        "Du hast " + score + " von " + questions.length + " Fragen richtig!";
    }
  }, 1500);
}

startQuiz();
\`\`\`

Passe die Fragen-Array an dein Thema an. Jede Frage hat: \`q\` (Fragetext), \`options\` (Antwort-Array), \`correct\` (Index der richtigen Antwort).`,
  },
  {
    id: 'timer',
    label: 'Timer / Countdown',
    icon: '⏱️',
    difficulty: 1,
    description: 'Countdown-Timer mit visuellem Fortschritt und Warnfarben',
    forgeIntro: '⏱️ Tick-tock! Forge hat den perfekten Timer geschmiedet!',
    triggers: ['timer', 'zeit', 'countdown', 'stoppuhr', 'uhr', 'zeitlimit', 'sekunde', 'minute', 'ablauf', 'runter', 'zaehlen', 'clock', 'wecker'],
    response: `Hier ist ein Countdown-Timer mit visuellem Fortschritt:

\`\`\`html
<div id="timer-container">
  <div id="timer-circle">
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" class="timer-bg" />
      <circle cx="50" cy="50" r="45" class="timer-progress" id="progress-ring" />
    </svg>
    <span id="timer-text">60</span>
  </div>
  <div id="timer-controls">
    <button onclick="startTimer()">Start</button>
    <button onclick="resetTimer()">Reset</button>
  </div>
</div>
\`\`\`

\`\`\`css
#timer-container { text-align: center; padding: 2rem; }
#timer-circle { position: relative; width: 200px; height: 200px; margin: 0 auto 2rem; }
#timer-circle svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.timer-bg { fill: none; stroke: #374151; stroke-width: 6; }
.timer-progress { fill: none; stroke: #f97316; stroke-width: 6; stroke-linecap: round; stroke-dasharray: 283; stroke-dashoffset: 0; transition: stroke-dashoffset 1s linear; }
#timer-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem; font-weight: bold; color: #f97316; }
#timer-controls { display: flex; gap: 1rem; justify-content: center; }
#timer-controls button { padding: 0.75rem 2rem; }
\`\`\`

\`\`\`javascript
let timeLeft = 60;
let totalTime = 60;
let timerInterval = null;
const circumference = 2 * Math.PI * 45;

function updateDisplay() {
  document.getElementById("timer-text").textContent = timeLeft;
  const offset = circumference * (1 - timeLeft / totalTime);
  document.getElementById("progress-ring").style.strokeDashoffset = offset;

  if (timeLeft <= 10) {
    document.getElementById("timer-text").style.color = "#ef4444";
    document.getElementById("progress-ring").style.stroke = "#ef4444";
  }
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      alert("Zeit abgelaufen!");
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = totalTime;
  document.getElementById("timer-text").style.color = "#f97316";
  document.getElementById("progress-ring").style.stroke = "#f97316";
  updateDisplay();
}

updateDisplay();
\`\`\`

Aendere \`totalTime\` um die Startzeit anzupassen (in Sekunden).`,
  },
  {
    id: 'animation',
    label: 'Animationen',
    icon: '✨',
    difficulty: 1,
    description: 'CSS-Animationen: Fade, Pulse, Shake, Spin, Glow und mehr',
    forgeIntro: '✨ Zeit fuer Magie! Forge\'s Animations-Werkstatt oeffnet!',
    triggers: ['animation', 'animier', 'bewegen', 'effekt', 'transition', 'uebergang', 'fade', 'slide', 'bounce', 'wackeln', 'drehen', 'blinken', 'hover', 'pulsier'],
    response: `Hier sind verschiedene Animationen die du nutzen kannst:

\`\`\`css
/* Einblenden von unten */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pulsieren */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

/* Schuetteln */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Rotieren */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Glow-Effekt */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px #f97316; }
  50% { box-shadow: 0 0 20px #f97316, 0 0 40px #f9731655; }
}

/* Klassen zum Verwenden */
.fade-in { animation: fadeInUp 0.6s ease forwards; }
.pulse { animation: pulse 2s ease infinite; }
.shake { animation: shake 0.5s ease; }
.spin { animation: spin 1s linear infinite; }
.glow { animation: glow 2s ease infinite; }

/* Gestaffelte Animation fuer Listen */
.stagger > * { opacity: 0; animation: fadeInUp 0.5s ease forwards; }
.stagger > *:nth-child(1) { animation-delay: 0.1s; }
.stagger > *:nth-child(2) { animation-delay: 0.2s; }
.stagger > *:nth-child(3) { animation-delay: 0.3s; }
.stagger > *:nth-child(4) { animation-delay: 0.4s; }
.stagger > *:nth-child(5) { animation-delay: 0.5s; }

/* Hover-Effekte */
button { transition: all 0.3s ease; }
button:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4); }
button:active { transform: translateY(0); }
\`\`\`

Fuege die CSS-Klasse \`fade-in\`, \`pulse\`, \`shake\`, \`spin\` oder \`glow\` zu deinen Elementen hinzu. Nutze \`stagger\` auf einem Container fuer gestaffelte Animationen.`,
  },
  {
    id: 'dragdrop',
    label: 'Drag & Drop',
    icon: '🔀',
    difficulty: 2,
    description: 'Drag & Drop Sortier-System mit visueller Rueckmeldung',
    forgeIntro: '🔀 Drag & Drop? Forge\'s Lieblings-Mechanik! Hier, grab dir das:',
    triggers: ['drag', 'ziehen', 'sortier', 'verschieb', 'drop', 'reihenfolge', 'ordnen', 'schieben', 'bewegen', 'position', 'umordnen'],
    response: `Drag & Drop Sortier-System:

\`\`\`html
<div id="drag-container">
  <h2>Sortiere die Elemente</h2>
  <div id="sortable-list">
    <div class="drag-item" draggable="true">Element 1</div>
    <div class="drag-item" draggable="true">Element 2</div>
    <div class="drag-item" draggable="true">Element 3</div>
    <div class="drag-item" draggable="true">Element 4</div>
    <div class="drag-item" draggable="true">Element 5</div>
  </div>
</div>
\`\`\`

\`\`\`css
#drag-container { max-width: 400px; margin: 2rem auto; padding: 2rem; }
#sortable-list { display: flex; flex-direction: column; gap: 0.5rem; }
.drag-item { background: #1f2937; border: 2px solid #374151; padding: 1rem 1.5rem; border-radius: 8px; cursor: grab; user-select: none; transition: all 0.2s; font-size: 1rem; }
.drag-item:active { cursor: grabbing; }
.drag-item.dragging { opacity: 0.5; border-color: #f97316; }
.drag-item.over { border-color: #f97316; background: #1a1a2e; transform: scale(1.02); }
\`\`\`

\`\`\`javascript
const list = document.getElementById("sortable-list");
let draggedItem = null;

list.addEventListener("dragstart", (e) => {
  if (!e.target.classList.contains("drag-item")) return;
  draggedItem = e.target;
  e.target.classList.add("dragging");
});

list.addEventListener("dragend", (e) => {
  e.target.classList.remove("dragging");
  document.querySelectorAll(".drag-item").forEach(item => item.classList.remove("over"));
  draggedItem = null;
});

list.addEventListener("dragover", (e) => {
  e.preventDefault();
  const target = e.target.closest(".drag-item");
  if (!target || target === draggedItem) return;

  document.querySelectorAll(".drag-item").forEach(item => item.classList.remove("over"));
  target.classList.add("over");

  const rect = target.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;
  if (e.clientY < midY) {
    list.insertBefore(draggedItem, target);
  } else {
    list.insertBefore(draggedItem, target.nextSibling);
  }
});
\`\`\`

Die Elemente koennen per Drag & Drop umsortiert werden.`,
  },
  {
    id: 'score',
    label: 'Punkte-System',
    icon: '🏆',
    difficulty: 2,
    description: 'Punkte-System mit Highscore, Combos und Floating-Animationen',
    forgeIntro: '🏆 Punkte-System incoming! Jeder Held braucht einen Score!',
    triggers: ['score', 'punkt', 'zaehler', 'punkte', 'highscore', 'ergebnis', 'gewinn', 'belohn', 'treffer', 'zaehl'],
    response: `Punkte-System mit Highscore:

\`\`\`html
<div id="score-system">
  <div id="score-bar">
    <span>Punkte: <strong id="points">0</strong></span>
    <span>Highscore: <strong id="highscore">0</strong></span>
  </div>
  <div id="game-area">
    <button onclick="addPoints(10)">+10 Punkte</button>
    <button onclick="addPoints(25)">+25 Punkte</button>
    <button onclick="addPoints(50)">+50 Punkte</button>
    <button onclick="resetScore()">Reset</button>
  </div>
  <div id="combo-display"></div>
</div>
\`\`\`

\`\`\`css
#score-bar { display: flex; justify-content: space-between; background: #1f2937; padding: 1rem 2rem; border-radius: 12px; margin-bottom: 2rem; font-size: 1.2rem; }
#score-bar strong { color: #f97316; }
#game-area { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
#combo-display { text-align: center; margin-top: 1rem; font-size: 1.5rem; font-weight: bold; color: #f97316; min-height: 2rem; }
.points-popup { position: fixed; color: #22c55e; font-weight: bold; font-size: 1.5rem; pointer-events: none; animation: floatUp 1s ease forwards; z-index: 100; }
@keyframes floatUp { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-60px); } }
\`\`\`

\`\`\`javascript
let score = 0;
let highscore = parseInt(localStorage.getItem("highscore") || "0");
let combo = 0;
let lastClickTime = 0;

document.getElementById("highscore").textContent = highscore;

function addPoints(amount) {
  const now = Date.now();
  if (now - lastClickTime < 2000) {
    combo++;
    amount = Math.floor(amount * (1 + combo * 0.1));
    document.getElementById("combo-display").textContent = "Combo x" + (combo + 1) + "!";
  } else {
    combo = 0;
    document.getElementById("combo-display").textContent = "";
  }
  lastClickTime = now;

  score += amount;
  document.getElementById("points").textContent = score;

  // Floating points animation
  const popup = document.createElement("div");
  popup.className = "points-popup";
  popup.textContent = "+" + amount;
  popup.style.left = (event.clientX - 20) + "px";
  popup.style.top = (event.clientY - 20) + "px";
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1000);

  if (score > highscore) {
    highscore = score;
    document.getElementById("highscore").textContent = highscore;
    localStorage.setItem("highscore", highscore);
  }
}

function resetScore() {
  score = 0;
  combo = 0;
  document.getElementById("points").textContent = "0";
  document.getElementById("combo-display").textContent = "";
}
\`\`\`

Rufe \`addPoints(anzahl)\` auf wenn Spieler Punkte verdienen. Highscore wird lokal gespeichert.`,
  },
  {
    id: 'memory',
    label: 'Memory-Spiel',
    icon: '🃏',
    difficulty: 2,
    description: 'Memory-Kartenspiel mit Paaren, Zuege-Zaehler und Gewinn-Check',
    forgeIntro: '🃏 Memory! Ein Klassiker aus Forge\'s Sammlung!',
    triggers: ['memory', 'karten', 'paare', 'aufdecken', 'merken', 'memo', 'kartenspiel', 'umdrehen', 'finden', 'gleich'],
    response: `Memory-Kartenspiel:

\`\`\`html
<div id="memory-game">
  <div id="memory-header">
    <h1>Memory</h1>
    <div id="memory-info">
      <span>Zuege: <strong id="moves">0</strong></span>
      <span>Paare: <strong id="pairs">0</strong>/<strong id="total-pairs">8</strong></span>
    </div>
  </div>
  <div id="memory-board"></div>
</div>
\`\`\`

\`\`\`css
#memory-game { max-width: 500px; margin: 1rem auto; padding: 1rem; }
#memory-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
#memory-info { display: flex; gap: 1.5rem; color: #9ca3af; }
#memory-info strong { color: #f97316; }
#memory-board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
.memory-card { aspect-ratio: 1; background: #374151; border-radius: 12px; cursor: pointer; font-size: 2rem; display: flex; align-items: center; justify-content: center; transition: all 0.3s; border: 2px solid #4b5563; }
.memory-card:hover { border-color: #f97316; transform: scale(1.05); }
.memory-card.flipped { background: #1f2937; border-color: #f97316; }
.memory-card.matched { background: #14532d; border-color: #22c55e; }
.memory-card .front { display: none; }
.memory-card .back { color: #6b7280; font-size: 1.5rem; }
.memory-card.flipped .front { display: block; }
.memory-card.flipped .back { display: none; }
\`\`\`

\`\`\`javascript
const emojis = ["🎮", "🎯", "🏆", "⭐", "🔥", "💎", "🎲", "🎪"];
const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

let flipped = [];
let matched = 0;
let moves = 0;
let locked = false;

const board = document.getElementById("memory-board");

cards.forEach((emoji, i) => {
  const card = document.createElement("div");
  card.className = "memory-card";
  card.innerHTML = '<span class="front">' + emoji + '</span><span class="back">?</span>';
  card.onclick = () => flipCard(card, i);
  board.appendChild(card);
});

function flipCard(card, index) {
  if (locked || card.classList.contains("flipped") || card.classList.contains("matched")) return;

  card.classList.add("flipped");
  flipped.push({ card, index });

  if (flipped.length === 2) {
    moves++;
    document.getElementById("moves").textContent = moves;
    locked = true;

    const [a, b] = flipped;
    if (cards[a.index] === cards[b.index]) {
      a.card.classList.add("matched");
      b.card.classList.add("matched");
      matched++;
      document.getElementById("pairs").textContent = matched;
      flipped = [];
      locked = false;

      if (matched === emojis.length) {
        setTimeout(() => alert("Gewonnen! " + moves + " Zuege gebraucht!"), 300);
      }
    } else {
      setTimeout(() => {
        a.card.classList.remove("flipped");
        b.card.classList.remove("flipped");
        flipped = [];
        locked = false;
      }, 800);
    }
  }
}
\`\`\`

Passe das \`emojis\`-Array an um die Kartenpaare zu aendern.`,
  },
  {
    id: 'design',
    label: 'Design / Theme',
    icon: '🎨',
    difficulty: 1,
    description: 'Modernes Dark-Theme mit Glasmorphism, Buttons und Gradient-Text',
    forgeIntro: '🎨 Forge poliert die Ruestung... aeh, das Design!',
    triggers: ['design', 'style', 'farbe', 'color', 'theme', 'dark', 'light', 'hintergrund', 'schoen', 'huebsch', 'modern', 'aussehen', 'look', 'optik', 'css', 'layout', 'neon', 'gradient'],
    response: `Hier ist ein modernes Dark-Theme Design-System:

\`\`\`css
/* Farbvariablen */
:root {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: #334155;
  --accent: #f97316;
  --accent-light: #fb923c;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --success: #22c55e;
  --error: #ef4444;
  --border: #475569;
  --radius: 12px;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* Card-Komponente */
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  transition: all 0.3s ease;
}
.card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* Button-Varianten */
.btn { padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; font-size: 1rem; }
.btn-primary { background: var(--accent); color: white; }
.btn-primary:hover { background: var(--accent-light); transform: translateY(-1px); }
.btn-secondary { background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border); }
.btn-secondary:hover { border-color: var(--accent); }

/* Glasmorphism-Effekt */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius);
}

/* Gradient-Text */
.gradient-text {
  background: linear-gradient(135deg, var(--accent), #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
\`\`\`

Nutze diese CSS-Klassen in deinem HTML: \`card\`, \`btn btn-primary\`, \`btn btn-secondary\`, \`glass\`, \`gradient-text\`.`,
  },
  {
    id: 'input',
    label: 'Eingabe / Formular',
    icon: '📝',
    difficulty: 1,
    description: 'Spieler-Registrierung mit Name, Schwierigkeit und Validierung',
    forgeIntro: '📝 Formulare sind wie Questgeber - sie sammeln die wichtigen Infos!',
    triggers: ['input', 'eingabe', 'formular', 'textfeld', 'form', 'spielername', 'registrier', 'anmeld', 'feld', 'ausfuell'],
    response: `Spieler-Eingabe Formular:

\`\`\`html
<div id="player-form">
  <h2>Spieler-Registrierung</h2>
  <form onsubmit="handleSubmit(event)">
    <div class="form-group">
      <label for="player-name">Spielername</label>
      <input type="text" id="player-name" placeholder="Dein Name..." required maxlength="20" />
    </div>
    <div class="form-group">
      <label>Schwierigkeit</label>
      <div class="radio-group">
        <label class="radio-option"><input type="radio" name="difficulty" value="easy" checked /> Leicht</label>
        <label class="radio-option"><input type="radio" name="difficulty" value="medium" /> Mittel</label>
        <label class="radio-option"><input type="radio" name="difficulty" value="hard" /> Schwer</label>
      </div>
    </div>
    <button type="submit" class="submit-btn">Spiel starten</button>
  </form>
</div>
\`\`\`

\`\`\`css
#player-form { max-width: 400px; margin: 2rem auto; padding: 2rem; background: #1f2937; border-radius: 12px; }
.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; margin-bottom: 0.5rem; color: #9ca3af; font-size: 0.9rem; }
.form-group input[type="text"] { width: 100%; padding: 0.75rem 1rem; background: #111827; border: 2px solid #374151; border-radius: 8px; color: white; font-size: 1rem; }
.form-group input[type="text"]:focus { border-color: #f97316; outline: none; }
.radio-group { display: flex; gap: 1rem; }
.radio-option { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.5rem 1rem; border-radius: 8px; border: 2px solid #374151; transition: all 0.2s; }
.radio-option:has(input:checked) { border-color: #f97316; background: #1a1a2e; }
.radio-option input { accent-color: #f97316; }
.submit-btn { width: 100%; padding: 0.75rem; font-size: 1.1rem; }
\`\`\`

\`\`\`javascript
function handleSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("player-name").value;
  const difficulty = document.querySelector('input[name="difficulty"]:checked').value;

  document.getElementById("player-form").innerHTML =
    '<h2>Willkommen, ' + name + '!</h2>' +
    '<p>Schwierigkeit: ' + difficulty + '</p>' +
    '<p>Das Spiel startet...</p>';
}
\`\`\``,
  },
  {
    id: 'random',
    label: 'Wuerfel / Zufall',
    icon: '🎲',
    difficulty: 1,
    description: 'Wuerfelspiel mit Animation, Pasch-Erkennung und Historie',
    forgeIntro: '🎲 Forge liebt den Zufall! Moege das Glueck mit dir sein!',
    triggers: ['zufall', 'random', 'wuerfel', 'zufaellig', 'glueck', 'wuerfeln', 'los', 'chance', 'wahrscheinlich'],
    response: `Wuerfelspiel mit Zufallsgenerator:

\`\`\`html
<div id="dice-game">
  <h2>Wuerfelspiel</h2>
  <div id="dice-display">
    <div class="die" id="die1">1</div>
    <div class="die" id="die2">1</div>
  </div>
  <button id="roll-btn" onclick="rollDice()">Wuerfeln!</button>
  <div id="roll-result"></div>
  <div id="roll-history"></div>
</div>
\`\`\`

\`\`\`css
#dice-game { text-align: center; padding: 2rem; }
#dice-display { display: flex; gap: 2rem; justify-content: center; margin: 2rem 0; }
.die { width: 80px; height: 80px; background: #1f2937; border: 3px solid #f97316; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: bold; color: #f97316; transition: transform 0.3s; }
.die.rolling { animation: diceRoll 0.5s ease; }
@keyframes diceRoll { 0% { transform: rotateZ(0); } 25% { transform: rotateZ(90deg) scale(0.8); } 50% { transform: rotateZ(180deg) scale(1.1); } 75% { transform: rotateZ(270deg) scale(0.9); } 100% { transform: rotateZ(360deg) scale(1); } }
#roll-btn { font-size: 1.2rem; padding: 1rem 3rem; margin-bottom: 1rem; }
#roll-result { font-size: 1.2rem; color: #f97316; margin-bottom: 1rem; min-height: 2rem; }
#roll-history { color: #6b7280; font-size: 0.9rem; }
\`\`\`

\`\`\`javascript
let rollCount = 0;
const history = [];

function rollDice() {
  const btn = document.getElementById("roll-btn");
  btn.disabled = true;

  const die1 = document.getElementById("die1");
  const die2 = document.getElementById("die2");
  die1.classList.add("rolling");
  die2.classList.add("rolling");

  // Schnelle Zufallszahlen-Animation
  let iterations = 0;
  const interval = setInterval(() => {
    die1.textContent = Math.floor(Math.random() * 6) + 1;
    die2.textContent = Math.floor(Math.random() * 6) + 1;
    iterations++;
    if (iterations > 10) {
      clearInterval(interval);
      const val1 = Math.floor(Math.random() * 6) + 1;
      const val2 = Math.floor(Math.random() * 6) + 1;
      die1.textContent = val1;
      die2.textContent = val2;
      die1.classList.remove("rolling");
      die2.classList.remove("rolling");

      rollCount++;
      const sum = val1 + val2;
      let msg = "Wurf #" + rollCount + ": " + val1 + " + " + val2 + " = " + sum;
      if (val1 === val2) msg += " (Pasch!)";

      document.getElementById("roll-result").textContent = msg;
      history.unshift(msg);
      document.getElementById("roll-history").textContent = "Letzte Wuerfe: " + history.slice(0, 5).join(" | ");
      btn.disabled = false;
    }
  }, 50);
}
\`\`\``,
  },
  {
    id: 'progress',
    label: 'Level / Fortschritt',
    icon: '📊',
    difficulty: 2,
    description: 'Level- und XP-System mit Fortschrittsbalken und Level-Up',
    forgeIntro: '📊 Level-System! Der Weg zum Meister beginnt bei Level 1!',
    triggers: ['fortschritt', 'progress', 'balken', 'bar', 'level', 'xp', 'erfahrung', 'stufe', 'aufstieg', 'rang'],
    response: `Fortschritts- und Level-System:

\`\`\`html
<div id="progress-system">
  <div id="level-display">
    <span id="level-badge">Level 1</span>
    <div id="xp-bar-container">
      <div id="xp-bar"></div>
      <span id="xp-text">0 / 100 XP</span>
    </div>
  </div>
  <div id="action-buttons">
    <button onclick="gainXP(10)">+10 XP (Leicht)</button>
    <button onclick="gainXP(25)">+25 XP (Mittel)</button>
    <button onclick="gainXP(50)">+50 XP (Schwer)</button>
  </div>
  <div id="level-up-msg"></div>
</div>
\`\`\`

\`\`\`css
#progress-system { max-width: 500px; margin: 2rem auto; padding: 2rem; }
#level-display { background: #1f2937; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
#level-badge { background: #f97316; color: white; padding: 0.25rem 1rem; border-radius: 20px; font-weight: bold; font-size: 0.9rem; }
#xp-bar-container { position: relative; height: 24px; background: #374151; border-radius: 12px; margin-top: 1rem; overflow: hidden; }
#xp-bar { height: 100%; background: linear-gradient(90deg, #f97316, #eab308); border-radius: 12px; width: 0%; transition: width 0.5s ease; }
#xp-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.75rem; font-weight: bold; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
#action-buttons { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
#level-up-msg { text-align: center; margin-top: 1rem; font-size: 1.5rem; font-weight: bold; color: #eab308; min-height: 2rem; }
\`\`\`

\`\`\`javascript
let level = 1;
let xp = 0;
let xpNeeded = 100;

function gainXP(amount) {
  xp += amount;
  document.getElementById("level-up-msg").textContent = "";

  while (xp >= xpNeeded) {
    xp -= xpNeeded;
    level++;
    xpNeeded = Math.floor(xpNeeded * 1.5);
    document.getElementById("level-badge").textContent = "Level " + level;
    document.getElementById("level-up-msg").textContent = "LEVEL UP! Level " + level + " erreicht!";
  }

  const percent = (xp / xpNeeded) * 100;
  document.getElementById("xp-bar").style.width = percent + "%";
  document.getElementById("xp-text").textContent = xp + " / " + xpNeeded + " XP";
}
\`\`\`

Rufe \`gainXP(menge)\` auf wenn Spieler Erfahrung sammeln.`,
  },
  {
    id: 'sound',
    label: 'Sound-Effekte',
    icon: '🔊',
    difficulty: 2,
    description: 'Sound-Effekte mit Web Audio API - keine Dateien noetig',
    forgeIntro: '🔊 Sound-Effekte! Jedes gute Spiel braucht seinen Soundtrack!',
    triggers: ['sound', 'ton', 'musik', 'audio', 'klang', 'geraeusch', 'melodie', 'laut', 'piep', 'jingle'],
    response: `Sound-System mit Web Audio API (keine externen Dateien noetig):

\`\`\`javascript
// Sound-Generator mit Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(frequency, duration, type = "sine") {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.type = type; // sine, square, triangle, sawtooth
  oscillator.frequency.value = frequency;
  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

// Vordefinierte Sounds
function playCorrect() { playTone(523, 0.15); setTimeout(() => playTone(659, 0.15), 100); setTimeout(() => playTone(784, 0.3), 200); }
function playWrong() { playTone(200, 0.3, "square"); }
function playClick() { playTone(800, 0.05, "square"); }
function playLevelUp() {
  [523, 587, 659, 784, 880].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2), i * 100);
  });
}
function playGameOver() {
  [400, 350, 300, 250].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, "sawtooth"), i * 200);
  });
}

// Verwendung: playCorrect(), playWrong(), playClick(), playLevelUp(), playGameOver()
\`\`\`

Rufe die Funktionen auf bei Events: \`playCorrect()\` bei richtiger Antwort, \`playWrong()\` bei falscher, usw. Keine externen Audio-Dateien noetig!`,
  },
  {
    id: 'leaderboard',
    label: 'Bestenliste',
    icon: '🥇',
    difficulty: 2,
    description: 'Bestenliste mit Medaillen, LocalStorage und Echtzeit-Sortierung',
    forgeIntro: '🥇 Eine Bestenliste! Hier werden Legenden geschrieben!',
    triggers: ['tabelle', 'table', 'rangliste', 'leaderboard', 'bestenliste', 'ranking', 'top', 'platz', 'gewinner'],
    response: `Leaderboard / Bestenliste:

\`\`\`html
<div id="leaderboard">
  <h2>Bestenliste</h2>
  <div id="add-score">
    <input type="text" id="player-input" placeholder="Name..." maxlength="15" />
    <input type="number" id="score-input" placeholder="Score" min="0" />
    <button onclick="addToLeaderboard()">Eintragen</button>
  </div>
  <table id="score-table">
    <thead><tr><th>#</th><th>Spieler</th><th>Score</th><th>Datum</th></tr></thead>
    <tbody id="score-body"></tbody>
  </table>
</div>
\`\`\`

\`\`\`css
#leaderboard { max-width: 500px; margin: 2rem auto; padding: 2rem; }
#add-score { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
#add-score input { flex: 1; padding: 0.5rem; background: #1f2937; border: 2px solid #374151; border-radius: 8px; color: white; }
#add-score input:focus { border-color: #f97316; outline: none; }
#score-table { width: 100%; border-collapse: collapse; }
#score-table th { text-align: left; padding: 0.75rem; border-bottom: 2px solid #f97316; color: #f97316; font-size: 0.85rem; text-transform: uppercase; }
#score-table td { padding: 0.75rem; border-bottom: 1px solid #374151; }
#score-table tr:hover td { background: #1f2937; }
.rank-1 td:first-child { color: #eab308; font-weight: bold; }
.rank-2 td:first-child { color: #94a3b8; font-weight: bold; }
.rank-3 td:first-child { color: #b45309; font-weight: bold; }
\`\`\`

\`\`\`javascript
let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");

function renderLeaderboard() {
  const body = document.getElementById("score-body");
  body.innerHTML = "";
  leaderboard
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .forEach((entry, i) => {
      const tr = document.createElement("tr");
      tr.className = i < 3 ? "rank-" + (i + 1) : "";
      const medal = i === 0 ? " 🥇" : i === 1 ? " 🥈" : i === 2 ? " 🥉" : "";
      tr.innerHTML = "<td>" + (i + 1) + medal + "</td><td>" + entry.name + "</td><td>" + entry.score + "</td><td>" + entry.date + "</td>";
      body.appendChild(tr);
    });
}

function addToLeaderboard() {
  const name = document.getElementById("player-input").value.trim();
  const score = parseInt(document.getElementById("score-input").value);
  if (!name || isNaN(score)) return;

  leaderboard.push({ name, score, date: new Date().toLocaleDateString("de-DE") });
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  renderLeaderboard();
  document.getElementById("player-input").value = "";
  document.getElementById("score-input").value = "";
}

renderLeaderboard();
\`\`\`

Die Bestenliste wird im LocalStorage gespeichert und bleibt erhalten.`,
  },
  {
    id: 'help',
    label: 'Hilfe',
    icon: '💡',
    triggers: ['hilfe', 'help', 'was kannst', 'befehle', 'commands', 'anleitung', 'uebersicht', 'moeglichkeit'],
    response: `🤖⚒️ **Forge's Arsenal** - hier ist alles was ich fuer dich schmieden kann!

**⚔️ Spielmechaniken:**
- \`quiz\` / \`fragen\` - Quiz-System mit Punkten
- \`memory\` / \`karten\` - Memory-Kartenspiel
- \`drag\` / \`sortieren\` - Drag & Drop Elemente
- \`wuerfel\` / \`zufall\` - Zufallsgenerator / Wuerfelspiel

**🎮 UI-Elemente:**
- \`timer\` / \`countdown\` - Countdown-Timer
- \`score\` / \`punkte\` - Punkte-System mit Highscore
- \`progress\` / \`level\` - Fortschritt & Level-System
- \`leaderboard\` / \`rangliste\` - Bestenliste
- \`input\` / \`formular\` - Eingabeformulare

**✨ Design & Effekte:**
- \`animation\` / \`effekt\` - CSS-Animationen
- \`design\` / \`style\` - Modernes Theme-System
- \`sound\` / \`ton\` - Sound-Effekte (ohne Dateien)

**💡 Forge-Tipps:**
- Sag mir was du brauchst und ich schmiede den Code!
- Klicke "Einfuegen" auf den Karten um Code direkt einzufuegen
- Kombiniere mehrere Elemente fuer epische Spiele!`,
  },
]

export const SMART_RESPONSES = [
  {
    triggers: ['hallo', 'hey', 'moin', 'guten tag', 'servus'],
    exactTriggers: ['hi'],
    response: `Yo, Abenteurer! 🤖⚒️ Forge ist bereit!

Was soll ich dir schmieden? Sag mir z.B.:
- **"Quiz"** fuer ein Frage-System
- **"Timer"** fuer einen Countdown
- **"Memory"** fuer ein Kartenspiel
- **"hilfe"** fuer mein volles Arsenal!`,
  },
  {
    triggers: ['danke', 'super', 'perfekt', 'geil', 'toll', 'klasse', 'nice', 'cool', 'mega', 'hammer'],
    response: `Freut mich, Abenteurer! ⚒️✨

Forge ist stolz auf sein Werk! Brauchst du noch mehr? Ich kann dir weitere Elemente schmieden oder bestehende verbessern!`,
  },
  {
    triggers: ['fehler', 'error', 'bug', 'kaputt', 'funktioniert nicht', 'geht nicht', 'problem', 'hilfe fehler'],
    response: `Hmm, ein Bug? Forge kennt das! 🔧

**Haeufige Loesungen:**
1. Browser-Konsole oeffnen (F12) und Fehlermeldung checken
2. \`console.log()\` einbauen um Werte zu pruefen
3. HTML-Struktur pruefen → IDs muessen einzigartig sein
   - Syntax-Fehler → Klammern \`{}\`, \`()\` checken
   - CSS wirkt nicht → Selektoren und Tippfehler pruefen

Beschreib den Fehler genauer und Forge findet die Loesung! 🔧`,
  },
]

// ============= BUG DETECTION PATTERNS =============
export const BUG_PATTERNS = [
  { pattern: /onclick\s*=\s*["']/i, severity: 'warning', message: 'Inline onclick gefunden. Besser: addEventListener() verwenden fuer sauberen Code.' },
  { pattern: /document\.write\s*\(/i, severity: 'error', message: 'document.write() kann die ganze Seite ueberschreiben! Nutze stattdessen innerHTML oder createElement().' },
  { pattern: /eval\s*\(/i, severity: 'error', message: 'eval() ist ein Sicherheitsrisiko! Vermeide es und nutze sichere Alternativen.' },
  { pattern: /var\s+\w/i, severity: 'info', message: 'Tipp: Nutze "let" oder "const" statt "var" fuer besseres Scoping.' },
  { pattern: /==(?!=)/g, severity: 'warning', message: 'Lockerer Vergleich (==) gefunden. Nutze === fuer strenge Typ-Pruefung.' },
  { pattern: /setTimeout\s*\(\s*["']/i, severity: 'warning', message: 'String in setTimeout gefunden. Nutze eine Funktion statt eines Strings.' },
  { pattern: /innerHTML\s*=.*<script/i, severity: 'error', message: 'Script-Tag in innerHTML ist ein XSS-Risiko! Nutze textContent oder sanitize den Input.' },
  { pattern: /\.style\.\w+\s*=(?!.*px|%|em|rem|vh|vw|s|ms)/i, severity: 'info', message: 'Tipp: CSS-Eigenschaften brauchen oft Einheiten (px, %, em, rem).' },
  { pattern: /for\s*\(.*\.length/g, severity: 'info', message: 'Tipp: Speichere .length in einer Variable fuer bessere Performance bei grossen Listen.' },
  { pattern: /console\.log/g, severity: 'info', message: 'console.log gefunden. Vergiss nicht, Debug-Ausgaben vor dem Veroeffentlichen zu entfernen!' },
]

export function detectBugs(code) {
  const issues = []
  for (const bp of BUG_PATTERNS) {
    if (bp.pattern.test(code)) {
      issues.push({ severity: bp.severity, message: bp.message })
    }
    bp.pattern.lastIndex = 0 // Reset regex
  }
  return issues
}

// ============= DESIGN SUGGESTIONS =============
export const DESIGN_SUGGESTIONS = {
  quiz: {
    colors: 'Verwende Gruen (#22c55e) fuer richtige und Rot (#ef4444) fuer falsche Antworten. Akzentfarbe fuer Buttons.',
    layout: 'Zentriertes Layout (max-width: 600px). Frage oben, Antworten als vertikale Liste, Fortschrittsbalken.',
    animations: 'Sanftes Einblenden der Fragen. Shake-Animation bei falscher Antwort. Konfetti bei 100%.',
    fonts: 'Grosse, lesbare Schrift fuer Fragen (1.2rem+). Buttons mindestens 44px Touch-Target.',
  },
  memory: {
    colors: 'Neutrale Kartenrueckseiten. Bunte Vorderseiten. Goldener Rahmen fuer gefundene Paare.',
    layout: 'Quadratisches Grid (3x3, 4x4, 5x5). Gleichmaessige Abstande. Responsiv.',
    animations: 'Flip-Animation beim Aufdecken (transform: rotateY). Bounce bei Match. Fade-Out bei Paaren.',
    fonts: 'Grosse Emojis/Bilder auf den Karten. Zuege-Zaehler gut sichtbar.',
  },
  learning: {
    colors: 'Beruhigende Blautoene (#1e3a8a, #3b82f6). Gruen fuer Fortschritt. Orange fuer Highlights.',
    layout: 'Schrittweise Progression. Sichtbarer Fortschritt. Klare Abschnitte.',
    animations: 'Sanfte Uebergaenge. Kein visueller Stress. Celebration bei Abschluss.',
    fonts: 'Gut lesbar, grosse Zeilenhoehe. Kopierfaehiger Text.',
  },
  action: {
    colors: 'Hoher Kontrast. Neon-Akzente. Dunkler Hintergrund fuer Fokus.',
    layout: 'Vollbild-Canvas oder Grid. Score immer sichtbar. Controls am unteren Rand fuer Mobile.',
    animations: 'Schnelle, knackige Animationen. Partikel-Effekte. Screen-Shake bei Kollisionen.',
    fonts: 'Fette, markante Schrift fuer Score. Pixel-Font optional fuer Retro-Look.',
  },
}

export function getDesignSuggestion(gameType) {
  return DESIGN_SUGGESTIONS[gameType] || DESIGN_SUGGESTIONS.learning
}

// ============= LEARNING MATERIAL CHECK =============
export function checkLearningQuality(content) {
  const feedback = []

  // Check for question clarity
  if (content.questions) {
    const shortQuestions = content.questions.filter(q => q.text && q.text.length < 15)
    if (shortQuestions.length > 0) {
      feedback.push({ type: 'warning', message: `${shortQuestions.length} Frage(n) sind sehr kurz. Laengere, klarere Fragen helfen beim Lernen.` })
    }

    // Check for answer variety
    const singleOptionQuestions = content.questions.filter(q => q.options && q.options.length < 3)
    if (singleOptionQuestions.length > 0) {
      feedback.push({ type: 'warning', message: `${singleOptionQuestions.length} Frage(n) haben weniger als 3 Antwortmoeglichkeiten. Mehr Optionen machen es anspruchsvoller.` })
    }

    // Check for explanations
    const noExplanation = content.questions.filter(q => !q.explanation)
    if (noExplanation.length > 0) {
      feedback.push({ type: 'info', message: `${noExplanation.length} Frage(n) haben keine Erklaerung. Erklaerungen helfen beim Verstaendnis.` })
    }

    // Minimum questions check
    if (content.questions.length < 5) {
      feedback.push({ type: 'warning', message: 'Weniger als 5 Fragen. Empfehlung: Mindestens 5-10 Fragen fuer ein gutes Lernerlebnis.' })
    }

    if (content.questions.length >= 10) {
      feedback.push({ type: 'success', message: 'Gute Anzahl an Fragen! Das ergibt ein solides Lernerlebnis.' })
    }
  }

  // Check for metadata
  if (!content.description || content.description.length < 20) {
    feedback.push({ type: 'info', message: 'Eine ausfuehrlichere Beschreibung hilft Spielern zu verstehen, was sie lernen werden.' })
  }

  if (!content.subject) {
    feedback.push({ type: 'warning', message: 'Kein Fach/Thema gewaehlt. Das hilft bei der Kategorisierung und Auffindbarkeit.' })
  }

  if (content.tags && content.tags.length < 2) {
    feedback.push({ type: 'info', message: 'Mehr Tags erhoehen die Auffindbarkeit deines Spiels.' })
  }

  if (feedback.length === 0) {
    feedback.push({ type: 'success', message: 'Alles sieht gut aus! Dein Lernspiel ist bereit zur Veroeffentlichung.' })
  }

  return feedback
}

// ============= CODE GENERATION TEMPLATES =============
export const FULL_GAME_TEMPLATES = {
  'quiz-komplett': {
    name: 'Komplettes Quiz',
    description: 'Quiz mit Timer, Punkten, Fortschritt und Ergebnis-Screen',
    html: `<div id="app">
  <div id="start-screen">
    <h1>Quiz</h1>
    <p>Teste dein Wissen!</p>
    <button onclick="startGame()">Start</button>
  </div>
  <div id="game-screen" style="display:none">
    <div id="header">
      <span id="progress">1/10</span>
      <span id="timer">30s</span>
      <span id="score">0 Punkte</span>
    </div>
    <div id="timer-bar"><div id="timer-fill"></div></div>
    <h2 id="question"></h2>
    <div id="answers"></div>
  </div>
  <div id="result-screen" style="display:none">
    <h1 id="result-title"></h1>
    <p id="result-text"></p>
    <button onclick="startGame()">Nochmal</button>
  </div>
</div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #0f172a; color: #f1f5f9; font-family: system-ui; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
#app { width: 100%; max-width: 600px; padding: 2rem; }
#start-screen, #result-screen { text-align: center; }
h1 { font-size: 2.5rem; margin-bottom: 1rem; background: linear-gradient(135deg, #f97316, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
button { background: #f97316; color: white; border: none; padding: 1rem 2rem; border-radius: 12px; font-size: 1.1rem; cursor: pointer; font-weight: 600; transition: all 0.2s; }
button:hover { background: #ea580c; transform: translateY(-2px); }
#header { display: flex; justify-content: space-between; margin-bottom: 1rem; color: #94a3b8; }
#timer-bar { height: 4px; background: #334155; border-radius: 2px; margin-bottom: 2rem; overflow: hidden; }
#timer-fill { height: 100%; background: #f97316; width: 100%; transition: width 1s linear; }
#question { font-size: 1.3rem; margin-bottom: 1.5rem; line-height: 1.5; }
#answers { display: flex; flex-direction: column; gap: 0.75rem; }
#answers button { background: #1e293b; border: 2px solid #334155; text-align: left; }
#answers button:hover { border-color: #f97316; background: #0f172a; }
#answers button.correct { border-color: #22c55e; background: #14532d; }
#answers button.wrong { border-color: #ef4444; background: #7f1d1d; }`,
    js: `const questions = [
  { q: "Was ist die Hauptstadt von Deutschland?", options: ["Berlin", "Muenchen", "Hamburg", "Koeln"], correct: 0 },
  { q: "Welches Element hat das Symbol O?", options: ["Gold", "Silber", "Sauerstoff", "Eisen"], correct: 2 },
  { q: "Wie viele Planeten hat unser Sonnensystem?", options: ["7", "8", "9", "10"], correct: 1 },
  { q: "Wer malte die Mona Lisa?", options: ["Picasso", "Da Vinci", "Monet", "Van Gogh"], correct: 1 },
  { q: "Was ist 7 x 8?", options: ["54", "56", "58", "64"], correct: 1 },
];

let current = 0, score = 0, timer, timeLeft = 30;

function startGame() {
  current = 0; score = 0; timeLeft = 30;
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  showQuestion();
}

function showQuestion() {
  if (current >= questions.length) return showResult();
  const q = questions[current];
  document.getElementById("question").textContent = q.q;
  document.getElementById("progress").textContent = (current+1) + "/" + questions.length;
  document.getElementById("score").textContent = score + " Punkte";
  timeLeft = 30;
  updateTimer();
  clearInterval(timer);
  timer = setInterval(() => { timeLeft--; updateTimer(); if (timeLeft <= 0) { answer(-1); } }, 1000);
  const container = document.getElementById("answers");
  container.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => answer(i);
    container.appendChild(btn);
  });
}

function updateTimer() {
  document.getElementById("timer").textContent = timeLeft + "s";
  document.getElementById("timer-fill").style.width = (timeLeft/30*100) + "%";
  document.getElementById("timer-fill").style.background = timeLeft <= 5 ? "#ef4444" : timeLeft <= 10 ? "#f59e0b" : "#f97316";
}

function answer(i) {
  clearInterval(timer);
  const btns = document.querySelectorAll("#answers button");
  const correct = questions[current].correct;
  btns[correct].classList.add("correct");
  if (i === correct) score += 10;
  else if (i >= 0) btns[i].classList.add("wrong");
  btns.forEach(b => b.disabled = true);
  setTimeout(() => { current++; showQuestion(); }, 1200);
}

function showResult() {
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "block";
  const pct = Math.round(score / (questions.length * 10) * 100);
  document.getElementById("result-title").textContent = pct >= 80 ? "Ausgezeichnet!" : pct >= 50 ? "Gut gemacht!" : "Weiter ueben!";
  document.getElementById("result-text").textContent = score + " von " + (questions.length * 10) + " Punkten (" + pct + "%)";
}`,
  },
}

export function generateGameFromDescription(description) {
  const desc = description.toLowerCase()
  if (desc.includes('quiz') || desc.includes('fragen') || desc.includes('wissen')) {
    return { templateId: 'quiz-komplett', template: FULL_GAME_TEMPLATES['quiz-komplett'] }
  }
  return null
}
