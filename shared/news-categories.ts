/**
 * Fixed taxonomy for news entries — the canonical source of truth, shared
 * between the pipeline (zod schema), the server API, and the client-side
 * category filter. Kept dependency-free (no zod) so it's cheap to include
 * in the client bundle; scripts/pipeline/schema.ts wraps it in z.enum().
 *
 * Order here is the canonical display order used by the category filter
 * UI (app/components/CategoryFilter.vue derives its option order from
 * this, rather than hardcoding its own list).
 */
export const NEWS_CATEGORIES = [
  'Rulings & Enforcement',
  'Regulatory Guidance',
  'Standards Updates',
  'Implementation & Testing Guidance',
  'Monitoring Reports',
  'Research & Analysis',
  'Product & Vendor Conformance',
  'Procurement & Tenders',
  'Training & Events',
  'General News'
] as const

export type NewsCategory = (typeof NEWS_CATEGORIES)[number]
