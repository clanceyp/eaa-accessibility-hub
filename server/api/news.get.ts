import newsData from '../../data/news.json'

export interface NewsEntry {
  id: string
  title: string
  summary: string
  jurisdiction: string
  date: string
  sourceUrl: string
  sourceName: string
}

// Imported (not read from disk at runtime) so the data is bundled into the
// serverless function output — a runtime fs.readFile() of a path outside
// server/ silently returns nothing on Vercel, since Nitro only traces and
// includes files reachable via static imports. This also fits the site's
// design: news.json only changes via a reviewed PR merge, which triggers a
// fresh deployment anyway.
const entries = newsData as NewsEntry[]

export default defineEventHandler((): NewsEntry[] => {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date))
})
