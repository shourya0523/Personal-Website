// Product analytics: PostHog when VITE_POSTHOG_KEY is set, otherwise a no-op that still logs in dev.
// Events are queued until the SDK loads. Honors Global Privacy Control. Never sends the visitor's typed name.
const KEY = import.meta.env.VITE_POSTHOG_KEY
const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'
const gpc = typeof navigator !== 'undefined' && navigator.globalPrivacyControl === true
let ph = null, queue = [], loading = null
export const analyticsEnabled = Boolean(KEY) && !gpc

export function initAnalytics() {
  if (!analyticsEnabled || ph || loading) return loading
  loading = import('posthog-js').then(({ default: posthog }) => {
    posthog.init(KEY, { api_host: HOST, capture_pageview: true, capture_pageleave: true, autocapture: false, disable_session_recording: true, persistence: 'localStorage+cookie', person_profiles: 'identified_only' })
    ph = posthog
    for (const [e, p] of queue) ph.capture(e, p); queue = []
  }).catch(err => { console.warn('[analytics] failed to load', err); loading = null })
  return loading
}
/** Record a product event. Props must be non-identifying (app ids, choices, counts). */
export function track(event, props = {}) {
  if (import.meta.env.DEV) console.debug('[analytics]', event, props)
  if (!analyticsEnabled) return
  if (ph) ph.capture(event, props); else { queue.push([event, props]); if (queue.length > 50) queue.shift() }
}
/** Attach traits to every future event and to the person (e.g. { user_type: 'recruiter' }). */
export function setTraits(traits) {
  if (!analyticsEnabled) return
  const apply = () => { ph.register(traits); ph.setPersonProperties?.(traits) }
  if (ph) apply(); else initAnalytics()?.then(() => ph && apply())
}
export const USER_TYPES = [
  { id: 'peer', label: 'A peer or friend', hint: 'Fellow builder, classmate, teammate', glyph: 'about', opens: 'about' },
  { id: 'recruiter', label: 'A recruiter', hint: 'Hiring, or scouting for a team', glyph: 'resume', opens: 'resume' },
  { id: 'client', label: 'A client or partner', hint: 'Want something built, or built together', glyph: 'briefcase', opens: 'projects' },
  { id: 'visitor', label: 'Just looking', hint: 'Curious, wandered in, no agenda', glyph: 'compass', opens: null },
]
export const userTypeById = Object.fromEntries(USER_TYPES.map(t => [t.id, t]))
