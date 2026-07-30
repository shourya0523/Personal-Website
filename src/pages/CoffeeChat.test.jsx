import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import CoffeeChat from './CoffeeChat'
import { NOTION_COFFEE_URL } from '../components/CoffeeCalendarCard'

vi.mock('framer-motion', () => {
  const passthrough = ({ children, whileHover, whileTap, initial, animate, transition, exit, ...props }) => (
    <div {...props}>{children}</div>
  )
  const p = ({ children, whileHover, whileTap, initial, animate, transition, exit, ...props }) => (
    <p {...props}>{children}</p>
  )
  const h1 = ({ children, whileHover, whileTap, initial, animate, transition, exit, ...props }) => (
    <h1 {...props}>{children}</h1>
  )
  const aside = ({ children, whileHover, whileTap, initial, animate, transition, exit, ...props }) => (
    <aside {...props}>{children}</aside>
  )
  const figure = ({ children, whileHover, whileTap, initial, animate, transition, exit, ...props }) => (
    <figure {...props}>{children}</figure>
  )
  const a = ({ children, whileHover, whileTap, initial, animate, transition, exit, ...props }) => (
    <a {...props}>{children}</a>
  )
  return {
    motion: { div: passthrough, p, h1, aside, figure, a },
    AnimatePresence: ({ children }) => children,
  }
})

vi.mock('../components/BloodFluidBackground/BloodFluidBackground', () => ({
  default: () => <div data-testid="blood-fluid" />,
}))

vi.mock('../components/WillowFrameIntro/WillowFrameIntro', () => ({
  default: ({ onComplete }) => (
    <div data-testid="willow-intro">
      <button type="button" data-testid="mock-complete-intro" onClick={() => onComplete?.()}>
        complete intro
      </button>
    </div>
  ),
}))

describe('CoffeeChat', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('gates the site behind the willow intro', () => {
    render(<CoffeeChat />)
    expect(screen.getByTestId('willow-intro')).toBeInTheDocument()
    expect(screen.queryByTestId('coffee-calendar-card')).not.toBeInTheDocument()
    expect(screen.getByTestId('coffee-chat')).toHaveAttribute('data-revealed', 'false')
  })

  it('reveals meme hero and Notion CTA after intro completes', async () => {
    const user = userEvent.setup()
    render(<CoffeeChat />)
    await user.click(screen.getByTestId('mock-complete-intro'))
    expect(screen.getByTestId('coffee-chat')).toHaveAttribute('data-revealed', 'true')
    expect(screen.getByText(/No no no no no/i)).toBeInTheDocument()
    const strike = document.querySelector('.coffee-chat__strike')
    expect(strike?.textContent.toLowerCase()).toContain('date')
    const cta = screen.getByTestId('coffee-calendar-cta')
    expect(cta).toHaveAttribute('href', NOTION_COFFEE_URL)
    expect(cta).toHaveAttribute('target', '_blank')
    expect(cta).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(screen.getByTestId('coffee-day-picker')).toBeInTheDocument()
  })

  it('does not render OS login chrome', () => {
    render(<CoffeeChat />)
    expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument()
  })
})
