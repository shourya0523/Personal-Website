// Halftone Dawn: the landing's own scene. Risograph ink dots on cream paper render a dawn sky; an apricot sun rises
// during the intro; a flock of ink birds crosses; dots swell around the pointer and ripple on clicks. On outro the ink
// floods outward from the centre and hands over to the dark desktop underneath.
import { rng, noise2, fbm, ease, grainTile, layer } from './noise'

export const id = 'dawn'
export const seed = 21
export const label = 'Halftone Dawn'
export const palette = { paper: '#f2e6cf', ink: '#12303a', sun: '#ef9f5c', sunDeep: '#e2824a', hill: '#173a44' }

export function init(w, h, sd = seed) {
  const n = fbm(noise2(sd)); const r = rng(sd + 3); const s = w / 1600
  const sp = Math.max(9, 13 * s); const cols = Math.ceil(w / sp) + 1, rows = Math.ceil(h / sp) + 1
  const sunX = w * .64, sunY = h * .6, sunR = h * .16
  const hz = y => h * .76 + Math.sin(y / w * 4.2) * h * .025 + (n(y / 700, 9) - .5) * h * .05 // hill line as function of x
  // per-dot base radius from a brightness field: ink is heavy at the top of the sky, light near the sun and horizon
  const base = new Float32Array(cols * rows); const jx = new Float32Array(cols * rows); const jy = new Float32Array(cols * rows)
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const x = i * sp, y = j * sp; const k = j * cols + i
    const sky = Math.max(0, 1 - y / (h * .78)); const d = Math.hypot(x - sunX, (y - sunY) * 1.1) / (sunR * 3.2)
    const glow = Math.exp(-d * d * 1.6); const cloud = n(x / 520 + 3, y / 260 + 1, 4) - .5
    let ink = .12 + sky * .62 - glow * .55 + cloud * .5; ink = Math.max(.02, Math.min(1, ink))
    base[k] = ink * sp * .48; jx[k] = (r() - .5) * sp * .25; jy[k] = (r() - .5) * sp * .25
  }
  // hills (solid ink) drawn once
  const [hills, hc] = layer(w, h); hc.fillStyle = palette.hill; hc.beginPath(); hc.moveTo(0, h); for (let x = 0; x <= w; x += 6) hc.lineTo(x, hz(x)); hc.lineTo(w, h); hc.closePath(); hc.fill()
  hc.fillStyle = 'rgba(242,230,207,.14)'; for (let x = 0; x < w; x += 9) for (let y = hz(x) + 6; y < h; y += 9) { const v = n(x / 140, y / 140, 3); if (v > .55) { hc.beginPath(); hc.arc(x, y, (v - .55) * 9, 0, 7); hc.fill() } }
  // birds: a small flock, boids-lite
  const birds = []; for (let i = 0; i < 26; i++) birds.push({ x: -w * .2 + r() * w * .3, y: h * .18 + r() * h * .3, vx: 1.6 + r() * .8, vy: (r() - .5) * .4, ph: r() * 6.28, sz: (5 + r() * 5) * s })
  return { n, s, sp, cols, rows, base, jx, jy, sunX, sunY, sunR, hz, hills, birds, grain: grainTile(sd, 256, 12), buckets: Array.from({ length: 40 }, () => []) }
}

