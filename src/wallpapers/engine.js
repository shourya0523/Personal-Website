// WallpaperEngine: owns the canvas, the frame loop, and the shared interaction state every scene reads.
// Scenes are plain modules: { id, init(w,h,seed) -> state, frame(ctx,w,h,S), click?(x,y,S) -> action|null, hit?(x,y,S) -> label|null }
const MAX_W = 1920

export class WallpaperEngine {
  constructor(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d', { alpha: false })
    this.scene = null; this.S = null; this.raf = 0; this.running = false; this.last = 0
    this.slow = false; this.visible = true; this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    this.onAction = null
    this.shared = { t: 0, dt: 0, w: 0, h: 0, intro: { active: false, t0: 0, dur: 3.2 }, pointer: { x: -1e4, y: -1e4, inside: false }, ripples: [], pulses: [], marks: [], slow: false }
    this._ro = new ResizeObserver(() => this.resize()); this._ro.observe(canvas)
    this._vis = () => { this.visible = document.visibilityState === 'visible'; if (this.visible) this.start() }
    document.addEventListener('visibilitychange', this._vis)
  }
  destroy() { this.stop(); this._ro.disconnect(); document.removeEventListener('visibilitychange', this._vis) }
  // --- scene lifecycle
  setScene(scene, { intro = false } = {}) {
    this.scene = scene; this.resize(true)
    if (intro) this.intro()
    this.start()
  }
  resize(force = false) {
    const rect = this.canvas.getBoundingClientRect(); if (!rect.width) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5); let w = Math.round(rect.width * dpr), h = Math.round(rect.height * dpr)
    if (w > MAX_W) { h = Math.round(h * MAX_W / w); w = MAX_W }
    if (!force && w === this.canvas.width && h === this.canvas.height) return
    this.canvas.width = w; this.canvas.height = h; this.shared.w = w; this.shared.h = h; this.scale = w / rect.width
    if (this.scene) { this.S = this.scene.init(w, h, this.scene.seed ?? 7); this.shared.marks = []; this.frame(performance.now(), true) }
  }
  // --- loop
  start() { if (this.running || !this.scene) return; this.running = true; this.last = performance.now(); this.raf = requestAnimationFrame(this._tick = this._tick || (t => this.tick(t))) }
  stop() { this.running = false; cancelAnimationFrame(this.raf) }
  tick(now) {
    if (!this.running) return
    const minFrame = this.slow ? 1000 / 30 : 0
    if (now - this.last >= minFrame) this.frame(now)
    if (this.visible && !this.reduced) this.raf = requestAnimationFrame(this._tick); else this.running = false
  }
  frame(now, once = false) {
    const sh = this.shared; sh.dt = Math.min(.05, (now - this.last) / 1000); this.last = now; sh.t += sh.dt * (this.slow ? .5 : 1); sh.slow = this.slow
    if (sh.intro.active && sh.t - sh.intro.t0 > sh.intro.dur) sh.intro.active = false
    const cutoff = sh.t - 6; sh.ripples = sh.ripples.filter(r => r.t0 > cutoff); sh.pulses = sh.pulses.filter(p => p.t0 > cutoff)
    if (this.S) this.scene.frame(this.ctx, sh.w, sh.h, sh, this.S)
    if (once && this.reduced) this.running = false
  }
  // --- coordinates: CSS px -> canvas px
  toCanvas(x, y) { const r = this.canvas.getBoundingClientRect(); return [(x - r.left) * this.scale, (y - r.top) * this.scale] }
  // --- public interaction API (all in CSS/client px)
  intro() { const sh = this.shared; sh.intro = { active: true, t0: sh.t, dur: 3.2 }; this.start() }
  hover(x, y) { const [cx, cy] = this.toCanvas(x, y); this.shared.pointer = { x: cx, y: cy, inside: true }; this.start() }
  leave() { this.shared.pointer.inside = false }
  wake(x, y, strength = .35) { const [cx, cy] = this.toCanvas(x, y); const last = this.shared.ripples[this.shared.ripples.length - 1]; if (last && Math.hypot(last.x - cx, last.y - cy) < 28 * this.scale && this.shared.t - last.t0 < .12) return; this.shared.ripples.push({ x: cx, y: cy, t0: this.shared.t, a: strength }); this.start() }
  pulse(x, y, kind = 'open') { const [cx, cy] = this.toCanvas(x, y); this.shared.pulses.push({ x: cx, y: cy, t0: this.shared.t, kind }); this.shared.ripples.push({ x: cx, y: cy, t0: this.shared.t, a: 1 }); this.start() }
  click(x, y) { const [cx, cy] = this.toCanvas(x, y); const act = this.scene?.click ? this.scene.click(cx, cy, this.shared, this.S) : null; this.shared.ripples.push({ x: cx, y: cy, t0: this.shared.t, a: .8 }); this.start(); if (act && this.onAction) this.onAction(act); return act }
  hit(x, y) { const [cx, cy] = this.toCanvas(x, y); return this.scene?.hit ? this.scene.hit(cx, cy, this.shared, this.S) : null }
  setSlow(v) { this.slow = !!v }
}
