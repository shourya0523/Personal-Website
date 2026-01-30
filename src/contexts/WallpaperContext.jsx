import { createContext, useContext, useState, useEffect } from 'react'
import { safeLocalStorage } from '../utils/storage'

const WallpaperContext = createContext()

export const useWallpaper = () => {
  const context = useContext(WallpaperContext)
  if (!context) {
    throw new Error('useWallpaper must be used within WallpaperProvider')
  }
  return context
}

// Default particle colors (gold and green theme)
const defaultParticleColors = [
  '#fbbf24', // amber-400 (gold)
  '#f59e0b', // amber-500 (darker gold)
  '#eab308', // yellow-500 (bright gold)
  '#10b981', // emerald-500 (green)
  '#059669', // emerald-600 (darker green)
  '#34d399', // emerald-400 (lighter green)
  '#22c55e', // green-500 (bright green)
  '#16a34a', // green-600 (deep green)
  '#84cc16', // lime-500 (yellow-green)
  '#65a30d', // lime-600 (darker yellow-green)
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

  useEffect(() => {
    safeLocalStorage.setItem('wallpaperUrl', wallpaperUrl)
  }, [wallpaperUrl])

  useEffect(() => {
    safeLocalStorage.setItem('particleColors', JSON.stringify(particleColors))
  }, [particleColors])



  const updateWallpaper = (url, colors) => {
    setWallpaperUrl(url)
    if (colors && colors.length > 0) {
      setParticleColors(colors)
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
