import type { ReactNode } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  BookOpen,
  Globe,
  MessageSquare,
  Moon,
  PenLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  Zap,
} from 'lucide-react'

import { Logo, LogoMark } from '@/components/Logo'
import { useTheme } from '@/lib/theme'

export const Route = createFileRoute('/')({
  component: Landing,
})

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'AI Chat',
    to: '/chat',
    text: 'Live, streaming answers for anything on your mind. Copy any reply or regenerate it in one tap.',
    tag: 'Live',
  },
  {
    icon: BookOpen,
    title: 'Study Assistant',
    to: '/study',
    text: 'Explanations at your level, revision notes, practice quizzes and step-by-step solutions.',
    tag: 'Live',
  },
  {
    icon: PenLine,
    title: 'Writing Assistant',
    to: '/write',
    text: 'Essays, emails, grammar fixes and natural translation into 10 languages.',
    tag: 'Live',
  },
  {
    icon: Globe,
    title: 'Smart Search',
    to: '/search',
    text: 'Answers from the live web, with every claim linked to a clickable source.',
    tag: 'Next up',
  },
] as const

function Landing() {
  const { theme, toggle } = useTheme()

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden">
      <div className="aurora" />
      <div className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[900px] opacity-60" />

      {/* Nav */}
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          <a href="#features" className="hover:text-ink">Features</a>
          <a href="#how" className="hover:text-ink">How it works</a>
          <a href="#trust" className="hover:text-ink">Trust</a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="glass rounded-xl p-2.5 text-muted transition hover:text-ink"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            to="/chat"
            className="btn-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            Open app
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16">
        <div>
          <span className="glass animate-rise inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-muted">
            <Sparkles className="h-3.5 w-3.5 text-violet" />
            Your all-in-one AI assistant
          </span>
          <h1 className="font-display animate-rise mt-6 text-[2.6rem] font-bold leading-[1.05] tracking-tight [animation-delay:80ms] sm:text-6xl lg:text-7xl">
            Your Ideas.
            <br />
            <span className="text-gradient">Your Intelligence.</span>
          </h1>
          <p className="animate-rise mt-6 max-w-xl text-base leading-relaxed text-muted [animation-delay:160ms] sm:text-lg">
            Infiora AI brings chat, study help and writing tools together in one beautiful
            assistant — on your phone, tablet or computer.
          </p>
          <div className="animate-rise mt-9 flex flex-wrap gap-3 [animation-delay:240ms]">
            <Link
              to="/chat"
              className="btn-primary group inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold sm:text-base"
            >
              Start chatting
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/study"
              className="glass inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold transition hover:border-violet/50 sm:text-base"
            >
              <BookOpen className="h-4 w-4 text-sky" /> Try Study Assistant
            </Link>
          </div>
          <p className="animate-rise mt-6 text-xs text-faint [animation-delay:320ms]">
            Free to try · No sign-up needed
          </p>
        </div>

        <HeroOrb />
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Features"
          title={<>One assistant. <span className="text-gradient">Every task.</span></>}
          text="Pick a workspace built for what you’re doing — each one is tuned with its own instructions for better answers."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, to, text, tag }) => (
            <Link
              key={title}
              to={to}
              className="glass group relative overflow-hidden rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-violet/50 sm:p-8"
            >
              <div className="bg-gradient absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition duration-500 group-hover:opacity-30" />
              <div className="flex items-start justify-between">
                <span className="bg-gradient grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg shadow-indigo/30">
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider ${
                    tag === 'Live' ? 'bg-ok/15 text-ok' : 'bg-sky/15 text-sky'
                  }`}
                >
                  {tag}
                </span>
              </div>
              <h3 className="font-display mt-6 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-sky">
                Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="How it works"
          title={<>From question to <span className="text-gradient">clarity</span></>}
          text="No setup, no learning curve. Just ask."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            ['Choose a workspace', 'Chat freely, or pick a Study or Writing tool like “Quiz me” or “Email”.'],
            ['Ask in your words', 'Type a question, paste your notes or drop in a draft. Any language works.'],
            ['Refine together', 'Follow up, regenerate, or copy the answer straight into your work.'],
          ].map(([t, d], i) => (
            <li key={t} className="glass rounded-3xl p-6">
              <span className="font-display text-gradient text-4xl font-bold">0{i + 1}</span>
              <h3 className="mt-4 text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Trust */}
      <section id="trust" className="relative z-10 mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="glass ring-gradient relative overflow-hidden rounded-[2rem] p-8 sm:p-12">
          <div className="bg-gradient absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-20 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-3">
            <TrustPoint icon={<Zap className="h-5 w-5" />} title="Real AI, streamed live">
              Every answer is generated by a leading AI model the moment you ask — nothing is
              canned or pre-written.
            </TrustPoint>
            <TrustPoint icon={<ShieldCheck className="h-5 w-5" />} title="Keys stay on the server">
              AI credentials live only in secure server environment variables and never reach
              your browser.
            </TrustPoint>
            <TrustPoint icon={<Smartphone className="h-5 w-5" />} title="Made for every screen">
              A fluid layout with thumb-friendly navigation on phones, and a full workspace on
              desktop.
            </TrustPoint>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-24 pt-10 text-center sm:px-8">
        <LogoMark className="mx-auto h-14 w-14" />
        <h2 className="font-display mt-6 text-3xl font-semibold tracking-tight sm:text-5xl">
          Think bigger with <span className="text-gradient">Infiora</span>.
        </h2>
        <Link
          to="/chat"
          className="btn-primary mt-8 inline-flex items-center gap-2 rounded-2xl px-7 py-4 font-semibold"
        >
          Launch Infiora AI <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <footer className="relative z-10 border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-xs text-faint sm:flex-row sm:px-8">
          <Logo />
          <p>© {new Date().getFullYear()} Infiora AI · Your Ideas. Your Intelligence.</p>
        </div>
      </footer>
    </div>
  )
}

function HeroOrb() {
  const chips = [
    { icon: MessageSquare, label: 'Chat', pos: 'left-0 top-10' },
    { icon: BookOpen, label: 'Study', pos: 'right-0 top-24' },
    { icon: PenLine, label: 'Write', pos: 'left-6 bottom-16' },
    { icon: Globe, label: 'Search', pos: 'right-8 bottom-6' },
  ]
  return (
    <div className="animate-rise relative mx-auto aspect-square w-full max-w-[440px] [animation-delay:200ms]">
      <div className="bg-gradient absolute inset-[18%] rounded-full opacity-40 blur-3xl" />
      <div className="animate-orbit absolute inset-[6%] rounded-full border border-dashed border-line-strong" />
      <div
        className="animate-orbit absolute inset-[20%] rounded-full border border-line-strong"
        style={{ animationDirection: 'reverse', animationDuration: '20s' }}
      >
        <span className="bg-sky absolute -top-1.5 left-1/2 h-3 w-3 rounded-full shadow-[0_0_20px_#38bdf8]" />
      </div>
      <div className="glass glow absolute inset-[32%] grid place-items-center rounded-[2rem]">
        <LogoMark className="h-[62%] w-[62%]" />
      </div>
      {chips.map(({ icon: Icon, label, pos }) => (
        <span
          key={label}
          className={`glass absolute ${pos} inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-semibold shadow-xl sm:text-sm`}
        >
          <Icon className="h-4 w-4 text-violet" /> {label}
        </span>
      ))}
    </div>
  )
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: ReactNode; text: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet">{eyebrow}</p>
      <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-4 text-muted">{text}</p>
    </div>
  )
}

function TrustPoint({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div>
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo/15 text-violet">{icon}</span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{children}</p>
    </div>
  )
}
