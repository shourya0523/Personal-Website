import { useCallback, useEffect, useRef, useState } from 'react'
import './WillowFrameIntro.css'

const MANIFEST_URL = '/assets/coffee/willow-frames/manifest.json'
const FRAMES_BASE = '/assets/coffee/willow-frames/'

/**
 * @typedef {'prompt-open' | 'opening' | 'prompt-wish' | 'breaking' | 'done'} IntroPhase
 */

function preloadImages(urls) {
  return Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image()
          img.onload = () => resolve(true)
          img.onerror = () => resolve(false)
          img.src = src
        }),
    ),
  )
}

/**
 * One Wish Willow frame-sequence ritual.
 * Click open → play to openEndFrame → click wish → play to wishEndFrame → onComplete.
 */
export default function WillowFrameIntro({ onComplete }) {
  const [phase, setPhase] = useState(/** @type {IntroPhase} */ ('prompt-open'))
  const [frameIndex, setFrameIndex] = useState(0)
  const [manifest, setManifest] = useState(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  const timerRef = useRef(null)
  const completedRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch(MANIFEST_URL)
      .then((r) => {
        if (!r.ok) throw new Error('manifest missing')
        return r.json()
      })
      .then(async (data) => {
        if (cancelled) return
        if (!Array.isArray(data.frames) || data.frames.length === 0) {
          throw new Error('manifest has no frames')
        }
        setManifest(data)
        const urls = data.frames.map((name) => `${FRAMES_BASE}${name}`)
        // Prioritize frames through the open gate, then the rest.
        const openEnd = Math.min(Number(data.openEndFrame) || 0, urls.length - 1)
        await preloadImages(urls.slice(0, openEnd + 1))
        if (cancelled) return
        setReady(true)
        // warm the rest in background
        preloadImages(urls.slice(openEnd + 1))
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load frames')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const finish = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    setPhase('done')
    onComplete?.()
  }, [onComplete])

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => () => clearTimer(), [])

  const playTo = useCallback(
    (endIndex, nextPhase) => {
      if (!manifest) return
      clearTimer()
      const fps = Math.max(1, Number(manifest.fps) || 12)
      const ms = 1000 / fps
      timerRef.current = window.setInterval(() => {
        setFrameIndex((prev) => {
          if (prev >= endIndex) {
            return endIndex
          }
          const next = prev + 1
          if (next >= endIndex) {
            window.setTimeout(() => {
              clearTimer()
              setPhase(nextPhase)
              if (nextPhase === 'done') finish()
            }, 0)
            return endIndex
          }
          return next
        })
      }, ms)
    },
    [manifest, finish],
  )

  const handleOpen = () => {
    if (phase !== 'prompt-open' || !manifest || !ready) return
    const end = Number(manifest.openEndFrame) || 0
    if (reduceMotion) {
      setFrameIndex(end)
      setPhase('prompt-wish')
      return
    }
    setPhase('opening')
    playTo(end, 'prompt-wish')
  }

  const handleWish = () => {
    if (phase !== 'prompt-wish' || !manifest) return
    const end = Number(manifest.wishEndFrame) ?? manifest.frames.length - 1
    if (reduceMotion) {
      setFrameIndex(end)
      finish()
      return
    }
    setPhase('breaking')
    playTo(end, 'done')
  }

  const handleSkip = () => {
    clearTimer()
    if (manifest) {
      setFrameIndex(Number(manifest.wishEndFrame) ?? manifest.frames.length - 1)
    }
    finish()
  }

  if (phase === 'done') return null

  const frameSrc =
    manifest && manifest.frames[frameIndex]
      ? `${FRAMES_BASE}${manifest.frames[frameIndex]}`
      : null

  return (
    <div className="willow-intro" data-testid="willow-intro" data-phase={phase}>
      <div className="willow-intro__stage">
        {frameSrc ? (
          <img
            className="willow-intro__frame"
            src={frameSrc}
            alt=""
            data-testid="willow-frame"
            data-frame-index={frameIndex}
          />
        ) : (
          <div className="willow-intro__fallback" data-testid="willow-fallback">
            {error ? 'Willow frames unavailable — skip to enter' : 'Loading the willow…'}
          </div>
        )}
      </div>

      <div className="willow-intro__hud">
        {phase === 'prompt-open' && (
          <button
            type="button"
            className="willow-intro__cta"
            data-testid="willow-open"
            onClick={handleOpen}
            disabled={(!ready || !manifest) && !error}
          >
            {ready || error ? 'Click to open the box' : 'Loading the willow…'}
          </button>
        )}
        {phase === 'opening' && (
          <p className="willow-intro__status" data-testid="willow-opening">
            Opening…
          </p>
        )}
        {phase === 'prompt-wish' && (
          <button
            type="button"
            className="willow-intro__cta willow-intro__cta--wish"
            data-testid="willow-wish"
            onClick={handleWish}
          >
            Click to make a wish
          </button>
        )}
        {phase === 'breaking' && (
          <p className="willow-intro__status" data-testid="willow-breaking">
            Careful what you wish for…
          </p>
        )}
        {(error || reduceMotion || ready) && phase !== 'done' && (
          <button
            type="button"
            className="willow-intro__skip"
            data-testid="willow-skip"
            onClick={handleSkip}
          >
            Skip ritual
          </button>
        )}
      </div>
    </div>
  )
}
