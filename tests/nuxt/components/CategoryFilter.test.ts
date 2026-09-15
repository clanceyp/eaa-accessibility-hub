// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CategoryFilter from '../../../app/components/CategoryFilter.vue'

const categories = ['Rulings & Enforcement', 'Monitoring Reports']

describe('CategoryFilter', () => {
  it('renders an "All" option plus one radio per given category', async () => {
    const wrapper = await mountSuspended(CategoryFilter, {
      props: { categories, modelValue: 'all' }
    })

    const radios = wrapper.findAll('[role="radio"]')
    expect(radios.map((r) => r.text())).toEqual(['All', ...categories])
  })

  it('uses the radiogroup pattern: container role, per-option aria-checked, roving tabindex', async () => {
    const wrapper = await mountSuspended(CategoryFilter, {
      props: { categories, modelValue: 'Monitoring Reports' }
    })

    expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true)

    const radios = wrapper.findAll('[role="radio"]')
    const checked = radios.find((r) => r.text() === 'Monitoring Reports')!
    const unchecked = radios.find((r) => r.text() === 'All')!

    expect(checked.attributes('aria-checked')).toBe('true')
    expect(checked.attributes('tabindex')).toBe('0')
    expect(unchecked.attributes('aria-checked')).toBe('false')
    expect(unchecked.attributes('tabindex')).toBe('-1')
  })

  it('emits update:modelValue when an option is clicked', async () => {
    const wrapper = await mountSuspended(CategoryFilter, {
      props: { categories, modelValue: 'all' }
    })

    const radios = wrapper.findAll('[role="radio"]')
    await radios.find((r) => r.text() === 'Rulings & Enforcement')!.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Rulings & Enforcement'])
  })

  it('moves selection with ArrowRight, wrapping to the first option at the end', async () => {
    const wrapper = await mountSuspended(CategoryFilter, {
      props: { categories, modelValue: 'Monitoring Reports' }
    })

    const radios = wrapper.findAll('[role="radio"]')
    const lastOption = radios[radios.length - 1]!
    await lastOption.trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['all'])
  })

  it('moves selection with ArrowLeft to the previous option', async () => {
    const wrapper = await mountSuspended(CategoryFilter, {
      props: { categories, modelValue: 'Monitoring Reports' }
    })

    const radios = wrapper.findAll('[role="radio"]')
    const checkedIndex = radios.findIndex((r) => r.text() === 'Monitoring Reports')
    await radios[checkedIndex]!.trigger('keydown', { key: 'ArrowLeft' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Rulings & Enforcement'])
  })
})
