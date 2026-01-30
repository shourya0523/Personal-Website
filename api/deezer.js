// api/deezer.js
export const config = {
    runtime: 'edge',
  };
  
  export default async function handler(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') || '20';
  
    if (!query) {
      return new Response(JSON.stringify({ error: 'Missing query parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    try {
      const response = await fetch(
        `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=${limit}`
      );
      const data = await response.json();

      // Determine allowed origin - either from environment or request origin for same-site requests
      const origin = req.headers.get('origin');
      const allowedOrigin = process.env.ALLOWED_ORIGIN ||
                           (origin && (origin.includes('localhost') || origin.includes('127.0.0.1')))
                           ? origin
                           : 'http://localhost:5173';

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigin,
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch from Deezer' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }