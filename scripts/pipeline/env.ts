import type { PipelineEnv } from './run-update'

export function loadPipelineEnv(): PipelineEnv {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY
  const githubToken = process.env.GITHUB_TOKEN
  const githubOwner = process.env.GITHUB_OWNER
  const githubRepo = process.env.GITHUB_REPO

  const missing = [
    !anthropicApiKey && 'ANTHROPIC_API_KEY',
    !githubToken && 'GITHUB_TOKEN',
    !githubOwner && 'GITHUB_OWNER',
    !githubRepo && 'GITHUB_REPO'
  ].filter(Boolean)

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  return {
    anthropicApiKey: anthropicApiKey!,
    githubToken: githubToken!,
    githubOwner: githubOwner!,
    githubRepo: githubRepo!
  }
}
