import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Evaluated once when `nuxt build` runs, not per-request — content here
  // only changes via a PR merge, which triggers a fresh build anyway, so
  // this is an accurate "site last built" timestamp for sitemap.xml's
  // <lastmod> rather than a per-request value that would drift from
  // actual deploy time across serverless cold starts.
  runtimeConfig: {
    public: {
      buildTime: new Date().toISOString()
    }
  },

  modules: ['@nuxt/content', '@nuxt/fonts', '@nuxt/eslint', '@vercel/analytics'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()]
  },

  fonts: {
    families: [
      { name: 'Space Grotesk', provider: 'google', weights: [300, 400, 500, 600, 700] }
    ]
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }
      ]
    }
  }
})
