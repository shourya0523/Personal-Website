// Moonrise Swell: a woodblock sea at dusk. Moon rises on intro; swells drift; ripples answer clicks, drags and app opens.
import { rng, noise2, fbm, ease, grainTile, vignetteLayer, layer } from './noise'

export const id = 'swell'
export const seed = 7
export const label = 'Moonrise Swell'

export function init(w, h, sd = seed) {
  const n = fbm(noise2(sd)); const r = rng(sd + 1)
  const hz = h * .46, sx = w * .68, sr = h * .15
  // sky + haze (static)
  const [sky, k] = layer(w, h)
  const g = k.createLinearGradient(0, 0, 0, hz); g.addColorStop(0, '#0e1a20'); g.addColorStop(.7, '#1a3138'); g.addColorStop(1, '#4a4a3e'); k.fillStyle = g; k.fillRect(0, 0, w, hz + 2)
  const hg = k.createLinearGradient(0, hz * .55, 0, hz); hg.addColorStop(0, 'rgba(240,160,100,0)'); hg.addColorStop(1, 'rgba(240,160,100,.35)'); k.fillStyle = hg; k.fillRect(0, 0, w, hz + 2)
  k.fillStyle = '#0f2a2c'; k.fillRect(0, hz, w, h - hz) // below the horizon, so ripples never expose sky
  // moon sprite (cream disc, apricot misregistered rim, halftone texture), plus its halo dots as a separate sprite
  const pad = 14, ms = Math.ceil(sr * 2 + pad * 2); const [moon, m] = layer(ms, ms); const c = ms / 2
  m.fillStyle = '#e9a06a'; m.beginPath(); m.arc(c + 7, c + 4, sr, 0, 7); m.fill()
  m.fillStyle = '#f4dcb2'; m.beginPath(); m.arc(c, c, sr, 0, 7); m.fill()
  m.save(); m.beginPath(); m.arc(c, c, sr, 0, 7); m.clip(); m.fillStyle = 'rgba(214,150,96,.5)'
  for (let y = 0; y < ms; y += 7) for (let x = 0; x < ms; x += 7) { const v = n(x / 90, y / 90, 3); if (v > .5) { m.beginPath(); m.arc(x, y, (v - .5) * 6, 0, 7); m.fill() } }
  m.restore()
  const [halo, hl] = layer(w, h)
  for (let y = 6; y < hz; y += 8) for (let x = 6; x < w; x += 8) { const d = Math.hypot(x - sx, y - (hz - h * .02)) / sr; const v = Math.max(0, 1.15 - d * .42); if (v > 0) { hl.fillStyle = 'rgba(244,190,120,.22)'; hl.beginPath(); hl.arc(x, y, v * 2.6, 0, 7); hl.fill() } }
  // swell definitions
  const swells = []; const N = 9
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1); const base = hz + Math.pow(t, 1.5) * (h - hz) * 1.02; const amp = 8 + t * 46
    const step = 26 + t * 30; const scallops = []; for (let x = step * r(); x < w + step; x += step) scallops.push([x, r() < .5])
    swells.push({ t, base, amp, f: 1.2 + t * .9, ph: i * 2.1, speed: .25 + t * .35, L: 34 - t * 24, S: 48 + t * 10, H: 174 + t * 14, step, scallops, i })
  }
  const dashes = []; for (let y = hz + 6; y < h; y += 9 + (y - hz) * .03) if (r() < .8) dashes.push({ y, len: w * .02 + (y - hz) * .06, a: .55 - (y - hz) / h * .4, lw: 2 + (y - hz) * .004 })
  return { n, hz, sx, sr, sky, moon, halo, ms, swells, dashes, grain: grainTile(sd), vig: vignetteLayer(w, h, .42), pts: new Float32Array(Math.ceil(w / 5) + 2), rippleR: 60 * (w / 1600) }
}

function rippleDisp(x, y, sh, S) {
  let d = 0
  for (const rp of sh.ripples) { const age = sh.t - rp.t0; const dist = Math.hypot(x - rp.x, (y - rp.y) * 2.2); const front = age * 420 * (S.rippleR / 60); const dd = dist - front; d += Math.sin(dd * .05) * Math.exp(-dd * dd / 9000) * Math.exp(-age * .9) * 26 * rp.a * (S.rippleR / 60) }
  return d
}

