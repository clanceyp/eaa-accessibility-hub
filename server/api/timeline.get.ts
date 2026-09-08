import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export interface TimelineEntry {
  id: string
  date: string
  title: string
  detail: string
  /** Set when the date is a forecast rather than a confirmed/past event */
  status?: 'expected'
}

export default defineEventHandler(async (): Promise<TimelineEntry[]> => {
  const path = fileURLToPath(new URL('../../data/timeline.json', import.meta.url))
  const raw = await readFile(path, 'utf-8')
  const entries: TimelineEntry[] = JSON.parse(raw)
  return entries.sort((a, b) => b.date.localeCompare(a.date))
})
