import { test } from '@playwright/test'

const BASE = 'http://localhost:5173'

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  const emailInput = page.locator('input[type="text"]').first()
  await emailInput.fill('dev@mindforge.dev')
  await page.fill('input[type="password"]', 'dev1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/', { timeout: 8000 })
}

test('Screenshot avatar page with WebGL check', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  })
  const page = await context.newPage()

  // Check WebGL support
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  const hasWebGL = await page.evaluate(() => {
    try {
      const canvas = document.createElement('canvas')
      return !!(canvas.getContext('webgl') || canvas.getContext('webgl2'))
    } catch { return false }
  })
  console.log('WebGL available:', hasWebGL)

  await login(page)
  await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  // Screenshot 2D mode
  await page.screenshot({ path: 'tests/screenshots/real-2d-mode.png', fullPage: true })

  // Click toggle
  const btn = page.locator('button').filter({ hasText: /^2D$/ }).first()
  console.log('2D button visible:', await btn.isVisible())
  await btn.click()
  await page.waitForTimeout(5000)

  // Check for errors in console
  const errors = []
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text())
  })

  // Screenshot 3D mode
  await page.screenshot({ path: 'tests/screenshots/real-3d-mode.png', fullPage: true })

  // Check what's rendered
  const canvasCount = await page.locator('canvas').count()
  console.log('Canvas elements:', canvasCount)
  console.log('Console errors:', errors)

  await context.close()
})
