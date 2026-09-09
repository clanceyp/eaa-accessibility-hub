import timelineData from '../../data/timeline.json'

export interface TimelineEntry {
  id: string
  date: string
  title: string
  detail: string
  /** Set when the date is a forecast rather than a confirmed/past event */
  status?: 'expected'
}

// Imported (not read from disk at runtime) — see news.get.ts for why.
const entries = timelineData as TimelineEntry[]

export default defineEventHandler((): TimelineEntry[] => {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date))
})
