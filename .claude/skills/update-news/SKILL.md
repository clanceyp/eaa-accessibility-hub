---
name: update-news
description: >-
  Run the EAA Accessibility Hub's news search pipeline from a local branch
  (npm run update:news:local), then always push that branch and open a PR
  — even when the search finds no new entries, since the "last searched"
  date still moved. Use when asked to run the news pipeline, update the
  news, run the content update, or find more news/content.
---

# Update news

Runs this project's news-search pipeline manually, on a local branch, and
always opens a PR from it — unlike the nightly Vercel cron job, which
writes `data/news-meta.json` straight to `main` and only opens a PR when
it finds genuine new entries (see `scripts/pipeline/run-update.ts`,
`runPipelineUpdate` vs `runPipelineUpdateLocal`). This manual path never
writes to `main` directly.

## Steps

1. **Check the codebase is ready.** Run `git fetch origin main`, then
   confirm all three:
   - Current branch is `main`
   - Working tree is clean (`git status` shows nothing to commit)
   - Local `main` matches `origin/main` (not ahead, not behind)

   If any of these aren't true, stop and ask the user what to do —
   don't branch off dirty or stale state, and don't fix it yourself
   (e.g. don't stash, pull, or discard changes without asking first).

2. **Branch.** Create a new local branch off `main`, e.g.
   `news-update-<YYYY-MM-DD>`.

3. **Run the search pipeline locally.**

   ```bash
   npm run update:news:local
   ```

   This reads and writes `data/news.json` and `data/news-meta.json`
   directly in the working tree, on the branch just created — no GitHub
   API calls, no direct write to `main`. It always rewrites
   `data/news-meta.json` with today's date, and only rewrites
   `data/news.json` when it finds genuine new entries.

4. **If new entries were found, check them.** Before presenting any new
   entry as genuine, spot-check at least one `sourceUrl` per new entry
   (e.g. with WebFetch) and flag anything that doesn't check out before
   continuing.

5. **Commit, push, and open a PR — always**, even if the only change is
   the updated date in `data/news-meta.json`. Match this repo's existing
   PR conventions (title, summary, test plan).

6. **Report the result** to the user: whether new entries were found,
   and link the PR.

## Guardrails

- Never merge a PR automatically — every PR this pipeline opens needs a
  human review, per this project's design (see the root `CLAUDE.md`).
- Never push directly to `main`.
- This changes the *manual* run only. The nightly Vercel cron
  (`server/api/cron/update-news.get.ts`, still calling
  `runPipelineUpdate`) is unaffected — it still writes
  `data/news-meta.json` straight to `main` and only opens a PR for
  genuine new entries. Don't apply this skill's local-branch behavior to
  the cron path or change `runPipelineUpdate`/`server/api/cron/*` to
  match it.
