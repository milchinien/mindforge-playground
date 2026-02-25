/**
 * Block definitions for the Visual Game Builder.
 * Each block type defines its category, color, default fields, and code generation template.
 */

export const BLOCK_CATEGORIES = [
  { id: 'fragen', label: 'Fragen', color: '#3b82f6', bgClass: 'bg-blue-500', borderClass: 'border-blue-500', textClass: 'text-blue-400' },
  { id: 'logik', label: 'Logik', color: '#22c55e', bgClass: 'bg-green-500', borderClass: 'border-green-500', textClass: 'text-green-400' },
  { id: 'design', label: 'Design', color: '#a855f7', bgClass: 'bg-purple-500', borderClass: 'border-purple-500', textClass: 'text-purple-400' },
  { id: 'punkte', label: 'Punkte', color: '#f97316', bgClass: 'bg-orange-500', borderClass: 'border-orange-500', textClass: 'text-orange-400' },
  { id: 'timer', label: 'Timer', color: '#ef4444', bgClass: 'bg-red-500', borderClass: 'border-red-500', textClass: 'text-red-400' },
]

export const BLOCK_TYPES = {
  question: {
    type: 'question',
    category: 'fragen',
    label: 'Frage-Block',
    description: 'Multiple-Choice-Frage mit 4 Antworten',
    icon: 'HelpCircle',
    defaults: {
      questionText: '',
      answers: ['', '', '', ''],
      correctAnswer: 0,
    },
  },
  text: {
    type: 'text',
    category: 'fragen',
    label: 'Text-Block',
    description: 'Anzeige von Text oder Anweisungen',
    icon: 'Type',
    defaults: {
      content: '',
      fontSize: '16',
      bold: false,
    },
  },
  image: {
    type: 'image',
    category: 'fragen',
    label: 'Bild-Block',
    description: 'Bild per URL einbinden',
    icon: 'ImageIcon',
    defaults: {
      imageUrl: '',
      altText: '',
      width: '100',
    },
  },
  timer: {
    type: 'timer',
    category: 'timer',
    label: 'Timer-Block',
    description: 'Zeitlimit fuer das Spiel oder Fragen',
    icon: 'Clock',
    defaults: {
      duration: 30,
      showTimer: true,
      autoSubmit: true,
    },
  },
  score: {
    type: 'score',
    category: 'punkte',
    label: 'Punkte-Block',
    description: 'Punkte pro richtiger Antwort',
    icon: 'Trophy',
    defaults: {
      pointsPerCorrect: 10,
      pointsPerWrong: 0,
      showScore: true,
    },
  },
  designBg: {
    type: 'designBg',
    category: 'design',
    label: 'Hintergrund-Block',
    description: 'Hintergrundfarbe und Textfarbe',
    icon: 'Palette',
    defaults: {
      backgroundColor: '#1a1a2e',
      textColor: '#e0e0e0',
      fontFamily: 'sans-serif',
    },
  },
  ifElse: {
    type: 'ifElse',
    category: 'logik',
    label: 'Wenn/Dann-Block',
    description: 'Bedingung: Wenn Punkte >= X, dann...',
    icon: 'GitBranch',
    defaults: {
      condition: 'score',
      operator: '>=',
      value: 50,
      thenAction: 'showMessage',
      thenValue: 'Gut gemacht!',
      elseAction: 'showMessage',
      elseValue: 'Versuch es nochmal!',
    },
  },
  loop: {
    type: 'loop',
    category: 'logik',
    label: 'Wiederholung-Block',
    description: 'Fragen in zufaelliger Reihenfolge',
    icon: 'Repeat',
    defaults: {
      shuffleQuestions: true,
      repeatOnWrong: false,
    },
  },
}

/**
 * Returns the category metadata for a given category id.
 */
export function getCategoryMeta(categoryId) {
  return BLOCK_CATEGORIES.find(c => c.id === categoryId) || BLOCK_CATEGORIES[0]
}

