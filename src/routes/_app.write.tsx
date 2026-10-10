import { createFileRoute } from '@tanstack/react-router'
import { Languages, Mail, ScrollText, SpellCheck } from 'lucide-react'
import { z } from 'zod'

import { ToolWorkspace } from '@/components/ToolWorkspace'
import { WRITING_TASKS } from '@/lib/assistant-modes'

const SUGGESTIONS = {
  essay: [
    { title: 'Climate & cities', prompt: 'How should cities adapt to rising temperatures?' },
    { title: 'AI in schools', prompt: 'Should AI tools be allowed in classrooms?' },
  ],
  email: [
    { title: 'Request time off', prompt: 'Ask my manager for next Friday off to attend a family event.' },
    { title: 'Follow up on an application', prompt: 'Follow up politely on a job application I sent two weeks ago.' },
  ],
  grammar: [
    { title: 'Fix a paragraph', prompt: 'me and him goes to the libary yesterday becuase we was needing books for are project.' },
    { title: 'Polish a message', prompt: 'hey just wanted to let u know the meeting is moved, its now on thursday at 3 dont be late' },
  ],
  translate: [
    { title: 'A greeting', prompt: 'Thank you so much for your help — I really appreciate it!' },
    { title: 'Travel phrase', prompt: 'Excuse me, could you tell me how to get to the train station?' },
  ],
}

export const Route = createFileRoute('/_app/write')({
  validateSearch: z.object({
    c: z.string().max(64).optional(),
    task: z.string().max(40).optional(),
  }),
  head: () => ({ meta: [{ title: 'Writing Assistant · Infiora AI' }] }),
  component: WritePage,
})

function WritePage() {
  const { c, task } = Route.useSearch()
  return (
    <ToolWorkspace
      mode="writing"
      title="Writing Assistant"
      tagline="Write with clarity and confidence."
      tasks={WRITING_TASKS}
      icons={{ essay: ScrollText, email: Mail, grammar: SpellCheck, translate: Languages }}
      suggestions={SUGGESTIONS}
      conversationId={c}
      taskId={task}
    />
  )
}
