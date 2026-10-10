import type { ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Check, Moon, ShieldCheck, Smartphone, Sun, Trash2, UserRound } from 'lucide-react'

import { useConversations } from '@/lib/conversations'
import { useTheme } from '@/lib/theme'
import type { Theme } from '@/lib/theme'

export const Route = createFileRoute('/_app/settings')({
  head: () => ({ meta: [{ title: 'Settings · Infiora AI' }] }),
  component: SettingsPage,
})

function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { conversations, remove } = useConversations()

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-2xl space-y-5 px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="font-display animate-rise text-2xl font-semibold tracking-tight sm:text-3xl">
          Settings
        </h1>

        <Section icon={<UserRound className="h-4 w-4" />} title="Account">
          <p className="text-sm text-muted">
            You’re using Infiora as a guest. Sign-in with email is the next milestone — once it
            ships, your conversations and preferences sync across your phone, tablet and computer.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button disabled className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold opacity-50">
              Create account
            </button>
            <button disabled className="rounded-xl border border-line px-4 py-2 text-sm font-semibold opacity-50">
              Sign in
            </button>
            <span className="self-center text-xs text-faint">Coming soon</span>
          </div>
        </Section>

        <Section icon={theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} title="Appearance">
          <div className="grid grid-cols-2 gap-3">
            {(['dark', 'light'] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                aria-pressed={theme === t}
                className={`relative overflow-hidden rounded-2xl border p-3 text-left transition ${
                  theme === t ? 'border-violet ring-2 ring-violet/30' : 'border-line hover:border-line-strong'
                }`}
              >
                <div
                  className={`h-16 rounded-xl ${
                    t === 'dark'
                      ? 'bg-[linear-gradient(135deg,#070b1f,#1e1b4b)]'
                      : 'bg-[linear-gradient(135deg,#f4f5ff,#e0e7ff)]'
                  }`}
                >
                  <div className="bg-gradient ml-3 mt-3 inline-block h-2 w-10 rounded-full" />
                </div>
                <p className="mt-2 flex items-center justify-between text-sm font-semibold capitalize">
                  {t}
                  {theme === t && <Check className="h-4 w-4 text-violet" />}
                </p>
              </button>
            ))}
          </div>
        </Section>

        <Section icon={<Trash2 className="h-4 w-4" />} title="Conversations">
          <p className="text-sm text-muted">
            {conversations.length === 0
              ? 'No conversations yet in this visit.'
              : `${conversations.length} conversation${conversations.length === 1 ? '' : 's'} in this visit.`}{' '}
            History is kept until you close the tab; saving to your account arrives with sign-in.
          </p>
          <button
            disabled={conversations.length === 0}
            onClick={() => {
              if (confirm('Delete all conversations from this visit?')) {
                conversations.forEach((c) => remove(c.id))
              }
            }}
            className="mt-4 rounded-xl border border-danger/40 px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger/10 disabled:opacity-40"
          >
            Clear history
          </button>
        </Section>

        <Section icon={<ShieldCheck className="h-4 w-4" />} title="Privacy & AI">
          <ul className="space-y-2 text-sm text-muted">
            <li>• Answers are generated live by an AI model on Infiora’s server — never pre-written.</li>
            <li>• AI provider keys are stored only as server environment variables, never in your browser.</li>
            <li>• AI can make mistakes. Double-check important facts.</li>
          </ul>
        </Section>

        <Section icon={<Smartphone className="h-4 w-4" />} title="Mobile app">
          <p className="text-sm text-muted">
            Infiora is built mobile-first and is being prepared for an Android app. It isn’t on
            Google Play yet.
          </p>
        </Section>

        <p className="pb-4 text-center text-xs text-faint">Infiora AI · v0.1.0 · Your Ideas. Your Intelligence.</p>
      </div>
    </div>
  )
}

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="glass animate-rise rounded-2xl p-5 sm:p-6">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-muted">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo/15 text-violet">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  )
}
