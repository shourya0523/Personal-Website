// Privacy Theater: the op-ed as a scroll-driven play. The text is ordinary HTML (so links work,
// it reads without JavaScript and it can be cited); the stage behind it is three.js, and every
// camera move is tied to where the reader is in the text.
import '@fontsource/funnel-display/400.css'
import '@fontsource/funnel-display/500.css'
import '@fontsource/funnel-display/600.css'
import '@fontsource/geist-mono/400.css'
import '@fontsource/courier-prime/400.css'
import '@fontsource/anton/400.css'
import './style.css'
import * as THREE from 'three'
import { Theater, LAYOUT } from './theater.js'
import { readVisitor, receiptLines, claimHTML, plain } from './reader.js'
import { initLab } from './lab.js'
import { receiptBlob } from './receipt.js'

const V = (x, y, z) => new THREE.Vector3(x, y, z)
const seat = LAYOUT.seat()
const E = LAYOUT.eye, T = LAYOUT.toggle, B = LAYOUT.box, R = LAYOUT.receipt, L = LAYOUT.laptop

/**
 * The shot list. Each beat in the HTML (data-shot) gets one or two keyframes; `move` says how
 * the camera travels INTO that keyframe from the one before.
 */
const SHOTS = {
  establish: [{ pos: V(0, 14, 36), tgt: V(0, 4, -2), fov: 46 }],
  seat: [{ pos: seat.clone().add(V(0.3, 0, 0)), tgt: V(0, 3.6, 0), fov: 50, move: 'crane' }],
  banner: [{ pos: V(0, 3.7, 8.6), tgt: V(0, 3.6, 1.2), fov: 44, move: 'dolly' }],
  curtain: [
    { pos: V(-3.2, 3.4, 6.8), tgt: V(0, 4, -1), fov: 44, move: 'orbit' },
    { pos: V(0, 4.4, 3.6), tgt: E, fov: 40, move: 'dolly' },
  ],
  eye: [
    { pos: V(0, 4.6, 0.6), tgt: E, fov: 44, move: 'dolly' },
    { pos: V(0, 4.6, 7.5), tgt: E, fov: 15, move: 'dollyzoom' },
  ],
  // Square on to the switch, centred, while the reader is invited to click it...
  toggle: [{ pos: V(-3.5, 2.2, 3.6), tgt: T.clone().add(V(0, 0.15, 0)), fov: 40, move: 'whip' }],
  // ...then swing round it while the caption explains.
  toggleText: [{ pos: V(-9.4, 2.6, 2.4), tgt: T, fov: 40, move: 'orbit' }],
  flyloft: [
    { pos: V(-2.8, 2.0, 1.2), tgt: V(-1.2, 9, -3), fov: 56, move: 'crane' },
    // Straight up into the flies (both axes together, so it clears the arch), rolling slightly.
    { pos: V(1.4, 11.2, -1.2), tgt: V(1.5, 14.2, -5), fov: 50, roll: 0.06, move: 'dolly' },
  ],
  box: [{ pos: V(3.2, 6.2, 6.4), tgt: B.clone().add(V(-0.6, 0.8, 0)), fov: 40, move: 'whip' }],
  receipt: [
    { pos: V(R.x, 4.2, R.z - 0.6), tgt: V(R.x, 0.2, R.z + 2.2), fov: 44, move: 'crane' },
    { pos: V(R.x, 3.3, R.z + 0.3), tgt: V(R.x, 0, R.z + 2.6), fov: 40, move: 'dolly' },
  ],
  forces: [
    { pos: V(-8, 2.2, 7), tgt: V(-6, 2.4, -1.5), fov: 46, move: 'whip' },
    { pos: V(8, 2.2, 7), tgt: V(6, 2.4, -1.5), fov: 46, move: 'truck' },
  ],
  trapdoor: [
    { pos: V(0, 3.4, 0.4), tgt: LAYOUT.trapdoor, fov: 50, move: 'crane' },
    { pos: V(0, -2.9, -3.6), tgt: V(L.x, L.y + 0.2, L.z), fov: 52, roll: -0.12, move: 'drop' },
  ],
  workbench: [{ pos: V(L.x + 0.5, L.y + 0.75, L.z + 1.6), tgt: V(L.x, L.y + 0.4, L.z - 0.3), fov: 40, move: 'dolly' }],
  tobesure: [{ pos: V(0, 3.2, -1.2), tgt: E, fov: 50, move: 'crane' }],
  fixes: [{ pos: V(0, 9, 30), tgt: V(0, 3, -2), fov: 50, move: 'dolly' }],
  close: [{ pos: V(0, 2.4, -2.4), tgt: V(0, 7.5, 18), fov: 56, move: 'orbit' }],
  credits: [{ pos: V(0, 4.2, 13), tgt: V(0, 4.4, 0), fov: 48, move: 'crane' }],
}

