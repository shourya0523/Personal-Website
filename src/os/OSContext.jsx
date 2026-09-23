// OSContext: window manager, stage mode, wallpaper choice, settings. Apps consume it with useOS().
//
// API (stable, apps may rely on it):
//   openApp(appId, { props?, origin?: {x,y} })  -> focuses existing window or opens a new one; origin (client px) pulses the wallpaper
//   closeWindow(id) | minimizeWindow(id) | toggleMaximize(id) | focusWindow(id) | moveWindow(id,{x,y}) | resizeWindow(id,{w,h})
//   windows, focusId, stage, setStage(bool)
//   wallpaper, setWallpaper(id), wp (engine handle: pulse/wake/click/hover/leave/intro/setSlow) via wpRef.current
//   settings {sound, effects, glass: 'full'|'chrome'}, setSetting(key, value)
//   userName, setUserName(name); userType ('peer'|'recruiter'|'client'|'visitor'|null), setUserType(id)
//   apps (registry), isMobile
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { apps, appById } from './apps'
import { safeLocalStorage } from '../utils/storage'
import { DEFAULT_WALLPAPER } from '../wallpapers'
import { wallpaperHandle } from './wallpaperHandle'
import { initAnalytics, track, setTraits } from '../analytics'

const OSContext = createContext(null)
// eslint-disable-next-line react-refresh/only-export-components
export const useOS = () => { const c = useContext(OSContext); if (!c) throw new Error('useOS must be used within OSProvider'); return c }

let nextId = 1, nextZ = 10
const MENUBAR = 30

function defaultRect(app, i, vw, vh) {
  const w = Math.min(app.size?.w ?? 880, vw - 40), h = Math.min(app.size?.h ?? 620, vh - MENUBAR - 100)
  const x = Math.max(12, Math.round((vw - w) / 2 + ((i % 5) - 2) * 28)), y = Math.max(MENUBAR + 10, Math.round((vh - h) / 2 - 20 + ((i % 5) - 2) * 22))
  return { x, y, w, h }
}

export function OSProvider({ children }) {
  const [windows, setWindows] = useState([])
  const [focusId, setFocusId] = useState(null)
  const [stage, setStage] = useState(false)
  const [wallpaper, setWallpaperState] = useState(() => safeLocalStorage.getItem('os.wallpaper', DEFAULT_WALLPAPER))
  const [settings, setSettings] = useState(() => ({ sound: safeLocalStorage.getItem('os.sound', 'on') !== 'off', effects: safeLocalStorage.getItem('os.effects', 'on') !== 'off', glass: safeLocalStorage.getItem('os.glass', 'full') }))
  const [userName, setUserNameState] = useState(() => safeLocalStorage.getItem('userName', ''))
  const [userType, setUserTypeState] = useState(() => safeLocalStorage.getItem('os.userType', '') || null)
  useEffect(() => { initAnalytics(); if (userType) setTraits({ user_type: userType }) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  const wpRef = wallpaperHandle
  const openCount = useRef(0)

  useEffect(() => { document.documentElement.dataset.wallpaper = wallpaper; safeLocalStorage.setItem('os.wallpaper', wallpaper) }, [wallpaper])
  useEffect(() => { const f = () => setIsMobile(window.innerWidth < 768); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f) }, [])
  useEffect(() => { safeLocalStorage.setItem('os.sound', settings.sound ? 'on' : 'off'); safeLocalStorage.setItem('os.effects', settings.effects ? 'on' : 'off'); safeLocalStorage.setItem('os.glass', settings.glass) }, [settings])

  const setWallpaper = useCallback(id => { setWallpaperState(id); track('wallpaper_changed', { wallpaper: id }) }, [])
  const setSetting = useCallback((k, v) => { setSettings(s => ({ ...s, [k]: v })); track('setting_changed', { key: k, value: String(v) }) }, [])
  const setUserName = useCallback(n => { setUserNameState(n); safeLocalStorage.setItem('userName', n) }, [])
  const setUserType = useCallback(id => { setUserTypeState(id); if (id) { safeLocalStorage.setItem('os.userType', id); setTraits({ user_type: id }) } else safeLocalStorage.removeItem?.('os.userType') }, [])
  const setStageTracked = useCallback(v => { setStage(v); if (v) track('stage_mode_entered') }, [])

  const focusWindow = useCallback(id => { const z = ++nextZ; setFocusId(id); setWindows(ws => ws.map(w => w.id === id ? { ...w, z, minimized: false } : w)) }, [])

  // Mirror of `windows` for decisions inside callbacks; keeps state updaters pure (StrictMode runs them twice).
  const windowsRef = useRef(windows); useEffect(() => { windowsRef.current = windows }, [windows])

  const openApp = useCallback((appId, { props, origin, source = 'unknown' } = {}) => {
    const app = appById[appId]; if (!app) return
    setStage(false)
    track('app_opened', { app: appId, source, reopened: windowsRef.current.some(w => w.appId === appId) })
    if (origin && wallpaperHandle.current) wallpaperHandle.current.pulse(origin.x, origin.y)
    const existing = windowsRef.current.find(w => w.appId === appId)
    if (existing) { const z = ++nextZ; setFocusId(existing.id); setWindows(ws => ws.map(w => w.id === existing.id ? { ...w, z, minimized: false, props: props ?? w.props } : w)); return }
    const id = nextId++, z = ++nextZ; const rect = defaultRect(app, openCount.current++, window.innerWidth, window.innerHeight)
    const win = { id, appId, title: app.label, ...rect, z, minimized: false, maximized: window.innerWidth < 768, props: props ?? {} }
    windowsRef.current = [...windowsRef.current, win]
    setFocusId(id); setWindows(ws => ws.some(w => w.id === id) ? ws : [...ws, win])
  }, [])
  const closeWindow = useCallback(id => {
    const rest = windowsRef.current.filter(w => w.id !== id); windowsRef.current = rest
    setFocusId(f => f === id ? (rest.length ? rest.reduce((a, b) => a.z > b.z ? a : b).id : null) : f)
    setWindows(ws => ws.filter(w => w.id !== id))
  }, [])
  const minimizeWindow = useCallback(id => setWindows(ws => ws.map(w => w.id === id ? { ...w, minimized: true } : w)), [])
  const toggleMaximize = useCallback(id => setWindows(ws => ws.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w)), [])
  const moveWindow = useCallback((id, p) => setWindows(ws => ws.map(w => w.id === id ? { ...w, ...p } : w)), [])
  const resizeWindow = useCallback((id, s) => setWindows(ws => ws.map(w => w.id === id ? { ...w, ...s } : w)), [])

  const value = useMemo(() => ({ apps, appById, windows, focusId, stage, setStage: setStageTracked, openApp, closeWindow, minimizeWindow, toggleMaximize, focusWindow, moveWindow, resizeWindow, wallpaper, setWallpaper, wpRef, settings, setSetting, userName, setUserName, userType, setUserType, isMobile }),
    [windows, focusId, stage, setStageTracked, openApp, closeWindow, minimizeWindow, toggleMaximize, focusWindow, moveWindow, resizeWindow, wallpaper, setWallpaper, wpRef, settings, setSetting, userName, setUserName, userType, setUserType, isMobile])
  return <OSContext.Provider value={value}>{children}</OSContext.Provider>
}
