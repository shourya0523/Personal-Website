// Real liquid glass on every surface that is a direct child of the desktop root and carries data-glass:
// menu bar, dock, lock card, dropdown menus and windows. The library has no add/remove API, so the manager
// re-creates the instance (debounced) whenever those children change. Falls back to the CSS .glass material
// when WebGL or the library is unavailable, when the user turns effects off, or when the frame rate collapses.
export const GLASS_CONFIGS = {
  default: { refraction: .6, blurAmount: .3, edgeHighlight: .28, specular: .4, fresnel: 1, zRadius: 20, chromAberration: .4 },
  menubar: { cornerRadius: 0, zRadius: 12, refraction: .5, blurAmount: .4, specular: .3 },
  dock: { cornerRadius: 22, zRadius: 30, refraction: .8, blurAmount: .25, edgeHighlight: .4, specular: .6 },
  lock: { cornerRadius: 24, zRadius: 34, refraction: .7, blurAmount: .5, edgeHighlight: .35, specular: .5 },
  menu: { cornerRadius: 12, zRadius: 14, refraction: .5, blurAmount: .5, edgeHighlight: .3, specular: .35, shadowOpacity: .35, shadowSpread: 24, shadowOffsetY: 10 },
  window: { cornerRadius: 14, zRadius: 16, refraction: .3, blurAmount: .9, edgeHighlight: .2, specular: .22, fresnel: .6, chromAberration: .15, brightness: -.08, shadowOpacity: 0 },
}
export const CHROME_KINDS = new Set(['menubar', 'dock', 'lock', 'menu'])
/** Handle to the running manager so windows can nudge it (e.g. after a drag) without prop drilling. */
export const glassHandle = { current: null }
const zOf = el => parseInt(getComputedStyle(el).zIndex, 10) || 0
const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top

export class GlassManager {
  constructor(root, { kinds = null, onFps } = {}) {
    this.root = root; this.kinds = kinds; this.onFps = onFps; this.inst = null; this.lib = null; this.enabled = false; this.dead = false
    this._timer = 0; this._gen = 0; this.elements = []
    this._mo = new MutationObserver(muts => { if (muts.some(m => [...m.addedNodes, ...m.removedNodes].some(n => n.nodeType === 1 && n.dataset?.glass))) this.refresh() })
    this._mo.observe(root, { childList: true }); glassHandle.current = this
    this._fpsTimer = setInterval(() => { if (this.inst && this.onFps) this.onFps(this.inst.fps, this.elements.length) }, 1000)
  }
  setKinds(kinds) { this.kinds = kinds; this.refresh() }
  setEnabled(v) { this.enabled = !!v; this.refresh() }
  candidates() { return [...this.root.children].filter(el => el.dataset.glass && (!this.kinds || this.kinds.has(el.dataset.glass)) && el.dataset.glassOff !== 'true') }
  refresh() { clearTimeout(this._timer); this._timer = setTimeout(() => this._mount(), 60) }
  async _mount() {
    const gen = ++this._gen; this._teardown()
    if (!this.enabled || this.dead || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = this.candidates(); if (!els.length) return
    try {
      if (!this.lib) this.lib = await import('@ybouane/liquidglass')
      await document.fonts?.ready
      if (gen !== this._gen || this.dead) return
      els.forEach(el => { if (!el.dataset.config) el.dataset.config = JSON.stringify({ ...GLASS_CONFIGS.default, ...(GLASS_CONFIGS[el.dataset.glass] || {}) }); el.classList.add('glass--webgl') })
      const t0 = performance.now()
      const inst = await this.lib.LiquidGlass.init({ root: this.root, glassElements: els })
      if (gen !== this._gen || this.dead) { try { inst.destroy() } catch { /* noop */ } els.forEach(el => el.classList.remove('glass--webgl')); return }
      this.inst = inst; this.elements = els; this.lastInitMs = Math.round(performance.now() - t0); this._tameContentCaptures(inst)
    } catch (e) { console.warn('[glass] falling back to CSS', e); els.forEach(el => el.classList.remove('glass--webgl')) }
  }
  // The library re-rasterizes a glass element's whole subtree (html-to-image) whenever its content changes, so that glass
  // above it can refract the content. That is expensive for windows (every Terminal command, every list change), so:
  // skip it when nothing glass sits above the element, throttle it to once a second otherwise, and let touch() refresh
  // whatever was skipped once windows move or focus changes.
  _tameContentCaptures(inst) {
    const last = new Map(); const stale = this._stale = new Set(); const timers = new Map(); const orig = inst._captureGlassContent.bind(inst)
    const hasGlassAbove = el => { const r = el.getBoundingClientRect(), z = zOf(el); for (const o of inst.glassSet) { if (o === el || o.dataset.glass !== 'window' && o.dataset.glass !== 'menu' && !CHROME_KINDS.has(o.dataset.glass)) continue; if (o !== el && zOf(o) > z && overlaps(r, o.getBoundingClientRect())) return true } return false }
    inst._captureGlassContent = async (targets = null) => {
      if (!targets) return orig(null)
      const now = performance.now(); const go = new Set()
      for (const el of targets) {
        if (el.dataset.glass === 'window' && !hasGlassAbove(el)) { stale.add(el); continue }
        const t = last.get(el) || 0
        if (now - t < 1000) { stale.add(el); if (!timers.has(el)) timers.set(el, setTimeout(() => { timers.delete(el); inst._glassContentDirty?.add(el) }, 1000 - (now - t))); continue }
        last.set(el, now); stale.delete(el); go.add(el)
      }
      if (go.size) return orig(go)
    }
  }
  /** Re-capture content that was skipped while nothing overlapped it (call after window moves or focus changes). */
  touch() { if (!this.inst || !this._stale?.size) return; for (const el of this._stale) this.inst._glassContentDirty?.add(el); this._stale.clear() }
  _teardown() { if (this.inst) { try { this.inst.destroy() } catch { /* noop */ } this.inst = null } this.elements.forEach(el => el.classList.remove('glass--webgl')); this.elements = [] }
  changed(el) { try { this.inst?.markChanged(el) } catch { /* noop */ } }
  destroy() { this.dead = true; if (glassHandle.current === this) glassHandle.current = null; clearTimeout(this._timer); clearInterval(this._fpsTimer); this._mo.disconnect(); this._teardown() }
}

/** Per-element config helper: sets data-config and lets the library pick up the change. */
export function setGlassConfig(el, kind, overrides = {}) { if (!el) return; el.dataset.config = JSON.stringify({ ...GLASS_CONFIGS.default, ...(GLASS_CONFIGS[kind] || {}), ...overrides }) }
