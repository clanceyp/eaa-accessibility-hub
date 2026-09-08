<script setup lang="ts">
useHead({
  title: 'EN 301 549 — Overview — EAA Accessibility Hub'
})

interface Clause {
  number: string
  title: string
  description: string
}

const coreClauses: Clause[] = [
  {
    number: '9',
    title: 'Web',
    description: 'Incorporates WCAG 2.1 Level A and AA by reference for websites and web applications, clause-by-clause mapped to the matching WCAG success criterion.'
  },
  {
    number: '10',
    title: 'Non-web documents',
    description: 'Applies WCAG-equivalent requirements to electronic documents distributed as part of a product or service — PDF, Word, ePub, spreadsheets and similar formats.'
  },
  {
    number: '11',
    title: 'Software',
    description: 'Covers non-web software — native mobile apps, desktop applications, operating systems — restating WCAG-equivalent criteria in software terms, plus platform accessibility API requirements.'
  }
]

const supportingClauses: Clause[] = [
  {
    number: '5',
    title: 'Generic requirements',
    description: 'Baseline requirements across ICT types: closed functionality, biometrics, privacy, colour/contrast, operable parts.'
  },
  {
    number: '6',
    title: 'Two-way voice communication',
    description: 'Real-time text and captioned-call requirements for ICT with voice communication.'
  },
  {
    number: '7',
    title: 'Video',
    description: 'Captions, audio description, sign language and accessible media player controls.'
  },
  {
    number: '8',
    title: 'Hardware',
    description: 'Physical access requirements: controls, connectors, tactile indicators, key repeat.'
  },
  {
    number: '12',
    title: 'Documentation & support services',
    description: 'Help desks, user guides and product documentation must themselves be accessible.'
  },
  {
    number: '13',
    title: 'Relay & emergency service access',
    description: 'ICT with two-way communication must not block access to relay or emergency services.'
  }
]
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-gradient-to-br from-navy to-primary text-white">
      <HeroMapBackground />
      <div class="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <h1 class="text-5xl font-light">
          EN 301 549 — Overview
        </h1>
        <p class="mt-4 max-w-2xl text-white/85">
          The European standard for ICT accessibility, referenced by the
          Web Accessibility Directive and the European Accessibility Act.
          Here's how its clauses map onto web content, documents and
          software.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-16">
      <p class="max-w-3xl leading-relaxed text-muted">
        EN 301 549 is organised into numbered clauses rather than a single
        flat checklist. Three clauses carry almost all of the day-to-day
        content requirements — <strong class="text-ink">Clause 9</strong>
        for web, <strong class="text-ink">Clause 10</strong> for non-web
        documents, and <strong class="text-ink">Clause 11</strong> for
        software including mobile apps. A further set of clauses apply
        only in specific situations, such as hardware or video.
      </p>

      <h2 class="mt-12 mb-6 text-2xl font-medium text-navy">
        Core content clauses
      </h2>
      <div class="grid gap-6 md:grid-cols-3">
        <NuxtLink
          v-for="clause in coreClauses"
          :key="clause.number"
          :to="`/en301549/clause-${clause.number}`"
          class="card block no-underline transition-shadow hover:shadow-md"
        >
          <span class="tag mb-3">Clause {{ clause.number }}</span>
          <h3 class="mb-2 text-lg font-medium text-navy">
            {{ clause.title }}
          </h3>
          <p class="text-sm leading-relaxed text-muted">
            {{ clause.description }}
          </p>
        </NuxtLink>
      </div>

      <h2 class="mt-12 mb-6 text-2xl font-medium text-navy">
        Supporting clauses
      </h2>
      <p class="mb-6 max-w-3xl text-muted">
        These apply alongside Clauses 9–11 depending on what the product
        or service actually does — a kiosk with a camera and a card
        reader may bring in hardware, video and voice-communication
        requirements on top of its software ones.
      </p>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="clause in supportingClauses"
          :key="clause.number"
          :to="`/en301549/clause-${clause.number}`"
          class="block rounded-xl border border-border p-4 no-underline transition-shadow hover:shadow-md"
        >
          <span class="text-xs font-semibold uppercase tracking-wide text-secondary">Clause {{ clause.number }}</span>
          <h3 class="mt-1 mb-1 font-medium text-navy">
            {{ clause.title }}
          </h3>
          <p class="text-sm leading-relaxed text-muted">
            {{ clause.description }}
          </p>
        </NuxtLink>
      </div>

      <h2 class="mt-12 mb-6 text-2xl font-medium text-navy">
        Go deeper
      </h2>
      <div class="grid gap-6 md:grid-cols-2">
        <NuxtLink to="/en301549/web" class="card block no-underline transition-shadow hover:shadow-md">
          <h3 class="mb-2 text-xl font-medium text-navy">
            Web →
          </h3>
          <p class="text-sm leading-relaxed text-muted">
            The full requirements for websites and web applications under
            Clause 9, and how the WCAG principles apply.
          </p>
        </NuxtLink>
        <NuxtLink to="/en301549/non-web" class="card block no-underline transition-shadow hover:shadow-md">
          <h3 class="mb-2 text-xl font-medium text-navy">
            Non-web →
          </h3>
          <p class="text-sm leading-relaxed text-muted">
            Native apps, kiosks, hardware, documents and support
            services under Clauses 5–8 and 10–13.
          </p>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
