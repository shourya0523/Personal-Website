// The soundscape, generated in the browser with the Web Audio API: no audio files, nothing
// fetched. Off until the visitor turns it on (browsers require a click anyway). Beds follow the
// same scene state as the stage, so every sound rises and falls with scroll; one-shots fire on
// clicks and on moments in the show.

const clamp01 = v => Math.min(1, Math.max(0, v))

export class Sound {
  constructor() {
    this.ctx = null
    this.on = false
    this.prev = null
    this.thinking = false
    this.tickTimer = 0
    this.creakTimer = 2
  }

  /** Turn sound on or off. The graph is built on first use, inside the click that enables it. */
  async toggle() {
    if (!this.ctx) this.build()
    this.on = !this.on
    if (this.on) await this.ctx.resume()
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setTargetAtTime(this.on ? 0.9 : 0, now, 0.15)
    if (!this.on) setTimeout(() => { if (!this.on) this.ctx.suspend() }, 600)
    return this.on
  }

  build() {
    const ctx = this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    this.master = ctx.createGain(); this.master.gain.value = 0
    const comp = ctx.createDynamicsCompressor()
    this.master.connect(comp); comp.connect(ctx.destination)

    // Two seconds of white noise, reused by every noisy sound.
    const len = ctx.sampleRate * 2
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = this.noise.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1

    // Room tone: deep filtered noise, an auditorium breathing.
    this.room = this.bed(this.noiseSource(), [['lowpass', 380, 0.7]])
    // The warm room under the stage: a low sine that comes in with the trapdoor.
    this.warm = this.bed(this.osc('sine', 110), [['lowpass', 400, 0.5]])
    // The eye's drone: two detuned saws, filtered, with a slow pulse.
    const droneMix = ctx.createGain()
    this.osc('sawtooth', 55).connect(droneMix); this.osc('sawtooth', 55.6).connect(droneMix); this.osc('sine', 82.5).connect(droneMix)
    const pulse = ctx.createGain(); pulse.gain.value = 0.75
    const lfo = this.osc('sine', 0.7); const lfoAmt = ctx.createGain(); lfoAmt.gain.value = 0.25
    lfo.connect(lfoAmt); lfoAmt.connect(pulse.gain)
    droneMix.connect(pulse)
    this.drone = this.bed(pulse, [['lowpass', 260, 1.2]])
    // Curtain velvet: band-passed noise whose level follows how fast the curtain is moving.
    this.swoosh = this.bed(this.noiseSource(), [['bandpass', 700, 0.6]])
    // Thermal printer: noise chopped by a fast square wave, level follows the paper coming out.
    const chopped = ctx.createGain(); chopped.gain.value = 0
    this.noiseSource().connect(chopped)
    const chop = this.osc('square', 28); const chopAmt = ctx.createGain(); chopAmt.gain.value = 0.5
    chop.connect(chopAmt); chopAmt.connect(chopped.gain)
    this.printer = this.bed(chopped, [['bandpass', 3200, 2]])
  }

  noiseSource() {
    const src = this.ctx.createBufferSource()
    src.buffer = this.noise; src.loop = true; src.loopStart = Math.random(); src.start()
    return src
  }

  osc(type, freq) {
    const o = this.ctx.createOscillator()
    o.type = type; o.frequency.value = freq; o.start()
    return o
  }

  /** A continuous source through a filter chain into its own gain (starting silent). */
  bed(source, filters) {
    let node = source
    const chain = []
    for (const [type, freq, q] of filters) {
      const f = this.ctx.createBiquadFilter()
      f.type = type; f.frequency.value = freq; f.Q.value = q
      node.connect(f); node = f; chain.push(f)
    }
    const g = this.ctx.createGain(); g.gain.value = 0
    node.connect(g); g.connect(this.master)
    return { gain: g, filters: chain }
  }

  set(bed, value, t = 0.12) { bed.gain.gain.setTargetAtTime(value, this.ctx.currentTime, t) }

