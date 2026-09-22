// Desktop icons: a real desktop. Single click selects, double click opens, drag moves (grid snap, persisted),
// drag on empty space marquee-selects, a still click on empty space reaches the wallpaper (stage mode rules live in Desktop).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AppIcon from '../brand/AppIcon'
import { useOS } from './OSContext'
import { safeLocalStorage } from '../utils/storage'
import { files } from '../content/files'

const PAD_X = 20, PAD_Y = 16
const cssPx = name => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0

export default function DesktopIcons({ onEmptyClick, onEmptyDrag, className = '' }) {
  const os = useOS()
  const layerRef = useRef(null)
  const items = useMemo(() => [
    ...os.apps.filter(a => a.desktop).map(a => ({ id: `app:${a.id}`, label: a.label, icon: a.icon, open: () => ({ app: a.id }) })),
    ...files.children.filter(f => f.type === 'folder' && !os.apps.some(a => a.label.toLowerCase() === f.name.toLowerCase())).map(f => ({ id: `folder:${f.name}`, label: f.name, icon: 'folder', open: () => ({ app: 'files', props: { path: [f.name] } }) })),
  ], [os.apps])

  const [positions, setPositions] = useState(() => { try { return JSON.parse(safeLocalStorage.getItem('os.iconPositions', '{}')) } catch { return {} } })
  const [selected, setSelected] = useState(() => new Set())
  const [marquee, setMarquee] = useState(null)
  const [drag, setDrag] = useState(null) // { id, dx, dy }
  const [layerH, setLayerH] = useState(() => window.innerHeight - 30)
  useEffect(() => { const el = layerRef.current; if (!el) return; const ro = new ResizeObserver(() => setLayerH(el.clientHeight)); ro.observe(el); return () => ro.disconnect() }, [])
  const metrics = () => ({ gx: cssPx('--desktop-grid-x'), gy: cssPx('--desktop-grid-y') })

  // default layout: fill columns top-down from the left
  const layout = useMemo(() => {
    const { gy } = metrics(); const h = layerH - cssPx('--dock-h') - 24
    const rows = Math.max(3, Math.floor((h - PAD_Y) / gy)); const taken = new Set(Object.values(positions).map(p => `${p.col},${p.row}`)); const out = {}
    let i = 0
    for (const it of items) {
      if (positions[it.id]) { out[it.id] = positions[it.id]; continue }
      let col, row; do { col = Math.floor(i / rows); row = i % rows; i++ } while (taken.has(`${col},${row}`))
      taken.add(`${col},${row}`); out[it.id] = { col, row }
    }
    return out
  }, [items, positions, layerH])

  useEffect(() => { safeLocalStorage.setItem('os.iconPositions', JSON.stringify(positions)) }, [positions])

  const open = useCallback((it, origin) => { const o = it.open(); os.openApp(o.app, { props: o.props, origin }) }, [os])
  const center = el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } }

  // ---- icon pointer handling (select / drag)
  const start = useRef(null)
  const onIconDown = (e, it) => {
    if (e.button !== 0) return
    e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId)
    const multi = e.metaKey || e.ctrlKey || e.shiftKey
    setSelected(s => { if (multi) { const n = new Set(s); n.has(it.id) ? n.delete(it.id) : n.add(it.id); return n } return s.has(it.id) ? s : new Set([it.id]) })
    start.current = { x: e.clientX, y: e.clientY, id: it.id, moved: false, lastWake: 0 }
  }
  const onIconMove = e => {
    const s = start.current; if (!s) return
    const dx = e.clientX - s.x, dy = e.clientY - s.y
    if (!s.moved && Math.hypot(dx, dy) < 4) return
    if (os.isMobile) return
    s.moved = true; setDrag({ id: s.id, dx, dy })
    const now = performance.now(); if (now - s.lastWake > 40) { s.lastWake = now; os.wpRef.current?.wake(e.clientX, e.clientY, .25) }
  }
  const onIconUp = (e, it) => {
    const s = start.current; start.current = null
    if (!s) return
    if (s.moved) {
      const { gx, gy } = metrics(); const dc = Math.round((e.clientX - s.x) / gx), dr = Math.round((e.clientY - s.y) / gy)
      const ids = selected.has(it.id) ? [...selected] : [it.id]
      setPositions(p => {
        const next = { ...p }; const occupied = new Set(Object.entries(layout).filter(([id]) => !ids.includes(id)).map(([, v]) => `${v.col},${v.row}`))
        const maxCol = Math.max(0, Math.floor((layerRef.current.clientWidth - PAD_X * 2) / gx) - 1), maxRow = Math.max(0, Math.floor((layerRef.current.clientHeight - PAD_Y * 2 - cssPx('--dock-h')) / gy) - 1)
        for (const id of ids) {
          const cur = layout[id]; let col = Math.max(0, Math.min(maxCol, cur.col + dc)), row = Math.max(0, Math.min(maxRow, cur.row + dr))
          let guard = 0; while (occupied.has(`${col},${row}`) && guard++ < 200) { row++; if (row > maxRow) { row = 0; col = Math.min(maxCol, col + 1) } }
          occupied.add(`${col},${row}`); next[id] = { col, row }
        }
        return next
      })
      setDrag(null); os.wpRef.current?.wake(e.clientX, e.clientY, .9)
    } else if (os.isMobile) open(it, center(e.currentTarget))
  }

  // ---- empty-desktop pointer handling lives on the desktop root (marquee / still click); the icon container stays small
  // so the glass library has little to rasterize when it changes
  const mq = useRef(null); const cbs = useRef({})
  useEffect(() => { cbs.current = { onEmptyClick, onEmptyDrag } }, [onEmptyClick, onEmptyDrag])
  useEffect(() => {
    const root = layerRef.current?.parentElement; if (!root) return
    const isEmpty = t => t === root || t.classList?.contains('desktop__wallpaper')
    const down = e => {
      if (!isEmpty(e.target) || e.button !== 0) return
      root.setPointerCapture?.(e.pointerId); const r = root.getBoundingClientRect(); mq.current = { x0: e.clientX - r.left, y0: e.clientY - r.top, moved: false }
      if (!(e.metaKey || e.shiftKey)) setSelected(new Set())
    }
    const move = e => {
      const m = mq.current; if (!m) return
      const r = root.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top
      if (!m.moved && Math.hypot(x - m.x0, y - m.y0) < 4) return
      m.moved = true; const rect = { x: Math.min(m.x0, x), y: Math.min(m.y0, y), w: Math.abs(x - m.x0), h: Math.abs(y - m.y0) }
      setMarquee(rect); cbs.current.onEmptyDrag?.(e)
      const sel = new Set(); root.querySelectorAll('.dicon').forEach(el => { const b = el.getBoundingClientRect(); const bx = b.left - r.left, by = b.top - r.top; if (bx < rect.x + rect.w && bx + b.width > rect.x && by < rect.y + rect.h && by + b.height > rect.y) sel.add(el.dataset.id) })
      setSelected(sel)
    }
    const up = e => { const m = mq.current; mq.current = null; setMarquee(null); if (m && !m.moved) cbs.current.onEmptyClick?.(e) }
    root.addEventListener('pointerdown', down); root.addEventListener('pointermove', move); root.addEventListener('pointerup', up); root.addEventListener('pointercancel', up)
    return () => { root.removeEventListener('pointerdown', down); root.removeEventListener('pointermove', move); root.removeEventListener('pointerup', up); root.removeEventListener('pointercancel', up) }
  }, [])
  useEffect(() => {
    const onKey = e => {
      if (e.target.closest('input,textarea,[contenteditable]') || e.target.closest('.window')) return
      if (e.key === 'Escape') setSelected(new Set())
      if (e.key === 'Enter' && selected.size) { const it = items.find(i => selected.has(i.id)); if (it) { const el = layerRef.current.querySelector(`[data-id="${CSS.escape(it.id)}"]`); open(it, el ? center(el) : undefined) } }
      if (e.key === 'a' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setSelected(new Set(items.map(i => i.id))) }
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [items, selected, open])

  const { gx, gy } = metrics()
  const extent = Object.values(layout).reduce((m, p) => ({ c: Math.max(m.c, p.col), r: Math.max(m.r, p.row) }), { c: 0, r: 0 })
  return (<>
    <div ref={layerRef} className={`desktop__icons ${className}`} style={{ width: PAD_X * 2 + (extent.c + 1) * gx, height: PAD_Y * 2 + (extent.r + 1) * gy }} role="listbox" aria-label="Desktop">
      {items.map(it => {
        const p = layout[it.id] || { col: 0, row: 0 }; const isSel = selected.has(it.id); const dragging = drag && (isSel || drag.id === it.id)
        const x = PAD_X + p.col * gx + (dragging ? drag.dx : 0), y = PAD_Y + p.row * gy + (dragging ? drag.dy : 0)
        return (
          <div key={it.id} data-id={it.id} className={`dicon ${dragging ? 'dicon--dragging' : ''}`} role="option" aria-selected={isSel} tabIndex={0} style={{ transform: `translate(${x}px,${y}px)` }}
            onPointerDown={e => onIconDown(e, it)} onPointerMove={onIconMove} onPointerUp={e => onIconUp(e, it)} onPointerCancel={() => { start.current = null; setDrag(null) }}
            onDoubleClick={e => { if (!os.isMobile) open(it, center(e.currentTarget)) }}>
            <AppIcon name={it.icon} size={cssPx('--desktop-icon') || 64} />
            <span className="dicon__label">{it.label}</span>
          </div>
        )
      })}
    </div>
    {marquee && <div className="marquee" style={{ left: marquee.x, top: marquee.y, width: marquee.w, height: marquee.h }} />}
  </>)
}
