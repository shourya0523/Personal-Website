import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const NOTION_COFFEE_URL = 'https://calendar.notion.so/meet/shourya0523/coffee'

async function completeWillowIntro(page) {
  await expect(page.getByTestId('willow-intro')).toBeVisible({ timeout: 15000 })
  await page.getByTestId('willow-open').click()
  await expect(page.getByTestId('willow-wish')).toBeVisible({ timeout: 15000 })
  await page.getByTestId('willow-wish').click()
  await expect(page.getByTestId('coffee-chat')).toHaveAttribute('data-revealed', 'true', {
    timeout: 15000,
  })
}

test.describe('Obsession coffee chat', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/coffee')
    await page.waitForLoadState('domcontentloaded')
  })

  test('requires open + wish clicks before revealing the site', async ({ page }) => {
    await expect(page.getByTestId('willow-intro')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('coffee-calendar-card')).toHaveCount(0)
    await expect(page.getByTestId('willow-open')).toBeVisible()
    // must not auto-show wish CTA before open
    await expect(page.getByTestId('willow-wish')).toHaveCount(0)

    await page.getByTestId('willow-open').click()
    await expect(page.getByTestId('willow-wish')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('coffee-calendar-card')).toHaveCount(0)

    await page.getByTestId('willow-wish').click()
    await expect(page.getByTestId('coffee-chat')).toHaveAttribute('data-revealed', 'true')
    await expect(page.getByText(/No no no no no/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /login/i })).toHaveCount(0)
  })

  test('calendar CTA opens Notion meet link after reveal', async ({ page }) => {
    await completeWillowIntro(page)
    const cta = page.getByTestId('coffee-calendar-cta')
    await expect(cta).toBeVisible({ timeout: 15000 })
    await expect(cta).toHaveAttribute('href', NOTION_COFFEE_URL)
    await expect(cta).toHaveAttribute('target', '_blank')
    await expect(page.getByTestId('coffee-day-picker')).toBeVisible()
  })

  test('document scroll works after reveal', async ({ page }) => {
    await completeWillowIntro(page)
    await expect(page.getByTestId('coffee-calendar-cta')).toBeVisible()

    const before = await page.evaluate(() => window.scrollY)
    await page.mouse.move(640, 360)
    await page.mouse.wheel(0, 900)
    await page.waitForTimeout(200)
    const afterWheel = await page.evaluate(() => ({
      y: window.scrollY,
      docH: document.documentElement.scrollHeight,
      viewH: window.innerHeight,
      bodyOverflow: getComputedStyle(document.body).overflowY,
      rootOverflow: getComputedStyle(document.getElementById('root')).overflowY,
    }))
    expect(afterWheel.docH).toBeGreaterThan(afterWheel.viewH)
    expect(afterWheel.bodyOverflow).toMatch(/auto|scroll|visible/)
    expect(afterWheel.y).toBeGreaterThan(before)
  })

  test('fits narrow mobile viewport without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 })
    await page.goto('/coffee')
    await page.waitForLoadState('domcontentloaded')

    await expect(page.getByTestId('willow-intro')).toBeVisible({ timeout: 15000 })
    const introLayout = await page.evaluate(() => {
      const stage = document.querySelector('.willow-intro__stage')?.getBoundingClientRect()
      const hud = document.querySelector('.willow-intro__hud')?.getBoundingClientRect()
      return {
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        overlap: stage && hud ? Math.max(0, stage.bottom - hud.top) : null,
      }
    })
    expect(introLayout.overflowX).toBe(false)
    expect(introLayout.overlap).toBe(0)

    await page.getByTestId('willow-skip').click()
    await expect(page.getByTestId('coffee-calendar-card')).toBeVisible({ timeout: 15000 })

    const revealed = await page.evaluate(() => {
      const card = document.querySelector('.coffee-calendar-card')?.getBoundingClientRect()
      return {
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        cardOverflow: card ? card.right > window.innerWidth + 1 : true,
        cardWidth: card ? Math.round(card.width) : 0,
        viewport: window.innerWidth,
      }
    })
    expect(revealed.overflowX).toBe(false)
    expect(revealed.cardOverflow).toBe(false)
    expect(revealed.cardWidth).toBeLessThanOrEqual(revealed.viewport)
  })

  test('coffee.html ships Nikki OG preview meta', async () => {
    const htmlPath = path.resolve(__dirname, '../coffee.html')
    const html = fs.readFileSync(htmlPath, 'utf8')
    expect(html).toContain('property="og:image"')
    expect(html).toContain('/assets/coffee/nikki-frown.jpg')
    expect(html).toContain('twitter:card')
    expect(html).toContain('summary_large_image')
    expect(html).toMatch(/coffee chat/i)
  })
})
