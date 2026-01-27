import { createContext, useContext, useState } from 'react'

const WindowContext = createContext()

export const useWindows = () => {
  const context = useContext(WindowContext)
  if (!context) {
    throw new Error('useWindows must be used within WindowProvider')
  }
  return context
}

export const WindowProvider = ({ children }) => {
  const [windows, setWindows] = useState([])
  const [zIndexCounter, setZIndexCounter] = useState(1000)

  const openWindow = (windowData) => {
    const newWindow = {
      ...windowData,
      id: windowData.id || `window-${Date.now()}`,
      zIndex: zIndexCounter + 1,
      minimized: false,
      maximized: false,
      position: windowData.position || { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
      size: windowData.size || { width: 800, height: 600 },
    }
    setWindows([...windows, newWindow])
    setZIndexCounter(zIndexCounter + 1)
  }

  const closeWindow = (id) => {
    setWindows(windows.filter(w => w.id !== id))
  }

  const minimizeWindow = (id) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, minimized: true } : w
    ))
  }

  const maximizeWindow = (id) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, maximized: !w.maximized } : w
    ))
  }

  const restoreWindow = (id) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, minimized: false } : w
    ))
    bringToFront(id)
  }

  const bringToFront = (id) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, zIndex: zIndexCounter + 1 } : w
    ))
    setZIndexCounter(zIndexCounter + 1)
  }

  const updateWindowPosition = (id, position) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, position } : w
    ))
  }

  const updateWindowSize = (id, size) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, size } : w
    ))
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
