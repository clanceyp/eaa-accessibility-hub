<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <header class="border-b border-border bg-white">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <NuxtLink to="/" class="flex items-center gap-2 text-lg font-semibold text-navy no-underline">
        <span
          class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
          aria-hidden="true"
        >EAH</span>
        <span>EAA Accessibility Hub</span>
      </NuxtLink>

      <nav aria-label="Primary navigation" class="hidden md:block">
        <ul class="flex items-center gap-6">
          <li>
            <NuxtLink to="/" class="text-ink no-underline hover:text-primary" active-class="text-primary font-medium underline underline-offset-4">
              News
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/en301549" class="text-ink no-underline hover:text-primary" active-class="text-primary font-medium underline underline-offset-4">
              Overview
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/timeline" class="text-ink no-underline hover:text-primary" active-class="text-primary font-medium underline underline-offset-4">
              Timeline
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <button
        type="button"
        class="inline-flex items-center justify-center rounded-md border border-border p-2 md:hidden"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        @click="open = !open"
      >
        <span class="sr-only">Toggle menu</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M3 5h14a1 1 0 100-2H3a1 1 0 000 2zm0 6h14a1 1 0 100-2H3a1 1 0 000 2zm0 6h14a1 1 0 100-2H3a1 1 0 000 2z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <nav
      v-if="open"
      id="mobile-nav"
      aria-label="Primary navigation"
      class="border-t border-border px-6 py-3 md:hidden"
    >
      <ul class="flex flex-col gap-1">
        <li>
          <NuxtLink to="/" class="rounded px-2 py-2 text-ink no-underline hover:bg-tint" active-class="text-primary font-medium underline underline-offset-4" @click="open = false">
            News
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/en301549" class="rounded px-2 py-2 text-ink no-underline hover:bg-tint" active-class="text-primary font-medium underline underline-offset-4" @click="open = false">
            Overview
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/timeline" class="rounded px-2 py-2 text-ink no-underline hover:bg-tint" active-class="text-primary font-medium underline underline-offset-4" @click="open = false">
            Timeline
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
