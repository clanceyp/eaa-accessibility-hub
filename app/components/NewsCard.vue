<script setup lang="ts">
import type { NewsEntry } from '~~/server/api/news.get'

const props = defineProps<{ entry: NewsEntry }>()

const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

function formatDate(date: string) {
  return dateFormatter.format(new Date(date))
}

const flag = computed(() => jurisdictionFlagEmoji(props.entry.jurisdiction))
</script>

<template>
  <article class="card">
    <div class="mb-3 flex flex-wrap items-center gap-3">
      <span
        v-if="flag"
        class="inline-flex items-stretch overflow-hidden rounded-full bg-tint text-sm font-medium text-navy"
      >
        <span class="flex items-center py-1 pl-3 pr-2">{{ entry.jurisdiction }}</span>
        <span class="flex items-center justify-center pr-3 text-base leading-none" aria-hidden="true">{{ flag }}</span>
      </span>
      <span v-else class="tag">{{ entry.jurisdiction }}</span>
      <time :datetime="entry.date" class="text-sm text-muted">{{ formatDate(entry.date) }}</time>
    </div>

    <h3 class="mb-2 text-xl font-medium text-navy">
      {{ entry.title }}
    </h3>

    <p class="mb-4 leading-relaxed text-muted">
      {{ entry.summary }}
    </p>

    <a
      :href="entry.sourceUrl"
      target="_blank"
      rel="noopener noreferrer"
      title="Opens in a new tab"
      class="inline-flex items-center gap-1 text-sm font-medium text-primary underline underline-offset-2 hover:decoration-2"
    >
      Read at {{ entry.sourceName }}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5 flex-none" aria-hidden="true">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
      <span class="sr-only">. opens in a new tab</span>
    </a>
  </article>
</template>
