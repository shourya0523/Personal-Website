// Vercel serverless function: proxies Deezer's public search API so the browser can call it same-origin.
// GET /api/deezer?q=<query>&limit=<1..50>
// Runs on the default Node.js runtime (no `runtime: 'edge'`), passes upstream errors through with their
// status, and lets Vercel's edge cache serve repeated queries so Deezer's per-IP rate limit is rarely hit.

const DEEZER = 'https://api.deezer.com/search'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') { setCors(req, res); res.status(204).end(); return }
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return }

  const q = String(req.query.q ?? '').trim()
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20))
  if (!q) { res.status(400).json({ error: 'Missing query parameter "q"' }); return }
  if (q.length > 200) { res.status(400).json({ error: 'Query too long' }); return }

  setCors(req, res)
  try {
    const upstream = await fetch(`${DEEZER}?q=${encodeURIComponent(q)}&limit=${limit}`, {
      headers: { accept: 'application/json', 'user-agent': 'ShouryaOS/2.0 (+https://github.com/shourya0523/personal-website)' },
      signal: AbortSignal.timeout(8000),
    })
    const text = await upstream.text()
    let data
    try { data = JSON.parse(text) } catch { data = null }
    if (!upstream.ok || !data) {
      res.status(502).json({ error: `Deezer responded ${upstream.status}`, detail: text.slice(0, 200) }); return
    }
    if (data.error) { // Deezer reports quota and query errors inside a 200 body
      res.status(502).json({ error: data.error.message || 'Deezer error', code: data.error.code ?? null }); return
    }
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.status(200).json({ data: Array.isArray(data.data) ? data.data : [], total: data.total ?? 0 })
  } catch (err) {
    const timeout = err?.name === 'TimeoutError' || err?.name === 'AbortError'
    res.status(timeout ? 504 : 502).json({ error: timeout ? 'Deezer timed out' : 'Failed to reach Deezer', detail: String(err?.message || err).slice(0, 200) })
  }
}

// Same-origin callers need no CORS. ALLOWED_ORIGIN (comma separated) opts specific other origins in.
function setCors(req, res) {
  const origin = req.headers.origin
  const allowed = (process.env.ALLOWED_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean)
  if (origin && (allowed.includes(origin) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  }
}
