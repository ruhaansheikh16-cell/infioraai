import { createFileRoute } from '@tanstack/react-router'
import { chat, maxIterations, toServerSentEventsResponse } from '@tanstack/ai'
import { anthropicText } from '@tanstack/ai-anthropic'
import { openaiText } from '@tanstack/ai-openai'
import { geminiText } from '@tanstack/ai-gemini'
import { z } from 'zod'

import { MAX_MESSAGE_CHARS, MAX_MESSAGES, MODES } from '@/lib/assistant-modes'
import { buildSystemPrompt } from '@/server/prompts'

const requestSchema = z.object({
  messages: z
    .array(
      z.looseObject({
        role: z.enum(['user', 'assistant', 'system', 'tool']),
      }),
    )
    .min(1, 'Send at least one message.')
    .max(MAX_MESSAGES, 'This conversation is too long. Start a new chat.'),
  data: z
    .object({
      mode: z.enum(MODES).default('chat'),
      task: z.string().max(40).optional(),
      options: z.record(z.string(), z.string().max(60)).default({}),
    })
    .default({ mode: 'chat', options: {} }),
})

function jsonError(status: number, message: string) {
  return Response.json({ error: true, message }, { status })
}

/**
 * Picks the first configured provider. On Netlify, AI Gateway injects these
 * keys automatically at runtime; locally you can set your own in `.env`.
 * Keys are only ever read here, on the server.
 */
function pickAdapter() {
  if (process.env.ANTHROPIC_API_KEY) return anthropicText('claude-sonnet-4-6')
  if (process.env.OPENAI_API_KEY) return openaiText('gpt-4o')
  if (process.env.GEMINI_API_KEY) return geminiText('gemini-2.5-flash' as any)
  return null
}

function contentLength(content: unknown): number {
  if (typeof content === 'string') return content.length
  if (Array.isArray(content)) {
    return content.reduce(
      (n, p) => n + (typeof p?.content === 'string' ? p.content.length : 0),
      0,
    )
  }
  return 0
}

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (request.signal.aborted) {
          return new Response(null, { status: 499 })
        }

        let body: unknown
        try {
          body = await request.json()
        } catch {
          return jsonError(400, 'Request body must be valid JSON.')
        }

        const parsed = requestSchema.safeParse(body)
        if (!parsed.success) {
          return jsonError(400, parsed.error.issues[0]?.message ?? 'Invalid request.')
        }
        const { messages, data } = parsed.data

        const tooLong = messages.some(
          (m) => m.role === 'user' && contentLength(m.content) > MAX_MESSAGE_CHARS,
        )
        if (tooLong) {
          return jsonError(
            413,
            `Messages are limited to ${MAX_MESSAGE_CHARS.toLocaleString()} characters.`,
          )
        }

        const adapter = pickAdapter()
        if (!adapter) {
          return jsonError(
            503,
            'No AI provider is configured. Deploy to Netlify (AI Gateway) or set ANTHROPIC_API_KEY, OPENAI_API_KEY or GEMINI_API_KEY on the server.',
          )
        }

        const abortController = new AbortController()
        request.signal.addEventListener('abort', () => abortController.abort())

        try {
          const stream = chat({
            adapter,
            systemPrompts: [buildSystemPrompt(data.mode, data.task, data.options)],
            agentLoopStrategy: maxIterations(1),
            messages: messages as any,
            abortController,
          })

          return toServerSentEventsResponse(stream, { abortController })
        } catch (error: any) {
          if (error?.name === 'AbortError' || abortController.signal.aborted) {
            return new Response(null, { status: 499 })
          }
          console.error('Chat error:', error)
          return jsonError(502, 'The AI service could not answer right now. Please try again.')
        }
      },
    },
  },
})
