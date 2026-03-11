import { test, expect } from '@playwright/test'

test.describe('CSP & Lazy-loaded pages', () => {
  test('Mindbrowser page loads without CSP errors', async ({ page }) => {
    const cspErrors = []
    page.on('pageerror', error => {
      cspErrors.push(error.message)
    })
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        cspErrors.push(msg.text())
      }
    })

    await page.goto('http://localhost:5173/browse', { waitUntil: 'networkidle' })

    // Page should load without CSP violations
    const cspViolations = cspErrors.filter(e => e.includes('Content Security Policy'))
    expect(cspViolations).toHaveLength(0)

    // The Mindbrowser component should render (not show error boundary)
    await expect(page.locator('text=Mindbrowser').first()).toBeVisible({ timeout: 10000 })
  })

  test('Profile page loads without CSP errors', async ({ page }) => {
    const cspErrors = []
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        cspErrors.push(msg.text())
      }
    })

    await page.goto('http://localhost:5173/profile/testuser', { waitUntil: 'networkidle' })

    // Page should load without CSP violations
    const cspViolations = cspErrors.filter(e => e.includes('Content Security Policy'))
    expect(cspViolations).toHaveLength(0)

    // Should not show "Failed to fetch dynamically imported module" error
    const bodyText = await page.locator('body').textContent()
    expect(bodyText).not.toContain('Failed to fetch dynamically imported module')
  })

  test('No worker-src CSP violation on page load', async ({ page }) => {
    const workerErrors = []
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('worker-src')) {
        workerErrors.push(msg.text())
      }
    })

    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })

    expect(workerErrors).toHaveLength(0)
  })

  test('Vite HMR WebSocket connects successfully', async ({ page }) => {
    let wsConnected = false
    page.on('console', msg => {
      if (msg.text().includes('[vite] connected')) {
        wsConnected = true
      }
    })

    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })

    // Give HMR time to connect
    await page.waitForTimeout(2000)
    expect(wsConnected).toBe(true)
  })
})
