import { describe, it, expect, vi, beforeEach } from 'vitest'
import handler from './deezer.js'

function mockRes() {
  const res = { headers: {}, statusCode: 200, body: null }
  res.setHeader = (k, v) => { res.headers[k.toLowerCase()] = v }
  res.status = c => { res.statusCode = c; return res }
  res.json = b => { res.body = b; return res }
  res.end = () => res
  return res
}

describe('api/deezer', () => {
  beforeEach(() => { vi.restoreAllMocks() })

  it('rejects a missing query', async () => {
    const res = mockRes(); await handler({ method: 'GET', query: {}, headers: {} }, res)
    expect(res.statusCode).toBe(400)
  })

  it('returns Deezer tracks with a cache header', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ data: [{ id: 1, title: 'Starboy', preview: 'https://x/y.mp3' }], total: 1 }), { status: 200 })))
    const res = mockRes(); await handler({ method: 'GET', query: { q: 'starboy', limit: '5' }, headers: {} }, res)
    expect(res.statusCode).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.headers['cache-control']).toMatch(/s-maxage/)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('q=starboy&limit=5'), expect.any(Object))
  })

  it('passes Deezer quota errors through as 502 with the message', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: { type: 'Exception', message: 'Quota limit exceeded', code: 4 } }), { status: 200 })))
    const res = mockRes(); await handler({ method: 'GET', query: { q: 'x' }, headers: {} }, res)
    expect(res.statusCode).toBe(502)
    expect(res.body.error).toBe('Quota limit exceeded')
  })

  it('only sets CORS for allowed or local origins', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ data: [] }), { status: 200 })))
    const a = mockRes(); await handler({ method: 'GET', query: { q: 'x' }, headers: { origin: 'https://evil.example' } }, a)
    expect(a.headers['access-control-allow-origin']).toBeUndefined()
    const b = mockRes(); await handler({ method: 'GET', query: { q: 'x' }, headers: { origin: 'http://localhost:5173' } }, b)
    expect(b.headers['access-control-allow-origin']).toBe('http://localhost:5173')
  })
})
