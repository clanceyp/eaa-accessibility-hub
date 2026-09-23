import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runPipelineUpdate, runPipelineUpdateLocal } from './pipeline/run-update'
import { newsConfig } from './pipeline/news-config'
import { loadPipelineEnv } from './pipeline/env'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

async function main() {
  const env = loadPipelineEnv()

  if (process.argv.includes('--local')) {
    const result = await runPipelineUpdateLocal(newsConfig, env, repoRoot)
    if (result.newEntryCount === 0) {
      console.log('No new news entries found. data/news-meta.json updated locally.')
      return
    }
    console.log(`${result.newEntryCount} new entr${result.newEntryCount === 1 ? 'y' : 'ies'} written locally to data/news.json:`)
    for (const entry of result.newEntries) {
      console.log(`  - ${entry.date}: ${entry.title}`)
    }
    return
  }

  const result = await runPipelineUpdate(newsConfig, env)

  if (result.newEntryCount === 0) {
    console.log('No new news entries found.')
    return
  }

  console.log(`Opened PR: ${result.prUrl}`)
}

main().catch((error) => {
  console.error('[update-news] Failed:', error)
  process.exitCode = 1
})
