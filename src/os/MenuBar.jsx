import { forwardRef, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Monogram from '../brand/Monogram'
import { useOS } from './OSContext'
import { useMusic } from '../contexts/MusicContext'
import { useSounds } from '../contexts/SoundContext'

function Menu({ label, brand, items, open, onOpen, onClose, portalTarget }) {
  const itemRef = useRef(null); const [pos, setPos] = useState({ left: 0, top: 0 })
  useEffect(() => { if (open && itemRef.current && portalTarget?.current) { const r = itemRef.current.getBoundingClientRect(), root = portalTarget.current.getBoundingClientRect(); setPos({ left: r.left - root.left, top: r.bottom - root.top + 6 }) } }, [open, portalTarget])
  const menu = open && (
    <div className="menu glass chrome" data-glass="menu" role="menu" style={portalTarget?.current ? { position: 'absolute', ...pos } : undefined} onClick={e => e.stopPropagation()}>
      {items.map((it, i) => it === '-' ? <div key={i} className="menu__sep" /> : it.head ? <div key={i} className="menu__head">{it.head}</div>
        : <button key={i} className="menu__item" role="menuitem" disabled={it.disabled} onClick={() => { onClose(); it.onClick?.() }}><span>{it.label}</span>{it.kbd && <span className="kbd">{it.kbd}</span>}</button>)}
    </div>)
  return (
    <div ref={itemRef} className={`menubar__item ${brand ? 'menubar__item--brand' : 'menubar__item--menu'}`} role="button" tabIndex={0} aria-haspopup="menu" aria-expanded={open}
      onClick={() => open ? onClose() : onOpen()} onMouseEnter={() => { if (document.querySelector('.menubar [aria-expanded="true"]') && !open) onOpen() }} onKeyDown={e => e.key === 'Enter' && (open ? onClose() : onOpen())}>
      {brand ? <Monogram size={17} /> : label}
      {menu && (portalTarget?.current ? createPortal(menu, portalTarget.current) : menu)}
    </div>
  )
}

const MenuBar = forwardRef(function MenuBar({ onLock, portalTarget }, ref) {
  const os = useOS(); const music = useMusic(); const sounds = useSounds()
  const [open, setOpen] = useState(null); const [now, setNow] = useState(new Date())
  const focused = os.windows.find(w => w.id === os.focusId); const app = focused ? os.appById[focused.appId] : null
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 15000); return () => clearInterval(t) }, [])
  const rootRef = useRef(null)
  useEffect(() => { if (!open) return; const off = e => { if (!rootRef.current?.contains(e.target) && !e.target.closest('.menu')) setOpen(null) }; document.addEventListener('pointerdown', off); return () => document.removeEventListener('pointerdown', off) }, [open])
  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); const date = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
  const menus = {
    brand: [{ label: 'About Shourya', onClick: () => os.openApp('about') }, '-', { label: 'Settings…', onClick: () => os.openApp('settings') }, { label: 'Show desktop', onClick: () => os.setStage(true), disabled: !os.windows.length }, '-', { label: 'Lock screen', onClick: onLock }],
    file: [{ label: 'Open Files', kbd: '⌘F', onClick: () => os.openApp('files') }, { label: 'Open Terminal', kbd: '⌘T', onClick: () => os.openApp('terminal') }, '-', { label: 'Close window', kbd: '⌘W', disabled: !focused, onClick: () => focused && os.closeWindow(focused.id) }],
    window: [{ label: 'Minimize', disabled: !focused, onClick: () => focused && os.minimizeWindow(focused.id) }, { label: focused?.maximized ? 'Restore' : 'Zoom', disabled: !focused, onClick: () => focused && os.toggleMaximize(focused.id) }, '-', { head: os.windows.length ? 'Open windows' : 'No windows open' },
      ...os.windows.map(w => ({ label: (w.id === os.focusId ? '• ' : '  ') + w.title, onClick: () => os.focusWindow(w.id) }))],
  }
  return (
    <header ref={el => { rootRef.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el }} className="menubar glass chrome" data-glass="menubar" role="menubar">
      <Menu brand items={menus.brand} open={open === 'brand'} onOpen={() => { sounds.click(); setOpen('brand') }} onClose={() => setOpen(null)} portalTarget={portalTarget} />
      <div className="menubar__item menubar__item--app">{app ? app.label : 'Desktop'}</div>
      <Menu label="File" items={menus.file} open={open === 'file'} onOpen={() => setOpen('file')} onClose={() => setOpen(null)} portalTarget={portalTarget} />
      <Menu label="Window" items={menus.window} open={open === 'window'} onOpen={() => setOpen('window')} onClose={() => setOpen(null)} portalTarget={portalTarget} />
      <div className="menubar__spacer" />
      {music?.currentSong && <div className="menubar__now">
        <button aria-label={music.isPlaying ? 'Pause' : 'Play'} onClick={() => { sounds.click(); music.togglePlayPause() }}>{music.isPlaying ? <svg viewBox="0 0 10 10"><rect x="1" y="1" width="3" height="8" rx="1" /><rect x="6" y="1" width="3" height="8" rx="1" /></svg> : <svg viewBox="0 0 10 10"><path d="M2 1l7 4-7 4z" /></svg>}</button>
        <b>{music.currentSong.title}</b><span>· {music.currentSong.artist}</span>
      </div>}
      <div className="menubar__clock" aria-live="off">{date} &nbsp; {time}</div>
    </header>
  )
})
export default MenuBar
