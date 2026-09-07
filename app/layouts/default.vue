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
