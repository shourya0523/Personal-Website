import { createContext, useContext, useMemo } from 'react'

const SoundContext = createContext()

// Modern, subtle UI sound generator - water drops, soft chimes, ambient tones
class ModernSoundGenerator {
  constructor() {
    this.audioContext = null
    this.initAudioContext()
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      console.warn('Web Audio API not supported')
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

  // Create a soft water drop sound
  createWaterDrop(frequency = 800, duration = 0.15, volume = 0.2) {
    if (!this.audioContext) return

    this.ensureAudioContext()

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.3, this.audioContext.currentTime + duration)

      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration)
    } catch (e) {
      // Silently fail
    }
  }

  // Create a soft bell/chime sound
  createChime(frequency = 1000, duration = 0.2, volume = 0.18) {
    if (!this.audioContext) return

    this.ensureAudioContext()

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.7, this.audioContext.currentTime + duration)

      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration)
    } catch (e) {
      // Silently fail
    }
  }

  // Create a subtle whoosh sound
  createWhoosh(duration = 0.12, volume = 0.15) {
    if (!this.audioContext) return

    this.ensureAudioContext()

    try {
      const bufferSize = this.audioContext.sampleRate * duration
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
      const data = buffer.getChannelData(0)

      // Generate filtered noise for whoosh
      for (let i = 0; i < bufferSize; i++) {
        const progress = i / bufferSize
        data[i] = (Math.random() * 2 - 1) * (1 - progress) * volume
      }

      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()
      const filter = this.audioContext.createBiquadFilter()

      filter.type = 'lowpass'
      filter.frequency.value = 2000
      filter.Q.value = 1

      source.buffer = buffer
      source.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

      source.start(this.audioContext.currentTime)
      source.stop(this.audioContext.currentTime + duration)
    } catch (e) {
      // Silently fail
    }
  }

  // Create a soft tap/click sound
  createSoftTap(frequency = 1200, duration = 0.05, volume = 0.15) {
    if (!this.audioContext) return

    this.ensureAudioContext()

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)

      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration)
    } catch (e) {
      // Silently fail
    }
  }

  // Create a gentle ambient tone
  createAmbientTone(frequency = 600, duration = 0.18, volume = 0.16) {
    if (!this.audioContext) return

    this.ensureAudioContext()

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      oscillator.frequency.linearRampToValueAtTime(frequency * 1.2, this.audioContext.currentTime + duration * 0.5)
      oscillator.frequency.linearRampToValueAtTime(frequency, this.audioContext.currentTime + duration)

      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration)
    } catch (e) {
      // Silently fail
    }
  }

  // Sound methods
  click() {
    this.createSoftTap(1200, 0.05, 0.15)
  }

  open() {
    this.createWaterDrop(900, 0.18, 0.22)
  }

  close() {
    this.createWaterDrop(700, 0.15, 0.2)
  }

  hover() {
    this.createSoftTap(1400, 0.03, 0.1)
  }

  notification() {
    this.createChime(1100, 0.25, 0.2)
  }

  maximize() {
    this.createWhoosh(0.15, 0.18)
  }

  minimize() {
    this.createAmbientTone(500, 0.12, 0.16)
  }
}

const soundGenerator = new ModernSoundGenerator()

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
