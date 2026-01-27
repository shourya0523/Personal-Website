import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { SoundProvider, useSounds } from './SoundContext'

describe('SoundContext', () => {
  it('provides sound functions', () => {
    const wrapper = ({ children }) => <SoundProvider>{children}</SoundProvider>
    const { result } = renderHook(() => useSounds(), { wrapper })

    expect(result.current).toHaveProperty('click')
    expect(result.current).toHaveProperty('open')
    expect(result.current).toHaveProperty('close')
    expect(result.current).toHaveProperty('hover')
    expect(result.current).toHaveProperty('notification')
    expect(result.current).toHaveProperty('maximize')
    expect(result.current).toHaveProperty('minimize')
  })

  it('sound functions are callable', () => {
    const wrapper = ({ children }) => <SoundProvider>{children}</SoundProvider>
    const { result } = renderHook(() => useSounds(), { wrapper })

    expect(() => result.current.click()).not.toThrow()
    expect(() => result.current.open()).not.toThrow()
    expect(() => result.current.close()).not.toThrow()
    expect(() => result.current.hover()).not.toThrow()
  })
})
