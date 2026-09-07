import Anthropic from '@anthropic-ai/sdk'
import type { z } from 'zod'
import { searchAndExtract } from './search-and-extract'
import { createGithubClient, getFileContent, openUpdatePr } from './github'
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

export async function runPipelineUpdate<Draft, Entry extends { id: string; date: string; title: string }>(
  config: PipelineConfig<Draft, Entry>,
  env: PipelineEnv
): Promise<PipelineResult> {
  const octokit = createGithubClient(env.githubToken)

  // Read from the repo's default branch (via the GitHub API, not the local
  // checkout) so this always diffs against the latest merged state, whether
  // run from a Vercel serverless function or a local CLI invocation.
  const existingRaw = await getFileContent(octokit, env.githubOwner, env.githubRepo, config.repoFilePath)
  const existingEntries: Entry[] = JSON.parse(existingRaw)
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

  if (newEntries.length === 0) {
    console.log(`[${config.name}] No new entries found — nothing to do.`)
    return { newEntryCount: 0 }
  }

  const merged = [...existingEntries, ...newEntries].sort((a, b) => b.date.localeCompare(a.date))
  const fileContent = `${JSON.stringify(merged, null, 2)}\n`

  const today = new Date().toISOString().slice(0, 10)
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

export function slugId(title: string, date: string): string {
  return slugify(`${date}-${title}`)
}