const ease = {
  inOut: t => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  out: t => 1 - (1 - t) ** 3,
  in: t => t * t * t,
  expo: t => (t === 0 || t === 1 ? t : t < 0.5 ? 2 ** (20 * t - 10) / 2 : (2 - 2 ** (-20 * t + 10)) / 2),
  linear: t => t,
}
const clamp01 = v => Math.min(1, Math.max(0, v))
const lerp = (a, b, t) => a + (b - a) * t

// ------------------------------------------------------------------ layout → keyframes
const beats = [...document.querySelectorAll('#play .beat')]
let keys = [], beatBox = {}

function measure() {
  const vh = window.innerHeight
  keys = []; beatBox = {}
  for (const el of beats) {
    const top = el.offsetTop, h = el.offsetHeight
    const name = el.dataset.shot
    const side = el.classList.contains('beat--left') ? 1 : el.classList.contains('beat--right') ? -1 : 0
    beatBox[name] = { top, h, act: Number(el.dataset.act), side, lift: el.classList.contains('beat--title') ? 0 : 1 }
    const center = top + h / 2 - vh / 2
    const shots = SHOTS[name]
    shots.forEach((s, i) => {
      const at = shots.length === 1 ? center : center + (i === 0 ? -0.22 : 0.22) * h
      keys.push({ ...s, roll: s.roll ?? 0, at })
    })
  }
  keys.sort((a, b) => a.at - b.at)
}

const sph = new THREE.Spherical(), sphA = new THREE.Spherical(), sphB = new THREE.Spherical()
/** Camera for a scroll position: interpolate the two keyframes around it with the move's style. */
function cameraAt(y) {
  if (y <= keys[0].at) return keys[0]
  const last = keys[keys.length - 1]
  if (y >= last.at) return last
  let i = 0
  while (keys[i + 1].at < y) i++
  const a = keys[i], b = keys[i + 1]
  const u = clamp01((y - a.at) / (b.at - a.at))
  const tgt = new THREE.Vector3(), pos = new THREE.Vector3()
  let fovT = ease.inOut(u)
  switch (b.move) {
    case 'crane': {
      // Rise or fall first, then settle forward: an arc rather than a straight line.
      const k = ease.inOut(u), ky = ease.out(u)
      tgt.lerpVectors(a.tgt, b.tgt, k)
      pos.set(lerp(a.pos.x, b.pos.x, k), lerp(a.pos.y, b.pos.y, ky), lerp(a.pos.z, b.pos.z, k))
      break
    }
    case 'orbit': {
      // Swing around the target at a changing radius.
      const k = ease.inOut(u)
      tgt.lerpVectors(a.tgt, b.tgt, k)
      sphA.setFromVector3(a.pos.clone().sub(b.tgt)); sphB.setFromVector3(b.pos.clone().sub(b.tgt))
      let dTheta = sphB.theta - sphA.theta
      if (dTheta > Math.PI) dTheta -= 2 * Math.PI
      if (dTheta < -Math.PI) dTheta += 2 * Math.PI
      sph.set(lerp(sphA.radius, sphB.radius, k), lerp(sphA.phi, sphB.phi, k), sphA.theta + dTheta * k)
      pos.setFromSpherical(sph).add(tgt)
      break
    }
    case 'whip': {
      // A fast pan: the target snaps across in the middle of the move, the body follows.
      tgt.lerpVectors(a.tgt, b.tgt, ease.expo(u))
      pos.lerpVectors(a.pos, b.pos, ease.inOut(u))
      break
    }
    case 'dollyzoom': {
      // Pull back while zooming in at a matched rate, so the subject holds size and the room warps.
      pos.lerpVectors(a.pos, b.pos, u); tgt.lerpVectors(a.tgt, b.tgt, u)
      const dA = a.pos.distanceTo(a.tgt), dB = b.pos.distanceTo(b.tgt), d = pos.distanceTo(tgt)
      const hA = dA * Math.tan(THREE.MathUtils.degToRad(a.fov / 2))
      const hB = dB * Math.tan(THREE.MathUtils.degToRad(b.fov / 2))
      const fov = 2 * THREE.MathUtils.radToDeg(Math.atan(lerp(hA, hB, u) / d))
      return { pos, tgt, fov, roll: lerp(a.roll, b.roll, u) }
    }
    case 'drop': {
      // Fall through the trapdoor: accelerate down, then level out under the stage.
      const k = ease.in(u)
      pos.set(lerp(a.pos.x, b.pos.x, ease.inOut(u)), lerp(a.pos.y, b.pos.y, k), lerp(a.pos.z, b.pos.z, ease.inOut(u)))
      tgt.lerpVectors(a.tgt, b.tgt, ease.out(u))
      fovT = u
      break
    }
    case 'truck':
      pos.lerpVectors(a.pos, b.pos, u); tgt.lerpVectors(a.tgt, b.tgt, u)
      break
    default: {
      const k = ease.inOut(u)
      pos.lerpVectors(a.pos, b.pos, k); tgt.lerpVectors(a.tgt, b.tgt, k)
    }
  }
  return { pos, tgt, fov: lerp(a.fov, b.fov, fovT), roll: lerp(a.roll, b.roll, ease.inOut(u)) }
}

