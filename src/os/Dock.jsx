import { forwardRef } from 'react'
import AppIcon from '../brand/AppIcon'
import { useOS } from './OSContext'
import { useSounds } from '../contexts/SoundContext'

const Dock = forwardRef(function Dock(_, ref) {
  const os = useOS(); const sounds = useSounds()
  const items = os.apps.filter(a => a.dock)
  const click = (e, a) => { const r = e.currentTarget.getBoundingClientRect(); sounds.open(); os.openApp(a.id, { origin: { x: r.left + r.width / 2, y: r.top }, source: 'dock' }) }
  return (
    <nav ref={ref} className="dock glass chrome" data-glass="dock" aria-label="Dock">
      {items.map((a, i) => { const w = os.windows.find(w => w.appId === a.id); return (
        <span key={a.id} style={{ display: 'contents' }}>
          {i === items.length - 1 && <span className="dock__sep" aria-hidden="true" />}
          <button className={`dock__item ${w ? 'dock__item--running' : ''} ${w?.minimized ? 'dock__item--minimized' : ''}`} onClick={e => click(e, a)} aria-label={a.label}>
            <AppIcon name={a.icon} /><span className="dock__dot" aria-hidden="true" /><span className="dock__tip">{a.label}</span>
          </button>
        </span>) })}
    </nav>
  )
})
export default Dock
