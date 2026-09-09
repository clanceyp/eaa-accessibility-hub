import { describe, expect, it } from 'vitest'
import {
  newsDraftSchema,
  newsEntrySchema,
  timelineDraftSchema,
  timelineEntrySchema
} from '../../../scripts/pipeline/schema'

const validNewsDraft = {
  title: 'French court orders Carrefour to make e-commerce site fully accessible',
  summary: 'The Tribunal judiciaire de Caen ruled in favour of disability associations.',
  jurisdiction: 'France',
  date: '2026-06-04',
  sourceUrl: 'https://droitpluriel.fr/decision',
  sourceName: 'Droit Pluriel'
}

describe('newsDraftSchema', () => {
  it('accepts a valid draft', () => {
    expect(newsDraftSchema.safeParse(validNewsDraft).success).toBe(true)
  })

  it.each([
    ['title', ''],
    ['summary', ''],
    ['jurisdiction', ''],
    ['sourceName', '']
  ])('rejects an empty %s', (field, value) => {
    const result = newsDraftSchema.safeParse({ ...validNewsDraft, [field]: value })
    expect(result.success).toBe(false)
  })

  it('rejects a non-ISO date', () => {
    const result = newsDraftSchema.safeParse({ ...validNewsDraft, date: '4 June 2026' })
    expect(result.success).toBe(false)
  })

  it('rejects a sourceUrl that is not a valid URL', () => {
    const result = newsDraftSchema.safeParse({ ...validNewsDraft, sourceUrl: 'droitpluriel.fr' })
    expect(result.success).toBe(false)
  })
})

describe('newsEntrySchema', () => {
  it('requires an id in addition to the draft fields', () => {
    expect(newsEntrySchema.safeParse(validNewsDraft).success).toBe(false)
    expect(newsEntrySchema.safeParse({ ...validNewsDraft, id: 'carrefour-france-2026' }).success).toBe(true)
  })
})

const validTimelineDraft = {
  title: 'EN 301 549 V4.1.1 published',
  detail: 'Finalised version of EN 301 549, moving Clauses 9-11 to WCAG 2.2 AA.',
  date: '2026-09-01'
}

describe('timelineDraftSchema', () => {
  it('accepts a valid draft without status', () => {
    expect(timelineDraftSchema.safeParse(validTimelineDraft).success).toBe(true)
  })

  it('accepts status: "expected" for forecast entries', () => {
    const result = timelineDraftSchema.safeParse({ ...validTimelineDraft, status: 'expected' })
    expect(result.success).toBe(true)
  })

  it('rejects any status value other than "expected"', () => {
    const result = timelineDraftSchema.safeParse({ ...validTimelineDraft, status: 'confirmed' })
    expect(result.success).toBe(false)
  })

  it('rejects a non-ISO date', () => {
    const result = timelineDraftSchema.safeParse({ ...validTimelineDraft, date: '2026/09/01' })
    expect(result.success).toBe(false)
  })
})

describe('timelineEntrySchema', () => {
  it('requires an id in addition to the draft fields', () => {
    expect(timelineEntrySchema.safeParse(validTimelineDraft).success).toBe(false)
    expect(timelineEntrySchema.safeParse({ ...validTimelineDraft, id: 'en301549-v411-published' }).success).toBe(true)
  })
})
