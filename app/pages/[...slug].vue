<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useHead({
  title: `${page.value.title} — EAA A11y Hub`,
  meta: [{ name: 'description', content: page.value.description }]
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
