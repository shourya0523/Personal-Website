import { test, expect } from '@playwright/test'

test.describe('Music Player E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for landing page animation to complete and navigate to login
    await page.waitForTimeout(2000)
    
    // Handle login flow if present
    const loginButton = page.locator('button, [role="button"]').filter({ hasText: /login|enter|start/i }).first()
    if (await loginButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await loginButton.click()
      await page.waitForTimeout(1000)
    }
    
    // Handle name input if present
    const nameInput = page.locator('input[type="text"], input[placeholder*="name" i]').first()
    if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nameInput.fill('Test User')
      const submitButton = page.locator('button').filter({ hasText: /submit|enter|continue|start/i }).first()
      if (await submitButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await submitButton.click()
      }
      await page.waitForTimeout(2000)
    }
    
    // Wait for desktop to load
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    // Open Music Player
    const musicIcon = page.locator('text=Music').first()
    if (await musicIcon.isVisible({ timeout: 5000 }).catch(() => false)) {
      await musicIcon.dblclick()
      await page.waitForTimeout(2000)
    }
  })

  test('should display Music Player interface', async ({ page }) => {
    const musicPlayerTitle = page.locator('text=Music Player')
    await expect(musicPlayerTitle).toBeVisible({ timeout: 5000 })
    
    const searchInput = page.locator('input[placeholder*="Search for songs"]')
    await expect(searchInput).toBeVisible()
    
    const searchButton = page.locator('button:has-text("Search")')
    await expect(searchButton).toBeVisible()
  })

  test('should show initial empty state', async ({ page }) => {
    const emptyState = page.locator('text=Search for songs to get started')
    await expect(emptyState).toBeVisible({ timeout: 5000 })
  })

  test('should enable search button when typing', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search for songs"]')
    const searchButton = page.locator('button:has-text("Search")')
    
    // Button should be disabled initially
    await expect(searchButton).toBeDisabled()
    
    // Type in search input
    await searchInput.fill('test')
    
    // Button should be enabled
    await expect(searchButton).toBeEnabled()
  })

  test('should perform search', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search for songs"]')
    const searchButton = page.locator('button:has-text("Search")')
    
    await searchInput.fill('Ed Sheeran')
    await searchButton.click()
    
    // Wait for search to complete
    await page.waitForTimeout(3000)
    
    // Check if loading state appeared or results/error appeared
    const isLoading = await page.locator('text=Searching').isVisible().catch(() => false)
    const hasResults = await page.locator('[class*="space-y-2"]').isVisible().catch(() => false)
    const hasError = await page.locator('text=Error').isVisible().catch(() => false)
    
    // At least one state should be present
    expect(isLoading || hasResults || hasError).toBeTruthy()
  })

  test('should handle Enter key for search', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search for songs"]')
    
    await searchInput.fill('test song')
    await searchInput.press('Enter')
    
    // Wait for search
    await page.waitForTimeout(2000)
    
    // Should trigger search
    const isLoading = await page.locator('text=Searching').isVisible().catch(() => false)
    expect(isLoading).toBeTruthy()
  })
})
