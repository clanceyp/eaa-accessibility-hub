# Accessibility Hub — Project Brief for Claude Code

## What this is

A website for web developers/testers, focused on **EN 301 549** (the European
accessibility standard referenced by the EU Web Accessibility Directive and
the European Accessibility Act / EAA). It's a reference + news hub, not a
commercial product — no user accounts, no data collection beyond what's
needed to serve static pages.

## Stack

- **Framework:** Nuxt 3 (Vue 3) — latest
- **Content:** `@nuxt/content` for the static Markdown pages
- **Hosting:** Vercel, Hobby (free) plan
- **Data storage:** No database. Two JSON files committed to the repo:
  - `data/news.json`
  - `data/timeline.json`
- **Package manager:** (fill in once decided — npm/pnpm/yarn)

## Pages

| Route | Purpose |
|---|---|
| `/` | Home — lists latest entries from `data/news.json` |
| `/en301549/web` | EN 301 549 Web overview |
| `/en301549/non-web` | EN 301 549 Non-web overview (mobile apps, kiosks, docs, etc.) |
| `/timeline` | EAA / EN 301 549 milestones, from `data/timeline.json` |
| `/accessibility-statement` | Accessibility Statement |
| `/terms` | Terms & Conditions |
| `/privacy` | Privacy Policy |

## Data files

### `data/news.json`

Latest **legal proceedings/enforcement actions related to accessibility
across the EU**. Not general accessibility news — specifically legal/
regulatory action (court cases, ombudsman rulings, enforcement notices,
monitoring body findings under the Web Accessibility Directive).

Suggested entry shape (adjust as needed once building the list component):

```json
{
  "id": "unique-slug-or-uuid",
  "title": "Short headline",
  "summary": "1-3 sentence plain-language summary",
  "jurisdiction": "Country or 'EU'",
  "date": "YYYY-MM-DD",
  "sourceUrl": "https://...",
  "sourceName": "Publisher/site name"
}
```

### `data/timeline.json`

Static, hand-curated (with occasional research-assisted updates — see
below). Major EAA / EN 301 549 milestones: version releases, compliance
deadlines, amendments.

Suggested entry shape:

```json
{
  "id": "unique-slug-or-uuid",
  "date": "YYYY-MM-DD",
  "title": "Short event title",
  "detail": "Short description of what happened/changed"
}
```

## Update pipeline (build later, not part of initial scaffold)

Both `news.json` and `timeline.json` are updated by scripts that:
1. Search the web (and known sources — EU Web Accessibility Directive
   monitoring reports, national enforcement bodies, EDF, etc.) for
   relevant updates
2. Use the Claude API to extract/summarize and filter for genuine
   legal/regulatory relevance (news) or genuine milestone relevance
   (timeline)
3. Diff against the existing JSON to avoid duplicate entries
4. Write the updated JSON to a **new git branch**
5. Open a **pull request** to `main` via the GitHub API
6. Patrick reviews and **merges manually** — nothing auto-publishes

**`news.json`** — runs **nightly**, triggered by Vercel Cron (Hobby plan
allows up to 2 cron jobs/project, once-per-day frequency — sufficient).

**`timeline.json`** — runs **manually**, as a local CLI command Patrick
triggers occasionally (timeline events are rare, so no schedule needed).

Both scripts should share one underlying module (search → extract →
diff → write → branch → PR) with two thin entry points, rather than
duplicating logic.

### Auth

- GitHub access via a **fine-grained Personal Access Token**, scoped to
  this repo only, with `Contents: Read and write` and
  `Pull requests: Read and write` — nothing else.
- Token stored as `GITHUB_TOKEN` in Vercel env vars (for the nightly job)
  and in a local `.env` file, **gitignored**, for the manual timeline
  script. Never committed to the repo, never shared in chat/docs.
- Claude API key stored as `ANTHROPIC_API_KEY`, same handling.

## Explicitly out of scope for now

- No database — if this ever needs richer querying/filtering than a
  small JSON array can reasonably handle, revisit then.
- No user accounts, comments, or any personal data collection — Privacy
  Policy should reflect that honestly rather than being boilerplate for
  features that don't exist.
- No automatic publishing of news/timeline entries — human review via PR
  merge is a deliberate design choice, not a placeholder for later
  automation.

## Open items to fill in as the project develops

- [ ] Package manager choice
- [ ] Design direction / visual style (WCAG-compliant, obviously — this
      site should itself be a good accessibility example)
- [ ] Exact list of source sites for the nightly news search
- [ ] Whether `@nuxt/content` reads the JSON files directly or a simple
      `useFetch`/server route is used instead
