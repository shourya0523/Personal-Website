import { Suspense, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import AppIcon from '../brand/AppIcon'
import { useOS } from './OSContext'
import { useSounds } from '../contexts/SoundContext'

const MENUBAR = 30
const MotionDiv = motion.div

export default function Window({ win, side }) {
  const os = useOS(); const sounds = useSounds()
  const app = os.appById[win.appId]; const ref = useRef(null); const focused = os.focusId === win.id
  const Comp = app.component
  const tucked = os.stage

  // drag by title bar: transform during the drag, commit on release
  const drag = useRef(null)
  const onBarDown = e => {
    if (e.button !== 0 || e.target.closest('.window__lights') || win.maximized || os.isMobile) return
    e.currentTarget.setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, ox: win.x, oy: win.y, moved: false, lastWake: 0 }; ref.current.classList.add('window-pos--dragging')
  }
  const onBarMove = e => {
    const d = drag.current; if (!d) return; const dx = e.clientX - d.x, dy = e.clientY - d.y; if (!d.moved && Math.hypot(dx, dy) < 3) return
    d.moved = true; d.nx = Math.round(d.ox + dx); d.ny = Math.max(MENUBAR, Math.round(d.oy + dy)); ref.current.style.transform = `translate(${d.nx}px,${d.ny}px)`
    const now = performance.now(); if (now - d.lastWake > 60) { d.lastWake = now; os.wpRef.current?.wake(e.clientX, e.clientY, .2) }
  }
  const onBarUp = () => { const d = drag.current; drag.current = null; ref.current?.classList.remove('window-pos--dragging'); if (d?.moved) os.moveWindow(win.id, { x: d.nx, y: d.ny }) }

  const rs = useRef(null)
  const onResizeDown = e => { e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId); rs.current = { x: e.clientX, y: e.clientY, w: win.w, h: win.h } }
  const onResizeMove = e => { const r = rs.current; if (!r) return; r.nw = Math.max(320, r.w + e.clientX - r.x); r.nh = Math.max(200, r.h + e.clientY - r.y); ref.current.style.width = r.nw + 'px'; ref.current.style.height = r.nh + 'px' }
  const onResizeUp = () => { const r = rs.current; rs.current = null; if (r?.nw) os.resizeWindow(win.id, { w: r.nw, h: r.nh }) }

  useEffect(() => { if (ref.current && !win.maximized) ref.current.style.transform = `translate(${win.x}px,${win.y}px)` }, [win.x, win.y, win.maximized])

  const max = win.maximized || os.isMobile
  const pos = max ? { left: 0, top: MENUBAR, width: '100%', height: `calc(100% - ${MENUBAR}px)`, transform: 'none', zIndex: win.z }
    : { left: 0, top: 0, width: win.w, height: win.h, transform: `translate(${win.x}px,${win.y}px)`, zIndex: win.z }

  return (
    <div ref={ref} className={`window-pos ${max ? 'window-pos--max' : ''} ${tucked ? `window-pos--tucked window-pos--${side}` : ''}`} style={pos} data-window={win.appId}
      onPointerDown={() => { if (tucked) { os.setStage(false); return } if (!focused) os.focusWindow(win.id) }}>
      <MotionDiv className={`window glass--window ${focused ? 'window--focused' : 'window--blurred'} ${max ? 'window--maximized' : ''}`}
        initial={{ opacity: 0, scale: .92 }} animate={{ opacity: win.minimized ? 0 : 1, scale: win.minimized ? .9 : 1, pointerEvents: win.minimized ? 'none' : 'auto' }} exit={{ opacity: 0, scale: .9 }} transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
        <div className="window__bar" onPointerDown={onBarDown} onPointerMove={onBarMove} onPointerUp={onBarUp} onPointerCancel={onBarUp} onDoubleClick={() => !os.isMobile && os.toggleMaximize(win.id)}>
          <div className="window__lights" role="group" aria-label="Window controls">
            <button className="window__light" style={{ background: 'var(--danger)' }} aria-label="Close" onClick={() => { sounds.close(); os.closeWindow(win.id) }}><svg viewBox="0 0 10 10"><path d="M2 2l6 6M8 2l-6 6" /></svg></button>
            <button className="window__light" style={{ background: 'var(--warn)' }} aria-label="Minimize" onClick={() => { sounds.minimize(); os.minimizeWindow(win.id) }}><svg viewBox="0 0 10 10"><path d="M2 5h6" /></svg></button>
            <button className="window__light" style={{ background: 'var(--ok)' }} aria-label={win.maximized ? 'Restore' : 'Zoom'} onClick={() => { sounds.maximize(); os.toggleMaximize(win.id) }}><svg viewBox="0 0 10 10"><path d="M2.5 6.5v-4h4M7.5 3.5v4h-4" /></svg></button>
          </div>
          <div className="window__title"><AppIcon name={app.icon} flat size={14} /><span>{win.title}</span></div>
          <div className="window__bar-spacer" />
        </div>
        <div className="window__body">
          <Suspense fallback={<div className="window__loading">loading {app.label.toLowerCase()}…</div>}>
            <Comp windowId={win.id} {...win.props} />
          </Suspense>
          {!max && <div className="window__resize" onPointerDown={onResizeDown} onPointerMove={onResizeMove} onPointerUp={onResizeUp} aria-hidden="true" />}
        </div>
      </MotionDiv>
    </div>
  )
}
