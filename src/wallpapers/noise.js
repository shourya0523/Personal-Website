// Deterministic PRNG and value noise shared by all scenes.
export function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 } }
export function noise2(seed) {
  const r = rng(seed); const N = 256; const g = new Float32Array(N * N); for (let i = 0; i < g.length; i++) g[i] = r()
  const f = t => t * t * (3 - 2 * t)
  return (x, y) => {
    const xi = Math.floor(x) & (N - 1), yi = Math.floor(y) & (N - 1), xf = x - Math.floor(x), yf = y - Math.floor(y)
    const a = g[yi * N + xi], b = g[yi * N + ((xi + 1) & (N - 1))], c = g[((yi + 1) & (N - 1)) * N + xi], d = g[((yi + 1) & (N - 1)) * N + ((xi + 1) & (N - 1))]
    const u = f(xf), v = f(yf); return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v
  }
}
/** Fractal noise on a rotated domain (rotation kills lattice-aligned artifacts). */
export function fbm(n, octaves = 4) {
  const c = Math.cos(.61), s = Math.sin(.61)
  return (x, y, o = octaves) => { const rx = x * c - y * s + 37.3, ry = x * s + y * c + 11.7; let sum = 0, a = .5, f = 1; for (let i = 0; i < o; i++) { sum += a * n(rx * f, ry * f); a *= .5; f *= 2 } return sum }
}
export const ease = { out: t => 1 - Math.pow(1 - t, 3), inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, clamp: t => Math.max(0, Math.min(1, t)) }
export function grainTile(seed, size = 256, amount = 22) {
  const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d'); const img = x.createImageData(size, size); const d = img.data; const r = rng(seed)
  for (let i = 0; i < d.length; i += 4) { const v = 128 + (r() - .5) * amount * 2; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255 }
  x.putImageData(img, 0, 0); return c
}
export function vignetteLayer(w, h, strength = .45) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d')
  const g = x.createRadialGradient(w * .5, h * .5, h * .3, w * .5, h * .5, h * 1.05); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${strength})`); x.fillStyle = g; x.fillRect(0, 0, w, h); return c
}
export function layer(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')] }
