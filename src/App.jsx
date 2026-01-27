import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Briefcase, FileText, Mail, Terminal as TerminalIcon, Music, Folder, Image as ImageIcon, Trophy, Users, Type } from 'lucide-react'
import { WindowProvider, useWindows } from './contexts/WindowContext'
import { SoundProvider, useSounds } from './contexts/SoundContext'
import Window from './components/Window'
import Dock from './components/Dock'
import MenuBar from './components/MenuBar'
import StartMenu from './components/StartMenu'
import MobileLayout from './components/MobileLayout'
import FileExplorer, { fileStructure } from './components/FileExplorer'
import GlassIcons from './components/GlassIcons'
import Terminal from './components/Terminal'
import About from './pages/About'
import Projects from './pages/Projects'
import Resume from './pages/Resume'
import Contact from './pages/Contact'
import Awards from './pages/Awards'
import Leadership from './pages/Leadership'
import FontDemo from './pages/FontDemo'
import MusicPlayer from './pages/MusicPlayer'
import WallpaperSelector from './pages/WallpaperSelector'
import FallingParticles from './components/FallingParticles'
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage'
import { UserProvider, useUser } from './contexts/UserContext'
import { MusicProvider } from './contexts/MusicContext'
import { WallpaperProvider, useWallpaper } from './contexts/WallpaperContext'
import ClickSparkCursor from './components/ClickSparkCursor'
import './App.css'

const apps = [
  { id: 'about', type: 'about', label: 'About', icon: '👤', iconElement: <User size={24} />, color: 'blue', component: About },
  { id: 'projects', type: 'projects', label: 'Projects', icon: '💼', iconElement: <Briefcase size={24} />, color: 'purple', component: Projects },
  { id: 'resume', type: 'resume', label: 'Resume', icon: '📄', iconElement: <FileText size={24} />, color: 'green', component: Resume },
  { id: 'contact', type: 'contact', label: 'Contact', icon: '📧', iconElement: <Mail size={24} />, color: 'orange', component: Contact },
  { id: 'awards', type: 'awards', label: 'Awards', icon: '🏆', iconElement: <Trophy size={24} />, color: 'yellow', component: Awards },
  { id: 'leadership', type: 'leadership', label: 'Leadership', icon: '👥', iconElement: <Users size={24} />, color: 'cyan', component: Leadership },
  { id: 'explorer', type: 'explorer', label: 'File Explorer', icon: '📁', iconElement: <Folder size={24} />, color: 'indigo', component: FileExplorer },
  { id: 'terminal', type: 'terminal', label: 'Terminal', icon: '💻', iconElement: <TerminalIcon size={24} />, color: 'red', component: Terminal },
  { id: 'fonts', type: 'fonts', label: 'Font Demo', icon: '🔤', iconElement: <Type size={24} />, color: 'slate', component: FontDemo },
  { id: 'music', type: 'music', label: 'Music Player', icon: '🎵', iconElement: <Music size={24} />, color: 'purple', component: MusicPlayer },
  { id: 'wallpaper', type: 'wallpaper', label: 'Wallpaper', icon: '🖼️', iconElement: <ImageIcon size={24} />, color: 'pink', component: WallpaperSelector },
]

// Desktop app icons (excluding Files which will be ExpandableFolder)
const desktopApps = [
  { id: 'about', position: { x: 50, y: 100 } },
  { id: 'projects', position: { x: 50, y: 200 } },
  { id: 'resume', position: { x: 50, y: 300 } },
  { id: 'contact', position: { x: 50, y: 400 } },
  { id: 'terminal', position: { x: 50, y: 500 } },
  { id: 'music', position: { x: 50, y: 600 } },
  { id: 'wallpaper', position: { x: 50, y: 700 } },
]

