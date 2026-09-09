import { describe, expect, it } from 'vitest'
import { slugify, uniqueId } from '../../../scripts/pipeline/slugify'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('French court orders Carrefour')).toBe('french-court-orders-carrefour')
  })

  it('strips accents', () => {
    expect(slugify('Décision Tribunal judiciaire')).toBe('decision-tribunal-judiciaire')
  })

  it('collapses runs of non-alphanumeric characters into one hyphen', () => {
    expect(slugify('90,000 € fine!! -- confirmed')).toBe('90-000-fine-confirmed')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  --already hyphenated--  ')).toBe('already-hyphenated')
  })

  it('truncates to 60 characters', () => {
    const long = 'a'.repeat(100)
    const result = slugify(long)
    expect(result.length).toBe(60)
  })

  it('is stable for entries already used as ids in data/news.json', () => {
    // date-title slug shape used by slugId() in run-update.ts
    expect(slugify('2026-06-04-French court orders Carrefour to make e-commerce site and app fully accessible'))
      .toBe('2026-06-04-french-court-orders-carrefour-to-make-e-commerce-')
  })
})

describe('uniqueId', () => {
  it('returns the base id when there is no collision', () => {
    expect(uniqueId('france-carrefour', new Set())).toBe('france-carrefour')
  })

  it('appends -2 on a single collision', () => {
    const existing = new Set(['france-carrefour'])
    expect(uniqueId('france-carrefour', existing)).toBe('france-carrefour-2')
  })

  it('keeps incrementing past multiple collisions', () => {
    const existing = new Set(['france-carrefour', 'france-carrefour-2', 'france-carrefour-3'])
    expect(uniqueId('france-carrefour', existing)).toBe('france-carrefour-4')
  })

  it('does not mutate the existingIds set', () => {
    const existing = new Set(['france-carrefour'])
    uniqueId('france-carrefour', existing)
    expect(existing.size).toBe(1)
  })
})
