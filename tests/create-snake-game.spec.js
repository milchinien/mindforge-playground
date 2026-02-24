import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', 'dev@mindforge.dev')
  await page.fill('input[type="password"]', 'dev1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/', { timeout: 5000 })
}

const SNAKE_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Snake</title>
</head>
<body>
  <div id="game-container">
    <div id="score-board">
      <span>Score: <span id="score">0</span></span>
      <span>High Score: <span id="highscore">0</span></span>
    </div>
    <canvas id="gameCanvas" width="400" height="400"></canvas>
    <div id="overlay" class="hidden">
      <h2 id="overlay-title">Snake</h2>
      <p id="overlay-text">Druecke SPACE oder tippe um zu starten</p>
      <button id="start-btn">Start</button>
    </div>
    <div id="controls">
      <button class="control-btn" data-dir="up">&#9650;</button>
      <div class="control-row">
        <button class="control-btn" data-dir="left">&#9664;</button>
        <button class="control-btn" data-dir="down">&#9660;</button>
        <button class="control-btn" data-dir="right">&#9654;</button>
      </div>
    </div>
  </div>
</body>
</html>`

const SNAKE_CSS = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #0f0f23;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  color: #fff;
  overflow: hidden;
}

#game-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

#score-board {
  display: flex;
  justify-content: space-between;
  width: 400px;
  font-size: 16px;
  font-weight: 600;
  color: #a0a0c0;
}

#score-board span span {
  color: #4ade80;
}

#gameCanvas {
  border: 2px solid #2a2a4a;
  border-radius: 8px;
  background: #1a1a2e;
}

#overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(15, 15, 35, 0.95);
  border: 2px solid #4ade80;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  z-index: 10;
}

#overlay.hidden {
  display: none;
}

#overlay h2 {
  font-size: 28px;
  color: #4ade80;
  margin-bottom: 8px;
}

#overlay p {
  color: #a0a0c0;
  margin-bottom: 16px;
  font-size: 14px;
}

#start-btn {
  background: #4ade80;
  color: #0f0f23;
  border: none;
  padding: 10px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

#start-btn:hover {
  background: #22c55e;
}

#controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
}

.control-row {
  display: flex;
  gap: 4px;
}

.control-btn {
  width: 48px;
  height: 48px;
  background: #1a1a2e;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  color: #a0a0c0;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover, .control-btn:active {
  background: #2a2a4a;
  color: #4ade80;
  border-color: #4ade80;
}`

const SNAKE_JS = `const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highscoreEl = document.getElementById('highscore');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayText = document.getElementById('overlay-text');
const startBtn = document.getElementById('start-btn');

const GRID = 20;
const TILE = canvas.width / GRID;

let snake, direction, nextDirection, food, score, highscore, gameRunning, gameLoop;

highscore = parseInt(localStorage.getItem('snake_hs') || '0');
highscoreEl.textContent = highscore;

function init() {
  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  scoreEl.textContent = score;
  placeFood();
  overlay.classList.add('hidden');
  gameRunning = true;
  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(update, 120);
}

function placeFood() {
  do {
    food = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some(s => s.x === food.x && s.y === food.y));
}

function update() {
  direction = { ...nextDirection };
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Wall collision
  if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
    return gameOver();
  }
  // Self collision
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    return gameOver();
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  // Background
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid (subtle)
  ctx.strokeStyle = '#1f1f38';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= GRID; i++) {
    ctx.beginPath();
    ctx.moveTo(i * TILE, 0);
    ctx.lineTo(i * TILE, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * TILE);
    ctx.lineTo(canvas.width, i * TILE);
    ctx.stroke();
  }

  // Food
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(food.x * TILE + TILE / 2, food.y * TILE + TILE / 2, TILE / 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Snake
  snake.forEach((seg, i) => {
    const ratio = 1 - i / snake.length;
    const g = Math.floor(180 + 75 * ratio);
    ctx.fillStyle = i === 0 ? '#4ade80' : \`rgb(30, \${g}, 80)\`;
    ctx.shadowColor = i === 0 ? '#4ade80' : 'transparent';
    ctx.shadowBlur = i === 0 ? 6 : 0;
    const pad = i === 0 ? 1 : 2;
    ctx.fillRect(seg.x * TILE + pad, seg.y * TILE + pad, TILE - pad * 2, TILE - pad * 2);
  });
  ctx.shadowBlur = 0;
}

function gameOver() {
  gameRunning = false;
  clearInterval(gameLoop);
  if (score > highscore) {
    highscore = score;
    highscoreEl.textContent = highscore;
    localStorage.setItem('snake_hs', String(highscore));
  }
  overlayTitle.textContent = 'Game Over';
  overlayText.textContent = 'Score: ' + score + ' | Druecke SPACE oder tippe';
  startBtn.textContent = 'Nochmal';
  overlay.classList.remove('hidden');
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (!gameRunning) init();
    return;
  }
  const map = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    KeyW: { x: 0, y: -1 },
    KeyS: { x: 0, y: 1 },
    KeyA: { x: -1, y: 0 },
    KeyD: { x: 1, y: 0 },
  };
  const newDir = map[e.code];
  if (newDir && (newDir.x + direction.x !== 0 || newDir.y + direction.y !== 0)) {
    nextDirection = newDir;
  }
});

// Touch / button controls
document.querySelectorAll('.control-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!gameRunning) { init(); return; }
    const dirMap = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };
    const newDir = dirMap[btn.dataset.dir];
    if (newDir && (newDir.x + direction.x !== 0 || newDir.y + direction.y !== 0)) {
      nextDirection = newDir;
    }
  });
});

startBtn.addEventListener('click', () => { if (!gameRunning) init(); });

// Show start overlay
overlay.classList.remove('hidden');
draw = draw || (() => {});
// Initial draw
snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
direction = { x: 1, y: 0 };
nextDirection = { x: 1, y: 0 };
food = { x: 15, y: 10 };
score = 0;
gameRunning = false;
draw();`

