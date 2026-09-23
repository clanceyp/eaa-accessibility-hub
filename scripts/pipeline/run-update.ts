import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import Anthropic from '@anthropic-ai/sdk'
import type { z } from 'zod'
import { searchAndExtract } from './search-and-extract'
import { createGithubClient, getFileContent, openUpdatePr, writeFileDirectly } from './github'
import { slugify, uniqueId } from './slugify'

export interface PipelineConfig<Draft, Entry extends { id: string; date: string; title: string }> {
  /** Short lowercase name used in branch names and log output, e.g. "news" */
  name: string
  /** Repo-relative path to the JSON data file this job maintains, e.g. "data/news.json" */
  repoFilePath: string
  draftListSchema: z.ZodType<Draft[]>
  systemPrompt: string
  userPrompt: string
  /** Builds the id used for dedupe + storage from a validated draft entry */
  idFromDraft: (draft: Draft) => string
  /** Combines a draft with its generated id into a full entry */
  toEntry: (draft: Draft, id: string) => Entry
  /**
   * If set, records { lastSearchedAt: <today> } to this path after every
   * run — regardless of whether the search found any new entries. This is
   * operational metadata (when did we last search), not editorial content.
   */
  searchMetaFilePath?: string
}

export interface PipelineResult {
  newEntryCount: number
  prUrl?: string
  branchName?: string
}

export interface PipelineEnv {
  anthropicApiKey: string
  githubToken: string
  githubOwner: string
  githubRepo: string
}

interface ComputedEntries<Entry> {
  newEntries: Entry[]
  merged: Entry[]
}

/** Runs the search + dedupe step shared by both the remote and local pipelines. */
async function computeNewEntries<Draft, Entry extends { id: string; date: string; title: string }>(
  config: PipelineConfig<Draft, Entry>,
  env: PipelineEnv,
  existingEntries: Entry[]
): Promise<ComputedEntries<Entry>> {
  const existingIds = new Set(existingEntries.map((e) => e.id))
  const client = new Anthropic({ apiKey: env.anthropicApiKey })

  const drafts = await searchAndExtract({
    client,
    draftListSchema: config.draftListSchema,
    systemPrompt: config.systemPrompt,
    userPrompt: config.userPrompt,
    existingIds: [...existingIds]
  })

  const newEntries: Entry[] = []
  for (const draft of drafts) {
    const baseId = config.idFromDraft(draft)
    const id = uniqueId(baseId, existingIds)
    existingIds.add(id)
    newEntries.push(config.toEntry(draft, id))
  }

  const merged = [...existingEntries, ...newEntries].sort((a, b) => b.date.localeCompare(a.date))
  return { newEntries, merged }
}

/**
 * Reads/writes the repo's default branch via the GitHub API rather than a
 * local checkout, so it behaves identically whether run from a Vercel
 * serverless function (nightly cron) or a local CLI invocation. Writes
 * searchMetaFilePath straight to the default branch (bypassing PR review —
 * see PipelineConfig.searchMetaFilePath) and only opens a PR when genuine
 * new entries are found.
 */
export async function runPipelineUpdate<Draft, Entry extends { id: string; date: string; title: string }>(
  config: PipelineConfig<Draft, Entry>,
  env: PipelineEnv
): Promise<PipelineResult> {
  const octokit = createGithubClient(env.githubToken)
  const today = new Date().toISOString().slice(0, 10)

  const existingRaw = await getFileContent(octokit, env.githubOwner, env.githubRepo, config.repoFilePath)
  const existingEntries: Entry[] = JSON.parse(existingRaw)

  const { newEntries, merged } = await computeNewEntries(config, env, existingEntries)

  if (config.searchMetaFilePath) {
    await writeFileDirectly(octokit, {
      owner: env.githubOwner,
      repo: env.githubRepo,
      filePath: config.searchMetaFilePath,
      fileContent: `${JSON.stringify({ lastSearchedAt: today }, null, 2)}\n`,
      commitMessage: `Record ${config.name} search run: ${today}`
    })
  }

  if (newEntries.length === 0) {
    console.log(`[${config.name}] No new entries found — nothing to do.`)
    return { newEntryCount: 0 }
  }

  const fileContent = `${JSON.stringify(merged, null, 2)}\n`
  const branchName = `automated/${config.name}-update-${today}-${Date.now()}`
  const entrySummary = newEntries.map((e) => `- ${e.date}: ${e.title}`).join('\n')

  const { prUrl } = await openUpdatePr(octokit, {
    owner: env.githubOwner,
    repo: env.githubRepo,
    filePath: config.repoFilePath,
    fileContent,
    branchName,
    commitMessage: `Update ${config.repoFilePath}: ${newEntries.length} new ${config.name} entr${newEntries.length === 1 ? 'y' : 'ies'}`,
    prTitle: `[automated] ${newEntries.length} new ${config.name} entr${newEntries.length === 1 ? 'y' : 'ies'}`,
    prBody: `Automated ${config.name} update — please review before merging. Nothing here publishes automatically.\n\n${entrySummary}`
  })

  console.log(`[${config.name}] Opened PR with ${newEntries.length} new entries: ${prUrl}`)
  return { newEntryCount: newEntries.length, prUrl, branchName }
}

export interface PipelineLocalResult<Entry> {
  newEntryCount: number
  newEntries: Entry[]
}

/**
 * Local-checkout counterpart to runPipelineUpdate: reads and writes
 * config.repoFilePath and config.searchMetaFilePath directly in the
 * working tree at repoRoot, and does no GitHub API calls at all — no
 * direct-to-main write, no PR. It always rewrites searchMetaFilePath with
 * today's date, and only rewrites repoFilePath when genuine new entries
 * are found. Committing, pushing and opening a PR from the resulting
 * working-tree diff is left to the caller (see the update-news skill),
 * which is expected to do that from a branch it already created — this
 * function never touches git.
 */
export async function runPipelineUpdateLocal<Draft, Entry extends { id: string; date: string; title: string }>(
  config: PipelineConfig<Draft, Entry>,
  env: PipelineEnv,
  repoRoot: string
): Promise<PipelineLocalResult<Entry>> {
  const today = new Date().toISOString().slice(0, 10)
  const dataFilePath = path.join(repoRoot, config.repoFilePath)

  const existingRaw = await readFile(dataFilePath, 'utf-8')
  const existingEntries: Entry[] = JSON.parse(existingRaw)

  const { newEntries, merged } = await computeNewEntries(config, env, existingEntries)

  if (config.searchMetaFilePath) {
    const metaFilePath = path.join(repoRoot, config.searchMetaFilePath)
    await writeFile(metaFilePath, `${JSON.stringify({ lastSearchedAt: today }, null, 2)}\n`)
  }

  if (newEntries.length === 0) {
    console.log(`[${config.name}] No new entries found. ${config.searchMetaFilePath ?? 'search date'} updated locally.`)
    return { newEntryCount: 0, newEntries: [] }
  }

  await writeFile(dataFilePath, `${JSON.stringify(merged, null, 2)}\n`)

  console.log(`[${config.name}] ${newEntries.length} new entr${newEntries.length === 1 ? 'y' : 'ies'} written locally to ${config.repoFilePath}`)
  return { newEntryCount: newEntries.length, newEntries }
}

export function slugId(title: string, date: string): string {
  return slugify(`${date}-${title}`)
}