export function frame(ctx, w, h, sh, S) {
  const { sp, cols, rows, base, jx, jy, sunX, sunR, s } = S
  const it = sh.intro.active ? ease.clamp((sh.t - sh.intro.t0) / sh.intro.dur) : 1
  const rise = ease.out(ease.clamp(it * 1.2)); const reveal = ease.out(ease.clamp((it - .1) / .9))
  const out = sh.outro ? ease.clamp((sh.t - sh.outro.t0) / sh.outro.dur) : 0
  // paper
  ctx.fillStyle = palette.paper; ctx.fillRect(0, 0, w, h)
  // sun: rises from behind the hills, halftone rim
  const sunY = S.sunY + (1 - rise) * sunR * 2.6
  ctx.fillStyle = palette.sunDeep; ctx.beginPath(); ctx.arc(sunX + 5 * s, sunY + 4 * s, sunR, 0, 7); ctx.fill()
  ctx.fillStyle = palette.sun; ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, 7); ctx.fill()
  // dots, batched by radius bucket
  const px = sh.pointer.inside ? sh.pointer.x : -1e4, py = sh.pointer.inside ? sh.pointer.y : -1e4
  const B = S.buckets; for (const b of B) b.length = 0
  const breathe = sh.t * .6; const maxR = sp * .72; const flood = out > 0 ? out * Math.hypot(w, h) * .75 : -1
  const masks = flood < 0 ? sh.masks : []; const margin = 46 * s
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const k = j * cols + i; const x = i * sp + jx[k], y = j * sp + jy[k]
    let rad = base[k] * (1 + .18 * Math.sin(breathe + i * .37 + j * .23))
    // reveal from the sun outward during the intro
    if (reveal < 1) { const d = Math.hypot(x - sunX, y - sunY); const edge = reveal * Math.hypot(w, h) * 1.1; if (d > edge) continue; rad *= ease.clamp((edge - d) / (220 * s)) }
    // keep the paper clean behind text
    let keep = 1
    for (const m of masks) { const dx = Math.max(m.x - x, 0, x - (m.x + m.w)), dy = Math.max(m.y - y, 0, y - (m.y + m.h)); const d = Math.hypot(dx, dy); if (d < margin) { const t = d / margin; keep = Math.min(keep, t * t * (3 - 2 * t)) } }
    if (keep <= .02) continue
    rad *= keep
    // pointer magnet
    const dp = Math.hypot(x - px, y - py); if (dp < 170 * s) rad += (1 - dp / (170 * s)) * sp * .34
    // ripples from clicks / pulses
    for (const rp of sh.ripples) { const age = sh.t - rp.t0; const d = Math.hypot(x - rp.x, y - rp.y); const front = age * 520 * s; const dd = Math.abs(d - front); if (dd < 70 * s) rad += (1 - dd / (70 * s)) * sp * .4 * rp.a * Math.exp(-age * 1.2) }
    // outro: ink floods outward from the centre
    if (flood >= 0) { const d = Math.hypot(x - w / 2, y - h / 2); if (d < flood) rad = maxR + 2; else if (d < flood + 160 * s) rad += (1 - (d - flood) / (160 * s)) * maxR }
    if (rad < .35) continue; if (rad > maxR + 2) rad = maxR + 2
    B[Math.min(B.length - 1, Math.round(rad / (maxR + 2) * (B.length - 1)))].push(x, y)
  }
  ctx.fillStyle = palette.ink
  for (let bi = 1; bi < B.length; bi++) { const pts = B[bi]; if (!pts.length) continue; const rad = bi / (B.length - 1) * (maxR + 2); ctx.beginPath(); for (let q = 0; q < pts.length; q += 2) { ctx.moveTo(pts[q] + rad, pts[q + 1]); ctx.arc(pts[q], pts[q + 1], rad, 0, 6.2832) } ctx.fill() }
  // hills and birds
  ctx.drawImage(S.hills, 0, 0)
  ctx.strokeStyle = palette.ink; ctx.lineCap = 'round'; ctx.lineWidth = 1.6 * s
  for (const b of S.birds) {
    if (!sh.slow) { b.x += b.vx * s * (60 * sh.dt); b.y += Math.sin(sh.t * 1.3 + b.ph) * .25 * s + b.vy * s; if (b.x > w + 40) { b.x = -40 - Math.random() * w * .3; b.y = h * .15 + Math.random() * h * .35 } }
    const flap = Math.sin(sh.t * 7 + b.ph) * .45; const wsz = b.sz
    ctx.beginPath(); ctx.moveTo(b.x - wsz, b.y - flap * wsz); ctx.quadraticCurveTo(b.x, b.y + wsz * .35, b.x + wsz, b.y - flap * wsz); ctx.stroke()
  }
  // grain + edge vignette (light)
  ctx.globalAlpha = .1; ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = ctx.createPattern(S.grain, 'repeat'); ctx.fillRect(0, 0, w, h); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1
  if (out > 0) { ctx.fillStyle = `rgba(18,48,58,${ease.clamp((out - .55) / .45)})`; ctx.fillRect(0, 0, w, h) }
}
