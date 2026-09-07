import { Octokit } from '@octokit/rest'

export function createGithubClient(token: string): Octokit {
  return new Octokit({ auth: token })
}

/** Reads a text file's current content from the repo's default branch. */
export async function getFileContent(octokit: Octokit, owner: string, repo: string, path: string): Promise<string> {
  const { data } = await octokit.rest.repos.getContent({ owner, repo, path })

  if (Array.isArray(data) || data.type !== 'file' || typeof data.content !== 'string') {
    throw new Error(`${path} is not a readable file in ${owner}/${repo}`)
  }

  return Buffer.from(data.content, 'base64').toString('utf-8')
}

export interface OpenUpdatePrOptions {
  owner: string
  repo: string
  /** Repo-relative path, e.g. "data/news.json" */
  filePath: string
  /** Full new file content */
  fileContent: string
  branchName: string
  commitMessage: string
  prTitle: string
  prBody: string
}

export interface OpenUpdatePrResult {
  branchName: string
  prUrl: string
  prNumber: number
}

/**
 * Writes a single file to a new branch via the Git Data API and opens a PR
 * to the repo's default branch. Used by both the nightly news job and the
 * manual timeline job so nothing publishes without a human merging the PR.
 */
export async function openUpdatePr(octokit: Octokit, opts: OpenUpdatePrOptions): Promise<OpenUpdatePrResult> {
  const { owner, repo } = opts

  const { data: repoInfo } = await octokit.rest.repos.get({ owner, repo })
  const baseBranch = repoInfo.default_branch

  const { data: baseRef } = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${baseBranch}` })
  const baseSha = baseRef.object.sha

  const { data: baseCommit } = await octokit.rest.git.getCommit({ owner, repo, commit_sha: baseSha })

  const { data: newTree } = await octokit.rest.git.createTree({
    owner,
    repo,
    base_tree: baseCommit.tree.sha,
    tree: [
      {
        path: opts.filePath,
        mode: '100644',
        type: 'blob',
        content: opts.fileContent
      }
    ]
  })

  const { data: newCommit } = await octokit.rest.git.createCommit({
    owner,
    repo,
    message: opts.commitMessage,
    tree: newTree.sha,
    parents: [baseSha]
  })

  await octokit.rest.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${opts.branchName}`,
    sha: newCommit.sha
  })

  const { data: pr } = await octokit.rest.pulls.create({
    owner,
    repo,
    title: opts.prTitle,
    body: opts.prBody,
    head: opts.branchName,
    base: baseBranch
  })

  return { branchName: opts.branchName, prUrl: pr.html_url, prNumber: pr.number }
}
