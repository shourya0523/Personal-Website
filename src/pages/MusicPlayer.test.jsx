import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MusicPlayer from './MusicPlayer'

// Mock Howler
vi.mock('howler', () => ({
  Howl: vi.fn(() => ({
    play: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
    unload: vi.fn(),
    seek: vi.fn(() => 0),
    duration: vi.fn(() => 30),
    volume: vi.fn(),
    on: vi.fn(),
  })),
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

describe('MusicPlayer', () => {
  beforeEach(() => {
    // Mock fetch globally
    global.fetch = vi.fn()
  })

  it('renders the music player component', () => {
    render(<MusicPlayer />)
    expect(screen.getByText('Music Player')).toBeInTheDocument()
  })

  it('displays search input', () => {
    render(<MusicPlayer />)
    const searchInput = screen.getByPlaceholderText('Search for songs, artists...')
    expect(searchInput).toBeInTheDocument()
  })

  it('displays search button', () => {
    render(<MusicPlayer />)
    const searchButton = screen.getByRole('button', { name: /search/i })
    expect(searchButton).toBeInTheDocument()
  })

  it('shows initial empty state', () => {
    render(<MusicPlayer />)
    expect(screen.getByText('Search for songs to get started')).toBeInTheDocument()
  })

  it('handles search functionality', async () => {
    const user = userEvent.setup()
    const mockSongs = {
      data: [
        {
          id: 1,
          title: 'Test Song',
          artist: { name: 'Test Artist' },
          album: { title: 'Test Album', cover_medium: 'test.jpg' },
          duration: 180,
          preview: 'https://test.com/preview.mp3',
        },
      ],
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSongs,
    })

    render(<MusicPlayer />)
    const searchInput = screen.getByPlaceholderText('Search for songs, artists...')
    const searchButton = screen.getByRole('button', { name: /search/i })

    // Simulate user typing and clicking
    await user.type(searchInput, 'test')
    await user.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText('Test Song')).toBeInTheDocument()
    }, { timeout: 3000 })
  })
})
