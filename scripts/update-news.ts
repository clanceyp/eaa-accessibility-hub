import 'dotenv/config'
import { runPipelineUpdate } from './pipeline/run-update'
import { newsConfig } from './pipeline/news-config'
import { loadPipelineEnv } from './pipeline/env'

async function main() {
  const env = loadPipelineEnv()
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
