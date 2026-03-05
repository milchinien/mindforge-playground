/**
 * Mock AI Service - Platzhalter fuer echte KI-Integration.
 * Generiert Spiel-Code basierend auf User-Input via Pattern-Matching.
 * Kann spaeter durch echte API-Calls ersetzt werden.
 */

const GAME_TEMPLATES = {
  quiz: {
    keywords: ['quiz', 'fragen', 'multiple choice', 'wissenstest', 'test', 'abfrage', 'pruefung'],
    generate: (topic, details) => ({
      greeting: `Ich schmiede dir ein **Quiz-Spiel**${topic ? ` zum Thema "${topic}"` : ''}! Das wird ein starkes Stueck Wissen-Stahl.`,
      html: `<div id="app">
  <div id="quiz-header">
    <h1>${topic ? topic + ' Quiz' : 'Wissens-Quiz'}</h1>
    <div id="progress-bar"><div id="progress-fill"></div></div>
    <div id="stats">
      <span>Frage <span id="current-q">1</span>/<span id="total-q">5</span></span>
      <span id="timer">30s</span>
      <span>Score: <span id="score">0</span></span>
    </div>
  </div>
  <div id="question-box">
    <p id="question-text"></p>
    <div id="answers"></div>
  </div>
  <div id="result-screen" class="hidden">
    <h2 id="result-title"></h2>
    <p id="result-text"></p>
    <div id="result-score"></div>
    <button id="restart-btn" onclick="startQuiz()">Nochmal spielen</button>
  </div>
</div>`,
      css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Segoe UI', sans-serif;
  background: #111827;
  color: #f9fafb;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
#app { width: 100%; max-width: 600px; padding: 2rem; }
#quiz-header { text-align: center; margin-bottom: 2rem; }
#quiz-header h1 { color: #f97316; font-size: 1.8rem; margin-bottom: 1rem; }
#progress-bar {
  width: 100%; height: 6px; background: #374151; border-radius: 3px; overflow: hidden; margin-bottom: 0.75rem;
}
#progress-fill { height: 100%; background: #f97316; width: 20%; transition: width 0.3s; border-radius: 3px; }
#stats { display: flex; justify-content: space-between; font-size: 0.85rem; color: #9ca3af; }
#timer { color: #f97316; font-weight: bold; }
#question-box { background: #1f2937; border-radius: 16px; padding: 2rem; }
#question-text { font-size: 1.2rem; margin-bottom: 1.5rem; line-height: 1.5; }
#answers { display: grid; gap: 0.75rem; }
.answer-btn {
  background: #374151; border: 2px solid transparent; border-radius: 12px;
  padding: 1rem 1.25rem; color: #f9fafb; font-size: 1rem; cursor: pointer;
  text-align: left; transition: all 0.2s;
}
.answer-btn:hover { border-color: #f97316; background: #374151dd; }
.answer-btn.correct { border-color: #10b981; background: #10b98120; }
.answer-btn.wrong { border-color: #ef4444; background: #ef444420; }
.answer-btn.disabled { pointer-events: none; opacity: 0.6; }
#result-screen { text-align: center; padding: 3rem; }
#result-screen.hidden { display: none; }
#result-title { font-size: 2rem; color: #f97316; margin-bottom: 0.5rem; }
#result-text { color: #9ca3af; margin-bottom: 1.5rem; }
#result-score { font-size: 3rem; font-weight: bold; color: #f97316; margin-bottom: 2rem; }
#restart-btn {
  background: #f97316; color: white; border: none; padding: 12px 32px;
  border-radius: 12px; font-size: 1rem; cursor: pointer; transition: background 0.2s;
}
#restart-btn:hover { background: #ea580c; }`,
      js: `const questions = [
  { q: "${topic || 'Allgemeinwissen'}: Was ist die Hauptstadt von Frankreich?", options: ["Berlin", "Paris", "London", "Madrid"], correct: 1 },
  { q: "Welches Element hat das Symbol 'O'?", options: ["Gold", "Osmium", "Sauerstoff", "Zink"], correct: 2 },
  { q: "Wie viele Planeten hat unser Sonnensystem?", options: ["7", "8", "9", "10"], correct: 1 },
  { q: "Wer schrieb 'Faust'?", options: ["Schiller", "Goethe", "Lessing", "Kafka"], correct: 1 },
  { q: "Was ist die groesste Wueste der Welt?", options: ["Sahara", "Gobi", "Antarktis", "Kalahari"], correct: 2 }
];
let current = 0, score = 0, timer, timeLeft;

function startQuiz() {
  current = 0; score = 0;
  document.getElementById('score').textContent = '0';
  document.getElementById('question-box').style.display = 'block';
  document.getElementById('result-screen').classList.add('hidden');
  showQuestion();
}

function showQuestion() {
  const q = questions[current];
  document.getElementById('current-q').textContent = current + 1;
  document.getElementById('total-q').textContent = questions.length;
  document.getElementById('progress-fill').style.width = ((current + 1) / questions.length * 100) + '%';
  document.getElementById('question-text').textContent = q.q;

  const answersDiv = document.getElementById('answers');
  answersDiv.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i);
    answersDiv.appendChild(btn);
  });

  timeLeft = 30;
  document.getElementById('timer').textContent = timeLeft + 's';
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft + 's';
    if (timeLeft <= 0) { clearInterval(timer); selectAnswer(-1); }
  }, 1000);
}

function selectAnswer(idx) {
  clearInterval(timer);
  const q = questions[current];
  const btns = document.querySelectorAll('.answer-btn');
  btns.forEach((btn, i) => {
    btn.classList.add('disabled');
    if (i === q.correct) btn.classList.add('correct');
    if (i === idx && idx !== q.correct) btn.classList.add('wrong');
  });
  if (idx === q.correct) { score += 10; document.getElementById('score').textContent = score; }

  setTimeout(() => {
    current++;
    if (current < questions.length) { showQuestion(); }
    else { showResult(); }
  }, 1200);
}

function showResult() {
  document.getElementById('question-box').style.display = 'none';
  const screen = document.getElementById('result-screen');
  screen.classList.remove('hidden');
  const pct = Math.round(score / (questions.length * 10) * 100);
  document.getElementById('result-title').textContent = pct >= 80 ? 'Ausgezeichnet!' : pct >= 50 ? 'Gut gemacht!' : 'Weiter ueben!';
  document.getElementById('result-text').textContent = score + ' von ' + (questions.length * 10) + ' Punkten';
  document.getElementById('result-score').textContent = pct + '%';
}

startQuiz();`
    }),
  },

  memory: {
    keywords: ['memory', 'kartenspiel', 'paare', 'matching', 'zuordnen', 'karten'],
    generate: (topic) => ({
      greeting: `Ein **Memory-Spiel**${topic ? ` mit "${topic}"` : ''} wird geschmiedet! Die Karten gluehen schon in der Esse.`,
      html: `<div id="app">
  <h1>Memory</h1>
  <div id="stats">
    <span>Zuege: <span id="moves">0</span></span>
    <span>Paare: <span id="pairs">0</span>/8</span>
    <span id="timer-display">0:00</span>
  </div>
  <div id="grid"></div>
  <div id="win-screen" class="hidden">
    <h2>Gewonnen!</h2>
    <p id="win-text"></p>
    <button onclick="initGame()">Nochmal</button>
  </div>
</div>`,
      css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', sans-serif; background: #111827; color: #f9fafb; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
#app { text-align: center; padding: 2rem; }
h1 { color: #f97316; font-size: 2rem; margin-bottom: 1rem; }
#stats { display: flex; justify-content: center; gap: 2rem; margin-bottom: 1.5rem; font-size: 0.9rem; color: #9ca3af; }
#timer-display { color: #f97316; font-weight: bold; }
#grid { display: grid; grid-template-columns: repeat(4, 80px); gap: 10px; justify-content: center; }
.card {
  width: 80px; height: 80px; background: #1f2937; border: 2px solid #374151;
  border-radius: 12px; cursor: pointer; display: flex; align-items: center;
  justify-content: center; font-size: 2rem; transition: all 0.3s;
  perspective: 600px; user-select: none;
}
.card:hover { border-color: #f97316; transform: scale(1.05); }
.card.flipped { background: #f9731620; border-color: #f97316; }
.card.matched { background: #10b98120; border-color: #10b981; pointer-events: none; }
.card .face { display: none; }
.card.flipped .face, .card.matched .face { display: block; }
.card .back { display: block; color: #4b5563; font-size: 1.5rem; }
.card.flipped .back, .card.matched .back { display: none; }
#win-screen { margin-top: 2rem; }
#win-screen.hidden { display: none; }
#win-screen h2 { color: #10b981; font-size: 1.8rem; margin-bottom: 0.5rem; }
#win-screen button {
  margin-top: 1rem; background: #f97316; color: white; border: none; padding: 10px 24px;
  border-radius: 10px; font-size: 1rem; cursor: pointer;
}
#win-screen button:hover { background: #ea580c; }`,
      js: `const emojis = ['🎓', '📚', '🔬', '🎨', '🎵', '🌍', '💡', '🏆'];
let cards, flipped = [], moves = 0, matched = 0, timer, seconds = 0, canFlip = true;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function initGame() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  flipped = []; moves = 0; matched = 0; seconds = 0; canFlip = true;
  document.getElementById('moves').textContent = '0';
  document.getElementById('pairs').textContent = '0';
  document.getElementById('timer-display').textContent = '0:00';
  document.getElementById('win-screen').classList.add('hidden');
  clearInterval(timer);
  timer = setInterval(() => {
    seconds++;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    document.getElementById('timer-display').textContent = m + ':' + (s < 10 ? '0' : '') + s;
  }, 1000);

  cards = shuffle([...emojis, ...emojis]);
  cards.forEach((emoji, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<span class="face">' + emoji + '</span><span class="back">?</span>';
    card.onclick = () => flipCard(card, i);
    grid.appendChild(card);
  });
}

function flipCard(card, idx) {
  if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  flipped.push({ card, idx, emoji: cards[idx] });

  if (flipped.length === 2) {
    moves++;
    document.getElementById('moves').textContent = moves;
    canFlip = false;

    if (flipped[0].emoji === flipped[1].emoji) {
      flipped[0].card.classList.add('matched');
      flipped[1].card.classList.add('matched');
      matched++;
      document.getElementById('pairs').textContent = matched;
      flipped = [];
      canFlip = true;
      if (matched === emojis.length) {
        clearInterval(timer);
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        document.getElementById('win-text').textContent = moves + ' Zuege in ' + m + ':' + (s < 10 ? '0' : '') + s;
        document.getElementById('win-screen').classList.remove('hidden');
      }
    } else {
      setTimeout(() => {
        flipped[0].card.classList.remove('flipped');
        flipped[1].card.classList.remove('flipped');
        flipped = [];
        canFlip = true;
      }, 800);
    }
  }
}

initGame();`
    }),
  },

  flashcard: {
    keywords: ['karteikarten', 'flashcard', 'vokabel', 'lernkarten', 'flip', 'vocabulary'],
    generate: (topic) => ({
      greeting: `**Karteikarten-Spiel**${topic ? ` fuer "${topic}"` : ''} wird geschmiedet! Flip fuer Flip zum Wissen.`,
      html: `<div id="app">
  <h1>Karteikarten</h1>
  <div id="progress">Karte <span id="current">1</span> von <span id="total">6</span></div>
  <div id="card-container">
    <div id="card" onclick="flipCard()">
      <div id="card-front"><p id="front-text"></p><span class="hint">Klicken zum Umdrehen</span></div>
      <div id="card-back"><p id="back-text"></p></div>
    </div>
  </div>
  <div id="buttons">
    <button class="btn wrong" onclick="markCard(false)">Nochmal</button>
    <button class="btn right" onclick="markCard(true)">Gewusst!</button>
  </div>
  <div id="result" class="hidden">
    <h2 id="res-title"></h2>
    <p id="res-text"></p>
    <button onclick="startCards()">Nochmal</button>
  </div>
</div>`,
      css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', sans-serif; background: #111827; color: #f9fafb; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
#app { text-align: center; padding: 2rem; width: 100%; max-width: 500px; }
h1 { color: #f97316; margin-bottom: 0.5rem; }
#progress { color: #9ca3af; font-size: 0.85rem; margin-bottom: 1.5rem; }
#card-container { perspective: 800px; margin-bottom: 1.5rem; }
#card {
  width: 100%; min-height: 200px; cursor: pointer; position: relative;
  transform-style: preserve-3d; transition: transform 0.5s;
}
#card.flipped { transform: rotateY(180deg); }
#card-front, #card-back {
  position: absolute; inset: 0; backface-visibility: hidden; border-radius: 16px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 2rem; min-height: 200px;
}
#card-front { background: #1f2937; border: 2px solid #374151; }
#card-back { background: #f9731615; border: 2px solid #f97316; transform: rotateY(180deg); }
#front-text, #back-text { font-size: 1.3rem; line-height: 1.5; }
.hint { color: #6b7280; font-size: 0.75rem; margin-top: 1rem; }
#buttons { display: flex; gap: 1rem; justify-content: center; margin-bottom: 1.5rem; }
.btn {
  padding: 10px 24px; border: none; border-radius: 10px; font-size: 1rem;
  cursor: pointer; font-weight: 600; transition: all 0.2s;
}
.btn.wrong { background: #ef444430; color: #ef4444; border: 2px solid #ef4444; }
.btn.wrong:hover { background: #ef444450; }
.btn.right { background: #10b98130; color: #10b981; border: 2px solid #10b981; }
.btn.right:hover { background: #10b98150; }
#result.hidden { display: none; }
#result h2 { color: #f97316; margin-bottom: 0.5rem; }
#result button {
  margin-top: 1rem; background: #f97316; color: white; border: none; padding: 10px 24px;
  border-radius: 10px; font-size: 1rem; cursor: pointer;
}`,
      js: `const cards = [
  { front: "Was ist H2O?", back: "Wasser (Wasserstoff + Sauerstoff)" },
  { front: "Was bedeutet HTML?", back: "HyperText Markup Language" },
  { front: "Hauptstadt von Japan?", back: "Tokio" },
  { front: "Was ist Photosynthese?", back: "Umwandlung von Licht in Energie durch Pflanzen" },
  { front: "Wer malte die Mona Lisa?", back: "Leonardo da Vinci" },
  { front: "Was ist Pi (π)?", back: "3.14159... - Kreiszahl" }
];
let current = 0, known = 0, isFlipped = false;

function startCards() {
  current = 0; known = 0; isFlipped = false;
  document.getElementById('result').classList.add('hidden');
  document.getElementById('card-container').style.display = 'block';
  document.getElementById('buttons').style.display = 'flex';
  showCard();
}

function showCard() {
  isFlipped = false;
  document.getElementById('card').classList.remove('flipped');
  document.getElementById('current').textContent = current + 1;
  document.getElementById('total').textContent = cards.length;
  document.getElementById('front-text').textContent = cards[current].front;
  document.getElementById('back-text').textContent = cards[current].back;
}

function flipCard() {
  isFlipped = !isFlipped;
  document.getElementById('card').classList.toggle('flipped');
}

function markCard(correct) {
  if (correct) known++;
  current++;
  if (current >= cards.length) {
    document.getElementById('card-container').style.display = 'none';
    document.getElementById('buttons').style.display = 'none';
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('res-title').textContent = known >= cards.length * 0.8 ? 'Ausgezeichnet!' : 'Weiter ueben!';
    document.getElementById('res-text').textContent = known + ' von ' + cards.length + ' gewusst';
  } else {
    showCard();
  }
}

startCards();`
    }),
  },

  fillblank: {
    keywords: ['lueckentext', 'luecke', 'fill', 'blank', 'einsetzen', 'ergaenzen', 'cloze'],
    generate: (topic) => ({
      greeting: `Ein **Lueckentext-Spiel**${topic ? ` zu "${topic}"` : ''} kommt aus der Schmiede! Worte einsetzen, Wissen schmieden.`,
      html: `<div id="app">
  <h1>Lueckentext</h1>
  <div id="progress-bar"><div id="fill"></div></div>
  <div id="sentence-box"><p id="sentence"></p></div>
  <div id="word-bank"></div>
  <div id="feedback" class="hidden"></div>
  <button id="check-btn" onclick="checkAnswer()">Pruefen</button>
  <div id="result" class="hidden">
    <h2 id="res-title"></h2>
    <p id="res-score"></p>
    <button onclick="startGame()">Nochmal</button>
  </div>
</div>`,
      css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', sans-serif; background: #111827; color: #f9fafb; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
#app { text-align: center; padding: 2rem; width: 100%; max-width: 600px; }
h1 { color: #f97316; margin-bottom: 1rem; }
#progress-bar { width: 100%; height: 4px; background: #374151; border-radius: 2px; margin-bottom: 1.5rem; }
#fill { height: 100%; background: #f97316; width: 0%; transition: width 0.3s; border-radius: 2px; }
#sentence-box { background: #1f2937; padding: 2rem; border-radius: 16px; margin-bottom: 1.5rem; font-size: 1.2rem; line-height: 2; }
.gap {
  display: inline-block; min-width: 100px; border-bottom: 2px dashed #f97316;
  padding: 2px 8px; margin: 0 4px; color: #f97316; cursor: pointer; transition: all 0.2s;
}
.gap.filled { border-color: #10b981; color: #10b981; background: #10b98110; border-radius: 6px; border-bottom-style: solid; }
.gap.wrong { border-color: #ef4444; color: #ef4444; background: #ef444410; }
#word-bank { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 1.5rem; }
.word {
  background: #374151; padding: 8px 16px; border-radius: 8px; cursor: pointer;
  transition: all 0.2s; border: 2px solid transparent; font-size: 0.95rem;
}
.word:hover { border-color: #f97316; }
.word.used { opacity: 0.3; pointer-events: none; }
#check-btn {
  background: #f97316; color: white; border: none; padding: 12px 32px;
  border-radius: 12px; font-size: 1rem; cursor: pointer; margin-bottom: 1rem;
}
#check-btn:hover { background: #ea580c; }
#feedback { padding: 1rem; border-radius: 12px; margin-bottom: 1rem; font-weight: 600; }
#feedback.hidden { display: none; }
#feedback.correct { background: #10b98120; color: #10b981; }
#feedback.wrong { background: #ef444420; color: #ef4444; }
#result.hidden { display: none; }
#result h2 { color: #f97316; }
#result button {
  margin-top: 1rem; background: #f97316; color: white; border: none; padding: 10px 24px;
  border-radius: 10px; font-size: 1rem; cursor: pointer;
}`,
      js: `const sentences = [
  { text: "Das Wasser besteht aus ___ und Sauerstoff.", answer: "Wasserstoff", words: ["Wasserstoff", "Kohlenstoff", "Stickstoff"] },
  { text: "Die Erde dreht sich um die ___.", answer: "Sonne", words: ["Sonne", "Mond", "Venus"] },
  { text: "Berlin ist die Hauptstadt von ___.", answer: "Deutschland", words: ["Deutschland", "Oesterreich", "Schweiz"] },
  { text: "Der laengste Fluss der Welt ist der ___.", answer: "Nil", words: ["Nil", "Amazonas", "Donau"] },
  { text: "Die DNA ist ein ___ in jeder Zelle.", answer: "Molekuel", words: ["Molekuel", "Organ", "Muskel"] }
];
let current = 0, score = 0, selectedWord = null;

function startGame() {
  current = 0; score = 0; selectedWord = null;
  document.getElementById('result').classList.add('hidden');
  document.getElementById('check-btn').style.display = 'block';
  showSentence();
}

function showSentence() {
  const s = sentences[current];
  document.getElementById('fill').style.width = ((current + 1) / sentences.length * 100) + '%';
  document.getElementById('feedback').classList.add('hidden');
  selectedWord = null;

  const html = s.text.replace('___', '<span class="gap" id="gap" onclick="clearGap()"></span>');
  document.getElementById('sentence').innerHTML = html;

  const bank = document.getElementById('word-bank');
  const shuffled = [...s.words].sort(() => Math.random() - 0.5);
  bank.innerHTML = shuffled.map(w => '<span class="word" onclick="selectWord(this, \\'' + w + '\\')">' + w + '</span>').join('');
}

function selectWord(el, word) {
  document.querySelectorAll('.word').forEach(w => w.classList.remove('used'));
  el.classList.add('used');
  selectedWord = word;
  const gap = document.getElementById('gap');
  gap.textContent = word;
  gap.classList.add('filled');
  gap.classList.remove('wrong');
}

function clearGap() {
  selectedWord = null;
  const gap = document.getElementById('gap');
  gap.textContent = '';
  gap.classList.remove('filled', 'wrong');
  document.querySelectorAll('.word').forEach(w => w.classList.remove('used'));
}

function checkAnswer() {
  if (!selectedWord) return;
  const s = sentences[current];
  const fb = document.getElementById('feedback');
  fb.classList.remove('hidden', 'correct', 'wrong');

  if (selectedWord === s.answer) {
    score++;
    fb.classList.add('correct');
    fb.textContent = 'Richtig!';
  } else {
    fb.classList.add('wrong');
    fb.textContent = 'Falsch! Richtig: ' + s.answer;
    document.getElementById('gap').classList.add('wrong');
  }

  setTimeout(() => {
    current++;
    if (current < sentences.length) { showSentence(); }
    else {
      document.getElementById('check-btn').style.display = 'none';
      document.getElementById('word-bank').innerHTML = '';
      document.getElementById('sentence').innerHTML = '';
      fb.classList.add('hidden');
      const r = document.getElementById('result');
      r.classList.remove('hidden');
      document.getElementById('res-title').textContent = score >= sentences.length * 0.8 ? 'Ausgezeichnet!' : 'Weiter ueben!';
      document.getElementById('res-score').textContent = score + ' von ' + sentences.length + ' richtig';
    }
  }, 1500);
}

startGame();`
    }),
  },
}

// Fallback fuer allgemeine Anfragen
const CHANGE_RESPONSES = [
  'Klar, ich passe das an! Hier ist der aktualisierte Code:',
  'Schon geschmiedet! Die Aenderung ist drin:',
  'Der Code wurde gehaertet - hier das Update:',
  'Aenderung fertig! Schau dir das Ergebnis an:',
]

function detectGameType(input) {
  const lower = input.toLowerCase()
  for (const [type, template] of Object.entries(GAME_TEMPLATES)) {
    if (template.keywords.some(kw => lower.includes(kw))) {
      return type
    }
  }
  return null
}

function extractTopic(input) {
  const patterns = [
    /(?:ueber|zu|zum thema|fuer|about)\s+["""]?([^""",.!?]+)/i,
    /(?:thema|topic|fach)\s*:?\s*["""]?([^""",.!?]+)/i,
  ]
  for (const p of patterns) {
    const match = input.match(p)
    if (match) return match[1].trim()
  }
  return null
}

/**
 * Simulate streaming AI response with a delay per character.
 * Yields text chunks to mimic real streaming.
 */
export async function* mockStreamResponse(userMessage, currentCode) {
  const gameType = detectGameType(userMessage)
  const topic = extractTopic(userMessage)
  const isFirstMessage = !currentCode.html || currentCode.html.includes('Beginne hier mit deinem Spiel')

  let response

  if (gameType && isFirstMessage) {
    // Generate a new game
    const template = GAME_TEMPLATES[gameType]
    const generated = template.generate(topic, userMessage)

    response = `${generated.greeting}\n\n\`\`\`html\n${generated.html}\n\`\`\`\n\n\`\`\`css\n${generated.css}\n\`\`\`\n\n\`\`\`javascript\n${generated.js}\n\`\`\`\n\nDein Spiel ist fertig geschmiedet! Du kannst es rechts in der Preview sehen. Sag mir, wenn du etwas aendern moechtest.`
  } else if (gameType && !isFirstMessage) {
    // User wants a different game type while one exists
    const template = GAME_TEMPLATES[gameType]
    const generated = template.generate(topic, userMessage)

    response = `Neues Spiel geschmiedet! Ich ersetze den aktuellen Code:\n\n\`\`\`html\n${generated.html}\n\`\`\`\n\n\`\`\`css\n${generated.css}\n\`\`\`\n\n\`\`\`javascript\n${generated.js}\n\`\`\`\n\nDas neue Spiel ist bereit!`
  } else if (!isFirstMessage) {
    // Modification request on existing code
    const greeting = CHANGE_RESPONSES[Math.floor(Math.random() * CHANGE_RESPONSES.length)]
    response = `${greeting}\n\nIch habe den aktuellen Code analysiert. Um spezifische Aenderungen vorzunehmen, beschreibe bitte genauer was du aendern moechtest, z.B.:\n\n- "Mach den Hintergrund blau"\n- "Fuege einen Timer hinzu"\n- "Aendere die Fragen zu Mathematik"\n- "Mach die Buttons groesser"\n\n**Hinweis:** Sobald eine echte KI angebunden ist, kann ich den Code direkt modifizieren. Aktuell arbeite ich mit vorgefertigten Templates.`
  } else {
    // No game type detected, first message
    response = `Hmm, ich bin mir nicht ganz sicher was fuer ein Spiel du moechtest. Probier es mit einer dieser Beschreibungen:\n\n- **"Erstelle ein Quiz"** - Multiple-Choice-Fragen mit Timer und Score\n- **"Baue ein Memory-Spiel"** - Kartenpaare finden\n- **"Mache Karteikarten"** - Flip-Cards zum Lernen\n- **"Erstelle einen Lueckentext"** - Woerter einsetzen\n\nOder klicke auf einen der Schnellstart-Buttons unten!`
  }

  // Simulate streaming: yield chunks of ~3-8 chars with small delays
  const chunkSize = 5
  for (let i = 0; i < response.length; i += chunkSize) {
    const chunk = response.slice(i, i + chunkSize)
    yield chunk
    // Small delay to simulate streaming (15-30ms per chunk)
    await new Promise(r => setTimeout(r, 15 + Math.random() * 15))
  }
}
