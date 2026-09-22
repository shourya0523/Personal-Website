import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Local stand-in for the Vercel function in api/deezer.js so the Music app's search works under `npm run dev`.
  server: { proxy: { '/api/deezer': { target: 'https://api.deezer.com', changeOrigin: true, rewrite: p => p.replace(/^\/api\/deezer/, '/search') } } },
  build: { chunkSizeWarningLimit: 700 },
  test: { globals: true, environment: 'jsdom', setupFiles: './src/test/setup.js', exclude: ['e2e/**', 'node_modules/**', 'dist/**'] },
})
