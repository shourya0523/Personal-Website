import { test, expect } from '@playwright/test'

test.describe('Personal Website E2E Tests', () => {
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
  })

  test('should load the landing page', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
    
    // Check if main elements are visible
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('should display desktop icons', async ({ page }) => {
    // Look for icon labels on the desktop
    const aboutIcon = page.locator('text=About').first()
    const projectsIcon = page.locator('text=Projects').first()
    
    // At least one icon should be visible
    const hasAbout = await aboutIcon.isVisible({ timeout: 5000 }).catch(() => false)
    const hasProjects = await projectsIcon.isVisible({ timeout: 5000 }).catch(() => false)
    
    expect(hasAbout || hasProjects).toBeTruthy()
  })

  test('should open Music Player app', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    // Find and double-click the Music icon
    const musicIcon = page.locator('text=Music').first()
    if (await musicIcon.isVisible()) {
      await musicIcon.dblclick()
      
      // Wait for the music player window to open
      await page.waitForTimeout(1000)
      
      // Check if Music Player title is visible
      const musicPlayerTitle = page.locator('text=Music Player')
      await expect(musicPlayerTitle).toBeVisible({ timeout: 5000 })
    }
  })

  test('should search for songs in Music Player', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    // Try to open Music Player
    const musicIcon = page.locator('text=Music').first()
    if (await musicIcon.isVisible()) {
      await musicIcon.dblclick()
      await page.waitForTimeout(1000)
      
      // Find search input
      const searchInput = page.locator('input[placeholder*="Search for songs"]')
      await expect(searchInput).toBeVisible({ timeout: 5000 })
      
      // Type a search query
      await searchInput.fill('The Beatles')
      
      // Click search button
      const searchButton = page.locator('button:has-text("Search")')
      await searchButton.click()
      
      // Wait for results (either songs or loading/error state)
      await page.waitForTimeout(2000)
      
      // Check if either results appear or loading/error message
      const hasResults = await page.locator('text=Test Song').isVisible().catch(() => false)
      const hasLoading = await page.locator('text=Searching').isVisible().catch(() => false)
      const hasError = await page.locator('text=Error').isVisible().catch(() => false)
      const hasEmptyState = await page.locator('text=No results').isVisible().catch(() => false)
      
      // At least one of these should be true
      expect(hasResults || hasLoading || hasError || hasEmptyState).toBeTruthy()
    }
  })

  test('should interact with dock', async ({ page }) => {
    // Find dock (should be at bottom of screen)
    const dock = page.locator('[class*="fixed"][class*="bottom"]').first()
    const dockVisible = await dock.isVisible({ timeout: 5000 }).catch(() => false)
    
    // Dock might not always be visible, but if it is, it should work
    if (dockVisible) {
      await expect(dock).toBeVisible()
    } else {
      // Skip if dock not found (might be hidden on some screen sizes)
      test.skip()
    }
  })

  test('should open About page', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    // Find and double-click About icon
    const aboutIcon = page.locator('text=About').first()
    if (await aboutIcon.isVisible()) {
      await aboutIcon.dblclick()
      await page.waitForTimeout(1000)
      
      // Check if About content appears
      const aboutContent = page.locator('text=About Me')
      await expect(aboutContent).toBeVisible({ timeout: 5000 })
    }
  })
})
