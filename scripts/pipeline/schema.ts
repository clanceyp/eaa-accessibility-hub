import { z } from 'zod'
import { NEWS_CATEGORIES } from '../../shared/news-categories'

export { NEWS_CATEGORIES }
export type { NewsCategory } from '../../shared/news-categories'

/**
 * Schema for what Claude extracts from search results. `id` is generated
 * locally from the title + date rather than trusted from the model, so
 * dedupe logic controls uniqueness rather than the model.
 */
export const newsDraftSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  category: z.enum(NEWS_CATEGORIES),
  jurisdiction: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  sourceUrl: z.string().url(),
  sourceName: z.string().min(1)
})

export const newsDraftListSchema = z.array(newsDraftSchema)

export type NewsDraft = z.infer<typeof newsDraftSchema>

export const newsEntrySchema = newsDraftSchema.extend({
  id: z.string()
})

export type NewsEntry = z.infer<typeof newsEntrySchema>

/** Operational metadata — when the search last ran, not editorial content. */
export const newsSearchMetaSchema = z.object({
  lastSearchedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD')
})

export type NewsSearchMeta = z.infer<typeof newsSearchMetaSchema>

export const timelineDraftSchema = z.object({
  title: z.string().min(1),
  detail: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  /** Set when the date is a forecast rather than a confirmed/past event */
  status: z.literal('expected').optional()
})

export const timelineDraftListSchema = z.array(timelineDraftSchema)

export type TimelineDraft = z.infer<typeof timelineDraftSchema>

export const timelineEntrySchema = timelineDraftSchema.extend({
  id: z.string()
})

export type TimelineEntry = z.infer<typeof timelineEntrySchema>
