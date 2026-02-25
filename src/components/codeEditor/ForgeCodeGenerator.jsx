import { useState } from 'react'
import { Wand2, Sparkles, Loader2, ChevronDown, Play, Code2, Copy, Check, ArrowRight } from 'lucide-react'

const GAME_TEMPLATES = [
  {
    id: 'quiz',
    name: 'Quiz-Spiel',
    icon: '🧠',
    description: 'Multiple-Choice Quiz mit Punkten und Timer',
  },
  {
    id: 'memory',
    name: 'Memory-Spiel',
    icon: '🃏',
    description: 'Karten-Paare finden',
  },
  {
    id: 'dragdrop',
    name: 'Zuordnungsspiel',
    icon: '🎯',
    description: 'Begriffe per Drag & Drop zuordnen',
  },
  {
    id: 'lueckentext',
    name: 'Lueckentext',
    icon: '✏️',
    description: 'Fehlende Woerter einsetzen',
  },
  {
    id: 'flashcards',
    name: 'Karteikarten',
    icon: '📚',
    description: 'Vokabeln und Fakten lernen',
  },
  {
    id: 'custom',
    name: 'Freie Beschreibung',
    icon: '✨',
    description: 'Beschreibe dein Spiel frei',
  },
]

const SUBJECTS = [
  'Mathematik', 'Physik', 'Chemie', 'Biologie', 'Geschichte',
  'Geographie', 'Deutsch', 'Englisch', 'Informatik', 'Musik', 'Kunst',
]

const DIFFICULTY = [
  { id: 'easy', label: 'Einfach', description: 'Grundschule / Anfaenger' },
  { id: 'medium', label: 'Mittel', description: 'Mittelstufe' },
  { id: 'hard', label: 'Schwer', description: 'Oberstufe / Fortgeschritten' },
]