// ------------------------------------------------------------------ scroll → scene state
/** 0 before the beat, 1 after it, and an eased ramp while the reader is inside it. */
function phase(name, a = 0, b = 1, y = smoothY) {
  const box = beatBox[name]
  if (!box) return 0
  const t = (y + window.innerHeight / 2 - box.top) / box.h
  const k = clamp01((t - a) / (b - a))
  return k * k * (3 - 2 * k)
}

function sceneState() {
  const after = phase
  return {
    // The curtain opens late in its beat, so the numbers on it have time to be read.
    stats: after('curtain', 0.02, 0.2) * (1 - after('curtain', 0.62, 0.78)),
    curtain: after('curtain', 0.66, 0.98) * (1 - after('credits', 0.05, 0.5)),
    banner: after('curtain', 0.55, 0.85),
    eyeStat: after('eye', 0.18, 0.4) * (1 - after('eye', 0.85, 1)),
    question: after('close', 0.2, 0.55),
    eyeOpen: 0.06 + 0.44 * after('curtain', 0.7, 1) + 0.5 * after('eye', 0, 0.5) - 0.2 * after('box', 0, 0.5)
      - 0.45 * after('trapdoor', 0.2, 0.8) - 0.15 * after('tobesure') - 0.1 * after('fixes') - 0.1 * after('close', 0, 0.6),
    cards: reading ? after('seat', 0.05, 0.25) * (1 - after('curtain', 0.4, 0.62)) : 0,
    bubbles: after('toggleText', 0.5, 1) * (1 - after('box', 0, 0.5)),
    togglePrompt: after('toggle', 0.1, 0.3) * (1 - after('toggle', 0.75, 0.95)),
    forces: [0, 1, 2].map(i => after('forces', 0.12 + i * 0.2, 0.27 + i * 0.2) * (1 - after('trapdoor', 0, 0.3))),
    box: after('box', 0, 0.4) * (1 - after('forces', 0.1, 0.5)),
    print: after('receipt', 0.1, 0.75),
    trapdoor: after('trapdoor', 0.1, 0.5) * (1 - after('close', 0, 0.4)),
    house: after('close', 0.15, 0.8),
    velocity,
  }
}

// ------------------------------------------------------------------ boot
const canvas = document.getElementById('stage')
let reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
let theater = null
try {
  theater = new Theater(canvas, { lowPower: matchMedia('(max-width: 700px)').matches })
} catch (err) {
  console.warn('[privacy-theater] WebGL unavailable, showing the text on its own', err)
  document.body.classList.add('no-stage')
}

let smoothY = window.scrollY, velocity = 0, reading = null
const motionBtn = document.getElementById('motion-toggle')
const syncMotion = () => { motionBtn.textContent = reduced ? 'Motion: reduced' : 'Motion: on'; motionBtn.setAttribute('aria-pressed', String(reduced)) }
motionBtn.onclick = () => { reduced = !reduced; syncMotion() }
syncMotion()

