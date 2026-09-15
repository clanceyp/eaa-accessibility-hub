// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import NewsCard from '../../../app/components/NewsCard.vue'
import type { NewsEntry } from '../../../server/api/news.get'

const franceEntry: NewsEntry = {
  id: 'carrefour-france-accessibility-ruling-2026',
  title: 'French court orders Carrefour to make e-commerce site and app fully accessible',
  summary: 'The Tribunal judiciaire de Caen ruled in favour of disability associations.',
  category: 'Rulings & Enforcement',
  jurisdiction: 'France',
  date: '2026-06-04',
  sourceUrl: 'https://droitpluriel.fr/decision',
  sourceName: 'Droit Pluriel'
}

const unmappedJurisdictionEntry: NewsEntry = {
  ...franceEntry,
  id: 'unmapped-jurisdiction',
  jurisdiction: 'Wonderland'
}

describe('NewsCard', () => {
  it('renders a flag chip for a recognised jurisdiction', async () => {
    const wrapper = await mountSuspended(NewsCard, { props: { entry: franceEntry } })

    expect(wrapper.text()).toContain('France')
    expect(wrapper.text()).toContain('🇫🇷')
    expect(wrapper.find('.tag').exists()).toBe(false)
  })

  it('falls back to the plain .tag pill for an unrecognised jurisdiction', async () => {
    const wrapper = await mountSuspended(NewsCard, { props: { entry: unmappedJurisdictionEntry } })

    expect(wrapper.find('.tag').exists()).toBe(true)
    expect(wrapper.find('.tag').text()).toBe('Wonderland')
  })

  it('gives the external link an accessible name combining the title and publication, and marks it as opening in a new tab', async () => {
    const wrapper = await mountSuspended(NewsCard, { props: { entry: franceEntry } })
    const link = wrapper.find('a[target="_blank"]')

    expect(link.exists()).toBe(true)
    expect(link.attributes('title')).toBe('Opens in a new tab')
    expect(link.attributes('rel')).toContain('noopener')
    expect(link.attributes('aria-label')).toBe(
      `${franceEntry.title}. Read at ${franceEntry.sourceName} (opens in a new tab)`
    )

    const icon = link.find('svg')
    expect(icon.attributes('aria-hidden')).toBe('true')
  })

  it('formats the date as a readable, machine-parseable <time> element', async () => {
    const wrapper = await mountSuspended(NewsCard, { props: { entry: franceEntry } })
    const time = wrapper.find('time')

    expect(time.attributes('datetime')).toBe('2026-06-04')
    expect(time.text()).toBe('4 June 2026')
  })
})
