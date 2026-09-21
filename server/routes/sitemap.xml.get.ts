import { queryCollection } from '@nuxt/content/server'
import { SITE_URL } from '../../shared/site'

// Pages that aren't part of the @nuxt/content collection (they're plain
// Vue pages, not Markdown files under content/).
const staticPaths = ['/', '/timeline', '/en301549']

function toUrlEntry(path: string): string {
  return `<url><loc>${SITE_URL}${path}</loc></url>`
}

export default defineEventHandler(async (event) => {
  const contentPages = await queryCollection(event, 'content').all()
  const contentPaths = contentPages.map((page) => page.path)

  const urls = [...staticPaths, ...contentPaths].map(toUrlEntry).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`

  setHeader(event, 'content-type', 'application/xml')
  return xml
})
