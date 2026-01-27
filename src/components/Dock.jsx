import { useState, useMemo, memo } from 'react'
import { useSounds } from '../contexts/SoundContext'
import { useWallpaper } from '../contexts/WallpaperContext'
import GlassSurface from './GlassSurface'
import './Dock.css'

const Dock = memo(function Dock({ items, panelHeight = 68, baseItemSize = 64, magnification = 20 }) {
  const sounds = useSounds()
  const { particleColors } = useWallpaper()
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const getItemSize = (index) => {
    if (hoveredIndex === index) {
      return baseItemSize + magnification
    }
    return baseItemSize
  }

  const getColorForIndex = useMemo(() => {
    return (index) => particleColors[index % particleColors.length]
  }, [particleColors])

  return (
    <div className="dock-outer" data-animated>
      <GlassSurface
        borderRadius={16}
        opacity={0.85}
        brightness={115}
        displace={0.2}
        distortionScale={-100}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
        className="dock-panel"
        style={{ 
          height: `${panelHeight}px`,
          minHeight: `${panelHeight}px`,
          willChange: 'transform'
        }}
      >
        {items.map((item, index) => {
          const accentColor = getColorForIndex(index)
          return (
            <button
              key={index}
              className="dock-item"
              onClick={() => {
                sounds.open()
                if (item.onClick) item.onClick()
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                width: `${getItemSize(index)}px`,
                height: `${getItemSize(index)}px`,
                minWidth: `${getItemSize(index)}px`,
                '--accent-color': accentColor,
                willChange: 'transform',
                transform: 'translateZ(0)'
              }}
              title={item.label}
            >
              <div className="dock-icon">
                {item.icon}
              </div>
              <span className="dock-label">{item.label}</span>
            </button>
          )
        })}
      </GlassSurface>
    </div>
  )
})

export default Dock
