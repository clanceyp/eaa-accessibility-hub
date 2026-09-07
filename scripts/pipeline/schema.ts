import { z } from 'zod'

/**
 * Schema for what Claude extracts from search results. `id` is generated
 * locally from the title + date rather than trusted from the model, so
 * dedupe logic controls uniqueness rather than the model.
 */
export const newsDraftSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
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

export const timelineDraftSchema = z.object({
  title: z.string().min(1),
  detail: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD')
})

export const timelineDraftListSchema = z.array(timelineDraftSchema)

export type TimelineDraft = z.infer<typeof timelineDraftSchema>

export const timelineEntrySchema = timelineDraftSchema.extend({
  id: z.string()
})

export type TimelineEntry = z.infer<typeof timelineEntrySchema>