/**
 * Creates a new block instance with a unique ID and default values.
 */
export function createBlockInstance(blockType) {
  const definition = BLOCK_TYPES[blockType]
  if (!definition) return null
  return {
    id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: definition.type,
    category: definition.category,
    data: { ...definition.defaults },
  }
}

// ---------- Code Generation ----------

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function generateQuestionHtml(block, index) {
  const q = block.data
  if (!q.questionText) return ''
  const answersHtml = q.answers
    .map((a, i) => {
      if (!a) return ''
      return `      <button class="answer-btn" data-question="${index}" data-answer="${i}" onclick="checkAnswer(${index}, ${i})">${escapeHtml(a)}</button>`
    })
    .filter(Boolean)
    .join('\n')

  return `
    <div class="question-card" id="question-${index}" style="display:${index === 0 ? 'block' : 'none'};">
      <h2 class="question-text">Frage ${index + 1}: ${escapeHtml(q.questionText)}</h2>
      <div class="answers-grid">
${answersHtml}
      </div>
    </div>`
}

function generateTextHtml(block) {
  const d = block.data
  const style = `font-size:${d.fontSize || 16}px;${d.bold ? 'font-weight:bold;' : ''}`
  return `    <div class="text-block" style="${style}">${escapeHtml(d.content)}</div>`
}

function generateImageHtml(block) {
  const d = block.data
  if (!d.imageUrl) return ''
  return `    <div class="image-block"><img src="${escapeHtml(d.imageUrl)}" alt="${escapeHtml(d.altText)}" style="max-width:${d.width || 100}%;"></div>`
}

/**
 * Main code generation function.
 * Converts an array of block instances into a complete HTML/CSS/JS game.
 */
