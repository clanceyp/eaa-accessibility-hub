import type { PipelineConfig } from './run-update'
import { slugId } from './run-update'
import { type NewsDraft, type NewsEntry, newsDraftListSchema } from './schema'

const systemPrompt = `You are a research assistant for a reference site covering EU digital
accessibility law (EN 301 549, the Web Accessibility Directive, and the
European Accessibility Act).

Your task is to find recent, genuine developments in EU digital
accessibility regulation and standards — not general commentary. Every
entry must fit exactly one of these categories:

- "Rulings & Enforcement" — court judgments, ombudsman rulings, formal
  complaints upheld, and enforcement notices/sanctions from national
  enforcement bodies
- "Regulatory Guidance" — official guidance, clarifications, or new
  regulations/frameworks published by EU or member-state bodies (not a
  monitoring report and not a court/enforcement action)
- "Standards Updates" — new or revised versions of EN 301 549, WCAG, or
  related ETSI/CEN-CENELEC standards, and official clarifications to them
- "Monitoring Reports" — accessibility monitoring/audit findings and
  reports published by national Web Accessibility Directive (EU
  2016/2102) monitoring bodies or the European Commission
- "Procurement & Tenders" — public sector tenders or procurement
  requirements that cite EN 301 549 conformance
- "General News" — another genuine, specific EU digital accessibility
  regulatory development that doesn't fit the categories above

Out of scope — do not include:
- general accessibility news, opinion pieces, or product announcements
  that aren't tied to a specific regulatory, standards, or procurement
  action
- conference announcements, blog posts, or "how to" guides
- anything that isn't a specific, genuine, checkable development tied to
  a named organisation, authority, case, standard, or tender

Only include entries you can point to with a real, checkable source URL.
If you are not confident something is genuine and in scope, leave it out
rather than guessing. If an item could plausibly fit more than one
category, pick the single best match.`

const userPrompt = `Search for recent EU digital accessibility developments from the last 30
days across all of these categories:

- Court, ombudsman, and enforcement body decisions or sanctions
  (Rulings & Enforcement)
- Official guidance, clarifications, or new regulations from EU or
  member-state bodies (Regulatory Guidance)
- New or revised EN 301 549 / WCAG / ETSI / CEN-CENELEC standards, or
  official clarifications to them (Standards Updates)
- Accessibility monitoring/audit reports from national Web Accessibility
  Directive monitoring bodies or the European Commission (Monitoring
  Reports)
- Public tenders or procurement notices citing EN 301 549 conformance
  requirements (Procurement & Tenders)

Prioritise primary sources: national WAD monitoring/enforcement bodies,
courts and ombudsman offices, ETSI/CEN-CENELEC, the European Commission,
official procurement portals (e.g. TED — Tenders Electronic Daily), and
organisations like the European Disability Forum (EDF) reporting on
specific developments.

For each genuine finding, produce an object with:
- title: short plain-language headline
- summary: 1-3 sentence plain-language summary of what happened
- category: exactly one of "Rulings & Enforcement", "Regulatory
  Guidance", "Standards Updates", "Monitoring Reports", "Procurement &
  Tenders", or "General News" — pick the single best match
- jurisdiction: the country name, or "EU" for EU-level action
- date: the date of the action/publication, in YYYY-MM-DD format
- sourceUrl: a real, checkable URL to the primary source
- sourceName: the publisher or site name (e.g. "Bundesfachstelle Barrierefreiheit", "EDF")`

export const newsConfig: PipelineConfig<NewsDraft, NewsEntry> = {
  name: 'news',
  repoFilePath: 'data/news.json',
  draftListSchema: newsDraftListSchema,
  systemPrompt,
  userPrompt,
  idFromDraft: (draft) => slugId(draft.title, draft.date),
  toEntry: (draft, id) => ({ ...draft, id })
}