export function frame(ctx, w, h, sh, S) {
  const { n, hz, sx, sr, swells } = S
  const it = sh.intro.active ? ease.clamp((sh.t - sh.intro.t0) / sh.intro.dur) : 1
  const rise = ease.out(ease.clamp(it * 1.25)); const settle = ease.out(ease.clamp((it - .15) / .85))
  ctx.drawImage(S.sky, 0, 0)
  // moon rises from below the horizon; halo fades in
  ctx.globalAlpha = rise; ctx.drawImage(S.halo, 0, 0); ctx.globalAlpha = 1
  const my = hz - h * .02 + (1 - rise) * sr * 2.3
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, hz + 1); ctx.clip(); ctx.drawImage(S.moon, sx - S.ms / 2, my - S.ms / 2); ctx.restore()
  // sea
  const pts = S.pts; const step = 5; const amp0 = .15 + .85 * settle; const drift = sh.t
  const px = sh.pointer.inside ? sh.pointer.x : sx
  for (const s of swells) {
    const ampl = s.amp * amp0
    for (let i = 0, x = 0; x <= w + step; x += step, i++) {
      pts[i] = s.base + Math.sin(x / w * Math.PI * 2 * s.f + s.ph + drift * s.speed) * ampl * (.7 + .3 * n(x / 500 + drift * .02, s.i)) + (n(x / 160, s.i * 5 + drift * .05) - .5) * ampl * .6 + rippleDisp(x, s.base, sh, S)
    }
    const yAt = x => pts[Math.max(0, Math.min(pts.length - 1, Math.round(x / step)))]
    ctx.beginPath(); ctx.moveTo(0, h); for (let i = 0, x = 0; x <= w + step; x += step, i++) ctx.lineTo(x, pts[i] - 3); ctx.lineTo(w, h); ctx.closePath(); ctx.fillStyle = `rgba(232,150,96,${.9 - s.t * .5})`; ctx.fill()
    ctx.beginPath(); ctx.moveTo(0, h); for (let i = 0, x = 0; x <= w + step; x += step, i++) ctx.lineTo(x, pts[i]); ctx.lineTo(w, h); ctx.closePath(); ctx.fillStyle = `hsl(${s.H},${s.S}%,${s.L}%)`; ctx.fill()
    ctx.lineCap = 'round'; const rad = s.step * .42
    for (const [x, dark] of s.scallops) {
      const near = 1 - Math.min(1, Math.abs(x - px) / (w * .5)); const cy = yAt(x + rad) + rad * .9
      ctx.strokeStyle = `rgba(248,214,160,${.35 + near * .45})`; ctx.lineWidth = 1.2 + s.t * 1.4; ctx.beginPath(); ctx.arc(x + rad, cy, rad, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke()
      if (dark) { ctx.strokeStyle = `hsl(${s.H},${s.S}%,${Math.max(6, s.L - 12)}%)`; ctx.lineWidth = 1 + s.t; ctx.beginPath(); ctx.arc(x + rad, cy + 3, rad * .7, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke() }
    }
  }
  // moon path: broken dashes that lean toward the pointer and glow after pulses
  const lean = sh.pointer.inside ? (sh.pointer.x - sx) * .12 : 0
  let glow = 0; for (const p of sh.pulses) glow = Math.max(glow, Math.exp(-(sh.t - p.t0) * 1.6))
  for (const d of S.dashes) { const wob = (n(d.y / 50, 3 + drift * .1) - .5) * w * .06 + lean * ((d.y - hz) / (h - hz)); ctx.strokeStyle = `rgba(250,220,170,${Math.min(1, (d.a + glow * .35) * rise)})`; ctx.lineWidth = d.lw; ctx.beginPath(); ctx.moveTo(sx + wob - d.len / 2, d.y); ctx.lineTo(sx + wob + d.len / 2, d.y); ctx.stroke() }
  // pulse rings on the water
  for (const p of sh.pulses) { const age = sh.t - p.t0; if (age > 2.2) continue; const rr = age * 420 * (S.rippleR / 60); ctx.strokeStyle = `rgba(250,220,170,${.5 * Math.exp(-age * 1.4)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(p.x, p.y, rr, rr * .42, 0, 0, 7); ctx.stroke() }
  // print grain + vignette
  ctx.globalAlpha = .18; ctx.globalCompositeOperation = 'overlay'; ctx.fillStyle = ctx.createPattern(S.grain, 'repeat'); ctx.fillRect(0, 0, w, h); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1
  ctx.drawImage(S.vig, 0, 0)
}
