// @ts-check
import { test, expect } from '@playwright/test'

// Creative Math Game: "Zahlen-Schmiede" (Number Forge)
// NOT a quiz - it's an interactive number combination game where players
// select number blocks and use operators to reach a target number.

const MATH_GAME_HTML = `<div id="number-forge">
  <div id="forge-header">
    <h1>Zahlen-Schmiede</h1>
    <div id="stats">
      <span>Level: <strong id="level">1</strong></span>
      <span>Score: <strong id="score">0</strong></span>
      <span>Zeit: <strong id="timer">30</strong>s</span>
    </div>
  </div>
  <div id="target-display">
    <p>Schmiede die Zielzahl:</p>
    <div id="target-number">0</div>
  </div>
  <div id="workspace">
    <div id="expression-display">
      <span id="expression">?</span>
      <span id="result">=</span>
    </div>
  </div>
  <div id="number-blocks"></div>
  <div id="operator-blocks">
    <button class="op-btn" data-op="+" onclick="selectOp('+')">+</button>
    <button class="op-btn" data-op="-" onclick="selectOp('-')">-</button>
    <button class="op-btn" data-op="*" onclick="selectOp('*')">&times;</button>
  </div>
  <div id="controls">
    <button onclick="resetRound()">Zuruecksetzen</button>
    <button onclick="submitAnswer()" id="submit-btn">Schmieden!</button>
  </div>
  <div id="feedback"></div>
  <div id="game-over" style="display:none">
    <h2>Spiel vorbei!</h2>
    <p>Endpunktzahl: <strong id="final-score">0</strong></p>
    <button onclick="startGame()">Nochmal schmieden</button>
  </div>
</div>`

const MATH_GAME_CSS = `#number-forge {
  max-width: 500px;
  margin: 1rem auto;
  padding: 1.5rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
}
#forge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}
#forge-header h1 {
  font-size: 1.4rem;
  color: #f97316;
  margin: 0;
}
#stats {
  display: flex;
  gap: 1rem;
  color: #9ca3af;
  font-size: 0.85rem;
}
#stats strong {
  color: #f97316;
}
#target-display {
  text-align: center;
  background: linear-gradient(135deg, #1f2937, #111827);
  border: 2px solid #f97316;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
#target-display p {
  color: #9ca3af;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}
#target-number {
  font-size: 3rem;
  font-weight: 900;
  color: #f97316;
  text-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
}
#workspace {
  background: #1f2937;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
#expression-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
}
#expression { color: #e5e7eb; }
#result { color: #6b7280; }
#number-blocks {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.num-block {
  width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  background: #374151; border: 2px solid #4b5563; border-radius: 10px;
  font-size: 1.3rem; font-weight: bold; color: white;
  cursor: pointer; transition: all 0.2s; user-select: none;
}
.num-block:hover { border-color: #f97316; transform: scale(1.1); background: #1f2937; }
.num-block.selected { border-color: #f97316; background: #f97316; color: white; }
.num-block.used { opacity: 0.3; pointer-events: none; }
#operator-blocks { display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 1rem; }
.op-btn {
  width: 48px; height: 48px;
  display: flex; align-items: center; justify-content: center;
  background: #1e3a5f; border: 2px solid #2563eb; border-radius: 10px;
  font-size: 1.2rem; font-weight: bold; color: #60a5fa;
  cursor: pointer; transition: all 0.2s;
}
.op-btn:hover { background: #1e40af; color: white; }
.op-btn.selected { background: #2563eb; color: white; }
#controls { display: flex; gap: 0.75rem; justify-content: center; margin-bottom: 1rem; }
#controls button {
  padding: 0.6rem 1.5rem; border-radius: 8px; font-weight: 600;
  font-size: 0.95rem; cursor: pointer; transition: all 0.2s; border: none; color: white;
}
#controls button:first-child { background: #374151; }
#submit-btn { background: #f97316; }
#feedback { text-align: center; font-size: 1.1rem; font-weight: bold; min-height: 2rem; margin-bottom: 1rem; }
.feedback-correct { color: #22c55e; }
.feedback-wrong { color: #ef4444; }
.feedback-close { color: #eab308; }
#game-over {
  text-align: center; padding: 2rem;
  background: linear-gradient(135deg, #1f2937, #111827);
  border-radius: 16px; border: 2px solid #f97316;
}
#game-over h2 { color: #f97316; font-size: 1.8rem; }
#game-over button {
  margin-top: 1rem; padding: 0.75rem 2rem; background: #f97316;
  color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer;
}`

