// Build-time SEO: static, crawlable HTML generated from src/content.
// Everything here is rendered from the same data the OS apps show, so the
// no-JavaScript HTML and the interactive site say the same things.

import { profile } from '../../src/content/profile.js'
import { projects } from '../../src/content/projects.js'
import { resume } from '../../src/content/resume.js'

export const SITE_URL = 'https://shouryadav.info'
export { projects }

// Profiles linked from the page and listed in Person.sameAs.
export const PROFILES = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/shouryadav/' },
  { label: 'GitHub', url: 'https://github.com/shourya0523' },
  { label: 'Devpost', url: 'https://devpost.com/shourya0523' },
]

export const HOME_TITLE = 'Shourya Yadav · Healthcare Research, AI and Fintech at Northeastern'
export const HOME_DESCRIPTION = 'Shourya Yadav studies Computer Science and Business (Fintech) at Northeastern. Junior Healthcare Research Associate at M3 USA and Software Tech Lead at ACM.'
export const OG_IMAGE_ALT = 'Shourya Yadav. Junior Healthcare Research Associate at M3 USA and Software Tech Lead at ACM at Northeastern University.'

export const BLOG = {
  path: '/blog/Privacy-Theater',
  title: 'Privacy Theater: You Never Agreed to This',
  description: 'An interactive show about the data you never agreed to give away, and how to take it back with AI that runs on your own device.',
}

export const projectPath = p => `/projects/${p.id}`
export const abs = path => SITE_URL + path

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const isCurrent = item => /present/i.test(item.period || '')
const clip = (s, n = 158) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)).replace(/[,;:]$/, '') + '…')

// Roles from the resume that are ongoing, in display order.
export const currentRoles = () => [
  ...resume.experience.filter(isCurrent).map(e => ({ role: e.role, org: e.org, period: e.period })),
  ...resume.leadership.filter(l => isCurrent(l) || !l.period).map(l => ({ role: l.role, org: l.org, period: l.period })),
]

const education = resume.education[0]

// The roles named in the one-line summary (the full list is rendered on the page).
const SUMMARY_ORGS = ['M3 USA', 'ACM at Northeastern University', 'Student Government Association of Northeastern University']

export const summary = () =>
  `Shourya Yadav is a ${education.degree.replace(/^B\.S\. in /, '')} student at Northeastern University, concentrating in ${profile.school.concentration} (${education.period.replace(/^Expected/, 'expected')}). ` +
  `Current roles: ${SUMMARY_ORGS.map(org => currentRoles().find(r => r.org === org)).filter(Boolean).map(r => `${r.role} at ${r.org}`).join('; ')}.`

// ---------- JSON-LD ----------

const PERSON_ID = `${SITE_URL}/#person`
const WEBSITE_ID = `${SITE_URL}/#website`

export const personRef = { '@type': 'Person', '@id': PERSON_ID, name: profile.name, url: `${SITE_URL}/` }

const isoMonth = period => {
  const m = /^(\w+)\s+(\d{4})/.exec(period || '')
  if (!m) return undefined
  const i = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].indexOf(m[1].toLowerCase())
  return i < 0 ? undefined : `${m[2]}-${String(i + 1).padStart(2, '0')}`
}

export function personSchema() {
  const job = resume.experience.find(isCurrent)
  const roles = resume.leadership.filter(l => isCurrent(l) || !l.period)
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.name,
    url: `${SITE_URL}/`,
    description: summary(),
    email: `mailto:${profile.links.email}`,
    jobTitle: job.role,
    worksFor: { '@type': 'Organization', name: job.org },
    memberOf: roles.map(l => ({
      '@type': 'OrganizationRole',
      roleName: l.role,
      ...(isoMonth(l.period) ? { startDate: isoMonth(l.period) } : {}),
      memberOf: { '@type': 'Organization', name: l.org },
    })),
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Northeastern University', url: 'https://www.northeastern.edu' },
    knowsAbout: ['Artificial intelligence', 'Healthcare', 'Fintech', 'Data engineering', 'Natural language processing', ...profile.skills.languages.slice(0, 4)],
    award: resume.awards.slice(0, 3).map(a => a.title),
    sameAs: PROFILES.map(p => p.url),
  }
}