// Simulated code generation based on template + config
function generateGameCode(config) {
  const { template, subject, topic, difficulty, questionCount } = config

  const baseStyles = `
body {
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  margin: 0;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.container { max-width: 600px; width: 100%; }
h1 { text-align: center; margin-bottom: 20px; }
.card {
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 20px;
  margin: 10px 0;
  backdrop-filter: blur(10px);
}
.btn {
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn:hover { background: #5a4bd1; transform: scale(1.02); }
.correct { border: 2px solid #00b894; background: rgba(0,184,148,0.2); }
.wrong { border: 2px solid #e74c3c; background: rgba(231,76,60,0.2); }
.score { font-size: 24px; text-align: center; color: #6c5ce7; }
.progress { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin: 15px 0; }
.progress-bar { height: 100%; background: #6c5ce7; border-radius: 3px; transition: width 0.3s; }
`

  if (template === 'quiz') {
    return {
      html: `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><title>${topic || subject} Quiz</title></head>
<body>
  <div class="container">
    <h1>🧠 ${topic || subject} Quiz</h1>
    <div class="card">
      <div id="question-counter">Frage 1 von ${questionCount}</div>
      <div class="progress"><div class="progress-bar" id="progress" style="width: ${100/questionCount}%"></div></div>
      <h2 id="question">Lade Frage...</h2>
      <div id="answers"></div>
    </div>
    <div id="result" style="display:none" class="card">
      <h2>Quiz beendet!</h2>
      <p class="score" id="score"></p>
      <button class="btn" onclick="restartQuiz()">Nochmal spielen</button>
    </div>
  </div>
</body>
</html>`,
      css: baseStyles + `
.answer-btn {
  display: block;
  width: 100%;
  background: rgba(255,255,255,0.1);
  color: white;
  border: 2px solid transparent;
  padding: 14px 18px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  margin: 8px 0;
  text-align: left;
  transition: all 0.2s;
}
.answer-btn:hover { background: rgba(108,92,231,0.3); border-color: #6c5ce7; }
`,
      js: `const questions = [
  { q: "Beispielfrage 1 zu ${topic || subject}?", answers: ["Antwort A", "Antwort B", "Antwort C", "Antwort D"], correct: 0 },
  { q: "Beispielfrage 2 zu ${topic || subject}?", answers: ["Antwort A", "Antwort B", "Antwort C", "Antwort D"], correct: 1 },
  { q: "Beispielfrage 3 zu ${topic || subject}?", answers: ["Antwort A", "Antwort B", "Antwort C", "Antwort D"], correct: 2 },
];

let current = 0, score = 0;
const total = questions.length;

function showQuestion() {
  const q = questions[current];
  document.getElementById('question').textContent = q.q;
  document.getElementById('question-counter').textContent = \`Frage \${current + 1} von \${total}\`;
  document.getElementById('progress').style.width = \`\${((current + 1) / total) * 100}%\`;

  const answersDiv = document.getElementById('answers');
  answersDiv.innerHTML = '';
  q.answers.forEach((a, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = a;
    btn.onclick = () => checkAnswer(i);
    answersDiv.appendChild(btn);
  });
}

function checkAnswer(index) {
  const btns = document.querySelectorAll('.answer-btn');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    btn.style.cursor = 'default';
    if (i === questions[current].correct) btn.className += ' correct';
    if (i === index && i !== questions[current].correct) btn.className += ' wrong';
  });

  if (index === questions[current].correct) score++;

  setTimeout(() => {
    current++;
    if (current < total) { showQuestion(); }
    else { showResult(); }
  }, 1200);
}

function showResult() {
  document.querySelector('.card').style.display = 'none';
  const result = document.getElementById('result');
  result.style.display = 'block';
  document.getElementById('score').textContent = \`\${score} / \${total} richtig!\`;
}

function restartQuiz() {
  current = 0; score = 0;
  document.querySelector('.card').style.display = 'block';
  document.getElementById('result').style.display = 'none';
  showQuestion();
}

showQuestion();`
    }
  }

  // Default: simple template
  return {
    html: `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><title>${topic || subject} - ${GAME_TEMPLATES.find(t => t.id === template)?.name || 'Spiel'}</title></head>
<body>
  <div class="container">
    <h1>${GAME_TEMPLATES.find(t => t.id === template)?.icon || '🎮'} ${topic || subject}</h1>
    <div class="card">
      <p>Dein ${GAME_TEMPLATES.find(t => t.id === template)?.name || 'Spiel'} zum Thema <strong>${topic || subject}</strong></p>
      <p>Schwierigkeit: ${DIFFICULTY.find(d => d.id === difficulty)?.label || 'Mittel'}</p>
      <button class="btn" onclick="startGame()">Spiel starten</button>
    </div>
    <div id="game-area" style="display:none" class="card">
      <h2 id="game-content">Spielinhalt wird hier angezeigt...</h2>
      <div id="interaction-area"></div>
    </div>
  </div>
</body>
</html>`,
    css: baseStyles,
    js: `// ${topic || subject} - ${GAME_TEMPLATES.find(t => t.id === template)?.name || 'Spiel'}
// Passe diesen Code an dein Spiel an!

function startGame() {
  document.querySelector('.card').style.display = 'none';
  document.getElementById('game-area').style.display = 'block';
  document.getElementById('game-content').textContent = 'Spiel laeuft! Fuege hier deine Spiellogik ein.';
}
`
  }
}