export function generateGameCode(blocks) {
  // Collect config from blocks
  let bgColor = '#1a1a2e'
  let textColor = '#e0e0e0'
  let fontFamily = 'sans-serif'
  let timerDuration = 0
  let showTimer = false
  let autoSubmit = false
  let pointsPerCorrect = 10
  let pointsPerWrong = 0
  let showScore = true
  let shuffleQuestions = false
  let repeatOnWrong = false
  const conditions = []
  const questions = []
  const contentBlocks = []

  for (const block of blocks) {
    switch (block.type) {
      case 'designBg':
        bgColor = block.data.backgroundColor || bgColor
        textColor = block.data.textColor || textColor
        fontFamily = block.data.fontFamily || fontFamily
        break
      case 'timer':
        timerDuration = block.data.duration || 30
        showTimer = block.data.showTimer !== false
        autoSubmit = block.data.autoSubmit !== false
        break
      case 'score':
        pointsPerCorrect = block.data.pointsPerCorrect ?? 10
        pointsPerWrong = block.data.pointsPerWrong ?? 0
        showScore = block.data.showScore !== false
        break
      case 'loop':
        shuffleQuestions = block.data.shuffleQuestions !== false
        repeatOnWrong = block.data.repeatOnWrong === true
        break
      case 'ifElse':
        conditions.push(block.data)
        break
      case 'question':
        if (block.data.questionText) {
          questions.push(block)
        }
        break
      case 'text':
        if (block.data.content) {
          contentBlocks.push(block)
        }
        break
      case 'image':
        if (block.data.imageUrl) {
          contentBlocks.push(block)
        }
        break
      default:
        break
    }
  }

  // Build correct answers array
  const correctAnswers = questions.map(q => q.data.correctAnswer ?? 0)

  // Build questions HTML
  const questionsHtml = questions.map((q, i) => generateQuestionHtml(q, i)).join('\n')

  // Build content blocks HTML
  const contentHtml = contentBlocks.map(b => {
    if (b.type === 'text') return generateTextHtml(b)
    if (b.type === 'image') return generateImageHtml(b)
    return ''
  }).join('\n')

  // Build conditions JS
  const conditionsJs = conditions.map(c => {
    const varName = c.condition === 'score' ? 'score' : 'currentQuestion'
    const thenCode = c.thenAction === 'showMessage'
      ? `resultEl.innerHTML += '<p style="color:#22c55e">${escapeHtml(c.thenValue)}</p>';`
      : ''
    const elseCode = c.elseAction === 'showMessage'
      ? `resultEl.innerHTML += '<p style="color:#ef4444">${escapeHtml(c.elseValue)}</p>';`
      : ''
    return `    if (${varName} ${c.operator} ${c.value}) { ${thenCode} } else { ${elseCode} }`
  }).join('\n')

  const html = `<div id="game-container">
  <div id="header">
    <h1 id="game-title">MindForge Quiz</h1>
    ${showTimer ? '<div id="timer-display">Zeit: <span id="timer-value">--</span>s</div>' : ''}
    ${showScore ? '<div id="score-display">Punkte: <span id="score-value">0</span></div>' : ''}
  </div>
  <div id="content-area">
${contentHtml}
  </div>
  <div id="questions-area">
${questionsHtml}
  </div>
  <div id="result-area" style="display:none;">
    <h2 id="result-title"></h2>
    <p id="result-text"></p>
    <button id="restart-btn" onclick="restartGame()">Nochmal spielen</button>
  </div>
  <div id="progress-bar"><div id="progress-fill"></div></div>
</div>`

  const css = `* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: ${bgColor};
  color: ${textColor};
  font-family: ${fontFamily}, Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
}
#game-container {
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
}
#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
#game-title { font-size: 1.5rem; font-weight: 700; }
#timer-display, #score-display {
  background: rgba(255,255,255,0.08);
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
}
.question-card {
  background: rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.question-text { font-size: 1.2rem; margin-bottom: 20px; line-height: 1.5; }
.answers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.answer-btn {
  background: rgba(255,255,255,0.08);
  color: inherit;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 14px 18px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}
.answer-btn:hover { background: rgba(255,255,255,0.14); border-color: rgba(255,255,255,0.2); }
.answer-btn.correct { background: rgba(34,197,94,0.25); border-color: #22c55e; }
.answer-btn.wrong { background: rgba(239,68,68,0.25); border-color: #ef4444; }
.answer-btn:disabled { cursor: default; opacity: 0.7; }
.text-block { margin-bottom: 16px; line-height: 1.6; }
.image-block { margin-bottom: 16px; text-align: center; }
.image-block img { border-radius: 12px; max-height: 300px; }
#result-area {
  text-align: center;
  padding: 40px 20px;
  animation: fadeIn 0.4s ease;
}
#result-title { font-size: 1.8rem; margin-bottom: 12px; }
#result-text { font-size: 1.1rem; opacity: 0.8; margin-bottom: 24px; }
#restart-btn {
  background: #6366f1;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
#restart-btn:hover { background: #4f46e5; }
#progress-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.05);
}
#progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  transition: width 0.4s ease;
}
@media (max-width: 500px) {
  .answers-grid { grid-template-columns: 1fr; }
}`

  const js = `(function() {
  var correctAnswers = ${JSON.stringify(correctAnswers)};
  var totalQuestions = ${questions.length};
  var currentQuestion = 0;
  var score = 0;
  var timerDuration = ${timerDuration};
  var showTimer = ${showTimer};
  var autoSubmit = ${autoSubmit};
  var shuffleQuestions = ${shuffleQuestions};
  var repeatOnWrong = ${repeatOnWrong};
  var timerInterval = null;
  var timeLeft = timerDuration;

  var questionOrder = [];
  for (var i = 0; i < totalQuestions; i++) questionOrder.push(i);
  if (shuffleQuestions && totalQuestions > 1) {
    for (var k = questionOrder.length - 1; k > 0; k--) {
      var j = Math.floor(Math.random() * (k + 1));
      var tmp = questionOrder[k];
      questionOrder[k] = questionOrder[j];
      questionOrder[j] = tmp;
    }
  }

  function showQuestion(idx) {
    var cards = document.querySelectorAll('.question-card');
    cards.forEach(function(c) { c.style.display = 'none'; });
    var realIdx = questionOrder[idx];
    var card = document.getElementById('question-' + realIdx);
    if (card) card.style.display = 'block';
    updateProgress();
    if (showTimer && timerDuration > 0) startTimer();
  }

  function startTimer() {
    clearInterval(timerInterval);
    timeLeft = timerDuration;
    var timerEl = document.getElementById('timer-value');
    if (timerEl) timerEl.textContent = timeLeft;
    timerInterval = setInterval(function() {
      timeLeft--;
      if (timerEl) timerEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        if (autoSubmit) nextQuestion();
      }
    }, 1000);
  }

  function updateProgress() {
    var fill = document.getElementById('progress-fill');
    if (fill && totalQuestions > 0) {
      fill.style.width = ((currentQuestion / totalQuestions) * 100) + '%';
    }
  }

  window.checkAnswer = function(questionIdx, answerIdx) {
    var realIdx = questionOrder[currentQuestion];
    var btns = document.querySelectorAll('[data-question="' + realIdx + '"]');
    btns.forEach(function(b) { b.disabled = true; });

    if (answerIdx === correctAnswers[realIdx]) {
      btns[answerIdx].classList.add('correct');
      score += ${pointsPerCorrect};
    } else {
      btns[answerIdx].classList.add('wrong');
      btns[correctAnswers[realIdx]].classList.add('correct');
      score += ${pointsPerWrong};
    }

    var scoreEl = document.getElementById('score-value');
    if (scoreEl) scoreEl.textContent = score;

    clearInterval(timerInterval);
    setTimeout(function() { nextQuestion(); }, 1200);
  };

  function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < totalQuestions) {
      showQuestion(currentQuestion);
    } else {
      showResults();
    }
  }

  function showResults() {
    clearInterval(timerInterval);
    var questionsArea = document.getElementById('questions-area');
    var resultArea = document.getElementById('result-area');
    if (questionsArea) questionsArea.style.display = 'none';
    if (resultArea) resultArea.style.display = 'block';

    var pct = totalQuestions > 0 ? Math.round((score / (totalQuestions * ${pointsPerCorrect})) * 100) : 0;
    var titleEl = document.getElementById('result-title');
    var textEl = document.getElementById('result-text');
    if (titleEl) titleEl.textContent = pct >= 70 ? 'Grossartig!' : pct >= 40 ? 'Nicht schlecht!' : 'Versuch es nochmal!';
    if (textEl) textEl.textContent = 'Du hast ' + score + ' Punkte erreicht (' + pct + '% richtig).';

    var resultEl = resultArea;
${conditionsJs}

    var fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = '100%';
  }

  window.restartGame = function() {
    score = 0;
    currentQuestion = 0;
    var scoreEl = document.getElementById('score-value');
    if (scoreEl) scoreEl.textContent = '0';

    if (shuffleQuestions && totalQuestions > 1) {
      for (var k = questionOrder.length - 1; k > 0; k--) {
        var j = Math.floor(Math.random() * (k + 1));
        var tmp = questionOrder[k];
        questionOrder[k] = questionOrder[j];
        questionOrder[j] = tmp;
      }
    }

    var btns = document.querySelectorAll('.answer-btn');
    btns.forEach(function(b) { b.disabled = false; b.classList.remove('correct', 'wrong'); });

    var questionsArea = document.getElementById('questions-area');
    var resultArea = document.getElementById('result-area');
    if (questionsArea) questionsArea.style.display = 'block';
    if (resultArea) resultArea.style.display = 'none';

    showQuestion(0);
  };

  if (totalQuestions > 0) showQuestion(0);
})();`

  return { html, css, js }
}
