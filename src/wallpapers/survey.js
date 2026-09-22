// Survey: a topographic map of an invented range. Contours draw in on intro; the cursor is a survey lamp; clicks plant flags.
import { rng, noise2, fbm, ease, grainTile, vignetteLayer, layer } from './noise'

export const id = 'survey'
export const seed = 3
export const label = 'Survey'

export function init(w, h, sd = seed) {
  const n = fbm(noise2(sd)); const r = rng(sd + 5)
  const cs = Math.max(4, Math.round(6 * w / 1600)), gw = Math.ceil(w / cs) + 1, gh = Math.ceil(h / cs) + 1; const H = new Float32Array(gw * gh)
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) { const x = i * cs, y = j * cs; H[j * gw + i] = n(x / 520, y / 520, 5) + .35 * n(x / 180 + 9, y / 180 + 9, 3) * (1 - Math.hypot((x - w * .6) / w, (y - h * .45) / h) * .9) }
  // marching squares per level -> flat segment arrays
  const levels = 34; const segs = []; const hotL = 26
  const lp = (p, q, iso) => (iso - p) / (q - p)
  const table = { 1: ['l', 't'], 2: ['t', 'r'], 3: ['l', 'r'], 4: ['r', 'b'], 5: ['l', 't', 'r', 'b'], 6: ['t', 'b'], 7: ['l', 'b'], 8: ['b', 'l'], 9: ['t', 'b'], 10: ['t', 'r', 'b', 'l'], 11: ['t', 'r'], 12: ['r', 'l'], 13: ['r', 'b'], 14: ['l', 't'] }
  for (let L = 0; L < levels; L++) {
    const iso = .35 + L * (.6 / levels); const out = []
    for (let j = 0; j < gh - 1; j++) for (let i = 0; i < gw - 1; i++) {
      const a = H[j * gw + i], b = H[j * gw + i + 1], c = H[(j + 1) * gw + i + 1], d = H[(j + 1) * gw + i]
      const idx = (a > iso) | ((b > iso) << 1) | ((c > iso) << 2) | ((d > iso) << 3); if (idx === 0 || idx === 15) continue
      const x = i * cs, y = j * cs; const pts = { t: [x + cs * lp(a, b, iso), y], r: [x + cs, y + cs * lp(b, c, iso)], b: [x + cs * lp(d, c, iso), y + cs], l: [x, y + cs * lp(a, d, iso)] }
      const sg = table[idx]; for (let k = 0; k < sg.length; k += 2) out.push(pts[sg[k]][0], pts[sg[k]][1], pts[sg[k + 1]][0], pts[sg[k + 1]][1])
    }
    segs.push(new Float32Array(out))
  }
  const stroke = (ctx, L, color, lw) => { const s = segs[L]; ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.beginPath(); for (let k = 0; k < s.length; k += 4) { ctx.moveTo(s[k], s[k + 1]); ctx.lineTo(s[k + 2], s[k + 3]) } ctx.stroke() }
  // base layer: ground, lakes, gold contours, spot heights
  const [base, b] = layer(w, h)
  b.fillStyle = '#0c1216'; b.fillRect(0, 0, w, h); const bg = b.createRadialGradient(w * .3, h * .7, 0, w * .3, h * .7, w * .8); bg.addColorStop(0, '#14262c'); bg.addColorStop(1, '#0b1014'); b.fillStyle = bg; b.fillRect(0, 0, w, h)
  { const [off, o] = layer(w, h); o.fillStyle = 'rgba(30,90,96,.45)'; for (let j = 0; j < gh - 1; j++) for (let i = 0; i < gw - 1; i++) if (H[j * gw + i] < .42) o.fillRect(i * cs, j * cs, cs, cs); b.save(); b.filter = 'blur(5px)'; b.drawImage(off, 0, 0); b.restore() }
  for (let L = 0; L < levels; L++) { if (L === hotL) continue; stroke(b, L, `rgba(226,196,140,${.14 + .4 * (L / levels)})`, L % 5 === 0 ? 1.1 : .6) }
  b.save(); b.shadowColor = 'rgba(244,170,96,.9)'; b.shadowBlur = 18; stroke(b, hotL, 'rgba(244,170,96,.95)', 2.2); b.restore()
  const marks = []; b.font = `${Math.round(11 * w / 1600)}px Sono, ui-monospace, monospace`
  for (let k = 0; k < 26; k++) { const x = r() * w, y = r() * h; b.fillStyle = 'rgba(226,196,140,.8)'; b.beginPath(); b.arc(x, y, 1.4, 0, 7); b.fill(); if (r() < .3) { b.fillStyle = 'rgba(226,196,140,.55)'; b.fillText((1200 + Math.floor(r() * 900)) + ' m', x + 6, y - 4) } marks.push([x, y]) }
  // hot layer: every contour in apricot (revealed by lamp and pulses)
  const [hot, ho] = layer(w, h); ho.save(); ho.shadowColor = 'rgba(244,170,96,.7)'; ho.shadowBlur = 10
  for (let L = 0; L < levels; L++) stroke(ho, L, 'rgba(244,190,120,.9)', L % 5 === 0 ? 1.4 : .9); ho.restore()
  const [mask, mk] = layer(w, h)
  // where the hot ridge sits (for the intro sweep origin)
  const hs = segs[hotL]; let ox = w * .45, oy = h * .35; if (hs.length) { ox = hs[0]; oy = hs[1] }
  return { H, gw, gh, cs, base, hot, mask, mk, origin: [ox, oy], flags: [], grain: grainTile(sd, 256, 16), vig: vignetteLayer(w, h, .4), fontPx: Math.round(11 * w / 1600) }
}

