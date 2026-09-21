<script setup lang="ts">
import { SITE_NAME } from '~~/shared/site'

const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const pageTitle = `${page.value.title} - ${SITE_NAME}`
const pageDescription = page.value.description

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'website'
})
</script>

<template>
  <div v-if="page">
    <section class="h-24 bg-eu-linemap md:h-48 xl:h-64" />

    <div class="mx-auto max-w-3xl px-6 py-16">
      <ContentRenderer :value="page" class="prose-content" />
    </div>
  </div>
</template>
