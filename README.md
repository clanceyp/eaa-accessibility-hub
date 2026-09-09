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
- **Data:** two committed JSON files (`data/news.json`,
  `data/timeline.json`), served via Nitro API routes and updated only
  through reviewed pull requests — see [Update pipeline](#update-pipeline)
- **Hosting:** Vercel (Hobby plan), with one Vercel Cron job

## Local development

```bash
npm install
npm run dev       # http://localhost:3000
```

Other useful scripts:

```bash
npm run typecheck   # nuxt typecheck (vue-tsc)
npm run build        # production build into .output/
npm run preview      # preview a production build locally
npm run update:news  # run the news pipeline locally (see below)
```

No environment variables are required to run the site itself — `news.get.ts`
and `timeline.get.ts` import `data/*.json` directly (see
[Why the data is imported, not read from disk](#why-the-data-is-imported-not-read-from-disk)),
so the app works with zero config out of the box. Env vars are only needed
to run the update pipeline (see below).

## Project structure

```
app/                   Nuxt app (pages, components, layouts)
  pages/                index.vue (news), timeline.vue, en301549/,
                         [...slug].vue (catch-all renderer for content/)
content/                Markdown reference pages (EN 301 549 clauses,
                         legal pages) rendered via @nuxt/content
data/                   news.json, timeline.json — the two data files
                         the site reads; edited only via PR merge
server/api/             news.get.ts, timeline.get.ts (data endpoints),
                         cron/update-news.get.ts (nightly trigger)
scripts/                update-news.ts (CLI entry point) and
  pipeline/              the shared search -> extract -> diff -> PR
                         module used by both the CLI and the cron route
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

## Update pipeline

Both `news.json` and `timeline.json` are meant to be updated by an
automated pipeline (`scripts/pipeline/`) that:

1. Searches the web via Claude's `web_search` tool for genuine legal /
   regulatory accessibility news (news) or EN 301 549 / EAA milestones
   (timeline)
2. Extracts and validates structured entries with Claude, deduping
   against IDs already in the target file
3. Opens a **pull request** to `main` with the updated JSON — nothing
   publishes automatically; a human reviews and merges

Run it locally:

```bash
cp .env.example .env   # fill in GITHUB_TOKEN, ANTHROPIC_API_KEY, GITHUB_OWNER, GITHUB_REPO
npm run update:news
```

On Vercel, `/api/cron/update-news` runs the same pipeline, triggered
nightly by the Vercel Cron job defined in `vercel.json` (`0 3 * * *`, i.e.
03:00 UTC). The timeline pipeline has no scheduled trigger yet — timeline
milestones are rare enough that it's run manually when needed (currently
no `update:timeline` script exists; add one following `update-news.ts` as
a template if that changes).

**Important:** the pipeline reads the *current* `data/news.json` via the
GitHub Contents API (not the local filesystem), so it always diffs against
whatever is merged on `main` — this makes it safe to run from a stale
local checkout or from Vercel's serverless function without risking a
diverged base file.

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
| `ANTHROPIC_API_KEY` | `/api/cron/update-news` | Claude API key for the nightly pipeline |
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
  "crons": [{ "path": "/api/cron/update-news", "schedule": "0 3 * * *" }]
}
```

Vercel's Hobby plan allows up to 2 cron jobs at once-per-day frequency,
which this fits. No extra Vercel configuration is needed for the cron
itself beyond the environment variables above — Vercel reads `vercel.json`
from the repo automatically.

## Not yet configured / open items

- No custom domain chosen yet (see chat history for candidate `.eu`/`.dev`
  domain suggestions)
- No `update:timeline` script/cron — timeline updates are run ad hoc
  today; add a script + (optionally) a second cron entry if that changes
- GitHub branch protection / required review on `main` is not yet
  confirmed — recommended, since the pipeline's only safety net is "a
  human merges the PR"
