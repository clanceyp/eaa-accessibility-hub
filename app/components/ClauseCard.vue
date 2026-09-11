<script setup lang="ts">
defineProps<{
  number: string
  title: string
  description: string
}>()
</script>

<template>
  <div
    class="card h-full has-[a:focus-visible]:outline has-[a:focus-visible]:outline-[3px] has-[a:focus-visible]:outline-primary-light has-[a:focus-visible]:outline-offset-2"
  >
    <span class="tag mb-3" aria-hidden="true">Clause {{ number }}</span>
    <h3 class="mb-2 text-lg font-medium text-navy">
      <NuxtLink
        :to="`/en301549/clause-${number}`"
        class="text-inherit no-underline outline-none"
        :aria-label="`Clause ${number} ${title}`"
      >
        {{ title }}
      </NuxtLink>
    </h3>
    <p class="text-sm leading-relaxed text-muted">
      {{ description }}
    </p>
  </div>
</template>
