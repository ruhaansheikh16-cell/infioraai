import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ExternalLink, Globe, KeyRound, Search } from 'lucide-react'

export const Route = createFileRoute('/_app/search')({
  head: () => ({ meta: [{ title: 'Smart Search · Infiora AI' }] }),
  component: SearchPage,
})

function SearchPage() {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState<string>()

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="animate-rise text-center">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-muted">
            <Globe className="h-3.5 w-3.5 text-sky" /> Live web answers with sources
          </span>
          <h1 className="font-display mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Smart <span className="text-gradient">Search</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted sm:text-base">
            Ask a question and Infiora reads the web for you — a concise answer with every
            claim linked to a clickable source.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            const q = query.trim()
            if (q.length >= 2) setSubmitted(q)
          }}
          className="ring-gradient glass animate-rise mt-8 flex items-center gap-2 rounded-2xl p-2 [animation-delay:120ms]"
        >
          <Search className="ml-3 h-5 w-5 shrink-0 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={300}
            placeholder="e.g. Latest discoveries from the James Webb telescope"
            aria-label="Search the web"
            className="min-w-0 flex-1 bg-transparent px-2 py-3 text-[0.95rem] text-ink placeholder:text-faint focus:outline-none"
          />
          <button
            type="submit"
            disabled={query.trim().length < 2}
            className="btn-primary rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-40"
          >
            Search
          </button>
        </form>

        {submitted && (
          <div role="status" className="glass animate-rise mt-6 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo/15">
                <KeyRound className="h-4 w-4 text-violet" />
              </span>
              <div className="text-sm">
                <p className="font-semibold">Web search isn’t connected yet</p>
                <p className="mt-1 leading-relaxed text-muted">
                  Smart Search needs a live web search provider, which is the next feature on
                  the roadmap. Infiora never shows invented results, so nothing was searched for
                  “{submitted}”.
                </p>
                <Link
                  to="/chat"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-sky hover:underline"
                >
                  Ask Infiora Chat instead <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            ['Real results', 'Fresh pages fetched from a web search API at question time.'],
            ['Cited answers', 'Each sentence links back to the page it came from.'],
            ['Follow-ups', 'Keep digging with follow-up questions on the same sources.'],
          ].map(([t, d], i) => (
            <div
              key={t}
              style={{ animationDelay: `${200 + i * 70}ms` }}
              className="glass animate-rise rounded-2xl p-4"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
