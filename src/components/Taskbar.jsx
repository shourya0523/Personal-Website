import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Taskbar({ windows, onWindowClick, onStartMenuClick }) {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 h-12 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700 z-40 flex items-center px-2"
    >
      {/* Start Button */}
      <button
        onClick={() => {
          setIsStartMenuOpen(!isStartMenuOpen)
          onStartMenuClick()
        }}
        className="px-4 h-10 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
      >
        <span className="text-xl">🚀</span>
        <span className="text-sm font-medium">Start</span>
      </button>

      {/* Window Buttons */}
      <div className="flex-1 flex items-center gap-1 ml-2">
        {windows.filter(w => !w.minimized).map((window) => (
          <motion.button
            key={window.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onWindowClick(window.id)}
            className="px-3 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center gap-2 text-sm transition-colors"
          >
            {window.icon && <span>{window.icon}</span>}
            <span className="truncate max-w-[150px]">{window.title}</span>
          </motion.button>
        ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-2 px-2">
        <div className="text-xs text-gray-400">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  )
}
