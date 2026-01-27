import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { X, ChevronDown, Battery, Wifi, Signal } from 'lucide-react'
import { useWallpaper } from '../contexts/WallpaperContext'
import { useUser } from '../contexts/UserContext'
import { useSounds } from '../contexts/SoundContext'
import GlassSurface from './GlassSurface'
import FallingParticles from './FallingParticles'
import './MobileLayout.css'

export default function MobileLayout({ apps, onAppClick, windows = [], onCloseWindow, children }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [batteryLevel, setBatteryLevel] = useState(100)
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false)
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false)
  const [swipeProgress, setSwipeProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  
  const { wallpaperUrl } = useWallpaper()
  const { userName } = useUser()
  const sounds = useSounds()
  
  const dragY = useMotionValue(0)
  const springY = useSpring(dragY, { damping: 30, stiffness: 300 })
  // For swipe UP, we animate the app moving up and fading out
  const opacity = useTransform(springY, [0, 300], [1, 0])
  const scale = useTransform(springY, [0, 300], [1, 0.95])
  const yTransform = useTransform(springY, [0, 300], [0, -100])
  
  const containerRef = useRef(null)

  // Get the topmost (active) window
  const activeWindow = windows.filter(w => !w.minimized).sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))[0]
  const activeApp = activeWindow ? apps.find(a => a.type === activeWindow.type) : null

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Simulate battery level
    const batteryTimer = setInterval(() => {
      setBatteryLevel(prev => Math.max(20, prev - 0.1))
    }, 60000)
    return () => clearInterval(batteryTimer)
  }, [])

  const handleCloseApp = () => {
    if (activeWindow && onCloseWindow) {
      sounds.click()
      onCloseWindow(activeWindow.id)
      dragY.set(0)
      setSwipeProgress(0)
    }
  }

  const handleDragStart = () => {
    if (!activeWindow) return false
    setIsDragging(true)
    return true
  }

  const handleDrag = (event, info) => {
    if (!activeWindow) return
    const deltaY = info.offset.y
    // In iOS, swipe UP (negative deltaY) closes apps
    if (deltaY < 0) {
      dragY.set(Math.abs(deltaY))
      setSwipeProgress(Math.min(Math.abs(deltaY) / 300, 1))
    }
  }

  const handleDragEnd = (event, info) => {
    if (!activeWindow) return
    setIsDragging(false)
    const deltaY = info.offset.y
    
    // Swipe UP (negative) to close - threshold is 90px upward
    if (deltaY < -90) {
      handleCloseApp()
    } else {
      dragY.set(0)
      setSwipeProgress(0)
    }
  }

  const handleStatusBarClick = () => {
    if (activeWindow) {
      setIsNotificationCenterOpen(true)
    }
  }

  const handleStatusBarSwipeDown = () => {
    if (!activeWindow) {
      setIsNotificationCenterOpen(true)
    }
  }

  const handleStatusBarSwipeUp = () => {
    if (!activeWindow) {
      setIsControlCenterOpen(true)
    }
  }

  // Group apps into pages (4x6 grid per page)
  const appsPerPage = 20
  const appPages = []
  for (let i = 0; i < apps.length; i += appsPerPage) {
    appPages.push(apps.slice(i, i + appsPerPage))
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div 
      ref={containerRef}
      className="ios-mobile-layout"
      style={{
        backgroundImage: `url(${wallpaperUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="ios-overlay" />

      {/* Falling Particles */}
      <FallingParticles />

      {/* iOS Status Bar */}
      <motion.div 
        className="ios-status-bar"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        onTap={handleStatusBarClick}
        onPanStart={(e) => {
          if (e.deltaY > 0) handleStatusBarSwipeDown()
          else if (e.deltaY < 0) handleStatusBarSwipeUp()
        }}
      >
        <div className="ios-status-left">
          <span className="ios-time">{formatTime(currentTime)}</span>
        </div>
        <div className="ios-status-right">
          <Signal size={14} className="ios-signal-icon" />
          <Wifi size={14} className="ios-wifi-icon" />
          <div className="ios-battery">
            <Battery size={16} className="ios-battery-icon" />
            <span className="ios-battery-text">{Math.round(batteryLevel)}%</span>
          </div>
        </div>
      </motion.div>

      {/* Active App View */}
      <AnimatePresence mode="wait">
        {activeWindow && activeApp ? (
          <motion.div
            key={activeWindow.id}
            className="ios-app-view"
            style={{
              y: yTransform,
              opacity,
              scale,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -100 }}
            transition={{ duration: 0.3 }}
            drag="y"
            dragConstraints={{ top: -300, bottom: 0 }}
            dragElastic={0.2}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            {/* App Header */}
            <div className="ios-app-header">
              <div className="ios-app-header-content">
                <div className="ios-app-header-left">
                  <button
                    onClick={handleCloseApp}
                    className="ios-close-button"
                    aria-label="Close app"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="ios-app-header-center">
                  <span className="ios-app-title">{activeWindow.title || activeApp.label}</span>
                </div>
                <div className="ios-app-header-right" />
              </div>
            </div>

            {/* App Content */}
            <div className="ios-app-content">
              {activeWindow.content || (
                <div className="ios-app-placeholder">
                  <div className="ios-app-icon-large">
                    {activeApp.iconElement || <span style={{ fontSize: '64px' }}>{activeApp.icon}</span>}
                  </div>
                  <h2 className="ios-app-name">{activeApp.label}</h2>
                  {activeApp.component && (
                    <activeApp.component onFileClick={() => {}} />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="home-screen"
            className="ios-home-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Welcome Section */}
            <div className="ios-welcome-section">
              <motion.h1 
                className="ios-welcome-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {userName ? `Welcome, ${userName}!` : 'Shourya Yadav'}
              </motion.h1>
              <motion.p 
                className="ios-welcome-subtitle"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Tap an app to get started
              </motion.p>
            </div>

            {/* App Grid */}
            <div className="ios-app-grid-container">
              {appPages.map((page, pageIndex) => (
                <motion.div
                  key={pageIndex}
                  className="ios-app-grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + pageIndex * 0.1 }}
                >
                  {page.map((app, index) => (
                    <motion.button
                      key={app.id}
                      className="ios-app-icon"
                      onClick={() => onAppClick(app)}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: 0.5 + (pageIndex * appsPerPage + index) * 0.03,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                    >
                      <GlassSurface
                        borderRadius={22}
                        opacity={0.9}
                        brightness={120}
                        className="ios-app-icon-glass"
                      >
                        <div className="ios-app-icon-content">
                          {app.iconElement ? (
                            <div className="ios-app-icon-svg-wrapper">
                              {app.iconElement}
                            </div>
                          ) : (
                            <span className="ios-app-icon-emoji">{app.icon}</span>
                          )}
                        </div>
                      </GlassSurface>
                      <span className="ios-app-icon-label">{app.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Dock - Only show on home screen */}
            <AnimatePresence>
              {!activeWindow && (
                <motion.div
                  key="dock"
                  className="ios-dock"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                >
                  <GlassSurface
                    width="auto"
                    height="auto"
                    borderRadius={28}
                    opacity={0.85}
                    brightness={115}
                    className="ios-dock-glass"
                  >
                    {apps.filter(app => ['about', 'projects', 'resume', 'contact', 'explorer', 'terminal', 'music', 'wallpaper'].includes(app.id)).map((app) => (
                      <button
                        key={app.id}
                        className="ios-dock-item"
                        onClick={() => onAppClick(app)}
                        whileTap={{ scale: 0.85 }}
                        title={app.label}
                      >
                        <div className="ios-dock-icon">
                          {app.iconElement || <span className="ios-dock-emoji">{app.icon}</span>}
                        </div>
                      </button>
                    ))}
                  </GlassSurface>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Center */}
      <AnimatePresence>
        {isNotificationCenterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="ios-backdrop"
              onClick={() => setIsNotificationCenterOpen(false)}
            />
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="ios-notification-center"
            >
              <div className="ios-notification-header">
                <ChevronDown size={24} className="ios-notification-handle" />
                <h2 className="ios-notification-title">Notifications</h2>
              </div>
              <div className="ios-notification-content">
                <div className="ios-notification-item">
                  <div className="ios-notification-icon">👤</div>
                  <div className="ios-notification-text">
                    <div className="ios-notification-app">About</div>
                    <div className="ios-notification-message">Welcome to my portfolio!</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Control Center */}
      <AnimatePresence>
        {isControlCenterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="ios-backdrop"
              onClick={() => setIsControlCenterOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="ios-control-center"
            >
              <div className="ios-control-header">
                <ChevronDown size={24} className="ios-control-handle" />
              </div>
              <div className="ios-control-grid">
                <div className="ios-control-item">
                  <div className="ios-control-icon">🔊</div>
                  <div className="ios-control-label">Volume</div>
                </div>
                <div className="ios-control-item">
                  <div className="ios-control-icon">☀️</div>
                  <div className="ios-control-label">Brightness</div>
                </div>
                <div className="ios-control-item">
                  <div className="ios-control-icon">✈️</div>
                  <div className="ios-control-label">Airplane</div>
                </div>
                <div className="ios-control-item">
                  <div className="ios-control-icon">📶</div>
                  <div className="ios-control-label">Wi-Fi</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Home Indicator */}
      <motion.div 
        className="ios-home-indicator"
        onTap={() => {
          if (activeWindow) {
            handleCloseApp()
          }
        }}
        whileTap={{ scale: 0.9 }}
        drag="y"
        dragConstraints={{ top: -50, bottom: 0 }}
        dragElastic={0.3}
        onDragEnd={(event, info) => {
          // Swipe up on home indicator to close app
          if (activeWindow && info.offset.y < -30) {
            handleCloseApp()
          }
        }}
      />
    </div>
  )
}
