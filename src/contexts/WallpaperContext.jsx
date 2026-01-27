import { createContext, useContext, useState, useEffect } from 'react'

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
  const [wallpaperUrl, setWallpaperUrl] = useState(() => {
    return localStorage.getItem('wallpaperUrl') || '/desktop-background.jpg'
  })
  const [particleColors, setParticleColors] = useState(() => {
    const saved = localStorage.getItem('particleColors')
    return saved ? JSON.parse(saved) : defaultParticleColors
  })

  useEffect(() => {
    localStorage.setItem('wallpaperUrl', wallpaperUrl)
  }, [wallpaperUrl])

  useEffect(() => {
    localStorage.setItem('particleColors', JSON.stringify(particleColors))
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
