import { describe, it, expect } from 'vitest'
import { rng, noise2, fbm, ease } from './noise'

describe('wallpaper noise', () => {
  it('is deterministic for a seed', () => {
    const a = rng(7), b = rng(7); expect([a(), a(), a()]).toEqual([b(), b(), b()])
    const n1 = fbm(noise2(3)), n2 = fbm(noise2(3)); expect(n1(1.5, 2.25)).toBeCloseTo(n2(1.5, 2.25), 12)
  })
  it('stays inside [0,1] and eases correctly', () => {
    const n = fbm(noise2(11)); for (let i = 0; i < 200; i++) { const v = n(i * .37, i * .91); expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(1) }
    expect(ease.out(0)).toBe(0); expect(ease.out(1)).toBe(1); expect(ease.clamp(2)).toBe(1); expect(ease.clamp(-1)).toBe(0)
  })
})
