---
name: update-news
description: >-
  Run the EAA Accessibility Hub's news search pipeline (npm run
  update:news), which also refreshes the "last searched" date, then sync
  local state and optionally branch/commit/push/open a PR for any other
  local changes. Use when asked to run the news pipeline, update the
  news, run the content update, or find more news/content.
---

# Update news

Runs this project's news-search pipeline manually and keeps local state in
sync with what it does on GitHub.

## Steps

1. **Run the search.**

   ```bash
   npm run update:news
   ```

   Every run does two things, regardless of outcome (see
   `scripts/pipeline/run-update.ts`):
   - Records `{ "lastSearchedAt": <today> }` directly to
     `data/news-meta.json` on `main` — no PR, since this is operational
     metadata, not editorial content (`writeFileDirectly` in
     `scripts/pipeline/github.ts`).
   - If it finds genuine new entries, opens a PR against `main` adding
     them to `data/news.json`. It never merges anything automatically.

2. **Report the result.** Tell the user whether new entries were found
   and link the PR if one was opened. Before presenting any new entry as
   genuine, spot-check at least one `sourceUrl` (e.g. with WebFetch) and
   flag anything that doesn't check out.

3. **Sync local state.** The `data/news-meta.json` commit lands on
   *remote* `main`, not the local checkout. If the local branch is behind
   `origin/main`, say so and offer to `git pull` on `main` so the local
   footer preview reflects the new search date.

4. **Check for other local changes.** Run `git status`. This covers
   things like code edits made earlier in the session, or PR content
   manually copied in for local preview (a common pattern in this repo —
   see recent session history for the `git show origin/<pr-branch>:data/news.json`
   approach). If the tree is clean, say so and stop here.

5. **Ask before doing anything with those changes.** If there are
   uncommitted local changes, ask the user whether they want them pushed
   now — don't assume yes.

6. **If yes:** create a new branch (never commit this to `main`
   directly), commit with a clear message, push it, and open a PR against
   `main`, matching this repo's existing PR conventions (title, summary,
   test plan, merge-order notes if relevant).

## Guardrails

- Never merge a PR automatically — every PR this pipeline opens needs a
  human review, per this project's design (see the root `CLAUDE.md`).
- Don't push directly to `main` unless the user explicitly asks for that
  specific action.
- The direct-commit behavior for `data/news-meta.json` is a deliberate,
  narrow exception to "PR review only" — it applies *only* to that one
  operational-metadata file, never to `data/news.json` or `data/timeline.json`.
