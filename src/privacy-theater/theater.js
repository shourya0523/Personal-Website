// The stage. Everything is built from code (no model files): a raked auditorium, a proscenium
// with velvet curtains, a cookie banner hung on the curtain, the HACK1984 iris behind it, a
// giant pre-switched toggle, a fly loft full of rising chats, an enterprise box, a receipt
// printer, and a workshop under a trapdoor. main.js drives it with scroll; this file only
// knows how to draw a given state.
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

// HACK1984 palette (brand guide).
export const C = {
  black: 0x000000, red: 0xff3b2f, glow: 0xff7a70, pale: 0xffd0ca, deep: 0xc01d13,
  dim: 0x7e130c, paper: 0xe9e1ce, ink: 0x1d1b19, white: 0xf2f2f2,
}
const FONT = { head: '"Funnel Display", system-ui, sans-serif', mono: '"Geist Mono", ui-monospace, monospace', type: '"Courier Prime", "Courier New", monospace', poster: 'Anton, Impact, sans-serif' }

// Layout, in metres. Stage top is y = 0, the proscenium opening is at z = 0, the house runs +z.
export const LAYOUT = {
  eye: new THREE.Vector3(0, 4.6, -5.5),
  toggle: new THREE.Vector3(-5.2, 1.5, -1.2),
  box: new THREE.Vector3(11.2, 5.4, 10),
  receipt: new THREE.Vector3(3.2, 0, 1.6),
  trapdoor: new THREE.Vector3(0, 0, -3.2),
  laptop: new THREE.Vector3(0, -3.9, -6.6),
  /** where the visitor sits: row 8, centre */
  seat(row = 8, x = 0) {
    const z = 4.5 + row * 1.35
    return new THREE.Vector3(x, houseFloor(z) + 1.15, z)
  },
}
function houseFloor(z) { return -1.4 + Math.max(0, z - 4) * 0.24 }

const clamp01 = v => Math.min(1, Math.max(0, v))
const smooth = v => { v = clamp01(v); return v * v * (3 - 2 * v) }

/** A canvas-backed texture, redrawn on demand. */
function canvasTexture(w, h, draw) {
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  const redraw = (...args) => { ctx.clearRect(0, 0, w, h); draw(ctx, w, h, ...args); tex.needsUpdate = true }
  redraw()
  return { tex, redraw, canvas }
}

function wrapText(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/), lines = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word } else line = test
  }
  if (line) lines.push(line)
  return lines
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath()
}

export class Theater {
  constructor(canvas, { lowPower = false } = {}) {
    this.canvas = canvas
    this.lowPower = lowPower
    this.timer = new THREE.Timer()
    this.pickables = []
    this.handlers = {}
    this.state = { stats: 0, eyeStat: 0, question: 0, curtain: 0, eyeOpen: 0.06, banner: 0, bubbles: 0, house: 0, trapdoor: 0, print: 0, forces: [0, 0, 0], loft: 0, box: 0, toggleOn: true, velocity: 0 }

    const renderer = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
    renderer.setClearColor(C.black, 1)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    this.dprCap = lowPower ? 1 : Math.min(window.devicePixelRatio, 1.5)
    this.dpr = this.dprCap

    const scene = this.scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x050101, 0.022)
    this.camera = new THREE.PerspectiveCamera(48, 1, 0.05, 200)

    this.buildLights()
    this.buildHouse()
    this.buildSeats()
    this.buildStage()
    this.buildCurtains()
    this.buildBanner()
    this.buildEye()
    this.buildSpots()
    this.buildToggle()
    this.buildLoft()
    this.buildBox()
    this.buildReceipt()
    this.buildWorkshop()
    this.buildClaimCards()
    this.buildLines()
    this.buildPost()

