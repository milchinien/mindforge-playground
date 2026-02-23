import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

const pages = [
  { path: '/', title: 'Home' },
  { path: '/browse', title: 'Mindbrowser' },
  { path: '/events', title: 'Events' },
  { path: '/marketplace', title: 'Marketplace' },
]

for (const page of pages) {
  test(`No horizontal scroll on "${page.title}" (${page.path})`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const p = await context.newPage()
    await p.goto(`${BASE_URL}${page.path}`, { waitUntil: 'networkidle' })

    // Check: document scrollWidth should not exceed viewport width
    const scrollInfo = await p.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      bodyClientWidth: document.body.clientWidth,
    }))

    console.log(`${page.title}: scrollWidth=${scrollInfo.scrollWidth}, clientWidth=${scrollInfo.clientWidth}`)

    expect(scrollInfo.scrollWidth).toBeLessThanOrEqual(scrollInfo.clientWidth)
    expect(scrollInfo.bodyScrollWidth).toBeLessThanOrEqual(scrollInfo.bodyClientWidth)

    await context.close()
  })

  test(`Sidebar is fixed and does not scroll on "${page.title}"`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const p = await context.newPage()
    await p.goto(`${BASE_URL}${page.path}`, { waitUntil: 'networkidle' })

    // Check sidebar has position fixed
    const sidebar = await p.$('aside')
    if (sidebar) {
      const position = await sidebar.evaluate(el => getComputedStyle(el).position)
      expect(position).toBe('fixed')
    }

    // Check navbar is sticky/fixed
    const navbar = await p.$('nav')
    if (navbar) {
      const position = await navbar.evaluate(el => getComputedStyle(el).position)
      expect(['sticky', 'fixed']).toContain(position)
    }

    await context.close()
  })

  test(`Page title shows "${page.title}" on ${page.path}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const p = await context.newPage()
    await p.goto(`${BASE_URL}${page.path}`, { waitUntil: 'networkidle' })

    const h1 = await p.$('main h1')
    if (h1) {
      const text = await h1.textContent()
      expect(text.toLowerCase()).toContain(page.title.toLowerCase())
    }

    await context.close()
  })
}

test('No horizontal scroll at different viewport widths', async ({ browser }) => {
  const widths = [1920, 1280, 1024, 768]

  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 720 } })
    const p = await context.newPage()
    await p.goto(`${BASE_URL}/browse`, { waitUntil: 'networkidle' })

    const scrollInfo = await p.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))

    console.log(`${width}px: scrollWidth=${scrollInfo.scrollWidth}, clientWidth=${scrollInfo.clientWidth}`)
    expect(scrollInfo.scrollWidth).toBeLessThanOrEqual(scrollInfo.clientWidth)

    await context.close()
  }
})
