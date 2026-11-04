import { readFileSync } from 'node:fs'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { SITE_URL, STATIC_CSS, homeStaticHtml, homeJsonLd, blogJsonLd, jsonLdTag, projects, projectPath, projectPageHtml, projectsIndexHtml, sitemapXml, llmsTxt } from './scripts/seo/site.js'

// Absolute site URL for canonical and Open Graph tags. Always the production domain unless VITE_SITE_URL overrides it,
// so preview and *.vercel.app deployments never declare themselves canonical.
const siteUrl = (process.env.VITE_SITE_URL || SITE_URL).replace(/\/$/, '')
const siteUrlPlugin = { name: 'site-url', transformIndexHtml: html => html.replaceAll('%SITE_URL%', siteUrl) }

// Crawlable HTML generated from src/content at build time (see scripts/seo/site.js):
// the homepage gets a text version inside #root (React replaces it on boot) plus JSON-LD,
// the blog gets BlogPosting JSON-LD, and each project gets its own static page.
const seoFiles = () => ({
  'projects/index.html': projectsIndexHtml(),
  ...Object.fromEntries(projects.map(p => [`${projectPath(p).slice(1)}/index.html`, projectPageHtml(p)])),
  'sitemap.xml': sitemapXml(),
  'llms.txt': llmsTxt(),
})
const seoPlugin = {
  name: 'seo',
  transformIndexHtml(html, ctx) {
    if (ctx.path.startsWith('/blog/Privacy-Theater')) return html.replace('</head>', `  ${jsonLdTag(blogJsonLd())}\n</head>`)
    if (ctx.path !== '/index.html') return html
    return html
      .replace('</head>', `  <style>${STATIC_CSS}</style>\n    ${jsonLdTag(homeJsonLd())}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${homeStaticHtml()}</div>`)
  },
  generateBundle() {
    for (const [fileName, source] of Object.entries(seoFiles())) this.emitFile({ type: 'asset', fileName, source })
  },
  // `vite preview` falls back to index.html for every path; apply vercel.json's local rewrites first so
  // /blog/Privacy-Theater and /projects/* behave as they do on Vercel.
  configurePreviewServer(server) {
    const rules = JSON.parse(readFileSync('vercel.json', 'utf8')).rewrites.filter(r => r.destination.startsWith('/')).map(r => ({
      re: new RegExp('^' + r.source.replace(/:(\w+)\(([^)]*)\)/g, '(?<$1>$2)').replace(/:(\w+)/g, '(?<$1>[^/]+)') + '$'),
      to: r.destination,
    }))
    server.middlewares.use((req, res, next) => {
      const [path, query] = req.url.split('?')
      for (const { re, to } of rules) {
        const m = re.exec(path)
        if (m) { req.url = to.replace(/:(\w+)/g, (_, k) => m.groups?.[k] ?? '') + (query ? `?${query}` : ''); break }
      }
      next()
    })
  },
  // Serve the same generated files under `npm run dev`.
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const path = req.url.split('?')[0].replace(/^\//, '').replace(/\/$/, '')
      const files = seoFiles()
      const hit = files[path] !== undefined ? path : files[`${path}/index.html`] !== undefined ? `${path}/index.html` : null
      if (!hit) return next()
      res.setHeader('Content-Type', hit.endsWith('.xml') ? 'application/xml' : hit.endsWith('.txt') ? 'text/plain; charset=utf-8' : 'text/html; charset=utf-8')
      res.end(files[hit])
    })
  },
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // PostHog: accept the names Vercel's native PostHog integration sets (NEXT_PUBLIC_POSTHOG_*) as well as VITE_POSTHOG_*.
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
  const posthogKey = env.VITE_POSTHOG_KEY || env.NEXT_PUBLIC_POSTHOG_KEY || env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || env.POSTHOG_PROJECT_API_KEY || env.POSTHOG_API_KEY || env.POSTHOG_KEY || ''
  // Production uses the same-origin /ingest proxy unless VITE_POSTHOG_HOST is set explicitly.
  const posthogHost = env.VITE_POSTHOG_HOST || ''
  return {
  define: { 'import.meta.env.VITE_POSTHOG_KEY': JSON.stringify(posthogKey), 'import.meta.env.VITE_POSTHOG_HOST': JSON.stringify(posthogHost) },
  plugins: [react(), siteUrlPlugin, seoPlugin],
  // Local stand-in for the Vercel function in api/deezer.js so the Music app's search works under `npm run dev`.
  server: { proxy: { '/api/deezer': { target: 'https://api.deezer.com', changeOrigin: true, rewrite: p => p.replace(/^\/api\/deezer/, '/search') } } },
  build: {
    chunkSizeWarningLimit: 700,
    // A second, standalone page: /blog/Privacy-Theater. Its own bundle, so none of the site's
    // analytics or React code loads there.
    rollupOptions: { input: { main: 'index.html', privacyTheater: 'blog/Privacy-Theater/index.html' } },
  },
  // The local model runs in a module worker that imports WebLLM.
  worker: { format: 'es' },
  test: { globals: true, environment: 'jsdom', setupFiles: './src/test/setup.js', exclude: ['e2e/**', 'node_modules/**', 'dist/**'] },
  }
})
