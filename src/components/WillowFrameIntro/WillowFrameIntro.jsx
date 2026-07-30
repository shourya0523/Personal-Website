import { useCallback, useEffect, useRef, useState } from 'react'
import './WillowFrameIntro.css'

const MANIFEST_URL = '/assets/coffee/willow-frames/manifest.json'
const FRAMES_BASE = '/assets/coffee/willow-frames/'
/** Playback boost over manifest fps (user: speed it up a little). */
const FPS_BOOST = 1.35

/**
 * @typedef {'loading' | 'prompt-open' | 'opening' | 'prompt-wish' | 'breaking' | 'done'} IntroPhase
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
  const [phase, setPhase] = useState(/** @type {IntroPhase} */ ('loading'))
  const [frameIndex, setFrameIndex] = useState(0)
  const [manifest, setManifest] = useState(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)

  const timerRef = useRef(null)
  const completedRef = useRef(false)
  const frameRef = useRef(0)
  const playingRef = useRef(false)
  const phaseRef = useRef(/** @type {IntroPhase} */ ('loading'))

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

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
        // Preload everything so the break sequence never stalls on cold frames.
        await preloadImages(urls)
        if (cancelled) return
        setReady(true)
        setPhase('prompt-open')
        // kick crimson wash after paint
        requestAnimationFrame(() => setFadeIn(true))
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load frames')
          setPhase('prompt-open')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const finish = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    playingRef.current = false
    setPhase('done')
    onComplete?.()
  }, [onComplete])

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    playingRef.current = false
  }, [])

  useEffect(() => () => clearTimer(), [clearTimer])

  const playTo = useCallback(
    (endIndex, nextPhase) => {
      if (!manifest || playingRef.current) return
      clearTimer()
      playingRef.current = true

      const baseFps = Math.max(1, Number(manifest.fps) || 12)
      const fps = reduceMotion ? baseFps : baseFps * FPS_BOOST
      const ms = 1000 / fps
      const end = Math.min(Math.max(0, endIndex), manifest.frames.length - 1)

      // Already at/past end — jump phase immediately.
      if (frameRef.current >= end) {
        frameRef.current = end
        setFrameIndex(end)
        playingRef.current = false
        setPhase(nextPhase)
        if (nextPhase === 'done') finish()
        return
      }

      timerRef.current = window.setInterval(() => {
        const prev = frameRef.current
        if (prev >= end) {
          clearTimer()
          setPhase(nextPhase)
          if (nextPhase === 'done') finish()
          return
        }
        const next = prev + 1
        frameRef.current = next
        setFrameIndex(next)
        if (next >= end) {
          clearTimer()
          setPhase(nextPhase)
          if (nextPhase === 'done') finish()
        }
      }, ms)
    },
    [manifest, clearTimer, finish, reduceMotion],
  )

  const handleOpen = () => {
    if (phaseRef.current !== 'prompt-open' || !manifest || !ready) return
    const end = Number(manifest.openEndFrame) || 0
    if (reduceMotion) {
      frameRef.current = end
      setFrameIndex(end)
      setPhase('prompt-wish')
      return
    }
    setPhase('opening')
    playTo(end, 'prompt-wish')
  }

  const handleWish = () => {
    if (phaseRef.current !== 'prompt-wish' || !manifest) return
    const end = Number(manifest.wishEndFrame) ?? manifest.frames.length - 1
    if (reduceMotion) {
      frameRef.current = end
      setFrameIndex(end)
      finish()
      return
    }
    setPhase('breaking')
    // Defer so phase='breaking' commits before interval starts (avoids stale guards).
    window.setTimeout(() => playTo(end, 'done'), 0)
  }

  const handleSkip = () => {
    clearTimer()
    if (manifest) {
      const end = Number(manifest.wishEndFrame) ?? manifest.frames.length - 1
      frameRef.current = end
      setFrameIndex(end)
    }
    finish()
  }

  const handleStageClick = () => {
    if (phase === 'prompt-open') handleOpen()
    else if (phase === 'prompt-wish') handleWish()
  }

  if (phase === 'done') return null

  const frameSrc =
    ready && manifest && manifest.frames[frameIndex]
      ? `${FRAMES_BASE}${manifest.frames[frameIndex]}`
      : null

  const showLoading = phase === 'loading' || (!ready && !error)
  const tip =
    phase === 'prompt-open'
      ? 'Click to open the box'
      : phase === 'prompt-wish'
        ? 'Click to make a wish'
        : null

  return (
    <div
      className={`willow-intro${fadeIn ? ' willow-intro--lit' : ''}${showLoading ? ' willow-intro--loading' : ''}`}
      data-testid="willow-intro"
      data-phase={phase}
    >
      <div className="willow-intro__wash" aria-hidden="true" />

      {showLoading ? (
        <p className="willow-intro__coffee" data-testid="willow-loading">
          COFFEE?
        </p>
      ) : (
        <>
          <button
            type="button"
            className="willow-intro__stage"
            data-testid="willow-stage"
            onClick={handleStageClick}
            aria-label={tip || 'Willow ritual'}
          >
            {frameSrc ? (
              <img
                className="willow-intro__frame"
                src={frameSrc}
                alt=""
                draggable={false}
                data-testid="willow-frame"
                data-frame-index={frameIndex}
              />
            ) : (
              <span className="willow-intro__fallback" data-testid="willow-fallback">
                {error ? 'Willow frames unavailable — skip to enter' : '…'}
              </span>
            )}
          </button>

          {tip && (
            <div className="willow-intro__tooltip" onClick={handleStageClick}>
              <button
                type="button"
                className="willow-intro__tooltip-btn"
                data-testid={phase === 'prompt-open' ? 'willow-open' : 'willow-wish'}
                onClick={handleStageClick}
              >
                {tip}
              </button>
              <span className="willow-intro__tooltip-arrow" aria-hidden="true" />
            </div>
          )}

          {(phase === 'opening' || phase === 'breaking') && (
            <p className="willow-intro__status" data-testid={phase === 'opening' ? 'willow-opening' : 'willow-breaking'}>
              {phase === 'opening' ? 'Opening…' : 'Careful what you wish for…'}
            </p>
          )}
        </>
      )}

      {(error || reduceMotion || ready) && phase !== 'done' && phase !== 'loading' && (
        <button type="button" className="willow-intro__skip" data-testid="willow-skip" onClick={handleSkip}>
          Skip ritual
        </button>
      )}
    </div>
  )
}
