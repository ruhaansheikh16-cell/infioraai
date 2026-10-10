import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { ChatPanel } from './ChatPanel'
import { EmptyState } from './EmptyState'
import type { Mode, Task } from '@/lib/assistant-modes'
import { newConversationId, useConversations } from '@/lib/conversations'
import { ROUTE_FOR_MODE } from '@/lib/nav'

interface ToolWorkspaceProps {
  mode: Exclude<Mode, 'chat'>
  title: string
  tagline: string
  tasks: ReadonlyArray<Task>
  icons: Record<string, LucideIcon>
  suggestions: Record<string, Array<{ title: string; prompt: string }>>
  conversationId?: string
  taskId?: string
}

function defaultOptions(task: Task) {
  return Object.fromEntries((task.options ?? []).map((o) => [o.name, o.choices[0]]))
}

export function ToolWorkspace(props: ToolWorkspaceProps) {
  const { mode, tasks, conversationId, taskId } = props
  const store = useConversations()
  const navigate = useNavigate()
  const [fallbackId] = useState(newConversationId)
  const id = conversationId ?? fallbackId
  const existing = store.get(id)

  const task =
    tasks.find((t) => t.id === (existing?.task ?? taskId)) ?? tasks[0]

  // Remount per conversation so options reset with the chat.
  return (
    <Workspace
      key={id}
      {...props}
      id={id}
      task={task}
      initialOptions={existing?.options ?? defaultOptions(task)}
      onTaskChange={(t) =>
        navigate({
          to: ROUTE_FOR_MODE[mode],
          search: { c: newConversationId(), task: t.id },
        })
      }
    />
  )
}

function Workspace({
  mode,
  title,
  tagline,
  tasks,
  icons,
  suggestions,
  id,
  task,
  initialOptions,
  onTaskChange,
}: ToolWorkspaceProps & {
  id: string
  task: Task
  initialOptions: Record<string, string>
  onTaskChange: (t: Task) => void
}) {
  const [options, setOptions] = useState(initialOptions)
  const [draft, setDraft] = useState<{ text: string; nonce: number }>()

  const tabs = (
    <div
      role="tablist"
      aria-label={`${title} tools`}
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
    >
      {tasks.map((t) => {
        const Icon = icons[t.id]
        const active = t.id === task.id
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => !active && onTaskChange(t)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
              active
                ? 'bg-gradient text-white shadow-lg shadow-indigo/30'
                : 'glass text-muted hover:text-ink'
            }`}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {t.label}
          </button>
        )
      })}
    </div>
  )

  const optionPickers = task.options?.length ? (
    <div className="mb-2 flex flex-wrap items-center gap-2">
      {task.options.map((o) => (
        <label key={o.name} className="flex items-center gap-1.5 text-xs text-muted">
          {o.label}
          <select
            value={options[o.name] ?? o.choices[0]}
            onChange={(e) => setOptions((prev) => ({ ...prev, [o.name]: e.target.value }))}
            className="field rounded-lg px-2 py-1.5 text-xs font-semibold"
          >
            {o.choices.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  ) : null

  return (
    <>
      <div className="border-b border-line bg-bg/40 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-3xl px-4 py-3 sm:px-6">{tabs}</div>
      </div>
      <ChatPanel
        conversationId={id}
        mode={mode}
        task={task.id}
        options={options}
        placeholder={task.placeholder}
        draft={draft}
        toolbar={optionPickers}
        emptyState={
          <EmptyState
            title={
              <>
                {title.split(' ')[0]} <span className="text-gradient">{title.split(' ').slice(1).join(' ')}</span>
              </>
            }
            subtitle={`${tagline} ${task.description}`}
            suggestions={suggestions[task.id] ?? []}
            onPick={(text) => setDraft({ text, nonce: Date.now() })}
          />
        }
      />
    </>
  )
}