export const websiteSchema = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: profile.name,
  description: HOME_DESCRIPTION,
  inLanguage: 'en',
  publisher: { '@id': PERSON_ID },
})

export const homeJsonLd = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    websiteSchema(),
    { '@type': 'ProfilePage', '@id': `${SITE_URL}/#profilepage`, url: `${SITE_URL}/`, name: HOME_TITLE, isPartOf: { '@id': WEBSITE_ID }, mainEntity: { '@id': PERSON_ID } },
    personSchema(),
  ],
})

const breadcrumbs = items => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
})

const ownRepo = p => p.github && /github\.com\/[^/]+\/[^/]+/.test(p.github)

export const projectJsonLd = p => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ownRepo(p) ? 'SoftwareSourceCode' : 'CreativeWork',
      '@id': `${abs(projectPath(p))}#project`,
      name: p.title,
      description: p.blurb,
      url: abs(projectPath(p)),
      author: personRef,
      keywords: p.tech.join(', '),
      ...(ownRepo(p) ? { codeRepository: p.github } : {}),
      ...(p.demo ? { sameAs: [p.demo] } : {}),
    },
    breadcrumbs([['Home', '/'], ['Projects', '/projects'], [p.title, projectPath(p)]]),
  ],
})

export const projectsIndexJsonLd = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      url: abs('/projects'),
      name: `Projects by ${profile.name}`,
      isPartOf: { '@id': WEBSITE_ID },
      author: personRef,
      mainEntity: { '@type': 'ItemList', itemListElement: projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(projectPath(p)), name: p.title })) },
    },
    breadcrumbs([['Home', '/'], ['Projects', '/projects']]),
  ],
})

export const blogJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  '@id': `${abs(BLOG.path)}#post`,
  headline: BLOG.title,
  description: BLOG.description,
  url: abs(BLOG.path),
  mainEntityOfPage: abs(BLOG.path),
  inLanguage: 'en',
  author: personRef,
  isPartOf: { '@type': 'WebSite', '@id': WEBSITE_ID, url: `${SITE_URL}/` },
})

export const jsonLdTag = data => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

// ---------- HTML ----------

const ext = (href, text) => `<a href="${esc(href)}" rel="noopener">${esc(text)}</a>`
const entry = (title, sub, period, bullets = []) =>
  `<li><h3>${esc(title)}</h3><p class="seo-meta">${esc(sub)}${period ? ` · ${esc(period)}` : ''}</p>${bullets.length ? `<ul>${bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}</li>`

// The text version of the homepage. It sits inside #root, so React replaces it when the OS boots.
export function homeStaticHtml() {
  const roles = currentRoles()
  return `<div class="seo-doc" data-seo>