measure()
document.fonts?.ready.then(() => measure())
addEventListener('resize', () => { measure(); theater?.resize() })

// Act label and progress dots.
const actLabel = document.getElementById('act-label')
const ACTS = ['Prologue', 'Act I · The performance', 'Act II · The stakes', 'Act III · The price', 'Act IV · Take it back', 'Curtain call']
let shownAct = -1
function syncAct() {
  const mid = window.scrollY + window.innerHeight / 2
  let act = 0
  for (const el of beats) if (el.offsetTop <= mid) act = Number(el.dataset.act)
  if (act === shownAct) return
  shownAct = act
  actLabel.textContent = ACTS[act]
  document.querySelectorAll('.progress a').forEach(a => a.classList.toggle('on', Number(a.dataset.act) <= act && act > 0))
  document.body.dataset.act = act
}

// Text rides the same smoothed scroll as the camera: the column is offset by however far the
// smoothing trails the real scroll, and each caption fades on the camera's clock.
const play = document.getElementById('play')
const captions = beats.map(el => ({ el, hold: el.hasAttribute('data-hold'), fixed: el.classList.contains('beat--title') || el.classList.contains('beat--credits') }))
function syncText() {
  play.style.transform = `translate3d(0, ${(window.scrollY - smoothY).toFixed(2)}px, 0)`
  const vh = window.innerHeight
  for (const c of captions) {
    if (c.fixed) continue
    const box = beatBox[c.el.dataset.shot]
    if (!box) continue
    const t = (smoothY + vh / 2 - box.top) / box.h
    // A short visible window per caption, so the gaps between beats belong to the stage.
    const [a, b] = c.hold ? [0.06, 0.16] : [0.24, 0.36]
    // Fade in over [a, b], hold, fade out over [1 - b, 1 - a].
    const lin = Math.min(clamp01((t - a) / (b - a)), clamp01((1 - a - t) / (b - a)))
    const op = lin * lin * (3 - 2 * lin)
    c.el.style.setProperty('--o', op.toFixed(3))
    c.el.style.pointerEvents = op > 0.5 ? '' : 'none'
  }
}

// Render loop.
let frames = 0, fpsClock = performance.now(), lastY = smoothY, hintHidden = false, lastT = performance.now()
let shift = 0, lift = 0
/** Which side the text panel at the middle of the screen sits on (+1 left, -1 right). */
function panelSide(y) {
  const mid = y + window.innerHeight / 2
  let box = null
  for (const b of Object.values(beatBox)) if (b.top <= mid) box = b
  return box ?? { side: 0, lift: 0 }
}
function frame(now) {
  requestAnimationFrame(frame)
  const dt = Math.min(0.1, (now - lastT) / 1000); lastT = now
  const target = window.scrollY
  // Frame-rate independent easing toward the real scroll position (igloo.inc's floaty feel).
  smoothY = reduced ? target : smoothY + (target - smoothY) * (1 - Math.exp(-dt * 5))
  if (Math.abs(target - smoothY) < 0.5) smoothY = target
  velocity = velocity * Math.exp(-dt * 6) + Math.abs(smoothY - lastY) / window.innerHeight * 4
  lastY = smoothY
  const p = panelSide(smoothY), k = 1 - Math.exp(-dt * 3)
  shift += (p.side - shift) * k; lift += (p.lift - lift) * k
  syncAct()
  syncText()
  if (!hintHidden && target > 40) { hintHidden = true; document.getElementById('scroll-hint')?.classList.add('gone') }
  if (!theater) return
  theater.render({ ...cameraAt(smoothY), shift, lift }, sceneState(), reduced)
  frames++
  if (now - fpsClock > 2000) { theater.adapt(frames * 1000 / (now - fpsClock)); frames = 0; fpsClock = now }
}
requestAnimationFrame(frame)

