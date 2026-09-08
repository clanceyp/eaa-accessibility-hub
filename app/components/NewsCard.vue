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
        class="inline-flex items-stretch overflow-hidden rounded-l-full bg-tint text-sm font-medium text-navy"
      >
        <span class="flex items-center py-1 pl-3 pr-2">{{ entry.jurisdiction }}</span>
        <span class="flex items-center justify-center px-1.5 text-base leading-none" aria-hidden="true">{{ flag }}</span>
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

    <a :href="entry.sourceUrl" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-primary underline underline-offset-2 hover:decoration-2">
      Read at {{ entry.sourceName }} ↗
    </a>
  </article>
</template>
