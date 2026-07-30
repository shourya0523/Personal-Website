import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const NOTION_COFFEE_URL = 'https://calendar.notion.so/meet/shourya0523/coffee'

async function completeWillowIntro(page) {
  await expect(page.getByTestId('willow-intro')).toBeVisible({ timeout: 15000 })
  // Tooltip floats forever — force avoids Playwright "element is not stable" timeouts.
  await page.getByTestId('willow-open').click({ force: true })
  await expect(page.getByTestId('willow-wish')).toBeVisible({ timeout: 15000 })
  await page.getByTestId('willow-wish').click({ force: true })
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

    await page.getByTestId('willow-open').click({ force: true })
    await expect(page.getByTestId('willow-wish')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('coffee-calendar-card')).toHaveCount(0)

    await page.getByTestId('willow-wish').click({ force: true })
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
    // Wait for COFFEE? loader → open tooltip (frames preload).
    await expect(page.getByTestId('willow-open')).toBeVisible({ timeout: 30000 })
    const introLayout = await page.evaluate(() => {
      const tip = document.querySelector('.willow-intro__tooltip')?.getBoundingClientRect()
      return {
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        tipVisible: tip ? tip.width > 0 && tip.bottom <= window.innerHeight + 1 : false,
        tipOverflow: tip ? tip.right > window.innerWidth + 1 || tip.left < -1 : true,
      }
    })
    expect(introLayout.overflowX).toBe(false)
    expect(introLayout.tipVisible).toBe(true)
    expect(introLayout.tipOverflow).toBe(false)

    await page.getByTestId('willow-skip').click({ force: true })
    await expect(page.getByTestId('coffee-calendar-card')).toBeVisible({ timeout: 15000 })
    // Let entrance motion settle before measuring stack order.
    await page.waitForTimeout(900)

    const revealed = await page.evaluate(() => {
      const card = document.querySelector('.coffee-calendar-card')?.getBoundingClientRect()
      const cta = document.querySelector('[data-testid="coffee-calendar-cta"]')?.getBoundingClientRect()
      const memes = document.querySelector('.coffee-chat__memes')?.getBoundingClientRect()
      const cal = document.querySelector('.coffee-chat__hero-cal')?.getBoundingClientRect()
      return {
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        cardOverflow: card ? card.right > window.innerWidth + 1 : true,
        cardWidth: card ? Math.round(card.width) : 0,
        viewport: window.innerWidth,
        viewH: window.innerHeight,
        cardTop: card ? Math.round(card.top) : null,
        calTop: cal ? Math.round(cal.top) : null,
        ctaTop: cta ? Math.round(cta.top) : null,
        memesTop: memes ? Math.round(memes.top) : null,
        memesHeight: memes ? Math.round(memes.height) : null,
        /* Booking must sit above meme stills and start in the first viewport. */
        cardAboveMemes: Boolean(cal && memes && cal.top < memes.top),
        cardStartsInViewport: card ? card.top < window.innerHeight * 0.75 : false,
        ctaReachableWithoutLongScroll: cta ? cta.top < window.innerHeight + 120 : false,
      }
    })
    expect(revealed.overflowX).toBe(false)
    expect(revealed.cardOverflow).toBe(false)
    expect(revealed.cardWidth).toBeLessThanOrEqual(revealed.viewport)
    expect(revealed.cardAboveMemes).toBe(true)
    expect(revealed.cardStartsInViewport).toBe(true)
    expect(revealed.ctaReachableWithoutLongScroll).toBe(true)
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
