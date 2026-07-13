import { Router } from 'express'

const router = Router()

const pages = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/history', changefreq: 'weekly', priority: 0.7 },
  { path: '/about', changefreq: 'monthly', priority: 0.8 },
  { path: '/privacy-policy', changefreq: 'monthly', priority: 0.5 },
  { path: '/terms', changefreq: 'monthly', priority: 0.5 },
]

function getSiteUrl(req: any): string {
  return process.env.SITE_URL || `https://${req.headers.host || 'localhost:5000'}`
}

router.get('/robots.txt', (req, res) => {
  const siteUrl = getSiteUrl(req)
  const today = new Date().toISOString().split('T')[0]
  res.type('text/plain')
  res.send(`# sum up — robots.txt
# Updated: ${today}

# --- Global: allow all standard search crawlers ---
User-agent: *
Allow: /
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php

# --- Block AI training crawlers ---
User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: meta-externalagent
Disallow: /

User-agent: Google-Extended
Disallow: /

# --- Allow AI citation/answer crawlers ---
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml
`)
})

router.get('/sitemap.xml', (req, res) => {
  const siteUrl = getSiteUrl(req)
  const urls = pages.map(p =>
    `  <url>
    <loc>${siteUrl}${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority.toFixed(1)}</priority>
  </url>`
  ).join('\n')

  res.type('application/xml')
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`)
})

router.get('/sitemap.txt', (req, res) => {
  const siteUrl = getSiteUrl(req)
  const urls = pages.map(p => `${siteUrl}${p.path}`).join('\n')
  res.type('text/plain')
  res.send(urls)
})

export default router
