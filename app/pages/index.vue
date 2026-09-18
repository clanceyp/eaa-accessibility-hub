<script setup lang="ts">
import type { NewsEntry } from '~~/server/api/news.get'
import { NEWS_CATEGORIES } from '~~/shared/news-categories'

const { data: news } = await useFetch<NewsEntry[]>('/api/news')

const selectedCategory = ref<string>(ALL_CATEGORIES)

// Only offer categories actually present in the data, in the taxonomy's
// canonical order — not every category the taxonomy defines.
const availableCategories = computed(() => {
  if (!news.value) return []
  const present = new Set(news.value.map((entry) => entry.category))
  return NEWS_CATEGORIES.filter((category) => present.has(category))
})

const filteredNews = computed(() => {
  if (!news.value) return []
  if (selectedCategory.value === ALL_CATEGORIES) return news.value
  return news.value.filter((entry) => entry.category === selectedCategory.value)
})

// Only updated on user-driven filter changes (not on initial data load),
// so screen readers announce filter results without a spurious
// announcement when the page first renders.
const filterAnnouncement = ref('')

watch(selectedCategory, () => {
  const count = filteredNews.value.length
  filterAnnouncement.value = `${count} article${count === 1 ? '' : 's'}`
})

useHead({
  title: 'EAA A11y Hub — EU accessibility legal & regulatory news'
})
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-eu-linemap text-white">
      <div class="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <h1 class="max-w-2xl text-5xl font-light leading-tight text-pretty">
          The EN 301 549 hub
        </h1>
        <p class="mt-6 max-w-xl text-lg text-white/85">
          Clause-by-clause reference, WCAG mappings, and EU enforcement
          news for developers and testers working to EN 301 549 - the
          standard behind the European Accessibility Act.
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <NuxtLink to="/en301549" class="btn-outline">
            EN 301 549 overview
            <span aria-hidden="true">→</span>
          </NuxtLink>
          <NuxtLink to="/timeline" class="btn-outline">
            View the timeline
            <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-16">
      <h2 class="mb-2 text-3xl font-medium text-navy">
        Latest EN 301 549 developments
      </h2>
      <p class="mb-10 max-w-2xl text-muted">
        Rulings and enforcement, regulatory guidance, standards updates,
        testing guidance, monitoring reports, research, vendor conformance,
        procurement notices and training - everything happening across the
        EN 301 549 ecosystem, in one feed.
      </p>

      <CategoryFilter
        v-if="availableCategories.length"
        v-model="selectedCategory"
        :categories="availableCategories"
        class="mb-8"
      />

      <p aria-live="polite" class="sr-only">{{ filterAnnouncement }}</p>

      <div v-if="filteredNews.length" class="grid gap-6 md:grid-cols-2">
        <NewsCard v-for="entry in filteredNews" :key="entry.id" :entry="entry" />
      </div>

      <div v-else-if="news && news.length" class="card max-w-2xl">
        <p class="text-muted">No entries match this category.</p>
      </div>

      <div v-else class="card max-w-2xl">
        <p class="text-muted">
          No entries yet. This list is populated by an automated nightly
          search-and-summarise pipeline (see the project brief) that opens
          a pull request for review before anything is published here —
          that pipeline hasn't been built yet.
        </p>
      </div>
    </section>
  </div>
</template>
