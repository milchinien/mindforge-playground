import { test, expect } from '@playwright/test'

test('MindCoin icon displays in navbar after login', async ({ page }) => {
  // Login
  await page.goto('http://localhost:5173/login')
  await page.fill('input[type="email"]', 'test@mindforge.dev')
  await page.fill('input[type="password"]', 'test1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('http://localhost:5173/', { timeout: 5000 })

  // Check MindCoin icon is visible in navbar
  const mindcoinImg = page.locator('nav img[alt="MindCoin"]').first()
  await expect(mindcoinImg).toBeVisible()
})

test('MindCoin icon displays in shop page', async ({ page }) => {
  // Login
  await page.goto('http://localhost:5173/login')
  await page.fill('input[type="email"]', 'test@mindforge.dev')
  await page.fill('input[type="password"]', 'test1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('http://localhost:5173/', { timeout: 5000 })

  // Navigate to shop
  await page.goto('http://localhost:5173/shop')

  // Check multiple MindCoin icons are visible (balance + packages)
  const mindcoinImgs = page.locator('img[alt="MindCoin"]')
  await expect(mindcoinImgs.first()).toBeVisible()
  expect(await mindcoinImgs.count()).toBeGreaterThanOrEqual(2)
})
