import { createContext, useContext, useState, useEffect, useRef } from 'react'

const PreRenderContext = createContext()

export const usePreRender = () => {
  const context = useContext(PreRenderContext)
  if (!context) {
    throw new Error('usePreRender must be used within PreRenderProvider')
  }
  return context
}

// Global cache for pre-rendered particle data
const particlePreRenderCache = new Map()

export const PreRenderProvider = ({ children }) => {
  const [isPreRendering, setIsPreRendering] = useState(true)
  const [preRenderComplete, setPreRenderComplete] = useState(false)
  const preRenderCanvasRef = useRef(null)
  const preRenderCtxRef = useRef(null)

  useEffect(() => {
    // Pre-render phase: initialize and cache resources
    const preRender = async () => {
      // Create offscreen canvas for particle pre-rendering
      const canvas = document.createElement('canvas')
      const dpr = window.devicePixelRatio || 1
      const width = window.innerWidth
      const height = window.innerHeight
      
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      
      const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false })
      if (ctx) {
        ctx.scale(dpr, dpr)
        preRenderCtxRef.current = ctx
      }
      
      preRenderCanvasRef.current = canvas

      // Pre-warm WebGL and canvas contexts
      // This helps initialize GPU resources early
      requestAnimationFrame(() => {
        // Pre-render a few frames to warm up
        let framesRendered = 0
        const warmUpFrames = 3
        
        const warmUp = () => {
          if (framesRendered < warmUpFrames) {
            framesRendered++
            requestAnimationFrame(warmUp)
          } else {
            // Mark pre-rendering as complete after warm-up
            setTimeout(() => {
              setIsPreRendering(false)
              setPreRenderComplete(true)
            }, 50)
          }
        }
        
        warmUp()
      })
    }

    preRender()
  }, [])

  return (
    <PreRenderContext.Provider value={{
      isPreRendering,
      preRenderComplete,
      preRenderCanvas: preRenderCanvasRef.current,
      preRenderCtx: preRenderCtxRef.current,
      particleCache: particlePreRenderCache,
    }}>
      {children}
    </PreRenderContext.Provider>
  )
}
