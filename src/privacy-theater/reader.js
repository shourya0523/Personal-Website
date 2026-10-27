// The live reading in Act I. All of the measuring and the plain-English sentences come from
// Kuber Mehta's "I didn't set a cookie" (vendored in ./kuber, credited on the page). This file
// only runs his passive probes, folds in what the connection revealed, and shapes the result
// for the stage. Nothing is stored and nothing is sent anywhere.
import { runProbes } from './kuber/runner'
import { inferAll, verdict, rarityFunnel } from './kuber/infer'
import { deviceHook } from './kuber/infer/hook'
import { platformProbe, displayProbe, hardwareProbe, environmentProbe, codecProbe, voiceProbe } from './kuber/probes/core'
import { gpuProbe, canvasProbe, audioProbe, domRectProbe } from './kuber/probes/render'
import { fontProbe } from './kuber/probes/fonts'
import { liesProbe } from './kuber/probes/lies'
import { automationProbe } from './kuber/probes/automation'
import { incognitoProbe } from './kuber/probes/incognito'
import { cpuArchProbe, mathProbe, applePayProbe, mathmlProbe } from './kuber/probes/deep'
import { metaProbe } from './kuber/probes/meta'

// Kuber's passive set only. The invasive tier (port scan, WebRTC, extensions, permissions) stays off.
const PASSIVE = [
  platformProbe, displayProbe, hardwareProbe, environmentProbe, codecProbe, voiceProbe,
  gpuProbe, canvasProbe, audioProbe, domRectProbe, fontProbe,
  liesProbe, automationProbe, incognitoProbe,
  cpuArchProbe, mathProbe, applePayProbe, mathmlProbe, metaProbe,
]

/** What the request itself gave away, from our own /api/context (no third-party lookup). */
async function loadEdge(signals) {
  try {
    const res = await fetch('/api/context', { headers: { accept: 'application/json' } })
    if (!res.ok) return
    const ctx = await res.json()
    const put = (id, label, value) => { if (value != null && value !== '') signals[id] = { id, label, value } }
    put('edge.ip', 'IP address', ctx.ip)
    put('edge.city', 'City (from IP)', ctx.city)
    put('edge.region', 'Region (from IP)', ctx.region)
    put('edge.country', 'Country (from IP)', ctx.country)
    put('edge.postalCode', 'Postal code (from IP)', ctx.postalCode)
    put('edge.latitude', 'Latitude', ctx.latitude)
    put('edge.longitude', 'Longitude', ctx.longitude)
    put('edge.timezone', 'Timezone (from IP)', ctx.timezone)
    put('edge.acceptLanguage', 'Accept-Language', ctx.acceptLanguage)
    put('edge.headerOrder', 'Header order', ctx.headerOrder)
    put('edge.clientHints', 'Client hints', ctx.clientHints)
  } catch { /* local dev or offline: the browser-side reading still works */ }
}

/** Kuber marks the key phrase of each line with *asterisks*; turn that into <em>, safely. */
export function claimHTML(text) {
  const esc = String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
  return esc.replace(/\*(.+?)\*/g, '<em>$1</em>')
}
export const plain = text => String(text).replace(/\*/g, '')

/**
 * Read the visitor. Resolves with the claims (in Kuber's reveal order), the signal map,
 * the fingerprint and how rare it is, plus how long it all took.
 */
export async function readVisitor() {
  const t0 = performance.now()
  const controller = new AbortController()
  const signals = {}
  await loadEdge(signals)
  Object.assign(signals, await runProbes(PASSIVE, { consented: false, signal: controller.signal }))
  const ms = performance.now() - t0

  let claims = []
  try { claims = [...deviceHook(signals), ...inferAll(signals).filter(c => c.act >= 1 && c.act < 6)] } catch { /* keep going */ }
  // Kuber's private-window lines speak in his page's voice ("Cute."), which doesn't fit here.
  claims = claims.filter(c => !/private window/i.test(c.text))

  const { fingerprint, bits } = verdict(signals)
  let oneIn = Math.round(2 ** bits)
  try { oneIn = rarityFunnel(signals).oneIn || oneIn } catch { /* fall back to the entropy estimate */ }

  return { signals, claims, fingerprint, bits, oneIn, ms, count: Object.values(signals).filter(s => !s.error).length }
}

/** Receipt lines for Act III: what this visit "paid", from the real reading. Clearly illustrative. */
export function receiptLines(reading) {
  const v = id => reading.signals[id]?.value
  const lines = []
  const place = [v('edge.city'), v('edge.region'), v('edge.country')].filter(Boolean).join(', ')
  if (place) lines.push(['Your location', place])
  const tz = v('env.timezone'); if (tz) lines.push(['Your time zone', tz])
  const res = v('display.resolution'); if (Array.isArray(res)) lines.push(['Your screen', `${res[0]} × ${res[1]}`])
  const gpu = v('gpu.renderer'); if (gpu) lines.push(['Your graphics chip', String(gpu).replace(/^ANGLE \(|\)$/g, '').slice(0, 42)])
  const cores = v('hw.cores'); if (cores) lines.push(['Processor cores', String(cores)])
  const fonts = v('fonts.count'); if (fonts) lines.push(['Fonts installed', `${fonts} detected`])
  const langs = v('platform.languages'); if (Array.isArray(langs) && langs.length) lines.push(['Languages', langs.slice(0, 3).join(', ')])
  const voices = v('voices.count'); if (voices) lines.push(['Speech voices', String(voices)])
  lines.push(['Readings taken', String(reading.count)])
  lines.push(['Time it took', `${(reading.ms / 1000).toFixed(2)} s`])
  return lines
}
