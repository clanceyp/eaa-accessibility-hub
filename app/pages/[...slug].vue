<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useHead({
  title: `${page.value.title} — EAA Accessibility Hub`,
  meta: [{ name: 'description', content: page.value.description }]
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-6 py-16">
    <ContentRenderer v-if="page" :value="page" class="prose-content" />
  </div>
</template>
