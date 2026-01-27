import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallpaper } from '../contexts/WallpaperContext'
import Folder from './Folder'
import './GlassIcons.css'

const GlassIcons = ({ items, className, colorful = false }) => {
  const { particleColors } = useWallpaper()
  const [expandedFolderIndex, setExpandedFolderIndex] = useState(null)
  const [columns, setColumns] = useState([items])
  const containerRef = useRef(null)

  const getColorForIndex = (index) => {
    return particleColors[index % particleColors.length]
  }

  useEffect(() => {
    if (expandedFolderIndex === null) {
      setColumns([items])
      return
    }

    const checkOverflow = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const containerRect = container.getBoundingClientRect()
      const expandedItem = items[expandedFolderIndex]
      
      if (!expandedItem?.isFolder) {
        setColumns([items])
        return
      }

      const folderData = expandedItem.folderData || {}
      const children = folderData.children || {}
      const childEntries = Object.entries(children)
      
      // Estimate expanded content height (3 columns grid)
      const rows = Math.ceil(childEntries.length / 3)
      const itemHeight = 100 // icon + label + gap
      const expandedContentHeight = rows * 80 + 120 // Approximate row height + padding
      const availableHeight = window.innerHeight - containerRect.top - 150 // 150px bottom margin for dock
      
      // Calculate total height if all items are in one column
      const itemsBeforeExpanded = expandedFolderIndex
      const itemsAfterExpanded = items.length - expandedFolderIndex - 1
      const totalHeight = itemsBeforeExpanded * itemHeight + expandedContentHeight + itemsAfterExpanded * itemHeight
      
      if (totalHeight > availableHeight) {
        // Need to split into columns
        const newColumns = []
        let currentColumn = []
        let currentColumnHeight = 0
        
        items.forEach((item, index) => {
          if (index === expandedFolderIndex) {
            // Add expanded folder to current column
            currentColumn.push(item)
            currentColumnHeight += expandedContentHeight
            newColumns.push([...currentColumn])
            currentColumn = []
            currentColumnHeight = 0
          } else {
            currentColumn.push(item)
            currentColumnHeight += itemHeight
            
            // Start new column if current would overflow
            if (currentColumnHeight + (index === items.length - 1 ? 0 : itemHeight) > availableHeight && currentColumn.length > 0) {
              newColumns.push([...currentColumn])
              currentColumn = []
              currentColumnHeight = 0
            }
          }
        })
        
        if (currentColumn.length > 0) {
          newColumns.push(currentColumn)
        }
        
        setColumns(newColumns.length > 0 ? newColumns : [items])
      } else {
        setColumns([items])
      }
    }

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(checkOverflow, 100)
    window.addEventListener('resize', checkOverflow)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', checkOverflow)
    }
  }, [expandedFolderIndex, items])

  const renderItem = (item, index, globalIndex) => {
    const accentColor = getColorForIndex(globalIndex)
    const isFolder = item.isFolder
    const isExpanded = expandedFolderIndex === globalIndex
    
    if (isFolder) {
      const folderData = item.folderData || {}
      const children = folderData.children || {}
      const childEntries = Object.entries(children)
      
      // Only show file previews, not folder previews
      const fileEntries = childEntries.filter(([, childItem]) => childItem.type === 'file')
      const paperItems = fileEntries.slice(0, 3).map(([childName]) => (
        <div key={childName} className="text-[10px] text-gray-600 truncate px-1 font-medium">
          📄 {childName}
        </div>
      ))
      
      // If no files, show empty papers
      while (paperItems.length < 3) {
        paperItems.push(null)
      }

      return (
        <div key={globalIndex} className="icon-btn-wrapper">
          <button 
            className={`icon-btn ${item.customClass || ''}`} 
            aria-label={item.label} 
            type="button"
            onClick={() => setExpandedFolderIndex(isExpanded ? null : globalIndex)}
            style={{
              '--accent-color': accentColor
            }}
          >
              <span className="icon-btn__front">
              <span className="icon-btn__icon" aria-hidden="true">
                <div className="folder-icon-wrapper">
                  <Folder
                    color="transparent"
                    size={0.8}
                    items={paperItems}
                  />
                </div>
              </span>
            </span>
            <span className="icon-btn__label">{item.label}</span>
          </button>

          {/* Expanded Contents */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="folder-expanded-contents"
                style={{
                  maxHeight: `calc(100vh - ${containerRef.current?.getBoundingClientRect().top || 0}px - 100px)`,
                  overflowY: 'auto'
                }}
              >
                <div className="grid grid-cols-3 gap-4">
                  {childEntries.map(([name, childItem]) => {
                    const isChildFolder = childItem.type === 'folder'
                    return (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center cursor-pointer group"
                        onClick={() => {
                          if (!isChildFolder && item.onFileClick) {
                            item.onFileClick(name)
                          }
                        }}
                      >
                        {isChildFolder ? (
                          <div className="icon-btn__front" style={{ '--accent-color': accentColor }}>
                            <Folder
                              color="transparent"
                              size={0.6}
                              items={Object.keys(childItem.children || {}).slice(0, 3).map(childName => (
                                <div key={childName} className="text-[8px] text-gray-600 truncate px-1">
                                  {childName}
                                </div>
                              ))}
                            />
                          </div>
                        ) : (
                          <div className="icon-btn__front" style={{ '--accent-color': accentColor }}>
                            <span className="text-2xl">📄</span>
                          </div>
                        )}
                        <span className="text-xs text-white text-center max-w-[80px] break-words group-hover:text-blue-400 transition-colors mt-1">
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

    return (
      <button 
        key={globalIndex}
        className={`icon-btn ${item.customClass || ''}`} 
        aria-label={item.label} 
        type="button"
        onClick={item.onClick}
        style={{
          '--accent-color': accentColor
        }}
      >
        <span className="icon-btn__front">
          <span className="icon-btn__icon" aria-hidden="true">
            {item.icon}
          </span>
        </span>
        <span className="icon-btn__label">{item.label}</span>
      </button>
    )
  }

  return (
    <div ref={containerRef} className={`icon-btns-container ${className || ''}`}>
      <div className="icon-btns-grid">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="icon-btns-column">
            {column.map((item, itemIndex) => {
              const globalIndex = colIndex === 0 
                ? itemIndex 
                : columns.slice(0, colIndex).reduce((sum, col) => sum + col.length, 0) + itemIndex
              return renderItem(item, itemIndex, globalIndex)
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GlassIcons
