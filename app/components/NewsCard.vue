<script setup lang="ts">
import type { NewsEntry } from '~~/server/api/news.get'

defineProps<{ entry: NewsEntry }>()

const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

function formatDate(date: string) {
  return dateFormatter.format(new Date(date))
}
</script>

<template>
  <article class="card">
    <div class="mb-3 flex flex-wrap items-center gap-3">
      <span class="tag">{{ entry.jurisdiction }}</span>
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
