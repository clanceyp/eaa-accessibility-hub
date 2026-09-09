import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { newsEntrySchema, timelineEntrySchema } from '../../scripts/pipeline/schema'

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

  it('renders the homepage with at least one news entry', async () => {
    const html = await $fetch<string>('/')
    expect(html).toContain('Latest legal')
  })

  it('renders the timeline page', async () => {
    const html = await $fetch<string>('/timeline')
    expect(html).toContain('Timeline')
  })
})
