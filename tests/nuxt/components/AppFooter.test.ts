// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import AppFooter from '../../../app/components/AppFooter.vue'

describe('AppFooter', () => {
  it('shows "Last updated" from /api/news-meta, not a content entry date', async () => {
    registerEndpoint('/api/news-meta', () => ({ lastSearchedAt: '2026-09-16' }))

    const wrapper = await mountSuspended(AppFooter)

    const time = wrapper.find('time')
    expect(time.exists()).toBe(true)
    expect(time.attributes('datetime')).toBe('2026-09-16')
    expect(wrapper.text()).toContain('Last updated:')
  })

  it('credits Inclusive Interface with a link to inclusiveinterface.co.uk', async () => {
    registerEndpoint('/api/news-meta', () => ({ lastSearchedAt: '2026-09-16' }))

    const wrapper = await mountSuspended(AppFooter)
    const link = wrapper.find('a[href="https://inclusiveinterface.co.uk/"]')

    expect(link.exists()).toBe(true)
    expect(link.attributes('rel')).toContain('noopener')
  })
})
