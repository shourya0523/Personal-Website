// Music app: Deezer search + Howler-backed 30s previews via MusicContext, plus a
// local favourite track so the player is never empty.
import { useMemo, useState } from 'react'
import { Split, SideGroup, SideItem, Section, Rows, Row, Button, Empty } from '../ui'
import { useMusic } from '../contexts/MusicContext'
import { useSounds } from '../contexts/SoundContext'
import './Music.css'

const FAVORITE_SONG = {
  id: 'favorite-freefall',
  title: "It's Called: Freefall",
  artist: 'Rainbow Kitten Surprise',
  album: 'How to: Friend, Love, Freefall',
  duration: 0,
  preview: '/music/favorite-song.mp3',
  cover: '/music/album-cover.png',
}

function IconPlay({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4.5v15l13-7.5z" fill="currentColor" />
    </svg>
  )
}
function IconPause({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
      <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
    </svg>
  )
}
function IconSkip({ size = 16, flip = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M5 5v14l10-7z" fill="currentColor" />
      <rect x="16" y="5" width="3" height="14" rx="1" fill="currentColor" />
    </svg>
  )
}

function formatTime(s) {
  if (!s || Number.isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

export default function Music({ windowId }) {
  const { currentSong, isPlaying, progress, duration, volume, playSong, togglePlayPause, setVolume, seekTo } = useMusic()
  const sounds = useSounds()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const queue = useMemo(() => [FAVORITE_SONG, ...results], [results])
  const displaySong = currentSong || FAVORITE_SONG
  const activeId = currentSong?.id ?? FAVORITE_SONG.id

  const handleSearch = async (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    sounds.click()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/deezer?q=${encodeURIComponent(q)}&limit=20`)
      if (!res.ok) throw new Error(`http-${res.status}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error.message || 'api-error')
      const tracks = Array.isArray(data.data) ? data.data : []
      const mapped = tracks
        .filter(t => t.preview)
        .map(t => ({
          id: `track-${t.id}`,
          title: t.title,
          artist: t.artist?.name || 'Unknown artist',
          album: t.album?.title || 'Unknown album',
          duration: t.duration,
          preview: t.preview,
          cover: t.album?.cover_medium || t.album?.cover || '',
        }))
      setResults(mapped)
      if (mapped.length === 0) setError('No previews found for that search. Try another term.')
    } catch {
      setError('Search is unavailable right now (the Deezer API could not be reached from here).')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = (song) => { sounds.click(); playSong(song) }

  const handleTogglePlayPause = () => {
    sounds.click()
    if (!currentSong) { playSong(FAVORITE_SONG); return }
    togglePlayPause()
  }

  const handleStep = (dir) => {
    sounds.click()
    const base = Math.max(0, queue.findIndex(s => s.id === activeId))
    const next = (base + dir + queue.length) % queue.length
    playSong(queue[next])
  }

  const handleSeek = (e) => { if (currentSong) seekTo(parseFloat(e.target.value)) }
  const handleVolume = (e) => setVolume(parseFloat(e.target.value))

  return (
    <Split side={
      <>
        <SideGroup>Library</SideGroup>
        <SideItem active={activeId === FAVORITE_SONG.id} icon="music" onClick={() => handlePlay(FAVORITE_SONG)}>
          Favourite
        </SideItem>
        {results.length > 0 && (
          <>
            <SideGroup>Search results</SideGroup>
            {results.map(song => (
              <SideItem key={song.id} active={activeId === song.id} onClick={() => handlePlay(song)}>
                {song.title}
              </SideItem>
            ))}
          </>
        )}
      </>
    }>
      <div className="music" data-window={windowId}>
        <header className="music__now">
          <img className="music__cover" src={displaySong.cover} alt={displaySong.album || displaySong.title} />
          <div className="music__meta">
            <div className="label">Now playing</div>
            <h2>{displaySong.title}</h2>
            <p className="muted">{displaySong.artist}</p>

            <div className="music__transport">
              <Button size="sm" onClick={() => handleStep(-1)} disabled={queue.length <= 1} aria-label="Previous track">
                <IconSkip flip />
              </Button>
              <Button variant="primary" onClick={handleTogglePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying && currentSong ? <IconPause /> : <IconPlay />}
              </Button>
              <Button size="sm" onClick={() => handleStep(1)} disabled={queue.length <= 1} aria-label="Next track">
                <IconSkip />
              </Button>
            </div>

            <div className="music__seek">
              <span className="music__time">{formatTime(progress)}</span>
              <input
                type="range"
                className="music__range"
                min={0}
                max={duration || 1}
                step={0.1}
                value={Math.min(progress, duration || 0)}
                onChange={handleSeek}
                disabled={!currentSong}
                aria-label="Seek"
              />
              <span className="music__time">{formatTime(duration)}</span>
            </div>

            <div className="music__volume">
              <span className="music__time">Vol</span>
              <input
                type="range"
                className="music__range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolume}
                aria-label="Volume"
              />
            </div>
          </div>
        </header>

        <Section title="Search">
          <form className="music__search" onSubmit={handleSearch}>
            <input
              className="input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search songs or artists…"
            />
            <Button type="submit" variant="primary" size="sm" disabled={loading || !query.trim()}>
              {loading ? 'Searching…' : 'Search'}
            </Button>
          </form>

          {error && <Empty>{error}</Empty>}
          {!error && loading && <Empty>Searching…</Empty>}
          {!error && !loading && results.length === 0 && (
            <Empty>Search Deezer for a song, or play the favourite track from the sidebar.</Empty>
          )}
          {!loading && results.length > 0 && (
            <Rows>
              {results.map(song => (
                <Row
                  key={song.id}
                  title={song.title}
                  sub={`${song.artist} — ${song.album}`}
                  meta={
                    <div className="music__row-meta">
                      <span className="music__time">{formatTime(song.duration)}</span>
                      <Button
                        size="sm"
                        onClick={() => handlePlay(song)}
                        aria-label={activeId === song.id && isPlaying ? 'Pause' : 'Play'}
                      >
                        {activeId === song.id && isPlaying ? <IconPause size={12} /> : <IconPlay size={12} />}
                      </Button>
                    </div>
                  }
                />
              ))}
            </Rows>
          )}
        </Section>
      </div>
    </Split>
  )
}
