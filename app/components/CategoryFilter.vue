<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

/**
 * ARIA radiogroup pattern (WAI-ARIA APG): role="radiogroup" container,
 * role="radio" + aria-checked on each option, roving tabindex (only the
 * checked option is in the tab order), and arrow/Home/End keys both move
 * focus and change the selection — matching native <input type="radio">
 * behaviour. Plain <button> elements are used (not styled divs) so the
 * site's global :focus-visible outline applies with no extra wiring.
 */
const props = defineProps<{
  /** Distinct categories present in the data, in display order. */
  categories: string[]
  modelValue: string
  label?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const options = computed(() => [ALL_CATEGORIES, ...props.categories])

const optionEls = ref<(HTMLButtonElement | null)[]>([])

function setOptionEl(el: Element | ComponentPublicInstance | null, index: number) {
  optionEls.value[index] = el as HTMLButtonElement | null
}

function select(value: string) {
  if (value !== props.modelValue) emit('update:modelValue', value)
}

function onKeydown(event: KeyboardEvent, index: number) {
  const count = options.value.length
  let nextIndex: number

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      nextIndex = (index + 1) % count
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      nextIndex = (index - 1 + count) % count
      break
    case 'Home':
      nextIndex = 0
      break
    case 'End':
      nextIndex = count - 1
      break
    default:
      return
  }

  event.preventDefault()
  select(options.value[nextIndex]!)
  optionEls.value[nextIndex]?.focus()
}

function optionLabel(value: string) {
  return value === ALL_CATEGORIES ? 'All' : value
}
</script>

<template>
  <div>
    <span id="category-filter-label" class="mb-3 block text-sm font-medium text-navy">
      {{ label ?? 'Filter by category' }}
    </span>
    <div role="radiogroup" aria-labelledby="category-filter-label" class="flex flex-wrap gap-2">
      <button
        v-for="(option, index) in options"
        :key="option"
        :ref="(el) => setOptionEl(el, index)"
        type="button"
        role="radio"
        :aria-checked="option === modelValue"
        :tabindex="option === modelValue ? 0 : -1"
        class="rounded-full border-2 px-4 py-1.5 text-sm font-medium transition-colors"
        :class="option === modelValue
          ? 'border-primary bg-primary text-white'
          : 'border-border bg-white text-navy hover:bg-tint'"
        @click="select(option)"
        @keydown="onKeydown($event, index)"
      >
        {{ optionLabel(option) }}
      </button>
    </div>
  </div>
</template>
