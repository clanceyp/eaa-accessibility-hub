import type { PipelineConfig } from './run-update'
import { slugId } from './run-update'
import { type NewsDraft, type NewsEntry, newsDraftListSchema } from './schema'

const systemPrompt = `You are a research assistant for a reference site covering EN 301 549 —
the European standard for digital accessibility referenced by the EU Web
Accessibility Directive and the European Accessibility Act — aimed at
developers and testers who work to it.

Your task is to find recent, genuine developments in the EN 301 549
ecosystem — not general commentary. Every entry must fit exactly one of
these categories:

- "Rulings & Enforcement" — court judgments, ombudsman rulings, formal
  complaints upheld, and enforcement notices/sanctions from national
  enforcement bodies
- "Regulatory Guidance" — official guidance, clarifications, or new
  regulations/frameworks published by EU or member-state bodies (not a
  monitoring report and not a court/enforcement action)
- "Standards Updates" — new or revised versions of EN 301 549, WCAG, or
  related ETSI/CEN-CENELEC standards, and official clarifications to them
- "Implementation & Testing Guidance" — practical guidance on testing or
  implementing EN 301 549 requirements: test methodologies, tooling,
  clause interpretation, published by standards bodies, national
  accessibility centres, or widely-cited practitioner sources
- "Monitoring Reports" — accessibility monitoring/audit findings and
  reports published by national Web Accessibility Directive (EU
  2016/2102) monitoring bodies or the European Commission
- "Research & Analysis" — studies, surveys, or whitepapers analysing EN
  301 549 / WCAG / EAA adoption, effectiveness, or gaps, from
  universities, industry bodies, or organisations like the European
  Disability Forum (EDF)
- "Product & Vendor Conformance" — notable vendor or organisation
  accessibility conformance disclosures (VPATs, accessibility
  statements) that cite EN 301 549, including notable gaps found between
  a claim and real testing
- "Procurement & Tenders" — public sector tenders or procurement
  requirements that cite EN 301 549 conformance
- "Training & Events" — conferences, webinars, or certifications
  specifically about EN 301 549 (not general accessibility events)
- "General News" — another genuine, specific EN 301 549 ecosystem
  development that doesn't fit the categories above

Out of scope — do not include:
- general accessibility news, opinion pieces, or product announcements
  that aren't tied to a specific regulatory, standards, testing,
  research, conformance, procurement, or training development
- generic accessibility conference/webinar announcements that aren't
  specifically about EN 301 549
- anything that isn't a specific, genuine, checkable development tied to
  a named organisation, authority, case, standard, product, or tender

Only include entries you can point to with a real, checkable source URL.
If you are not confident something is genuine and in scope, leave it out
rather than guessing. If an item could plausibly fit more than one
category, pick the single best match.`

const userPrompt = `Search for recent EN 301 549 ecosystem developments from the last 30 days
across all of these categories:

- Court, ombudsman, and enforcement body decisions or sanctions
  (Rulings & Enforcement)
- Official guidance, clarifications, or new regulations from EU or
  member-state bodies (Regulatory Guidance)
- New or revised EN 301 549 / WCAG / ETSI / CEN-CENELEC standards, or
  official clarifications to them (Standards Updates)
- Practical testing/implementation guidance, methodologies, or tooling
  for EN 301 549 (Implementation & Testing Guidance)
- Accessibility monitoring/audit reports from national Web Accessibility
  Directive monitoring bodies or the European Commission (Monitoring
  Reports)
- Studies, surveys, or whitepapers analysing EN 301 549/WCAG/EAA
  adoption or effectiveness (Research & Analysis)
- Notable vendor/organisation accessibility conformance disclosures
  (VPATs, accessibility statements) citing EN 301 549 (Product & Vendor
  Conformance)
- Public tenders or procurement notices citing EN 301 549 conformance
  requirements (Procurement & Tenders)
- Conferences, webinars, or certifications specifically about EN 301 549
  (Training & Events)

Prioritise primary sources: national WAD monitoring/enforcement bodies,
courts and ombudsman offices, ETSI/CEN-CENELEC, W3C WAI, the European
Commission, official procurement portals (e.g. TED — Tenders Electronic
Daily), and organisations like the European Disability Forum (EDF)
reporting on specific developments.

For each genuine finding, produce an object with:
- title: short plain-language headline
- summary: 1-3 sentence plain-language summary of what happened
- category: exactly one of "Rulings & Enforcement", "Regulatory
  Guidance", "Standards Updates", "Implementation & Testing Guidance",
  "Monitoring Reports", "Research & Analysis", "Product & Vendor
  Conformance", "Procurement & Tenders", "Training & Events", or
  "General News" — pick the single best match
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
