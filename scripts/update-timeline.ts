import 'dotenv/config'
import { runPipelineUpdate } from './pipeline/run-update'
import { timelineConfig } from './pipeline/timeline-config'
import { loadPipelineEnv } from './pipeline/env'

async function main() {
  const env = loadPipelineEnv()
  const result = await runPipelineUpdate(timelineConfig, env)

  if (result.newEntryCount === 0) {
    console.log('No new timeline milestones found.')
    return
  }

  console.log(`Opened PR: ${result.prUrl}`)
}

main().catch((error) => {
  console.error('[update-timeline] Failed:', error)
  process.exitCode = 1
})
