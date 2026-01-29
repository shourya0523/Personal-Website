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
]

export const WallpaperProvider = ({ children }) => {
  const defaultWallpaper = 'https://images.unsplash.com/photo-1498898733745-c8c6df58e4ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NjM1NDR8MHwxfHNlYXJjaHwxNXx8d2F0ZXJ8ZW58MHwwfHx8MTc2OTcxMDc0NXww&ixlib=rb-4.1.0&q=80&w=1080'
  
  const [wallpaperUrl, setWallpaperUrl] = useState(() => {
    return localStorage.getItem('wallpaperUrl') || defaultWallpaper
  })

  useEffect(() => {
    localStorage.setItem('particleColors', JSON.stringify(particleColors))
  }, [particleColors])

  const [particleColors, setParticleColors] = useState(() => {
    const saved = localStorage.getItem('particleColors')
    return saved
  })

  useEffect(() => {
    localStorage.setItem('wallpaperUrl', wallpaperUrl)
  }, [wallpaperUrl])



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
