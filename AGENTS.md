# AGENTS.md

Guide for AI agents and developers working on **Infiora AI** ("Your Ideas. Your Intelligence.").

**Start here:** read `PLAN.md`. Milestone 1 is done; continue with the next unchecked
milestone. Keep each milestone small and deployable.

## Product rules (non-negotiable)
- Never fake AI output or search results. If a provider is missing or fails, show an
  honest error/empty state.
- API keys are read only in server code (`src/routes/api.*.ts`, `src/server/*`). Never
  expose them to the client or log them.
- Do not claim the Android app is published on Google Play until it actually is.

## Stack
TanStack Start (React 19, TanStack Router file routes, server routes) · Vite 7 ·
Tailwind CSS 4 · TanStack AI (`@tanstack/ai`, `@tanstack/ai-react`) · Zod · Netlify
(AI Gateway injects `ANTHROPIC_API_KEY`/`OPENAI_API_KEY`/`GEMINI_API_KEY` at runtime).

## Architecture
- `src/routes/index.tsx` — marketing landing page.
- `src/routes/_app.tsx` — pathless layout for the app screens. Wraps them in
  `ConversationsProvider` and `AppShell` (desktop sidebar, mobile drawer + bottom tabs).
- `src/routes/_app.{chat,study,write,search,settings}.tsx` — screens. Chat/Study/Write
  take `?c=<conversationId>` (and `?task=` for Study/Write) search params.
- `src/routes/api.chat.ts` — the only AI endpoint. Validates the body with Zod
  (`messages`, `data: { mode, task, options }`), enforces length limits, picks the first
  configured provider (Anthropic `claude-sonnet-4-6` → OpenAI `gpt-4o` → Gemini
  `gemini-2.5-flash`), and streams SSE. Returns JSON `{ error, message }` on failure.
- `src/server/prompts.ts` — server-only system prompts keyed by `mode:task`.
- `src/lib/assistant-modes.ts` — shared IDs/labels/options for Study and Writing tasks.
  To add a tool: add a task here, a prompt in `prompts.ts`, an icon + suggestions in the route.
- `src/lib/ai-hook.ts` — `useAIChat` wraps `useChat`; a custom `fetchClient` turns server
  JSON errors into readable `Error` messages. Mode/task/options are sent as `body` → `data`.
- `src/components/ChatPanel.tsx` — message list, copy/regenerate/stop/retry, composer.
  Always render with `key={conversationId}` (useChat keeps old messages if only `id` changes).
- `src/components/ToolWorkspace.tsx` — task tabs + option pickers around `ChatPanel`.
- `src/lib/conversations.tsx` — **in-memory, per-tab** history store. Milestone 3 replaces
  its internals with Netlify Database-backed API calls; keep its interface stable.
- `src/lib/theme.ts` — theme store (`html.light` class + localStorage). An inline script in
  `__root.tsx` applies it before paint.

## Styling conventions
- Theme tokens are CSS variables in `src/styles.css`, exposed to Tailwind via `@theme inline`
  (`bg-bg`, `bg-panel`, `text-ink`, `text-muted`, `text-faint`, `border-line`, `text-violet`,
  `text-sky`…). Use these instead of raw colors so light/dark both work.
- Helper classes: `glass`, `ring-gradient`, `btn-primary`, `field`, `text-gradient`,
  `bg-gradient`, `animate-rise`, `animate-orbit`, `answer` (Markdown output).
- Fonts: Unbounded (`font-display`) for headings, Manrope (`font-sans`) for UI.
- Mobile-first; the sidebar appears at `lg`, bottom tabs below it.

## Conventions
- Components PascalCase, hooks/utils camelCase, `@/` alias for `src/`.
- Validate every server input with Zod; return friendly messages.
- Use Netlify primitives for persistence (Netlify Database via Drizzle, Netlify Identity
  for auth) — see the skills in `.agents/skills` and the global Netlify skills.

## Commands
`pnpm dev` (Vite on :3000) · `netlify dev` (with AI Gateway + Netlify emulation) · `pnpm build`
