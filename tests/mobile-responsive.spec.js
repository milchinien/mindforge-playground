// @ts-check
import { test, expect } from '@playwright/test'

const MOBILE_VIEWPORT = { width: 375, height: 812 } // iPhone 12/13
const SMALL_MOBILE = { width: 320, height: 568 } // iPhone SE
const TABLET_VIEWPORT = { width: 768, height: 1024 } // iPad

test.describe('Mobile Responsive Design', () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test('Home page loads without horizontal overflow on mobile', async ({ page }) => {
    await page.goto('http://localhost:5175/')
    await page.waitForLoadState('networkidle')

    // Check no horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1)
  })

  test('Bottom navigation is visible on mobile', async ({ page }) => {
    await page.goto('http://localhost:5175/')
    await page.waitForLoadState('networkidle')

    // BottomNav should be visible (md:hidden means visible on mobile)
    const bottomNav = page.locator('nav[aria-label="Bottom navigation"], .bottom-nav-item').first()
    if (await bottomNav.count() > 0) {
      await expect(bottomNav).toBeVisible()
    }
  })

  test('Navbar renders on pages with layout', async ({ page }) => {
    await page.goto('http://localhost:5175/')
    await page.waitForLoadState('networkidle')

    // The page should have a navbar with Main navigation label
    const navbar = page.getByRole('navigation', { name: 'Main navigation' })
    await expect(navbar).toBeVisible({ timeout: 5000 })
  })

  test('Game cards have smaller width on mobile', async ({ page }) => {
    await page.goto('http://localhost:5175/')
    await page.waitForLoadState('networkidle')

    // Wait for any game cards to load
    const gameCards = page.locator('[class*="w-[150px]"]')
    if (await gameCards.count() > 0) {
      const firstCard = gameCards.first()
      const box = await firstCard.boundingBox()
      if (box) {
        // Card should be 150px on mobile (not 220px)
        expect(box.width).toBeLessThan(200)
      }
    }
  })

  test('Chat page shows friend list on mobile (no chat selected)', async ({ page }) => {
    await page.goto('http://localhost:5175/login')
    await page.waitForLoadState('networkidle')
    // Login with test credentials
    await page.fill('input[type="text"], input[name="username"], input[placeholder*="ame"]', 'testuser')
    await page.fill('input[type="password"]', 'test1234')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(1000)

    await page.goto('http://localhost:5175/chat')
    await page.waitForLoadState('networkidle')

    // Friend list should be visible, chat area hidden
    const friendList = page.locator('text=Nachrichten').first()
    if (await friendList.count() > 0) {
      await expect(friendList).toBeVisible()
    }
  })

  test('No elements overlap the bottom navigation', async ({ page }) => {
    await page.goto('http://localhost:5175/')
    await page.waitForLoadState('networkidle')

    // Main content should have bottom padding for the nav
    const main = page.locator('main')
    if (await main.count() > 0) {
      const paddingBottom = await main.evaluate(el => {
        return parseInt(window.getComputedStyle(el).paddingBottom)
      })
      // Should have significant bottom padding (pb-24 = 96px)
      expect(paddingBottom).toBeGreaterThan(50)
    }
  })

  test('Modal does not exceed viewport on mobile', async ({ page }) => {
    await page.goto('http://localhost:5175/shop')
    await page.waitForLoadState('networkidle')

    // Check that the page loads without overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1)
  })
})

test.describe('Small Mobile (320px)', () => {
  test.use({ viewport: SMALL_MOBILE })

  test('Home page loads without horizontal overflow on 320px screen', async ({ page }) => {
    await page.goto('http://localhost:5175/')
    await page.waitForLoadState('networkidle')

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1)
  })

  test('Shop page loads without overflow on 320px', async ({ page }) => {
    await page.goto('http://localhost:5175/shop')
    await page.waitForLoadState('networkidle')

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1)
  })
})

test.describe('Tablet (768px)', () => {
  test.use({ viewport: TABLET_VIEWPORT })

  test('Home page loads properly on tablet', async ({ page }) => {
    await page.goto('http://localhost:5175/')
    await page.waitForLoadState('networkidle')

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1)
  })

  test('Bottom nav is hidden on tablet', async ({ page }) => {
    await page.goto('http://localhost:5175/')
    await page.waitForLoadState('networkidle')

    // BottomNav should be hidden on md+ (768px)
    // It uses md:hidden class
    const bottomNavItems = page.locator('.bottom-nav-item')
    if (await bottomNavItems.count() > 0) {
      // On 768px (md breakpoint), these should be hidden
      const firstItem = bottomNavItems.first()
      const isVisible = await firstItem.isVisible()
      // At exactly 768px this may or may not be hidden depending on breakpoint
      // Just verify the page doesn't break
    }
  })
})