    this.raycaster = new THREE.Raycaster()
    this.pointer = new THREE.Vector2(0, 0)
    this.resize()
  }

  on(name, fn) { this.handlers[name] = fn }
  emit(name, ...args) { this.handlers[name]?.(...args) }

  // ---------------------------------------------------------------- lights
  buildLights() {
    this.hemi = new THREE.HemisphereLight(0x6b2a24, 0x050000, 0.18)
    this.scene.add(this.hemi)
    // Two front-of-house spots wash the curtain and the stage.
    const key = this.key = new THREE.SpotLight(0xffe0d6, 140, 60, 0.42, 0.6, 1.4)
    key.position.set(0, 13, 14); key.target.position.set(0, 3.5, -1)
    this.scene.add(key, key.target)
    const rim = this.rim = new THREE.SpotLight(C.red, 90, 40, 0.6, 0.8, 1.2)
    rim.position.set(0, 12, -9); rim.target.position.set(0, 3, 0)
    this.scene.add(rim, rim.target)
    // House lights, mostly off until the end.
    this.houseLights = []
    for (const [x, z] of [[-9, 10], [9, 10], [-9, 20], [9, 20], [0, 26]]) {
      const l = new THREE.PointLight(0xffc9a8, 0, 22, 1.6)
      l.position.set(x, houseFloor(z) + 7, z)
      this.scene.add(l); this.houseLights.push(l)
    }
  }

  // ---------------------------------------------------------------- the room
  buildHouse() {
    const wall = new THREE.MeshStandardMaterial({ color: 0x120404, roughness: 0.95, side: THREE.BackSide })
    const room = new THREE.Mesh(new THREE.BoxGeometry(34, 26, 52), wall)
    room.position.set(0, 9, 10)
    this.scene.add(room)
    // Raked house floor.
    const floorGeo = new THREE.PlaneGeometry(30, 30, 1, 30)
    floorGeo.rotateX(-Math.PI / 2)
    const pos = floorGeo.attributes.position
    for (let i = 0; i < pos.count; i++) { const z = pos.getZ(i) + 18; pos.setZ(i, z); pos.setY(i, houseFloor(z)) }
    floorGeo.computeVertexNormals()
    const floor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ color: 0x1a0605, roughness: 1 }))
    this.scene.add(floor)
    // Faint vertical panel seams on the back wall, as in the Iris look.
    const seams = new THREE.Group()
    for (let i = -8; i <= 8; i++) {
      const s = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 24), new THREE.MeshBasicMaterial({ color: 0x2a0b09 }))
      s.position.set(i * 2, 9, 35.9); s.rotation.y = Math.PI
      seams.add(s)
    }
    this.scene.add(seams)
    // Chandeliers that come up with the house lights.
    this.chandeliers = []
    for (const [x, z] of [[-7, 12], [7, 12], [0, 22]]) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 12), new THREE.MeshStandardMaterial({ color: 0x220a06, emissive: 0xffb48a, emissiveIntensity: 0 }))
      m.position.set(x, 15, z)
      this.scene.add(m); this.chandeliers.push(m)
    }
  }

  buildSeats() {
    const rows = 14, perRow = 22
    const back = new THREE.InstancedMesh(new RoundedBoxGeometry(0.62, 0.8, 0.12, 2, 0.05), new THREE.MeshStandardMaterial({ color: 0x4a0a07, roughness: 0.75 }), rows * perRow)
    const cushion = new THREE.InstancedMesh(new RoundedBoxGeometry(0.62, 0.14, 0.55, 2, 0.05), new THREE.MeshStandardMaterial({ color: 0x5c0d09, roughness: 0.8 }), rows * perRow)
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(1, 1, 1)
    let i = 0
    for (let r = 0; r < rows; r++) {
      const z = 4.5 + r * 1.35, y = houseFloor(z), radius = 30 + r * 1.35
      for (let k = 0; k < perRow; k++) {
        const x = (k - (perRow - 1) / 2) * 0.78
        const a = Math.asin(x / radius)
        q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -a)
        const zc = z + (radius - Math.cos(a) * radius)
        m.compose(new THREE.Vector3(x, y + 0.85, zc + 0.3), q, s); back.setMatrixAt(i, m)
        m.compose(new THREE.Vector3(x, y + 0.45, zc), q, s); cushion.setMatrixAt(i, m)
        i++
      }
    }
    this.scene.add(back, cushion)
    // A small light on your seat, for the moment the camera lands there.
    const yours = this.yourSeatLight = new THREE.SpotLight(C.red, 0, 8, 0.35, 0.7, 1)
    const seat = LAYOUT.seat()
    yours.position.set(seat.x, seat.y + 5, seat.z + 1); yours.target.position.copy(seat)
    this.scene.add(yours, yours.target)
  }

  buildStage() {
    const wood = new THREE.MeshStandardMaterial({ color: 0x140807, roughness: 0.6, metalness: 0.1 })
    const g = new THREE.Group()
    // Stage floor in four pieces around the trapdoor opening (2.4 m square).
    const T = LAYOUT.trapdoor, hole = 1.2, depth = 0.6
    const piece = (w, d, x, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, depth, d), wood); m.position.set(x, -depth / 2, z); g.add(m) }
    const front = 2.2, back = -14
    piece(24, (T.z - hole) - back, 0, (back + T.z - hole) / 2)          // behind the trapdoor
    piece(24, front - (T.z + hole), 0, (front + T.z + hole) / 2)        // in front of it
    piece(12 - hole, hole * 2, -(hole + (12 - hole) / 2), T.z)           // left
    piece(12 - hole, hole * 2, hole + (12 - hole) / 2, T.z)              // right
    // Apron lip and footlights.
    const lip = new THREE.Mesh(new THREE.BoxGeometry(24, 0.08, 0.08), new THREE.MeshStandardMaterial({ color: C.red, emissive: C.red, emissiveIntensity: 0.6 }))
    lip.position.set(0, 0.02, front); g.add(lip)
    // Proscenium arch.
    const arch = new THREE.MeshStandardMaterial({ color: 0x1c0605, roughness: 0.7 })
    const side = (x) => { const m = new THREE.Mesh(new THREE.BoxGeometry(2.4, 13, 1.2), arch); m.position.set(x, 5.5, 0.2); g.add(m) }
    side(-9.4); side(9.4)
    const top = new THREE.Mesh(new THREE.BoxGeometry(21.2, 3, 1.2), arch); top.position.set(0, 11.2, 0.2); g.add(top)
    // Marquee over the arch.
    const { tex } = canvasTexture(1024, 160, (ctx, w, h) => {
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h)
      ctx.font = `500 92px ${FONT.head}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = '#F2F2F2'; ctx.fillText('PRIVACY', w / 2 - 170, h / 2 + 4)
      ctx.fillStyle = '#FF3B2F'; ctx.fillText('THEATER', w / 2 + 210, h / 2 + 4)
    })
    this.marqueeTex = tex
    const marquee = new THREE.Mesh(new THREE.PlaneGeometry(12, 1.875), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }))
    marquee.position.set(0, 11.2, 0.81); g.add(marquee)
    // Trapdoor panel, hinged on its back edge.
    const hinge = this.trapHinge = new THREE.Group()
    hinge.position.set(0, 0, T.z - hole)
    const door = new THREE.Mesh(new THREE.BoxGeometry(hole * 2, 0.12, hole * 2), new THREE.MeshStandardMaterial({ color: 0x241010, roughness: 0.55 }))
    door.position.set(0, -0.06, hole); hinge.add(door)
    this.trapDoor = door
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(door.geometry), new THREE.LineBasicMaterial({ color: C.dim }))
    edge.position.copy(door.position); hinge.add(edge)
    g.add(hinge)
    this.scene.add(g)
  }

  // ---------------------------------------------------------------- curtains
  buildCurtains() {
    const W = 9.4, H = 10.6
    this.curtainUniforms = { uOpen: { value: 0 }, uTime: { value: 0 }, uW: { value: W } }
    const mat = new THREE.ShaderMaterial({
      uniforms: this.curtainUniforms,
      side: THREE.DoubleSide,
      vertexShader: /* glsl */`
        uniform float uOpen, uTime, uW;
        varying float vShade, vU, vY;
        void main() {
          // u: 0 at the centre seam, 1 at the outer edge (geometry spans x in [0, uW]).
          float u = position.x / uW;
          float y01 = position.y / ${H.toFixed(1)} + 0.5;
          // Gather toward the outer edge, a little more at the bottom (the tie-back swoop).
          float gather = uOpen * (0.86 + 0.08 * (1.0 - y01));
          float x = uW - (1.0 - u) * uW * (1.0 - gather);
          float freq = 2.6 + 3.5 * uOpen;
          float amp = 0.16 + 0.22 * uOpen;
          float ph = u * uW * freq + sin(uTime * 0.6 + y01 * 2.0) * 0.25 * (1.0 - uOpen);
          float z = sin(ph) * amp;
          float slope = cos(ph) * amp * freq;
          vShade = 0.55 + 0.45 * (-slope / sqrt(1.0 + slope * slope));
          vU = u; vY = y01;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(x, position.y, z, 1.0);
        }`,
      fragmentShader: /* glsl */`
        varying float vShade, vU, vY;
        void main() {
          vec3 deep = vec3(0.75, 0.10, 0.07);
          vec3 dark = vec3(0.10, 0.01, 0.01);
          float sheen = pow(vShade, 6.0) * 0.35;
          vec3 col = mix(dark, deep, vShade * vShade) + vec3(1.0, 0.45, 0.4) * sheen;
          col *= mix(0.45, 1.0, smoothstep(0.0, 0.35, vY));       // darker at the hem
          col *= mix(1.0, 0.7, smoothstep(0.85, 1.0, vY));        // and up in the flies
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }`,
    })
    const geo = new THREE.PlaneGeometry(W, H, 160, 1)
    geo.translate(W / 2, 0, 0)
    const left = new THREE.Mesh(geo, mat), right = new THREE.Mesh(geo, mat)
    left.position.set(0, H / 2, 0.55); left.scale.x = -1
    right.position.set(0, H / 2, 0.55)
    this.scene.add(left, right)
  }

  // ---------------------------------------------------------------- cookie banner
  buildBanner() {
    const draw = (ctx, w, h, mode = 'ask', n = 0) => {
      ctx.fillStyle = '#E9E1CE'; roundRect(ctx, 6, 6, w - 12, h - 12, 26); ctx.fill()
      ctx.fillStyle = '#1D1B19'; ctx.textBaseline = 'top'
      if (mode === 'ask') {
        ctx.font = `600 54px ${FONT.head}`; ctx.fillText('We value your privacy', 56, 46)
        ctx.font = `400 30px ${FONT.head}`
        wrapText(ctx, 'This site uses cookies to improve your experience. By clicking "Accept all", you agree to our use of cookies.', w - 112).forEach((l, i) => ctx.fillText(l, 56, 126 + i * 40))
        ctx.fillStyle = '#C01D13'; roundRect(ctx, 56, h - 118, 300, 72, 36); ctx.fill()
        ctx.fillStyle = '#F2F2F2'; ctx.font = `600 30px ${FONT.head}`; ctx.textAlign = 'center'; ctx.fillText('Accept all', 206, h - 98)
        ctx.strokeStyle = '#1D1B19'; ctx.lineWidth = 3; roundRect(ctx, 380, h - 118, 300, 72, 36); ctx.stroke()
        ctx.fillStyle = '#1D1B19'; ctx.fillText('Reject all', 530, h - 98); ctx.textAlign = 'left'
      } else {
        ctx.font = `600 54px ${FONT.head}`; ctx.fillText(mode === 'accept' ? 'Thank you for accepting.' : 'Preference saved.', 56, 46)
        ctx.font = `400 32px ${FONT.head}`
        const body = n
          ? `Either way, this page had already taken ${n} readings of your device before this box appeared, and it never set a cookie.`
          : 'Either way, this page had already started reading your device before this box appeared, and it never set a cookie.'
        wrapText(ctx, body, w - 112).forEach((l, i) => ctx.fillText(l, 56, 128 + i * 44))
        ctx.font = `400 22px ${FONT.mono}`; ctx.fillStyle = '#7E130C'; ctx.fillText('YOUR CHOICE CHANGED NOTHING ABOVE', 56, h - 70)
      }
    }
    this.bannerCanvas = canvasTexture(1024, 440, draw)
    const mesh = this.banner = new THREE.Mesh(new THREE.PlaneGeometry(6, 2.58), new THREE.MeshBasicMaterial({ map: this.bannerCanvas.tex, color: 0xb8b2a4, transparent: true }))
    mesh.position.set(0, 3.6, 1.2)
    mesh.userData.pick = 'banner'
    this.pickables.push(mesh)
    this.scene.add(mesh)
  }

  /** Mirror the HTML banner: 'accept' | 'reject', with the number of readings taken. */
  setBannerChoice(choice, readings) { this.bannerCanvas.redraw(choice, readings) }

  // ---------------------------------------------------------------- the iris
  buildEye() {
    const eye = this.eye = new THREE.Group()
    eye.position.copy(LAYOUT.eye)
    this.scene.add(eye)
    const W = 5.4, H = 2.5 // almond half-width and half-height
    this.eyeUniforms = { uOpen: { value: 0.06 }, uTime: { value: 0 }, uW: { value: W }, uH: { value: H }, uPulse: { value: 0 } }
    const lidMask = /* glsl */`
      uniform float uOpen, uW, uH;
      bool outsideLid(vec2 p) {
        float k = clamp(1.0 - pow(abs(p.x) / uW, 2.0), 0.0, 1.0);
        return abs(p.y) > uOpen * uH * pow(k, 0.85);
      }`
    const dashMat = new THREE.ShaderMaterial({
      uniforms: this.eyeUniforms,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */`
        uniform float uTime, uPulse;
        varying vec3 vColor; varying vec2 vLocal; varying float vFlicker;
        void main() {
          vec4 local = instanceMatrix * vec4(position, 1.0);
          vLocal = local.xy;
          vColor = instanceColor;
          float id = float(gl_InstanceID);
          vFlicker = 0.82 + 0.18 * sin(uTime * 2.3 + id * 12.9898) + uPulse * 0.6;
          gl_Position = projectionMatrix * modelViewMatrix * local;
        }`,
      fragmentShader: /* glsl */`
        ${lidMask}
        varying vec3 vColor; varying vec2 vLocal; varying float vFlicker;
        void main() {
          if (outsideLid(vLocal)) discard;
          gl_FragColor = vec4(vColor * vFlicker, 1.0);
          #include <colorspace_fragment>
        }`,
    })

    // Iris: thousands of short radial dashes, dark to bright, brightest in two bands near the pupil.
    const R0 = 0.95, R1 = 2.55, count = this.lowPower ? 1800 : 3200
    const iris = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), dashMat, count)
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), s = new THREE.Vector3(), col = new THREE.Color()
    const deep = new THREE.Color(0x2a0503), red = new THREE.Color(C.red), hot = new THREE.Color(C.pale)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const r = R0 + Math.pow(Math.random(), 0.8) * (R1 - R0)
      const t = (r - R0) / (R1 - R0)
      const band = Math.exp(-((t - 0.12) ** 2) / 0.004) + 0.8 * Math.exp(-((t - 0.38) ** 2) / 0.006)
      col.copy(deep).lerp(red, clamp01(0.35 + band * 0.9 - t * 0.45))
      if (Math.random() < 0.03) col.copy(hot)
      col.multiplyScalar(0.55 + band * 0.9)
      const len = 0.07 + Math.random() * 0.17
      v.set(Math.cos(a) * r, Math.sin(a) * r, 0)
      q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), a)
      s.set(len, 0.018, 1)
      m.compose(v, q, s); iris.setMatrixAt(i, m); iris.setColorAt(i, col)
    }
    eye.add(iris)

    // Sclera: dim grey dashes that follow the curve, darker toward the corners, a few red veins.
    const scl = this.lowPower ? 1400 : 2600
    const sclera = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), dashMat, scl)
    const grey = new THREE.Color(0x4a4a4a), vein = new THREE.Color(C.dim)
    let n = 0
    while (n < scl) {
      const x = (Math.random() * 2 - 1) * W, y = (Math.random() * 2 - 1) * H
      const k = 1 - (x / W) ** 2
      if (k <= 0 || Math.abs(y) > H * Math.pow(k, 0.85) || Math.hypot(x, y) < R1 + 0.18) continue
      const corner = Math.abs(x) / W
      col.copy(grey).multiplyScalar(0.55 * (1 - corner * 0.75))
      const isVein = corner > 0.55 && Math.abs(y) < 0.25 && Math.random() < 0.35
      if (isVein) col.copy(vein).multiplyScalar(0.7)
      const angle = Math.atan2(y, x) + Math.PI / 2
      q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), isVein ? 0 : angle)
      s.set(isVein ? 0.22 : 0.09, 0.016, 1)
      m.compose(v.set(x, y, -0.02), q, s); sclera.setMatrixAt(n, m); sclera.setColorAt(n, col)
      n++
    }
    eye.add(sclera)

    // Pupil: a black disc with a dotted white ring and a soft glint at upper left.
    const pupil = new THREE.Mesh(new THREE.CircleGeometry(R0 - 0.02, 64), new THREE.MeshBasicMaterial({ color: 0x000000 }))
    pupil.position.z = 0.01; eye.add(pupil)
    const ringPts = []
    for (let i = 0; i < 72; i++) { const a = (i / 72) * Math.PI * 2; ringPts.push(Math.cos(a) * (R0 - 0.06), Math.sin(a) * (R0 - 0.06), 0.02) }
    const ringGeo = new THREE.BufferGeometry(); ringGeo.setAttribute('position', new THREE.Float32BufferAttribute(ringPts, 3))
    const ringMat = new THREE.PointsMaterial({ color: C.white, size: 0.05, sizeAttenuation: true, transparent: true })
    this.pupilRing = new THREE.Points(ringGeo, ringMat); eye.add(this.pupilRing)
    const glintTex = canvasTexture(128, 128, (ctx, w, h) => {
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
      g.addColorStop(0, 'rgba(255,230,226,0.95)'); g.addColorStop(1, 'rgba(255,208,202,0)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
    }).tex
    const glint = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), new THREE.MeshBasicMaterial({ map: glintTex, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }))
    glint.position.set(-0.38, 0.38, 0.03); eye.add(glint)
    this.glint = glint

    // Faint halo ring beyond the iris.
    const halo = new THREE.Mesh(new THREE.RingGeometry(R1 + 0.05, R1 + 0.09, 96), new THREE.MeshBasicMaterial({ color: C.dim, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }))
    halo.position.z = -0.01; eye.add(halo)
    this.halo = halo

    // A dark backing so the eye reads against the back wall.
    const backing = new THREE.Mesh(new THREE.CircleGeometry(7, 48), new THREE.MeshBasicMaterial({ color: 0x000000 }))
    backing.position.z = -0.08; backing.scale.y = 0.6; eye.add(backing)

    this.eyeHit = new THREE.Mesh(new THREE.CircleGeometry(R1, 24), new THREE.MeshBasicMaterial({ visible: false }))
    this.eyeHit.userData.pick = 'eye'; eye.add(this.eyeHit); this.pickables.push(this.eyeHit)
    this.blink = 0
  }

  // ---------------------------------------------------------------- volumetric spot cones
  buildSpots() {
    const coneMat = color => new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(color) }, uStrength: { value: 0 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      vertexShader: /* glsl */`
        varying float vH; varying vec3 vN; varying vec3 vView;
        void main() {
          vH = uv.y;
          vN = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vView = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */`
        uniform vec3 uColor; uniform float uStrength;
        varying float vH; varying vec3 vN; varying vec3 vView;
        void main() {
          float edge = pow(abs(dot(vN, vView)), 1.6);
          float a = edge * smoothstep(0.0, 0.9, vH) * 0.22 * uStrength;
          gl_FragColor = vec4(uColor * a, a);
        }`,
    })
    const cone = (color, top, bottom, radius) => {
      const h = top.distanceTo(bottom)
      const geo = new THREE.ConeGeometry(radius, h, 40, 1, true)
      geo.translate(0, -h / 2, 0)
      const mesh = new THREE.Mesh(geo, coneMat(color))
      mesh.position.copy(top)
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), bottom.clone().sub(top).normalize())
      this.scene.add(mesh)
      return mesh
    }
    // Two on the eye, three for the "three forces" beat.
    this.eyeCones = [cone(C.red, new THREE.Vector3(-6, 14, -2), LAYOUT.eye.clone().add(new THREE.Vector3(0, -1.5, 0)), 2.6),
      cone(0xffd9cf, new THREE.Vector3(6, 14, -2), LAYOUT.eye.clone().add(new THREE.Vector3(0, -1.5, 0)), 2.6)]
    this.forceCones = [-5, 0, 5].map(x => cone(0xfff1ea, new THREE.Vector3(x, 14, 0.5), new THREE.Vector3(x, 0, -1.5), 1.5))
    this.forceLights = [-5, 0, 5].map(x => {
      const l = new THREE.SpotLight(0xfff1ea, 0, 20, 0.2, 0.5, 1)
      l.position.set(x, 14, 0.5); l.target.position.set(x, 0, -1.5)
      this.scene.add(l, l.target)
      return l
    })
    const label = (text, x) => {
      const { tex } = canvasTexture(512, 160, (ctx, w, h) => {
        ctx.font = `400 120px ${FONT.poster}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillStyle = '#F2F2F2'; ctx.fillText(text, w / 2, h / 2 + 6)
      })
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false, toneMapped: false })
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.81), mat)
      mesh.rotation.x = -Math.PI / 2; mesh.position.set(x, 0.02, -1.4)
      this.scene.add(mesh)
      return mesh
    }
    this.forceLabels = [label('MONEY', -5), label('LAW', 0), label('DESIGN', 5)]
  }

  // ---------------------------------------------------------------- the toggle
  buildToggle() {
    const g = this.toggle = new THREE.Group()
    g.position.copy(LAYOUT.toggle)
    g.rotation.y = 0.35
    const trackGeo = new THREE.CapsuleGeometry(0.75, 1.7, 8, 24)
    trackGeo.rotateZ(Math.PI / 2); trackGeo.scale(1, 1, 0.4)
    const track = new THREE.Mesh(trackGeo, new THREE.MeshStandardMaterial({ color: C.deep, emissive: C.red, emissiveIntensity: 0.55, roughness: 0.35 }))
    g.add(track)
    const knob = this.toggleKnob = new THREE.Mesh(new THREE.SphereGeometry(0.62, 40, 24), new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.25, metalness: 0.1 }))
    knob.position.set(0.82, 0, 0.32); g.add(knob)
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.9, 12), new THREE.MeshStandardMaterial({ color: 0x1a1a1a }))
    stand.position.y = -1.2; g.add(stand)
    const { tex, redraw } = canvasTexture(1024, 200, (ctx, w, h, on = true) => {
      ctx.font = `400 46px ${FONT.mono}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = '#CFCFCF'; ctx.fillText('HELP IMPROVE THE MODEL', w / 2, 60)
      ctx.font = `400 34px ${FONT.mono}`; ctx.fillStyle = on ? '#FF3B2F' : '#8a8a8a'
      ctx.fillText(on ? 'ON · SWITCHED ON FOR YOU' : 'OFF · YOU FOUND IT', w / 2, 140)
    })
    this.toggleLabel = redraw
    const label = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 0.9), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }))
    label.position.set(0, 1.45, 0); g.add(label)
    this.toggleTrack = track
    track.userData.pick = 'toggle'; knob.userData.pick = 'toggle'
    this.pickables.push(track, knob)
    this.toggleT = 1
    this.scene.add(g)
  }

  setToggle(on) { this.state.toggleOn = on; this.toggleLabel(on) }

  // ---------------------------------------------------------------- fly loft
  buildLoft() {
    const g = new THREE.Group()
    const steel = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.5, metalness: 0.6 })
    for (let i = 0; i < 7; i++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(20, 0.12, 0.12), steel)
      b.position.set(0, 12.5 + (i % 3) * 1.6, -1 - i * 1.6); g.add(b)
    }
    const ropes = []
    for (let i = 0; i < 26; i++) { const x = -9 + Math.random() * 18, z = -1 - Math.random() * 10; ropes.push(x, 9 + Math.random() * 3, z, x, 22, z) }
    const ropeGeo = new THREE.BufferGeometry(); ropeGeo.setAttribute('position', new THREE.Float32BufferAttribute(ropes, 3))
    g.add(new THREE.LineSegments(ropeGeo, new THREE.LineBasicMaterial({ color: 0x3a2a26 })))
    this.scene.add(g)

    // A placard up in the flies, where the chats end up.
    const { tex } = canvasTexture(1024, 620, (ctx, w, h) => {
      ctx.fillStyle = '#E9E1CE'; ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#1D1B19'; ctx.font = `400 26px ${FONT.mono}`; ctx.fillText('LOST PROPERTY · NO RETURNS', 60, 76)
      ctx.font = `400 64px ${FONT.type}`
      wrapText(ctx, 'Once it goes up, nobody can trace where it goes.', w - 120).forEach((l, i) => ctx.fillText(l, 60, 190 + i * 82))
      ctx.strokeStyle = '#C01D13'; ctx.lineWidth = 6; ctx.strokeRect(60, h - 120, 330, 70)
      ctx.fillStyle = '#C01D13'; ctx.font = `400 40px ${FONT.poster}`; ctx.textAlign = 'center'; ctx.fillText('YOUR CHATS', 225, h - 70)
    })
    const placard = this.placard = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 3.15), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.25 }))
    placard.position.set(1.5, 14.2, -5)
    this.scene.add(placard)
    const lines = new THREE.BufferGeometry()
    lines.setAttribute('position', new THREE.Float32BufferAttribute([-1, 15.8, -5, -1, 22, -5, 4, 15.8, -5, 4, 22, -5], 3))
    this.scene.add(new THREE.LineSegments(lines, new THREE.LineBasicMaterial({ color: 0x5a4a46 })))

    // Chats rising from the seats into the rigging.
    const bubbleTex = canvasTexture(256, 160, (ctx, w, h) => {
      ctx.fillStyle = 'rgba(242,242,242,0.92)'; roundRect(ctx, 8, 8, w - 16, h - 44, 26); ctx.fill()
      ctx.beginPath(); ctx.moveTo(40, h - 38); ctx.lineTo(28, h - 8); ctx.lineTo(70, h - 38); ctx.fill()
      ctx.fillStyle = 'rgba(29,27,25,0.55)'
      for (let i = 0; i < 3; i++) roundRect(ctx, 30, 30 + i * 26, i === 2 ? 110 : 190, 12, 6), ctx.fill()
    }).tex
    this.bubbles = []
    for (let i = 0; i < 10; i++) {
      const mat = new THREE.SpriteMaterial({ map: bubbleTex, color: 0x9a9a9a, transparent: true, opacity: 0, depthWrite: false })
      const sp = new THREE.Sprite(mat)
      sp.scale.set(1.0, 0.62, 1)
      sp.userData = { seed: Math.random(), x: -8 + Math.random() * 16, z: 6 + Math.random() * 14, speed: 0.05 + Math.random() * 0.05 }
      this.scene.add(sp); this.bubbles.push(sp)
    }
  }

  // ---------------------------------------------------------------- the enterprise box
  buildBox() {
    const g = new THREE.Group()
    g.position.copy(LAYOUT.box)
    const gold = new THREE.MeshStandardMaterial({ color: 0x8a5a24, roughness: 0.35, metalness: 0.8 })
    const plush = new THREE.MeshStandardMaterial({ color: 0x7a1410, roughness: 0.9 })
    const shell = new THREE.MeshStandardMaterial({ color: 0x1e0907, roughness: 0.8 })
    const floor = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.3, 4), shell); floor.position.y = -0.15; g.add(floor)
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.6, 4), shell); back.position.set(1.8, 1.6, 0); g.add(back)
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.0, 4), gold); rail.position.set(-1.7, 0.5, 0); g.add(rail)
    const roof = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.25, 4.2), shell); roof.position.set(0, 3.4, 0); g.add(roof)
    for (const z of [-0.8, 0.8]) {
      const seat = new THREE.Mesh(new RoundedBoxGeometry(0.9, 1.2, 0.9, 3, 0.15), plush)
      seat.position.set(0.6, 0.55, z); g.add(seat)
    }
    // Velvet rope across the entrance.
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-1.7, 1.1, -1.6), new THREE.Vector3(-1.9, 0.75, 0), new THREE.Vector3(-1.7, 1.1, 1.6)])
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.05, 8), plush))
    const { tex } = canvasTexture(1024, 256, (ctx, w, h) => {
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = '#8a5a24'; ctx.lineWidth = 6; ctx.strokeRect(10, 10, w - 20, h - 20)
      ctx.textAlign = 'center'; ctx.fillStyle = '#FFD9B0'; ctx.font = `500 64px ${FONT.head}`; ctx.fillText('PRIVACY, SOLD SEPARATELY', w / 2, 108)
      ctx.font = `400 30px ${FONT.mono}`; ctx.fillStyle = '#CFCFCF'; ctx.fillText('ENTERPRISE · NOT USED FOR TRAINING', w / 2, 190)
    })
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.85), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }))
    sign.position.set(-1.82, 2.75, 0); sign.rotation.y = -Math.PI / 2; g.add(sign)
    const warm = this.boxLight = new THREE.PointLight(0xffb070, 0, 9, 1.4)
    warm.position.set(0, 2.6, 0); g.add(warm)
    this.scene.add(g)
  }

  // ---------------------------------------------------------------- receipt printer
  buildReceipt() {
    const g = new THREE.Group()
    g.position.copy(LAYOUT.receipt)
    const printer = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.5, 0.9, 3, 0.08), new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.45 }))
    printer.position.set(0, 0.25, -0.2); g.add(printer)
    const slot = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.04, 0.04), new THREE.MeshBasicMaterial({ color: C.red }))
    slot.position.set(0, 0.48, 0.2); g.add(slot)
    this.receiptCanvas = canvasTexture(400, 1200, (ctx, w, h, lines = []) => {
      ctx.fillStyle = '#F5F4EF'; ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#1D1B19'; ctx.textAlign = 'center'
      ctx.font = `400 26px ${FONT.type}`; ctx.fillText('PRIVACY THEATER', w / 2, 60)
      ctx.font = `400 18px ${FONT.type}`; ctx.fillText('ADMIT ONE · GENERAL SEATING', w / 2, 92)
      ctx.fillText('- - - - - - - - - - - - - - - -', w / 2, 122)
      ctx.textAlign = 'left'; ctx.font = `400 17px ${FONT.type}`
      let y = 160
      ctx.fillText('PAID WITH:', 26, y); y += 36
      for (const [k, v] of lines) {
        ctx.fillText(k.toUpperCase(), 26, y); y += 24
        ctx.textAlign = 'right'; ctx.fillText(String(v).slice(0, 34), w - 26, y); ctx.textAlign = 'left'; y += 34
      }
      ctx.textAlign = 'center'; ctx.fillText('- - - - - - - - - - - - - - - -', w / 2, y + 6)
      ctx.font = `400 24px ${FONT.type}`; ctx.fillText('TOTAL CHARGED  $0.00', w / 2, y + 50)
      ctx.font = `400 15px ${FONT.type}`; ctx.fillText('YOU PAID IN DATA, NOT DOLLARS', w / 2, y + 84)
      ctx.fillText('ILLUSTRATIVE · NOTHING WAS SAVED', w / 2, y + 108)
    })
    this.receiptUniforms = { uPrint: { value: 0 }, map: { value: this.receiptCanvas.tex } }
    const paper = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 3.3, 1, 40), new THREE.ShaderMaterial({
      uniforms: this.receiptUniforms, side: THREE.DoubleSide,
      vertexShader: /* glsl */`
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */`
        uniform sampler2D map; uniform float uPrint; varying vec2 vUv;
        void main() {
          // uv.y = 1 is the printer slot; paper has come out as far as uPrint.
          float fromSlot = 1.0 - vUv.y;
          if (fromSlot > uPrint) discard;
          // Printing pushes the first line furthest out, so the far end shows the top of the
          // receipt. Read from the printer side (where the camera is), so x is mirrored.
          vec4 c = texture2D(map, vec2(1.0 - vUv.x, 1.0 - (uPrint - fromSlot)));
          gl_FragColor = vec4(c.rgb * 0.62, 1.0);
          #include <colorspace_fragment>
        }`,
    }))
    paper.rotation.x = -Math.PI / 2
    paper.position.set(0, 0.03, 0.2 + 1.65)
    g.add(paper)
    this.scene.add(g)
  }

  setReceipt(lines) { this.receiptCanvas.redraw(lines) }

  // ---------------------------------------------------------------- workshop under the stage
  buildWorkshop() {
    const g = new THREE.Group()
    const dark = new THREE.MeshStandardMaterial({ color: 0x100606, roughness: 1 })
    const floor = new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 10), dark); floor.position.set(0, -5.6, -5); g.add(floor)
    const desk = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 1.3), new THREE.MeshStandardMaterial({ color: 0x2a1a12, roughness: 0.7 }))
    desk.position.set(LAYOUT.laptop.x, LAYOUT.laptop.y - 0.05, LAYOUT.laptop.z); g.add(desk)
    for (const [x, z] of [[-1.2, -0.55], [1.2, -0.55], [-1.2, 0.55], [1.2, 0.55]]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.6, 0.08), dark); leg.position.set(LAYOUT.laptop.x + x, LAYOUT.laptop.y - 0.85, LAYOUT.laptop.z + z); g.add(leg)
    }
    const base = new THREE.Mesh(new RoundedBoxGeometry(1.3, 0.05, 0.9, 2, 0.02), new THREE.MeshStandardMaterial({ color: 0x3a3a3a, metalness: 0.7, roughness: 0.35 }))
    base.position.set(LAYOUT.laptop.x, LAYOUT.laptop.y + 0.03, LAYOUT.laptop.z + 0.1); g.add(base)
    this.screenCanvas = canvasTexture(640, 400, (ctx, w, h, state = 'idle') => {
      ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, w, h)
      ctx.font = `400 26px ${FONT.mono}`; ctx.fillStyle = '#CFCFCF'
      ctx.fillText('$ qwen3.5-0.8b --local', 30, 60)
      const lines = {
        idle: ['model: not downloaded yet', 'scroll up to the panel to try it'],
        loading: ['downloading once…', 'then it stays on this device'],
        ready: ['running on this device', 'requests sent: 0'],
        thinking: ['thinking on this device…', 'requests sent: 0'],
      }[state] || []
      ctx.fillStyle = '#FF3B2F'
      lines.forEach((l, i) => ctx.fillText(`> ${l}`, 30, 130 + i * 50))
      ctx.fillStyle = '#7E130C'; ctx.fillText('█', 30, 130 + lines.length * 50)
    })
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.28, 0.8), new THREE.MeshBasicMaterial({ map: this.screenCanvas.tex, toneMapped: false }))
    screen.position.set(LAYOUT.laptop.x, LAYOUT.laptop.y + 0.43, LAYOUT.laptop.z - 0.33); screen.rotation.x = -0.18; g.add(screen)
    const lamp = this.lamp = new THREE.PointLight(0xffb27a, 0, 9, 1.3)
    lamp.position.set(LAYOUT.laptop.x - 0.9, LAYOUT.laptop.y + 1.4, LAYOUT.laptop.z + 0.3); g.add(lamp)
    const screenGlow = this.screenGlow = new THREE.PointLight(C.red, 0, 4, 1.5)
    screenGlow.position.set(LAYOUT.laptop.x, LAYOUT.laptop.y + 0.5, LAYOUT.laptop.z + 0.4); g.add(screenGlow)
    this.scene.add(g)
  }

  setLabState(state) { this.screenCanvas.redraw(state); this.labThinking = state === 'thinking' }

  // ---------------------------------------------------------------- claim cards
  buildClaimCards() {
    this.cards = []
    this.cardQueue = []
    this.cardTimer = 0.6
    this.cardIndex = -1
  }

  /** A few lines from the live reading drift once from your seat through the curtain. */
  setClaims(texts) {
    this.cardQueue = texts.slice(0, 5).map(t => {
      const { tex } = canvasTexture(1024, 200, (ctx, w, h) => {
        ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, w, h)
        ctx.strokeStyle = '#FF3B2F'; ctx.lineWidth = 3; ctx.strokeRect(2, 2, w - 4, h - 4)
        ctx.font = `400 34px ${FONT.mono}`; ctx.fillStyle = '#F2F2F2'
        wrapText(ctx, t, w - 60).slice(0, 4).forEach((l, i) => ctx.fillText(l, 30, 56 + i * 42))
      })
      return tex
    })
  }

  spawnCard() {
    if (this.cardIndex >= this.cardQueue.length - 1) return
    const tex = this.cardQueue[++this.cardIndex]
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0 }))
    sp.scale.set(1.7, 0.33, 1)
    const seat = LAYOUT.seat()
    const side = this.cardIndex % 2 ? 1 : -1
    // Off to the side of your seat and up over the stalls, so they never cross the lens.
    const start = seat.clone().add(new THREE.Vector3(side * (1.6 + Math.random()), 0.4, -2.2))
    const end = new THREE.Vector3(side * 0.3, 5.2, 0.7) // the gap in the curtain
    const mid = start.clone().lerp(end, 0.5).add(new THREE.Vector3(side * 2.5, 2.2, 0))
    sp.userData = { curve: new THREE.QuadraticBezierCurve3(start, mid, end), t: 0 }
    this.scene.add(sp); this.cards.push(sp)
  }


  // ---------------------------------------------------------------- lines that live in the scene
  /** A text plane that fades with a state value. */
  textPlane(width, height, pxW, pxH, draw) {
    const { tex } = canvasTexture(pxW, pxH, draw)
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false, toneMapped: false })
    return new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat)
  }

  buildLines() {
    // Act I: the two Pew numbers glow on the curtain until it opens.
    const stat = (big, small) => (ctx, w) => {
      ctx.textAlign = 'center'; ctx.fillStyle = '#FF3B2F'; ctx.font = `500 230px ${FONT.head}`
      ctx.fillText(big, w / 2, 230)
      ctx.fillStyle = '#F2F2F2'; ctx.font = `400 34px ${FONT.mono}`
      wrapText(ctx, small, w - 80).forEach((l, i) => ctx.fillText(l, w / 2, 300 + i * 44))
    }
    this.statPlanes = [
      this.textPlane(3.6, 1.8, 800, 400, stat('56%', 'CLICK "AGREE" WITHOUT READING')),
      this.textPlane(3.6, 1.8, 800, 400, stat('61%', 'DOUBT ANYTHING THEY DO WILL MATTER')),
    ]
    this.statPlanes[0].position.set(-2.4, 6.6, 1.0)
    this.statPlanes[1].position.set(2.4, 6.6, 1.0)
    this.scene.add(...this.statPlanes)

    // Act II: the number sits in the pupil, as the brand's countdown numbers do.
    this.eyeStat = this.textPlane(1.6, 0.8, 512, 256, (ctx, w, h) => {
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = '#F2F2F2'; ctx.font = `500 120px ${FONT.head}`; ctx.fillText('6', w / 2 - 130, h / 2 - 14)
      ctx.fillStyle = '#FF3B2F'; ctx.fillText('6', w / 2 + 130, h / 2 - 14)
      ctx.fillStyle = '#CFCFCF'; ctx.font = `400 40px ${FONT.mono}`; ctx.fillText('OF', w / 2, h / 2 - 8)
      ctx.font = `400 22px ${FONT.mono}`; ctx.fillText('TRAIN ON YOUR CHATS', w / 2, h / 2 + 78)
    })
    this.eyeStat.position.set(0, 0, 0.04)
    this.eye.add(this.eyeStat)

    // Act IV: painted on the trapdoor, read from above before it drops.
    const trapText = this.textPlane(2.2, 0.55, 880, 220, (ctx, w, h) => {
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#E9E1CE'
      ctx.font = `400 64px ${FONT.poster}`; ctx.fillText('THE OTHER SIDE OF THE COIN', w / 2, h / 2)
    })
    trapText.rotation.x = -Math.PI / 2; trapText.position.set(0, 0.07, 0)
    trapText.material.opacity = 0.85
    this.trapDoor.add(trapText)

    // The closing question, on the back wall of the house, for the reverse shot from the stage.
    this.questionPlane = this.textPlane(22, 5.5, 1600, 400, (ctx, w, h) => {
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = '#F2F2F2'; ctx.font = `500 96px ${FONT.head}`
      ctx.fillText('Who do you trust with', w / 2, h / 2 - 66)
      ctx.fillStyle = '#FF3B2F'; ctx.fillText('your most sensitive data?', w / 2, h / 2 + 66)
    })
    this.questionPlane.position.set(0, houseFloor(30) + 7.5, 35.7)
    this.questionPlane.rotation.y = Math.PI
    this.scene.add(this.questionPlane)
  }

  // ---------------------------------------------------------------- post-processing
  buildPost() {
    const composer = this.composer = new EffectComposer(this.renderer)
    composer.addPass(new RenderPass(this.scene, this.camera))
    this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.5, 0.4, 0.84)
    composer.addPass(this.bloom)
    // Scanlines, a little chromatic aberration that grows with scroll speed, vignette and grain.
    this.crt = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uVel: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: /* glsl */`
        uniform sampler2D tDiffuse; uniform float uTime, uVel; uniform vec2 uRes; varying vec2 vUv;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        void main() {
          vec2 c = vUv - 0.5;
          float d = dot(c, c);
          float ca = 0.0008 + uVel * 0.006;
          vec2 off = c * d * ca * 8.0;
          vec3 col;
          col.r = texture2D(tDiffuse, vUv + off).r;
          col.g = texture2D(tDiffuse, vUv).g;
          col.b = texture2D(tDiffuse, vUv - off).b;
          float scan = 0.95 + 0.05 * sin(vUv.y * uRes.y * 1.6);
          col *= scan;
          col *= 1.0 - smoothstep(0.18, 0.75, d * 1.6);
          col += (hash(vUv * uRes + fract(uTime) * 100.0) - 0.5) * 0.025;
          gl_FragColor = vec4(col, 1.0);
        }`,
    })
    composer.addPass(this.crt)
    composer.addPass(new OutputPass())
  }

  // ---------------------------------------------------------------- input
  setPointer(x, y) { this.pointer.set(x, y) }

  /** Returns the name of the clickable prop under the pointer, if any. */
  pick(x, y) {
    this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera)
    const hit = this.raycaster.intersectObjects(this.pickables, false)[0]
    if (!hit) return null
    const name = hit.object.userData.pick
    if (name === 'banner') {
      // Buttons sit along the bottom of the banner texture.
      const { x: u, y: v } = hit.uv
      if (v < 0.32) return u < 0.36 ? 'banner:accept' : u < 0.68 ? 'banner:reject' : 'banner'
    }
    return name
  }

  blinkEye() { this.blink = 1 }

  // ---------------------------------------------------------------- frame
  resize() {
    const w = window.innerWidth, h = window.innerHeight
    this.renderer.setPixelRatio(this.dpr)
    this.renderer.setSize(w, h, false)
    this.composer.setPixelRatio(this.dpr)
    this.composer.setSize(w, h)
    this.bloom.resolution.set(w * this.dpr * 0.5, h * this.dpr * 0.5)
    this.crt.uniforms.uRes.value.set(w * this.dpr, h * this.dpr)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  /** Adaptive resolution: drop the pixel ratio if frames are slow, as igloo.inc does. */
  adapt(fps) {
    if (fps < 40 && this.dpr > 0.7) { this.dpr = Math.max(0.7, this.dpr - 0.15); this.resize() }
    else if (fps > 58 && this.dpr < this.dprCap) { this.dpr = Math.min(this.dprCap, this.dpr + 0.1); this.resize() }
  }

  render(cam, s, reduced) {
    this.timer.update()
    const dt = Math.min(this.timer.getDelta(), 0.05)
    const t = this.timer.getElapsed()
    Object.assign(this.state, s)
    const st = this.state

    // Camera, with a touch of handheld drift and pointer parallax.
    const shake = reduced ? 0 : 1
    const px = this.pointer.x * 0.35 * shake, py = this.pointer.y * 0.2 * shake
    this.camera.position.set(
      cam.pos.x + px + Math.sin(t * 0.7) * 0.03 * shake,
      cam.pos.y + py + Math.sin(t * 0.9 + 1) * 0.025 * shake,
      cam.pos.z,
    )
    // Shift the frame away from the text panel so the subject isn't hidden behind it.
    const w = window.innerWidth, h = window.innerHeight
    const narrow = w <= 700
    const ox = narrow ? 0 : -cam.shift * w * 0.14, oy = narrow ? cam.lift * h * 0.2 : 0
    this.camera.fov = cam.fov
    this.camera.setViewOffset(w, h, ox, oy, w, h)
    this.camera.up.set(Math.sin(cam.roll), Math.cos(cam.roll), 0)
    this.camera.lookAt(cam.tgt)

    // Curtains and banner.
    this.curtainUniforms.uOpen.value = smooth(st.curtain)
    this.curtainUniforms.uTime.value = t
    const fall = smooth(st.banner)
    this.banner.position.set(0, 3.6 - fall * 4.6, 1.2 + fall * 0.8)
    this.banner.rotation.set(-fall * 1.2, 0, fall * 0.35)
    this.banner.visible = fall < 0.99

    // The eye: opens with the story, always turns to face you, blinks when clicked.
    this.blink = Math.max(0, this.blink - dt * 3.2)
    const blinkK = this.blink > 0 ? Math.abs(Math.sin(this.blink * Math.PI)) : 0
    this.eyeUniforms.uOpen.value = Math.max(0.015, st.eyeOpen * (1 - blinkK))
    this.eyeUniforms.uTime.value = t
    this.eyeUniforms.uPulse.value = Math.max(0, this.eyeUniforms.uPulse.value - dt * 1.5)
    const look = this.camera.position.clone()
    const m = new THREE.Matrix4().lookAt(look, this.eye.position, new THREE.Vector3(0, 1, 0))
    const target = new THREE.Quaternion().setFromRotationMatrix(m) // +z (the eye's face) toward the camera
    this.eye.quaternion.slerp(target, 1 - Math.pow(0.02, dt))
    this.glint.visible = st.eyeOpen > 0.25
    this.pupilRing.material.opacity = clamp01(st.eyeOpen * 2)
    this.halo.material.opacity = 0.5 * clamp01(st.eyeOpen * 1.5)
    for (const c of this.eyeCones) c.material.uniforms.uStrength.value = 0.6 * clamp01(st.eyeOpen * 1.3) * (1 - st.house)

    // Claim cards drift from your seat into the pupil.
    const cardsOn = st.cards > 0.01
    if (cardsOn && this.cardQueue.length) {
      this.cardTimer -= dt
      if (this.cardTimer <= 0) { this.spawnCard(); this.cardTimer = 1.8 }
    }
    for (let i = this.cards.length - 1; i >= 0; i--) {
      const sp = this.cards[i]
      sp.userData.t += dt / 7
      const k = sp.userData.t
      sp.position.copy(sp.userData.curve.getPoint(Math.min(1, k)))
      const sc = 1 - smooth((k - 0.55) / 0.45) * 0.85
      sp.scale.set(1.7 * sc, 0.33 * sc, 1)
      sp.material.opacity = 0.8 * clamp01(k * 5) * st.cards * (1 - smooth((k - 0.85) / 0.15))
      if (k >= 1) {
        this.eyeUniforms.uPulse.value = 1
        this.scene.remove(sp); sp.material.dispose(); this.cards.splice(i, 1)
      }
    }
    this.yourSeatLight.intensity = 30 * st.cards

    // In-scene lines.
    for (const p of this.statPlanes) p.material.opacity = st.stats
    this.eyeStat.material.opacity = st.eyeStat
    this.questionPlane.material.opacity = st.question

    // Toggle knob eases to its side.
    this.toggleT += ((st.toggleOn ? 1 : 0) - this.toggleT) * (1 - Math.pow(0.001, dt))
    this.toggleKnob.position.x = -0.82 + 1.64 * this.toggleT
    this.toggleTrack.material.emissiveIntensity = 0.08 + 0.5 * this.toggleT
    this.toggleTrack.material.color.setHex(this.toggleT > 0.5 ? C.deep : 0x2a2a2a)

    // Chats rising into the flies.
    for (const sp of this.bubbles) {
      const u = sp.userData
      const k = (t * u.speed + u.seed) % 1
      const start = new THREE.Vector3(u.x, houseFloor(u.z) + 2, u.z)
      const end = new THREE.Vector3(u.x * 0.6, 21, -3 - u.seed * 4)
      sp.position.lerpVectors(start, end, smooth(k))
      sp.material.opacity = st.bubbles * Math.sin(k * Math.PI) * 0.9
    }
    this.placard.position.y = 14.2 + Math.sin(t * 0.5) * 0.06

    // Three forces.
    st.forces.forEach((f, i) => {
      this.forceCones[i].material.uniforms.uStrength.value = f * 0.8
      this.forceLights[i].intensity = f * 22
      this.forceLabels[i].material.opacity = f
    })

    // Box, receipt, trapdoor, workshop.
    this.boxLight.intensity = 6 + 24 * st.box
    this.receiptUniforms.uPrint.value = smooth(st.print)
    this.trapHinge.rotation.x = smooth(st.trapdoor) * 1.9
    this.lamp.intensity = 26 * smooth(st.trapdoor)
    this.screenGlow.intensity = (3 + (this.labThinking ? Math.sin(t * 8) * 1.5 + 1.5 : 0)) * smooth(st.trapdoor)

    // House lights come up at the end.
    this.hemi.intensity = 0.18 + st.house * 0.9
    for (const l of this.houseLights) l.intensity = st.house * 40
    for (const c of this.chandeliers) c.material.emissiveIntensity = st.house * 2.5
    this.key.intensity = 140 * (1 - st.house * 0.4)
    this.scene.fog.density = 0.022 * (1 - st.house * 0.6)

    this.crt.uniforms.uTime.value = t
    this.crt.uniforms.uVel.value = reduced ? 0 : Math.min(1, st.velocity)
    this.composer.render(dt)
  }
}
