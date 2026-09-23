import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Absolute site URL for Open Graph tags: VITE_SITE_URL wins, then Vercel's production URL, then localhost.
const siteUrl = (process.env.VITE_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:5173')).replace(/\/$/, '')
const siteUrlPlugin = { name: 'site-url', transformIndexHtml: html => html.replaceAll('%SITE_URL%', siteUrl) }

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteUrlPlugin],
  // Local stand-in for the Vercel function in api/deezer.js so the Music app's search works under `npm run dev`.
  server: { proxy: { '/api/deezer': { target: 'https://api.deezer.com', changeOrigin: true, rewrite: p => p.replace(/^\/api\/deezer/, '/search') } } },
  build: { chunkSizeWarningLimit: 700 },
  test: { globals: true, environment: 'jsdom', setupFiles: './src/test/setup.js', exclude: ['e2e/**', 'node_modules/**', 'dist/**'] },
})
