import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import type { Mode } from './assistant-modes'
import type { ChatMessages } from './ai-hook'

export interface Conversation {
  id: string
  mode: Mode
  task?: string
  options?: Record<string, string>
  title: string
  messages: ChatMessages
  updatedAt: number
}

interface ConversationStore {
  conversations: Conversation[]
  get: (id: string) => Conversation | undefined
  upsert: (c: Omit<Conversation, 'updatedAt'>) => void
  remove: (id: string) => void
  rename: (id: string, title: string) => void
}

const Ctx = createContext<ConversationStore | null>(null)

/**
 * Conversation history for the current browser session.
 * Milestone 2 (see PLAN.md) swaps this provider's internals for the
 * Netlify Database-backed API so history is saved to the user's account.
 */
export function ConversationsProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])

  const upsert = useCallback((c: Omit<Conversation, 'updatedAt'>) => {
    setConversations((prev) => {
      const existing = prev.find((p) => p.id === c.id)
      const next = { ...c, title: existing?.title ?? c.title, updatedAt: Date.now() }
      return [next, ...prev.filter((p) => p.id !== c.id)]
    })
  }, [])

  const remove = useCallback(
    (id: string) => setConversations((prev) => prev.filter((p) => p.id !== id)),
    [],
  )

  const rename = useCallback(
    (id: string, title: string) =>
      setConversations((prev) => prev.map((p) => (p.id === id ? { ...p, title } : p))),
    [],
  )

  const value = useMemo<ConversationStore>(
    () => ({
      conversations,
      get: (id) => conversations.find((c) => c.id === id),
      upsert,
      remove,
      rename,
    }),
    [conversations, upsert, remove, rename],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useConversations() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useConversations must be used inside ConversationsProvider')
  return ctx
}

export function newConversationId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `c_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

export function titleFrom(text: string) {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length > 48 ? `${clean.slice(0, 48)}…` : clean || 'New conversation'
}
