import {
  fetchServerSentEvents,
  useChat,
  createChatClientOptions,
} from '@tanstack/ai-react'
import type { InferChatMessages, UIMessage } from '@tanstack/ai-react'

import type { Mode } from './assistant-modes'

/** Surfaces the server's JSON error message instead of a bare HTTP status. */
const fetchWithErrors: typeof fetch = async (input, init) => {
  let response: Response
  try {
    response = await fetch(input, init)
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err
    throw new Error('Network error — check your connection and try again.')
  }
  if (!response.ok) {
    let message = `Request failed (${response.status}).`
    try {
      const body = await response.json()
      if (body?.message) message = body.message
    } catch {
      // non-JSON error body
    }
    throw new Error(message)
  }
  return response
}

const connection = fetchServerSentEvents('/api/chat', {
  fetchClient: fetchWithErrors,
})

const defaultChatOptions = createChatClientOptions({ connection })

export type ChatMessages = InferChatMessages<typeof defaultChatOptions>
export type ChatMessage = UIMessage

export interface AIChatConfig {
  id: string
  mode: Mode
  task?: string
  options?: Record<string, string>
  initialMessages?: ChatMessages
}

export const useAIChat = ({ id, mode, task, options, initialMessages }: AIChatConfig) =>
  useChat({
    id,
    connection,
    initialMessages,
    body: { mode, task, options: options ?? {} },
  })

export function messageText(message: { parts: ChatMessages[number]['parts'] }) {
  return message.parts
    .map((p) => (p.type === 'text' ? p.content : ''))
    .join('')
}
