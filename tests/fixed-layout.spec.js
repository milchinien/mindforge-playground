import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5174'

test('Navbar is fixed and stays in place when scrolling', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
  const page = await context.newPage()
  await page.goto(`${BASE_URL}/browse`, { waitUntil: 'networkidle' })

  const navbar = await page.$('nav')
  expect(navbar).not.toBeNull()

  // Check navbar has position fixed
  const position = await navbar.evaluate(el => getComputedStyle(el).position)
  expect(position).toBe('fixed')

  // Get navbar position before scroll
  const beforeScroll = await navbar.boundingBox()

  // Scroll down
  await page.evaluate(() => window.scrollBy(0, 500))
  await page.waitForTimeout(300)

  // Get navbar position after scroll
  const afterScroll = await navbar.boundingBox()

  // Navbar should not have moved
  expect(afterScroll.y).toBe(beforeScroll.y)
  console.log(`Navbar before scroll: y=${beforeScroll.y}, after scroll: y=${afterScroll.y} - FIXED`)

  await context.close()
})

test('Sidebar is fixed and stays in place when scrolling', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
  const page = await context.newPage()
  await page.goto(`${BASE_URL}/browse`, { waitUntil: 'networkidle' })

  const sidebar = await page.$('aside')
  expect(sidebar).not.toBeNull()

  // Check sidebar has position fixed
  const position = await sidebar.evaluate(el => getComputedStyle(el).position)
  expect(position).toBe('fixed')

  // Get sidebar position before scroll
  const beforeScroll = await sidebar.boundingBox()

  // Scroll down
  await page.evaluate(() => window.scrollBy(0, 500))
  await page.waitForTimeout(300)

  // Get sidebar position after scroll
  const afterScroll = await sidebar.boundingBox()

  // Sidebar should not have moved
  expect(afterScroll.y).toBe(beforeScroll.y)
  console.log(`Sidebar before scroll: y=${beforeScroll.y}, after scroll: y=${afterScroll.y} - FIXED`)

  await context.close()
})

test('No horizontal scrolling exists', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
  const page = await context.newPage()
  await page.goto(`${BASE_URL}/browse`, { waitUntil: 'networkidle' })

  const scrollInfo = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))

  expect(scrollInfo.scrollWidth).toBeLessThanOrEqual(scrollInfo.clientWidth)
  console.log(`scrollWidth=${scrollInfo.scrollWidth}, clientWidth=${scrollInfo.clientWidth}`)

  await context.close()
})
