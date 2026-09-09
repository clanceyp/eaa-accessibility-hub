import { describe, expect, it } from 'vitest'
import newsData from '../../../data/news.json'
import timelineData from '../../../data/timeline.json'
import { newsEntrySchema, timelineEntrySchema } from '../../../scripts/pipeline/schema'

describe('data/news.json', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(newsData)).toBe(true)
    expect(newsData.length).toBeGreaterThan(0)
  })

  it.each(newsData.map((entry) => [entry.id, entry] as const))('%s matches the news entry schema', (_id, entry) => {
    const result = newsEntrySchema.safeParse(entry)
    expect(result.success, result.success ? '' : JSON.stringify(result.error?.issues)).toBe(true)
  })

  it('has no duplicate ids', () => {
    const ids = newsData.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has no duplicate sourceUrls', () => {
    const urls = newsData.map((entry) => entry.sourceUrl)
    expect(new Set(urls).size).toBe(urls.length)
  })
})

describe('data/timeline.json', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(timelineData)).toBe(true)
    expect(timelineData.length).toBeGreaterThan(0)
  })

  it.each(timelineData.map((entry) => [entry.id, entry] as const))('%s matches the timeline entry schema', (_id, entry) => {
    const result = timelineEntrySchema.safeParse(entry)
    expect(result.success, result.success ? '' : JSON.stringify(result.error?.issues)).toBe(true)
  })

  it('has no duplicate ids', () => {
    const ids = timelineData.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
