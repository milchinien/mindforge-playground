const TOTAL_QUESTIONS = 10

let questions = []
let currentQuestion = 0
let score = 0
let timerInterval = null
let startTime = 0

function generateQuestion() {
  const ops = ['+', '-', '*']
  const op = ops[Math.floor(Math.random() * ops.length)]
  let a, b, answer

  switch (op) {
    case '+':
      a = Math.floor(Math.random() * 50) + 1
      b = Math.floor(Math.random() * 50) + 1
      answer = a + b
      break
    case '-':
      a = Math.floor(Math.random() * 50) + 10
      b = Math.floor(Math.random() * a) + 1
      answer = a - b
      break
    case '*':
      a = Math.floor(Math.random() * 12) + 1
      b = Math.floor(Math.random() * 12) + 1
      answer = a * b
      break
  }

  const wrongAnswers = new Set()
  while (wrongAnswers.size < 3) {
    const offset = Math.floor(Math.random() * 20) - 10
    const wrong = answer + (offset === 0 ? 1 : offset)
    if (wrong !== answer && wrong >= 0) {
      wrongAnswers.add(wrong)
    }
  }

  const options = [answer, ...wrongAnswers]
  // Shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]]
  }

  return {
    text: `${a} ${op} ${b} = ?`,
    answer,
    options
  }
}

function generateQuestions() {
  questions = []
  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    questions.push(generateQuestion())
  }
}

function showScreen(id) {
  document.getElementById('start-screen').style.display = 'none'
  document.getElementById('question-screen').style.display = 'none'
  document.getElementById('result-screen').style.display = 'none'
  document.getElementById(id).style.display = ''
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000)
  const min = Math.floor(elapsed / 60)
  const sec = elapsed % 60
  document.getElementById('timer').textContent = `${min}:${sec.toString().padStart(2, '0')}`
}

function showQuestion() {
  const q = questions[currentQuestion]
  document.getElementById('question-counter').textContent = `Frage ${currentQuestion + 1}/${TOTAL_QUESTIONS}`
  document.getElementById('score-display').textContent = `Score: ${score}`
  document.getElementById('question').textContent = q.text

  const answersDiv = document.getElementById('answers')
  answersDiv.innerHTML = ''

  q.options.forEach(opt => {
    const btn = document.createElement('button')
    btn.className = 'answer-btn'
    btn.textContent = opt
    btn.addEventListener('click', () => handleAnswer(opt, btn))
    answersDiv.appendChild(btn)
  })
}

function handleAnswer(selected, btn) {
  const q = questions[currentQuestion]
  const buttons = document.querySelectorAll('.answer-btn')
  buttons.forEach(b => b.style.pointerEvents = 'none')

  if (selected === q.answer) {
    btn.classList.add('correct')
    score += 10
  } else {
    btn.classList.add('wrong')
    buttons.forEach(b => {
      if (parseInt(b.textContent) === q.answer) {
        b.classList.add('correct')
      }
    })
  }

  setTimeout(() => {
    currentQuestion++
    if (currentQuestion < TOTAL_QUESTIONS) {
      showQuestion()
    } else {
      showResults()
    }
  }, 800)
}

function showResults() {
  clearInterval(timerInterval)
  const elapsed = Math.floor((Date.now() - startTime) / 1000)
  const min = Math.floor(elapsed / 60)
  const sec = elapsed % 60

  document.getElementById('final-score').textContent = `Du hast ${score} von ${TOTAL_QUESTIONS * 10} Punkten erreicht!`
  document.getElementById('final-time').textContent = `Zeit: ${min}:${sec.toString().padStart(2, '0')}`
  showScreen('result-screen')
}

function startGame() {
  currentQuestion = 0
  score = 0
  startTime = Date.now()
  generateQuestions()
  showScreen('question-screen')
  showQuestion()
  timerInterval = setInterval(updateTimer, 1000)
}

document.getElementById('start-btn').addEventListener('click', startGame)
document.getElementById('restart-btn').addEventListener('click', startGame)