  // ------------------------------------------------------------ one-shots
  /** A short enveloped tone. */
  tone(type, f0, f1, dur, vol, at = 0) {
    const ctx = this.ctx, t = ctx.currentTime + at
    const o = ctx.createOscillator(), g = ctx.createGain()
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur)
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.05)
  }

  /** A short filtered noise burst. */
  burst(type, freq, q, dur, vol, at = 0) {
    const ctx = this.ctx, t = ctx.currentTime + at
    const src = ctx.createBufferSource(); src.buffer = this.noise
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(f); f.connect(g); g.connect(this.master); src.start(t, Math.random()); src.stop(t + dur + 0.05)
  }

  play(name) {
    if (!this.on) return
    switch (name) {
      case 'blip': this.tone('sine', 1180, 760, 0.18, 0.05); break
      case 'thunk': this.tone('sine', 120, 55, 0.35, 0.35); this.burst('lowpass', 500, 1, 0.08, 0.15); break
      case 'click': this.burst('highpass', 3000, 1, 0.025, 0.4); this.tone('square', 2200, 1800, 0.03, 0.06); this.tone('sine', 300, 180, 0.08, 0.12, 0.01); break
      case 'clunk': this.tone('sine', 70, 40, 0.5, 0.45); this.burst('lowpass', 900, 1, 0.12, 0.25); this.tone('triangle', 420, 400, 0.6, 0.03, 0.02); break
      case 'creak': {
        const ctx = this.ctx, t = ctx.currentTime, dur = 0.9 + Math.random() * 0.6
        const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain()
        o.type = 'sawtooth'; o.frequency.setValueAtTime(95 + Math.random() * 40, t); o.frequency.linearRampToValueAtTime(70 + Math.random() * 20, t + dur)
        f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 8
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.15); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
        o.connect(f); f.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.05)
        break
      }
      case 'drop': this.play('creak'); this.tone('sine', 90, 35, 0.7, 0.5, 0.5); this.burst('lowpass', 300, 1, 0.3, 0.3, 0.5); break
      case 'tick': this.burst('bandpass', 4200, 6, 0.012, 0.08); break
    }
  }

  setThinking(on) { this.thinking = on }

  // ------------------------------------------------------------ per frame
  /** Follow the scene: s is the same state object the stage renders from. */
  update(s, dt, reduced) {
    if (!this.on || !this.ctx) { this.prev = { ...s, forces: [...s.forces] }; return }
    const bedScale = reduced ? 0.5 : 1
    const p = this.prev ?? s
    const lightsDown = 1 - s.house

    this.set(this.room, (0.05 + 0.07 * lightsDown) * bedScale, 0.4)
    // The room opens up (brighter) as the house lights come back on, and closes in under the stage.
    this.room.filters[0].frequency.setTargetAtTime(380 + 900 * s.house - 200 * s.trapdoor, this.ctx.currentTime, 0.5)
    this.set(this.warm, 0.05 * s.trapdoor * bedScale, 0.4)
    this.set(this.drone, 0.11 * clamp01((s.eyeOpen - 0.1) / 0.9) * lightsDown * (1 - s.trapdoor * 0.7) * bedScale, 0.3)
    this.set(this.swoosh, Math.min(0.5, Math.abs(s.curtain - p.curtain) / Math.max(dt, 0.001) * 0.35), 0.06)
    this.set(this.printer, Math.min(0.35, Math.abs(s.print - p.print) / Math.max(dt, 0.001) * 0.6), 0.05)

    // Spotlights clunk on as each force lights up; the trapdoor creaks and drops.
    s.forces.forEach((f, i) => { if (f > 0.5 && p.forces[i] <= 0.5) this.play('clunk') })
    if (s.trapdoor > 0.3 && p.trapdoor <= 0.3) this.play('drop')

    // Rigging creaks now and then while the chats rise into the flies.
    if (s.bubbles > 0.3) {
      this.creakTimer -= dt
      if (this.creakTimer <= 0) { this.play('creak'); this.creakTimer = 1.8 + Math.random() * 2.5 }
    }

    // The local model ticks while it thinks.
    if (this.thinking) {
      this.tickTimer -= dt
      if (this.tickTimer <= 0) { this.play('tick'); this.tickTimer = 0.11 + Math.random() * 0.08 }
    }

    this.prev = { ...s, forces: [...s.forces] }
  }
}
