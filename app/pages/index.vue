<script setup lang="ts">
import type { NewsEntry } from '~~/server/api/news.get'

const { data: news } = await useFetch<NewsEntry[]>('/api/news')

useHead({
  title: 'EAA Accessibility Hub — EU accessibility legal & regulatory news'
})
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-gradient-to-br from-navy to-primary text-white">
      <HeroMapBackground />
      <div class="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <h1 class="max-w-2xl text-5xl font-light leading-tight text-pretty">
          Accessibility law, in one place
        </h1>
        <p class="mt-6 max-w-xl text-lg text-white/85">
          Legal proceedings, enforcement actions and regulatory findings
          related to digital accessibility across the EU — plus reference
          material on EN 301 549 and the European Accessibility Act.
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
        Latest legal & regulatory news
      </h2>
      <p class="mb-10 max-w-2xl text-muted">
        Court cases, ombudsman rulings, enforcement notices and monitoring
        body findings related to accessibility law across the EU.
      </p>

      <div v-if="news && news.length" class="grid gap-6 md:grid-cols-2">
        <NewsCard v-for="entry in news" :key="entry.id" :entry="entry" />
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
