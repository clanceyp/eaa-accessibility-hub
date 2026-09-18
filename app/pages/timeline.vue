<script setup lang="ts">
import type { TimelineEntry } from '~~/server/api/timeline.get'

const { data: entries } = await useFetch<TimelineEntry[]>('/api/timeline')

const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

function formatDate(entry: TimelineEntry) {
  return dateFormatter.format(new Date(entry.date))
}

// One <ol> per year that actually has an entry — /api/timeline returns
// entries sorted newest-first, so a year's entries are always contiguous
// and this grouping never needs to consider years with no data.
interface YearGroup {
  year: string
  entries: TimelineEntry[]
}

const yearGroups = computed<YearGroup[]>(() => {
  const groups: YearGroup[] = []

  for (const entry of entries.value ?? []) {
    const year = entry.date.slice(0, 4)
    const currentGroup = groups.at(-1)

    if (currentGroup?.year === year) {
      currentGroup.entries.push(entry)
    } else {
      groups.push({ year, entries: [entry] })
    }
  }

  return groups
})

// last:mb-0 can't be used once entries are split across multiple <ol>
// elements (it would fire for every year's last entry, not just the
// final one overall), so the truly-last entry is tracked explicitly to
// keep the same spacing as the original single-list markup.
const lastEntryId = computed(() => {
  const lastGroup = yearGroups.value.at(-1)
  return lastGroup?.entries.at(-1)?.id
})

useHead({
  title: 'Timeline — EAA A11y Hub'
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
      <div class="relative border-l-2 border-border pl-8">
        <ol v-for="group in yearGroups" :key="group.year" :aria-label="`${group.year}`">
          <li v-for="entry in group.entries" :key="entry.id" class="mb-10" :class="{ 'mb-0': entry.id === lastEntryId }">
            <span
              :data-year="group.year"
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
            <a
              :href="entry.sourceUrl"
              target="_blank"
              rel="noopener noreferrer"
              title="Opens in a new tab"
              :aria-label="`${entry.title}. Source: ${entry.sourceName} (opens in a new tab)`"
              class="mt-2 inline-flex w-fit items-center gap-1 text-sm font-medium text-primary underline underline-offset-2 hover:decoration-2"
            >
              Source: {{ entry.sourceName }}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5 flex-none" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>
