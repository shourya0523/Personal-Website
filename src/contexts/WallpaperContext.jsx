import { createContext, useContext, useState, useEffect } from 'react'
import { safeLocalStorage } from '../utils/storage'
import { extractColorsFromImage } from '../utils/colorExtractor'

const WallpaperContext = createContext()

export const useWallpaper = () => {
  const context = useContext(WallpaperContext)
  if (!context) {
    throw new Error('useWallpaper must be used within WallpaperProvider')
  }
  return context
}

// Default particle colors (water theme - matches default wallpaper)
const defaultParticleColors = [
  '#0891b2', // cyan-600 (deep ocean)
  '#06b6d4', // cyan-500 (bright cyan)
  '#22d3ee', // cyan-400 (light cyan)
  '#0ea5e9', // sky-500 (sky blue)
  '#38bdf8', // sky-400 (light sky)
  '#0284c7', // sky-600 (deep sky)
  '#14b8a6', // teal-500 (teal)
  '#2dd4bf', // teal-400 (light teal)
  '#0d9488', // teal-600 (deep teal)
  '#67e8f9', // cyan-300 (pale cyan)
]

export const WallpaperProvider = ({ children }) => {
  const defaultWallpaper = 'https://images.unsplash.com/photo-1498898733745-c8c6df58e4ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NjM1NDR8MHwxfHNlYXJjaHwxNXx8d2F0ZXJ8ZW58MHwwfHx8MTc2OTcxMDc0NXww&ixlib=rb-4.1.0&q=80&w=1080'

  const [wallpaperUrl, setWallpaperUrl] = useState(() => {
    return safeLocalStorage.getItem('wallpaperUrl', defaultWallpaper)
  })

  const [particleColors, setParticleColors] = useState(() => {
    const saved = safeLocalStorage.getItem('particleColors')
    return saved ? JSON.parse(saved) : defaultParticleColors
  })

  const [colorsInitialized, setColorsInitialized] = useState(false)

  useEffect(() => {
    safeLocalStorage.setItem('wallpaperUrl', wallpaperUrl)
  }, [wallpaperUrl])

  useEffect(() => {
    safeLocalStorage.setItem('particleColors', JSON.stringify(particleColors))
  }, [particleColors])

  // Extract colors from default wallpaper on first load
  useEffect(() => {
    const extractDefaultColors = async () => {
      // Check if colors have been initialized
      const colorsExtracted = safeLocalStorage.getItem('defaultColorsExtracted')
      const isDefaultWallpaper = wallpaperUrl === defaultWallpaper

      // Only extract if using default wallpaper and haven't extracted before
      if (isDefaultWallpaper && !colorsExtracted && !colorsInitialized) {
        try {
          const extractedColors = await extractColorsFromImage(wallpaperUrl, 10)
          setParticleColors(extractedColors)
          safeLocalStorage.setItem('defaultColorsExtracted', 'true')
          setColorsInitialized(true)
        } catch (error) {
          console.warn('Failed to extract colors from default wallpaper:', error)
          // Fall back to hardcoded water-themed colors
          setColorsInitialized(true)
        }
      }
    }

    extractDefaultColors()
  }, [wallpaperUrl, colorsInitialized])

  const updateWallpaper = (url, colors) => {
    setWallpaperUrl(url)
    if (colors && colors.length > 0) {
      setParticleColors(colors)
      // Reset the flag since user is setting custom colors
      if (url !== defaultWallpaper) {
        safeLocalStorage.setItem('defaultColorsExtracted', 'false')
      }
    } else {
      setParticleColors(defaultParticleColors)
    }
  }

  return (
    <WallpaperContext.Provider value={{
      wallpaperUrl,
      particleColors,
      updateWallpaper,
    }}>
      {children}
    </WallpaperContext.Provider>
  )
}
