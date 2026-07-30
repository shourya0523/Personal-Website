import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const NOTION_COFFEE_URL = 'https://calendar.notion.so/meet/shourya0523/coffee'

test.describe('Obsession coffee chat', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/coffee')
    await page.waitForLoadState('domcontentloaded')
  })

  test('loads themed page outside the OS shell', async ({ page }) => {
    await expect(page.getByTestId('coffee-chat')).toBeVisible({ timeout: 15000 })
    await expect(page.getByText(/No no no no no/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /login/i })).toHaveCount(0)
  })

  test('calendar CTA opens Notion meet link', async ({ page }) => {
    const cta = page.getByTestId('coffee-calendar-card')
    await expect(cta).toBeVisible({ timeout: 15000 })
    await expect(cta).toHaveAttribute('href', NOTION_COFFEE_URL)
    await expect(cta).toHaveAttribute('target', '_blank')
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
