// Vercel serverless function for Privacy Theater: echoes back what the connection itself reveals.
// GET /api/context
// Mirrors the shape of the Cloudflare function in Kuber Mehta's "I didn't set a cookie", using the
// geo headers Vercel adds to every request. Stateless: nothing is logged, stored or forwarded.

const CLIENT_HINT_HEADERS = [
  'sec-ch-ua', 'sec-ch-ua-mobile', 'sec-ch-ua-platform', 'sec-ch-ua-platform-version',
  'sec-ch-ua-arch', 'sec-ch-ua-bitness', 'sec-ch-ua-model', 'sec-ch-ua-full-version-list',
  'sec-ch-ua-wow64', 'sec-ch-prefers-color-scheme', 'sec-ch-prefers-reduced-motion',
  'device-memory', 'downlink', 'ect', 'rtt', 'save-data',
]

// Vercel URL-encodes city names (São Paulo arrives as S%C3%A3o%20Paulo).
const decode = v => { try { return v ? decodeURIComponent(v) : undefined } catch { return v } }

export default function handler(req, res) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return }
  const h = req.headers
  const clientHints = {}
  for (const name of CLIENT_HINT_HEADERS) if (h[name]) clientHints[name] = h[name]

  res.setHeader('cache-control', 'no-store')
  res.status(200).json({
    ip: (h['x-real-ip'] || String(h['x-forwarded-for'] || '').split(',')[0].trim()) || undefined,
    country: h['x-vercel-ip-country'],
    region: h['x-vercel-ip-country-region'],
    city: decode(h['x-vercel-ip-city']),
    postalCode: h['x-vercel-ip-postal-code'],
    latitude: h['x-vercel-ip-latitude'],
    longitude: h['x-vercel-ip-longitude'],
    timezone: h['x-vercel-ip-timezone'],
    userAgent: h['user-agent'],
    acceptLanguage: h['accept-language'],
    clientHints,
    // Header order is itself a fingerprint: browsers send a characteristic sequence.
    headerOrder: Object.keys(h),
  })
}
