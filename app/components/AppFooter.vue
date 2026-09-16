<script setup lang="ts">
import type { NewsEntry } from '~~/server/api/news.get'

const year = new Date().getFullYear()

// /api/news returns entries sorted newest-first, so the first entry's date
// is the most recent content update.
const { data: news } = await useFetch<NewsEntry[]>('/api/news')

const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

const lastUpdated = computed(() => {
  const latest = news.value?.[0]?.date
  return latest ? { iso: latest, formatted: dateFormatter.format(new Date(latest)) } : null
})
</script>

<template>
  <footer class="bg-navy text-white">
    <div class="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-[2fr_1fr_1fr]">
      <div>
        <p class="text-lg font-semibold">
          EAA Accessibility Hub
        </p>
        <p class="mt-2 max-w-sm text-sm text-white/70">
          A reference and news hub for EN 301 549 and the European
          Accessibility Act, for developers and testers working on digital
          accessibility compliance across the EU.
        </p>
        <p v-if="lastUpdated" class="mt-3 text-xs text-white/50">
          Last updated: <time :datetime="lastUpdated.iso">{{ lastUpdated.formatted }}</time>
        </p>
      </div>

      <nav aria-label="Site">
        <p class="text-sm font-medium text-white/60">
          Site
        </p>
        <ul class="mt-3 space-y-2 text-sm">
          <li><NuxtLink to="/" class="text-white no-underline hover:underline">Home</NuxtLink></li>
          <li><NuxtLink to="/en301549" class="text-white no-underline hover:underline">Overview - EN 301 549</NuxtLink>
          <ul class="ml-4 mt-3 space-y-2">
            <li><NuxtLink to="/en301549/web" class="text-white no-underline hover:underline">Web</NuxtLink></li>
            <li><NuxtLink to="/en301549/non-web" class="text-white no-underline hover:underline">Non-web</NuxtLink></li>
            <li><NuxtLink to="/en301549/clause-5" class="text-white no-underline hover:underline">Clause 5</NuxtLink></li>
            <li><NuxtLink to="/en301549/clause-6" class="text-white no-underline hover:underline">Clause 6</NuxtLink></li>
            <li><NuxtLink to="/en301549/clause-7" class="text-white no-underline hover:underline">Clause 7</NuxtLink></li>
            <li><NuxtLink to="/en301549/clause-8" class="text-white no-underline hover:underline">Clause 8</NuxtLink></li>
            <li><NuxtLink to="/en301549/clause-9" class="text-white no-underline hover:underline">Clause 9</NuxtLink></li>
            <li><NuxtLink to="/en301549/clause-10" class="text-white no-underline hover:underline">Clause 10</NuxtLink></li>
            <li><NuxtLink to="/en301549/clause-11" class="text-white no-underline hover:underline">Clause 11</NuxtLink></li>
            <li><NuxtLink to="/en301549/clause-12" class="text-white no-underline hover:underline">Clause 12</NuxtLink></li>
            <li><NuxtLink to="/en301549/clause-13" class="text-white no-underline hover:underline">Clause 13</NuxtLink></li>
            </ul>
          </li>
          <li><NuxtLink to="/timeline" class="text-white no-underline hover:underline">Timeline</NuxtLink></li>

        </ul>
      </nav>

      <nav aria-label="Legal">
        <p class="text-sm font-medium text-white/60">
          Legal
        </p>
        <ul class="mt-3 space-y-2 text-sm">
          <li><NuxtLink to="/accessibility-statement" class="text-white no-underline hover:underline">Accessibility Statement</NuxtLink></li>
          <li><NuxtLink to="/terms" class="text-white no-underline hover:underline">Terms & Conditions</NuxtLink></li>
          <li><NuxtLink to="/privacy" class="text-white no-underline hover:underline">Privacy Policy</NuxtLink></li>
        </ul>
      </nav>
    </div>

    <div class="border-t border-white/10 px-6 py-4 text-center text-xs text-white/50">
      © {{ year }} EAA A11y Hub. Not affiliated with ETSI, CEN, CENELEC or the European Commission.
      An
      <a
        href="https://inclusiveinterface.co.uk/"
        target="_blank"
        rel="noopener noreferrer"
        title="Opens in a new tab"
        class="text-white/70 underline underline-offset-2 hover:text-white"
      >
        Inclusive Interface
        <span class="sr-only">. opens in a new tab</span>
      </a>
      site.
    </div>
  </footer>
</template>
