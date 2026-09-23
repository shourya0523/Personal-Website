// The landing sequence. Four phases over the live wallpaper:
//   intro    kinetic type: the monogram splits in, the name wipes up letter by letter, the role types itself
//   who      "Who's visiting?" four glass tiles (peer / recruiter / client / just looking)
//   name     "what should I call you?" optional name
//   welcome  returning visitors: one click back in, or start over
// Both top-level elements are direct children of the desktop root so the panel gets real liquid glass.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import AppIcon from '../brand/AppIcon'
import { useOS } from './OSContext'
import { useSounds } from '../contexts/SoundContext'
import { wallpaperHandle } from './wallpaperHandle'
import { glassHandle } from './Glass'
import { WallpaperEngine, landingScene } from '../wallpapers'
import { track, USER_TYPES } from '../analytics'
import { profile } from '../content/profile'
import './Landing.css'

const MotionDiv = motion.div, MotionSpan = motion.span, MotionButton = motion.button, MotionForm = motion.form
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const INTRO_MS = 3600

const wordV = { hidden: {}, show: { transition: { staggerChildren: .035, delayChildren: .1 } } }
const letterV = { hidden: { y: '115%', rotate: 5, opacity: 0 }, show: { y: 0, rotate: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 26 } } }
const tilesV = { hidden: {}, show: { transition: { staggerChildren: .08, delayChildren: .15 } } }
const tileV = { hidden: { y: 28, opacity: 0, scale: .96 }, show: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 24 } } }

function Word({ text }) {
  return <MotionSpan className="landing__word" variants={wordV}>{[...text].map((ch, i) => <MotionSpan key={i} className="landing__letter" variants={letterV}>{ch}</MotionSpan>)}</MotionSpan>
}
function greeting() { const h = new Date().getHours(); return h < 5 ? 'Up late' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 22 ? 'Good evening' : 'Up late' }

