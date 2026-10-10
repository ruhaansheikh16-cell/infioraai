import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { History, Menu, Moon, Plus, Sun, Trash2, X } from 'lucide-react'

import { Logo } from './Logo'
import { NAV_ITEMS, ROUTE_FOR_MODE } from '@/lib/nav'
import { newConversationId, useConversations } from '@/lib/conversations'
import { useTheme } from '@/lib/theme'

export function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { theme, toggle } = useTheme()

  return (
    <div className="relative flex h-[100dvh] overflow-hidden">
      <div className="aurora" />

      {/* Desktop / tablet-landscape sidebar */}
      <aside className="glass relative z-20 hidden w-72 shrink-0 flex-col border-y-0 border-l-0 lg:flex">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="glass animate-rise absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col bg-panel-solid">
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 rounded-lg p-2 text-muted hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-line bg-bg/70 px-3 py-2.5 backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu and history"
            className="rounded-lg p-2 text-muted hover:text-ink"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/">
            <Logo />
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="rounded-lg p-2 text-muted hover:text-ink"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </header>

        <main className="flex min-h-0 flex-1 flex-col">{children}</main>

        {/* Mobile bottom tabs */}
        <nav
          aria-label="Primary"
          className="safe-bottom grid grid-cols-5 border-t border-line bg-bg/85 backdrop-blur-xl lg:hidden"
        >
          {NAV_ITEMS.map(({ to, short, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-1 py-2.5 text-[0.68rem] font-semibold text-faint transition"
              activeProps={{ className: '!text-ink' }}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`grid h-7 w-12 place-items-center rounded-full transition ${isActive ? 'bg-gradient text-white shadow-lg shadow-indigo/30' : ''}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  {short}
                </>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate()
  const { conversations, remove } = useConversations()
  const { theme, toggle } = useTheme()

  return (
    <div className="flex h-full flex-col p-4">
      <Link to="/" onClick={onNavigate} className="px-2 py-1">
        <Logo />
      </Link>

      <button
        onClick={() => {
          navigate({ to: '/chat', search: { c: newConversationId() } })
          onNavigate?.()
        }}
        className="btn-primary mt-6 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
      >
        <Plus className="h-4 w-4" /> New chat
      </button>

      <nav className="mt-6 space-y-1" aria-label="Sections">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-panel hover:text-ink"
            activeProps={{ className: '!bg-indigo/15 !text-ink ring-1 ring-inset ring-violet/30' }}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-7 flex items-center gap-2 px-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-faint">
        <History className="h-3.5 w-3.5" /> Recent
      </div>
      <div className="mt-2 min-h-0 flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <p className="px-3 py-2 text-xs leading-relaxed text-faint">
            Your conversations from this visit appear here.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {conversations.map((c) => (
              <li key={c.id} className="group flex items-center">
                <Link
                  to={ROUTE_FOR_MODE[c.mode]}
                  search={{ c: c.id }}
                  onClick={onNavigate}
                  className="min-w-0 flex-1 truncate rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-panel hover:text-ink"
                  activeOptions={{ includeSearch: true }}
                  activeProps={{ className: '!bg-panel !text-ink' }}
                >
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gradient align-middle" />
                  {c.title}
                </Link>
                <button
                  onClick={() => remove(c.id)}
                  aria-label={`Delete “${c.title}”`}
                  className="rounded-md p-1.5 text-faint opacity-100 transition hover:text-danger lg:opacity-0 lg:group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-line px-3 py-2.5">
        <div className="text-xs">
          <p className="font-semibold">Guest</p>
          <p className="text-faint">Accounts coming soon</p>
        </div>
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="rounded-lg border border-line p-2 text-muted transition hover:border-violet hover:text-ink"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