export default function ForgeCodeGenerator({ onApplyCode, onClose }) {
  const [step, setStep] = useState(1) // 1: template, 2: config, 3: generating, 4: result
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [config, setConfig] = useState({
    subject: 'Mathematik',
    topic: '',
    difficulty: 'medium',
    questionCount: 5,
  })
  const [generatedCode, setGeneratedCode] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    setStep(3)
    // Simulate generation delay
    setTimeout(() => {
      const code = generateGameCode({
        template: selectedTemplate,
        ...config,
      })
      setGeneratedCode(code)
      setStep(4)
    }, 2000)
  }

  const handleApply = () => {
    if (generatedCode && onApplyCode) {
      onApplyCode(generatedCode)
    }
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-bg-secondary border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-accent/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Forge KI Code-Generator</h2>
              <p className="text-xs text-text-muted">Beschreibe dein Spiel - die KI erstellt den Code</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <span className={step >= 1 ? 'text-accent font-bold' : ''}>1</span>
            <ArrowRight className="w-3 h-3" />
            <span className={step >= 2 ? 'text-accent font-bold' : ''}>2</span>
            <ArrowRight className="w-3 h-3" />
            <span className={step >= 4 ? 'text-accent font-bold' : ''}>3</span>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Choose template */}
          {step === 1 && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-4">Welche Art von Spiel moechtest du erstellen?</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {GAME_TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => { setSelectedTemplate(template.id); setStep(2) }}
                    className={`p-4 bg-bg-card hover:bg-bg-hover border-2 rounded-xl transition-all text-left ${
                      selectedTemplate === template.id ? 'border-accent' : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-2xl">{template.icon}</span>
                    <p className="text-sm font-semibold text-text-primary mt-2">{template.name}</p>
                    <p className="text-xs text-text-muted mt-1">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Configure */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary mb-2">
                {GAME_TEMPLATES.find(t => t.id === selectedTemplate)?.icon}{' '}
                {GAME_TEMPLATES.find(t => t.id === selectedTemplate)?.name} konfigurieren
              </h3>

              <div>
                <label className="text-xs text-text-muted mb-1 block">Fach</label>
                <select
                  value={config.subject}
                  onChange={(e) => setConfig(prev => ({ ...prev, subject: e.target.value }))}
                  className="!py-2"
                >
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-text-muted mb-1 block">Thema / Beschreibung</label>
                <input
                  type="text"
                  value={config.topic}
                  onChange={(e) => setConfig(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder={`z.B. "Bruchrechnung Klasse 6" oder "Vokabeln Unit 5"`}
                  className="!py-2"
                />
              </div>

              <div>
                <label className="text-xs text-text-muted mb-1 block">Schwierigkeit</label>
                <div className="flex gap-2">
                  {DIFFICULTY.map(d => (
                    <button
                      key={d.id}
                      onClick={() => setConfig(prev => ({ ...prev, difficulty: d.id }))}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                        config.difficulty === d.id
                          ? 'bg-accent/20 text-accent border border-accent/30'
                          : 'bg-bg-card text-text-muted border border-gray-700'
                      }`}
                    >
                      <p className="font-medium">{d.label}</p>
                      <p className="text-[10px] opacity-70">{d.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedTemplate === 'quiz' && (
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Anzahl Fragen</label>
                  <select
                    value={config.questionCount}
                    onChange={(e) => setConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                    className="!py-2 !w-auto"
                  >
                    {[3, 5, 10, 15, 20].map(n => <option key={n} value={n}>{n} Fragen</option>)}
                  </select>
                </div>
              )}

              {selectedTemplate === 'custom' && (
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Freie Beschreibung</label>
                  <textarea
                    value={config.topic}
                    onChange={(e) => setConfig(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="Beschreibe dein Spiel so genau wie moeglich..."
                    rows={4}
                    className="!py-2"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-bg-card hover:bg-bg-hover text-text-secondary rounded-lg text-sm transition-colors"
                >
                  Zurueck
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Code generieren
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Generating */}
          {step === 3 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Forge KI generiert deinen Code...</h3>
              <p className="text-sm text-text-muted">
                {GAME_TEMPLATES.find(t => t.id === selectedTemplate)?.icon}{' '}
                {config.topic || config.subject} wird erstellt
              </p>
              <div className="mt-4 flex justify-center gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 4 && generatedCode && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <Check className="w-5 h-5" />
                <span className="text-sm font-semibold">Code erfolgreich generiert!</span>
              </div>

              {/* Code preview */}
              <div className="bg-[#0d1117] rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-[#1a1a2e] border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-text-muted" />
                    <span className="text-xs text-text-muted">Generierter Code</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(generatedCode, null, 2))
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    className="text-xs text-text-muted hover:text-text-primary flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Kopiert' : 'Kopieren'}
                  </button>
                </div>
                <pre className="p-3 text-xs text-gray-400 font-mono overflow-x-auto max-h-[200px]">
                  <code>
                    {`// HTML: ${generatedCode.html.length} Zeichen\n// CSS: ${generatedCode.css.length} Zeichen\n// JS: ${generatedCode.js.length} Zeichen\n\n`}
                    {generatedCode.js.substring(0, 300)}...
                  </code>
                </pre>
              </div>

              {/* Summary */}
              <div className="bg-bg-card rounded-lg p-3 text-sm">
                <p className="text-text-secondary">
                  <strong className="text-text-primary">Erstellt:</strong>{' '}
                  {GAME_TEMPLATES.find(t => t.id === selectedTemplate)?.name} zum Thema "{config.topic || config.subject}"
                </p>
                <p className="text-text-muted text-xs mt-1">
                  Der Code wird in den Editor eingefuegt. Du kannst ihn dort weiter anpassen.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setStep(1); setGeneratedCode(null) }}
                  className="px-4 py-2 bg-bg-card hover:bg-bg-hover text-text-secondary rounded-lg text-sm transition-colors"
                >
                  Neu generieren
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white py-2.5 rounded-lg text-sm font-bold transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Code in Editor uebernehmen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
