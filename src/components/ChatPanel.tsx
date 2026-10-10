import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AlertTriangle, ArrowUp, Check, Copy, RotateCcw, Square, User } from 'lucide-react'
import { Streamdown } from 'streamdown'

import { LogoMark } from './Logo'
import { messageText, useAIChat } from '@/lib/ai-hook'
import { MAX_MESSAGE_CHARS } from '@/lib/assistant-modes'
import type { Mode } from '@/lib/assistant-modes'
import { titleFrom, useConversations } from '@/lib/conversations'

interface ChatPanelProps {
  conversationId: string
  mode: Mode
  task?: string
  options?: Record<string, string>
  placeholder: string
  emptyState: ReactNode
  /** Rendered just above the composer (e.g. task options). */
  toolbar?: ReactNode
  /** Text to place in the composer (e.g. clicked suggestion). */
  draft?: { text: string; nonce: number }
}

export function ChatPanel({
  conversationId,
  mode,
  task,
  options,
  placeholder,
  emptyState,
  toolbar,
  draft,
}: ChatPanelProps) {
  const store = useConversations()
  const existing = store.get(conversationId)
  const { messages, sendMessage, isLoading, stop, reload, error } = useAIChat({
    id: conversationId,
    mode,
    task,
    options,
    initialMessages: existing?.messages,
  })

  // Persist into conversation history whenever a turn settles.
  useEffect(() => {
    if (isLoading || messages.length === 0 || messages === existing?.messages) return
    const firstUser = messages.find((m) => m.role === 'user')
    store.upsert({
      id: conversationId,
      mode,
      task,
      options,
      title: titleFrom(firstUser ? messageText(firstUser) : ''),
      messages,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isLoading])

  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading])

  const last = messages[messages.length - 1]
  const waitingForFirstToken =
    isLoading && (!last || last.role === 'user' || messageText(last).length === 0)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
          {messages.length === 0 ? (
            emptyState
          ) : (
            <ol className="space-y-6" aria-live="polite">
              {messages.map((m, i) => {
                const text = messageText(m)
                if (m.role === 'assistant' && !text) return null
                const isLastAssistant = m.role === 'assistant' && i === messages.length - 1
                return (
                  <li key={m.id} className="animate-rise">
                    {m.role === 'user' ? (
                      <UserBubble text={text} />
                    ) : (
                      <AssistantBubble
                        text={text}
                        streaming={isLoading && isLastAssistant}
                        onRegenerate={isLastAssistant && !isLoading ? () => reload() : undefined}
                      />
                    )}
                  </li>
                )
              })}
              {waitingForFirstToken && (
                <li className="flex items-center gap-3 animate-rise">
                  <LogoMark className="h-8 w-8 shrink-0" />
                  <span className="glass flex gap-1.5 rounded-2xl px-4 py-3" aria-label="Infiora is thinking">
                    <span className="typing-dot h-2 w-2 rounded-full bg-violet" />
                    <span className="typing-dot h-2 w-2 rounded-full bg-indigo" />
                    <span className="typing-dot h-2 w-2 rounded-full bg-sky" />
                  </span>
                </li>
              )}
            </ol>
          )}

          {error && !isLoading && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
              <div className="flex-1">
                <p className="font-semibold">Infiora couldn’t answer</p>
                <p className="mt-0.5 text-muted">{error.message}</p>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={() => reload()}
                  className="rounded-lg border border-line-strong px-3 py-1.5 text-xs font-semibold hover:bg-panel"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Composer
        placeholder={placeholder}
        isLoading={isLoading}
        onSend={(text) => sendMessage(text)}
        onStop={stop}
        toolbar={toolbar}
        draft={draft}
      />
    </div>
  )
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end gap-3">
      <div className="bg-gradient max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-md px-4 py-3 text-[0.95rem] text-white shadow-lg shadow-indigo/20">
        {text}
      </div>
      <span className="hidden h-8 w-8 shrink-0 place-items-center rounded-xl border border-line bg-panel-solid sm:grid">
        <User className="h-4 w-4 text-muted" />
      </span>
    </div>
  )
}

function AssistantBubble({
  text,
  streaming,
  onRegenerate,
}: {
  text: string
  streaming: boolean
  onRegenerate?: () => void
}) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // clipboard blocked – silently ignore
    }
  }

  return (
    <div className="group flex gap-3">
      <LogoMark className="h-8 w-8 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="glass rounded-2xl rounded-tl-md px-4 py-3 sm:px-5 sm:py-4">
          <div className="answer min-w-0 break-words">
            <Streamdown>{text}</Streamdown>
          </div>
        </div>
        {!streaming && (
          <div className="mt-1.5 flex items-center gap-1 text-xs text-faint">
            <IconAction onClick={copy} label={copied ? 'Copied' : 'Copy'}>
              {copied ? <Check className="h-3.5 w-3.5 text-ok" /> : <Copy className="h-3.5 w-3.5" />}
            </IconAction>
            {onRegenerate && (
              <IconAction onClick={onRegenerate} label="Regenerate">
                <RotateCcw className="h-3.5 w-3.5" />
              </IconAction>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function IconAction({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 transition hover:bg-panel hover:text-ink"
    >
      {children}
      {label}
    </button>
  )
}

function Composer({
  placeholder,
  isLoading,
  onSend,
  onStop,
  toolbar,
  draft,
}: {
  placeholder: string
  isLoading: boolean
  onSend: (text: string) => void
  onStop: () => void
  toolbar?: ReactNode
  draft?: { text: string; nonce: number }
}) {
  const [input, setInput] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!draft) return
    setInput(draft.text)
    ref.current?.focus()
  }, [draft?.nonce])

  // Auto-grow up to ~8 lines.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`
  }, [input])

  const trimmed = input.trim()
  const tooLong = input.length > MAX_MESSAGE_CHARS
  const canSend = trimmed.length > 0 && !tooLong && !isLoading

  const submit = () => {
    if (!canSend) return
    onSend(trimmed)
    setInput('')
  }

  return (
    <div className="relative z-10 border-t border-line bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-3xl px-3 pb-3 pt-3 sm:px-6">
        {toolbar}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
          className="ring-gradient glass flex items-end gap-2 rounded-2xl p-2"
        >
          <textarea
            ref={ref}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault()
                submit()
              }
            }}
            placeholder={placeholder}
            aria-label="Message Infiora"
            className="max-h-[220px] min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[0.95rem] text-ink placeholder:text-faint focus:outline-none"
          />
          {isLoading ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop generating"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line-strong bg-panel-solid transition hover:border-violet"
            >
              <Square className="h-4 w-4 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Send message"
              className="btn-primary grid h-11 w-11 shrink-0 place-items-center rounded-xl disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          )}
        </form>
        <div className="mt-1.5 flex justify-between px-1 text-[0.7rem] text-faint">
          <span className="hidden sm:inline">Enter to send · Shift + Enter for a new line</span>
          <span className={tooLong ? 'font-semibold text-danger' : ''}>
            {input.length > MAX_MESSAGE_CHARS * 0.8 &&
              `${input.length.toLocaleString()} / ${MAX_MESSAGE_CHARS.toLocaleString()}`}
          </span>
        </div>
      </div>
    </div>
  )
}
