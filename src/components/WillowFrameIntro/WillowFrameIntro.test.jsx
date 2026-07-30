import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import WillowFrameIntro from './WillowFrameIntro'

const manifest = {
  fps: 20,
  openEndFrame: 2,
  wishEndFrame: 4,
  frames: ['000.jpg', '001.jpg', '002.jpg', '003.jpg', '004.jpg'],
}

describe('WillowFrameIntro', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    )
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => manifest,
    })
    vi.stubGlobal(
      'Image',
      class {
        onload = null
        onerror = null
        set src(_v) {
          queueMicrotask(() => this.onload?.())
        }
      },
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('shows creepy COFFEE? while frames load, then open tooltip', async () => {
    render(<WillowFrameIntro onComplete={vi.fn()} />)
    expect(screen.getByTestId('willow-loading')).toHaveTextContent('COFFEE?')
    expect(await screen.findByTestId('willow-open')).toBeInTheDocument()
    expect(screen.queryByTestId('willow-loading')).not.toBeInTheDocument()
  })

  it('does not autoplay open; first click plays to openEndFrame then pauses', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const onComplete = vi.fn()
    render(<WillowFrameIntro onComplete={onComplete} />)

    const open = await screen.findByTestId('willow-open')
    expect(screen.queryByTestId('willow-wish')).not.toBeInTheDocument()
    await user.click(open)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })

    await waitFor(() => {
      expect(screen.getByTestId('willow-intro')).toHaveAttribute('data-phase', 'prompt-wish')
    })
    expect(screen.getByTestId('willow-frame')).toHaveAttribute('data-frame-index', '2')
    expect(onComplete).not.toHaveBeenCalled()
    expect(screen.getByTestId('willow-wish')).toBeInTheDocument()
  })

  it('second click plays to wishEnd and calls onComplete', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const onComplete = vi.fn()
    render(<WillowFrameIntro onComplete={onComplete} />)

    await user.click(await screen.findByTestId('willow-open'))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })
    await waitFor(() => screen.getByTestId('willow-wish'))
    await user.click(screen.getByTestId('willow-wish'))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledTimes(1)
    })
  })
})
