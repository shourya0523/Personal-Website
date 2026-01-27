import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Play, Pause, Sparkles } from 'lucide-react'
import { useSounds } from '../contexts/SoundContext'
import { useUser } from '../contexts/UserContext'
import { useMusic } from '../contexts/MusicContext'

export default function MenuBar({ windows, onWindowClick, apps = [] }) {
  const sounds = useSounds()
  const { userName } = useUser()
  const { currentSong, isPlaying, togglePlayPause } = useMusic()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 h-8 z-[100]"
    >
      <div className="w-full h-full bg-black/60 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div className="flex items-center justify-between px-4 h-full text-xs text-white/95 font-medium">
          {/* App Name */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm">Shourya Yadav</span>
          </div>

          {/* Menu Items */}
          <div className="flex items-center gap-4 flex-1 justify-center">
            {/* Minimized Windows - Show as icons */}
            {windows.filter(w => w.minimized).length > 0 && (
              <div className="flex items-center gap-2 px-2">
                {windows.filter(w => w.minimized).map((window) => {
                  const app = apps.find(a => a.type === window.type)
                  return (
                    <button
                      key={window.id}
                      onClick={() => {
                        sounds.open()
                        onWindowClick(window.id)
                      }}
                      className="p-1.5 rounded hover:bg-white/20 transition-colors group relative"
                      title={window.title}
                    >
                      <div className="w-5 h-5 flex items-center justify-center text-white/90">
                        {app?.iconElement ? (
                          <div className="w-4 h-4 flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4">
                            {app.iconElement}
                          </div>
                        ) : (
                          <span className="text-xs">{app?.icon || '📄'}</span>
                        )}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                        {window.title}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Media Controls - Show when music is playing */}
            {currentSong && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-md">
                <button
                  onClick={() => {
                    sounds.click()
                    togglePlayPause()
                  }}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 ml-0.5" />
                  )}
                </button>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-medium truncate max-w-[200px]">
                    {currentSong.title}
                  </span>
                  <span className="text-[10px] text-white/60 truncate max-w-[200px]">
                    {currentSong.artist}
                  </span>
                </div>
              </div>
            )}
            
            {/* Window Menu Items - Active window */}
            {windows.length > 0 && (() => {
              const maxZIndex = Math.max(...windows.map(w => w.zIndex))
              return windows.filter(w => !w.minimized && w.zIndex === maxZIndex).map((window) => (
                <div key={window.id} className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      sounds.click()
                      onWindowClick(window.id)
                    }}
                    className="px-2 py-1 rounded hover:bg-white/10 transition-colors text-xs"
                  >
                    {window.title}
                  </button>
                </div>
              ))
            })()}
          </div>

          {/* System Tray */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
            >
              <Sparkles className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
            </motion.div>
            <div className="text-right">
              <div className="font-medium text-xs">{formatTime(currentTime)}</div>
              <div className="text-white/60 text-[10px]">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
