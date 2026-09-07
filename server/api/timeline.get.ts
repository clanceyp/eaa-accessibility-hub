import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export interface TimelineEntry {
  id: string
  date: string
  title: string
  detail: string
}

export default defineEventHandler(async (): Promise<TimelineEntry[]> => {
  const path = fileURLToPath(new URL('../../data/timeline.json', import.meta.url))
  const raw = await readFile(path, 'utf-8')
  const entries: TimelineEntry[] = JSON.parse(raw)
  return entries.sort((a, b) => a.date.localeCompare(b.date))
})