<header><p class="seo-kicker">${esc(profile.headline)}</p><h1>${esc(profile.name)}</h1><p class="seo-lede">${esc(summary())}</p>
<p class="seo-note">This is the text version of the site. With JavaScript on, it opens ShouryaOS, an interactive portfolio.</p></header>
<main>
<section aria-labelledby="seo-about"><h2 id="seo-about">About</h2>${profile.bio.map(p => `<p>${esc(p)}</p>`).join('')}</section>
<section aria-labelledby="seo-now"><h2 id="seo-now">Current roles</h2><ul class="seo-list">${roles.map(r => entry(r.role, r.org, r.period)).join('')}</ul></section>
<section aria-labelledby="seo-exp"><h2 id="seo-exp">Experience</h2><ul class="seo-list">${resume.experience.filter(e => !isCurrent(e)).map(e => entry(e.role, `${e.org} · ${e.location}`, e.period, e.bullets)).join('')}</ul></section>
<section aria-labelledby="seo-lead"><h2 id="seo-lead">Leadership</h2><ul class="seo-list">${resume.leadership.map(l => entry(l.role, `${l.org} · ${l.location}`, l.period, l.bullets)).join('')}</ul></section>
<section aria-labelledby="seo-awards"><h2 id="seo-awards">Awards</h2><ul class="seo-list">${resume.awards.map(a => entry(a.title, a.org, a.year, [a.description])).join('')}</ul></section>
<section aria-labelledby="seo-projects"><h2 id="seo-projects">Projects</h2><ul class="seo-list">${projects.map(p => `<li><h3><a href="${projectPath(p)}">${esc(p.title)}</a></h3><p class="seo-meta">${esc(p.period)}</p><p>${esc(p.blurb)}</p></li>`).join('')}</ul><p><a href="/projects">All projects</a></p></section>
<section aria-labelledby="seo-writing"><h2 id="seo-writing">Writing</h2><ul class="seo-list"><li><h3><a href="${BLOG.path}">${esc(BLOG.title)}</a></h3><p>${esc(BLOG.description)}</p></li></ul></section>
<section aria-labelledby="seo-edu"><h2 id="seo-edu">Education</h2><ul class="seo-list">${entry(education.degree, education.school, education.period, education.details)}</ul></section>
<section aria-labelledby="seo-contact"><h2 id="seo-contact">Contact</h2><ul><li>Email: <a href="mailto:${esc(profile.links.email)}">${esc(profile.links.email)}</a></li>${PROFILES.map(p => `<li>${esc(p.label)}: ${ext(p.url, p.url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, ''))}</li>`).join('')}</ul></section>
</main></div>`
}

// Shared look for the static pages and the pre-boot text version: the site's ink palette and type.
export const STATIC_CSS = `
.seo-doc{position:fixed;inset:0;overflow:auto;background:#0e1a20;color:#ece6d8;font:400 17px/1.6 'Chillax',system-ui,-apple-system,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;padding:56px 16px 80px;box-sizing:border-box}
.seo-doc>*{max-width:720px;margin-left:auto;margin-right:auto}
.seo-doc h1,.seo-doc h2,.seo-doc h3{font-family:'Erode',Georgia,'Times New Roman',serif;font-weight:600;line-height:1.15;color:#f4dcb2}
.seo-doc h1{font-size:clamp(40px,7vw,64px);margin:8px 0 16px}
.seo-doc h2{font-size:26px;margin:48px 0 12px;padding-top:16px;border-top:1px solid rgba(236,230,216,.12)}
.seo-doc h3{font-size:19px;margin:0 0 2px}
.seo-doc a{color:#f0a35e}
.seo-doc footer{margin-top:48px}
.seo-doc footer a{margin-right:16px}
.seo-doc header{margin-top:16px}
.seo-kicker,.seo-meta{font-size:13px;letter-spacing:.06em;color:rgba(236,230,216,.62);margin:0}
.seo-kicker{text-transform:uppercase;letter-spacing:.2em;color:#f0a35e}
.seo-lede{font-size:20px;color:#ece6d8}
.seo-note{font-size:14px;color:rgba(236,230,216,.62)}
.seo-list{list-style:none;padding:0}
.seo-list>li{margin:0 0 20px}
.seo-list ul{margin:6px 0 0;padding-left:20px;color:rgba(236,230,216,.82)}
.seo-tags{display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0}
.seo-tags li{border:1px solid rgba(236,230,216,.2);border-radius:999px;padding:2px 12px;font-size:14px}
`.trim()

function page({ path, title, description, jsonLd, body, type = 'website' }) {
  const url = abs(path)
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${url}" />
<meta name="author" content="${esc(profile.name)}" />
<meta name="theme-color" content="#0e1a20" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="stylesheet" href="/fonts/fonts.css" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:type" content="${type}" />
<meta property="og:site_name" content="${esc(profile.name)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${SITE_URL}/og.png" />
<meta property="og:image:alt" content="${esc(OG_IMAGE_ALT)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${SITE_URL}/og.png" />
<style>html,body{margin:0;background:#0e1a20}${STATIC_CSS}</style>
${jsonLdTag(jsonLd)}
</head>
<body>
<div class="seo-doc">
${body}
<footer><nav aria-label="Site"><a href="/">Home</a><a href="/projects">Projects</a><a href="${BLOG.path}">Privacy Theater</a></nav></footer>
</div>
</body>
</html>
`
}

// Up to three related projects: shared tech first, then neighbours in the list.
export function relatedProjects(p) {
  const others = projects.filter(o => o.id !== p.id)
  const score = o => o.tech.filter(t => p.tech.includes(t)).length
  return [...others].sort((a, b) => score(b) - score(a) || projects.indexOf(a) - projects.indexOf(b)).slice(0, 3)
}

export function projectPageHtml(p) {
  const links = [p.github && [p.github, ownRepo(p) ? 'Source on GitHub' : 'GitHub profile'], p.demo && [p.demo, p.demoLabel || 'Link']].filter(Boolean)
  const body = `<nav aria-label="Breadcrumb"><a href="/">Shourya Yadav</a> / <a href="/projects">Projects</a></nav>
<header><p class="seo-kicker">Project · ${esc(p.period)}</p><h1>${esc(p.title)}</h1>
<p class="seo-lede">${esc(p.title)} is a project by ${esc(profile.name)}. ${esc(p.blurb)}</p></header>
<main>
${p.description.length > 1 ? `<section><h2>About the project</h2>${p.description.slice(1).map(d => `<p>${esc(d)}</p>`).join('')}</section>` : ''}
${p.highlights.length ? `<section><h2>Highlights</h2><ul>${p.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul></section>` : ''}
<section><h2>Built with</h2><ul class="seo-tags">${p.tech.map(t => `<li>${esc(t)}</li>`).join('')}</ul></section>
${links.length ? `<section><h2>Links</h2><ul>${links.map(([h, t]) => `<li>${ext(h, t)}</li>`).join('')}</ul></section>` : ''}
<section><h2>Related projects</h2><ul class="seo-list">${relatedProjects(p).map(o => `<li><h3><a href="${projectPath(o)}">${esc(o.title)}</a></h3><p>${esc(o.blurb)}</p></li>`).join('')}</ul>
<p><a href="/projects">All projects</a> · <a href="/">About ${esc(profile.firstName)}</a></p></section>
</main>`
  return page({ path: projectPath(p), title: `${p.title} · Project by ${profile.name}`, description: clip(`${p.title}: ${p.blurb}`), jsonLd: projectJsonLd(p), body })
}

export function projectsIndexHtml() {
  const body = `<nav aria-label="Breadcrumb"><a href="/">Shourya Yadav</a></nav>
<header><p class="seo-kicker">Projects</p><h1>Projects by ${esc(profile.name)}</h1>
<p class="seo-lede">${projects.length} projects by ${esc(profile.name)} across AI, healthcare, fintech and developer tools, from hackathon winners to products in active development.</p></header>
<main><ul class="seo-list">${projects.map(p => `<li><h2><a href="${projectPath(p)}">${esc(p.title)}</a></h2><p class="seo-meta">${esc(p.period)} · ${esc(p.tech.join(', '))}</p><p>${esc(p.blurb)}</p></li>`).join('')}</ul></main>`
  return page({ path: '/projects', title: `Projects · ${profile.name}`, description: clip(`Projects by ${profile.name}: ${projects.map(p => p.title).join(', ')}.`), jsonLd: projectsIndexJsonLd(), body })
}

// ---------- crawl files ----------

export const sitemapPaths = () => ['/', '/projects', ...projects.map(projectPath), BLOG.path]

export const sitemapXml = () => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPaths().map(p => `  <url><loc>${abs(p)}</loc></url>`).join('\n')}
</urlset>
`

export const llmsTxt = () => `# ${profile.name}

> ${summary()}

${profile.name}'s portfolio at ${SITE_URL} is an interactive, OS-style site. The pages below are plain HTML versions of the same content.

## Pages

- [Home](${SITE_URL}/): bio, current roles, experience, leadership, awards, projects, education and contact
- [Projects](${SITE_URL}/projects): all projects
- [${BLOG.title}](${abs(BLOG.path)}): ${BLOG.description}

## Projects

${projects.map(p => `- [${p.title}](${abs(projectPath(p))}): ${p.blurb}`).join('\n')}

## Profiles

${PROFILES.map(p => `- [${p.label}](${p.url})`).join('\n')}
- Email: ${profile.links.email}
`
