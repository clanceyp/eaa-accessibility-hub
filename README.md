# EAA Accessibility Hub

A reference and news hub for **EN 301 549** and the **European Accessibility
Act (EAA)** — for web developers and testers working on digital
accessibility compliance across the EU. See [CLAUDE.md](./CLAUDE.md) for
the full project brief (scope, data model, design decisions).

- **Live site:** deployed on Vercel — project: https://vercel.com/home-787f
- **Repo:** https://github.com/clanceyp/eaa-accessibility-hub

## Stack

- **Framework:** Nuxt 4 (Vue 3), Nitro server engine
- **Content:** `@nuxt/content` for the Markdown reference pages
  (`content/`)
- **Styling:** Tailwind CSS v4, palette/type loosely based on etsi.org
- **Data:** `data/news.json` and `data/timeline.json`, served via Nitro
  API routes and updated only through reviewed pull requests, plus
  `data/news-meta.json` (operational metadata — the last search date,
  not editorial content, so it's not held to the same PR-only rule by
  every path) — see [Update pipeline](#update-pipeline)
- **Hosting:** Vercel (Hobby plan), with one Vercel Cron job

## Local development

```bash
npm install
npm run dev       # http://localhost:3000
```

Other useful scripts:

```bash
npm run typecheck         # nuxt typecheck (vue-tsc)
npm run build              # production build into .output/
npm run preview            # preview a production build locally
npm run update:news        # news pipeline, GitHub-API mode (same as the weekly cron — see below)
npm run update:news:local  # news pipeline, local-branch mode (see the update-news skill — see below)
npm run update:timeline    # timeline pipeline (see below)
npm run test                # run the test suite once (see Testing below)
npm run test:watch          # re-run tests on file change
```

No environment variables are required to run the site itself — `news.get.ts`
and `timeline.get.ts` import `data/*.json` directly (see
[Why the data is imported, not read from disk](#why-the-data-is-imported-not-read-from-disk)),
so the app works with zero config out of the box. Env vars are only needed
to run the update pipeline (see below).

## Project structure

```
app/                   Nuxt app (pages, components, layouts)
  pages/                index.vue (news), timeline.vue, overview/,
                         [...slug].vue (catch-all renderer for content/)
content/                Markdown reference pages (EN 301 549 clauses,
                         legal pages) rendered via @nuxt/content
data/                   news.json, timeline.json (edited only via PR
                         merge) and news-meta.json (last-searched date)
server/api/             news.get.ts, timeline.get.ts (data endpoints),
                         cron/update-news.get.ts (weekly trigger)
scripts/                update-news.ts, update-timeline.ts (CLI entry
                         points) and
  pipeline/              the shared search -> extract -> diff module:
                         runPipelineUpdate (GitHub API; used by the
                         cron route and update-timeline.ts) vs
                         runPipelineUpdateLocal (local checkout, no
                         git/PR of its own; used by
                         `update-news.ts --local`) — see Update pipeline
shared/                 site.ts, news-categories.ts — constants used by
                         both app/ and server/
```

## Content editing

- **News and timeline entries:** edit `data/news.json` / `data/timeline.json`
  directly (see `CLAUDE.md` for the entry shape), or let the pipeline
  propose changes via PR — see below. Never edit these files to bypass
  review; that defeats the point of the pipeline.
- **EN 301 549 / legal pages:** edit the Markdown files under `content/`.
  Frontmatter `title` values containing a colon must be quoted
  (`title: "EN 301 549 — Clause 9: Web"`) — an unquoted colon splits the
  YAML value into a nested object and breaks the page `<title>`.

## Testing

Tests run on [Vitest](https://vitest.dev), using
[`@nuxt/test-utils`](https://nuxt.com/docs/getting-started/testing) for the
tests that need a real Nuxt/Nitro app. `npm run test` runs everything
(~5s); `npm run test:watch` re-runs on change. There's no CI wired up yet
— run it locally before pushing, especially before touching
`server/api/*`, `scripts/pipeline/*`, or `data/*.json`.

```
tests/
  unit/           Plain Vitest, node environment, no Nuxt boot — fast.
    pipeline/      slugify(), uniqueId(), the zod schemas in
                   scripts/pipeline/schema.ts
    data/          Validates data/news.json, data/timeline.json and
                   data/news-meta.json against those schemas, and
                   checks for duplicate ids/sourceUrls — run this after
                   any manual edit to one of these files
  nuxt/           Component tests. Needs `// @vitest-environment nuxt`
                  at the top of the file (switches Vitest into a Nuxt
                  context so auto-imports resolve) and
                  `mountSuspended()` from `@nuxt/test-utils/runtime`.
  e2e/            Boots the actual built app in a child process and hits
                  it over real HTTP with `$fetch` from
                  `@nuxt/test-utils/e2e`. Slower (~5s to boot), but this
                  is the layer that exercises what a browser (or Vercel)
                  actually sees — see the note below.
```

**Why there's an e2e layer at all:** the news/timeline API routes
previously read their JSON off disk at runtime and worked fine in every
unit test and in local dev, while silently returning nothing once
deployed to Vercel (see
[Why the data is imported, not read from disk](#why-the-data-is-imported-not-read-from-disk)).
No amount of unit-testing the route's *logic* in isolation would have
caught that — the bug was in how the built server resolved a file path,
which only shows up when the real built server actually runs and is hit
over HTTP. `tests/e2e/api.test.ts` does exactly that. If you add a new
`server/api/*` route that touches the filesystem, add a matching e2e
assertion rather than only a unit test.

Adding a new component test: copy the shape of
`tests/nuxt/components/NewsCard.test.ts` — one file per component,
`mountSuspended` + `@vitest-environment nuxt` pragma at the top.

## Update pipeline

Both `news.json` and `timeline.json` are updated by a shared pipeline
(`scripts/pipeline/`) that:

1. Searches the web via Claude's `web_search` tool for genuine legal /
   regulatory accessibility news (news) or EN 301 549 / EAA milestones
   (timeline)
2. Extracts and validates structured entries with Claude, deduping
   against IDs already in the target file
3. Writes the result as a **pull request** — nothing publishes
   automatically; a human reviews and merges

The pipeline module (`scripts/pipeline/run-update.ts`) has two modes:

- **`runPipelineUpdate`** — reads/writes via the GitHub API, not the
  local filesystem, so it always diffs against whatever's merged on
  `main` and is safe to run from a stale local checkout or from Vercel's
  serverless function. For news, it also writes `data/news-meta.json`'s
  `lastSearchedAt` straight to `main` (bypassing PR review — it's
  operational metadata, not editorial content) and only opens a PR when
  it finds genuine new entries. Powers the weekly Vercel Cron and
  `npm run update:timeline`.
- **`runPipelineUpdateLocal`** (news only) — reads/writes
  `data/news.json` / `data/news-meta.json` directly in the local working
  tree and does no git/PR itself. Powers `npm run update:news:local`,
  which the `update-news` skill (`.claude/skills/update-news/`) wraps
  into: verify `main` is clean and in sync with `origin/main`, branch,
  run the pipeline, spot-check any new entries, then always commit,
  push and open a PR — even if the only change is the refreshed search
  date — since this path never writes to `main` directly.

Run it locally:

```bash
cp .env.example .env   # fill in GITHUB_TOKEN, ANTHROPIC_API_KEY, GITHUB_OWNER, GITHUB_REPO
npm run update:news         # GitHub-API mode, same as the weekly cron
npm run update:news:local   # local-branch mode — see the update-news skill
npm run update:timeline
```

On Vercel, `/api/cron/update-news` runs `runPipelineUpdate` for news,
triggered weekly by the Vercel Cron job defined in `vercel.json`
(`0 3 * * 1`, i.e. Mondays at 03:00 UTC). The timeline pipeline has no
scheduled trigger — timeline milestones are rare enough (new EN 301 549
versions, Official Journal citations, WAD/EAA deadlines) that
`npm run update:timeline` is just run manually when needed. Also see the
`/update-timeline` skill (`.claude/skills/update-timeline/`) and the
`/update-news` skill above for the local-branch news flow.

### Why the data is imported, not read from disk

`server/api/news.get.ts` and `server/api/timeline.get.ts` `import` the
JSON files directly rather than reading them at runtime with
`fs.readFile`. This is deliberate, not a shortcut: a runtime read of a
path built from `import.meta.url` only worked in local dev by coincidence
of directory depth, and **silently returned nothing once deployed to
Vercel** (Nitro only bundles files it can statically trace through
imports — a computed runtime `fs` path isn't one of them, so
`data/*.json` never made it into the serverless function). Importing the
JSON makes Rollup inline the data into the compiled function at build
time, so there's no runtime filesystem dependency at all. This also costs
nothing given the update pipeline's design: the data only changes via a
PR merge, which triggers a fresh Vercel build anyway.

If you ever see the News or Timeline pages come back empty in production
after a change to these two files' *loading logic* (not their content),
check this first — a stray `fs.readFile`/`fileURLToPath` reintroduces
the exact bug described above.

## Deployment (Vercel)

The project is connected to Vercel at
**https://vercel.com/home-787f** and deploys automatically on every push
to `main` (and preview-deploys PRs). Nuxt is a first-class Vercel
framework, so no explicit Nitro preset or build command override is
needed — Vercel detects it and builds accordingly.

### Required environment variables (Vercel Project Settings → Environment Variables)

| Variable | Used by | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | `/api/cron/update-news` | Claude API key for the weekly pipeline |
| `GITHUB_TOKEN` | `/api/cron/update-news` | Fine-grained PAT, this repo only, `Contents: Read and write` + `Pull requests: Read and write` |
| `GITHUB_OWNER` | `/api/cron/update-news` | `clanceyp` |
| `GITHUB_REPO` | `/api/cron/update-news` | `eaa-accessibility-hub` |
| `CRON_SECRET` | `/api/cron/update-news` | Any random string. Vercel Cron automatically sends it back as `Authorization: Bearer <value>` on scheduled calls — set the **same value** here so the route can verify the request actually came from Vercel Cron and not a public hit. See [Vercel's Cron Jobs docs](https://vercel.com/docs/cron-jobs) for how this header is generated. |

None of these are required for the site's core pages (news list, timeline
page, EN 301 549 reference) to render — those read the JSON bundled at
build time (see above) and have no runtime dependency on these vars. They
are only exercised when `/api/cron/update-news` actually fires.

### Cron

`vercel.json` declares one Vercel Cron job:

```json
{
  "crons": [{ "path": "/api/cron/update-news", "schedule": "0 3 * * 1" }]
}
```

Vercel's Hobby plan allows up to 2 cron jobs at once-per-day frequency,
which this fits. No extra Vercel configuration is needed for the cron
itself beyond the environment variables above — Vercel reads `vercel.json`
from the repo automatically.

## Not yet configured / open items

- Custom domain **eaaa11yhub.eu** is chosen and hardcoded as the
  canonical origin (`shared/site.ts`, used for the sitemap and OG tags)
  — not yet confirmed whether it's actually attached under Vercel
  Project Settings → Domains
- No timeline cron — `npm run update:timeline` exists and is run ad hoc;
  add a second Vercel Cron entry (`/api/cron/update-timeline`, mirroring
  the news one) only if milestones start needing more than manual runs
- GitHub branch protection / required review on `main` is confirmed
  **not enabled** (`gh api repos/.../branches/main/protection` → 404
  "Branch not protected") — recommended, since the pipeline's only
  safety net today is "a human merges the PR"
- **Vercel Analytics + Speed Insights: code done, dashboard toggles
  still needed.** Both `@vercel/analytics` and `@vercel/speed-insights`
  are installed and registered as Nuxt modules — `nuxt.config.ts`'s
  `modules` array must reference their `/nuxt` subpath (e.g.
  `@vercel/analytics/nuxt`), not the bare package name, which resolves
  to their generic browser core instead of the actual Nuxt module and
  silently does nothing (the original Analytics entry had exactly this
  bug — fixed in PR #30, which added Speed Insights alongside it).
  `@vercel/analytics` is pinned to the `2.3.0-canary` release for
  `vue-router@^5` support; `@vercel/speed-insights` has no
  `vue-router@^5`-compatible release yet (even its canaries still
  declare `^4`), so it's pinned via an npm `overrides` entry in
  `package.json` instead — the peer is optional and unused by the Nuxt
  integration path. Decided against Google Analytics earlier — it needs
  cookies and a consent banner (gtag.js sets `_ga`/`_ga_*`, and standard
  GA sends data to Google/US, which several EU DPAs have flagged as a
  GDPR problem without extra safeguards) — which would have conflicted
  with the "no cookies, no tracking analytics" claims in the Privacy
  Policy. Vercel's tools identify visitors with a request hash discarded
  after 24h instead of a cookie, so they fit the existing Privacy Policy
  as-is with no consent banner needed. **Still to do:** enable Web
  Analytics and Speed Insights for the project in the Vercel dashboard
  (Project → Analytics / Speed Insights → Enable — paid add-ons, check
  pricing first); nothing shows up in either dashboard until they're on.
