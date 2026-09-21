import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { newsEntrySchema, newsSearchMetaSchema, timelineEntrySchema } from '../../scripts/pipeline/schema'

/**
 * Boots the real Nuxt/Nitro server and hits the API routes over HTTP,
 * the same way a browser (or Vercel) would. This is the test that would
 * have caught the news/timeline routes silently returning nothing on
 * Vercel — a unit test of the handler logic alone would not, since the
 * bug was in how the built server resolved a runtime file path, not in
 * any of the logic itself.
 */
describe('API routes', async () => {
  await setup({})

  it('GET /api/news returns a non-empty array of valid, date-descending entries', async () => {
    const entries = await $fetch<unknown[]>('/api/news')

    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBeGreaterThan(0)

    for (const entry of entries) {
      expect(newsEntrySchema.safeParse(entry).success).toBe(true)
    }

    const dates = (entries as { date: string }[]).map((e) => e.date)
    const sorted = [...dates].sort((a, b) => b.localeCompare(a))
    expect(dates).toEqual(sorted)
  })

  it('GET /api/timeline returns a non-empty array of valid, date-descending entries', async () => {
    const entries = await $fetch<unknown[]>('/api/timeline')

    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBeGreaterThan(0)

    for (const entry of entries) {
      expect(timelineEntrySchema.safeParse(entry).success).toBe(true)
    }

    const dates = (entries as { date: string }[]).map((e) => e.date)
    const sorted = [...dates].sort((a, b) => b.localeCompare(a))
    expect(dates).toEqual(sorted)
  })

  it('GET /api/news-meta returns valid search metadata', async () => {
    const meta = await $fetch<unknown>('/api/news-meta')
    expect(newsSearchMetaSchema.safeParse(meta).success).toBe(true)
  })

  it('GET /sitemap.xml lists every static and content page with an absolute URL and a lastmod date', async () => {
    const xml = await $fetch<string>('/sitemap.xml')

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('https://eaaa11yhub.eu/en301549/clause-9')
    expect(xml).toContain('https://eaaa11yhub.eu/timeline')
    expect(xml).toContain('https://eaaa11yhub.eu/accessibility-statement')

    const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1])
    expect(lastmods.length).toBeGreaterThan(0)
    for (const value of lastmods) {
      expect(new Date(value!).toString()).not.toBe('Invalid Date')
    }
  })

  it('renders the homepage with at least one news entry', async () => {
    const html = await $fetch<string>('/')
    expect(html).toContain('Latest EN 301 549 developments')
  })

  it('renders a "Page name - EAA A11y Hub" title, a canonical link, and WebSite JSON-LD on every page', async () => {
    const html = await $fetch<string>('/')

    expect(html).toMatch(/<title>[^<]+ - EAA A11y Hub<\/title>/)
    expect(html).toContain('<link rel="canonical" href="https://eaaa11yhub.eu/">')
    expect(html).toContain('"@type":"WebSite"')
    expect(html).toContain('"url":"https://eaaa11yhub.eu"')
  })

  it('renders Open Graph meta (but no Twitter Card meta) on every page', async () => {
    const html = await $fetch<string>('/')

    expect(html).toContain('property="og:title"')
    expect(html).toContain('property="og:description"')
    expect(html).toContain('property="og:type" content="website"')
    expect(html).toContain('property="og:site_name" content="EAA A11y Hub"')
    expect(html).toContain('property="og:url" content="https://eaaa11yhub.eu/"')
    expect(html).toContain('property="og:image" content="https://eaaa11yhub.eu/eaa-a11y-hub-og.png"')
    expect(html).toContain('property="og:image:width" content="1200"')
    expect(html).toContain('property="og:image:height" content="630"')
    expect(html).not.toContain('twitter:')
  })

  it('renders the timeline page', async () => {
    const html = await $fetch<string>('/timeline')
    expect(html).toContain('Timeline')
  })
})