test.describe('Create Snake Game via Freeform Editor', () => {
  test('create and publish a Snake game', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()

    // Handle alert dialogs (validation errors)
    page.on('dialog', async (dialog) => {
      console.log('Dialog:', dialog.message())
      await dialog.accept()
    })

    // Step 1: Login with dev account
    await login(page)
    await expect(page).toHaveURL(BASE + '/')

    // Step 2: Navigate to Create page
    await page.goto(`${BASE}/create`, { waitUntil: 'networkidle' })

    // Step 3: Select Freeform mode (Code Editor)
    // Mode selector shows 3 cards: Template, Freeform, ZIP
    // Freeform title is "Free Mode" (en) or "Freier Modus" (de)
    const freeformBtn = page.locator('button').filter({ hasText: /Free Mode|Freier Modus/i })
    await expect(freeformBtn).toBeVisible({ timeout: 5000 })
    await freeformBtn.click()

    // Step 4: Wait for the code editor to load
    const editorContainer = page.locator('[data-testid="editor-fullscreen"]')
    await expect(editorContainer).toBeVisible({ timeout: 10000 })

    // Step 5: Set the HTML code via Monaco Editor
    // Click on index.html tab to ensure it's active
    await page.click('button:has-text("index.html")')
    await page.waitForTimeout(500)

    // Use Monaco's setValue via the editor instance
    await page.evaluate((html) => {
      const editors = window.monaco?.editor?.getEditors?.()
      if (editors && editors.length > 0) {
        editors[0].setValue(html)
        editors[0].trigger('test', 'editor.action.formatDocument', {})
      }
    }, SNAKE_HTML)
    await page.waitForTimeout(300)

    // Step 6: Switch to CSS tab and set CSS
    await page.click('button:has-text("style.css")')
    await page.waitForTimeout(500)

    await page.evaluate((css) => {
      const editors = window.monaco?.editor?.getEditors?.()
      if (editors && editors.length > 0) {
        editors[0].setValue(css)
      }
    }, SNAKE_CSS)
    await page.waitForTimeout(300)

    // Step 7: Switch to JS tab and set JS
    await page.click('button:has-text("script.js")')
    await page.waitForTimeout(500)

    await page.evaluate((js) => {
      const editors = window.monaco?.editor?.getEditors?.()
      if (editors && editors.length > 0) {
        editors[0].setValue(js)
      }
    }, SNAKE_JS)
    await page.waitForTimeout(300)

    // Step 8: Open Metadata panel
    await page.click('button:has-text("Metadaten")')
    await page.waitForTimeout(500)

    // Step 9: Fill in metadata
    // Title
    const titleInput = page.locator('input[placeholder="Spieltitel"]')
    await expect(titleInput).toBeVisible({ timeout: 3000 })
    await titleInput.fill('Snake Classic')

    // Description
    const descTextarea = page.locator('textarea[placeholder*="Beschreibe"]')
    await descTextarea.fill('Das klassische Snake-Spiel! Steuere die Schlange mit Pfeiltasten oder WASD, sammle rotes Futter und werde immer laenger. Vorsicht vor den Waenden und deinem eigenen Schwanz!')

    // Subject (Informatik)
    const subjectSelect = page.locator('select').first()
    await subjectSelect.selectOption('informatik')

    // Tags
    const tagInput = page.locator('input[placeholder="Tag..."]')
    await tagInput.fill('snake')
    await tagInput.press('Enter')
    await page.waitForTimeout(200)
    await tagInput.fill('spiel')
    await tagInput.press('Enter')
    await page.waitForTimeout(200)
    await tagInput.fill('arcade')
    await tagInput.press('Enter')
    await page.waitForTimeout(200)

    // Close metadata panel — the X button is inside the Metadaten panel header
    const metadataPanel = page.locator('.fixed.inset-0 .w-96')
    const closeBtn = metadataPanel.locator('button').first()
    await closeBtn.click()
    await page.waitForTimeout(300)

    // Step 10: Publish
    await page.click('button:has-text("Veroeffentlichen")')
    await page.waitForTimeout(1000)

    // Step 11: Verify we're redirected to /browse after publish
    await expect(page).toHaveURL(/\/browse/, { timeout: 5000 })

    // Step 12: Verify the game appears in browse
    const snakeCard = page.locator('text=Snake Classic')
    await expect(snakeCard.first()).toBeVisible({ timeout: 5000 })

    console.log('Snake game created and published successfully!')

    await context.close()
  })
})
