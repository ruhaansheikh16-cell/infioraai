import type { ReactNode } from 'react'

import { LogoMark } from './Logo'

export function EmptyState({
  title,
  subtitle,
  suggestions,
  onPick,
  children,
}: {
  title: ReactNode
  subtitle: string
  suggestions: Array<{ title: string; prompt: string }>
  onPick: (prompt: string) => void
  children?: ReactNode
}) {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center py-6 text-center">
      <div className="animate-rise relative">
        <div className="bg-gradient absolute inset-0 -z-10 scale-150 rounded-full opacity-30 blur-2xl" />
        <LogoMark className="h-16 w-16" />
      </div>
      <h1 className="animate-rise font-display mt-6 text-2xl font-semibold tracking-tight sm:text-3xl [animation-delay:80ms]">
        {title}
      </h1>
      <p className="animate-rise mt-2 max-w-md text-sm text-muted sm:text-base [animation-delay:140ms]">
        {subtitle}
      </p>
      {children}
      <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
        {suggestions.map((s, i) => (
          <button
            key={s.title}
            onClick={() => onPick(s.prompt)}
            style={{ animationDelay: `${200 + i * 60}ms` }}
            className="animate-rise glass group rounded-2xl p-4 text-left transition hover:-translate-y-0.5 hover:border-violet/50"
          >
            <p className="text-sm font-semibold">{s.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-muted group-hover:text-ink">{s.prompt}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
