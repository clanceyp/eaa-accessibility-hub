export interface ExcludedSource {
  /** Matched as a case-insensitive substring of a draft's sourceUrl */
  urlContains: string
  reason: string
}

/**
 * Sources the search keeps resurfacing (often reworded/retitled each time)
 * that turned out not to be genuine, dated news on spot-check. Filtered out
 * in computeNewEntries (scripts/pipeline/run-update.ts) before a draft ever
 * becomes a candidate entry, so they don't need to be caught by hand on
 * every run.
 */
export const newsExcludedSources: ExcludedSource[] = [
  {
    urlContains: 'levelaccess.com/compliance-overview/en-301-549-compliance',
    reason: 'Evergreen "compliance overview" page with no visible publication or last-updated date - not a dated news item. Resurfaced twice with different titles/framing before being excluded (2026-10-10 run, PR #27; 2026-10-17 run, PR #32).'
  }
]