// ------------------------------------------------------------------ pointer and clicks on the stage
let pointerDown = null
addEventListener('pointermove', e => {
  const x = (e.clientX / innerWidth) * 2 - 1, y = -(e.clientY / innerHeight) * 2 + 1
  if (!theater) return
  theater.setPointer(x, y)
  // The text column lets clicks through (pointer-events: none) except on its own panels.
  const onStage = e.target === canvas || e.target === document.body
  document.body.classList.toggle('pointing', onStage && Boolean(theater.pick(x, y)))
}, { passive: true })
addEventListener('pointerdown', e => { pointerDown = [e.clientX, e.clientY] }, { passive: true })
addEventListener('click', e => {
  if (!theater || (e.target !== canvas && e.target !== document.body)) return
  if (pointerDown && Math.hypot(e.clientX - pointerDown[0], e.clientY - pointerDown[1]) > 6) return
  const hit = theater.pick((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
  if (hit === 'banner:accept') chooseBanner('accept')
  else if (hit === 'banner:reject') chooseBanner('reject')
  else if (hit === 'toggle') flipToggle()
  else if (hit === 'eye') theater.blinkEye()
})

// ------------------------------------------------------------------ the cookie banner
const bannerAnswer = document.getElementById('banner-answer')
function chooseBanner(choice) {
  const n = reading?.count ?? 0
  theater?.setBannerChoice(choice, n)
  bannerAnswer.textContent = n
    ? `${choice === 'accept' ? 'Accepted' : 'Rejected'}. Either way, this page had already taken ${n} readings of your device before you chose, and it never set a cookie.`
    : `${choice === 'accept' ? 'Accepted' : 'Rejected'}. Either way, this page had started reading your device before you chose, and it never set a cookie.`
  document.querySelectorAll('[data-banner]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.banner === choice)))
}
document.querySelectorAll('[data-banner]').forEach(b => { b.onclick = () => chooseBanner(b.dataset.banner) })

// ------------------------------------------------------------------ the toggle
const toggleBtn = document.getElementById('toggle-btn')
const toggleAnswer = document.getElementById('toggle-answer')
let toggleOn = true
function flipToggle() {
  toggleOn = !toggleOn
  toggleBtn.setAttribute('aria-checked', String(toggleOn))
  theater?.setToggle(toggleOn)
  toggleAnswer.textContent = toggleOn
    ? 'Back on. That is where it started, before you got here.'
    : 'Off. You found it. In Pew\'s survey, 56% of Americans say they routinely click "agree" without reading, so most people never get this far.'
}
toggleBtn.onclick = flipToggle

// ------------------------------------------------------------------ the live reading (Kuber Mehta's code)
const list = document.getElementById('reading-list')
const readingTime = document.getElementById('reading-time')
readVisitor().then(async r => {
  reading = r
  readingTime.textContent = `· ${r.count} readings in ${(r.ms / 1000).toFixed(2)} s`
  const claims = r.claims.slice(0, 5)
  theater?.setClaims(claims.map(c => plain(c.text)))
  const lines = receiptLines(r)
  receiptReady(lines)
  theater?.setReceipt(lines)
  const dl = document.getElementById('receipt-lines')
  dl.innerHTML = ''
  for (const [k, v] of lines) {
    const dt = document.createElement('dt'); dt.textContent = k
    const dd = document.createElement('dd'); dd.textContent = v
    dl.append(dt, dd)
  }
  list.innerHTML = ''
  for (const c of claims) {
    const li = document.createElement('li')
    li.innerHTML = claimHTML(c.text)
    li.title = c.how
    list.append(li)
    await new Promise(res => setTimeout(res, reduced ? 0 : 260))
  }
  const rare = document.createElement('li')
  rare.className = 'rare'
  rare.innerHTML = claimHTML(`Put together, roughly *1 in ${r.oneIn.toLocaleString()}* browsers look like yours.`)
  list.append(rare)
}).catch(err => {
  list.innerHTML = '<li>The reading didn\'t finish in this browser, which is, for once, the private outcome.</li>'
  console.warn('[privacy-theater] reading failed', err)
})

// ------------------------------------------------------------------ download the receipt
const receiptBtn = document.getElementById('receipt-download')
function receiptReady(lines) {
  receiptBtn.disabled = false
  receiptBtn.onclick = async () => {
    const blob = await receiptBlob(lines)
    if (!blob) return
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'privacy-theater-receipt.png'
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  }
}

// ------------------------------------------------------------------ the local model
const lab = initLab({ onState: s => theater?.setLabState(s) })
lab.init()
