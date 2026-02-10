import { test } from '@playwright/test'

test('take screenshots', async ({ page }) => {
  await page.goto('http://localhost:5173/login')
  await page.fill('input[type="email"]', 'test@mindforge.dev')
  await page.fill('input[type="password"]', 'test1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('http://localhost:5173/')
  await page.screenshot({ path: 'tests/screenshots/home.png', fullPage: false })
  await page.goto('http://localhost:5173/shop')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'tests/screenshots/shop.png', fullPage: true })
})
