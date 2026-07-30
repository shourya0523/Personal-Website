import { useCallback, useEffect, useRef, useState } from 'react'
import './WillowFrameIntro.css'

const MANIFEST_URL = '/assets/coffee/willow-frames/manifest.json'
const FRAMES_BASE = '/assets/coffee/willow-frames/'
/** Playback boost over manifest fps. */
const FPS_BOOST = 1.45

/**
 * @typedef {'loading' | 'prompt-open' | 'opening' | 'prompt-wish' | 'breaking' | 'done'} IntroPhase
 */

/**
 * Load + keep Image elements alive so decoded bitmaps aren't GC'd mid-playback.
 * @param {string[]} urls
 * @returns {Promise<HTMLImageElement[]>}
 */
function loadFrameBitmaps(urls) {
  return Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve, reject) => {
          const img = new Image()
          img.decoding = 'async'
          img.onload = async () => {
            try {
              if (typeof img.decode === 'function') await img.decode()
            } catch {
              /* decode can reject on some stubs; bitmap still usable */
            }
            resolve(img)
          }
          img.onerror = () => reject(new Error(`Failed to load ${src}`))
          img.src = src
        }),
    ),
  )
}

/** Draw image cover-fit into canvas. */
function paintCover(ctx, img, cssW, cssH) {
  const iw = img.naturalWidth || img.width
  const ih = img.naturalHeight || img.height
  if (!iw || !ih) return
  const scale = Math.max(cssW / iw, cssH / ih)
  const dw = iw * scale
  const dh = ih * scale
  const dx = (cssW - dw) / 2
  const dy = (cssH - dh) / 2
  ctx.clearRect(0, 0, cssW, cssH)
  ctx.drawImage(img, dx, dy, dw, dh)
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

  const canvasRef = useRef(/** @type {HTMLCanvasElement | null} */ (null))
  const framesRef = useRef(/** @type {HTMLImageElement[]} */ ([]))
  const frameRef = useRef(0)
  const phaseRef = useRef(/** @type {IntroPhase} */ ('loading'))
  const rafRef = useRef(/** @type {number | null} */ (null))
  const playingRef = useRef(false)
  const completedRef = useRef(false)
  const reduceMotionRef = useRef(false)

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    reduceMotionRef.current = reduceMotion
  }, [reduceMotion])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return { w: 0, h: 0, ctx: null }
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.max(1, Math.floor(canvas.clientWidth))
    const h = Math.max(1, Math.floor(canvas.clientHeight))
    const bw = Math.floor(w * dpr)
    const bh = Math.floor(h * dpr)
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw
      canvas.height = bh
    }
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    return { w, h, ctx }
  }, [])

  const paintFrame = useCallback(
    (index) => {
      const frames = framesRef.current
      const img = frames[index]
      if (!img) return
      const { w, h, ctx } = syncCanvasSize()
      if (!ctx || !w || !h) return
      paintCover(ctx, img, w, h)
    },
    [syncCanvasSize],
  )

  const stopPlayback = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    playingRef.current = false
  }, [])

  useEffect(() => () => stopPlayback(), [stopPlayback])

  // Keep canvas sized + show current frame on resize / ready.
  useEffect(() => {
    if (!ready) return undefined
    const onResize = () => paintFrame(frameRef.current)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [ready, paintFrame])

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
        const images = await loadFrameBitmaps(urls)
        if (cancelled) return
        framesRef.current = images
        frameRef.current = 0
        setFrameIndex(0)
        setReady(true)
        setPhase('prompt-open')
        requestAnimationFrame(() => {
          setFadeIn(true)
          // paint after canvas mounts
          requestAnimationFrame(() => paintFrame(0))
        })
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load frames')
          setPhase('prompt-open')
        }
      })
    return () => {
      cancelled = true
      framesRef.current = []
    }
  }, [paintFrame])

  const finish = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    stopPlayback()
    setPhase('done')
    onComplete?.()
  }, [onComplete, stopPlayback])

  const playTo = useCallback(
    (endIndex, nextPhase) => {
      if (!manifest || playingRef.current) return
      stopPlayback()
      playingRef.current = true

      const end = Math.min(Math.max(0, endIndex), framesRef.current.length - 1 || endIndex)
      const baseFps = Math.max(1, Number(manifest.fps) || 12)
      const fps = reduceMotionRef.current ? baseFps : baseFps * FPS_BOOST
      const frameMs = 1000 / fps

      if (frameRef.current >= end) {
        frameRef.current = end
        setFrameIndex(end)
        paintFrame(end)
        playingRef.current = false
        setPhase(nextPhase)
        if (nextPhase === 'done') finish()
        return
      }

      let lastTick = performance.now()
      let acc = 0

      const tick = (now) => {
        if (!playingRef.current) return
        const dt = Math.min(64, now - lastTick)
        lastTick = now
        acc += dt

        let advanced = false
        while (acc >= frameMs && frameRef.current < end) {
          acc -= frameMs
          frameRef.current += 1
          advanced = true
        }

        if (advanced) {
          const idx = frameRef.current
          paintFrame(idx)
          // Avoid React re-render every frame — tests read the DOM attribute.
          canvasRef.current?.setAttribute('data-frame-index', String(idx))
        }

        if (frameRef.current >= end) {
          playingRef.current = false
          rafRef.current = null
          setFrameIndex(frameRef.current)
          setPhase(nextPhase)
          if (nextPhase === 'done') finish()
          return
        }

        rafRef.current = requestAnimationFrame(tick)
      }

      rafRef.current = requestAnimationFrame(tick)
    },
    [manifest, stopPlayback, paintFrame, finish],
  )

  const handleOpen = useCallback(
    (e) => {
      e?.stopPropagation?.()
      if (phaseRef.current !== 'prompt-open' || !manifest || !ready) return
      const end = Number(manifest.openEndFrame) || 0
      if (reduceMotionRef.current) {
        frameRef.current = end
        setFrameIndex(end)
        paintFrame(end)
        setPhase('prompt-wish')
        return
      }
      setPhase('opening')
      playTo(end, 'prompt-wish')
    },
    [manifest, ready, playTo, paintFrame],
  )

  const handleWish = useCallback(
    (e) => {
      e?.stopPropagation?.()
      if (phaseRef.current !== 'prompt-wish' || !manifest) return
      const end = Number(manifest.wishEndFrame) ?? framesRef.current.length - 1
      if (reduceMotionRef.current) {
        frameRef.current = end
        setFrameIndex(end)
        paintFrame(end)
        finish()
        return
      }
      // Flip phase first, then start on next frame so UI updates immediately.
      setPhase('breaking')
      playingRef.current = false
      requestAnimationFrame(() => playTo(end, 'done'))
    },
    [manifest, playTo, paintFrame, finish],
  )

  const handleSkip = useCallback(
    (e) => {
      e?.stopPropagation?.()
      stopPlayback()
      if (manifest) {
        const end = Number(manifest.wishEndFrame) ?? framesRef.current.length - 1
        frameRef.current = end
        setFrameIndex(end)
        paintFrame(end)
      }
      finish()
    },
    [manifest, stopPlayback, paintFrame, finish],
  )

  const handleStageClick = useCallback(
    (e) => {
      if (phaseRef.current === 'prompt-open') handleOpen(e)
      else if (phaseRef.current === 'prompt-wish') handleWish(e)
    },
    [handleOpen, handleWish],
  )

  if (phase === 'done') return null

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
            {error && framesRef.current.length === 0 ? (
              <span className="willow-intro__fallback" data-testid="willow-fallback">
                Willow frames unavailable — skip to enter
              </span>
            ) : (
              <canvas
                ref={canvasRef}
                className="willow-intro__frame"
                data-testid="willow-frame"
                data-frame-index={frameIndex}
              />
            )}
          </button>

          {tip && (
            <div className="willow-intro__tooltip">
              <button
                type="button"
                className="willow-intro__tooltip-btn"
                data-testid={phase === 'prompt-open' ? 'willow-open' : 'willow-wish'}
                onClick={phase === 'prompt-open' ? handleOpen : handleWish}
              >
                {tip}
              </button>
              <span className="willow-intro__tooltip-arrow" aria-hidden="true" />
            </div>
          )}

          {(phase === 'opening' || phase === 'breaking') && (
            <p
              className="willow-intro__status"
              data-testid={phase === 'opening' ? 'willow-opening' : 'willow-breaking'}
            >
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
