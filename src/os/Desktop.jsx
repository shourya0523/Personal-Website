// The compositor. Owns the wallpaper canvas, stage mode, glass chrome and the lock screen.
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useOS } from './OSContext'
import { scenes, WallpaperEngine } from '../wallpapers'
import { projects } from '../content/projects'
import DesktopIcons from './DesktopIcons'
import Window from './Window'
import Dock from './Dock'
import MenuBar from './MenuBar'
import Landing from './Landing'
import { track, userTypeById } from '../analytics'
import { GlassManager, CHROME_KINDS, glassHandle } from './Glass'
import { wallpaperHandle } from './wallpaperHandle'
import { useSounds } from '../contexts/SoundContext'
import './os.css'

export default function Desktop() {
  const os = useOS(); const sounds = useSounds()
  const rootRef = useRef(null), canvasRef = useRef(null), barRef = useRef(null), dockRef = useRef(null), lockRef = useRef(null)
  const [locked, setLocked] = useState(true); const [booting, setBooting] = useState(true); const [hint, setHint] = useState(null)
  const engineRef = useRef(null)

  // wallpaper engine
  useEffect(() => {
    const eng = new WallpaperEngine(canvasRef.current); engineRef.current = eng; wallpaperHandle.current = eng
    if (glassHandle.current) eng.onFrame = () => glassHandle.current?.changed(canvasRef.current)
    eng.onAction = act => { if (act?.type === 'open-project') { const p = projects.find(p => p.id === act.id || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === act.id); os.openApp('projects', { props: p ? { projectId: p.id } : {}, source: 'wallpaper' }) } }
    return () => { eng.destroy(); wallpaperHandle.current = null }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const eng = engineRef.current; if (!eng) return; eng.setScene(scenes[os.wallpaper] || scenes.swell, { intro: !locked }); if (locked) eng.stop() }, [os.wallpaper]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { engineRef.current?.setSlow(!os.settings.effects || (os.windows.some(w => !w.minimized) && !os.stage)) }, [os.windows, os.stage, os.settings.effects])

  // real glass on every data-glass surface (chrome, menus, windows); drops to chrome-only if the frame rate collapses
  const lowFps = useRef(0); const setSetting = os.setSetting
  useEffect(() => {
    const gm = new GlassManager(rootRef.current, { onFps: (fps, count) => { if (count <= 3 || fps <= 0) { lowFps.current = 0; return } lowFps.current = fps < 24 ? lowFps.current + 1 : 0; if (lowFps.current >= 4) { lowFps.current = 0; track('glass_degraded', { fps: Math.round(fps), glass_elements: count }); setSetting('glass', 'chrome') } } })
    if (import.meta.env.DEV) window.__glass = gm
    // the wallpaper repaints every frame: tell the glass which element changed instead of flagging it data-dynamic,
    // which would make the library re-rasterize every layer on every frame
    const eng = engineRef.current; if (eng) eng.onFrame = () => gm.changed(canvasRef.current)
    return () => { gm.destroy() }
  }, [setSetting])
  useEffect(() => { const gm = glassHandle.current; if (!gm) return; gm.setKinds(os.settings.glass === 'chrome' ? CHROME_KINDS : null); gm.setEnabled(os.settings.effects) }, [os.settings.effects, os.settings.glass])

  useEffect(() => { const t = setTimeout(() => glassHandle.current?.touch(), 400); return () => clearTimeout(t) }, [os.focusId, os.stage, os.windows.length])

  // stage-mode rules: a still click on empty desktop tucks windows away; with nothing to tuck it reaches the wallpaper
  const onEmptyClick = useCallback(e => {
    const openWins = os.windows.some(w => !w.minimized)
    if (openWins && !os.stage) { sounds.click(); os.setStage(true); return }
    engineRef.current?.click(e.clientX, e.clientY)
  }, [os, sounds])
  const onMove = useCallback(e => { const eng = engineRef.current; if (!eng) return; eng.hover(e.clientX, e.clientY); if (!os.windows.some(w => !w.minimized) || os.stage) { const h = eng.hit(e.clientX, e.clientY); setHint(h ? { x: e.clientX, y: e.clientY, label: h.label } : null) } else if (hint) setHint(null) }, [os.windows, os.stage, hint])

  const unlock = ({ userType, justOnboarded } = {}) => {
    setLocked(false); const eng = engineRef.current; if (eng) { eng.intro() } requestAnimationFrame(() => setTimeout(() => setBooting(false), 900))
    // the desktop opens on what matters to this visitor: recruiter → Resume, client → Projects, peer → About
    const starter = justOnboarded && userTypeById[userType]?.opens
    if (starter && !os.windows.length) setTimeout(() => os.openApp(starter, { source: 'onboarding', origin: { x: window.innerWidth / 2, y: window.innerHeight / 2 } }), 1300)
  }
  const lock = () => { setLocked(true); setBooting(true); os.setStage(false); engineRef.current?.stop(); track('locked') }
  useEffect(() => { const k = e => { if ((e.metaKey || e.ctrlKey) && !e.shiftKey) { const map = { t: 'terminal', f: 'files', ',': 'settings' }; if (map[e.key]) { e.preventDefault(); os.openApp(map[e.key], { source: 'shortcut' }) } if (e.key === 'w' && os.focusId) { e.preventDefault(); os.closeWindow(os.focusId) } } if (e.key === 'Escape' && os.stage) os.setStage(false) }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [os])

  const sorted = [...os.windows].sort((a, b) => a.z - b.z)
  return (
    <div ref={rootRef} className={`desktop ${os.stage ? 'desktop--stage' : ''} ${booting ? 'desktop--booting' : ''}`} onPointerMove={onMove} onPointerLeave={() => { engineRef.current?.leave(); setHint(null) }}>
      <canvas ref={canvasRef} className="desktop__wallpaper" aria-hidden="true" />
      <DesktopIcons onEmptyClick={onEmptyClick} onEmptyDrag={e => engineRef.current?.wake(e.clientX, e.clientY, .15)} />
      <AnimatePresence>
        {sorted.map((w, i) => <Window key={w.id} win={w} side={i % 2 ? 'right' : 'left'} />)}
      </AnimatePresence>
      {hint && <div className="wp-hint" style={{ left: hint.x, top: hint.y }}>{hint.label} · open</div>}
      <MenuBar ref={barRef} onLock={lock} portalTarget={rootRef} />
      <Dock ref={dockRef} />
      {locked && <Landing onEnter={unlock} glassRef={lockRef} />}
    </div>
  )
}
