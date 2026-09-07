import type Anthropic from '@anthropic-ai/sdk'
import type { z } from 'zod'

const MODEL = 'claude-opus-5'
const MAX_TOOL_ITERATIONS = 6

export interface SearchAndExtractOptions<T> {
  client: Anthropic
  draftListSchema: z.ZodType<T[]>
  systemPrompt: string
  userPrompt: string
  existingIds: string[]
}

/**
 * Runs a single Claude request with the web_search tool, letting the model
 * research freely, then asks it to emit a JSON array as its final answer.
 * Resumes on `pause_turn` (long search sequences can pause mid-turn) up to
 * MAX_TOOL_ITERATIONS before giving up.
 */
export async function searchAndExtract<T>(opts: SearchAndExtractOptions<T>): Promise<T[]> {
  const existingIdsList = opts.existingIds.length ? opts.existingIds.join(', ') : 'none yet'

  const messages: Anthropic.MessageParam[] = [
    {
      role: 'user',
      content: `${opts.userPrompt}

Entries already recorded (do not repeat these, identified by id): ${existingIdsList}

When you are done researching, reply with ONLY a JSON array matching the schema described above and nothing else — no prose, no markdown code fences. If you find nothing new and genuinely relevant, reply with an empty JSON array: []`
    }
  ]

  let response: Anthropic.Message | undefined

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    response = await opts.client.messages.create({
      model: MODEL,
      max_tokens: 16000,
      system: opts.systemPrompt,
      tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 12 }],
      messages
    })

    if (response.stop_reason === 'pause_turn') {
      messages.push({ role: 'assistant', content: response.content })
      continue
    }

    break
  }

  if (!response) {
    throw new Error('No response received from Claude')
  }

  const textBlock = [...response.content].reverse().find((block): block is Anthropic.TextBlock => block.type === 'text')

  if (!textBlock) {
    throw new Error(`No text block in final response (stop_reason: ${response.stop_reason})`)
  }

  const jsonText = extractJson(textBlock.text)
  const parsed = JSON.parse(jsonText)
  const result = opts.draftListSchema.safeParse(parsed)

  if (!result.success) {
    throw new Error(`Model output did not match schema: ${result.error.message}\n\nRaw text: ${textBlock.text}`)
  }

  return result.data
}

function extractJson(text: string): string {
  const trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  return fenced?.[1] ?? trimmed
}
