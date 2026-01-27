import { useEffect, useRef, useMemo, useCallback } from 'react'
import { useWallpaper } from '../contexts/WallpaperContext'
import { usePreRender } from '../contexts/PreRenderContext'

// Cache for particle configurations to avoid recalculation
const particleCache = new Map()

// Generate cached particle data
const generateParticles = (particleCount, particleColors, windowHeight) => {
  const cacheKey = `${particleCount}-${particleColors.join(',')}-${windowHeight}`
  
  if (particleCache.has(cacheKey)) {
    return particleCache.get(cacheKey)
  }

  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 10 + Math.random() * 10, // 10-20 seconds
    size: 4 + Math.random() * 5, // 4-9px
    color: particleColors[Math.floor(Math.random() * particleColors.length)],
    startY: -50,
    endY: windowHeight + 100,
  }))

  particleCache.set(cacheKey, particles)
  
  // Limit cache size to prevent memory issues
  if (particleCache.size > 10) {
    const firstKey = particleCache.keys().next().value
    particleCache.delete(firstKey)
  }

  return particles
}

export default function FallingParticles() {
  const { particleColors } = useWallpaper()
  const { isPreRendering, preRenderComplete } = usePreRender()
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const particlesRef = useRef([])
  const startTimeRef = useRef(null)
  const isVisibleRef = useRef(true)
  const intersectionObserverRef = useRef(null)
  const lastFrameTimeRef = useRef(0)
  const particleCount = 35

  // Memoize particles to avoid recalculation
  const particles = useMemo(() => {
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1000
    return generateParticles(particleCount, particleColors, windowHeight)
  }, [particleColors, particleCount])

  useEffect(() => {
    particlesRef.current = particles
  }, [particles])

  // Optimized particle drawing function
  const drawParticle = useCallback((ctx, particle, progress, canvasWidth, dpr) => {
    const y = particle.startY + (particle.endY - particle.startY) * progress
    
    // Opacity fade in/out
    let opacity = 0.6
    if (progress < 0.1) {
      opacity = 0.6 * (progress / 0.1)
    } else if (progress > 0.9) {
      opacity = 0.6 * ((1 - progress) / 0.1)
    }

    const x = (particle.x / 100) * (canvasWidth / dpr)

    // Draw particle with glow effect
    ctx.save()
    ctx.globalAlpha = opacity
    ctx.fillStyle = particle.color
    ctx.shadowBlur = particle.size * 3
    ctx.shadowColor = particle.color
    
    // Draw rotated square (diamond shape)
    ctx.translate(x, y)
    ctx.rotate(Math.PI / 4) // 45 degrees
    ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
    ctx.restore()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    // Apply scale transform once when context is created
    // Setting canvas.width/height resets the transform, so we need to reapply it
    const applyScaleTransform = () => {
      // Use setTransform to explicitly set the transform matrix (not cumulative)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const resizeCanvas = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      // Reapply scale transform after canvas dimensions are reset
      applyScaleTransform()
      
      // Update endY for all particles
      particlesRef.current.forEach(particle => {
        particle.endY = height + 100
      })
    }

    resizeCanvas()
    
    const resizeHandler = () => {
      resizeCanvas()
    }
    window.addEventListener('resize', resizeHandler, { passive: true })

    // Pre-render initial state
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

    let animationStartTime = null
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime) => {
      // Skip frames if not visible or during pre-rendering
      if (!isVisibleRef.current || (isPreRendering && !preRenderComplete)) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      // Throttle to target FPS
      const elapsed = currentTime - lastFrameTimeRef.current
      if (elapsed < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTimeRef.current = currentTime - (elapsed % frameInterval)

      if (!animationStartTime) {
        animationStartTime = currentTime
        startTimeRef.current = currentTime
      }

      const elapsedSeconds = (currentTime - animationStartTime) / 1000
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

      // Draw particles - batch operations for better performance
      const canvasWidth = canvas.width
      particlesRef.current.forEach((particle) => {
        const particleElapsed = elapsedSeconds - particle.delay
        
        if (particleElapsed < 0) return // Not started yet
        
        const cycleTime = particleElapsed % particle.duration
        const progress = cycleTime / particle.duration
        
        if (progress >= 1) {
          return
        }

        drawParticle(ctx, particle, progress, canvasWidth, dpr)
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Intersection Observer to pause when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        isVisibleRef.current = entry.isIntersecting && entry.intersectionRatio > 0
        
        if (isVisibleRef.current && preRenderComplete && !animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(animate)
        }
      },
      { threshold: [0, 0.01] }
    )
    
    observer.observe(canvas)
    intersectionObserverRef.current = observer

    // Start animation only after pre-render completes
    if (preRenderComplete) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    return () => {
      window.removeEventListener('resize', resizeHandler)
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isPreRendering, preRenderComplete, drawParticle])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{
        pointerEvents: 'none',
        willChange: 'contents',
        contain: 'layout style paint',
      }}
    />
  )
}