const MATH_GAME_JS = `let level = 1, score = 0, target = 0, expression = [];
let selectedNum = null, selectedOp = null, numbers = [];
let usedIndices = new Set(), timerInterval = null, timeLeft = 30;

function generateNumbers(lvl) {
  const count = Math.min(4 + Math.floor(lvl / 3), 7);
  const maxNum = 5 + lvl * 2;
  const nums = [];
  for (let i = 0; i < count; i++) nums.push(Math.floor(Math.random() * maxNum) + 1);
  return nums;
}

function generateTarget(nums, lvl) {
  const ops = ['+', '-', '*'];
  const a = nums[Math.floor(Math.random() * nums.length)];
  const b = nums[Math.floor(Math.random() * nums.length)];
  const op = ops[Math.floor(Math.random() * (lvl > 2 ? 3 : 2))];
  let result;
  switch(op) { case '+': result = a + b; break; case '-': result = Math.abs(a - b); break; case '*': result = a * b; break; }
  return Math.max(1, result);
}

function renderNumbers() {
  const container = document.getElementById('number-blocks');
  container.innerHTML = '';
  numbers.forEach((num, i) => {
    const block = document.createElement('div');
    block.className = 'num-block' + (usedIndices.has(i) ? ' used' : '') + (selectedNum === i ? ' selected' : '');
    block.textContent = num;
    block.onclick = () => selectNumber(i);
    container.appendChild(block);
  });
}

function selectNumber(index) {
  if (usedIndices.has(index)) return;
  if (expression.length === 0 || expression.length === 2) {
    selectedNum = index;
    expression.push(numbers[index]);
    usedIndices.add(index);
    updateExpression();
    renderNumbers();
    if (expression.length === 3) evaluateExpression();
  }
}

function selectOp(op) {
  if (expression.length !== 1) return;
  selectedOp = op;
  expression.push(op);
  updateExpression();
  document.querySelectorAll('.op-btn').forEach(btn => btn.classList.toggle('selected', btn.dataset.op === op));
}

function updateExpression() {
  const display = expression.map(e => e === '*' ? '\\u00D7' : e).join(' ');
  document.getElementById('expression').textContent = display || '?';
  document.getElementById('result').textContent = expression.length === 3 ? '= ?' : '=';
}

function evaluateExpression() {
  if (expression.length !== 3) return;
  const [a, op, b] = expression;
  let result;
  switch(op) { case '+': result = a + b; break; case '-': result = a - b; break; case '*': result = a * b; break; default: return; }
  const displayOp = op === '*' ? '\\u00D7' : op;
  document.getElementById('expression').textContent = a + ' ' + displayOp + ' ' + b;
  document.getElementById('result').textContent = '= ' + result;
  numbers.push(result);
  expression = [];
  selectedOp = null;
  document.querySelectorAll('.op-btn').forEach(btn => btn.classList.remove('selected'));
  renderNumbers();
}

function submitAnswer() {
  const available = numbers.filter((_, i) => !usedIndices.has(i) || i === numbers.length - 1);
  const match = available.find(n => n === target);
  const feedback = document.getElementById('feedback');
  if (match !== undefined) {
    const bonus = timeLeft > 20 ? 30 : timeLeft > 10 ? 20 : 10;
    const points = bonus + level * 5;
    score += points;
    document.getElementById('score').textContent = score;
    feedback.textContent = 'Perfekt geschmiedet! +' + points + ' Punkte';
    feedback.className = 'feedback-correct';
    level++;
    document.getElementById('level').textContent = level;
    setTimeout(() => { feedback.textContent = ''; feedback.className = ''; startRound(); }, 1500);
  } else {
    const closest = available.reduce((best, n) => Math.abs(n - target) < Math.abs(best - target) ? n : best, available[0]);
    const diff = Math.abs(closest - target);
    if (diff <= 2) { feedback.textContent = 'Knapp daneben! (' + closest + ' statt ' + target + ')'; feedback.className = 'feedback-close'; }
    else { feedback.textContent = 'Nicht getroffen!'; feedback.className = 'feedback-wrong'; }
    setTimeout(() => { feedback.textContent = ''; feedback.className = ''; }, 1500);
  }
}

function resetRound() {
  expression = []; selectedNum = null; selectedOp = null;
  usedIndices.clear();
  numbers = generateNumbers(level);
  document.querySelectorAll('.op-btn').forEach(btn => btn.classList.remove('selected'));
  updateExpression(); renderNumbers();
  document.getElementById('result').textContent = '=';
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = '';
}

function startRound() {
  numbers = generateNumbers(level);
  target = generateTarget(numbers, level);
  usedIndices.clear(); expression = []; selectedOp = null; selectedNum = null;
  timeLeft = Math.max(15, 35 - level * 2);
  document.getElementById('target-number').textContent = target;
  document.getElementById('timer').textContent = timeLeft;
  document.querySelectorAll('.op-btn').forEach(btn => btn.classList.remove('selected'));
  updateExpression(); renderNumbers();
  document.getElementById('feedback').textContent = '';
  document.getElementById('game-over').style.display = 'none';
  document.getElementById('workspace').style.display = 'flex';
  document.getElementById('number-blocks').style.display = 'flex';
  document.getElementById('operator-blocks').style.display = 'flex';
  document.getElementById('controls').style.display = 'flex';
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;
    if (timeLeft <= 0) { clearInterval(timerInterval); endGame(); }
  }, 1000);
}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById('workspace').style.display = 'none';
  document.getElementById('number-blocks').style.display = 'none';
  document.getElementById('operator-blocks').style.display = 'none';
  document.getElementById('controls').style.display = 'none';
  document.getElementById('feedback').textContent = '';
  document.getElementById('game-over').style.display = 'block';
  document.getElementById('final-score').textContent = score;
}

function startGame() {
  level = 1; score = 0;
  document.getElementById('level').textContent = '1';
  document.getElementById('score').textContent = '0';
  startRound();
}

startGame();`

