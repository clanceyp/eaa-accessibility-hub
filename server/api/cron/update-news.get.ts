import { runPipelineUpdate } from '../../../scripts/pipeline/run-update'
import { newsConfig } from '../../../scripts/pipeline/news-config'
import { loadPipelineEnv } from '../../../scripts/pipeline/env'

/**
 * Triggered nightly by Vercel Cron (see vercel.json). Vercel sends
 * `Authorization: Bearer $CRON_SECRET` on cron-triggered requests when
 * CRON_SECRET is set — reject anything else so this can't be hit publicly
 * to burn Claude API / GitHub API calls.
 */
export default defineEventHandler(async (event) => {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = getHeader(event, 'authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
  }

  const env = loadPipelineEnv()
  return await runPipelineUpdate(newsConfig, env)
})
