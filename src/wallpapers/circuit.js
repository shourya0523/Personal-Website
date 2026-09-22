// Constellation Circuit: a star chart whose constellations are PCB traces named after projects.
// Traces route in on intro; nearby constellations brighten under the pointer; clicking one opens that project.
import { rng, noise2, fbm, ease, grainTile, vignetteLayer, layer } from './noise'

export const id = 'circuit'
export const seed = 11
export const label = 'Constellation Circuit'
// Ordered to match content/projects; the OS resolves these ids to real projects.
export const constellationIds = ['concord', 'simsai', 'insync', 'porkit', 'acm', 'm3', 'dicom', 'rubber-duck', 'spendr']
const names = ['CONCORD', 'SIMSAI', 'INSYNC', 'PORKIT', 'ACM', 'M3', 'DICOM', 'RUBBER DUCK', 'SPENDR']

export function init(w, h, sd = seed) {
  const r = rng(sd); const n = fbm(noise2(sd))
  const [sky, k] = layer(w, h); k.fillStyle = '#0a0f16'; k.fillRect(0, 0, w, h)
  for (let y = 0; y < h; y += 4) for (let x = 0; x < w; x += 4) { const v = n(x / 700, y / 700, 4); const band = Math.exp(-Math.pow((y - (h * .6 - (x - w / 2) * .28)) / (h * .2), 2)); const a = Math.max(0, v - .4) * 1.8 * band; if (a > .02) { k.fillStyle = `rgba(${70 + a * 140},${150 + a * 50},150,${a * .55})`; k.fillRect(x, y, 4, 4) } }
  const stars = []; for (let i = 0; i < 1600; i++) { const x = r() * w, y = r() * h, s = r(); k.fillStyle = `rgba(230,235,240,${.12 + s * .5})`; k.fillRect(x, y, s > .92 ? 2 : 1, s > .92 ? 2 : 1); if (s > .8) stars.push([x, y, r() * 6.28, .6 + r() * 1.4]) }
  const cons = []; const cells = []; for (let gy = 0; gy < 3; gy++) for (let gx = 0; gx < 3; gx++) cells.push([gx, gy])
  cells.forEach(([gx, gy], c) => {
    const cx = w * (gx + .5) / 3 + (r() - .5) * w * .12, cy = h * (gy + .5) / 3 + (r() - .5) * h * .12; const m = 3 + Math.floor(r() * 3); const pts = []
    for (let i = 0; i < m; i++) pts.push([cx + (r() - .5) * w * .2, cy + (r() - .5) * h * .24])
    const segs = []; let total = 0
    for (let i = 0; i < pts.length - 1; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1]; const dx = x2 - x1, dy = y2 - y1; const d = Math.min(Math.abs(dx), Math.abs(dy)); const mx = x2 - Math.sign(dx) * d, my = y1; const l1 = Math.abs(mx - x1), l2 = Math.hypot(x2 - mx, y2 - my); segs.push({ a: [x1, y1], b: [mx, my], c: [x2, y2], l1, l2, start: total }); total += l1 + l2 }
    const big = pts.map((_, i) => i === 0 || r() < .25)
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1])
    cons.push({ id: constellationIds[c], name: names[c], pts, segs, total, big, warm: c % 4 === 1, delay: r() * 1.4, bbox: [Math.min(...xs) - 40, Math.min(...ys) - 40, Math.max(...xs) + 40, Math.max(...ys) + 40], hover: 0 })
  })
  return { sky, stars, cons, grain: grainTile(sd, 256, 12), vig: vignetteLayer(w, h, .4), fontPx: Math.round(11 * w / 1600), s: w / 1600 }
}

function tracePath(ctx, c, prog) { // draw traces up to prog (0..1 of total length)
  const upto = prog * c.total; ctx.beginPath()
  for (const s of c.segs) { if (s.start > upto) break; const rem = upto - s.start; ctx.moveTo(s.a[0], s.a[1]); if (rem >= s.l1) { ctx.lineTo(s.b[0], s.b[1]); const f = Math.min(1, (rem - s.l1) / s.l2); ctx.lineTo(s.b[0] + (s.c[0] - s.b[0]) * f, s.b[1] + (s.c[1] - s.b[1]) * f) } else { const f = rem / s.l1; ctx.lineTo(s.a[0] + (s.b[0] - s.a[0]) * f, s.a[1] + (s.b[1] - s.a[1]) * f) } }
}