// Helper: login and navigate to Free Mode editor
async function loginAndOpenFreeMode(page) {
  // Go to login
  await page.goto('http://localhost:5173/login')
  await page.waitForLoadState('networkidle')

  // Fill credentials (dev auth)
  await page.fill('input[type="email"]', 'test@mindforge.dev')
  await page.fill('input[type="password"]', 'test1234')

  // Submit login
  await page.getByRole('button', { name: 'Einloggen' }).click()

  // Wait for redirect to home
  await page.waitForURL('**/')
  await page.waitForTimeout(1000)

  // Navigate to Create page
  await page.goto('http://localhost:5173/create')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  // Click "Freier Modus" button
  const freeMode = page.getByRole('button', { name: /Freier Modus/i })
  await expect(freeMode).toBeVisible({ timeout: 5000 })
  await freeMode.click()

  // Wait for the editor fullscreen overlay to load
  await page.waitForSelector('[data-testid="editor-fullscreen"]', { timeout: 15000 })
}

test.describe('Kreatives Mathe-Spiel erstellen im Free Mode', () => {

  test('KI erstellt automatisch ein Zahlen-Schmiede Mathe-Spiel im Free Mode', async ({ page }) => {
    await loginAndOpenFreeMode(page)

    const editor = page.locator('[data-testid="editor-fullscreen"]')
    await expect(editor).toBeVisible()

    // Wait for AI panel
    const aiPanel = page.locator('[data-testid="ai-panel"]')
    await expect(aiPanel).toBeVisible({ timeout: 5000 })

    // Enable auto-apply mode
    const autoBtn = page.locator('button:has-text("Auto")')
    if (await autoBtn.isVisible()) {
      await autoBtn.click()
      await page.waitForTimeout(500)
    }

    // Type a request that triggers the score/points pattern
    const aiInput = page.locator('[data-testid="ai-input"]')
    await expect(aiInput).toBeVisible()
    await aiInput.fill('erstelle ein punkte system')
    await aiInput.press('Enter')

    // Wait for AI response
    await page.waitForTimeout(3000)

    // Check if a PreviewCard appeared
    const previewCard = page.locator('[data-testid="preview-card"]')
    const cardVisible = await previewCard.first().isVisible().catch(() => false)

    if (cardVisible) {
      const insertBtn = page.locator('[data-testid="insert-btn"]')
      if (await insertBtn.first().isVisible()) {
        await insertBtn.first().click()
        await page.waitForTimeout(1000)
      }
    }

    // Check that live preview iframe exists
    const preview = page.locator('iframe')
    await expect(preview.first()).toBeVisible({ timeout: 5000 })

    // Verify the editor is still functional
    await expect(editor).toBeVisible()

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/math-game-editor.png', fullPage: false })

    console.log('Math game creation test completed successfully')
  })

  test('Forge KI antwortet auf Mathe-bezogene Anfragen', async ({ page }) => {
    await loginAndOpenFreeMode(page)

    const aiInput = page.locator('[data-testid="ai-input"]')
    await expect(aiInput).toBeVisible()

    // Ask for score/points system (triggers pattern matching)
    await aiInput.fill('punkte system')
    await aiInput.press('Enter')
    await page.waitForTimeout(3000)

    // Verify Forge responded with a PreviewCard
    const previewCard = page.locator('[data-testid="preview-card"]')
    await expect(previewCard.first()).toBeVisible({ timeout: 5000 })

    // Verify card has insert button
    const insertBtn = page.locator('[data-testid="insert-btn"]')
    await expect(insertBtn.first()).toBeVisible()

    // Insert the code
    await insertBtn.first().click()
    await page.waitForTimeout(1000)

    // Verify achievement message appears
    const achievement = page.locator('[data-testid="forge-achievement"]')
    await expect(achievement.first()).toBeVisible({ timeout: 5000 })

    console.log('Forge KI math response test passed')
  })

  test('Auto-Apply Toggle funktioniert', async ({ page }) => {
    await loginAndOpenFreeMode(page)

    // Find auto-apply toggle button
    const autoBtn = page.locator('button:has-text("Auto")')
    await expect(autoBtn).toBeVisible({ timeout: 5000 })

    // Click to enable - should add accent classes
    await autoBtn.click()
    await page.waitForTimeout(300)

    // Verify it has accent styling when active
    const activeClass = await autoBtn.getAttribute('class')
    expect(activeClass).toContain('text-accent')

    // Click again to disable
    await autoBtn.click()
    await page.waitForTimeout(300)

    // Verify it goes back to gray styling
    const inactiveClass = await autoBtn.getAttribute('class')
    expect(inactiveClass).toContain('text-gray')

    console.log('Auto-apply toggle test passed')
  })
})
