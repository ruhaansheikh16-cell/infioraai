# Infiora AI

**Your Ideas. Your Intelligence.**

Infiora AI is an all-in-one AI assistant for the web (and, later, Android). It
combines a general AI chat, a Study Assistant and a Writing Assistant in one
premium, mobile-friendly interface. Every answer is generated live by a real AI
model — nothing is pre-written or simulated.

## What works today

| Screen | Route | Status |
| --- | --- | --- |
| Landing page | `/` | ✅ Live |
| AI Chat — streaming answers, copy, regenerate, stop, retry | `/chat` | ✅ Live AI |
| Study Assistant — explain, revision notes, quizzes, step-by-step solutions | `/study` | ✅ Live AI |
| Writing Assistant — essays, emails, grammar fix, translation | `/write` | ✅ Live AI |
| Settings — light/dark theme, clear history | `/settings` | ✅ Working |
| Conversation history (sidebar / mobile menu) | — | ✅ For the current browser tab |
| Smart Search with web sources | `/search` | 🔜 UI ready, search provider not connected yet |
| User accounts & saved conversations | — | 🔜 Planned (see `PLAN.md`) |

## Tech stack

- **TanStack Start** (React 19, file-based routing, server routes) on **Vite 7**
- **Tailwind CSS 4** with a custom design system (`src/styles.css`)
- **TanStack AI** for streaming chat (Anthropic Claude → OpenAI → Gemini fallback)
- **Netlify** hosting, with **Netlify AI Gateway** providing the AI keys automatically
- **Zod** for request validation

## What needs API keys?

| Feature | Needs | Where it's set |
| --- | --- | --- |
| Chat / Study / Writing | An AI provider key | **On Netlify: nothing to do** — AI Gateway injects `ANTHROPIC_API_KEY` (and others) automatically after the first production deploy. Locally: put your own key in `.env`. |
| Smart Search | A web search API key (e.g. Tavily or Brave) | Not connected yet — Milestone 4 |

Keys are read only in `src/routes/api.chat.ts` on the server. They are never sent to the browser. Never commit `.env` (it's already in `.gitignore`).

## Run it locally (beginner friendly)

1. Install [Node.js 22+](https://nodejs.org) and pnpm: `npm install -g pnpm`
2. Install dependencies: `pnpm install`
3. Pick **one** way to get AI working locally:
   - **Easiest:** install the Netlify CLI (`npm install -g netlify-cli`), run
     `netlify link` to connect this folder to your Netlify project, then start with
     `netlify dev`. AI Gateway keys are provided for you.
   - **Or** create a file named `.env` in the project root with your own key, e.g.
     `ANTHROPIC_API_KEY=your-key-here` (or `OPENAI_API_KEY` / `GEMINI_API_KEY`), then run `pnpm dev`.
4. Open the URL printed in the terminal (`http://localhost:8888` with `netlify dev`,
   `http://localhost:3000` with `pnpm dev`).

If no key is available, the chat shows a clear "No AI provider is configured"
message instead of a fake answer.

## How to test it

1. **Chat:** open `/chat`, click a suggestion card or type a question, press Enter.
   You should see a typing indicator, then the answer streaming in.
   Try **Copy**, **Regenerate** and the **Stop** button while it's writing.
2. **History:** start a few chats, then use **New chat** — earlier chats appear under
   "Recent" in the sidebar (on phones: tap the ☰ menu). Click one to reopen it.
3. **Study:** open `/study`, choose *Quiz me*, set "Questions: 5", and enter a topic.
   The answer should end with an answer key.
4. **Writing:** open `/write`, choose *Translate*, pick a language and paste a sentence.
5. **Validation:** paste more than 8,000 characters — the send button disables and a
   counter turns red.
6. **Theme:** toggle light/dark from the sidebar, top bar or Settings; reload the page
   and the choice is remembered.
7. **Mobile:** open the site on your phone (or use your browser's device toolbar) —
   you should get a bottom tab bar and a slide-out menu.

## Project structure

```
src/
  routes/
    index.tsx           Landing page
    _app.tsx            App layout (sidebar, mobile nav, history provider)
    _app.chat.tsx       AI Chat
    _app.study.tsx      Study Assistant
    _app.write.tsx      Writing Assistant
    _app.search.tsx     Smart Search (UI)
    _app.settings.tsx   Settings
    api.chat.ts         Server route: validation + streaming AI
  components/           Logo, AppShell, ChatPanel, ToolWorkspace, EmptyState
  lib/                  Mode definitions, AI hook, history store, theme, nav
  server/prompts.ts     System prompts per tool (server-only)
public/                 favicon.svg, manifest.webmanifest
```

## Roadmap

See [`PLAN.md`](./PLAN.md). In short: user accounts → saved conversations in
Netlify Database → Smart Search with real cited sources → hardening → Android app.

### About Android / Google Play

The app is responsive and ships a web app manifest, which is the groundwork for an
Android build (Trusted Web Activity or Capacitor). **Infiora AI is not yet published
on Google Play** — the remaining steps (icons, signing, store listing, privacy policy,
review) are listed in Milestone 6 of `PLAN.md`.
