import { useState, useCallback } from 'react'

const MOCK_RESPONSES = [
  {
    triggers: ['quiz', 'fragen', 'question'],
    text: 'Hier ist ein Beispiel fuer ein Quiz-System:\n\n```html\n<div id="quiz">\n  <h2 id="question"></h2>\n  <div id="options"></div>\n  <p id="score">Score: 0</p>\n</div>\n```\n\n```javascript\nconst questions = [\n  {\n    q: "Was ist 2+2?",\n    options: ["3", "4", "5"],\n    correct: 1\n  },\n  {\n    q: "Hauptstadt von Deutschland?",\n    options: ["Muenchen", "Berlin", "Hamburg"],\n    correct: 1\n  }\n];\n\nlet current = 0, score = 0;\nfunction showQuestion() {\n  const q = questions[current];\n  document.getElementById("question").textContent = q.q;\n  const opts = document.getElementById("options");\n  opts.innerHTML = "";\n  q.options.forEach((opt, i) => {\n    const btn = document.createElement("button");\n    btn.textContent = opt;\n    btn.onclick = () => checkAnswer(i);\n    opts.appendChild(btn);\n  });\n}\nfunction checkAnswer(i) {\n  if (i === questions[current].correct) score++;\n  document.getElementById("score").textContent = "Score: " + score;\n  current++;\n  if (current < questions.length) showQuestion();\n  else document.getElementById("quiz").innerHTML = "<h2>Fertig! Score: " + score + "/" + questions.length + "</h2>";\n}\nshowQuestion();\n```',
  },
  {
    triggers: ['timer', 'zeit', 'countdown'],
    text: 'Hier ist ein Countdown-Timer:\n\n```javascript\nlet timeLeft = 60;\nconst timerEl = document.createElement("div");\ntimerEl.id = "timer";\ntimerEl.style.cssText = "position:fixed;top:10px;right:10px;background:#f97316;color:white;padding:8px 16px;border-radius:8px;font-size:1.2rem;font-weight:bold;";\ndocument.body.appendChild(timerEl);\n\nconst interval = setInterval(() => {\n  timerEl.textContent = timeLeft + "s";\n  if (timeLeft <= 0) {\n    clearInterval(interval);\n    alert("Zeit abgelaufen!");\n  }\n  timeLeft--;\n}, 1000);\n```',
  },
  {
    triggers: ['animation', 'animier', 'bewegen'],
    text: 'So kannst du Animationen hinzufuegen:\n\n```css\n@keyframes fadeIn {\n  from { opacity: 0; transform: translateY(20px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50% { transform: scale(1.05); }\n}\n\n.animated {\n  animation: fadeIn 0.5s ease forwards;\n}\n\nbutton:hover {\n  animation: pulse 0.3s ease;\n}\n```',
  },
  {
    triggers: ['drag', 'ziehen', 'sortier'],
    text: 'Drag & Drop Beispiel:\n\n```javascript\nconst items = document.querySelectorAll(".draggable");\nlet draggedItem = null;\n\nitems.forEach(item => {\n  item.draggable = true;\n  item.addEventListener("dragstart", (e) => {\n    draggedItem = e.target;\n    e.target.style.opacity = "0.5";\n  });\n  item.addEventListener("dragend", (e) => {\n    e.target.style.opacity = "1";\n  });\n  item.addEventListener("dragover", (e) => {\n    e.preventDefault();\n  });\n  item.addEventListener("drop", (e) => {\n    e.preventDefault();\n    if (draggedItem !== e.target) {\n      const parent = e.target.parentNode;\n      parent.insertBefore(draggedItem, e.target);\n    }\n  });\n});\n```',
  },
]

const DEFAULT_RESPONSE = 'Gute Idee! Ich kann dir dabei helfen. Beschreibe genauer was du brauchst - z.B. "Erstelle ein Quiz mit 5 Fragen" oder "Fuege einen Timer hinzu".\n\nTipp: Je genauer deine Beschreibung, desto besser kann ich dir helfen!'

export function useAIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hallo! Ich bin dein KI-Assistent. Beschreibe was dein Spiel machen soll und ich generiere den Code dafuer.\n\nBeispiele:\n- "Erstelle ein Quiz mit Fragen"\n- "Fuege einen Countdown-Timer hinzu"\n- "Mache die Buttons animiert"' },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [requestCount, setRequestCount] = useState(0)
  const maxRequests = 50

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return

    const userMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500))

    const lowerText = text.toLowerCase()
    const matched = MOCK_RESPONSES.find(r =>
      r.triggers.some(t => lowerText.includes(t))
    )

    const aiMessage = {
      role: 'assistant',
      content: matched ? matched.text : DEFAULT_RESPONSE,
    }

    setMessages(prev => [...prev, aiMessage])
    setRequestCount(prev => prev + 1)
    setIsLoading(false)
  }, [isLoading])

  return { messages, isLoading, sendMessage, requestCount, maxRequests }
}
