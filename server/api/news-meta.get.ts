import newsMeta from '../../data/news-meta.json'

export interface NewsMeta {
  lastSearchedAt: string
}

// Imported (not read from disk at runtime) for the same reason as
// news.get.ts: Nitro only bundles files it can statically trace, and this
// file changes via a direct commit from the pipeline (see
// scripts/pipeline/github.ts's writeFileDirectly), which triggers a fresh
// deployment just like a merged content PR does.
const meta = newsMeta as NewsMeta

export default defineEventHandler((): NewsMeta => {
  return meta
})
