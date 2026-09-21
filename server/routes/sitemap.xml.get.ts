import { queryCollection } from '@nuxt/content/server'
import { SITE_URL } from '../../shared/site'

// Pages that aren't part of the @nuxt/content collection (they're plain
// Vue pages, not Markdown files under content/).
const staticPaths = ['/', '/timeline', '/en301549']

function toUrlEntry(path: string, lastmod: string): string {
  return `<url><loc>${SITE_URL}${path}</loc><lastmod>${lastmod}</lastmod></url>`
}

export default defineEventHandler(async (event) => {
  const contentPages = await queryCollection(event, 'content').all()
  const contentPaths = contentPages.map((page) => page.path)

  // One lastmod for every URL: content here only changes via a PR merge,
  // which triggers a fresh build for the whole site, so there's no
  // meaningful per-page "last modified" signal finer than that.
  const lastmod = useRuntimeConfig(event).public.buildTime

  const urls = [...staticPaths, ...contentPaths].map((path) => toUrlEntry(path, lastmod)).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`

  setHeader(event, 'content-type', 'application/xml')
  return xml
})