export function frame(ctx, w, h, sh, S) {
  const it = sh.intro.active ? ease.clamp((sh.t - sh.intro.t0) / sh.intro.dur) : 1
  ctx.drawImage(S.sky, 0, 0)
  // twinkle
  for (const st of S.stars) { const a = .35 + .35 * Math.sin(sh.t * st[3] + st[2]); ctx.fillStyle = `rgba(230,235,240,${a})`; ctx.fillRect(st[0], st[1], 1.5, 1.5) }
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; const s = S.s
  const px = sh.pointer.x, py = sh.pointer.y
  for (const c of S.cons) {
    const prog = ease.out(ease.clamp((it * 3.2 - c.delay) / 1.6))
    if (prog <= 0) continue
    const inside = sh.pointer.inside && px > c.bbox[0] && py > c.bbox[1] && px < c.bbox[2] && py < c.bbox[3]
    c.hover += ((inside ? 1 : 0) - c.hover) * Math.min(1, sh.dt * 8)
    let surge = 0; for (const p of sh.pulses) { const age = sh.t - p.t0; if (age < 1.6 && Math.hypot(p.x - (c.bbox[0] + c.bbox[2]) / 2, p.y - (c.bbox[1] + c.bbox[3]) / 2) < 520 * s) surge = Math.max(surge, 1 - age / 1.6) }
    const col = c.warm ? '244,170,96' : '126,214,196'; const lift = Math.max(c.hover, surge)
    ctx.strokeStyle = `rgba(${col},${.14 + lift * .25})`; ctx.lineWidth = (7 + lift * 6) * s; tracePath(ctx, c, prog); ctx.stroke()
    ctx.strokeStyle = `rgba(${col},${.7 + lift * .3})`; ctx.lineWidth = (1.8 + lift * .8) * s; tracePath(ctx, c, prog); ctx.stroke()
    if (surge > 0) { ctx.save(); ctx.setLineDash([40 * s, c.total]); ctx.lineDashOffset = -((1 - surge) * (c.total + 40 * s)); ctx.strokeStyle = `rgba(255,255,255,${.9 * surge})`; ctx.lineWidth = 2.6 * s; tracePath(ctx, c, prog); ctx.stroke(); ctx.restore() }
    c.pts.forEach(([x, y], i) => {
      const on = prog * c.total >= (c.segs[i - 1] ? c.segs[i - 1].start + c.segs[i - 1].l1 + c.segs[i - 1].l2 - 1 : 0)
      if (!on) return; const big = c.big[i]; const pulse = big ? .5 + .5 * Math.sin(sh.t * 1.8 + i) : 0
      ctx.fillStyle = `rgba(${col},1)`; ctx.beginPath(); ctx.arc(x, y, (big ? 5.5 : 3.2) * s, 0, 7); ctx.fill(); ctx.fillStyle = '#0a0f16'; ctx.beginPath(); ctx.arc(x, y, (big ? 2.4 : 1.3) * s, 0, 7); ctx.fill()
      if (big) { ctx.strokeStyle = `rgba(${col},${.5 + .5 * pulse + lift * .3})`; ctx.lineWidth = 1.5 * s; ctx.beginPath(); ctx.arc(x, y, (9 + pulse * 2 + lift * 4) * s, 0, 7); ctx.stroke() }
    })
    ctx.font = `500 ${S.fontPx}px Sono, ui-monospace, monospace`; ctx.fillStyle = `rgba(${col},${(.5 + lift * .5) * prog})`; ctx.fillText(c.name, c.pts[0][0] + 12 * s, c.pts[0][1] - 10 * s)
    if (c.hover > .5) { ctx.fillStyle = `rgba(${col},${(c.hover - .5) * 2 * .8})`; ctx.font = `400 ${S.fontPx}px Sono, ui-monospace, monospace`; ctx.fillText('open ↗', c.pts[0][0] + 12 * s, c.pts[0][1] + 16 * s) }
  }
  for (const p of sh.pulses) { const age = sh.t - p.t0; if (age > 1.6) continue; ctx.strokeStyle = `rgba(126,214,196,${.5 * (1 - age / 1.6)})`; ctx.lineWidth = 1.5 * s; ctx.beginPath(); ctx.arc(p.x, p.y, age * 380 * s, 0, 7); ctx.stroke() }
  ctx.globalAlpha = .12; ctx.globalCompositeOperation = 'overlay'; ctx.fillStyle = ctx.createPattern(S.grain, 'repeat'); ctx.fillRect(0, 0, w, h); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1
  ctx.drawImage(S.vig, 0, 0)
}

export function hit(x, y, sh, S) { const c = S.cons.find(c => x > c.bbox[0] && y > c.bbox[1] && x < c.bbox[2] && y < c.bbox[3]); return c ? { label: c.name, id: c.id } : null }
export function click(x, y, sh, S) { const c = hit(x, y, sh, S); return c ? { type: 'open-project', id: c.id, label: c.label } : null }
