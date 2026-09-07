import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export interface NewsEntry {
  id: string
  title: string
  summary: string
  jurisdiction: string
  date: string
  sourceUrl: string
  sourceName: string
}

export default defineEventHandler(async (): Promise<NewsEntry[]> => {
  const path = fileURLToPath(new URL('../../data/news.json', import.meta.url))
  const raw = await readFile(path, 'utf-8')
  const entries: NewsEntry[] = JSON.parse(raw)
  return entries.sort((a, b) => b.date.localeCompare(a.date))
})
