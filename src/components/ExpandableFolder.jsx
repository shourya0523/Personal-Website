import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallpaper } from '../contexts/WallpaperContext'
import Folder from './Folder'
import { fileStructure } from './FileExplorer'
import './ExpandableFolder.css'

export default function ExpandableFolder({ folderName, folderData, onFileClick, position }) {
  const { particleColors } = useWallpaper()
  const [isExpanded, setIsExpanded] = useState(false)
  const children = folderData.children || {}
  const childEntries = Object.entries(children)

  // Use first particle color for accent
  const accentColor = particleColors[0] || '#fbbf24'

  const handleClick = () => {
    setIsExpanded(!isExpanded)
  }

  const paperItems = childEntries.slice(0, 3).map(([childName, childItem]) => {
    const isFolder = childItem.type === 'folder'
    return (
      <div key={childName} className="text-[10px] text-gray-600 truncate px-1 font-medium">
        {isFolder ? '📁' : '📄'} {childName}
      </div>
    )
  })

  return (
    <div 
      className="absolute flex flex-col items-start"
      style={{ left: position.x, top: position.y }}
    >
      {/* Folder Icon with Glass Effect */}
      <div className="flex flex-col items-center mb-2">
        <div 
          onClick={handleClick} 
          className="folder-glass-container cursor-pointer"
          style={{ '--accent-color': accentColor }}
        >
          <div className="folder-glass-front">
            <Folder
              color={folderData.color || '#5227FF'}
              size={1}
              items={paperItems}
            />
          </div>
        </div>
        <span className="text-xs text-white text-center mt-2 font-medium max-w-[120px] break-words text-shadow">
          {folderName}
        </span>
      </div>

      {/* Expanded Contents */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 ml-0 w-full"
          >
            <div className="grid grid-cols-3 gap-4">
              {childEntries.map(([name, item]) => {
                const isFolder = item.type === 'folder'
                return (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={() => {
                      if (isFolder) {
                        // Could expand nested folder or open as window
                      } else if (onFileClick) {
                        onFileClick(name, folderName)
                      }
                    }}
                  >
                    {isFolder ? (
                      <Folder
                        color={item.color || '#5227FF'}
                        size={1}
                        items={Object.keys(item.children || {}).slice(0, 3).map(childName => (
                          <div key={childName} className="text-[8px] text-gray-600 truncate px-1">
                            {childName}
                          </div>
                        ))}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center mb-1">
                        <span className="text-xl">📄</span>
                      </div>
                    )}
                    <span className="text-xs text-white text-center max-w-[80px] break-words group-hover:text-blue-400 transition-colors">
                      {name}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
