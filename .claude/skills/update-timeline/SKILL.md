---
name: update-timeline
description: >-
  Run the EAA Accessibility Hub's timeline search pipeline (npm run
  update:timeline) to look for new EN 301 549 / Web Accessibility
  Directive / European Accessibility Act milestones, then optionally
  branch/commit/push/open a PR for any other local changes. Use when
  asked to update the timeline, search for timeline milestones, or check
  for new EN 301 549 version/deadline news.
---

# Update timeline

Runs this project's timeline-milestone search pipeline manually. Unlike
the news pipeline, timeline milestones are rare (new EN 301 549
versions, Official Journal citations, WAD/EAA deadlines) — an empty
result is the normal, expected outcome most of the time, not a sign
something is broken.

## Steps

1. **Run the search.**

   ```bash
   npm run update:timeline
   ```

   If it finds a genuine new milestone, this opens a PR against `main`
   adding it to `data/timeline.json` (see
   `scripts/pipeline/timeline-config.ts` for what counts as in scope).
   It never merges anything automatically, and — unlike the news
   pipeline — has no separate "last searched" metadata write; a
   no-new-milestones run leaves no trace beyond the console output.

2. **Report the result.** Tell the user whether a new milestone was
   found and link the PR if one was opened. Before presenting it as
   genuine, spot-check the source (e.g. with WebFetch) — timeline
   entries carry more weight than routine news since they represent
   dates people plan compliance work around. Flag anything not clearly
   checkable rather than merging it into the narrative unverified.

3. **Check for other local changes.** Run `git status`. This covers
   things like code edits made earlier in the session, or PR content
   manually copied in for local preview (see the `update-news` skill for
   the established `git show origin/<pr-branch>:data/timeline.json`
   pattern for doing this with timeline.json specifically). If the tree
   is clean, say so and stop here.

4. **Ask before doing anything with those changes.** If there are
   uncommitted local changes, ask the user whether they want them pushed
   now — don't assume yes.

5. **If yes:** create a new branch (never commit this to `main`
   directly), commit with a clear message, push it, and open a PR
   against `main`, matching this repo's existing PR conventions (title,
   summary, test plan).

## Guardrails

- Never merge a PR automatically — every PR this pipeline opens needs a
  human review, per this project's design (see the root `CLAUDE.md`).
- Don't push directly to `main` unless the user explicitly asks for that
  specific action.
- Don't force a result: if the search finds nothing genuinely new and in
  scope, say so plainly rather than stretching a routine news item into
  a "milestone."
