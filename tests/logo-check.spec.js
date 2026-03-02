import { test } from '@playwright/test'

test('screenshot logo', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await page.waitForTimeout(1500)
  await page.screenshot({ path: 'test-results/logo-check.png', fullPage: false })

  const logo = page.locator('a[aria-label="MindForge Home"]')
  await logo.screenshot({ path: 'test-results/logo-zoomed.png' })
})
