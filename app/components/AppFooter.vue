<script setup lang="ts">
import type { NewsMeta } from '~~/server/api/news-meta.get'

const year = new Date().getFullYear()

const { data: meta } = await useFetch<NewsMeta>('/api/news-meta')

const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

const lastUpdated = computed(() => {
  const date = meta.value?.lastSearchedAt
  return date ? { iso: date, formatted: dateFormatter.format(new Date(date)) } : null
})
</script>

<template>
  <footer class="bg-navy text-white">
    <div class="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-[2fr_1fr_1fr]">
      <div>
        <p class="text-lg font-semibold">
          EAA A11y Hub
        </p>
        <p class="mt-2 max-w-sm text-sm text-white/70 text-wrap-pretty">
          A reference and news hub for EN 301 549 and the European
          Accessibility Act, for developers and testers working on digital
          accessibility compliance across the EU.
        </p>
        <p class="mt-2 max-w-sm text-sm text-white/70">
          Found a bug or have a suggestion?
          <br/> Report it on
          <a
            href="https://github.com/clanceyp/eaa-accessibility-hub/issues"
            class="text-white/70 underline underline-offset-2 hover:text-white"
            aria-label="Open the Github EAA A11y Hub project issues page in new tab"
            rel="noopener noreferrer" target="_blank"
          >
            Github
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" class="inline-block" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
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
          <li><NuxtLink to="/overview" class="text-white no-underline hover:underline">Overview</NuxtLink>
          <ul class="ml-4 mt-3 space-y-2">
            <li><NuxtLink to="/overview/web" class="text-white no-underline hover:underline">Web</NuxtLink></li>
            <li><NuxtLink to="/overview/non-web" class="text-white no-underline hover:underline">Non-web</NuxtLink></li>
            <li><NuxtLink to="/overview/clause-5" class="text-white no-underline hover:underline">Clause 5</NuxtLink></li>
            <li><NuxtLink to="/overview/clause-6" class="text-white no-underline hover:underline">Clause 6</NuxtLink></li>
            <li><NuxtLink to="/overview/clause-7" class="text-white no-underline hover:underline">Clause 7</NuxtLink></li>
            <li><NuxtLink to="/overview/clause-8" class="text-white no-underline hover:underline">Clause 8</NuxtLink></li>
            <li><NuxtLink to="/overview/clause-9" class="text-white no-underline hover:underline">Clause 9</NuxtLink></li>
            <li><NuxtLink to="/overview/clause-10" class="text-white no-underline hover:underline">Clause 10</NuxtLink></li>
            <li><NuxtLink to="/overview/clause-11" class="text-white no-underline hover:underline">Clause 11</NuxtLink></li>
            <li><NuxtLink to="/overview/clause-12" class="text-white no-underline hover:underline">Clause 12</NuxtLink></li>
            <li><NuxtLink to="/overview/clause-13" class="text-white no-underline hover:underline">Clause 13</NuxtLink></li>
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

    <div class="border-t border-white/10 px-6 py-8 text-xs text-white/50">
      <p class="mx-auto max-w-6xl">
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
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" class="inline-block" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
        site.
      </p>
    </div>
  </footer>
</template>
