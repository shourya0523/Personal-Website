import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { OSProvider, useOS } from './OSContext'

const wrapper = ({ children }) => <OSProvider>{children}</OSProvider>

describe('OSContext', () => {
  it('opens one window per app and focuses it on reopen', () => {
    const { result } = renderHook(() => useOS(), { wrapper })
    act(() => result.current.openApp('about'))
    act(() => result.current.openApp('resume'))
    expect(result.current.windows).toHaveLength(2)
    const resumeId = result.current.windows.find(w => w.appId === 'resume').id
    const aboutId = result.current.windows.find(w => w.appId === 'about').id
    act(() => result.current.openApp('about'))
    expect(result.current.windows).toHaveLength(2)
    expect(result.current.focusId).toBe(aboutId)
    expect(result.current.windows.find(w => w.id === aboutId).z).toBeGreaterThan(result.current.windows.find(w => w.id === resumeId).z)
  })
  it('minimize, close and stage mode', () => {
    const { result } = renderHook(() => useOS(), { wrapper })
    act(() => result.current.openApp('files'))
    const id = result.current.windows[0].id
    act(() => result.current.minimizeWindow(id))
    expect(result.current.windows[0].minimized).toBe(true)
    act(() => result.current.setStage(true))
    expect(result.current.stage).toBe(true)
    act(() => result.current.openApp('files'))
    expect(result.current.stage).toBe(false)
    expect(result.current.windows[0].minimized).toBe(false)
    act(() => result.current.closeWindow(id))
    expect(result.current.windows).toHaveLength(0)
    expect(result.current.focusId).toBeNull()
  })
  it('wallpaper choice is reflected on the document', () => {
    const { result } = renderHook(() => useOS(), { wrapper })
    act(() => result.current.setWallpaper('survey'))
    expect(document.documentElement.dataset.wallpaper).toBe('survey')
  })
})
