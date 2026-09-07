import type { PipelineConfig } from './run-update'
import { slugId } from './run-update'
import { type NewsDraft, type NewsEntry, newsDraftListSchema } from './schema'

const systemPrompt = `You are a research assistant for a reference site covering EU digital
accessibility law (EN 301 549, the Web Accessibility Directive, and the
European Accessibility Act).

Your task is to find recent LEGAL OR REGULATORY ACTION related to digital
accessibility across the EU — and only that. In scope:

- court judgments or ongoing litigation about digital accessibility
- ombudsman rulings or formal complaints upheld
- enforcement notices or sanctions from national enforcement bodies
- monitoring body findings and reports published under the Web
  Accessibility Directive (EU 2016/2102)
- formal regulatory findings from bodies like national accessibility
  monitoring authorities, or statements from the European Disability
  Forum (EDF) about specific enforcement actions

Out of scope — do not include:
- general accessibility news, opinion pieces, or product announcements
- conference announcements, blog posts, or "how to" guides
- anything that isn't a specific, genuine legal or regulatory action
  tied to a named organisation, authority, or case

Only include entries you can point to with a real, checkable source URL.
If you are not confident something is genuine legal/regulatory action,
leave it out rather than guessing.`

const userPrompt = `Search for legal or regulatory action related to digital accessibility in
the EU from the last 30 days. Prioritise: national Web Accessibility
Directive monitoring/enforcement body publications, court and ombudsman
decisions, and reporting from organisations like the European Disability
Forum (EDF) about specific enforcement actions.

For each genuine finding, produce an object with:
- title: short plain-language headline
- summary: 1-3 sentence plain-language summary of what happened
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
