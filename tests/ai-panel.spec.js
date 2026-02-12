import { test, expect } from '@playwright/test'

// Helper: Login and navigate to Create page in Free Mode
async function goToFreeMode(page) {
  await page.goto('http://localhost:5173/login')
  await page.fill('input[type="email"]', 'test@mindforge.dev')
  await page.fill('input[type="password"]', 'test1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('http://localhost:5173/', { timeout: 5000 })

  await page.goto('http://localhost:5173/create')
  await page.waitForLoadState('networkidle')

  const freeformBtn = page.locator('text=Freier Modus').first()
  if (await freeformBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await freeformBtn.click()
  }

  await page.waitForTimeout(1000)
}

test.describe('Editor Fullscreen Layout', () => {

  test('editor covers entire screen (no sidebar/navbar visible)', async ({ page }) => {
    await goToFreeMode(page)

    const editorFullscreen = page.locator('[data-testid="editor-fullscreen"]')
    await expect(editorFullscreen).toBeVisible({ timeout: 5000 })

    // Should have fixed positioning covering the viewport
    await expect(editorFullscreen).toHaveCSS('position', 'fixed')

    // Sidebar should NOT be visible (covered by z-60)
    const sidebar = page.locator('aside')
    const sidebarBox = await sidebar.boundingBox().catch(() => null)
    const editorBox = await editorFullscreen.boundingBox()

    // Editor should start at top-left corner (0, 0)
    expect(editorBox.x).toBe(0)
    expect(editorBox.y).toBe(0)

    // Editor should fill viewport
    const viewport = page.viewportSize()
    expect(editorBox.width).toBe(viewport.width)
    expect(editorBox.height).toBe(viewport.height)
  })

  test('editor has consistent black-gray theme', async ({ page }) => {
    await goToFreeMode(page)

    const editorFullscreen = page.locator('[data-testid="editor-fullscreen"]')
    await expect(editorFullscreen).toBeVisible({ timeout: 5000 })

    // Background should be dark (#1e1e1e)
    const bg = await editorFullscreen.evaluate((el) => getComputedStyle(el).backgroundColor)
    // #1e1e1e = rgb(30, 30, 30)
    expect(bg).toBe('rgb(30, 30, 30)')
  })

  test('editor + preview are side by side above AI panel', async ({ page }) => {
    await goToFreeMode(page)

    // File tabs visible
    await expect(page.locator('text=index.html').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=style.css').first()).toBeVisible()
    await expect(page.locator('text=script.js').first()).toBeVisible()

    // Preview visible
    await expect(page.locator('text=Live Preview').first()).toBeVisible()

    // AI panel below
    const aiPanel = page.locator('[data-testid="ai-panel"]')
    await expect(aiPanel).toBeVisible()

    // Resize handle
    const resizeHandle = page.locator('[data-testid="resize-handle"]')
    await expect(resizeHandle).toBeVisible()
  })

  test('toolbar has Metadaten and Veroeffentlichen buttons', async ({ page }) => {
    await goToFreeMode(page)

    await expect(page.locator('text=Metadaten').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Veroeffentlichen').first()).toBeVisible()
    await expect(page.locator('text=Freier Modus').first()).toBeVisible()
  })

  test('no KI-Chat toggle button exists', async ({ page }) => {
    await goToFreeMode(page)
    await page.waitForTimeout(500)
    const kiChatBtn = page.locator('button:has-text("KI-Chat")')
    await expect(kiChatBtn).toHaveCount(0)
  })
})

test.describe('Forge KI Personality & Preview Cards', () => {

  test('FORGE tab is visible with robot emoji', async ({ page }) => {
    await goToFreeMode(page)

    const aiPanel = page.locator('[data-testid="ai-panel"]')
    await expect(aiPanel).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=FORGE').first()).toBeVisible()
    await expect(page.locator('[data-testid="ai-input"]')).toBeVisible()
  })

  test('initial message contains Forge personality', async ({ page }) => {
    await goToFreeMode(page)

    await expect(page.locator('text=FORGE').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Abenteurer').first()).toBeVisible()
    await expect(page.locator('text=KI-Schmied').first()).toBeVisible()
  })

  test('typing unknown text shows multiple-choice category suggestions', async ({ page }) => {
    await goToFreeMode(page)

    const aiInput = page.locator('[data-testid="ai-input"]')
    await aiInput.fill('mache etwas ganz anderes xyz')
    await page.locator('[data-testid="ai-send-btn"]').click()

    // Wait for AI response (mock delay ~1s + rendering)
    await page.waitForTimeout(2000)

    // Should show suggestion chips (multiple choice categories)
    const suggestions = page.locator('[data-testid="ai-suggestions"]')
    await expect(suggestions).toBeVisible({ timeout: 8000 })

    // Should have clickable category buttons
    const chips = suggestions.locator('button')
    const chipCount = await chips.count()
    expect(chipCount).toBeGreaterThan(2)

    // Should use Forge's voice
    await expect(page.locator('text=Abenteurer').first()).toBeVisible()
  })

  test('clicking a suggestion chip triggers PreviewCard response', async ({ page }) => {
    await goToFreeMode(page)

    const aiInput = page.locator('[data-testid="ai-input"]')
    await aiInput.fill('erstelle was')
    await page.locator('[data-testid="ai-send-btn"]').click()

    await page.waitForTimeout(1500)

    // Click the quiz suggestion
    const quizChip = page.locator('[data-testid="suggestion-quiz"]')
    if (await quizChip.isVisible().catch(() => false)) {
      await quizChip.click()
      await page.waitForTimeout(1500)

      // Should show PreviewCard with Quiz label
      await expect(page.locator('[data-testid="preview-card"]').first()).toBeVisible({ timeout: 5000 })
      await expect(page.locator('text=Quiz').first()).toBeVisible()
    }
  })

  test('exact keyword match shows PreviewCard with insert button', async ({ page }) => {
    await goToFreeMode(page)

    const aiInput = page.locator('[data-testid="ai-input"]')
    await aiInput.fill('erstelle ein quiz mit fragen')
    await page.locator('[data-testid="ai-send-btn"]').click()

    await page.waitForTimeout(1500)

    // Should show PreviewCard
    const card = page.locator('[data-testid="preview-card"]').first()
    await expect(card).toBeVisible({ timeout: 5000 })

    // Should have Einfuegen button
    await expect(page.locator('[data-testid="insert-btn"]').first()).toBeVisible()
    await expect(page.locator('text=Einfuegen').first()).toBeVisible()

    // Should show difficulty badge
    await expect(page.locator('text=Mittel').first()).toBeVisible()
  })

  test('PreviewCard code toggle shows expandable code section', async ({ page }) => {
    await goToFreeMode(page)

    const aiInput = page.locator('[data-testid="ai-input"]')
    await aiInput.fill('mach einen countdown timer')
    await page.locator('[data-testid="ai-send-btn"]').click()

    await page.waitForTimeout(1500)

    // PreviewCard should be visible
    await expect(page.locator('[data-testid="preview-card"]').first()).toBeVisible({ timeout: 5000 })

    // Click Code toggle button
    const codeToggle = page.locator('[data-testid="toggle-code-btn"]').first()
    await expect(codeToggle).toBeVisible()
    await codeToggle.click()

    await page.waitForTimeout(500)

    // Should now show code with language labels
    await expect(page.locator('text=html').first()).toBeVisible()
    await expect(page.locator('text=Nur diesen Code').first()).toBeVisible()
  })

  test('insert button applies code and shows achievement', async ({ page }) => {
    await goToFreeMode(page)

    const aiInput = page.locator('[data-testid="ai-input"]')
    await aiInput.fill('memory spiel')
    await page.locator('[data-testid="ai-send-btn"]').click()

    await page.waitForTimeout(1500)

    // PreviewCard should be visible
    await expect(page.locator('[data-testid="preview-card"]').first()).toBeVisible({ timeout: 5000 })

    // Click Einfuegen button
    const insertBtn = page.locator('[data-testid="insert-btn"]').first()
    await insertBtn.click()

    // Should show achievement message
    await expect(page.locator('text=geschmiedet').first()).toBeVisible({ timeout: 3000 })
    await expect(page.locator('text=Eingefuegt').first()).toBeVisible()
  })

  test('fuzzy match works with partial words', async ({ page }) => {
    await goToFreeMode(page)

    const aiInput = page.locator('[data-testid="ai-input"]')
    await aiInput.fill('mach einen countdown timer')
    await page.locator('[data-testid="ai-send-btn"]').click()

    await page.waitForTimeout(1500)

    // Should match timer/countdown pattern and show PreviewCard
    await expect(page.locator('[data-testid="preview-card"]').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Timer').first()).toBeVisible()
  })

  test('hilfe command shows all categories with Forge voice', async ({ page }) => {
    await goToFreeMode(page)

    const aiInput = page.locator('[data-testid="ai-input"]')
    await aiInput.fill('hilfe')
    await page.locator('[data-testid="ai-send-btn"]').click()

    await page.waitForTimeout(1500)

    await expect(page.locator('text=Spielmechaniken').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=UI-Elemente').first()).toBeVisible()
    await expect(page.locator('text=Arsenal').first()).toBeVisible()
  })

  test('request counter increments after sending message', async ({ page }) => {
    await goToFreeMode(page)

    await expect(page.locator('text=0/50').first()).toBeVisible({ timeout: 5000 })

    const aiInput = page.locator('[data-testid="ai-input"]')
    await aiInput.fill('hallo')
    await page.locator('[data-testid="ai-send-btn"]').click()

    await page.waitForTimeout(1000)

    await expect(page.locator('text=1/50').first()).toBeVisible({ timeout: 3000 })
  })
})

test.describe('No Visual Bugs', () => {

  test('no horizontal overflow in editor', async ({ page }) => {
    await goToFreeMode(page)

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
  })

  test('no vertical overflow (no scrollbar on body)', async ({ page }) => {
    await goToFreeMode(page)

    await page.waitForTimeout(500)
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight)
    const clientHeight = await page.evaluate(() => document.documentElement.clientHeight)
    // Allow small tolerance (1px)
    expect(scrollHeight).toBeLessThanOrEqual(clientHeight + 1)
  })

  test('AI panel does not overflow its container', async ({ page }) => {
    await goToFreeMode(page)

    const aiPanel = page.locator('[data-testid="ai-panel"]')
    const box = await aiPanel.boundingBox()
    const viewport = page.viewportSize()

    // AI panel bottom should not extend beyond viewport
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1)
  })

  test('back button navigates away from editor', async ({ page }) => {
    await goToFreeMode(page)

    await expect(page.locator('[data-testid="editor-fullscreen"]')).toBeVisible({ timeout: 5000 })

    // Click back button
    const backBtn = page.locator('[data-testid="editor-fullscreen"] button').first()
    await backBtn.click()

    await page.waitForTimeout(500)

    // Should no longer be in fullscreen editor
    await expect(page.locator('[data-testid="editor-fullscreen"]')).not.toBeVisible({ timeout: 3000 })
  })
})
