<script setup lang="ts">
useHead({
  title: 'EN 301 549 Overview - EAA A11y Hub'
})

interface Clause {
  number: string
  title: string
  description: string
}

interface Resource {
  title: string
  description: string
  url: string
  sourceName: string
}

const resources: Resource[] = [
  {
    title: 'EN 301 549 V4.1.1 (full standard, PDF)',
    description: 'The normative text itself, published by ETSI. Everything on this site is a plain-language summary of this document - check it directly for anything you need to cite or rely on formally.',
    url: 'https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.01_60/en_301549v040101p.pdf',
    sourceName: 'ETSI'
  },
  {
    title: 'European Accessibility Act - official overview',
    description: "The European Commission's own page on the EAA: scope, covered products and services, implementation timeline and micro-enterprise exemptions.",
    url: 'https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/european-accessibility-act-eaa_en',
    sourceName: 'European Commission'
  },
  {
    title: 'WCAG2ICT - applying WCAG to non-web ICT',
    description: 'W3C guidance on how WCAG success criteria translate to non-web software and documents - the basis for how Clauses 10 and 11 restate WCAG in non-web terms.',
    url: 'https://www.w3.org/TR/wcag2ict-22/',
    sourceName: 'W3C Web Accessibility Initiative'
  },
  {
    title: 'Auditsu - accessibility resources & guides',
    description: 'Practical articles on auditing for and implementing EAA, WCAG and EN 301 549 compliance.',
    url: 'https://auditsu.com/resources',
    sourceName: 'Auditsu'
  }
]

const coreClauses: Clause[] = [
  {
    number: '9',
    title: 'Web',
    description: 'Incorporates WCAG 2.1 Level A and AA by reference for websites and web applications, clause-by-clause mapped to the matching WCAG success criterion.'
  },
  {
    number: '10',
    title: 'Non-web documents',
    description: 'Applies WCAG-equivalent requirements to electronic documents distributed as part of a product or service - PDF, Word, ePub, spreadsheets and similar formats.'
  },
  {
    number: '11',
    title: 'Software',
    description: 'Covers non-web software - native mobile apps, desktop applications, operating systems - restating WCAG-equivalent criteria in software terms, plus platform accessibility API requirements.'
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
    <section class="relative overflow-hidden bg-eu-linemap text-white">
      <div class="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <h1 class="text-5xl font-light">
          Overview - EN 301 549
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
        flat checklist. Four clauses carry almost all of the day-to-day
        content requirements - <strong class="text-ink">Clause 9</strong>
        for web, <strong class="text-ink">Clause 10</strong> for non-web
        documents, <strong class="text-ink">Clause 11</strong> for
        software including mobile apps. <strong class="text-ink">Clause 12</strong>
        requires that the documentation and support services are themselves accessible. 
        <br/> 
        A further set of clauses apply
        only in specific situations, such as hardware and video.
      </p>

      <h2 class="mt-12 mb-6 text-2xl font-medium text-navy">
        Core content clauses
      </h2>
      <ul class="grid gap-6 md:grid-cols-3">
        <li v-for="clause in coreClauses" :key="clause.number" class="h-full">
          <ClauseCard :number="clause.number" :title="clause.title" :description="clause.description" />
        </li>
      </ul>

      <h2 class="mt-12 mb-6 text-2xl font-medium text-navy">
        Supporting clauses
      </h2>
      <p class="mb-6 max-w-3xl text-muted">
        These apply alongside Clauses 9–11 depending on what the product
        or service actually does - a kiosk with a camera and a card
        reader may bring in hardware, video and voice-communication
        requirements on top of its software ones.
      </p>
      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="clause in supportingClauses" :key="clause.number" class="h-full">
          <ClauseCard :number="clause.number" :title="clause.title" :description="clause.description" />
        </li>
      </ul>

      <h2 class="mt-12 mb-6 text-2xl font-medium text-navy">
        Go deeper
      </h2>
      <ul class="grid gap-6 md:grid-cols-2">
        <li class="h-full">
          <div class="card h-full has-[a:focus-visible]:outline has-[a:focus-visible]:outline-[3px] has-[a:focus-visible]:outline-primary-light has-[a:focus-visible]:outline-offset-2">
            <h3 class="mb-2 text-xl font-medium text-navy">
              <NuxtLink to="/en301549/web" class="text-inherit no-underline outline-none">
                Web →
              </NuxtLink>
            </h3>
            <p class="text-sm leading-relaxed text-muted">
              The full requirements for websites and web applications under
              Clause 9, and how the WCAG principles apply.
            </p>
          </div>
        </li>
        <li class="h-full">
          <div class="card h-full has-[a:focus-visible]:outline has-[a:focus-visible]:outline-[3px] has-[a:focus-visible]:outline-primary-light has-[a:focus-visible]:outline-offset-2">
            <h3 class="mb-2 text-xl font-medium text-navy">
              <NuxtLink to="/en301549/non-web" class="text-inherit no-underline outline-none">
                Non-web →
              </NuxtLink>
            </h3>
            <p class="text-sm leading-relaxed text-muted">
              Native apps, kiosks, hardware, documents and support
              services under Clauses 5–8 and 10–13.
            </p>
          </div>
        </li>
      </ul>

      <h2 class="mt-12 mb-6 text-2xl font-medium text-navy">
        Resources
      </h2>
      <p class="mb-6 max-w-3xl text-muted">
        External references worth keeping close - the standard itself,
        official EU guidance, and further reading.
      </p>
      <ul class="grid gap-4 sm:grid-cols-2">
        <li v-for="resource in resources" :key="resource.url" class="h-full">
          <div class="card h-full has-[a:focus-visible]:outline has-[a:focus-visible]:outline-[3px] has-[a:focus-visible]:outline-primary-light has-[a:focus-visible]:outline-offset-2">
            <h3 class="mb-1 text-lg font-medium text-navy">
              <a
                :href="resource.url"
                target="_blank"
                rel="noopener noreferrer"
                title="Opens in a new tab"
                class="inline-flex items-center gap-1 text-inherit no-underline outline-none"
              >
                {{ resource.title }}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5 flex-none" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                <span class="sr-only">. opens in a new tab</span>
              </a>
            </h3>
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary">
              {{ resource.sourceName }}
            </p>
            <p class="text-sm leading-relaxed text-muted">
              {{ resource.description }}
            </p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
