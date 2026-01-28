import { useRef, useState } from 'react'
import { createContext } from 'react'

export const WindowContext = createContext(null)

export const WindowProvider = ({ children }) => {
  const [windows, setWindows] = useState([])
  // Use a ref to avoid batched-state overwrite bugs when multiple window updates happen in a single tick.
  const zIndexCounterRef = useRef(1000)

  const getNextZIndex = () => {
    zIndexCounterRef.current += 1
    return zIndexCounterRef.current
  }

  const openWindow = (windowData) => {
    const defaultSize = windowData.size || { width: 800, height: 600 }
    
    // Calculate center position
    const centerPosition = windowData.position || (() => {
      const centerX = (window.innerWidth - defaultSize.width) / 2
      const centerY = (window.innerHeight - defaultSize.height) / 2
      return { x: Math.max(0, centerX), y: Math.max(0, centerY) }
    })()
    
    const newWindow = {
      ...windowData,
      id: windowData.id || `window-${Date.now()}`,
      zIndex: getNextZIndex(),
      minimized: false,
      maximized: false,
      position: centerPosition,
      size: defaultSize,
    }
    setWindows(prev => [...prev, newWindow])
  }

  const closeWindow = (id) => {
    setWindows(prev => prev.filter(w => w.id !== id))
  }

  const minimizeWindow = (id) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, minimized: true } : w))
    )
  }

  const maximizeWindow = (id) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, maximized: !w.maximized } : w))
    )
  }

  const restoreWindow = (id) => {
    // Restore + bring-to-front must be atomic; otherwise a second setState can overwrite the first in React batching.
    const nextZ = getNextZIndex()
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, minimized: false, zIndex: nextZ } : w))
    )
  }

  const bringToFront = (id) => {
    const nextZ = getNextZIndex()
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, zIndex: nextZ } : w))
    )
  }

  const updateWindowPosition = (id, position) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, position } : w))
    )
  }

  const updateWindowSize = (id, size) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, size } : w))
    )
  }

  return (
    <WindowContext.Provider value={{
      windows,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      bringToFront,
      updateWindowPosition,
      updateWindowSize,
    }}>
      {children}
    </WindowContext.Provider>
  )
}
