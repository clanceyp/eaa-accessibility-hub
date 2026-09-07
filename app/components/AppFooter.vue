<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-navy text-white">
    <div class="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
      <div>
        <p class="text-lg font-semibold">
          EAA Accessibility Hub
        </p>
        <p class="mt-2 max-w-sm text-sm text-white/70">
          A reference and news hub for EN 301 549 and the European
          Accessibility Act, for developers and testers working on digital
          accessibility compliance across the EU.
        </p>
      </div>

      <nav aria-label="Site">
        <p class="text-sm font-medium text-white/60">
          Site
        </p>
        <ul class="mt-3 space-y-2 text-sm">
          <li><NuxtLink to="/" class="text-white no-underline hover:underline">News</NuxtLink></li>
          <li><NuxtLink to="/en301549/web" class="text-white no-underline hover:underline">EN 301 549 · Web</NuxtLink></li>
          <li><NuxtLink to="/en301549/non-web" class="text-white no-underline hover:underline">EN 301 549 · Non-web</NuxtLink></li>
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
      © {{ year }} EAA Accessibility Hub. Not affiliated with ETSI, CEN, CENELEC or the European Commission.
    </div>
  </footer>
</template>
