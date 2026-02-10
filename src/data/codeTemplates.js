export const defaultHtml = `<div id="app">
  <h1>Mein Spiel</h1>
  <p>Beginne hier mit deinem Spiel!</p>
  <div id="game-container">
    <button id="start-btn">Spiel starten</button>
  </div>
</div>`

export const defaultCss = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: #111827;
  color: #f9fafb;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#app {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #f97316;
}

#game-container {
  margin-top: 2rem;
}

button {
  background: #f97316;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #ea580c;
}`

export const defaultJs = `// Dein Spielcode hier
const startBtn = document.getElementById('start-btn');
const container = document.getElementById('game-container');

startBtn.addEventListener('click', () => {
  container.innerHTML = '<p>Spiel laeuft! 🎮</p>';
});`
