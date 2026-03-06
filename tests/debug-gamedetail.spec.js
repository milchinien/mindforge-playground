import { test, expect } from '@playwright/test'
const BASE = 'http://localhost:5173'

test('Debug GameDetail after play', async ({ page }) => {
  const errors = []
  page.on('pageerror', err => errors.push(err.message.substring(0, 200)))

  // Login
  await page.goto(`${BASE}/login`)
  await page.fill('input[type="text"]', 'test@mindforge.dev')
  await page.fill('input[type="password"]', 'test1234')
  await page.click('button[type="submit"]')
  await page.waitForTimeout(2000)

  // First go to /play (like test 1 does)
  await page.goto(`${BASE}/play/game-001`)
  await page.waitForTimeout(2000)

  // Now navigate to GameDetail (like test 2 does)
  await page.goto(`${BASE}/game/game-002`)
  await page.waitForTimeout(3000)

  // Print errors
  if (errors.length > 0) {
    console.log('PAGE ERRORS:')
    errors.forEach(e => console.log('  -', e))
  }

  // Check if page crashed
  const hasCrash = await page.locator('text=Something went wrong').count()
  if (hasCrash > 0) {
    // Get error text from error boundary
    const errorText = await page.locator('pre, code, .text-red-400, [class*=error]').first().textContent().catch(() => 'N/A')
    console.log('ERROR BOUNDARY TEXT:', errorText)
  }
  expect(hasCrash).toBe(0)
})