export default function Landing({ onEnter, glassRef }) {
  const os = useOS(); const sounds = useSounds()
  // the landing has its own scene (Halftone Dawn) on its own canvas, above the desktop wallpaper
  const canvasRef = useRef(null); const engRef = useRef(null)
  useEffect(() => { const eng = new WallpaperEngine(canvasRef.current); engRef.current = eng; const cv = canvasRef.current; eng.onFrame = () => glassHandle.current?.changed(cv); eng.setScene(landingScene, { intro: true }); if (import.meta.env.DEV) window.__landing = eng; return () => eng.destroy() }, [])
  const bg = () => engRef.current
  const returning = Boolean(os.userType)
  const [phase, setPhase] = useState(returning ? 'welcome' : 'intro')
  const [name, setName] = useState(os.userName || ''); const [leaving, setLeaving] = useState(false)
  const [now, setNow] = useState(new Date()); const inputRef = useRef(null); const doneRef = useRef(false)
  const [startedAt] = useState(() => Date.now())

  const viewedRef = useRef(false)
  useEffect(() => { if (!viewedRef.current) { viewedRef.current = true; track('landing_viewed', { returning }) } const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [returning])
  useEffect(() => { if (phase !== 'intro') return; const t = setTimeout(() => setPhase('who'), reduced() ? 400 : INTRO_MS); return () => clearTimeout(t) }, [phase])
  useEffect(() => { if (phase === 'name') setTimeout(() => inputRef.current?.focus(), 350) }, [phase])

  // cursor parallax on the title block
  const mx = useMotionValue(0), my = useMotionValue(0); const sx = useSpring(mx, { stiffness: 60, damping: 20 }), sy = useSpring(my, { stiffness: 60, damping: 20 })
  const px = useTransform(sx, v => v * 14), py = useTransform(sy, v => v * 10)
  const onMove = e => { mx.set(e.clientX / window.innerWidth - .5); my.set(e.clientY / window.innerHeight - .5); bg()?.hover(e.clientX, e.clientY) }

  const finish = useCallback((typeId, opts = {}) => {
    if (doneRef.current) return; doneRef.current = true
    const n = name.trim(); if (n) os.setUserName(n)
    if (typeId) os.setUserType(typeId)
    track('onboarding_completed', { user_type: typeId || os.userType || 'unknown', has_name: Boolean(n || os.userName), returning, skipped: Boolean(opts.skipped), seconds: Math.round((Date.now() - startedAt) / 1000) })
    sounds.open(); setLeaving(true)
    const c = glassRef?.current?.getBoundingClientRect(); bg()?.outro(1.1); wallpaperHandle.current?.pulse(c ? c.left + c.width / 2 : window.innerWidth / 2, c ? c.top + c.height / 2 : window.innerHeight / 2)
    setTimeout(() => onEnter({ userType: typeId || os.userType, justOnboarded: !returning || opts.restarted }), 1150)
  }, [name, os, onEnter, glassRef, sounds, returning, startedAt])

  const choose = (t, e) => { sounds.click(); track('user_type_selected', { user_type: t.id }); const r = e.currentTarget.getBoundingClientRect(); bg()?.pulse(r.left + r.width / 2, r.top + r.height / 2); setChosen(t.id); setPhase('name') }
  const [chosen, setChosen] = useState(null)
  const skipIntro = useCallback(() => { if (phase === 'intro') { track('landing_skipped', { phase: 'intro' }); setPhase('who') } }, [phase])
  useEffect(() => {
    const k = e => { if (e.target.closest('input')) return; if (phase === 'intro' && ['Enter', ' ', 'Escape'].includes(e.key)) skipIntro(); if (phase === 'welcome' && e.key === 'Enter') finish(null) }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [phase, skipIntro, finish])

  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const ticker = useMemo(() => [profile.headline, profile.location, `Now building ${['Concord', 'Por-Kit', 'Rubber Duck'].join(', ')}`, 'CS + Business at Northeastern', 'Open to good problems'].join('   ·   '), [])
  const hoverTile = e => { const r = e.currentTarget.getBoundingClientRect(); bg()?.wake(r.left + r.width / 2, r.bottom, .6) }
  const tilt = e => { const r = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; e.currentTarget.style.transform = `perspective(700px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg) translateY(-3px)` }
  const untilt = e => { e.currentTarget.style.transform = '' }
  const chosenType = USER_TYPES.find(t => t.id === chosen)

  return (
    <>
      <MotionDiv className={`landing__bg ${leaving ? 'landing__bg--leaving' : ''}`} initial={{ opacity: 1 }} animate={{ opacity: leaving ? 0 : 1 }} transition={{ duration: .6, delay: leaving ? .75 : 0 }}><canvas ref={canvasRef} aria-hidden="true" /></MotionDiv>
      <MotionDiv className={`landing landing--${phase} ${leaving ? 'landing--leaving' : ''}`} data-phase={phase} onPointerMove={onMove} onPointerLeave={() => bg()?.leave()} onClick={e => { if (phase === 'intro') skipIntro(); else if (e.target === e.currentTarget || e.target.classList.contains('landing__scrim')) bg()?.click(e.clientX, e.clientY) }} animate={leaving ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: .7 }}>
        <div className="landing__scrim" />
        <div className="landing__top">
          <AnimatePresence>{phase !== 'intro' && <MotionDiv key="mark" className="landing__mark" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}><b>S</b><span>Y</span></MotionDiv>}</AnimatePresence>
          <div className="landing__clock" aria-hidden="true">{time}</div>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <MotionDiv key="intro" className="landing__intro" style={{ x: px, y: py }} exit={{ opacity: 0, y: -30, scale: .96, transition: { duration: .5 } }}>
              <MotionDiv className="landing__bigmark" initial="hidden" animate="show">
                <MotionSpan className="landing__bigS" initial={{ x: -70, opacity: 0, filter: 'blur(14px)' }} animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }} transition={{ duration: .9, ease: [.2, .8, .2, 1] }}>S</MotionSpan>
                <MotionSpan className="landing__bigY" initial={{ x: 70, opacity: 0, filter: 'blur(14px)', rotate: -30 }} animate={{ x: 0, opacity: 1, filter: 'blur(0px)', rotate: -8 }} transition={{ duration: .9, ease: [.2, .8, .2, 1] }}>Y</MotionSpan>
              </MotionDiv>
              <MotionDiv className="landing__name" initial="hidden" animate="show" transition={{ delayChildren: .5, staggerChildren: .25 }}>
                <Word text={profile.firstName} /><Word text={profile.name.split(' ').slice(1).join(' ')} />
              </MotionDiv>
              <MotionDiv className="landing__rule" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.3, duration: .8, ease: [.2, .8, .2, 1] }} />
              <div className="landing__role"><span className="landing__typed">{profile.headline.replace(/·/g, '·')}</span></div>
              <MotionDiv className="landing__tag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: .8 }}>a portfolio, shaped like an operating system</MotionDiv>
            </MotionDiv>
          )}
          {phase === 'who' && (
            <MotionDiv key="who" className="landing__heading" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .5 }}>
              <h1>Who's visiting?</h1><p>The desktop opens on what matters to you.</p>
            </MotionDiv>
          )}
          {phase === 'name' && (
            <MotionDiv key="name" className="landing__heading" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .5 }}>
              <h1>{greeting()}.</h1><p>{chosenType ? chosenType.hint : ''}</p>
            </MotionDiv>
          )}
          {phase === 'welcome' && (
            <MotionDiv key="welcome" className="landing__heading" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .5 }}>
              <h1>Welcome back{os.userName ? `, ${os.userName}` : ''}.</h1><p>Everything is where you left it.</p>
            </MotionDiv>
          )}
        </AnimatePresence>

        {phase === 'intro' && <button type="button" className="landing__skip" onClick={e => { e.stopPropagation(); skipIntro() }}>Skip <span className="kbd">↵</span></button>}
        <div className="landing__ticker" aria-hidden="true"><div className="landing__ticker-track"><span>{ticker}   ·   </span><span>{ticker}   ·   </span></div></div>
      </MotionDiv>

      <AnimatePresence>
        {phase !== 'intro' && (
          <MotionDiv key="panel" ref={glassRef} className={`landing__panel landing__panel--${phase} glass chrome`} data-glass="lock"
            initial={{ opacity: 0, y: 30, scale: .97 }} animate={leaving ? { opacity: 0, scale: 1.06, y: -10 } : { opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: .98 }} transition={{ type: 'spring', stiffness: 220, damping: 26 }}>
            {phase === 'who' && (
              <MotionDiv className="landing__tiles" variants={tilesV} initial="hidden" animate="show" role="group" aria-label="Who's visiting?">
                {USER_TYPES.map(t => (
                  <MotionButton key={t.id} type="button" className="landing__tile" variants={tileV} onClick={e => choose(t, e)} onPointerEnter={hoverTile} onPointerMove={tilt} onPointerLeave={untilt}>
                    <AppIcon name={t.glyph} size={46} /><span className="landing__tile-label">{t.label}</span><span className="landing__tile-hint">{t.hint}</span>
                  </MotionButton>
                ))}
              </MotionDiv>
            )}
            {phase === 'name' && (
              <MotionForm className="landing__form" onSubmit={e => { e.preventDefault(); finish(chosen) }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .15 }}>
                <label htmlFor="lock-name" className="landing__label">What should I call you?</label>
                <input ref={inputRef} id="lock-name" className="landing__input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoComplete="given-name" maxLength={40} />
                <MotionDiv className="landing__underline" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .3, duration: .6, ease: [.2, .8, .2, 1] }} />
                <div className="landing__actions">
                  <button type="submit" className="btn btn--primary">{name.trim() ? `Enter as ${name.trim()}` : 'Enter'}</button>
                  <button type="button" className="btn btn--quiet" onClick={() => { track('landing_skipped', { phase: 'name' }); finish(chosen, { skipped: true }) }}>Skip the name</button>
                  <button type="button" className="btn btn--quiet landing__back" onClick={() => setPhase('who')}>Back</button>
                </div>
              </MotionForm>
            )}
            {phase === 'welcome' && (
              <div className="landing__welcome">
                <div className="landing__welcome-type"><AppIcon name={USER_TYPES.find(t => t.id === os.userType)?.glyph || 'compass'} size={40} /><span>{USER_TYPES.find(t => t.id === os.userType)?.label || 'Visitor'}</span></div>
                <div className="landing__actions">
                  <button type="button" className="btn btn--primary" onClick={() => finish(null)}>Enter <span className="kbd">↵</span></button>
                  <button type="button" className="btn btn--quiet" onClick={() => { track('landing_restarted'); os.setUserType(null); os.setUserName(''); setName(''); setPhase('who') }}>Not {os.userName || 'you'}? Start over</button>
                </div>
              </div>
            )}
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  )
}
