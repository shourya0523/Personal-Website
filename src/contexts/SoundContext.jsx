import { createContext, useContext, useMemo } from 'react'

const SoundContext = createContext()

// Woodblock-esque sound generator - percussive, sharp attack, quick decay
class WoodblockSoundGenerator {
  constructor() {
    this.audioContext = null
    this.initAudioContext()
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      // Web Audio API not supported - graceful degradation
    }
  }

  ensureAudioContext() {
    if (!this.audioContext) {
      this.initAudioContext()
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  // Create a woodblock sound - percussive with sharp attack
  createWoodblock(frequency = 600, duration = 0.05, volume = 0.3) {
    if (!this.audioContext) return

    this.ensureAudioContext()

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      
      const now = this.audioContext.currentTime
      // Sharp attack, quick decay - woodblock characteristic
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.001) // Very sharp attack
      gainNode.gain.exponentialRampToValueAtTime(volume * 0.3, now + duration * 0.1) // Quick initial decay
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration) // Full decay

      oscillator.start(now)
      oscillator.stop(now + duration)
    } catch (e) {
      // Silently fail
    }
  }

  // Create a woodblock chime - two-tone woodblock pattern
  createWoodblockChime(frequency1 = 600, frequency2 = 800, duration = 0.08, volume = 0.25) {
    if (!this.audioContext) return

    this.ensureAudioContext()

    try {
      const now = this.audioContext.currentTime
      
      // First woodblock
      const osc1 = this.audioContext.createOscillator()
      const gain1 = this.audioContext.createGain()
      osc1.connect(gain1)
      gain1.connect(this.audioContext.destination)
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(frequency1, now)
      gain1.gain.setValueAtTime(0, now)
      gain1.gain.linearRampToValueAtTime(volume, now + 0.001)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + duration)
      osc1.start(now)
      osc1.stop(now + duration)
      
      // Second woodblock (slightly delayed)
      const osc2 = this.audioContext.createOscillator()
      const gain2 = this.audioContext.createGain()
      osc2.connect(gain2)
      gain2.connect(this.audioContext.destination)
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(frequency2, now + 0.05)
      gain2.gain.setValueAtTime(0, now + 0.05)
      gain2.gain.linearRampToValueAtTime(volume, now + 0.051)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.05 + duration)
      osc2.start(now + 0.05)
      osc2.stop(now + 0.05 + duration)
    } catch (e) {
      // Silently fail
    }
  }

  // Create a woodblock sequence - ascending or descending
  createWoodblockSequence(frequencies = [400, 500, 600], duration = 0.05, volume = 0.25, delay = 0.05) {
    if (!this.audioContext) return

    this.ensureAudioContext()

    try {
      const now = this.audioContext.currentTime
      frequencies.forEach((freq, index) => {
        const osc = this.audioContext.createOscillator()
        const gain = this.audioContext.createGain()
        osc.connect(gain)
        gain.connect(this.audioContext.destination)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + index * delay)
        gain.gain.setValueAtTime(0, now + index * delay)
        gain.gain.linearRampToValueAtTime(volume, now + index * delay + 0.001)
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * delay + duration)
        osc.start(now + index * delay)
        osc.stop(now + index * delay + duration)
      })
    } catch (e) {
      // Silently fail
    }
  }

  // Create a light woodblock tap
  createLightWoodblock(frequency = 700, duration = 0.03, volume = 0.15) {
    if (!this.audioContext) return

    this.ensureAudioContext()

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      
      const now = this.audioContext.currentTime
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.001)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration)

      oscillator.start(now)
      oscillator.stop(now + duration)
    } catch (e) {
      // Silently fail
    }
  }


  // Sound methods - woodblock-esque sounds
  click() {
    // Short, sharp woodblock tap
    this.createWoodblock(600, 0.03, 0.25)
    this.createWoodblock(400, 0.02, 0.15)
  }

  open() {
    // Higher woodblock - opening sound
    this.createWoodblock(800, 0.05, 0.3)
    this.createWoodblock(500, 0.04, 0.2)
    this.createWoodblock(300, 0.03, 0.15)
  }

  close() {
    // Lower woodblock - closing sound
    this.createWoodblock(500, 0.05, 0.3)
    this.createWoodblock(350, 0.04, 0.2)
    this.createWoodblock(200, 0.03, 0.15)
  }

  hover() {
    // Very light woodblock tap
    this.createLightWoodblock(700, 0.02, 0.12)
  }

  notification() {
    // Two-tone woodblock chime
    this.createWoodblockChime(600, 800, 0.06, 0.25)
  }

  maximize() {
    // Ascending woodblock sequence
    this.createWoodblockSequence([400, 500, 600], 0.04, 0.22, 0.05)
  }

  minimize() {
    // Descending woodblock sequence
    this.createWoodblockSequence([600, 500, 400], 0.04, 0.22, 0.05)
  }
}

const soundGenerator = new WoodblockSoundGenerator()

export function SoundProvider({ children }) {
  const sounds = useMemo(() => ({
    click: () => soundGenerator.click(),
    open: () => soundGenerator.open(),
    close: () => soundGenerator.close(),
    hover: () => soundGenerator.hover(),
    notification: () => soundGenerator.notification(),
    maximize: () => soundGenerator.maximize(),
    minimize: () => soundGenerator.minimize()
  }), [])

  return (
    <SoundContext.Provider value={sounds}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSounds() {
  const context = useContext(SoundContext)
  if (!context) {
    return {
      click: () => soundGenerator.click(),
      open: () => soundGenerator.open(),
      close: () => soundGenerator.close(),
      hover: () => soundGenerator.hover(),
      notification: () => soundGenerator.notification(),
      maximize: () => soundGenerator.maximize(),
      minimize: () => soundGenerator.minimize()
    }
  }
  return context
}
