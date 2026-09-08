<script setup lang="ts">
import type { TimelineEntry } from '~~/server/api/timeline.get'

const { data: entries } = await useFetch<TimelineEntry[]>('/api/timeline')

const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

function formatDate(entry: TimelineEntry) {
  return dateFormatter.format(new Date(entry.date))
}

useHead({
  title: 'Timeline — EAA Accessibility Hub'
})
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-eu-linemap text-white">
      <HeroMapBackground />
      <div class="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <h1 class="text-5xl font-light">
          EAA Timeline
        </h1>
        <p class="mt-4 max-w-xl text-white/85">
          Key milestones for EN 301 549 and the European Accessibility Act
          - version releases, transposition deadlines and compliance
          dates.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-3xl px-6 py-16">
      <ol class="relative border-l-2 border-border pl-8">
        <li v-for="entry in entries" :key="entry.id" class="mb-10 last:mb-0">
          <span
            class="absolute -ml-[calc(2rem+7px)] -mt-px h-3 w-3 rounded-full border-2 bg-white"
            :class="entry.status === 'expected' ? 'border-dashed border-secondary' : 'border-primary'"
            aria-hidden="true"
          />
          <div class="flex flex-wrap items-center gap-2 -translate-y-[5px]">
            <time :datetime="entry.date" class="text-sm font-medium" :class="entry.status === 'expected' ? 'text-primary' : 'text-primary'">
              <strong v-if="entry.status === 'expected'" class="text-secondary">Expected: </strong>
              {{ formatDate(entry) }}
            </time>
            <span v-if="entry.status === 'expected'" class="tag">Forecast</span>
          </div>
          <h2 class="mt-1 text-xl font-medium text-navy">
            {{ entry.title }}
          </h2>
          <p class="mt-2 leading-relaxed text-muted">
            {{ entry.detail }}
          </p>
        </li>
      </ol>
    </section>
  </div>
</template>
