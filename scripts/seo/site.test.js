// @vitest-environment node
import { describe, test, expect } from 'vitest'
import { homeStaticHtml, homeJsonLd, blogJsonLd, projectJsonLd, projectsIndexJsonLd, projectPageHtml, projectsIndexHtml, sitemapXml, sitemapPaths, llmsTxt, projects, SITE_URL } from './site.js'

const count = (html, re) => (html.match(re) || []).length
const jsonLdBlocks = html => [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]))

describe('static SEO output', () => {
  test('homepage text version has one H1 and the core sections', () => {
    const html = homeStaticHtml()
    expect(count(html, /<h1[\s>]/g)).toBe(1)
    for (const s of ['Current roles', 'Experience', 'Awards', 'Projects', 'Writing', 'Education', 'Contact']) expect(html).toContain(`>${s}</h2>`)
    expect(html).toContain('Junior Healthcare Research Associate')
    expect(html).not.toMatch(/display:\s*none|visibility:\s*hidden/)
  })

  test('every project page has a unique title, one H1, a canonical URL and related links', () => {
    const titles = new Set()
    for (const p of projects) {
      const html = projectPageHtml(p)
      expect(count(html, /<h1[\s>]/g)).toBe(1)
      expect(html).toContain(`<link rel="canonical" href="${SITE_URL}/projects/${p.id}" />`)
      expect(html).toMatch(/<meta name="description" content="[^"]{40,}"/)
      expect(html).toContain('Related projects')
      titles.add(html.match(/<title>(.*?)<\/title>/)[1])
      expect(jsonLdBlocks(html)).toHaveLength(1)
    }
    expect(titles.size).toBe(projects.length)
    expect(count(projectsIndexHtml(), /<h1[\s>]/g)).toBe(1)
  })

  test('JSON-LD serializes and round-trips', () => {
    for (const data of [homeJsonLd(), blogJsonLd(), projectsIndexJsonLd(), ...projects.map(projectJsonLd)]) {
      expect(JSON.parse(JSON.stringify(data))['@context']).toBe('https://schema.org')
    }
    const person = homeJsonLd()['@graph'].find(n => n['@type'] === 'Person')
    expect(person.sameAs).toEqual(['https://www.linkedin.com/in/shouryadav/', 'https://github.com/shourya0523', 'https://devpost.com/shourya0523'])
    expect(person.worksFor.name).toBe('M3 USA')
  })

  test('sitemap lists the homepage, projects and the blog post', () => {
    const xml = sitemapXml()
    expect(sitemapPaths()).toHaveLength(projects.length + 3)
    expect(xml).toContain(`<loc>${SITE_URL}/blog/Privacy-Theater</loc>`)
  })

  test('no phone number in any generated file', () => {
    const all = [homeStaticHtml(), projectsIndexHtml(), sitemapXml(), llmsTxt(), ...projects.map(projectPageHtml)].join('\n')
    expect(all).not.toMatch(/\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/)
  })
})
