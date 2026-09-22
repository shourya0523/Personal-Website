// Real liquid glass on the chrome (menu bar, dock, lock card). Falls back to the CSS .glass material when WebGL or the
// library is unavailable, or when the user turns effects off. Elements must be direct children of `root`.
export async function mountGlass(root, elements, configs = {}) {
  if (!root || !elements.length) return null
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  try {
    const { LiquidGlass } = await import('@ybouane/liquidglass')
    await document.fonts?.ready
    elements.forEach(el => { el.dataset.config = JSON.stringify({ ...(configs.default || {}), ...(configs[el.dataset.glass] || {}) }); el.classList.add('glass--webgl') })
    const inst = await LiquidGlass.init({ root, glassElements: elements })
    return { inst, destroy() { try { inst.destroy() } catch { /* noop */ } elements.forEach(el => el.classList.remove('glass--webgl')) }, changed(el) { try { inst.markChanged(el) } catch { /* noop */ } } }
  } catch (e) {
    console.warn('[glass] falling back to CSS', e); elements.forEach(el => el.classList.remove('glass--webgl')); return null
  }
}
export const GLASS_CONFIGS = {
  default: { refraction: .6, blurAmount: .3, edgeHighlight: .28, specular: .4, fresnel: 1, zRadius: 20 },
  menubar: { cornerRadius: 0, zRadius: 12, refraction: .5, blurAmount: .4, specular: .3 },
  dock: { cornerRadius: 22, zRadius: 30, refraction: .8, blurAmount: .25, edgeHighlight: .4, specular: .6 },
  lock: { cornerRadius: 24, zRadius: 34, refraction: .7, blurAmount: .5, edgeHighlight: .35, specular: .5 },
}
