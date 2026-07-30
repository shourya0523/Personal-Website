import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
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
  const a = ({ children, whileHover, whileTap, initial, animate, transition, exit, ...props }) => (
    <a {...props}>{children}</a>
  )
  return {
    motion: { div: passthrough, p, h1, aside, a },
    AnimatePresence: ({ children }) => children,
  }
})

vi.mock('../components/BloodFluidBackground/BloodFluidBackground', () => ({
  default: () => <div data-testid="blood-fluid" />,
}))

vi.mock('../components/WillowScene', () => ({
  default: () => <div data-testid="willow-scene" />,
}))

describe('CoffeeChat', () => {
  it('renders meme hero with strikethrough date gag', () => {
    render(<CoffeeChat />)
    expect(screen.getByTestId('coffee-chat')).toBeInTheDocument()
    expect(screen.getByText(/No no no no no/i)).toBeInTheDocument()
    const strike = document.querySelector('.coffee-chat__strike')
    expect(strike).toBeTruthy()
    expect(strike.textContent.toLowerCase()).toContain('date')
  })

  it('links the calendar CTA to the Notion meet URL', () => {
    render(<CoffeeChat />)
    const cta = screen.getByTestId('coffee-calendar-card')
    expect(cta).toHaveAttribute('href', NOTION_COFFEE_URL)
    expect(cta).toHaveAttribute('target', '_blank')
    expect(cta).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('does not render OS login chrome', () => {
    render(<CoffeeChat />)
    expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument()
  })
})