function DesktopOS() {
  const { windows, openWindow, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, bringToFront, updateWindowPosition, updateWindowSize } = useWindows()
  const { userName } = useUser()
  const { wallpaperUrl } = useWallpaper()
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const sounds = useSounds()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleAppClick = (app) => {
    const existingWindow = windows.find(w => w.type === app.type)
    if (existingWindow) {
      if (existingWindow.minimized) {
        sounds.open()
        restoreWindow(existingWindow.id)
      } else {
        sounds.click()
        bringToFront(existingWindow.id)
      }
    } else {
      sounds.open()
      openWindow({
        type: app.type,
        title: app.label,
        icon: app.icon,
        content: <app.component onFileClick={handleFileClick} />,
        size: { width: 900, height: 700 },
      })
    }
  }

  const handleFileClick = (fileName) => {
    const fileToAppMap = {
      'Bio.txt': 'about',
      'Skills.json': 'about',
      'Web Apps': 'projects',
      'Mobile Apps': 'projects',
      'Open Source': 'projects',
      'Resume.pdf': 'resume',
      'Cover Letter.pdf': 'resume',
      'Email.txt': 'contact',
      'Social Links.json': 'contact',
      '2024': 'awards',
      '2023': 'awards',
      'Roles.json': 'leadership',
      'Experience.md': 'leadership',
    }

    const appType = fileToAppMap[fileName] || Object.keys(fileToAppMap).find(key => fileName.includes(key))
    if (appType) {
      const app = apps.find(a => a.id === appType)
      if (app) {
        handleAppClick(app)
      }
    }
  }

  const handleWindowClick = (windowId) => {
    const window = windows.find(w => w.id === windowId)
    if (window?.minimized) {
      restoreWindow(windowId)
    } else {
      bringToFront(windowId)
    }
  }

  if (isMobile) {
    return (
      <MobileLayout 
        apps={apps} 
        onAppClick={handleAppClick}
        windows={windows.map(window => {
          const app = apps.find(a => a.type === window.type)
          return {
            ...window,
            content: app ? <app.component onFileClick={handleFileClick} /> : window.content
          }
        })}
        onCloseWindow={closeWindow}
      />
    )
  }

  return (
    <div 
      className="h-screen text-white overflow-hidden relative pt-14"
      style={{
        backgroundImage: `url(${wallpaperUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
        {/* Dark overlay to improve visibility */}
        <div className="absolute inset-0 bg-black/10 z-0" />
        
        {/* Falling Particles - Always on top, non-interactive */}
        <FallingParticles />
      
      {/* Desktop Icons */}
      <div className="absolute inset-0">
        {/* Unified Grid: Apps + Files Folder */}
        <div className="absolute left-8 top-24">
          <GlassIcons
            items={[
              ...desktopApps.map(({ id }) => {
                const app = apps.find(a => a.id === id)
                return {
                  icon: app?.iconElement || <span>{app?.icon}</span>,
                  color: app?.color || 'blue',
                  label: app?.label || '',
                  onClick: () => handleAppClick(app),
                  customClass: ''
                }
              }),
              // Add Files folder to the same grid
              fileStructure.Files ? {
                icon: null, // Will be rendered as folder
                color: 'indigo',
                label: 'Files',
                onClick: () => {}, // Handled by ExpandableFolder
                customClass: 'files-folder-item',
                isFolder: true,
                folderData: fileStructure.Files,
                onFileClick: handleFileClick
              } : null
            ].filter(Boolean)}
            colorful={false}
          />
        </div>
      </div>

      {/* Windows */}
      {windows.map((window) => {
        const app = apps.find(a => a.type === window.type)
        return (
          <Window
            key={window.id}
            window={{
              ...window,
              content: app ? (
                app.type === 'terminal' ? (
                  <app.component onFileClick={handleFileClick} onOpenApp={handleAppClick} apps={apps} />
                ) : (
                  <app.component onFileClick={handleFileClick} />
                )
              ) : window.content
            }}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onMaximize={() => maximizeWindow(window.id)}
            onFocus={() => bringToFront(window.id)}
            onDragEnd={(position) => updateWindowPosition(window.id, position)}
            onResize={(size) => updateWindowSize(window.id, size)}
          />
        )
      })}

      {/* Dock */}
      <Dock
        items={apps.filter(app => ['about', 'projects', 'resume', 'contact', 'explorer', 'terminal', 'music', 'wallpaper'].includes(app.id)).map(app => ({
          icon: app.iconElement || <span>{app.icon}</span>,
          label: app.label,
          color: app.color || 'blue',
          app: app,
          onClick: () => handleAppClick(app)
        }))}
        panelHeight={68}
        baseItemSize={64}
        magnification={20}
      />

      {/* Menu Bar */}
      <MenuBar
        windows={windows}
        onWindowClick={handleWindowClick}
        onStartMenuClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
        isStartMenuOpen={isStartMenuOpen}
        apps={apps}
      />

      {/* Start Menu */}
      <StartMenu
        isOpen={isStartMenuOpen}
        apps={apps}
        onAppClick={handleAppClick}
        onClose={() => setIsStartMenuOpen(false)}
      />
    </div>
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState('landing') // 'landing', 'login', 'name', 'desktop'

  useEffect(() => {
    const savedFont = localStorage.getItem('selectedFont')
    if (savedFont) {
      document.body.style.fontFamily = savedFont
    }
  }, [])

  const handleLandingComplete = () => {
    setCurrentPage('login')
  }

  const handleLogin = () => {
    setCurrentPage('desktop')
  }

  return (
    <UserProvider>
      <SoundProvider>
        <MusicProvider>
          <WallpaperProvider>
            <WindowProvider>
              <AnimatePresence mode="wait">
                {currentPage === 'landing' && (
                  <LandingPage key="landing" onComplete={handleLandingComplete} />
                )}
                {currentPage === 'login' && (
                  <LoginPage key="login" onLogin={handleLogin} />
                )}
                {currentPage === 'desktop' && (
                  <motion.div
                    key="desktop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <DesktopOS />
                    <ClickSparkCursor
                      sparkColor='#fff'
                      sparkSize={16}
                      sparkRadius={45}
                      sparkCount={8}
                      duration={400}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </WindowProvider>
          </WallpaperProvider>
        </MusicProvider>
      </SoundProvider>
    </UserProvider>
  )
}

export default App
