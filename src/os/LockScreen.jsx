import { useEffect, useRef, useState } from 'react'
import Monogram from '../brand/Monogram'
import { useOS } from './OSContext'
import { useSounds } from '../contexts/SoundContext'

/** Single lock screen: clock, a glass card with name entry, unlock replays the wallpaper intro. */
export default function LockScreen({ onUnlock, glassRef }) {
  const os = useOS(); const sounds = useSounds()
  const [name, setName] = useState(os.userName || ''); const [leaving, setLeaving] = useState(false); const [now, setNow] = useState(new Date())
  const inputRef = useRef(null)
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  useEffect(() => { if (!os.userName) inputRef.current?.focus() }, [os.userName])
  const unlock = e => {
    e?.preventDefault(); if (leaving) return
    const n = name.trim(); if (n) os.setUserName(n)
    sounds.open(); setLeaving(true); setTimeout(onUnlock, 650)
  }
  useEffect(() => { const k = e => { if (e.key === 'Enter' && os.userName && document.activeElement !== inputRef.current) unlock() }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) })
  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M/i, '')
  const date = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
  return (
    <>
    <div className={`lock ${leaving ? 'lock--leaving' : ''}`} onClick={() => os.userName && !name && unlock()}>
      <div className="lock__scrim" />
      <div className="lock__clock"><div className="lock__time">{time}</div><div className="lock__date">{date}</div></div>
    </div>
      <div ref={glassRef} className={`lock__card glass chrome ${leaving ? 'lock__card--leaving' : ''}`} data-glass="lock">
        <Monogram />
        <h2>{os.userName ? `Welcome back, ${os.userName}` : 'Welcome to ShouryaOS'}</h2>
        <p>{os.userName ? 'Press Enter or click to continue.' : 'What should I call you?'}</p>
        <form className="lock__form" onSubmit={unlock}>
          <input ref={inputRef} id="lock-name" className="input" value={name} onChange={e => setName(e.target.value)} placeholder={os.userName ? os.userName : 'Your name'} aria-label="Your name" autoComplete="given-name" />
          <button type="submit" className="btn btn--primary">{os.userName ? 'Unlock' : 'Enter'}</button>
        </form>
        <div className="lock__hint">a portfolio, shaped like an OS</div>
      </div>
    </>
  )
}
