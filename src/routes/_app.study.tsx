import { createFileRoute } from '@tanstack/react-router'
import { Calculator, FileText, Lightbulb, ListChecks } from 'lucide-react'
import { z } from 'zod'

import { ToolWorkspace } from '@/components/ToolWorkspace'
import { STUDY_TASKS } from '@/lib/assistant-modes'

const SUGGESTIONS = {
  explain: [
    { title: 'Quantum entanglement', prompt: 'What is quantum entanglement, and why did Einstein call it “spooky”?' },
    { title: 'Supply and demand', prompt: 'Explain how supply and demand set prices, with a real-world example.' },
  ],
  notes: [
    { title: 'World War I causes', prompt: 'Revision notes on the main causes of World War I (MAIN + the assassination).' },
    { title: 'Cell division', prompt: 'Revision notes comparing mitosis and meiosis.' },
  ],
  quiz: [
    { title: 'Periodic table', prompt: 'Groups and trends of the periodic table' },
    { title: 'Shakespeare', prompt: 'Macbeth – characters, themes and key quotes' },
  ],
  solve: [
    { title: 'Quadratic equation', prompt: 'Solve 2x² − 7x + 3 = 0' },
    { title: 'Physics problem', prompt: 'A ball is thrown upward at 15 m/s. How high does it go and how long until it lands? (g = 9.8 m/s²)' },
  ],
}

export const Route = createFileRoute('/_app/study')({
  validateSearch: z.object({
    c: z.string().max(64).optional(),
    task: z.string().max(40).optional(),
  }),
  head: () => ({ meta: [{ title: 'Study Assistant · Infiora AI' }] }),
  component: StudyPage,
})

function StudyPage() {
  const { c, task } = Route.useSearch()
  return (
    <ToolWorkspace
      mode="study"
      title="Study Assistant"
      tagline="Learn faster with an AI tutor."
      tasks={STUDY_TASKS}
      icons={{ explain: Lightbulb, notes: FileText, quiz: ListChecks, solve: Calculator }}
      suggestions={SUGGESTIONS}
      conversationId={c}
      taskId={task}
    />
  )
}
