import { test, expect } from '@playwright/test'

async function unlock(page, name = 'Visitor') {
  await page.goto('/')
  await page.fill('#lock-name', name)
  await page.keyboard.press('Enter')
  await expect(page.locator('.dock')).toBeVisible()
  await page.waitForTimeout(1200) // boot reveal
}

test.describe('ShouryaOS', () => {
  test('lock screen asks for a name and unlocks to the desktop', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.lock__card')).toBeVisible()
    await unlock(page, 'Playwright')
    await expect(page.locator('.dicon[data-id="app:about"]')).toBeVisible()
    await expect(page.locator('.menubar')).toContainText('Desktop')
  })

  test('dock opens apps as windows and the menu bar follows focus', async ({ page }) => {
    await unlock(page)
    await page.click('.dock__item[aria-label="Resume"]')
    await expect(page.locator('[data-window="resume"]')).toBeVisible()
    await expect(page.locator('.menubar')).toContainText('Resume')
    await page.click('.dock__item[aria-label="Terminal"]')
    await expect(page.locator('[data-window="terminal"] input')).toBeVisible()
  })

  test('desktop icons drag to a new grid cell and persist', async ({ page }) => {
    await unlock(page)
    const icon = page.locator('.dicon[data-id="app:projects"]')
    const before = await icon.boundingBox()
    await page.mouse.move(before.x + 30, before.y + 30); await page.mouse.down()
    await page.mouse.move(before.x + 240, before.y + 40, { steps: 10 }); await page.mouse.move(before.x + 300, before.y + 40, { steps: 10 }); await page.mouse.up()
    const after = await icon.boundingBox()
    expect(Math.abs(after.x - before.x)).toBeGreaterThan(150)
    await page.reload(); await unlock(page)
    const again = await page.locator('.dicon[data-id="app:projects"]').boundingBox()
    expect(Math.round(again.x)).toBe(Math.round(after.x))
  })

  test('clicking empty desktop with windows open enters stage mode; Escape leaves it', async ({ page }) => {
    await unlock(page)
    await page.click('.dock__item[aria-label="About"]')
    await expect(page.locator('[data-window="about"]')).toBeVisible()
    await page.mouse.click(1200, 300)
    await expect(page.locator('.desktop')).toHaveClass(/desktop--stage/)
    await page.keyboard.press('Escape')
    await expect(page.locator('.desktop')).not.toHaveClass(/desktop--stage/)
  })

  test('settings switches the wallpaper and the palette attribute', async ({ page }) => {
    await unlock(page)
    await page.click('.dock__item[aria-label="Settings"]')
    await page.getByRole('button', { name: /Constellation Circuit/ }).click()
    await expect(page.locator('html')).toHaveAttribute('data-wallpaper', 'circuit')
  })
})
