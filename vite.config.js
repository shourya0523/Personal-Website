import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Absolute site URL for Open Graph tags: VITE_SITE_URL wins, then Vercel's production URL, then localhost.
const siteUrl = (process.env.VITE_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:5173')).replace(/\/$/, '')
const siteUrlPlugin = { name: 'site-url', transformIndexHtml: html => html.replaceAll('%SITE_URL%', siteUrl) }

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // PostHog: accept the names Vercel's native PostHog integration sets (NEXT_PUBLIC_POSTHOG_*) as well as VITE_POSTHOG_*.
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
  const posthogKey = env.VITE_POSTHOG_KEY || env.NEXT_PUBLIC_POSTHOG_KEY || env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || env.POSTHOG_PROJECT_API_KEY || env.POSTHOG_API_KEY || env.POSTHOG_KEY || ''
  // Production uses the same-origin /ingest proxy unless VITE_POSTHOG_HOST is set explicitly.
  const posthogHost = env.VITE_POSTHOG_HOST || ''
  return {
  define: { 'import.meta.env.VITE_POSTHOG_KEY': JSON.stringify(posthogKey), 'import.meta.env.VITE_POSTHOG_HOST': JSON.stringify(posthogHost) },
  plugins: [react(), siteUrlPlugin],
  // Local stand-in for the Vercel function in api/deezer.js so the Music app's search works under `npm run dev`.
  server: { proxy: { '/api/deezer': { target: 'https://api.deezer.com', changeOrigin: true, rewrite: p => p.replace(/^\/api\/deezer/, '/search') } } },
  build: { chunkSizeWarningLimit: 700 },
  test: { globals: true, environment: 'jsdom', setupFiles: './src/test/setup.js', exclude: ['e2e/**', 'node_modules/**', 'dist/**'] },
  }
})