function lampPass(ctx, S, w, h, draw) {
  const { mask, mk } = S; mk.clearRect(0, 0, w, h); mk.drawImage(S.hot, 0, 0); mk.globalCompositeOperation = 'destination-in'; draw(mk); mk.globalCompositeOperation = 'source-over'; ctx.drawImage(mask, 0, 0)
}

export function frame(ctx, w, h, sh, S) {
  const it = sh.intro.active ? ease.clamp((sh.t - sh.intro.t0) / sh.intro.dur) : 1
  ctx.fillStyle = '#0c1216'; ctx.fillRect(0, 0, w, h)
  if (it < 1) { // radar sweep from the hot ridge
    const R = Math.hypot(w, h) * ease.out(it); ctx.save(); ctx.beginPath(); ctx.arc(S.origin[0], S.origin[1], R, 0, 7); ctx.clip(); ctx.drawImage(S.base, 0, 0); ctx.restore()
    lampPass(ctx, S, w, h, mk => { const g = mk.createRadialGradient(S.origin[0], S.origin[1], Math.max(0, R - 160), S.origin[0], S.origin[1], R); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.7, 'rgba(0,0,0,.9)'); g.addColorStop(1, 'rgba(0,0,0,0)'); mk.fillStyle = g; mk.fillRect(0, 0, w, h) })
  } else ctx.drawImage(S.base, 0, 0)
  // lamp at the pointer + pulse rings + ripples (drag wakes)
  const rings = []
  if (sh.pointer.inside) rings.push({ x: sh.pointer.x, y: sh.pointer.y, r0: 0, r1: 220 * w / 1600, a: .9, soft: true })
  for (const p of sh.pulses) { const age = sh.t - p.t0; if (age < 2.4) { const R = age * 520 * w / 1600; rings.push({ x: p.x, y: p.y, r0: Math.max(0, R - 90), r1: R, a: .95 * Math.exp(-age * 1.1) }) } }
  for (const rp of sh.ripples) { const age = sh.t - rp.t0; if (age < 1.2) { const R = age * 260 * w / 1600; rings.push({ x: rp.x, y: rp.y, r0: Math.max(0, R - 40), r1: R + 10, a: .7 * rp.a * Math.exp(-age * 2) }) } }
  if (rings.length) lampPass(ctx, S, w, h, mk => { for (const g0 of rings) { const g = mk.createRadialGradient(g0.x, g0.y, g0.r0, g0.x, g0.y, g0.r1); if (g0.soft) { g.addColorStop(0, `rgba(0,0,0,${g0.a})`); g.addColorStop(1, 'rgba(0,0,0,0)') } else { g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.6, `rgba(0,0,0,${g0.a})`); g.addColorStop(1, 'rgba(0,0,0,0)') } mk.fillStyle = g; mk.fillRect(g0.x - g0.r1, g0.y - g0.r1, g0.r1 * 2, g0.r1 * 2) } })
  // planted flags
  ctx.font = `500 ${S.fontPx}px Sono, ui-monospace, monospace`
  for (const f of S.flags) { const age = sh.t - f.t0; const up = ease.out(ease.clamp(age / .5)); const hgt = 26 * up; ctx.strokeStyle = 'rgba(244,190,120,.95)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x, f.y - hgt); ctx.stroke(); ctx.fillStyle = '#f4aa60'; ctx.beginPath(); ctx.moveTo(f.x, f.y - hgt); ctx.lineTo(f.x + 14 * up, f.y - hgt + 5); ctx.lineTo(f.x, f.y - hgt + 10); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(233,223,201,.85)'; ctx.fillText(f.label, f.x + 8, f.y + 12); ctx.fillStyle = 'rgba(244,190,120,.9)'; ctx.beginPath(); ctx.arc(f.x, f.y, 2, 0, 7); ctx.fill() }
  ctx.globalAlpha = .14; ctx.globalCompositeOperation = 'overlay'; ctx.fillStyle = ctx.createPattern(S.grain, 'repeat'); ctx.fillRect(0, 0, w, h); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1
  ctx.drawImage(S.vig, 0, 0)
}

export function click(x, y, sh, S) {
  const i = Math.round(x / S.cs), j = Math.round(y / S.cs); const hgt = S.H[Math.min(S.gh - 1, j) * S.gw + Math.min(S.gw - 1, i)] || 0
  S.flags.push({ x, y, t0: sh.t, label: `${Math.round(900 + hgt * 1600)} m` }); if (S.flags.length > 12) S.flags.shift(); return null
}
