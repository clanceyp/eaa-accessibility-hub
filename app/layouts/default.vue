<script setup lang="ts">
import { SITE_NAME, SITE_URL } from '~~/shared/site'

const route = useRoute()

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL
}

useHead(() => ({
  link: [{ rel: 'canonical', href: `${SITE_URL}${route.path}` }],
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(websiteJsonLd) }]
}))

// Page-specific ogTitle/ogDescription are set per-page (see useSeoMeta
// calls in each page); ogUrl/ogSiteName are the same on every page, so
// they live here once instead of being repeated everywhere.
useSeoMeta({
  ogSiteName: SITE_NAME,
  ogUrl: () => `${SITE_URL}${route.path}`
})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-primary focus:shadow-lg"
    >
      Skip to main content
    </a>

    <AppHeader />

    <main id="main-content" class="flex-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
