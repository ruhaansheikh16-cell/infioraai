import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { ChatPanel } from '@/components/ChatPanel'
import { EmptyState } from '@/components/EmptyState'
import { newConversationId } from '@/lib/conversations'

const SUGGESTIONS = [
  {
    title: 'Brainstorm a side project',
    prompt: 'Give me 5 original side-project ideas for a student who likes design and coding, with a first step for each.',
  },
  {
    title: 'Plan my week',
    prompt: 'Help me build a realistic weekly plan that balances exams, a part-time job and the gym.',
  },
  {
    title: 'Explain like I’m 12',
    prompt: 'Explain how large language models work like I’m 12 years old.',
  },
  {
    title: 'Debug some code',
    prompt: 'Why does `[1, 2, 10].sort()` return [1, 10, 2] in JavaScript, and how do I fix it?',
  },
]

export const Route = createFileRoute('/_app/chat')({
  validateSearch: z.object({ c: z.string().max(64).optional() }),
  head: () => ({ meta: [{ title: 'Chat · Infiora AI' }] }),
  component: ChatPage,
})

function ChatPage() {
  const { c } = Route.useSearch()
  const [fallbackId] = useState(newConversationId)
  const id = c ?? fallbackId
  const [draft, setDraft] = useState<{ text: string; nonce: number }>()

  return (
    <ChatPanel
      key={id}
      conversationId={id}
      mode="chat"
      placeholder="Ask Infiora anything…"
      draft={draft}
      emptyState={
        <EmptyState
          title={
            <>
              What’s on your <span className="text-gradient">mind</span>?
            </>
          }
          subtitle="Chat with Infiora about anything — ideas, plans, code or questions. Answers are generated live by AI."
          suggestions={SUGGESTIONS}
          onPick={(text) => setDraft({ text, nonce: Date.now() })}
        />
      }
    />
  )
}
