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

test('Debug 3D import errors', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
  const page = await context.newPage()

  // Capture ALL console messages from the start
  const allLogs = []
  page.on('console', msg => allLogs.push(`[${msg.type()}] ${msg.text()}`))
  page.on('pageerror', err => allLogs.push(`[PAGE_ERROR] ${err.message}`))

  await login(page)
  await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  // Click toggle
  const btn = page.locator('button').filter({ hasText: /^2D$/ }).first()
  await btn.click()
  await page.waitForTimeout(6000)

  // Print all logs
  console.log('\n=== ALL CONSOLE OUTPUT ===')
  allLogs.forEach(l => console.log(l))
  console.log('=== END ===\n')

  await context.close()
})
