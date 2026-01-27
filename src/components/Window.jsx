import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Square, Maximize2, Sparkles } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useSounds } from '../contexts/SoundContext'
import GlassSurface from './GlassSurface'

export default function Window({ window, onClose, onMinimize, onMaximize, onFocus, onDragEnd, onResize }) {
  const sounds = useSounds()
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const windowRef = useRef(null)

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return
    setIsDragging(true)
    setDragStart({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y
    })
    onFocus()
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && !window.maximized) {
        onDragEnd({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, window.maximized, onDragEnd])

  return (
    <AnimatePresence>
      {!window.minimized && (
        <motion.div
          ref={windowRef}
          key={window.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: window.maximized ? 0 : window.position.x,
            y: window.maximized ? 0 : window.position.y,
            width: window.maximized ? '100%' : window.size.width,
            height: window.maximized ? '100%' : window.size.height,
          }}
          exit={{ opacity: 0, scale: 0.8, y: window.position.y + 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute overflow-hidden flex flex-col"
        style={{
          zIndex: window.zIndex,
          left: window.maximized ? 0 : window.position.x,
          top: window.maximized ? 0 : window.position.y,
          width: window.maximized ? '100%' : `${window.size.width}px`,
          height: window.maximized ? '100%' : `${window.size.height}px`,
          maxWidth: window.maximized ? '100%' : '95vw',
          maxHeight: window.maximized ? '100%' : '95vh',
        }}
        onMouseDown={(e) => {
          handleMouseDown(e)
          sounds.click()
        }}
      >
        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={16}
          opacity={0.9}
          brightness={100}
          displace={0.25}
          distortionScale={-120}
          redOffset={0}
          greenOffset={10}
          blueOffset={20}
          className="w-full h-full flex flex-col"
        >
        {/* Title Bar */}
        <div className="bg-white/5 backdrop-blur-xl px-4 py-2 flex items-center justify-between cursor-move select-none border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* macOS Traffic Light Buttons */}
            <div className="flex items-center gap-2 window-controls">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff3b30] transition-colors flex items-center justify-center group"
                title="Close"
              >
                <X size={8} className="opacity-0 group-hover:opacity-100 transition-opacity text-black" />
              </button>
              <button
                onClick={onMinimize}
                className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ff9500] transition-colors flex items-center justify-center group"
                title="Minimize"
              >
                <Minus size={8} className="opacity-0 group-hover:opacity-100 transition-opacity text-black" />
              </button>
              <button
                onClick={onMaximize}
                className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#34c759] transition-colors flex items-center justify-center group"
                title={window.maximized ? "Restore" : "Maximize"}
              >
                {window.maximized ? (
                  <Maximize2 size={6} className="opacity-0 group-hover:opacity-100 transition-opacity text-black" />
                ) : (
                  <Square size={6} className="opacity-0 group-hover:opacity-100 transition-opacity text-black" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 ml-2">
              {window.icon && <span className="text-lg">{window.icon}</span>}
              <span className="text-sm font-medium">{window.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 window-controls">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
            >
              <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
            </motion.div>
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-auto bg-transparent">
          {window.content}
        </div>

        {/* Resize Handle */}
        {!window.maximized && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={(e) => {
              e.stopPropagation()
              setIsResizing(true)
              const startX = e.clientX
              const startY = e.clientY
              const startWidth = window.size.width
              const startHeight = window.size.height

              const handleMouseMove = (e) => {
                const newWidth = Math.max(400, startWidth + (e.clientX - startX))
                const newHeight = Math.max(300, startHeight + (e.clientY - startY))
                onResize({ width: newWidth, height: newHeight })
              }

              const handleMouseUp = () => {
                setIsResizing(false)
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
              }

              document.addEventListener('mousemove', handleMouseMove)
              document.addEventListener('mouseup', handleMouseUp)
            }}
          >
            <div className="absolute bottom-1 right-1 w-0 h-0 border-l-[8px] border-l-transparent border-b-[8px] border-b-gray-600 opacity-50" />
          </div>
        )}
        </GlassSurface>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
